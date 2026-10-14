/* ===== traffic.js: şeritler, araçlar, trafik ışıkları, yayalar ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene, N = C.N, TOTAL = C.TOTAL, L = TOTAL;
C.density = 0.5; C.carLayers = []; C.peopleLayers = []; C.signalLayers = [];
const MAXPER = 12;

/* ---------- şeritler: sağdan akış ---------- */
const lanes = [];
for (const axis of ['x', 'z']) for (let j = 0; j <= N; j++) for (const dir of [1, -1]) {
  const c = C.roadX(j);
  const perp = axis === 'x' ? c + (dir === 1 ? C.LANE : -C.LANE) : c + (dir === 1 ? -C.LANE : C.LANE);
  const stops = [];
  for (let k = 0; k <= N; k++) {
    const ck = C.roadX(k), u = dir === 1 ? ck + TOTAL / 2 : TOTAL / 2 - ck;
    stops.push(u - (C.ROAD / 2 + 3.2));
  }
  stops.sort((a, b) => a - b);
  lanes.push({ axis, dir, perp, stops, cars: [] });
}
const MAXC = lanes.length * MAXPER;

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
parts.forEach(p => { p.count = 0; p.castShadow = true; scene.add(p); C.carLayers.push(p); });
const CAR_COLORS = ['#c9372c', '#1f5fa8', '#e8e8e8', '#2b2d31', '#f2b705', '#2f8f5b', '#8d939a', '#ffffff', '#6b3fa0', '#d9822b'].map(C.col);

C.setDensity = function (d) {
  C.density = d;
  const per = Math.round(d * MAXPER), r = C.rng(1234);
  let idx = 0;
  for (const lane of lanes) {
    lane.cars = [];
    for (let k = 0; k < per; k++) {
      const u = L * (1 - (k + 0.5) / per) + (r() - 0.5) * (L / per) * 0.3;
      const car = { u, v: 0, v0: 9 + r() * 4, len: 4.6, idx: idx++ };
      parts[0].setColorAt(car.idx, CAR_COLORS[(r() * CAR_COLORS.length) | 0]);
      lane.cars.push(car);
    }
  }
  parts.forEach(p => p.count = idx);
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
const dm = new THREE.Object3D();
C.updateTraffic = function (dt) {
  simT += dt;
  const ph = phaseOf(simT);
  if (ph !== lastPhase) { lastPhase = ph; lightX = ph[0]; lightZ = ph[1]; paintLamps(lightX, lightZ); }
  for (const lane of lanes) {
    const cars = lane.cars, n = cars.length; if (!n) continue;
    const st = lane.axis === 'x' ? lightX : lightZ;
    for (let k = 0; k < n; k++) {
      const car = cars[k];
      let gap = 1e9;
      if (n > 1) { const lead = cars[(k + n - 1) % n]; gap = (k === 0 ? lead.u + L - car.u : lead.u - car.u) - car.len; }
      let sgap = 1e9;
      if (st !== 'g') {
        for (const S of lane.stops) {
          const d = S - (car.u + car.len * 0.5);
          if (d > -0.4) { if (st === 'r' || d > car.v * car.v / 12 + 1.5) sgap = d; break; }
        }
      }
      const free = Math.max(0, Math.min(gap, sgap) - 1.5);
      const des = Math.min(car.v0, Math.sqrt(9 * free));
      car.v = car.v < des ? Math.min(des, car.v + 3 * dt) : Math.max(des, car.v - 9 * dt);
      car.u += car.v * dt;
    }
    while (cars[0].u > L) { cars[0].u -= L; cars.push(cars.shift()); }
    for (const car of cars) {
      const coord = lane.dir === 1 ? -TOTAL / 2 + car.u : TOTAL / 2 - car.u;
      const s = Math.max(0.001, C.clamp(Math.min(car.u, L - car.u) / 8, 0, 1));
      let x, z, ry;
      if (lane.axis === 'x') { x = coord; z = lane.perp; ry = lane.dir === 1 ? 0 : Math.PI; }
      else { x = lane.perp; z = coord; ry = lane.dir === 1 ? -Math.PI / 2 : Math.PI / 2; }
      dm.position.set(x, C.SW * 0, z); dm.rotation.set(0, ry, 0); dm.scale.set(s, s, s); dm.updateMatrix();
      for (const p of parts) p.setMatrixAt(car.idx, dm.matrix);
    }
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
