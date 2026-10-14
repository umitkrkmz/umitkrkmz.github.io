/* ===== world.js: sahne, ışık, gökyüzü, yol ağı ===== */
(function () {
'use strict';
const C = window.C = {};
C.N = 9; C.BLOCK = 44; C.ROAD = 12; C.PITCH = 56;
C.TOTAL = C.N * C.PITCH + C.ROAD;            // 516 m
C.SW = 0.3; C.FLOOR_H = 3.2; C.CELL_W = 3.6; C.LANE = 2.6;
C.roadX = i => -C.TOTAL / 2 + C.ROAD / 2 + i * C.PITCH;
C.blockC = i => -C.TOTAL / 2 + C.ROAD + C.BLOCK / 2 + i * C.PITCH;
C.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
C.rng = function (seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
};
C.night = 0; C.hour = 16.5; C.nightListeners = []; C.updaters = [];

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
} catch (err) {
  C.failed = true;
  const n = document.getElementById('nogl'); if (n) n.hidden = false;
  return;
}
const stage = document.getElementById('stage');
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);
C.renderer = renderer;
C.col = hex => new THREE.Color(hex).convertSRGBToLinear();
C.maxAniso = renderer.capabilities.getMaxAnisotropy();
C.dummy = new THREE.Object3D();

const scene = C.scene = new THREE.Scene();
const camera = C.camera = new THREE.PerspectiveCamera(50, 1, 0.4, 4000);
scene.fog = new THREE.Fog(0x88aadd, 650, 2600);

C.resize = function () {
  const w = stage.clientWidth || window.innerWidth, h = stage.clientHeight || window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h; camera.updateProjectionMatrix();
};
window.addEventListener('resize', C.resize); C.resize();

/* örnekli (instanced) mesh yardımcıları */
C.inst = function (geo, mat, n) {
  const m = new THREE.InstancedMesh(geo, mat, n);
  m.frustumCulled = false; return m;
};
C.setM = function (mesh, i, x, y, z, ry, sx, sy, sz) {
  const d = C.dummy;
  d.position.set(x, y, z); d.rotation.set(0, ry || 0, 0);
  d.scale.set(sx === undefined ? 1 : sx, sy === undefined ? 1 : sy, sz === undefined ? 1 : sz);
  d.updateMatrix(); mesh.setMatrixAt(i, d.matrix);
};

/* ---------- ışıklar ---------- */
const hemi = C.hemi = new THREE.HemisphereLight(0xffffff, 0x3a3f45, 0.6);
const sun = C.sun = new THREE.DirectionalLight(0xfff2dc, 1.5);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.35;
sun.shadow.camera.near = 10; sun.shadow.camera.far = 1600;
const moon = new THREE.DirectionalLight(0x8fa8ff, 0.2);
scene.add(hemi, sun, sun.target, moon);
C.sunDir = new THREE.Vector3(0, 1, 0);

/* ---------- gökyüzü: güneş, ay, yıldızlar ---------- */
const sunOrb = new THREE.Mesh(new THREE.SphereGeometry(70, 16, 12), new THREE.MeshBasicMaterial({ color: 0xfff0c0, fog: false }));
const moonOrb = new THREE.Mesh(new THREE.SphereGeometry(48, 16, 12), new THREE.MeshBasicMaterial({ color: 0xdfe8ff, fog: false }));
scene.add(sunOrb, moonOrb);
const sg = new THREE.BufferGeometry(); const sp = new Float32Array(900 * 3); const sr = C.rng(99);
for (let i = 0; i < 900; i++) {
  const th = sr() * Math.PI * 2, ph = Math.acos(sr() * 0.95 + 0.05);
  sp[i * 3] = 2500 * Math.sin(ph) * Math.cos(th); sp[i * 3 + 1] = 2500 * Math.cos(ph); sp[i * 3 + 2] = 2500 * Math.sin(ph) * Math.sin(th);
}
sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 1.8, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false }));
scene.add(stars);

const SKY = { night: C.col('#070c18'), twi: C.col('#e0895c'), day: C.col('#86bdf0') };
const tmpDir = new THREE.Vector3();
C.applyTime = function (h) {
  C.hour = h;
  const a = (h - 6) / 12 * Math.PI;
  const e = Math.sin(a);
  const dir = tmpDir.set(Math.cos(a), Math.sin(a), 0.35).normalize();
  C.sunDir.copy(dir);
  let sky;
  if (e >= 0.3) sky = SKY.day.clone();
  else if (e >= 0.05) sky = SKY.twi.clone().lerp(SKY.day, (e - 0.05) / 0.25);
  else if (e >= -0.15) sky = SKY.night.clone().lerp(SKY.twi, (e + 0.15) / 0.2);
  else sky = SKY.night.clone();
  /* sis rengi shader'da sRGB'ye çevrilir; arka plan ise olduğu gibi yazılır, bu yüzden ters çeviriyoruz */
  scene.background = sky.clone().convertLinearToSRGB(); scene.fog.color.copy(sky);
  C.night = C.clamp((0.12 - e) / 0.3, 0, 1);
  const day = C.clamp(e * 3, 0, 1);
  sun.intensity = day * 1.7;
  sun.color.copy(C.col('#ffb27a')).lerp(C.col('#fff4e2'), C.clamp(e * 2.5, 0, 1));
  moon.intensity = (1 - day) * 0.32;
  moon.position.set(-dir.x * 500, Math.max(120, -dir.y * 500), -dir.z * 500);
  hemi.intensity = 0.2 + 0.6 * day;
  hemi.color.copy(sky).lerp(C.col('#ffffff'), 0.45);
  stars.material.opacity = C.clamp(-e * 3.5, 0, 1); stars.visible = stars.material.opacity > 0.01;
  sunOrb.position.copy(dir).multiplyScalar(2600); sunOrb.visible = e > -0.06;
  moonOrb.position.copy(dir).multiplyScalar(-2600); moonOrb.visible = e < 0.1;
  for (const f of C.nightListeners) f(C.night);
};

/* ---------- zemin ve asfalt ---------- */
const grass = new THREE.Mesh(new THREE.PlaneGeometry(9000, 9000), new THREE.MeshStandardMaterial({ color: C.col('#66724f'), roughness: 1 }));
grass.rotation.x = -Math.PI / 2; grass.position.y = -0.1; grass.receiveShadow = true; scene.add(grass);
const asphalt = new THREE.Mesh(new THREE.PlaneGeometry(C.TOTAL, C.TOTAL), new THREE.MeshStandardMaterial({ color: C.col('#2c3036'), roughness: 0.95 }));
asphalt.rotation.x = -Math.PI / 2; asphalt.receiveShadow = true; scene.add(asphalt);

/* ---------- yol çizgileri ve yaya geçitleri ---------- */
(function () {
  const dashes = [], bars = [], half = C.TOTAL / 2;
  for (let j = 0; j <= C.N; j++) {
    const c = C.roadX(j);
    for (let t = -half + 4; t < half - 2; t += 7) {
      let skip = false;
      for (let k = 0; k <= C.N; k++) if (Math.abs(t - C.roadX(k)) < C.ROAD / 2 + 3.2) { skip = true; break; }
      if (skip) continue;
      dashes.push([t, c, 3.2, 0.22]); dashes.push([c, t, 0.22, 3.2]);
    }
  }
  const off = C.ROAD / 2 + 1.6;
  for (let i = 0; i <= C.N; i++) for (let j = 0; j <= C.N; j++) {
    const X = C.roadX(i), Z = C.roadX(j);
    for (const s of [-1, 1]) {
      const px = X + s * off, pz = Z + s * off;
      if (Math.abs(px) < half - 1) for (let k = -4; k <= 4; k++) bars.push([px, Z + k * 1.25, 2.4, 0.55]);
      if (Math.abs(pz) < half - 1) for (let k = -4; k <= 4; k++) bars.push([X + k * 1.25, pz, 0.55, 2.4]);
    }
  }
  const mat = new THREE.MeshStandardMaterial({ color: C.col('#e9e7de'), roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const geo = new THREE.BoxGeometry(1, 0.02, 1);
  const all = dashes.concat(bars);
  const mk = C.inst(geo, mat, all.length);
  all.forEach((d, i) => C.setM(mk, i, d[0], 0.02, d[1], 0, d[2], 1, d[3]));
  mk.instanceMatrix.needsUpdate = true; mk.receiveShadow = true;
  scene.add(mk); C.markings = mk;
})();

C.applyTime(C.hour);
})();
