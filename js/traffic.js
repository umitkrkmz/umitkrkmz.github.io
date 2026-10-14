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

/* sonraki kenar: hedefi olan araç (ileride acil durum araçları) hedefe yaklaştıran yolu seçer,
   diğerleri çoğunlukla düz gider; geri dönüş yok (ızgarada her kavşakta başka çıkış var) */
function chooseNext(car, e) {
  const opts = outOf[e.b].filter(f => f.dx !== -e.dx || f.dz !== -e.dz);
  if (car.goal != null && car.goal !== e.b) {
    const gi = Math.floor(car.goal / NN), gj = car.goal % NN;
    const now = Math.abs(gi - e.bi) + Math.abs(gj - e.bj);
    const better = opts.filter(f => Math.abs(gi - f.bi) + Math.abs(gj - f.bj) < now);
    if (better.length) return better.find(f => f.dx === e.dx && f.dz === e.dz) || better[0];
  }
  const r = Math.random(), want = r < 0.6 ? 's' : r < 0.82 ? 'r' : 'l';
  return opts.find(f => turnOf(e, f).kind === want) || opts[(Math.random() * opts.length) | 0];
}
const MAXC = edges.length * MAXPER, cars = [];
C.roads = { edges, outOf, edgeAt, nodeId, NN, turnOf };
C.cars = cars;

/* ---------- araç parçaları: aynı örnek matrisini paylaşır ---------- */
const mk = (g, ox, oy, oz) => { g.translate(ox, oy, oz); return g; };
const bodyM = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.45, metalness: 0.35 });
const glassM = new THREE.MeshStandardMaterial({ color: C.col('#1c2630'), roughness: 0.15, metalness: 0.4 });
const darkM = new THREE.MeshStandardMaterial({ color: C.col('#15181b'), roughness: 0.8 });
const headM = new THREE.MeshStandardMaterial({ color: C.col('#e8eef5'), emissive: C.col('#fff6d8'), emissiveIntensity: 0.1 });
const tailM = new THREE.MeshStandardMaterial({ color: C.col('#7a1410'), emissive: C.col('#ff2a1c'), emissiveIntensity: 0.15 });
C.nightListeners.push(n => { headM.emissiveIntensity = 0.1 + n * 2.2; tailM.emissiveIntensity = 0.15 + n * 1.6; });
const parts = [
  C.inst(mk(new THREE.BoxGeometry(4.4, 0.8, 1.8), 0, 0.75, 0), bodyM, MAXC),
  C.inst(mk(new THREE.BoxGeometry(2.2, 0.7, 1.6), -0.25, 1.5, 0), glassM, MAXC),
  C.inst(mk(new THREE.BoxGeometry(4.0, 0.35, 1.7), 0, 0.32, 0), darkM, MAXC),
  C.inst(mk(new THREE.BoxGeometry(0.08, 0.16, 1.5), 2.2, 0.8, 0), headM, MAXC),
  C.inst(mk(new THREE.BoxGeometry(0.08, 0.16, 1.5), -2.2, 0.85, 0), tailM, MAXC)
];
/* r128 setColorAt, renk tamponunu o anki count kadar açar; count 0'a inmeden önce tam boy aç */
parts[0].instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAXC * 3).fill(1), 3);
parts.forEach(p => { p.count = 0; p.castShadow = true; scene.add(p); C.carLayers.push(p); });
const CAR_COLORS = ['#c9372c', '#1f5fa8', '#e8e8e8', '#2b2d31', '#f2b705', '#2f8f5b', '#8d939a', '#ffffff', '#6b3fa0', '#d9822b'].map(C.col);

C.setDensity = function (d) {
  C.density = d;
  const r = C.rng(1234);
  cars.length = 0;
  for (const e of edges) {
    e.cars.length = 0;
    const n = Math.min(MAXPER, Math.floor(d * MAXPER + r()));
    for (let k = 0; k < n; k++) {
      const car = { e, s: e.len * (1 - (k + 0.5) / n) + (r() - 0.5) * 3, v: 0, v0: 9 + r() * 4, len: 4.6, idx: cars.length, tin: null, next: null, goal: null };
      car.next = chooseNext(car, e);
      parts[0].setColorAt(car.idx, CAR_COLORS[(r() * CAR_COLORS.length) | 0]);
      e.cars.push(car); cars.push(car);
    }
  }
  parts.forEach(p => p.count = cars.length);
  if (parts[0].instanceColor) parts[0].instanceColor.needsUpdate = true;
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
  const ph = phaseOf(simT);
  if (ph !== lastPhase) { lastPhase = ph; lightX = ph[0]; lightZ = ph[1]; paintLamps(lightX, lightZ); }
  for (const e of edges) if (e.cars.length > 1) e.cars.sort((p, q) => q.s - p.s);
  movers.length = 0;
  for (const e of edges) {
    const list = e.cars, n = list.length; if (!n) continue;
    const st = e.axis === 'x' ? lightX : lightZ;
    for (let k = 0; k < n; k++) {
      const car = list[k], t = turnOf(e, car.next);
      let gap = 1e9;
      if (k > 0) gap = list[k - 1].s - car.s - car.len;
      else {
        let tail = 1e9; for (const o of car.next.cars) if (o.s < tail) tail = o.s;
        if (tail < 1e8) gap = e.len - car.s + t.len + tail - car.len;
      }
      let sgap = 1e9;
      const d = e.len - (car.s + car.len * 0.5);
      if (d > -0.4) {
        if (st !== 'g') { if (st === 'r' || d > car.v * car.v / 12 + 1.5) sgap = d; }
        else if (t.kind === 'l' && d < 14 && oncoming(e)) sgap = Math.max(0, d);
      }
      const free = Math.max(0, Math.min(gap, sgap) - 1.5);
      const des = Math.min(car.v0, Math.sqrt(9 * free));
      car.v = car.v < des ? Math.min(des, car.v + 3 * dt) : Math.max(des, car.v - 9 * dt);
      car.s += car.v * dt;
      if (car.s > e.len) movers.push(car);
    }
  }
  for (const car of movers) {
    const e = car.e, f = car.next, t = turnOf(e, f);
    e.cars.splice(e.cars.indexOf(car), 1);
    car.s -= e.len + t.len; car.tin = t; car.e = f; f.cars.push(car);
    car.next = chooseNext(car, f);
  }
  for (const car of cars) {
    carPos(car, pos);
    dm.position.set(pos.x, 0, pos.z); dm.rotation.set(0, Math.atan2(-pos.hz, pos.hx), 0); dm.updateMatrix();
    for (const p of parts) p.setMatrixAt(car.idx, dm.matrix);
  }
  for (const p of parts) p.instanceMatrix.needsUpdate = true;
};

/* ---------- yayalar: her bloğun kaldırımında dolaşır ---------- */
const people = [];
const pt = {};
C.buildPeople = function () {
  const r = C.rng(77);
  for (const blk of C.blocks) {
    const n = blk.kind === 'plaza' ? 6 : blk.kind === 'park' ? 3 : 2 + Math.floor(r() * 3);
    for (let k = 0; k < n; k++) people.push({ blk, f: r(), dir: r() < 0.5 ? 1 : -1, sp: 1.1 + r() * 0.6, lat: (r() - 0.5) * 1.4, ph: r() * 6.28 });
  }
  const M = people.length;
  const leg = () => C.inst(new THREE.BoxGeometry(0.16, 0.8, 0.2).translate(0, -0.4, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }), M);
  const arm = () => C.inst(new THREE.BoxGeometry(0.12, 0.6, 0.14).translate(0, -0.3, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }), M);
  pt.legA = leg(); pt.legB = leg(); pt.armA = arm(); pt.armB = arm();
  pt.torso = C.inst(new THREE.BoxGeometry(0.42, 0.62, 0.26).translate(0, 0.31, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }), M);
  pt.head = C.inst(new THREE.SphereGeometry(0.13, 8, 6).translate(0, 0.78, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }), M);
  const shirt = ['#c9372c', '#2f6f8f', '#e8e2d0', '#3b7a57', '#d29a2d', '#6b4e8f', '#222b33', '#b3566b'].map(C.col);
  const jeans = ['#2d3b55', '#3a3a3a', '#4a4036', '#1f2a3a'].map(C.col);
  const skin = ['#f1c9a5', '#d9a37c', '#a8734f', '#7a4e33'].map(C.col);
  people.forEach((p, i) => {
    const sc = shirt[(r() * shirt.length) | 0];
    pt.torso.setColorAt(i, sc); pt.armA.setColorAt(i, sc); pt.armB.setColorAt(i, sc);
    const jc = jeans[(r() * jeans.length) | 0]; pt.legA.setColorAt(i, jc); pt.legB.setColorAt(i, jc);
    pt.head.setColorAt(i, skin[(r() * skin.length) | 0]);
  });
  for (const k in pt) { pt[k].castShadow = true; pt[k].instanceColor.needsUpdate = true; scene.add(pt[k]); pt[k].visible = false; C.peopleLayers.push(pt[k]); }
};
const pd = new THREE.Object3D(); pd.rotation.order = 'YXZ';
function put(mesh, i, x, y, z, ry, rz) { pd.position.set(x, y, z); pd.rotation.set(0, ry, rz || 0); pd.updateMatrix(); mesh.setMatrixAt(i, pd.matrix); }
C.updatePeople = function (dt) {
  for (let i = 0; i < people.length; i++) {
    const p = people[i], h = 20.5 + p.lat;
    p.f = (p.f + p.dir * p.sp * dt / (8 * h) + 1) % 1;
    const side = Math.floor(p.f * 4), t = (p.f * 4) % 1;
    let x, z, ry;
    if (side === 0) { x = -h + 2 * h * t; z = -h; ry = 0; }
    else if (side === 1) { x = h; z = -h + 2 * h * t; ry = -Math.PI / 2; }
    else if (side === 2) { x = h - 2 * h * t; z = h; ry = Math.PI; }
    else { x = -h; z = h - 2 * h * t; ry = Math.PI / 2; }
    if (p.dir < 0) ry += Math.PI;
    x += p.blk.bx; z += p.blk.bz;
    p.ph += p.sp * dt * 4.2;
    const sw = Math.sin(p.ph) * 0.55, bob = Math.abs(Math.sin(p.ph)) * 0.03;
    const hip = C.SW + 0.85 + bob, lx = Math.sin(ry), lz = Math.cos(ry);
    put(pt.torso, i, x, hip, z, ry);
    put(pt.head, i, x, hip, z, ry);
    put(pt.legA, i, x + lx * 0.1, hip, z + lz * 0.1, ry, sw);
    put(pt.legB, i, x - lx * 0.1, hip, z - lz * 0.1, ry, -sw);
    put(pt.armA, i, x + lx * 0.27, hip + 0.58, z + lz * 0.27, ry, -sw * 0.9);
    put(pt.armB, i, x - lx * 0.27, hip + 0.58, z - lz * 0.27, ry, sw * 0.9);
  }
  for (const k in pt) pt[k].instanceMatrix.needsUpdate = true;
};
})();
