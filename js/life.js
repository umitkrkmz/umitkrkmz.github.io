/* ===== life.js: otobüs hatları, duraklar ve bekleyen yolcular ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene, B = C.SW, R = C.roads;
const boxG = new THREE.BoxGeometry(1, 1, 1), sphG = new THREE.SphereGeometry(1, 10, 8), cylG = new THREE.CylinderGeometry(1, 1, 1, 10);
const std = (hex, r, m, extra) => new THREE.MeshStandardMaterial(Object.assign({ color: C.col(hex), roughness: r === undefined ? 0.6 : r, metalness: m || 0 }, extra));
const pick = a => a[(Math.random() * a.length) | 0];

/* bloğun bir yüzüne bitişik şerit (events.js'deki gibi): bi, bj blok; side px | nx | pz | nz */
function curbEdge(bi, bj, side) {
  const n = R.nodeId;
  const ab = side === 'pz' ? [n(bi + 1, bj + 1), n(bi, bj + 1)] : side === 'nz' ? [n(bi, bj), n(bi + 1, bj)]
    : side === 'px' ? [n(bi + 1, bj), n(bi + 1, bj + 1)] : [n(bi, bj + 1), n(bi, bj)];
  return R.edgeAt.get(ab[0] * 4096 + ab[1]);
}

/* ---------- hatlar: duraklar blok, yüz; durak yüzün ortasından 12 m ileride (ağaç ve lambaların arası) ---------- */
const LINES = [
  { no: '12', color: '#c62828', stops: [[2, 3, 'nz'], [6, 2, 'nz'], [10, 3, 'px'], [10, 8, 'pz'], [5, 10, 'pz'], [2, 7, 'nx']] },
  { no: '34', color: '#1f5fa8', stops: [[4, 5, 'px'], [8, 6, 'nz'], [11, 10, 'px'], [7, 11, 'pz'], [3, 11, 'nx']] }
];
const glass = std('#a9c6d6', 0.1, 0.1, { transparent: true, opacity: 0.35 }), frame = std('#3b4046', 0.5, 0.4), bench = std('#7a5a3a', 0.8);
function plate(text, bg, fg, w, h) {
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = Math.round(256 * h / w);
  const x = cv.getContext('2d'); x.fillStyle = bg; x.fillRect(0, 0, cv.width, cv.height);
  x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = `800 ${Math.round(cv.height * 0.72)}px "Big Shoulders Display","Arial Narrow",sans-serif`; x.fillText(text, cv.width / 2, cv.height / 2 + 2);
  const t = new THREE.CanvasTexture(cv); t.encoding = THREE.sRGBEncoding; t.anisotropy = C.maxAniso;
  const m = new THREE.MeshStandardMaterial({ map: t, roughness: 0.6, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0.15 });
  C.nightListeners.push(n => { m.emissiveIntensity = 0.15 + n * 0.8; });
  return m;
}
const durakMat = plate('DURAK', '#f2c230', '#16212b', 3, 1);
const part = (g, geo, mat, x, y, z, sx, sy, sz) => {
  const m = geo === boxG ? new THREE.Mesh(C.roundBox(sx, sy, sz, Math.min(0.35, Math.min(sx, sy, sz) * 0.22)), mat) : new THREE.Mesh(geo, mat);
  if (geo !== boxG) m.scale.set(sx, sy, sz);
  m.position.set(x, y, z); m.castShadow = true; g.add(m); return m;
};
const shirt = ['#c9372c', '#2f6f8f', '#e8e2d0', '#3b7a57', '#d29a2d', '#6b4e8f', '#222b33', '#b3566b'].map(h => std(h, 0.9));
const skin = ['#f1c9a5', '#d9a37c', '#a8734f', '#7a4e33'].map(h => std(h, 0.9));

const stopRoot = new THREE.Group(); scene.add(stopRoot); C.streetLayers.push(stopRoot);
const waitCrowd = new C.Crowd(64); let waitCrowdN = 0; const wpose = {};
scene.add(waitCrowd.group); C.peopleLayers.push(waitCrowd.group);
const MAXWAIT = 5;
function makeStop(bi, bj, side, line) {
  const e = curbEdge(bi, bj, side); if (!e) return null;
  const bx = C.blockC(bi), bz = C.blockC(bj), s = C.clamp((bx - e.ox) * e.dx + (bz - e.oz) * e.dz + 12, 6, e.len - 6);
  const rx = -e.dz, rz = e.dx, off = C.ROAD / 2 - C.LANE + 0.75;          // şerit ortasından kaldırımın 0,75 m içine
  const x = e.ox + e.dx * s + rx * off, z = e.oz + e.dz * s + rz * off;
  const g = new THREE.Group(); g.position.set(x, B, z); g.rotation.y = Math.atan2(-e.dz, e.dx); stopRoot.add(g);
  /* yerel çerçeve: +x yol boyunca, +z kaldırımın içine doğru */
  part(g, boxG, glass, 0, 1.1, 0.5, 3.4, 2.2, 0.05);
  for (const sx of [-1.7, 1.7]) { part(g, boxG, glass, sx, 1.1, 0, 0.05, 2.2, 1.0); part(g, boxG, frame, sx, 1.15, 0.5, 0.08, 2.3, 0.08); }
  part(g, boxG, frame, 0, 2.3, 0, 3.6, 0.08, 1.3);
  part(g, boxG, bench, 0, 0.45, 0.32, 2.4, 0.08, 0.4);
  part(g, cylG, frame, 2.3, 1.3, -0.3, 0.05, 2.6, 0.05);
  const sign = part(g, boxG, durakMat, 2.3, 2.45, -0.3, 0.9, 0.3, 0.04);
  part(g, boxG, plate(line.no, line.color, '#ffffff', 1, 1), 2.3, 2.05, -0.3, 0.4, 0.4, 0.045);
  sign.castShadow = false;
  const people = [];
  for (let k = 0; k < MAXWAIT; k++) {
    const i = waitCrowdN++; waitCrowd.look(i, C.randomLook());
    people.push({ i, x: x + e.dx * (k - 2) * 0.65 - rx * 0.05 * k, z: z + e.dz * (k - 2) * 0.65 - rz * 0.05 * k, ry: Math.atan2(rz, -rx) + (Math.random() - 0.5) * 0.8, on: false });
  }
  return { e, s, line, people, waiting: 1 + ((Math.random() * 3) | 0), spawn: 4 + Math.random() * 8 };
}
const showWaiting = st => st.people.forEach((p, k) => { p.on = k < st.waiting; if (!p.on) waitCrowd.hide(p.i); });

/* ---------- otobüs modeli: +x ileri ---------- */
function makeBus(line) {
  const g = new THREE.Group(), body = std(line.color, 0.45, 0.2), white = std('#f2f2ee', 0.45, 0.2), dark = std('#15181b', 0.8), win = std('#1c2630', 0.15, 0.4);
  part(g, boxG, dark, 0, 0.45, 0, 10.4, 0.5, 2.3);
  part(g, boxG, white, 0, 1.55, 0, 11, 2.2, 2.5);
  part(g, boxG, body, 0, 0.95, 0, 11.02, 0.9, 2.52);
  part(g, boxG, body, 0, 2.7, 0, 11.02, 0.15, 2.52);
  part(g, boxG, win, -0.4, 1.95, 0, 9.6, 0.85, 2.54);
  part(g, boxG, win, 5.48, 1.85, 0, 0.06, 1.3, 2.2);
  const no = plate(line.no, '#16212b', '#ffb53d', 1.6, 0.5);
  part(g, boxG, no, 5.52, 2.5, 0, 0.04, 0.4, 1.3).castShadow = false;
  for (const z of [-1.27, 1.27]) part(g, boxG, no, 3.6, 2.45, z, 1.4, 0.35, 0.04).castShadow = false;
  return g;
}
const busRoot = new THREE.Group(); scene.add(busRoot); C.carLayers.push(busRoot);
const buses = [], stops = [];
function routeBus(bus) {
  const st = bus.line.stopList[bus.stopNo];
  bus.t = 0; bus.still = 0; C.setRoute(bus, st.e, st.s);
}
function parkPose(v) {
  const e = v.e, rx = -e.dz, rz = e.dx;
  v.group.position.set(e.ox + e.dx * v.s + rx * 2.0, 0, e.oz + e.dz * v.s + rz * 2.0);
  v.group.rotation.y = Math.atan2(-e.dz, e.dx);
}
let built = false;
function build() {
  built = true;
  for (const line of LINES) {
    line.stopList = line.stops.map(([i, j, sd]) => makeStop(i, j, sd, line)).filter(Boolean);
    stops.push(...line.stopList); line.stopList.forEach(showWaiting);
    const n = line.stopList.length;
    for (const k of [0, Math.floor(n / 2)]) {
      const st = line.stopList[k], g = makeBus(line); busRoot.add(g);
      const bus = { special: true, siren: false, len: 11, v0: 10, group: g, line, stopNo: (k + 1) % n, state: 'drive', dwell: 0, t: 0, still: 0 };
      bus.model = (x, z, ry) => { g.position.set(x, 0, z); g.rotation.y = ry; };
      C.spawnCar(bus, st.e, Math.max(2, st.s - 8)); routeBus(bus); buses.push(bus);
    }
  }
}

C.updaters.push((dt, t) => {
  if (!built) { if (!C.cars) return; build(); }
  for (const st of stops) for (const p of st.people) if (p.on) waitCrowd.set(p.i, p.x, B, p.z, p.ry, C.pose('stand', t + p.i, wpose));
  waitCrowd.commit();
  for (const st of stops) if (st.waiting < MAXWAIT && (st.spawn -= dt) <= 0) { st.waiting++; st.spawn = 6 + Math.random() * 10; showWaiting(st); }
  for (const bus of buses) {
    if (bus.state === 'drive') {
      bus.t += dt;
      const onGoal = bus.e === bus.stopEdge && bus.s > -0.1;
      bus.still = onGoal && bus.v < 0.15 ? bus.still + dt : 0;
      if ((onGoal && (bus.stopS - bus.s < 2.5 || bus.still > 2)) || bus.t > 150) {
        C.parkCar(bus); parkPose(bus); bus.state = 'dwell'; bus.dwell = 5; bus.board = 0.6; bus.at = bus.line.stopList[bus.stopNo];
      }
    } else {
      bus.dwell -= dt;
      const st = bus.at;
      if (st.waiting > 0 && (bus.board -= dt) <= 0) { st.waiting--; bus.board = 0.6; showWaiting(st); }   // yolcular birer birer biner
      if (bus.dwell <= 0) {
        C.unparkCar(bus); bus.state = 'drive';
        bus.stopNo = (bus.stopNo + 1) % bus.line.stopList.length; routeBus(bus);
      }
    }
  }
});
C.transit = { lines: LINES, buses, stops };
})();
