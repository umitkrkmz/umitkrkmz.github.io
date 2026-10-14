/* ===== world.js: sahne, ışık, gökyüzü, yol ağı ===== */
(function () {
'use strict';
const C = window.C = {};
C.N = 17; C.BLOCK = 44; C.ROAD = 12; C.PITCH = 56;
C.TOTAL = C.N * C.PITCH + C.ROAD;            // 964 m
C.MID = (C.N - 1) / 2;                       // meydan bloğu (N tek olmalı)
C.SCALE = C.TOTAL / 516;                     // ilk 9x9 şehre göre kamera ve sis ölçeği
C.SW = 0.3; C.FLOOR_H = 3.2; C.CELL_W = 3.6; C.LANE = 2.6;
C.roadX = i => -C.TOTAL / 2 + C.ROAD / 2 + i * C.PITCH;
C.blockC = i => -C.TOTAL / 2 + C.ROAD + C.BLOCK / 2 + i * C.PITCH;
C.districtAt = (x, z) => C.districtOf(C.clamp(Math.round((x - C.blockC(0)) / C.PITCH), 0, C.N - 1), C.clamp(Math.round((z - C.blockC(0)) / C.PITCH), 0, C.N - 1));
C.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
/* ilçeler: şehir 3x3 bölgeye ayrılır; her ilçenin bina dokusu (gökdelen, apartman, müstakil ev eğilimi) ve kaldırım tonu farklı */
C.DISTRICTS = [
  { name: 'Yeşiltepe', tint: '#9ccf86', tower: 0.15, mid: 0.7, house: 2.2 }, { name: 'Çınaraltı', tint: '#d9c28a', tower: 0.6, mid: 1.25, house: 0.8 }, { name: 'Akpınar', tint: '#8fc4d9', tower: 0.25, mid: 0.85, house: 1.8 },
  { name: 'Gülbahçe', tint: '#e2a3a3', tower: 0.5, mid: 1.15, house: 1.2 }, { name: 'Saatçi', tint: '#e8e2d0', tower: 1.35, mid: 1.0, house: 0.3 }, { name: 'Değirmendere', tint: '#c7b0dd', tower: 0.55, mid: 1.2, house: 1.0 },
  { name: 'Taşbayır', tint: '#c9b79a', tower: 0.15, mid: 0.75, house: 2.0 }, { name: 'Kuyubaşı', tint: '#a9d1b8', tower: 0.45, mid: 1.25, house: 1.1 }, { name: 'Limanköy', tint: '#9fb6e0', tower: 0.2, mid: 0.8, house: 2.1 }
];
const DS = [Math.floor(C.N / 3), Math.ceil(C.N * 2 / 3)], dpart = v => v < DS[0] ? 0 : v < DS[1] ? 1 : 2;
C.districtOf = (i, j) => C.DISTRICTS[dpart(j) * 3 + dpart(i)];
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
C.coarse = window.matchMedia('(pointer:coarse)').matches;
/* keskinlik: masaüstünde yüksek çözünürlüklü ekranda tam 2x, dokunmatikte pil ve ısı için 1,5x */
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, C.coarse ? 1.5 : 2));
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
scene.fog = new THREE.Fog(0x88aadd, 650 * C.SCALE, 2600 * C.SCALE);

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

/* yuvarlak kenarlı kutu: bölütler kenarlara toplanır, köşeler r yarıçapında küreye yaslanır, normaller yumuşak.
   Kutunun yüz grupları ve UV'leri korunur (yüz başına malzeme verilebilir). */
const rbCache = new Map();
C.roundBox = function (w, h, d, r, k) {
  k = k || 2; const key = [w, h, d, r, k].join(','); if (rbCache.has(key)) return rbCache.get(key);
  const n = 2 * k + 1, g = new THREE.BoxGeometry(w, h, d, n, n, n), p = g.attributes.position, nr = g.attributes.normal;
  const hx = w / 2, hy = h / 2, hz = d / 2; r = Math.min(r, hx, hy, hz) * 0.999;
  const remap = (c, half) => { const i = Math.round((c / half + 1) / 2 * n); return i <= k ? -half + r * i / k : half - r * (n - i) / k; };
  const v = new THREE.Vector3(), q = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.set(remap(p.getX(i), hx), remap(p.getY(i), hy), remap(p.getZ(i), hz));
    q.set(C.clamp(v.x, -hx + r, hx - r), C.clamp(v.y, -hy + r, hy - r), C.clamp(v.z, -hz + r, hz - r));
    v.sub(q);
    if (v.lengthSq() > 1e-12) { v.normalize(); nr.setXYZ(i, v.x, v.y, v.z); v.multiplyScalar(r); }
    v.add(q); p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeBoundingSphere(); rbCache.set(key, g); return g;
};
/* birden çok geometriyi tek geometride birleştirir (konum ve normal); örnekli çizimde parçalar tek matris paylaşır */
C.mergeGeos = function (list) {
  const gs = list.map(g => g.index ? g.toNonIndexed() : g);
  let n = 0; for (const g of gs) n += g.attributes.position.count;
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3); let o = 0;
  for (const g of gs) { pos.set(g.attributes.position.array, o * 3); nor.set(g.attributes.normal.array, o * 3); o += g.attributes.position.count; }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.computeBoundingSphere(); return out;
};

/* ---------- ışıklar ---------- */
const hemi = C.hemi = new THREE.HemisphereLight(0xffffff, 0x3a3f45, 0.6);
const sun = C.sun = new THREE.DirectionalLight(0xfff2dc, 1.5);
sun.castShadow = true;
sun.shadow.mapSize.set(C.coarse ? 2048 : 4096, C.coarse ? 2048 : 4096);
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
/* gökyüzü kubbesi: tepeden ufka açılan renk; ufuk sis rengiyle aynı, böylece uzak binalar ufka karışır.
   ShaderMaterial çıktıyı çevirmez, renkler sRGB olarak verilir. */
const skyU = { top: { value: new THREE.Color() }, hor: { value: new THREE.Color() } };
const skyDome = new THREE.Mesh(new THREE.SphereGeometry(3500, 32, 16), new THREE.ShaderMaterial({
  uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false,
  vertexShader: 'varying vec3 vP; void main() { vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: 'uniform vec3 top; uniform vec3 hor; varying vec3 vP; void main() { float h = normalize(vP).y; gl_FragColor = vec4(mix(hor, top, smoothstep(0.0, 0.5, h)), 1.0); }'
}));
skyDome.renderOrder = -10; skyDome.frustumCulled = false; scene.add(skyDome);
C.updaters.push(() => skyDome.position.copy(camera.position));
const WHITE = C.col('#ffffff'), DEEP = C.col('#3d7fd0'), GLOW = C.col('#1c2a48');
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
  const dayK = C.clamp(e * 3, 0, 1), nightK = C.clamp(-e * 4, 0, 1);
  const hor = sky.clone().lerp(WHITE, 0.3 * dayK).lerp(GLOW, 0.6 * nightK);         // gece ufukta şehir ışığı
  const top = sky.clone().lerp(DEEP, 0.45 * dayK);
  skyU.top.value.copy(top).convertLinearToSRGB(); skyU.hor.value.copy(hor).convertLinearToSRGB();
  scene.background = hor.clone().convertLinearToSRGB(); scene.fog.color.copy(hor);
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
/* asfalt: ince pürüzlü doku, 8 m'de bir tekrar */
C.noiseTex = function (size, base, spread, dots, seed) {
  const cv = document.createElement('canvas'); cv.width = cv.height = size; const x = cv.getContext('2d'), r = C.rng(seed || 7);
  x.fillStyle = `rgb(${base},${base},${base})`; x.fillRect(0, 0, size, size);
  for (let i = 0; i < dots; i++) { const v = base + (r() - 0.5) * spread | 0; x.fillStyle = `rgb(${v},${v},${v})`; x.fillRect(r() * size, r() * size, 1 + r() * 2.5, 1 + r() * 2.5); }
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = C.maxAniso; t.encoding = THREE.sRGBEncoding; return t;
};
const asphaltTex = C.noiseTex(256, 225, 90, 5000, 3); asphaltTex.repeat.set(C.TOTAL / 8, C.TOTAL / 8);
const asphalt = new THREE.Mesh(new THREE.PlaneGeometry(C.TOTAL, C.TOTAL), new THREE.MeshStandardMaterial({ color: C.col('#33373e'), map: asphaltTex, roughness: 0.95 }));
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
