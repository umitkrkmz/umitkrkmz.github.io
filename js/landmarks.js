/* ===== landmarks.js: hastane, itfaiye, karakol, stadyum ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene, B = C.SW;
const boxG = new THREE.BoxGeometry(1, 1, 1), planeG = new THREE.PlaneGeometry(1, 1);
const cylG = new THREE.CylinderGeometry(1, 1, 1, 16), cyl8 = new THREE.CylinderGeometry(1, 1, 1, 8);
const cyl24 = new THREE.CylinderGeometry(1, 1, 1, 24);
const coneG = new THREE.ConeGeometry(1, 1, 16).translate(0, 0.5, 0), cone8 = new THREE.ConeGeometry(1, 1, 8).translate(0, 0.5, 0);
const sphG = new THREE.SphereGeometry(1, 10, 8);
const std = (hex, r, m) => new THREE.MeshStandardMaterial({ color: C.col(hex), roughness: r === undefined ? 0.85 : r, metalness: m || 0 });
const glow = [];                                   // [malzeme, gece yoğunluğu, gündüz yoğunluğu]
C.nightListeners.push(n => { for (const g of glow) g[0].emissiveIntensity = g[2] + (g[1] - g[2]) * n; });
const glowing = (mat, night, day) => { glow.push([mat, night, day || 0]); return mat; };

function canvasTex(w, h, draw) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  draw(cv.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(cv); t.encoding = THREE.sRGBEncoding; t.anisotropy = C.maxAniso; return t;
}
function signMat(text, bg, fg, night) {
  const t = canvasTex(512, 96, (x, w, h) => {
    x.fillStyle = bg; x.fillRect(0, 0, w, h);
    x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle';
    let size = 70; const f = s => `800 ${s}px "Big Shoulders Display","Arial Narrow",sans-serif`;
    x.font = f(size); while (x.measureText(text).width > w - 40 && size > 20) x.font = f(size -= 4);
    x.fillText(text, w / 2, h / 2 + 3);
  });
  return glowing(new THREE.MeshStandardMaterial({ map: t, roughness: 0.6, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0.1 }), night === undefined ? 1 : night, 0.1);
}

/* ---------- ortak kurulum: her yapı bir grup, tıklanabilir, kart bilgisi taşır ---------- */
C.landmarks = []; C.landmarkMeshes = [];
C.finishLandmark = function (blk, group, type, name, rows) {
  const L = { type, name, rows, bx: blk.bx, bz: blk.bz, group, height: 0 };
  group.traverse(o => { if (o.isMesh) { o.userData.landmark = L; C.landmarkMeshes.push(o); } });
  L.height = new THREE.Box3().setFromObject(group).max.y - B;
  blk.landmark = L; C.landmarks.push(L); return L;
};
/* blok merkezine göre yerleştirir; y0 nesnenin tabanıdır */
function put(g, geo, mat, x, y0, z, sx, sy, sz, ry, centered) {
  const m = new THREE.Mesh(geo, mat);
  m.scale.set(sx, sy, sz); m.position.set(x, centered ? y0 + sy / 2 : y0, z); m.rotation.y = ry || 0;
  m.castShadow = m.receiveShadow = true; g.add(m); return m;
}
const box = (g, mat, x, y0, z, sx, sy, sz, ry) => put(g, boxG, mat, x, y0, z, sx, sy, sz, ry, true);
const cyl = (g, mat, x, y0, z, r, h, geo) => put(g, geo || cylG, mat, x, y0, z, r, h, r, 0, true);
function plane(g, mat, x, y, z, w, h, ry) { const m = put(g, planeG, mat, x, y, z, w, h, 1, ry); m.castShadow = false; return m; }
function ground(g, mat, x, z, w, d, lift) {
  const m = new THREE.Mesh(planeG, mat); m.rotation.x = -Math.PI / 2; m.scale.set(w, d, 1);
  m.position.set(x, B + (lift || 0.03), z); m.receiveShadow = true; g.add(m); return m;
}
const paveMat = std('#b9b6ae', 0.95);
function slab(g, mat) { box(g, mat || paveMat, 0, 0, 0, C.BLOCK, B, C.BLOCK); }
/* binalardaki pencereli cephe malzemesini ve UV ölçeğini kullanan kütle */
function facadeBox(g, w, floors, d, x, z, tint, rnd) {
  const h = floors * C.FLOOR_H, m = new THREE.Mesh(C.boxGeo(w, h, d, floors, rnd, { r: 0.5 }), C.mats.near.apt[tint]);
  m.position.set(x, B + h / 2, z); m.castShadow = m.receiveShadow = true; g.add(m); return m;
}

/* ---------- hastane ---------- */
function hospital(g, rnd) {
  slab(g);
  facadeBox(g, 34, 7, 12, 0, -6, 3, rnd);
  facadeBox(g, 14, 3, 10, -9, 5, 3, rnd);
  const white = std('#f2f2ee', 0.7);
  box(g, white, -9, B + 3.4, 11.8, 10, 0.4, 4);
  for (const x of [-13, -5]) cyl(g, white, x, B, 13.4, 0.18, 3.4);
  plane(g, signMat('ACİL', '#c62828', '#ffffff', 1.6), -9, B + 3.85, 13.82, 4, 0.9);
  plane(g, signMat('ŞEHİR HASTANESİ', '#ffffff', '#1f5fa8', 1.2), 6, B + 19, 0.04, 14, 2);
  const padTex = canvasTex(256, 256, (x, w) => {
    x.fillStyle = '#4b5056'; x.fillRect(0, 0, w, w);
    x.strokeStyle = '#f2f2ee'; x.lineWidth = 10; x.beginPath(); x.arc(128, 128, 110, 0, Math.PI * 2); x.stroke();
    x.fillStyle = '#f2f2ee'; x.font = '800 150px "Big Shoulders Display","Arial Narrow",sans-serif';
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('H', 128, 136);
  });
  const pad = ground(g, new THREE.MeshStandardMaterial({ map: padTex, roughness: 0.9 }), 8, -6, 10, 10);
  pad.position.y = B + 7 * C.FLOOR_H + 0.03;
  const lotTex = canvasTex(256, 192, (x, w, h) => {
    x.fillStyle = '#34383d'; x.fillRect(0, 0, w, h); x.fillStyle = '#e9e7de';
    for (let k = 0; k <= 6; k++) { x.fillRect(8 + k * 40, 0, 3, 70); x.fillRect(8 + k * 40, h - 70, 3, 70); }
  });
  ground(g, new THREE.MeshStandardMaterial({ map: lotTex, roughness: 0.95 }), 8, 9, 18, 13);
  const ac = std('#9a9ea3', 0.8);
  for (let k = 0; k < 4; k++) box(g, ac, -14 + k * 4, B + 7 * C.FLOOR_H, -9, 1.6, 1, 1.2);
}

/* ---------- itfaiye ---------- */
function fireStation(g) {
  slab(g);
  const brick = std('#b5483a', 0.9), trim = std('#ece6da', 0.8);
  box(g, brick, 0, B, -4, 30, 7, 16);
  box(g, trim, 0, B + 7, -4, 30.4, 0.5, 16.4);
  box(g, std('#6b6e72', 0.95), 0, B + 7.5, -4, 29.6, 0.08, 15.6);
  const doorTex = canvasTex(128, 128, (x, w, h) => {
    x.fillStyle = '#c0392b'; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(0,0,0,.22)';
    for (let k = 0; k < h; k += 9) x.fillRect(0, k, w, 2);
  });
  const door = new THREE.MeshStandardMaterial({ map: doorTex, roughness: 0.6, metalness: 0.2 });
  const lamp = glowing(new THREE.MeshStandardMaterial({ color: C.col('#e8e2d0'), emissive: C.col('#ffe0a8'), emissiveIntensity: 0 }), 2);
  for (const x of [-9.5, 0, 9.5]) {
    plane(g, door, x, B, 4.03, 7, 4.8);
    box(g, trim, x, B + 4.8, 4.1, 7.6, 0.3, 0.3);
    box(g, lamp, x, B + 5.1, 4.25, 0.6, 0.22, 0.3);
  }
  plane(g, signMat('İTFAİYE', '#7f1d1d', '#ffffff', 1.3), 0, B + 5.4, 4.04, 10, 1.2);
  box(g, brick, 11, B, -9, 5, 20, 5);
  box(g, trim, 11, B + 20, -9, 5.6, 0.5, 5.6);
  box(g, std('#3b4046', 0.7), 11, B + 20.5, -9, 4.4, 1.2, 4.4);
  ground(g, std('#c9c4b8', 0.95), 0, 11, 30, 14);
}

/* ---------- karakol ---------- */
function policeStation(g, rnd) {
  slab(g);
  facadeBox(g, 26, 3, 14, 0, -5, 5, rnd);
  const navy = std('#24364d', 0.7);
  box(g, navy, 0, B, 3.5, 8, 3.2, 3);
  plane(g, signMat('POLİS', '#1f4e8c', '#ffffff', 1.4), 0, B + 4.9, 2.04, 7, 1.4);
  const blue = new THREE.MeshBasicMaterial({ color: C.col('#3d7bff'), transparent: true, fog: false });
  for (const x of [-3.6, 3.6]) put(g, sphG, blue, x, B + 3.5, 4.6, 0.28, 0.28, 0.28).castShadow = false;
  C.updaters.push((dt, t) => { blue.opacity = Math.sin(t * 5) > 0 ? 1 : 0.2; });
  /* bayrak direği ve sallanan bayrak */
  cyl(g, std('#c9ccd0', 0.4, 0.7), -10, B, 9, 0.08, 11);
  const flagTex = canvasTex(300, 200, (x, w, h) => {
    x.fillStyle = '#e30a17'; x.fillRect(0, 0, w, h);
    const G = h;
    x.fillStyle = '#fff'; x.beginPath(); x.arc(0.5 * G, 0.5 * G, 0.25 * G, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#e30a17'; x.beginPath(); x.arc(0.5625 * G, 0.5 * G, 0.2 * G, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#fff'; x.beginPath();
    for (let k = 0; k < 10; k++) {
      const a = Math.PI + k * Math.PI / 5, r = k % 2 ? 0.05 * G : 0.125 * G;
      x.lineTo(0.88 * G + Math.cos(a) * r, 0.5 * G + Math.sin(a) * r);
    }
    x.closePath(); x.fill();
  });
  const pivot = new THREE.Group(); pivot.position.set(-10, B + 10.2, 9); g.add(pivot);
  const flag = new THREE.Mesh(planeG, new THREE.MeshStandardMaterial({ map: flagTex, roughness: 0.8, side: THREE.DoubleSide }));
  flag.scale.set(2.7, 1.8, 1); flag.position.x = 1.38; flag.castShadow = true; pivot.add(flag);
  C.updaters.push((dt, t) => { pivot.rotation.y = Math.sin(t * 1.3) * 0.25; });
  const lotTex = canvasTex(256, 128, (x, w, h) => {
    x.fillStyle = '#34383d'; x.fillRect(0, 0, w, h); x.fillStyle = '#e9e7de';
    for (let k = 0; k <= 5; k++) x.fillRect(10 + k * 46, 0, 3, 60);
  });
  ground(g, new THREE.MeshStandardMaterial({ map: lotTex, roughness: 0.95 }), 9, 9, 15, 9);
}

/* ---------- stadyum ---------- */
function stadium(g) {
  slab(g, std('#a9aaa3', 0.95));
  const pitchTex = canvasTex(512, 330, (x, w, h) => {
    for (let k = 0; k < 10; k++) { x.fillStyle = k % 2 ? '#3f8a3a' : '#4a9a43'; x.fillRect(k * w / 10, 0, w / 10 + 1, h); }
    x.strokeStyle = '#f2f2ee'; x.lineWidth = 4; x.strokeRect(14, 14, w - 28, h - 28);
    x.beginPath(); x.moveTo(w / 2, 14); x.lineTo(w / 2, h - 14); x.stroke();
    x.beginPath(); x.arc(w / 2, h / 2, 46, 0, Math.PI * 2); x.stroke();
    x.strokeRect(14, h / 2 - 80, 72, 160); x.strokeRect(w - 86, h / 2 - 80, 72, 160);
  });
  const pitch = glowing(new THREE.MeshStandardMaterial({ map: pitchTex, roughness: 0.95, emissive: 0xffffff, emissiveMap: pitchTex, emissiveIntensity: 0 }), 0.35);
  ground(g, std('#a5543f', 0.95), 0, 0, 32, 22, 0.035);
  ground(g, pitch, 0, 0, 28, 18, 0.06);
  const seatA = std('#2f6fb0', 0.7), seatB = std('#e8e8e8', 0.7), wall = std('#8f9189', 0.9);
  for (const s of [-1, 1]) {
    for (let k = 0; k < 3; k++) box(g, k % 2 ? seatB : seatA, 0, B, s * (12.4 + k * 2.2), 32, 1.4 * (k + 1), 2.2);
    box(g, wall, 0, B, s * 18.2, 32.4, 4.8, 0.4);
    for (let k = 0; k < 2; k++) box(g, k % 2 ? seatB : seatA, s * (17.1 + k * 1.6), B, 0, 1.6, 1.4 * (k + 1), 22);
  }
  const steel = std('#c9ccd0', 0.5, 0.6);
  box(g, steel, 0, B + 7, -15, 34, 0.3, 8);
  for (const x of [-15, -5, 5, 15]) cyl(g, steel, x, B, -18.6, 0.18, 7);
  plane(g, signMat('ŞEHİR STADI', '#16212b', '#ffb53d', 1.2), 0, B + 7.3, -10.98, 10, 1.4);
  const flood = glowing(new THREE.MeshStandardMaterial({ color: C.col('#e8eef5'), emissive: C.col('#fff6e0'), emissiveIntensity: 0 }), 2.6);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const x = sx * 18.8, z = sz * 16.5;
    cyl(g, steel, x, B, z, 0.3, 24);
    const p = box(g, flood, x, B + 23.6, z, 3, 1.6, 0.4, Math.atan2(-x, -z));
    p.rotation.order = 'YXZ'; p.rotation.x = 0.5;
  }
}

const BUILD = {
  hospital: [hospital, 'Ankara Şehir Hastanesi', [['Kat', '7'], ['Yatak', '~240'], ['Acil', '7/24'], ['Helikopter pisti', 'Var']]],
  fire: [fireStation, 'İtfaiye Merkezi', [['Araç', '3 itfaiye'], ['Ekip', '24 kişi'], ['Hortum kulesi', '20 m'], ['Çıkış', '~60 sn']]],
  police: [policeStation, 'Merkez Karakolu', [['Kat', '3'], ['Ekip', '~40'], ['Devriye', '4 araç'], ['Nöbet', '7/24']]],
  stadium: [stadium, 'Ankara Stadı', [['Kapasite', '~4.500'], ['Saha', '28 × 18 m'], ['Işık kulesi', '4'], ['Çatı', 'Ana tribün']]]
};
C.makeLandmark = function (blk, type, rnd) {
  const [build, name, rows] = BUILD[type];
  const g = new THREE.Group(); g.position.set(blk.bx, 0, blk.bz); scene.add(g);
  build(g, rnd);
  return C.finishLandmark(blk, g, type, name, rows);
};
})();
