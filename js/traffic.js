/* ===== traffic.js: yol ağı, araçlar, trafik ışıkları, yayalar ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene, N = C.N, TOTAL = C.TOTAL;
C.density = 0.5; C.carLayers = []; C.peopleLayers = []; C.signalLayers = [];
const MAXPER = 2;                                    // kenar başına en fazla araç

/* ---------- yol ağı: kavşak düğümleri ve aralarındaki sağdan akan yönlü şeritler ----------
   Bir kenar, kavşağın çıkışından bir sonraki kavşağın durma çizgisine kadar gider.
   Kavşağın içi iki kenarı bağlayan ikinci derece Bezier eğrisidir; düz geçişte doğru parçası. */
const NN = N + 1, END = C.ROAD / 2 + 3.2, EDGE_LEN = C.PITCH - 2 * END;
const nodeId = (i, j) => i * NN + j;
const edges = [], outOf = [], edgeAt = new Map();
for (let k = 0; k < NN * NN; k++) outOf.push([]);
for (let i = 0; i < NN; i++) for (let j = 0; j < NN; j++) {
  for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const ii = i + dx, jj = j + dz;
    if (ii < 0 || jj < 0 || ii >= NN || jj >= NN) continue;
    const a = nodeId(i, j), b = nodeId(ii, jj), rx = -dz, rz = dx;
    const e = {
      id: edges.length, a, b, bi: ii, bj: jj, dx, dz, axis: dx ? 'x' : 'z', len: EDGE_LEN, cars: [],
      ox: C.roadX(i) + dx * END + rx * C.LANE, oz: C.roadX(j) + dz * END + rz * C.LANE
    };
    edges.push(e); outOf[a].push(e); edgeAt.set(a * 4096 + b, e);
  }
}

function bez(t, u, o) {
  const a = 1 - u;
  o.x = a * a * t.p0x + 2 * a * u * t.p1x + u * u * t.p2x;
  o.z = a * a * t.p0z + 2 * a * u * t.p1z + u * u * t.p2z;
  o.hx = a * (t.p1x - t.p0x) + u * (t.p2x - t.p1x);
  o.hz = a * (t.p1z - t.p0z) + u * (t.p2z - t.p1z);
  return o;
}
const turns = new Map(), tmp = { x: 0, z: 0, hx: 1, hz: 0 };
function turnOf(e, f) {
  const key = e.id * 4096 + f.id;
  let t = turns.get(key); if (t) return t;
  const p0x = e.ox + e.dx * e.len, p0z = e.oz + e.dz * e.len, p2x = f.ox, p2z = f.oz;
  const cross = e.dx * f.dz - e.dz * f.dx;
  let p1x = (p0x + p2x) / 2, p1z = (p0z + p2z) / 2;
  if (cross !== 0) { if (e.dx) { p1x = p2x; p1z = p0z; } else { p1x = p0x; p1z = p2z; } }
  t = { p0x, p0z, p1x, p1z, p2x, p2z, kind: cross === 0 ? 's' : cross > 0 ? 'r' : 'l', len: 0 };
  let px = p0x, pz = p0z;
  for (let k = 1; k <= 12; k++) { bez(t, k / 12, tmp); t.len += Math.hypot(tmp.x - px, tmp.z - pz); px = tmp.x; pz = tmp.z; }
  turns.set(key, t); return t;
}

/* sonraki kenar: rotası olan araç (acil durum araçları) rotayı izler, diğerleri çoğunlukla düz gider;
   geri dönüş yok (ızgarada her kavşakta başka çıkış var) */
const nexts = e => outOf[e.b].filter(f => f.dx !== -e.dx || f.dz !== -e.dz);
function chooseNext(car, e) {
  if (car.path && car.path.length) return car.path.shift();
  let opts = nexts(e); const open = opts.filter(f => !f.blocked); if (open.length) opts = open;
  const r = Math.random(), want = r < 0.6 ? 's' : r < 0.82 ? 'r' : 'l';
  return opts.find(f => turnOf(e, f).kind === want) || opts[(Math.random() * opts.length) | 0];
}
/* kenar grafiğinde genişlik öncelikli arama: from kenarından goal kenarına, ilki hariç kenar listesi */
function route(from, s0, goal, s1) {
  if (from === goal && s0 < s1) return [];
  const prev = new Map(), q = [];
  const ok = f => !f.blocked || f === goal;                 // kapalı şeritten yalnızca hedefse geçilir
  for (const f of nexts(from)) if (ok(f)) { prev.set(f, from); q.push(f); }
  for (let k = 0; k < q.length && !prev.has(goal); k++) for (const f of nexts(q[k])) if (ok(f) && !prev.has(f)) { prev.set(f, q[k]); q.push(f); }
  if (!prev.has(goal)) return [];
  const path = []; let e = goal;
  do { path.unshift(e); e = prev.get(e); } while (e !== from);
  return path;
}
const RES = 24;                                       // şehir dışına çıkıp girenler için yedek araç havuzu
const MAXC = edges.length * MAXPER + RES, cars = [], reserve = [];
C.roads = { edges, outOf, edgeAt, nodeId, NN, turnOf };
C.cars = cars;

/* ---------- özel araçlar (events.js): kendi modeli, rotası ve durma noktası olan araçlar ----------
   car.special: yoğunluk değişince silinmez · car.model(x, z, ry): kendini yerleştirir
   car.siren: kırmızıda geçer, sola dönerken beklemez · car.parked: şeritten çıkmış, güncellenmez */
C.spawnCar = function (car, e, s) {
  Object.assign(car, { e, s, v: car.v || 0, tin: null, path: [], parked: false });
  car.next = chooseNext(car, e); e.cars.push(car); cars.push(car);
};
C.despawnCar = function (car) {
  const i = car.e.cars.indexOf(car); if (i >= 0) car.e.cars.splice(i, 1);
  const j = cars.indexOf(car); if (j >= 0) cars.splice(j, 1);
};
C.parkCar = function (car) { const i = car.e.cars.indexOf(car); if (i >= 0) car.e.cars.splice(i, 1); car.parked = true; car.v = 0; };
C.unparkCar = function (car) { car.parked = false; car.e.cars.push(car); };
/* kaza gibi durumlarda şeridi kapat: normal araçlar girmez, rotası buradan geçen özel araçlar yeniden rota bulur */
C.blockEdge = function (e, on) {
  e.blocked = on; if (!on) return;
  for (const c of cars) {
    if (c.parked || c.e === e) continue;
    if (c.special) { if (c.stopEdge !== e && (c.next === e || c.path.includes(e))) C.setRoute(c, c.stopEdge, c.stopS); }
    else if (c.next === e && c.s >= 0) c.next = chooseNext(c, c.e);
  }
};
C.setRoute = function (car, goal, s) {
  car.stopEdge = goal; car.stopS = s; car.path = route(car.e, car.s, goal, s);
  car.next = car.path.length ? car.path.shift() : chooseNext(car, car.e);
};

/* ---------- araç parçaları: aynı örnek matrisini paylaşır ---------- */
const mk = (g, ox, oy, oz) => { g.translate(ox, oy, oz); return g; };
const bodyM = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.45, metalness: 0.35 });
const glassM = new THREE.MeshStandardMaterial({ color: C.col('#1c2630'), roughness: 0.15, metalness: 0.4 });
const darkM = new THREE.MeshStandardMaterial({ color: C.col('#15181b'), roughness: 0.8 });
const headM = new THREE.MeshStandardMaterial({ color: C.col('#e8eef5'), emissive: C.col('#fff6d8'), emissiveIntensity: 0.1 });
const tailM = new THREE.MeshStandardMaterial({ color: C.col('#7a1410'), emissive: C.col('#ff2a1c'), emissiveIntensity: 0.15 });
C.nightListeners.push(n => { headM.emissiveIntensity = 0.1 + n * 2.2; tailM.emissiveIntensity = 0.15 + n * 1.6; });
/* yuvarlak gövde ve kabin; tekerlekler ve marşpiyel tek koyu parça; köşelerde farlar ve stoplar */
const rb = (w, h, d, r, k) => C.roundBox(w, h, d, r, k).clone();
const wheel = (x, z) => new THREE.CylinderGeometry(0.34, 0.34, 0.24, 10).rotateX(Math.PI / 2).translate(x, 0.34, z);
const pair2 = (x, y, w, h, d) => C.mergeGeos([0.62, -0.62].map(z => new THREE.BoxGeometry(w, h, d).translate(x, y, z)));   // küçük parçada düz kutu yeter
const parts = [
  C.inst(mk(rb(4.4, 0.78, 1.8, 0.3, 1), 0, 0.74, 0), bodyM, MAXC),
  C.inst(mk(rb(2.35, 0.72, 1.62, 0.3, 1), -0.25, 1.42, 0), glassM, MAXC),
  C.inst(C.mergeGeos([rb(3.6, 0.26, 1.7, 0.1, 1).translate(0, 0.4, 0), wheel(1.42, 0.82), wheel(1.42, -0.82), wheel(-1.42, 0.82), wheel(-1.42, -0.82)]), darkM, MAXC),
  C.inst(pair2(2.17, 0.84, 0.1, 0.17, 0.42), headM, MAXC),
  C.inst(pair2(-2.17, 0.88, 0.1, 0.15, 0.4), tailM, MAXC)
];
/* r128 setColorAt, renk tamponunu o anki count kadar açar; count 0'a inmeden önce tam boy aç */
parts[0].instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAXC * 3).fill(1), 3);
parts.forEach((p, k) => { p.count = 0; p.castShadow = k === 0; scene.add(p); C.carLayers.push(p); });   // gölgeyi gövde düşürür
/* dönüş sinyalleri: ön ve arka köşede turuncu; dönecek araçta dönüş yönündeki taraf yanıp söner (araç yerelinde +z sağ) */
const sigM = new THREE.MeshBasicMaterial({ color: C.col('#ffa21a') });
const sigGeo = s => C.mergeGeos([new THREE.BoxGeometry(0.14, 0.13, 0.16).translate(2.12, 0.84, s * 0.84), new THREE.BoxGeometry(0.14, 0.13, 0.16).translate(-2.12, 0.88, s * 0.84)]);
const sigs = [C.inst(sigGeo(-1), sigM, MAXC), C.inst(sigGeo(1), sigM, MAXC)];   // 0 sol, 1 sağ
sigs.forEach(m => { m.count = 0; scene.add(m); C.carLayers.push(m); });
const CAR_COLORS = ['#c9372c', '#1f5fa8', '#e8e8e8', '#2b2d31', '#f2b705', '#2f8f5b', '#8d939a', '#ffffff', '#6b3fa0', '#d9822b'].map(C.col);

/* ---------- saate göre trafik: Ankara'nın gerçek ortalaması. TomTom Traffic Index 2025, Ankara şehir merkezi: haftanın her günü ve saati için
   ortalama yoğunluk (serbest akışa göre fazladan yolculuk süresi, %). Sabah zirvesi 08 (~%90), akşam 17-18 (~%118, sabahtan ağır),
   cumartesi öğleden sonra hafta içi öğleden yoğun. Yoğunluktan yoldaki araç payına geçiş varsayım: yoğunluk kapasiteye yaklaşınca
   araç sayısından hızlı artar, bu yüzden pay = 0,06 + 0,94 · (yoğunluk / en yüksek)^0,7. Otomatikte (C.trafficAuto) kapasite
   C.trafficPeak ile kurulur, saatin istediği kadarı yolda kalır: fazlası kameradan uzakta yoldan çekilir (uyur), eksik olunca uyuyan
   bir araç uzakta boş bir şeride konur. Yağış trafiği biraz artırır (%12, varsayım) ---------- */
const TOMTOM = [   // [gün][saat] yoğunluk %, gün getUTCDay sırasıyla (0 pazar)
  [18, 11, 4, 0, 0, 0, 3, 12, 16, 19, 19, 22, 28, 36, 40, 41, 40, 39, 38, 33, 28, 27, 26, 19],   // pazar
  [8, 1, 0, 0, 0, 0, 17, 55, 96, 72, 47, 43, 47, 49, 58, 65, 78, 114, 116, 63, 32, 26, 23, 16],   // pazartesi
  [7, 2, 0, 0, 0, 0, 16, 52, 94, 72, 50, 46, 53, 57, 63, 67, 81, 115, 114, 63, 33, 27, 25, 17],   // salı
  [8, 3, 1, 0, 0, 0, 16, 50, 89, 68, 46, 45, 51, 54, 63, 67, 80, 116, 118, 66, 35, 29, 26, 18],   // çarşamba
  [8, 2, 0, 0, 0, 0, 16, 50, 88, 67, 46, 45, 51, 54, 61, 65, 81, 119, 120, 70, 36, 28, 25, 18],   // perşembe
  [8, 2, 0, 0, 0, 0, 16, 49, 84, 63, 45, 45, 49, 48, 67, 75, 91, 121, 121, 79, 46, 33, 32, 25],   // cuma
  [14, 6, 1, 0, 0, 0, 9, 20, 24, 30, 32, 37, 48, 62, 71, 72, 68, 66, 64, 55, 40, 33, 35, 29],   // cumartesi
];
const TT_MAX = 121;
const congestionAt = (day, h) => {                                   // saatler arasında yumuşak geçiş, gece yarısı ertesi güne bağlanır
  const i = Math.floor(h), t = h - i, a = TOMTOM[day][i], b = i < 23 ? TOMTOM[day][i + 1] : TOMTOM[(day + 1) % 7][0];
  return a + (b - a) * t * t * (3 - 2 * t);
};
C.trafficAuto = true;
C.trafficLevel = h => {
  if (h === undefined) h = C.hour;
  h = ((h % 24) + 24) % 24;
  const day = new Date(Date.now() + 3 * 3600e3).getUTCDay(), we = day === 0 || day === 6;   // Türkiye'de haftanın günü
  const w = C.weather && C.weather.cur, wet = w ? Math.min(1, w.rain + w.snow) : 0;
  const c = congestionAt(day, h), v = Math.min(1, (0.06 + 0.94 * Math.pow(c / TT_MAX, 0.7)) * (1 + wet * 0.12));
  const key = we ? (h < 8 || h >= 22 ? 'night' : 'weekend')
    : h < 6 || h >= 22.5 ? 'night' : h >= 6.5 && h < 9.75 ? 'morning' : h >= 16.5 && h < 19.5 ? 'evening' : h >= 19.5 ? 'late' : 'day';
  return { v, key, weekend: we, wet: wet > 0.2, congestion: Math.round(c) };   // congestion: TomTom ortalaması (%)
};
const sleepers = [];
let cap = 0, balT = 0;
function sleep(c) {
  const l = c.e.cars, k = l.indexOf(c); if (k >= 0) l.splice(k, 1);
  c.off = true; c.leaving = false; c.path = []; c.stopEdge = null;
  sleepers.push(c);
}
function wake(c, e, s) {
  c.off = false; Object.assign(c, { e, s, v: 7, tin: null, path: [], crashed: false, yaw: 0, pull: 0, wx: undefined });
  c.next = chooseNext(c, e); e.cars.push(c);
}
/* kameradan uzak mı: şehir kademesinde araçlar zaten gizli, her yer uzak sayılır */
const far = (x, z) => {
  const cam = C.camera.position, tg = C.controls ? C.controls.target : cam, D = cam.distanceTo(tg);
  if (D > 320) return true;
  const R = Math.max(110, D * 0.9);
  return Math.hypot(x - tg.x, z - tg.z) > R && Math.hypot(x - cam.x, z - cam.z) > R;
};
const canSleep = c => !(c.special || c.off || c.parked || c.crashed || c.leaving || (c.path && c.path.length));
function balance(dt) {
  if ((balT -= dt) > 0) return;
  balT = 0.2;
  let act = 0; for (const c of cars) if (!c.special && !c.off) act++;
  const diff = Math.round(cap * C.trafficLevel().v) - act;
  let n = Math.min(Math.abs(diff), Math.max(1, Math.ceil(Math.abs(diff) * 0.05)));   // farkın %5'i (en az 1), 0,2 sn'de bir
  for (let tries = 0; n > 0 && tries < n * 6 + 6; tries++) {
    if (diff < 0) {
      const c = cars[(Math.random() * cars.length) | 0];
      if (!canSleep(c) || (c.wx !== undefined && !far(c.wx, c.wz))) continue;
      sleep(c); n--;
    } else {
      if (!sleepers.length) break;
      const e = edges[(Math.random() * edges.length) | 0];
      if (e.blocked || e.cars.length >= MAXPER || e.len < 20) continue;
      const s = 4 + Math.random() * (e.len - 12);
      if (!far(e.ox + e.dx * s, e.oz + e.dz * s) || e.cars.some(o => Math.abs(o.s - s) < 12)) continue;
      wake(sleepers.pop(), e, s); n--;
    }
  }
}
C.setTrafficAuto = on => { C.trafficAuto = on; if (on) C.setDensity(C.trafficPeak); };

C.setDensity = function (d) {
  C.density = d;
  sleepers.length = 0;
  const r = C.rng(1234), keep = cars.filter(c => c.special);
  cars.length = 0;
  for (const e of edges) {
    e.cars.length = 0;
    const n = Math.min(MAXPER, Math.floor(d * MAXPER + r()));
    for (let k = 0; k < n; k++) {
      const car = { e, s: e.len * (1 - (k + 0.5) / n) + (r() - 0.5) * 3, v: 0, v0: 9 + r() * 4, len: 4.6, tin: null, next: null, col: CAR_COLORS[(r() * CAR_COLORS.length) | 0] };
      car.next = chooseNext(car, e);
      e.cars.push(car); cars.push(car);
    }
  }
  /* yedek havuz: şeritte değil, çizilmez; yoldan şehre giren araç buradan çıkar, şehirden çıkan buraya döner */
  cap = cars.length;
  /* otomatikte saatin istemediği kadarı baştan uyur (kamera bakmaksızın, kurulum zaten her şeyi yeniden dizer) */
  if (C.trafficAuto) { let extra = cars.length - Math.round(cap * C.trafficLevel().v); for (let k = cars.length - 1; k >= 0 && extra > 0; k--) if (r() * (k + 1) < extra) { sleep(cars[k]); extra--; } }
  reserve.length = 0;
  for (let k = 0; k < RES; k++) { const car = { e: edges[0], s: 0, v: 0, v0: 10 + r() * 3, len: 4.6, tin: null, next: edges[0], off: true, col: CAR_COLORS[(r() * CAR_COLORS.length) | 0] }; reserve.push(car); cars.push(car); }
  hwCars.length = 0;
  for (const c of keep) { cars.push(c); if (!c.parked) c.e.cars.push(c); }
  for (const m of parts.concat(sigs)) m.count = 0;   // çizim döngüsü yalnızca yoldakileri sırayla yazar
};

/* ---------- trafik ışıkları ---------- */
const CYCLE = 20;
function phaseOf(t) {
  t %= CYCLE;
  if (t < 7) return 'gr'; if (t < 8.5) return 'yr'; if (t < 10) return 'rr';
  if (t < 17) return 'rg'; if (t < 18.5) return 'ry'; return 'rr';
}
const LC = { g: C.col('#2ee66b'), y: C.col('#ffcc00'), r: C.col('#ff3b30') };
let lampX, lampZ, lampPos = [], lastPhase = '', simT = 0, lightX = 'g', lightZ = 'r';
(function () {
  const pts = [];
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const px = C.roadX(i) + sx * (C.ROAD / 2 + 1.1), pz = C.roadX(j) + sz * (C.ROAD / 2 + 1.1);
    if (Math.abs(px) > TOTAL / 2 - 0.5 || Math.abs(pz) > TOTAL / 2 - 0.5) continue;
    pts.push([px, pz, sx, sz]);
  }
  const n = pts.length;
  const pole = C.inst(new THREE.CylinderGeometry(0.08, 0.08, 3.8, 6).translate(0, 1.9, 0), new THREE.MeshStandardMaterial({ color: C.col('#2b3036'), roughness: 0.6 }), n);
  const house = C.inst(new THREE.BoxGeometry(0.5, 1.4, 0.5).translate(0, 3.1, 0), new THREE.MeshStandardMaterial({ color: C.col('#16191c'), roughness: 0.6 }), n);
  const lg = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  lampX = C.inst(lg, new THREE.MeshBasicMaterial({ color: 0xffffff }), n);
  lampZ = C.inst(lg, new THREE.MeshBasicMaterial({ color: 0xffffff }), n);
  pts.forEach((p, i) => {
    C.setM(pole, i, p[0], C.SW, p[1], 0); C.setM(house, i, p[0], C.SW, p[1], 0);
    C.setM(lampX, i, p[0] - p[2] * 0.3, C.SW + 3.4, p[1], 0);
    C.setM(lampZ, i, p[0], C.SW + 2.8, p[1] - p[3] * 0.3, 0);
    lampX.setColorAt(i, LC.r); lampZ.setColorAt(i, LC.r);
  });
  [pole, house, lampX, lampZ].forEach(m => { m.instanceMatrix.needsUpdate = true; scene.add(m); C.signalLayers.push(m); });
  lampX.instanceColor.needsUpdate = lampZ.instanceColor.needsUpdate = true; lampPos = pts;
})();
function paintLamps(sx, sz) {
  for (let i = 0; i < lampPos.length; i++) { lampX.setColorAt(i, LC[sx]); lampZ.setColorAt(i, LC[sz]); }
  lampX.instanceColor.needsUpdate = lampZ.instanceColor.needsUpdate = true;
}

/* ---------- trafik güncellemesi ---------- */
const dm = new THREE.Object3D(), pos = { x: 0, z: 0, hx: 1, hz: 0 }, movers = [];
function carPos(car, o) {
  const e = car.e;
  if (car.s >= 0 || !car.tin) { o.x = e.ox + e.dx * car.s; o.z = e.oz + e.dz * car.s; o.hx = e.dx; o.hz = e.dz; return o; }
  return bez(car.tin, C.clamp(1 + car.s / car.tin.len, 0, 1), o);
}
C.carPos = carPos;

/* oyuncu engeli: player.js her karede yerdeyken konumunu verir, değilse uzağa (1e9) */
let obsX = 1e9, obsZ = 1e9;
C.setObstacle = (x, z) => { obsX = x; obsZ = z; };
/* araç gövdesi (yönlü kutu) ile daire: p'yi dışarı iter, değdiği aracı döndürür */
C.carPush = function (p, R) {
  let hit = null;
  for (const c of cars) {
    if (c.off) continue;
    let x, z, ry;
    if (c.parked) { if (!c.group) continue; x = c.group.position.x; z = c.group.position.z; ry = c.group.rotation.y; }
    else { if (c.wx === undefined) continue; x = c.wx; z = c.wz; ry = c.wr; }
    const dx = p.x - x, dz = p.z - z; if (dx * dx + dz * dz > 49) continue;
    const fx = Math.cos(ry), fz = -Math.sin(ry), rx = -fz, rz = fx, hl = c.len / 2, hw = c.len > 6 ? 1.25 : 0.95;
    let lx = dx * fx + dz * fz, lz = dx * rx + dz * rz;
    const qx = C.clamp(lx, -hl, hl), qz = C.clamp(lz, -hw, hw), ex = lx - qx, ez = lz - qz, d = Math.hypot(ex, ez);
    if (d >= R) continue;
    if (d > 1e-6) { lx = qx + ex / d * R; lz = qz + ez / d * R; }
    else if (hl - Math.abs(lx) < hw - Math.abs(lz)) lx = (Math.sign(lx) || 1) * (hl + R);
    else lz = (Math.sign(lz) || 1) * (hw + R);
    p.x = x + lx * fx + lz * rx; p.z = z + lx * fz + lz * rz;
    hit = c;
  }
  return hit;
};

/* ---------- şehir dışı yol (terrain.js'deki C.highway): her yönde iki şerit ----------
   dir 1: şehirden tünele (s artar), dir -1: tünelden şehre (s azalır). Tünelden gelen araç doğu kavşağında
   şehrin ağına katılır (yedek havuzdan bir araç o şeride konur); şehirden o kavşağa gelenlerin bir kısmı yola çıkar. */
const HW = C.highway, hwCars = [];
let eIn = null, eOut = null, hwParts = null, hwTimer = 2, leaveTimer = 3;
if (HW) {
  const xn = nodeId(HW.startNode[0], HW.startNode[1]), wn = nodeId(HW.startNode[0] - 1, HW.startNode[1]);
  eIn = edgeAt.get(xn * 4096 + wn); eOut = edgeAt.get(wn * 4096 + xn);
  hwParts = parts.map((p, k) => { const m = C.inst(p.geometry, p.material, 80); m.castShadow = k === 0; m.count = 0; scene.add(m); C.carLayers.push(m); return m; });
  hwParts[0].instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(80 * 3).fill(1), 3);
}
const hp = { x: 0, z: 0, tx: 1, tz: 0, y: 0 };
function hwAt(s, out) {
  const P = HW.pts; let lo = 0, hi = P.length - 1;
  s = C.clamp(s, 0, HW.L);
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (P[m].s <= s) lo = m; else hi = m; }
  const a = P[lo], b = P[hi], t = b.s > a.s ? (s - a.s) / (b.s - a.s) : 0;
  out.x = a.x + (b.x - a.x) * t; out.z = a.z + (b.z - a.z) * t; out.tx = a.tx; out.tz = a.tz; out.y = HW.y(s); return out;
}
const prog = c => c.dir > 0 ? c.s : HW.L - c.s;
function laneFree(dir) { for (const c of hwCars) if (c.dir === dir && prog(c) < 14) return false; return true; }
function updateHighway(dt) {
  /* şehirden ayrılanlar: arada bir rastgele bir araç çıkış kavşağına yönelir (giriş ve çıkış dengede kalsın) */
  if ((leaveTimer -= dt) <= 0) {
    leaveTimer = (3 + Math.random() * 3) / (C.trafficAuto ? Math.max(0.2, C.trafficLevel().v) : 1);
    for (let k = 0; k < 20; k++) {
      const c = cars[(Math.random() * cars.length) | 0];
      if (c.special || c.off || c.crashed || c.leaving || (c.path && c.path.length) || c.s < 0) continue;
      C.setRoute(c, eOut, eOut.len); c.stopEdge = null; c.leaving = true; break;
    }
  }
  /* tünelden gelen: yedek havuzda yer ayrılmış kadar */
  const inbound = hwCars.filter(c => c.dir < 0).length;
  if ((hwTimer -= dt) <= 0 && reserve.length > inbound && laneFree(-1)) {
    hwTimer = (2.5 + Math.random() * 4) / (C.trafficAuto ? Math.max(0.2, C.trafficLevel().v) : 1);   // gece tünelden seyrek araç gelir
    hwCars.push({ dir: -1, lane: Math.random() < 0.5 ? 0 : 1, s: HW.L, v: 14, v0: 15 + Math.random() * 6, col: CAR_COLORS[(Math.random() * CAR_COLORS.length) | 0], k: 0 });
  }
  hwCars.sort((a, b) => prog(b) - prog(a));
  for (let i = hwCars.length - 1; i >= 0; i--) {
    const c = hwCars[i], p = prog(c);
    let gap = 1e9;
    for (let j = i - 1; j >= 0; j--) { const o = hwCars[j]; if (o.dir === c.dir && o.lane === c.lane) { gap = prog(o) - p - 6.1; break; } }
    if (c.dir < 0) gap = Math.min(gap, HW.L - p);                      // şehre girişte, şerit boşalana kadar bekler
    const des = Math.min(c.v0, Math.sqrt(9 * Math.max(0, gap - 1.5)));
    c.v = c.v < des ? Math.min(des, c.v + 3 * dt) : Math.max(des, c.v - 9 * dt);
    c.s += c.dir * c.v * dt;
    if (c.dir > 0 && c.s >= HW.L) { hwCars.splice(i, 1); continue; }   // tünelde kayboldu
    if (c.dir < 0 && c.s <= 2) {                                       // duruş mesafesi yüzünden en fazla ~1,5 m kala durur
      let tail = 1e9; for (const o of eIn.cars) tail = Math.min(tail, o.s);
      if (tail > 7 && reserve.length) {                                // şehrin ağına katıl
        const car = reserve.pop(); car.off = false;
        Object.assign(car, { e: eIn, s: 0, v: c.v, tin: null, path: [], col: c.col, crashed: false, yaw: 0, pull: 0 });
        car.next = chooseNext(car, eIn); eIn.cars.push(car);
        hwCars.splice(i, 1);
      } else { c.v = 0; }
    }
  }
  hwCars.forEach((c, n) => {
    hwAt(c.s, hp);
    const sx = c.dir * hp.tx, sz = c.dir * hp.tz, off = c.lane ? 5.4 : 1.9;
    dm.position.set(hp.x - sz * off, hp.y + 0.04, hp.z + sx * off); dm.rotation.set(0, Math.atan2(-sz, sx), 0); dm.scale.set(1, 1, 1); dm.updateMatrix();
    for (const m of hwParts) m.setMatrixAt(n, dm.matrix);
    hwParts[0].setColorAt(n, c.col);
  });
  for (const m of hwParts) { m.count = hwCars.length; m.instanceMatrix.needsUpdate = true; }
  hwParts[0].instanceColor.needsUpdate = true;
}
C.hwCars = hwCars; C.reserve = reserve;
/* sola dönen araç, karşıdan hızla yaklaşan biri varsa bekler */
function oncoming(e) {
  const ci = e.bi + e.dx, cj = e.bj + e.dz;
  if (ci < 0 || cj < 0 || ci >= NN || cj >= NN) return false;
  const g = edgeAt.get(nodeId(ci, cj) * 4096 + e.b);
  for (const o of g.cars) if (g.len - o.s < 26 && o.v > 1.5) return true;
  return false;
}
C.updateTraffic = function (dt) {
  simT += dt;
  if (C.trafficAuto) balance(dt);
  const ph = phaseOf(simT);
  if (ph !== lastPhase) { lastPhase = ph; lightX = ph[0]; lightZ = ph[1]; paintLamps(lightX, lightZ); }
  for (const e of edges) if (e.cars.length > 1) e.cars.sort((p, q) => q.s - p.s);
  movers.length = 0;
  for (const e of edges) {
    const list = e.cars, n = list.length; if (!n) continue;
    const st = e.axis === 'x' ? lightX : lightZ;
    /* oyuncu bu şeritteyse önündeki araçlar onu engel sayar (çok yakından fırlarsa fren yetmez) */
    let oa = -1e9;
    if (obsX < 1e8) { const rx = obsX - e.ox, rz = obsZ - e.oz, a = rx * e.dx + rz * e.dz; if (Math.abs(rz * e.dx - rx * e.dz) < 1.5 && a > -2 && a < e.len + 3) oa = a; }
    /* sirene yol ver: arkasında 32 m içinde sirenli araç olan araç kaldırıma çekilip durur */
    for (const c of list) {
      let want = 0;
      if (!c.special && !c.crashed && c.s > 2) for (const o of list) if (o.siren && o.s < c.s && c.s - o.s < 32) { want = 1; break; }
      const p = c.pull || 0; if (want || p) c.pull = p + C.clamp(want - p, -dt * 1.2, dt * 1.6);
    }
    for (let k = 0; k < n; k++) {
      const car = list[k], t = turnOf(e, car.next);
      if (car.crashed) { car.v = 0; continue; }
      let gap = 1e9, j = k - 1;
      if (car.siren) while (j >= 0 && list[j].pull > 0.4) j--;          // kenara çekilenlerin yanından geçer
      if (j >= 0) gap = list[j].s - car.s - (list[j].len + car.len) / 2;
      else {
        let tail = null; for (const o of car.next.cars) if (!tail || o.s < tail.s) tail = o;
        if (tail) gap = e.len - car.s + t.len + tail.s - (tail.len + car.len) / 2;
      }
      let sgap = 1e9;
      const d = e.len - (car.s + car.len * 0.5);
      if (d > -0.4 && !car.siren) {
        if (st !== 'g') { if (st === 'r' || d > car.v * car.v / 12 + 1.5) sgap = d; }
        else if (t.kind === 'l' && d < 14 && oncoming(e)) sgap = Math.max(0, d);
      }
      if (car.stopEdge === e && car.stopS - car.s > -0.5) sgap = Math.min(sgap, car.stopS - car.s + 1.5);
      if (oa > car.s) gap = Math.min(gap, oa - car.s - car.len / 2 - 0.6);
      const free = Math.max(0, Math.min(gap, sgap) - 1.5);
      const des = car.pull > 0.3 ? 0 : Math.min(car.v0, Math.sqrt(9 * free));
      car.v = car.v < des ? Math.min(des, car.v + 3 * dt) : Math.max(des, car.v - 9 * dt);
      car.s += car.v * dt;
      if (car.s > e.len) movers.push(car);
    }
  }
  for (const car of movers) {
    const e = car.e, f = car.next, t = turnOf(e, f);
    if (HW && e === eOut && !car.special && (car.leaving || Math.random() < 0.35) && laneFree(1)) {   // şehirden çık: yola, tünele doğru
      e.cars.splice(e.cars.indexOf(car), 1); car.off = true; car.leaving = false; reserve.push(car);
      hwCars.push({ dir: 1, lane: Math.random() < 0.5 ? 0 : 1, s: 0, v: car.v, v0: 15 + Math.random() * 6, col: car.col, k: 0 });
      continue;
    }
    e.cars.splice(e.cars.indexOf(car), 1);
    car.s -= e.len + t.len; car.tin = t; car.e = f; f.cars.push(car);
    car.next = chooseNext(car, f);
  }
  if (HW) updateHighway(dt);
  /* yalnızca yoldaki araçlar sırayla yazılır (yayalardaki begin/put/end gibi), count küçülür: yoldan çekilen, park eden ve
     yedek havuzdaki araçlar GPU'ya hiç gitmez. car.slot o karedeki yazma sırası; slot ya da renk değişince gövde rengi
     yeniden yazılır. Sinyallerde iki taraf da yalnızca yanan lambaları kendi sırasıyla yazar */
  const blinkOn = (simT * 1.6) % 1 < 0.55;
  let n = 0, nl = 0, nr = 0, colDirty = false;
  for (const car of cars) {
    if (car.parked || car.off) { car.slot = -1; continue; }
    carPos(car, pos);
    const ry = Math.atan2(-pos.hz, pos.hx) + (car.yaw || 0);
    if (car.pull > 0.01 && !car.model) { const l = Math.hypot(pos.hx, pos.hz) || 1, o = car.pull * 1.9 / l; pos.x -= pos.hz * o; pos.z += pos.hx * o; }
    car.wx = pos.x; car.wz = pos.z; car.wr = ry;                        // çarpışma için (C.carPush)
    if (car.model) { car.model(pos.x, pos.z, ry); continue; }
    dm.position.set(pos.x, 0, pos.z); dm.rotation.set(0, ry, 0); dm.updateMatrix();
    for (const p of parts) p.setMatrixAt(n, dm.matrix);
    if (car.slot !== n || car.slotCol !== car.col) { parts[0].setColorAt(n, car.col); car.slot = n; car.slotCol = car.col; colDirty = true; }
    n++;
    if (!blinkOn) continue;
    /* dönüşte ya da kavşağa 25 m kala, dönüş düz değilse */
    const tk = car.s < 0 && car.tin ? car.tin.kind : car.next && car.e.len - car.s < 25 ? turnOf(car.e, car.next).kind : 's';
    if (tk === 'l') sigs[0].setMatrixAt(nl++, dm.matrix); else if (tk === 'r') sigs[1].setMatrixAt(nr++, dm.matrix);
  }
  for (const p of parts) { p.count = n; p.instanceMatrix.needsUpdate = true; }
  if (colDirty) parts[0].instanceColor.needsUpdate = true;
  sigs[0].count = nl; sigs[1].count = nr;
  for (const m of sigs) m.instanceMatrix.needsUpdate = true;
};

/* ---------- yayalar: her bloğun kaldırımında dolaşır ---------- */
const people = C.people = [];
const pt = {};
C.buildPeople = function () {
  const r = C.rng(77);
  for (const blk of C.blocks) {
    const n = Math.max(1, Math.round((blk.kind === 'plaza' ? 6 : blk.kind === 'park' ? 3 : 2 + Math.floor(r() * 3)) * C.Q.crowd));
    for (let k = 0; k < n; k++) people.push({ blk, f: r(), dir: r() < 0.5 ? 1 : -1, sp: 1.1 + r() * 0.6, lat: (r() - 0.5) * 1.4, ph: r() * 6.28 });
  }
  crowd = new C.Crowd(people.length);
  people.forEach((p, k) => crowd.look(k, C.randomLook(r)));
  crowd.group.visible = false; scene.add(crowd.group); C.peopleLayers.push(crowd.group);
};
let crowd = null;
const pp = {};
/* karşıya geçiş: köşede, yürüme yönündeki yolun araçlarına kırmızı yanıyor ve kalan süre yetiyorsa */
const SIDE_D = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const CORNER_END = [[1, -1], [1, 1], [-1, 1], [-1, -1]], CORNER_START = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
function redLeft(dx) {                                   // dx: x yönünde geçiş z yolunu keser, z trafiğinin kırmızısı gerekir
  const tc = simT % CYCLE;
  if (dx) return tc >= 18.5 ? CYCLE - tc + 10 : tc < 10 ? 10 - tc : 0;
  return tc >= 8.5 ? CYCLE - tc : 0;
}
function tryCross(p, k, h) {
  const D = SIDE_D[k].map(v => v * p.dir), bi = p.blk.i + D[0], bj = p.blk.j + D[1];
  if (bi < 0 || bj < 0 || bi >= N || bj >= N) return;
  const c = (p.dir > 0 ? CORNER_END : CORNER_START)[k], len = C.PITCH - 2 * h;
  const ax = p.blk.bx + c[0] * h, az = p.blk.bz + c[1] * h;
  p.cross = { ax, az, bx: ax + D[0] * len, bz: az + D[1] * len, dx: D[0], len, t: 0, go: false,
    to: C.blocks[bi * N + bj], f: p.dir > 0 ? k / 4 + 1e-4 : (k + 1) / 4 - 1e-4, ry: Math.atan2(D[0], D[1]) };
}
C.updatePeople = function (dt) {
  const cam = C.camera.position;
  crowd.begin();
  for (let i = 0; i < people.length; i++) {
    const p = people[i], h = 20.5 + p.lat;
    let x, z, ry, moving = true;
    if (p.talk > 0 && C.player) {
      p.talk -= dt; const tp = C.player.pos;
      crowd.put(i, p.x, C.SW, p.z, Math.atan2(-(tp.z - p.z), tp.x - p.x), C.pose('talk', p.ph + p.talk * 2, pp)); p.hid = false;
      continue;
    }
    if (p.cross) {
      const c = p.cross;
      if (!c.go) { c.go = redLeft(c.dx) > c.len / (p.sp * 1.25) + 0.5; moving = c.go; }
      if (c.go) c.t = Math.min(1, c.t + p.sp * 1.25 * dt / c.len);
      x = c.ax + (c.bx - c.ax) * c.t; z = c.az + (c.bz - c.az) * c.t; ry = c.ry - Math.PI / 2;
      if (c.t >= 1) { p.blk = c.to; p.f = c.f; p.cross = null; }
    } else {
      const was = Math.floor(p.f * 4);
      p.f = (p.f + p.dir * p.sp * dt / (8 * h) + 1) % 1;
      const side = Math.floor(p.f * 4), t = (p.f * 4) % 1;
      if (side !== was && Math.random() < 0.35) tryCross(p, was, h);
      if (side === 0) { x = -h + 2 * h * t; z = -h; ry = 0; }
      else if (side === 1) { x = h; z = -h + 2 * h * t; ry = -Math.PI / 2; }
      else if (side === 2) { x = h - 2 * h * t; z = h; ry = Math.PI; }
      else { x = -h; z = h - 2 * h * t; ry = Math.PI / 2; }
      if (p.dir < 0) ry += Math.PI;
      x += p.blk.bx; z += p.blk.bz;
    }
    if (moving) p.ph += p.sp * dt * 4.2;
    p.x = x; p.z = z; p.ry = ry;
    /* 160 m'den uzaktakiler çizilmez (zaten küçük), eklem hesabı da yapılmaz */
    const dx = x - cam.x, dz = z - cam.z;
    if (dx * dx + dz * dz > 160 * 160) { p.hid = true; continue; }
    p.hid = false;
    crowd.put(i, x, C.SW, z, ry, moving ? C.pose('walk', p.ph, pp) : C.pose('stand', p.ph + i, pp));
  }
  crowd.end();
};
})();
