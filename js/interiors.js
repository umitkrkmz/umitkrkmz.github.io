/* ===== interiors.js: pencere arkasında sahte odalar (interior mapping) ve binaların kesit görünümü ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene, B = C.SW;

/* ---------- pencere arkasındaki odalar ----------
   Her cephe hücresi bir odadır (hücre genişliği × kat yüksekliği × 4 m derinlik). Pencere bölgesinde
   bakış ışını odanın içine yürütülür; çarptığı yüz (arka duvar, yan duvar, zemin, tavan) boyanır.
   Ek geometri yok; perspektif bakış açısıyla kendiliğinden değişir. Gündüz loş, gece yalnızca
   ışığı yanan pencerelerin odası aydınlık. 220 m'den uzakta etkisi söner. */
const ROOM_FN = `
float ihash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
vec3 roomColor(vec3 h, float face, float ry, vec2 cid) {
  float r1 = ihash(cid), r2 = ihash(cid + 17.31), r3 = ihash(cid + 3.7);
  vec3 wall = mix(mix(vec3(0.80, 0.72, 0.58), vec3(0.55, 0.66, 0.70), step(0.5, r1)), vec3(0.72, 0.62, 0.66), step(0.8, r3));
  vec3 col;
  if (face > 1.5) {                                      // arka duvar: dolap ya da kanepe, tablo
    col = wall * 0.95;
    if (h.y < 0.34 && abs(h.x - 0.28 - r2 * 0.44) < 0.24) col = mix(vec3(0.30, 0.19, 0.12), vec3(0.18, 0.24, 0.42), step(0.5, r2));
    if (h.y > 0.48 && h.y < 0.7 && abs(h.x - 0.72 + r1 * 0.44) < 0.1) col = mix(vec3(0.62, 0.42, 0.22), vec3(0.25, 0.45, 0.55), r3);
  } else if (face > 0.5) col = ry < 0.0 ? mix(vec3(0.42, 0.28, 0.17), vec3(0.55, 0.52, 0.48), step(0.6, r3)) : vec3(0.9, 0.9, 0.88);
  else col = wall * 0.78;
  return col * mix(1.0, 0.55, h.z);                    // içeri doğru kararır
}
`;
const ROOM_APPLY = `
#ifdef INTERIOR
{
  vec3 ipos = -vViewPosition;
  vec3 q0 = dFdx(ipos), q1 = dFdy(ipos);
  vec2 st0 = dFdx(vUv), st1 = dFdy(vUv);
  vec2 lc = fract(vUv * 16.0), cid = floor(vUv * 16.0);
  #ifdef CW
    vec2 wlo = vec2(0.06), whi = vec2(0.94);
    float win = step(wlo.x, lc.x) * step(lc.x, whi.x) * step(wlo.y, lc.y) * step(lc.y, whi.y);
  #else
    vec2 wlo = vec2(0.19, 0.25), whi = vec2(0.81, 0.84);
    float win = step(wlo.x, lc.x) * step(lc.x, whi.x) * step(wlo.y, lc.y) * step(lc.y, whi.y) * step(0.035, abs(lc.x - 0.5));
  #endif
  #ifdef HOLES
  for (int hi = 0; hi < 4; hi++) { vec4 hh = uHoles[hi]; if (hh.w > 0.5 && win > 0.0 && cid.y == hh.y && cid.x >= hh.x && cid.x < hh.x + hh.z) discard; }   // gerçek oda var: cam açık
  #endif
  float k = win * smoothstep(220.0, 90.0, length(vViewPosition));
  if (k > 0.0) {
    vec3 N = normalize(normal);
    vec3 q0p = cross(q1, N), q1p = cross(N, q0);
    vec3 Tu = normalize(q1p * st0.x + q0p * st1.x), Tv = normalize(q1p * st0.y + q0p * st1.y);
    vec3 rd = normalize(ipos);
    vec3 r = vec3(dot(rd, Tu) / 3.6, dot(rd, Tv) / 3.2, max(1e-3, dot(rd, -N)) / 4.0);
    vec3 p = vec3(lc, 0.0);
    vec3 tt = vec3(((r.x > 0.0 ? 1.0 : 0.0) - p.x) / r.x, ((r.y > 0.0 ? 1.0 : 0.0) - p.y) / r.y, 1.0 / r.z);
    float t = min(min(tt.x, tt.y), tt.z);
    float face = t == tt.z ? 2.0 : t == tt.y ? 1.0 : 0.0;
    vec3 col = roomColor(p + r * t, face, r.y, cid);
    float r2 = ihash(cid + 17.31), r1 = ihash(cid);
    if (r2 > 0.72 && lc.y > mix(wlo.y, whi.y, 0.35 + r1 * 0.5)) col = mix(vec3(0.86, 0.82, 0.74), vec3(0.72, 0.42, 0.32), r1);   // perde
    float nightF = clamp(emissive.r / 1.15, 0.0, 1.0);
    vec3 lit = emissiveMapTexelToLinear(texture2D(emissiveMap, vUv)).rgb;
    float on = step(0.06, max(lit.r, max(lit.g, lit.b)));
    vec3 em = col * (0.42 * (1.0 - nightF) + nightF * (on * (lit * 1.6 + 0.1) + 0.015));
    float fres = pow(1.0 - max(0.0, dot(-rd, N)), 3.0);
    totalEmissiveRadiance = mix(totalEmissiveRadiance, em, k);
    diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * (0.18 + 0.75 * fres), k);
  }
}
#endif
`;
function interiorize(m, cw, holes) {
  m.defines = Object.assign(m.defines || {}, cw ? { INTERIOR: 1, CW: 1 } : { INTERIOR: 1 }, holes ? { HOLES: 1 } : {});
  m.extensions = Object.assign(m.extensions || {}, { derivatives: true });
  m.onBeforeCompile = sh => {
    C.addGroundAO(sh);
    if (holes) { sh.uniforms.uHoles = holes; sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec4 uHoles[4];'); }
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + ROOM_FN)
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n' + ROOM_APPLY);
  };
  m.customProgramCacheKey = () => (cw ? 'interior-cw' : 'interior-apt') + (holes ? '-holes' : '');
  m.needsUpdate = true;
}
for (const set of ['apt', 'cw']) for (const arr of C.mats.near[set]) interiorize(arr[0], set === 'cw');

/* ---------- kesit: binanın katları ayrılır, her katta odalar, mobilya ve insanlar ----------
   Tüm kutular tek bir InstancedMesh (örnek başına renk), insanlar ikinci bir çift. Katlar açılırken
   yalnızca matrisler yeniden yazılır. Duvarlar alçak (1,1 m), böylece her açıdan içi görünür. */
const unitBox = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);           // tabanı y=0'da
const glow = { value: 0 };
function cutMat() {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
  m.onBeforeCompile = sh => {
    sh.uniforms.uGlow = glow;
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uGlow;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += diffuseColor.rgb * uGlow;');
  };
  m.customProgramCacheKey = () => 'cutaway';
  return m;
}
const boxMat = cutMat(), cpose = {};
C.nightListeners.push(n => { glow.value = n * 0.45; });                        // gece odalar içeriden aydınlık

const P = {
  wall: '#ece7db', slab: ['#b78a5a', '#9c7046', '#d9d4c8', '#8a9bb0', '#c9b79a'], tile: '#d5d2ca', dark: '#2a2e33', white: '#f2f0ea',
  sofa: ['#3d5a80', '#8a3b3b', '#5b6e4a', '#6b5b8a', '#c9a227'], rug: ['#a8473a', '#2f5d7c', '#c9b07a', '#6c8c5a'],
  wood: '#8b6340', bed: ['#7a9cc6', '#c97b7b', '#8fb08a', '#d8c27a'], green: '#4f8a3c',
  shirt: ['#c9372c', '#2f6f8f', '#e8e2d0', '#3b7a57', '#d29a2d', '#6b4e8f', '#222b33', '#b3566b', '#f2f2ee'],
  skin: ['#f1c9a5', '#d9a37c', '#a8734f', '#7a4e33'], goods: ['#e2452b', '#f2c230', '#2f7bff', '#3b9a57', '#f2f2ee', '#c96bb0', '#ff8a3d']
};
function layout(b) {
  const rnd = C.rng(b.seed + 991), pick = a => a[(rnd() * a.length) | 0];
  const boxes = [], people = [];
  let k = 0;
  const put = (x, y, z, sx, sy, sz, col, ry) => boxes.push([k, x, y, z, sx, sy, sz, col, ry || 0]);
  const man = (x, z, pose, ry, y) => people.push([k, x, y || 0, z, pose, ry || rnd() * 6.28, pick(P.shirt), pick(P.skin), rnd() * 6.28]);
  const room = (x0, z0, x1, z1) => ({ x0, z0, x1, z1, cx: (x0 + x1) / 2, cz: (z0 + z1) / 2, w: x1 - x0, d: z1 - z0 });
  const wallX = (x0, x1, z) => put((x0 + x1) / 2, 0, z, x1 - x0, 1.1, 0.14, P.wall);
  const wallZ = (z0, z1, x) => put(x, 0, (z0 + z1) / 2, 0.14, 1.1, z1 - z0, P.wall);
  const plant = (x, z) => { put(x, 0, z, 0.4, 0.4, 0.4, '#a8603a'); put(x, 0.4, z, 0.5, 0.7, 0.5, P.green); };
  function salon(r) {
    if (r.w < 3 || r.d < 3) return;
    put(r.cx, 0.01, r.cz, r.w * 0.5, 0.02, r.d * 0.45, pick(P.rug));
    const sc = pick(P.sofa), sw = Math.min(2.2, r.w - 1);
    put(r.cx, 0, r.z1 - 0.6, sw, 0.45, 0.85, sc); put(r.cx, 0.45, r.z1 - 0.28, sw, 0.45, 0.22, sc);
    put(r.cx, 0, r.z1 - 1.8, 1.0, 0.4, 0.55, P.wood);
    put(r.cx, 0, r.z0 + 0.35, Math.min(1.6, r.w - 1), 0.45, 0.4, P.dark); put(r.cx, 0.45, r.z0 + 0.3, Math.min(1.2, r.w - 1.2), 0.7, 0.06, '#11161c');
    plant(r.x0 + 0.5, r.z0 + 0.5);
    if (rnd() < 0.8) man(r.cx - 0.4, r.z1 - 0.65, 'tv', Math.PI / 2);
    if (rnd() < 0.5) man(r.cx + 0.5, r.z1 - 0.65, 'tv', Math.PI / 2);
    if (rnd() < 0.4) man(r.x0 + r.w * 0.7, r.cz, rnd() < 0.5 ? 'talk' : 'stand');
  }
  function bedroom(r) {
    if (r.w < 2.6 || r.d < 2.8) return;
    const bw = Math.min(1.6, r.w - 0.8);
    put(r.cx, 0, r.z1 - 1.1, bw, 0.5, 2.0, P.wood); put(r.cx, 0.5, r.z1 - 0.32, bw - 0.2, 0.12, 0.35, P.white);
    put(r.cx, 0.5, r.z1 - 1.35, bw + 0.04, 0.07, 1.3, pick(P.bed));
    if (r.w > 3.4) put(r.x0 + 0.65, 0, r.z0 + 0.35, 1.1, 1.7, 0.55, P.wood);
    if (rnd() < 0.45) man(r.cx, r.z1 - 1.2, 'lie', Math.PI / 2, 0.57);
  }
  function kitchen(r) {
    if (r.w < 2.4 || r.d < 2.4) return;
    const cl = Math.min(2.6, r.w - 1.2);
    put(r.x0 + 0.3 + cl / 2, 0, r.z1 - 0.35, cl, 0.9, 0.6, P.white); put(r.x0 + 0.3 + cl / 2, 0.9, r.z1 - 0.35, cl, 0.04, 0.62, P.dark);
    put(r.x1 - 0.45, 0, r.z1 - 0.4, 0.7, 1.8, 0.7, '#dfe3e6');
    if (r.d > 3.2) {
      put(r.cx, 0, r.cz - 0.3, 1.0, 0.75, 0.8, P.wood);
      for (const s of [-1, 1]) put(r.cx + s * 0.75, 0, r.cz - 0.3, 0.42, 0.45, 0.42, P.wood);
    }
    if (rnd() < 0.7) man(r.x0 + 0.3 + cl / 2, r.z1 - 1.0, 'cook', -Math.PI / 2);
  }
  function flat(x0, x1, z0, z1) {
    const zm = z0 + (z1 - z0) * 0.55, xm = (x0 + x1) / 2;
    wallX(x0, x1, zm); wallZ(zm, z1, xm);
    salon(room(x0, z0, x1, zm)); bedroom(room(x0, zm, xm, z1)); kitchen(room(xm, zm, x1, z1));
  }
  function shop(x0, x1, z0, z1) {
    const w = x1 - x0, d = z1 - z0, cx = (x0 + x1) / 2;
    put(cx, 0, z0 + 2.2, Math.min(2.6, w - 2), 1.0, 0.7, P.wood);
    put(cx, 0, z1 - 0.35, w - 1, 1.6, 0.5, P.wood);
    for (const y of [0.5, 1.0, 1.45]) for (let x = x0 + 1; x < x1 - 1; x += 0.55) if (rnd() < 0.8) put(x, y, z1 - 0.38, 0.35, 0.3, 0.3, pick(P.goods));
    for (const sx of [x0 + 0.35, x1 - 0.35]) if (d > 6) put(sx, 0, (z0 + z1) / 2, 0.5, 1.6, d - 3, P.wood);
    man(cx, z0 + 1.4, 'stand', Math.PI / 2);
    const n = 1 + ((rnd() * 3) | 0); for (let i = 0; i < n; i++) man(x0 + 1.5 + rnd() * (w - 3), z0 + 3 + rnd() * Math.max(0.5, d - 5), 'stand');
  }
  function lobby(w, d) {
    put(0, 0, -d / 2 + 3, Math.min(3.2, w - 2), 1.1, 0.8, P.white);
    man(0, -d / 2 + 2.2, 'stand', Math.PI / 2);
    for (const s of [-1, 1]) { put(s * w * 0.3, 0, d * 0.15, 2, 0.45, 0.85, pick(P.sofa)); plant(s * (w / 2 - 0.8), d / 2 - 0.8); }
    for (let i = 0; i < 3; i++) man((rnd() - 0.5) * (w - 3), (rnd() - 0.5) * (d - 3), 'stand');
  }
  function office(w, d) {
    const meet = w > 16 && d > 12, mx0 = w / 2 - 7, mz0 = d / 2 - 5.5;
    if (meet) {
      wallX(mx0, w / 2, mz0); wallZ(mz0, d / 2, mx0);
      const cx = (mx0 + w / 2) / 2, cz = (mz0 + d / 2) / 2;
      put(cx, 0, cz, 3.2, 0.75, 1.4, P.wood);
      for (const s of [-1, 1]) for (const t of [-1, 0, 1]) { put(cx + t * 1.0, 0, cz + s * 1.05, 0.45, 0.45, 0.45, P.dark); if (rnd() < 0.55) man(cx + t * 1.0, cz + s * 1.05, 'sit', s > 0 ? Math.PI / 2 : -Math.PI / 2); }
    }
    for (let x = -w / 2 + 2; x <= w / 2 - 2; x += 3.0) for (let z = -d / 2 + 2; z <= d / 2 - 2; z += 3.2) {
      if (meet && x > mx0 - 1 && z > mz0 - 1) continue;
      put(x, 0, z, 1.4, 0.75, 0.7, P.white); put(x, 0.75, z - 0.22, 0.55, 0.38, 0.05, '#11161c');
      put(x, 0, z + 0.6, 0.5, 0.5, 0.5, P.dark);
      if (rnd() < 0.65) man(x, z + 0.6, 'study', Math.PI / 2);
    }
    plant(-w / 2 + 0.7, -d / 2 + 0.7); plant(w / 2 - 0.7, -d / 2 + 0.7);
  }
  /* katı yaklaşık 'size' metrelik birimlere böler, aralara tam boy duvar koyar */
  function grid(w, d, size, fill) {
    const nx = Math.max(1, Math.round(w / size)), nz = Math.max(1, Math.round(d / size)), sw = w / nx, sd = d / nz;
    for (let i = 1; i < nx; i++) wallZ(-d / 2, d / 2, -w / 2 + i * sw);
    for (let j = 1; j < nz; j++) wallX(-w / 2, w / 2, -d / 2 + j * sd);
    for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) fill(-w / 2 + i * sw, -w / 2 + (i + 1) * sw, -d / 2 + j * sd, -d / 2 + (j + 1) * sd);
  }
  for (const tier of C.tiersOf(b)) for (let f = 0; f < tier.f; f++, k++) {
    const w = tier.w, d = tier.d;
    put(0, -0.18, 0, w, 0.18, d, b.type === 'tower' ? P.tile : pick(P.slab));
    wallX(-w / 2, w / 2, -d / 2 + 0.07); wallX(-w / 2, w / 2, d / 2 - 0.07); wallZ(-d / 2, d / 2, -w / 2 + 0.07); wallZ(-d / 2, d / 2, w / 2 - 0.07);
    if (b.type === 'tower') { if (k === 0) lobby(w, d); else office(w, d); }
    else if (b.type === 'house') { if (k === 0) { const zm = d * 0.1; wallX(-w / 2, w / 2, zm); salon(room(-w / 2, -d / 2, w / 2, zm)); kitchen(room(-w / 2, zm, w / 2, d / 2)); } else { wallZ(-d / 2, d / 2, 0); bedroom(room(-w / 2, -d / 2, 0, d / 2)); bedroom(room(0, -d / 2, w / 2, d / 2)); } }
    else grid(w, d, k === 0 ? 12 : 11, k === 0 ? shop : flat);       // zemin katta dükkânlar, üstte daireler
  }
  return { boxes, people, floors: k };
}

const cut = { b: null, group: null, boxes: null, body: null, head: null, data: null, g: 0, gap: 2.6 };
const cd = new THREE.Object3D(), ccol = new THREE.Color();
function writeMatrices(t) {
  const { b, data } = cut, lot = b.lot, step = C.FLOOR_H + cut.gap * cut.g;
  data.boxes.forEach((o, i) => {
    cd.position.set(lot.cx + o[1], B + o[0] * step + o[2], lot.cz + o[3]); cd.rotation.set(0, o[8], 0); cd.scale.set(o[4], o[5], o[6]);
    cd.updateMatrix(); cut.boxes.setMatrixAt(i, cd.matrix);
  });
  data.people.forEach((p, i) => {
    const y0 = B + p[0] * step + p[2], pose = p[4], q = C.pose(pose, t + p[8], cpose);
    if (pose === 'lie') cut.crowd.set(i, lot.cx + p[1], y0 + 0.11, lot.cz + p[3] - 0.85, p[5], q);   // ayaklar yatağın ucunda, baş yastıkta
    else cut.crowd.set(i, lot.cx + p[1], y0, lot.cz + p[3], p[5] + (pose === 'stand' ? Math.sin(t * 0.4 + p[8]) * 0.6 : 0), q);
  });
  cut.boxes.instanceMatrix.needsUpdate = true; cut.crowd.commit();
}
C.cutaway = {
  get building() { return cut.b; },
  /* açılmış hâlin toplam yüksekliği: kamera kadrajı için */
  heightOf(b) { const n = C.tiersOf(b).reduce((a, t) => a + t.f, 0); return n * (C.FLOOR_H + (b.type === 'tower' ? 1.4 : 2.6)); },
  open(b) {
    this.close();
    const data = layout(b);
    cut.b = b; cut.data = data; cut.g = 0; cut.gap = b.type === 'tower' ? 1.4 : 2.6;
    b.cut = true; b.group.visible = false; if (b.detail) b.detail.visible = false;
    const g = new THREE.Group();
    cut.boxes = C.inst(unitBox, boxMat, data.boxes.length);
    data.boxes.forEach((o, i) => cut.boxes.setColorAt(i, ccol.set(o[7]).convertSRGBToLinear()));
    cut.crowd = new C.Crowd(Math.max(1, data.people.length), { glow });
    data.people.forEach((p, i) => cut.crowd.look(i, C.randomLook()));
    cut.boxes.castShadow = cut.boxes.receiveShadow = true; cut.boxes.instanceColor.needsUpdate = true;
    g.add(cut.boxes, cut.crowd.group);
    scene.add(g); cut.group = g; writeMatrices(0);
    return data;
  },
  close() {
    if (!cut.b) return;
    const b = cut.b; b.cut = false; b.group.visible = true;
    scene.remove(cut.group); cut.boxes.dispose(); cut.crowd.dispose();
    cut.b = cut.group = cut.data = null;
  }
};
C.updaters.push((dt, t) => {
  if (!cut.b) return;
  if (!cut.b.lot || cut.b.lot.building !== cut.b) { C.cutaway.close(); return; }      // bina yıkıldı ya da şehir yenilendi
  cut.g = Math.min(1, cut.g + dt / 1.2);
  writeMatrices(t);
});

/* ---------- camın ardında gerçek odalar ----------
   Kameraya yakın en fazla iki binada, kameraya bakan cephede birkaç pencerenin camı açılır (HOLES) ve arkasına
   3B bir oda kurulur: TV izleyen, yemek yapan, ders çalışan ya da yemek yiyen biri. Bina uzaklaşınca kapanır. */
const liveGlow = { value: 0.12 };
C.nightListeners.push(n => { liveGlow.value = 0.12 + n * 0.55; });          // gündüz loş, gece ışık yanık
const liveMat = (function () { const m = cutMat(); m.onBeforeCompile = sh => { sh.uniforms.uGlow = liveGlow; sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uGlow;').replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += diffuseColor.rgb * uGlow;'); }; m.customProgramCacheKey = () => 'living'; return m; })();
const tvMat = new THREE.MeshBasicMaterial({ color: 0x6fa8ff }), lampGlow = new THREE.MeshBasicMaterial({ color: C.col('#ffe7b0') }), steamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, depthWrite: false });
const ACTS = ['tv', 'cook', 'study', 'dinner'];
const live = new Map();                                   // bina -> { group, crowd, people, holes, mats, extras }
function sideFacing(mesh, cam) {
  const sides = mesh.geometry.userData.sides; if (!sides) return null;
  let best = null, bd = 0.25;
  for (const s of sides) {
    const mx = mesh.position.x + (s.ax + s.bx) / 2, mz = mesh.position.z + (s.az + s.bz) / 2;
    const vx = cam.x - mx, vz = cam.z - mz, l = Math.hypot(vx, vz) || 1, d = (vx * s.nx + vz * s.nz) / l;
    if (d > bd && s.len > 6) { bd = d; best = s; }
  }
  return best;
}
function buildLive(b, cam) {
  const mesh = b.meshes[0], ud = mesh.geometry.userData, s = sideFacing(mesh, cam);
  if (!s) return null;
  const rnd = C.rng(b.seed + 4242), cw = s.len / s.cells, dx = (s.bx - s.ax) / s.len, dz = (s.bz - s.az) / s.len;
  const k0 = Math.ceil(s.u0 - 1e-6), k1 = Math.floor(s.u0 + s.cells + 1e-6) - 1;      // cephede tam duran pencere hücreleri
  if (k1 < k0) return null;
  const maxF = Math.min(ud.floors - 1, 6), picks = [], used = new Set();
  for (let tries = 0; picks.length < 3 && tries < 20; tries++) {
    const K = k0 + ((rnd() * (k1 - k0 + 1)) | 0), f = 1 + ((rnd() * maxF) | 0), key = K + ',' + f;
    if (f >= ud.floors || used.has(key) || used.has((K - 1) + ',' + f) || used.has((K + 1) + ',' + f)) continue;
    used.add(key); picks.push({ K, f, act: ACTS[(rnd() * ACTS.length) | 0] });
  }
  const holes = { value: [0, 1, 2, 3].map(i => picks[i] ? new THREE.Vector4(picks[i].K, picks[i].f + ud.ov, 1, 1) : new THREE.Vector4(0, 0, 0, 0)) };
  const base = b.nearMats[0], m2 = base.clone(); interiorize(m2, b.style === 'cw', holes);
  b.holeMats = [m2].concat(b.nearMats.slice(1)); if (!b.isFar) mesh.material = b.holeMats;
  const g = new THREE.Group(), boxes = [], people = [], extras = [];
  const yBase = mesh.position.y - ud.h / 2, th = Math.atan2(-dz, dx);
  for (const p of picks) {
    /* yerel çerçeve: x cephe boyunca, z dışarı (oda z -3,8..0), y kat tabanından */
    const along = (p.K + 0.5 - s.u0) * cw, ox = mesh.position.x + s.ax + dx * along, oz = mesh.position.z + s.az + dz * along;
    const rg = new THREE.Group(); rg.position.set(ox, yBase + p.f * C.FLOOR_H, oz); rg.rotation.y = th; g.add(rg);
    const W = cw - 0.1, Dp = 3.8, H = C.FLOOR_H - 0.05, wall = ['#efe4d2', '#dfe7ea', '#e9dccf', '#e3ead9'][(rnd() * 4) | 0];
    const bx = (x, y, z, sx, sy, sz, col) => boxes.push({ rg, o: [x, y, z, sx, sy, sz, col] });
    bx(0, 0, -Dp / 2 - 0.1, W, 0.06, Dp, ['#a8805a', '#8b6340', '#c9b79a'][(rnd() * 3) | 0]);
    bx(0, H, -Dp / 2 - 0.1, W, 0.06, Dp, '#f4f1ea');
    bx(0, 0, -Dp - 0.1, W, H, 0.08, wall); bx(-W / 2, 0, -Dp / 2 - 0.1, 0.08, H, Dp, wall); bx(W / 2, 0, -Dp / 2 - 0.1, 0.08, H, Dp, wall);
    const lamp = new THREE.Mesh(unitBox, lampGlow); lamp.scale.set(0.5, 0.05, 0.5); lamp.position.set(0, H - 0.05, -Dp / 2); rg.add(lamp);
    const man = (x, z, ry, pose) => people.push({ rg, x, z, ry, pose, ph: rnd() * 10 });
    if (p.act === 'tv') {
      bx(-W / 2 + 0.5, 0, -Dp / 2, 0.85, 0.45, 2.0, '#3d5a80'); bx(-W / 2 + 0.2, 0.45, -Dp / 2, 0.22, 0.45, 2.0, '#3d5a80');
      bx(W / 2 - 0.25, 0, -Dp / 2, 0.4, 0.5, 1.4, '#2a2e33');
      const tv = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.65), tvMat.clone()); tv.position.set(W / 2 - 0.12, 1.15, -Dp / 2); tv.rotation.y = -Math.PI / 2; rg.add(tv); extras.push({ type: 'tv', m: tv, ph: rnd() * 10 });
      bx(0, 0.01, -Dp / 2, 1.6, 0.02, 1.4, '#a8473a');
      man(-W / 2 + 0.5, -Dp / 2 + 0.3, 0, 'tv');
    } else if (p.act === 'cook') {
      bx(0, 0, -Dp + 0.25, W - 0.3, 0.9, 0.6, '#f2f2ee'); bx(0.4, 0.9, -Dp + 0.25, 0.8, 0.04, 0.55, '#2a2e33');
      bx(-W / 2 + 0.45, 0, -Dp + 0.5, 0.7, 1.8, 0.7, '#dfe3e6');
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.18, 12), liveMat); pot.position.set(0.4, 1.03, -Dp + 0.28); rg.add(pot);
      for (let i = 0; i < 5; i++) { const st = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 5), steamMat); st.position.set(0.4, 1.15, -Dp + 0.28); rg.add(st); extras.push({ type: 'steam', m: st, t: i / 5 }); }
      man(0.4, -Dp + 0.95, Math.PI / 2, 'cook');
      bx(0, 0, -1.3, 0.9, 0.74, 0.7, '#8b6340');
    } else if (p.act === 'study') {
      bx(W / 2 - 0.4, 0, -Dp / 2, 0.65, 0.74, 1.3, '#8b6340'); bx(W / 2 - 0.45, 0.74, -Dp / 2 + 0.2, 0.3, 0.02, 0.4, '#f2f2ee');
      bx(W / 2 - 0.5, 0.74, -Dp / 2 - 0.35, 0.22, 0.12, 0.3, '#c9372c'); bx(W / 2 - 0.5, 0.86, -Dp / 2 - 0.35, 0.2, 0.06, 0.28, '#2f6f8f');
      const dl = new THREE.Mesh(unitBox, lampGlow); dl.scale.set(0.16, 0.12, 0.16); dl.position.set(W / 2 - 0.4, 1.1, -Dp / 2 + 0.5); rg.add(dl);
      bx(W / 2 - 0.4, 0.74, -Dp / 2 + 0.5, 0.03, 0.36, 0.03, '#2a2e33');
      bx(W / 2 - 1.15, 0, -Dp / 2, 0.45, 0.45, 0.45, '#2a2e33');
      bx(-W / 2 + 0.25, 0, -Dp + 0.4, 0.4, 2.0, 1.4, '#8b6340');
      for (let y = 0.4; y < 1.9; y += 0.4) for (let z = -Dp + 0.0; z < -Dp + 1.0; z += 0.14) bx(-W / 2 + 0.3, y, z, 0.25, 0.3, 0.1, ['#c9372c', '#2f6f8f', '#3b9a57', '#d29a2d', '#f2f2ee'][(rnd() * 5) | 0]);
      man(W / 2 - 1.15, -Dp / 2, 0, 'study');
    } else {
      bx(0, 0, -Dp / 2, 1.1, 0.74, 0.8, '#8b6340');
      for (const sx of [-1, 1]) { bx(sx * 0.8, 0, -Dp / 2, 0.42, 0.45, 0.42, '#7a5a3a'); man(sx * 0.8, -Dp / 2, sx > 0 ? Math.PI : 0, 'drink'); }
      bx(0, 0.74, -Dp / 2, 0.3, 0.05, 0.3, '#f6f3ea');
      const pl = new THREE.Mesh(unitBox, lampGlow); pl.scale.set(0.35, 0.18, 0.35); pl.position.set(0, H - 0.75, -Dp / 2); rg.add(pl);
    }
  }
  const inst = C.inst(unitBox, liveMat, Math.max(1, boxes.length)), dd = new THREE.Object3D(), cc = new THREE.Color(), wm = new THREE.Matrix4();
  inst.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1, boxes.length) * 3), 3);
  g.updateMatrixWorld(true);
  boxes.forEach((e, i) => {
    const o = e.o; dd.position.set(o[0], o[1], o[2]); dd.rotation.set(0, 0, 0); dd.scale.set(o[3], o[4], o[5]); dd.updateMatrix();
    wm.multiplyMatrices(e.rg.matrixWorld, dd.matrix); inst.setMatrixAt(i, wm); inst.setColorAt(i, cc.set(o[6]).convertSRGBToLinear());
  });
  inst.instanceMatrix.needsUpdate = inst.instanceColor.needsUpdate = true;
  inst.receiveShadow = true;                                  // binanın gölgesinde: gündüz loş, gece kendi ışığıyla
  const crowd = new C.Crowd(Math.max(1, people.length), { glow: liveGlow, shadow: false });
  people.forEach((p, i) => crowd.look(i, C.randomLook(rnd)));
  scene.add(g, inst, crowd.group);
  return { g, inst, crowd, people, extras, m2, base, holes };
}
function freeLive(b) {
  const L = live.get(b); if (!L) return;
  scene.remove(L.g, L.inst, L.crowd.group); L.inst.dispose(); L.crowd.dispose();
  L.g.traverse(o => { if (o.geometry && o.geometry !== unitBox) o.geometry.dispose(); });
  L.m2.dispose(); b.holeMats = null; if (!b.isFar && b.meshes[0]) b.meshes[0].material = b.nearMats;
  live.delete(b);
}
let liveT = 0;
const lp = {}, lv = new THREE.Vector3(), lq = new THREE.Vector3();
C.updaters.push((dt, t) => {
  const cam = C.camera.position;
  if ((liveT -= dt) <= 0) {
    liveT = 0.6;
    const want = C.buildings.filter(b => b.type !== 'house' && !b.cut && !b.isFar && b.lot.building === b && b.meshes[0] && b.meshes[0].geometry.userData.sides &&
      Math.hypot(b.lot.cx - cam.x, b.lot.cz - cam.z) < 75).sort((p, q) => Math.hypot(p.lot.cx - cam.x, p.lot.cz - cam.z) - Math.hypot(q.lot.cx - cam.x, q.lot.cz - cam.z)).slice(0, C.Q.live);
    for (const b of Array.from(live.keys())) if (!want.includes(b) || b.lot.building !== b || b.cut) freeLive(b);
    for (const b of want) if (!live.has(b)) { const L = buildLive(b, cam); if (L) live.set(b, L); }
  }
  for (const [b, L] of live) {
    L.m2.emissiveIntensity = L.base.emissiveIntensity;            // gece pencere ışığı ana malzemeyle aynı
    L.people.forEach((p, i) => {
      lv.set(p.x, 0, p.z); p.rg.localToWorld(lv);
      L.crowd.set(i, lv.x, p.rg.position.y, lv.z, p.ry + p.rg.rotation.y, C.pose(p.pose, t + p.ph, lp));
    });
    L.crowd.commit();
    for (const e of L.extras) {
      if (e.type === 'tv') { const k = 0.55 + 0.45 * Math.sin(t * 7 + e.ph) * Math.sin(t * 2.3 + e.ph * 2); e.m.material.color.setRGB(0.3 + 0.4 * k, 0.45 + 0.35 * k, 0.8 + 0.2 * k); }
      else { e.t = (e.t + dt * 0.5) % 1; e.m.position.y = 1.15 + e.t * 0.6; e.m.scale.setScalar(0.6 + e.t * 1.4); e.m.material.opacity = 0.5 * (1 - e.t); }
    }
  }
});
C.living = live;
C.onRemove.push(b => freeLive(b));                  // kat azaltınca odalar havada kalmasın
})();
