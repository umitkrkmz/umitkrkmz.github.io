/* ===== terrain.js: dağlarla çevrili vadi, orman, akarsu, şehre giriş-çıkış yolu ve tünel ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene, half = C.TOTAL / 2;

/* ---------- gürültü: değer gürültüsü + fbm (tohumlu, sabit) ---------- */
function hash2(i, j) { let h = Math.imul(i, 374761393) + Math.imul(j, 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function vnoise(x, z) {
  const i = Math.floor(x), j = Math.floor(z), fx = x - i, fz = z - j, u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = hash2(i, j), b = hash2(i + 1, j), c = hash2(i, j + 1), d = hash2(i + 1, j + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, z, oct) { let s = 0, a = 0.5, f = 1, n = 0; for (let k = 0; k < oct; k++) { s += a * vnoise(x * f + k * 17.3, z * f - k * 9.1); n += a; f *= 2.03; a *= 0.5; } return s / n; }
const ss = (a, b, x) => { const t = C.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

/* ---------- çizgiler: akarsu ve yol (x, z noktaları; uzunluk boyunca örneklenir) ---------- */
function polyline(pts, step) {
  const out = []; let s = 0;
  for (let k = 0; k < pts.length - 1; k++) {
    const [ax, az] = pts[k], [bx, bz] = pts[k + 1], L = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.ceil(L / step));
    for (let i = 0; i < n; i++) { const t = i / n; out.push({ x: ax + (bx - ax) * t, z: az + (bz - az) * t, s: s + L * t }); }
    s += L;
  }
  const [lx, lz] = pts[pts.length - 1]; out.push({ x: lx, z: lz, s });
  /* yumuşatma: köşeler eğri olsun */
  for (let it = 0; it < 6; it++) for (let i = 1; i < out.length - 1; i++) { out[i].x = (out[i - 1].x + out[i].x * 2 + out[i + 1].x) / 4; out[i].z = (out[i - 1].z + out[i].z * 2 + out[i + 1].z) / 4; }
  s = 0; out[0].s = 0;
  for (let i = 1; i < out.length; i++) { s += Math.hypot(out[i].x - out[i - 1].x, out[i].z - out[i - 1].z); out[i].s = s; }
  for (let i = 0; i < out.length; i++) { const a = out[Math.max(0, i - 1)], b = out[Math.min(out.length - 1, i + 1)], l = Math.hypot(b.x - a.x, b.z - a.z) || 1; out[i].tx = (b.x - a.x) / l; out[i].tz = (b.z - a.z) / l; }
  return out;
}
/* bir noktanın çizgiye uzaklığı ve çizgi üzerindeki konumu (kaba ızgara hızlandırmalı) */
function nearestOn(line, cell) {
  const grid = new Map(), key = (i, j) => i * 65536 + j;
  line.forEach((p, k) => { const i = Math.floor(p.x / cell), j = Math.floor(p.z / cell); for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { const kk = key(i + a, j + b); if (!grid.has(kk)) grid.set(kk, []); grid.get(kk).push(k); } });
  return (x, z) => {
    const list = grid.get(key(Math.floor(x / cell), Math.floor(z / cell)));
    if (!list) return null;
    let best = null, bd = Infinity;
    for (const k of list) { const p = line[k], d = (p.x - x) ** 2 + (p.z - z) ** 2; if (d < bd) { bd = d; best = p; } }
    return { p: best, d: Math.sqrt(bd) };
  };
}

/* akarsu: doğudaki dağlardan şehrin güneyinden geçip batıdaki boğazdan çıkar */
const river = polyline([[3600, 250], [2600, 380], [1700, 560], [1050, 700], [450, 760], [-250, 760], [-900, 700], [-1500, 820], [-2200, 1050], [-3600, 1400]], 12);
const riverNear = nearestOn(river, 120);
const waterY = x => -1.7 + Math.max(0, x - 1000) * 0.018;   // akış batıya doğru; şehrin yanında taban altında
/* yol: şehrin doğu kenarındaki kavşaktan vadi boyunca tırmanır, dağdaki tünele girer */
const zMid = C.roadX(C.MID), END = C.ROAD / 2 + 3.2, x0 = C.roadX(C.N) - END;
const roadRaw = polyline([[x0, zMid], [half + 60, zMid], [760, zMid - 15], [1100, -120], [1500, -320], [1950, -580], [2400, -860], [2900, -1150], [3500, -1500]], 4);
const roadY = s => Math.min(120, Math.max(0, s - 40) * 0.035);
/* yolun ve akarsuyun boyunca vadi: dağlar oralarda alçalır; yol vadinin sonunda dağa (tünele) girer */
const roadWide = nearestOn(roadRaw, 320), riverWide = nearestOn(river, 320);

/* ---------- yükseklik ---------- */
function H0(x, z) {
  const dBox = Math.max(Math.abs(x), Math.abs(z)) - half;                 // şehir kutusuna uzaklık
  const rise = ss(60, 1500, dBox);
  const big = fbm(x * 0.00065, z * 0.00065, 5), mid = fbm(x * 0.0032, z * 0.0032, 4);
  const ridge = 1 - Math.abs(fbm(x * 0.0011 + 40, z * 0.0011 - 30, 4) * 2 - 1);   // sırtlar
  let h = Math.pow(rise, 1.6) * (360 + 460 * big + 210 * ridge) + rise * 55 * mid;
  const qr = roadWide(x, z), qv = riverWide(x, z);
  let f = 1;
  if (qr) { const str = 1 - ss(2300, 2800, qr.p.s); f = Math.min(f, 1 - str * (1 - (0.05 + 0.95 * ss(70, 520, qr.d)))); }
  if (qv) f = Math.min(f, 0.1 + 0.9 * ss(90, 650, qv.d));
  h *= f;
  h += (fbm(x * 0.012, z * 0.012, 3) - 0.5) * 4 * ss(30, 200, dBox);      // çayırda hafif dalga
  return h - 0.12;
}
/* yol tüneli: yolun dağa girdiği yer (arazi yolun 14 m üstüne çıktığı ilk nokta) */
let portalK = roadRaw.length - 1;
for (let k = 20; k < roadRaw.length; k++) { const p = roadRaw[k]; if (p.s > 1500 && H0(p.x, p.z) > roadY(p.s) + 14) { portalK = k; break; } }
const road = roadRaw.slice(0, portalK + 1);
{ const e = road[road.length - 1]; for (let k = 1; k <= 3; k++) road.push({ x: e.x + e.tx * 4 * k, z: e.z + e.tz * 4 * k, s: e.s + 4 * k, tx: e.tx, tz: e.tz }); }   // yarmanın içine 12 m
const roadL = road[road.length - 1].s;
const roadNear = nearestOn(road, 90);
function H(x, z) {
  let h = H0(x, z);
  const dBox = Math.max(Math.abs(x), Math.abs(z)) - half;
  if (dBox < 40) h = Math.min(h, -0.12);
  const r = riverNear(x, z);
  if (r && r.d < 90) { const wy = waterY(r.p.x); h = h * ss(16, 90, r.d) + (wy - 2.2) * (1 - ss(16, 90, r.d)); if (r.d < 26) h = Math.min(h, wy - 1.2 - (26 - r.d) * 0.12); }
  const q = roadNear(x, z);
  if (q && q.d < 70 && q.p.s < roadL - 2) { const ry = roadY(q.p.s) - 0.45, k = ss(13, 70, q.d); h = h * k + ry * (1 - k); }
  /* tünel ağzının önünde dağa doğru dar yarma: ağız örtülmesin */
  const e = road[road.length - 1], fx = x - e.x, fz = z - e.z, fwd = fx * e.tx + fz * e.tz, lat = Math.abs(-fx * e.tz + fz * e.tx);
  if (fwd > -40 && fwd < 90 && lat < 45) { const cut = roadY(roadL) - 0.45 + Math.max(0, fwd) * 0.5 + Math.max(0, lat - 13) * 1.1; h = Math.min(h, cut); }
  return h;
}
C.terrainH = H;

/* ---------- arazi ağı: merkeze sık, dışa seyrek ızgara; renk yükseklik ve eğimden ---------- */
const SEG = C.Q.seg, EXT = 9000, WARP = 1.6;          // merkezde ~20 m, dağlarda ~35 m, ufukta seyrek
const tg = new THREE.PlaneGeometry(2, 2, SEG, SEG); tg.rotateX(-Math.PI / 2);
const tp = tg.attributes.position, tcol = new Float32Array(tp.count * 3);
for (let i = 0; i < tp.count; i++) {
  const u = tp.getX(i), w = tp.getZ(i);
  const x = Math.sign(u) * Math.pow(Math.abs(u), WARP) * EXT, z = Math.sign(w) * Math.pow(Math.abs(w), WARP) * EXT;
  tp.setXYZ(i, x, H(x, z), z);
}
tg.computeVertexNormals();
const nrm = tg.attributes.normal, cA = new THREE.Color(), cB = new THREE.Color();
const MEADOW = C.col('#86a35e'), HILL = C.col('#5e7d43'), FOREST = C.col('#3f5f34'), ROCK = C.col('#8b877c'), SNOW = C.col('#f1f3f4'), SAND = C.col('#b9ae8c'), DARKROCK = C.col('#6d6a62');
for (let i = 0; i < tp.count; i++) {
  const x = tp.getX(i), y = tp.getY(i), z = tp.getZ(i), slope = 1 - nrm.getY(i), n = fbm(x * 0.01, z * 0.01, 2);
  cA.copy(MEADOW).lerp(HILL, ss(4, 60, y)).lerp(FOREST, ss(40, 160, y) * ss(0.3, 0.7, fbm(x * 0.004 + 9, z * 0.004, 3)));
  cA.lerp(ROCK, ss(220, 420, y + n * 60) * 0.85).lerp(DARKROCK, ss(0.32, 0.55, slope));
  cA.lerp(SNOW, ss(560, 640, y + (n - 0.5) * 120) * (1 - ss(0.45, 0.6, slope)));
  const r = riverNear(x, z); if (r && r.d < 40) cA.lerp(SAND, 1 - ss(18, 40, r.d));
  tcol[i * 3] = cA.r; tcol[i * 3 + 1] = cA.g; tcol[i * 3 + 2] = cA.b;
}
tg.setAttribute('color', new THREE.BufferAttribute(tcol, 3));
const terrain = new THREE.Mesh(tg, C.surface(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 }), 'terrain'));
terrain.receiveShadow = true; terrain.renderOrder = 2; scene.add(terrain);
if (C.grass) C.grass.visible = false;

/* ---------- orman: tepelerde çam kümeleri, vadide yapraklı ağaçlar (örnekli, gölge düşürmez) ---------- */
const rnd = C.rng(5151), d = new THREE.Object3D(), spots = [], leafy = [];
for (let n = 0; n < 60000 * C.Q.forest && spots.length < 15000 * C.Q.forest; n++) {   // kaliteye göre seyrek
  const x = (rnd() * 2 - 1) * 3600, z = (rnd() * 2 - 1) * 3600, dBox = Math.max(Math.abs(x), Math.abs(z)) - half;
  if (dBox < 25) continue;
  const y = H(x, z), sl = Math.hypot(H(x + 4, z) - y, H(x, z + 4) - y) / 4;
  if (y > 470 || sl > 0.85) continue;
  const r = riverNear(x, z); if (r && r.d < 28) continue;
  const q = roadNear(x, z); if (q && q.d < 16) continue;
  const dens = ss(0.38, 0.62, fbm(x * 0.0045 + 9, z * 0.0045, 3)) * (1 - ss(300, 470, y));
  if (rnd() > dens) continue;
  (y < 30 && rnd() < 0.55 ? leafy : spots).push([x, y, z, 0.8 + rnd() * 0.9]);
}
const pineG = C.mergeGeos([new THREE.CylinderGeometry(0.2, 0.3, 2.2, 5).translate(0, 1.1, 0), new THREE.ConeGeometry(2.1, 4.2, 7).translate(0, 3.6, 0), new THREE.ConeGeometry(1.5, 3.4, 7).translate(0, 5.9, 0)]);
const leafG = C.mergeGeos([new THREE.CylinderGeometry(0.15, 0.24, 2.4, 5).translate(0, 1.2, 0), new THREE.IcosahedronGeometry(1.8, 1).translate(0, 3.8, 0), new THREE.IcosahedronGeometry(1.2, 1).translate(0.8, 3.3, 0.4)]);
function forest(geo, list, pal) {
  const m = new THREE.InstancedMesh(geo, C.surface(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 }), 'tree'), Math.max(1, list.length));
  m.frustumCulled = false; m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1, list.length) * 3), 3);
  list.forEach((p, k) => { d.position.set(p[0], p[1] - 0.2, p[2]); d.rotation.set(0, rnd() * 6.28, 0); d.scale.set(p[3], p[3] * (0.85 + rnd() * 0.4), p[3]); d.updateMatrix(); m.setMatrixAt(k, d.matrix); m.setColorAt(k, pal[(rnd() * pal.length) | 0]); });
  m.instanceMatrix.needsUpdate = m.instanceColor.needsUpdate = true; m.renderOrder = 2; scene.add(m); return m;
}
forest(pineG, spots, ['#2f5a33', '#3a6b3c', '#2b4f2e', '#456f41'].map(C.col));
forest(leafG, leafy, ['#5c9a45', '#4f8a3c', '#6aa04a', '#c9922f', '#b8742a'].map(C.col));

/* ---------- akarsu: yüzeyde akan çizgiler (doku kaydırılır) ---------- */
const wcv = document.createElement('canvas'); wcv.width = 64; wcv.height = 256;
{ const x = wcv.getContext('2d'); x.fillStyle = '#3d7a96'; x.fillRect(0, 0, 64, 256); const r = C.rng(3);
  for (let k = 0; k < 70; k++) { x.fillStyle = `rgba(255,255,255,${0.05 + r() * 0.12})`; x.fillRect(r() * 64, r() * 256, 1 + r() * 3, 8 + r() * 30); } }
const wtex = new THREE.CanvasTexture(wcv); wtex.wrapS = wtex.wrapT = THREE.RepeatWrapping; wtex.encoding = THREE.sRGBEncoding; wtex.anisotropy = C.maxAniso;
function ribbon(line, width, yOf, uvLen, stepK) {
  const pos = [], uv = [], idx = [];
  for (let i = 0; i < line.length; i += stepK) {
    const p = line[i], nx = -p.tz, nz = p.tx, y = yOf(p);
    pos.push(p.x - nx * width / 2, y, p.z - nz * width / 2, p.x + nx * width / 2, y, p.z + nz * width / 2);
    uv.push(0, p.s / uvLen, 1, p.s / uvLen);
    const n = pos.length / 3; if (n >= 4) idx.push(n - 4, n - 2, n - 3, n - 3, n - 2, n - 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals(); return g;
}
const water = new THREE.Mesh(ribbon(river, 30, p => waterY(p.x), 60, 1), new THREE.MeshStandardMaterial({ map: wtex, roughness: 0.12, metalness: 0.15, side: THREE.DoubleSide }));
water.receiveShadow = true; water.renderOrder = 2; scene.add(water);
C.updaters.push(dt => { wtex.offset.y -= dt * 0.18; });        // batıya akış

/* ---------- yol: asfalt, şerit çizgileri, bariyerler, aydınlatma, tünel ağzı ---------- */
const rcv = document.createElement('canvas'); rcv.width = 128; rcv.height = 256;
{ const x = rcv.getContext('2d'); x.fillStyle = '#34383e'; x.fillRect(0, 0, 128, 256);
  x.fillStyle = '#e9e7de'; x.fillRect(8, 0, 3, 256); x.fillRect(117, 0, 3, 256);
  x.fillStyle = '#f2c230'; x.fillRect(62, 0, 2, 256); x.fillRect(65, 0, 2, 256);
  x.fillStyle = '#e9e7de'; for (let y = 0; y < 256; y += 64) { x.fillRect(35, y, 3, 32); x.fillRect(90, y, 3, 32); } }
const rtex = new THREE.CanvasTexture(rcv); rtex.wrapS = rtex.wrapT = THREE.RepeatWrapping; rtex.encoding = THREE.sRGBEncoding; rtex.anisotropy = C.maxAniso;
const ROAD_W = 15;
const asphalt = new THREE.Mesh(ribbon(road, ROAD_W, p => roadY(p.s) + 0.04, 24, 1), C.surface(new THREE.MeshStandardMaterial({ map: rtex, roughness: 0.92, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), 'road'));
asphalt.receiveShadow = true; scene.add(asphalt);
/* bariyerler: iki yanda metal şerit; direkler örnekli */
for (const side of [-1, 1]) {
  const off = road.map(p => ({ x: p.x - p.tz * side * (ROAD_W / 2 + 0.4), z: p.z + p.tx * side * (ROAD_W / 2 + 0.4), s: p.s, tx: p.tx, tz: p.tz }));
  const pos = [], idx = [];
  for (let i = 25; i < off.length; i += 2) { const p = off[i], y = roadY(p.s); pos.push(p.x, y + 0.45, p.z, p.x, y + 0.8, p.z); const n = pos.length / 3; if (n >= 4) idx.push(n - 4, n - 3, n - 2, n - 3, n - 1, n - 2); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  scene.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: C.col('#a7adb3'), roughness: 0.4, metalness: 0.6, side: THREE.DoubleSide })));
}
const lampK = []; for (let i = 30; i < road.length - 10; i += 12) lampK.push(i);
const poleG = new THREE.CylinderGeometry(0.09, 0.13, 8, 6).translate(0, 4, 0), headG = new THREE.BoxGeometry(1.6, 0.18, 0.4);
const poles = C.inst(poleG, new THREE.MeshStandardMaterial({ color: C.col('#5b6066'), roughness: 0.6 }), lampK.length);
const headMat = new THREE.MeshStandardMaterial({ color: C.col('#3b4046'), emissive: C.col('#ffd9a0'), emissiveIntensity: 0 });
const heads = C.inst(headG, headMat, lampK.length);
lampK.forEach((k, i) => {
  const p = road[k], side = i % 2 ? 1 : -1, nx = -p.tz * side, nz = p.tx * side, y = roadY(p.s), ry = Math.atan2(-p.tz, p.tx) + Math.PI / 2;
  C.setM(poles, i, p.x + nx * (ROAD_W / 2 + 1), y, p.z + nz * (ROAD_W / 2 + 1), 0);
  C.setM(heads, i, p.x + nx * (ROAD_W / 2 - 0.2), y + 8, p.z + nz * (ROAD_W / 2 - 0.2), ry);
});
poles.instanceMatrix.needsUpdate = heads.instanceMatrix.needsUpdate = true; scene.add(poles, heads);
C.nightListeners.push(n => { headMat.emissiveIntensity = n * 2.2; });
/* tünel ağzı: beton kemer ve karanlık iç */
{
  const p = road[road.length - 1], g = new THREE.Group(), y = roadY(p.s), th = Math.atan2(-p.tz, p.tx);
  g.position.set(p.x, y, p.z); g.rotation.y = th + Math.PI / 2;
  const conc = new THREE.MeshStandardMaterial({ color: C.col('#9a968c'), roughness: 0.9 });
  const add = (m, sx, sy, sz, x, yy, z) => { const o = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), m); o.position.set(x, yy, z); g.add(o); return o; };
  /* dağa yaslanan büyük ön duvar: kaba arazi ızgarası nereye denk gelirse gelsin ağzı temiz gösterir */
  add(conc, 56, 34, 4, 0, 14, 4.5);
  for (const s of [-1, 1]) add(conc, 3, 9.5, 5, s * (ROAD_W / 2 + 1.5), 4.75, 0.5);
  add(conc, ROAD_W + 6, 3.2, 5, 0, 9.1, 0.5);
  const dark = new THREE.Mesh(new THREE.PlaneGeometry(ROAD_W, 7.6), new THREE.MeshBasicMaterial({ color: 0x050607 })); dark.position.set(0, 3.8, 2.4); dark.rotation.y = Math.PI; g.add(dark);
  const glowM = new THREE.MeshBasicMaterial({ color: C.col('#ffd9a0') });
  for (let k = -3; k <= 3; k++) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.2), glowM); l.position.set(k * 2, 7.4, 2.3); g.add(l); }   // tünel içi lambalar
  scene.add(g);
}
/* trafiğin kullanacağı yol: noktalar, uzunluk, yükseklik */
C.highway = { pts: road, L: roadL, y: roadY, lane: C.LANE + 0.9, startNode: [C.N, C.MID] };

/* ---------- sis ve uzak düzlem: dağlar puslu bir silüet olsun ---------- */
scene.fog.near = 1100 * C.Q.far / 8500; scene.fog.far = C.Q.far - 700;
C.fogBase = { near: scene.fog.near, far: scene.fog.far };          // weather.js sisi, yağışı buna göre daraltır
C.camera.far = C.Q.far; C.camera.updateProjectionMatrix();
})();
