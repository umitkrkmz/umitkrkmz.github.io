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
function interiorize(m, cw) {
  m.defines = Object.assign(m.defines || {}, cw ? { INTERIOR: 1, CW: 1 } : { INTERIOR: 1 });
  m.extensions = Object.assign(m.extensions || {}, { derivatives: true });
  m.onBeforeCompile = sh => {
    C.addGroundAO(sh);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + ROOM_FN)
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n' + ROOM_APPLY);
  };
  m.customProgramCacheKey = () => cw ? 'interior-cw' : 'interior-apt';
  m.needsUpdate = true;
}
for (const set of ['apt', 'cw']) for (const arr of C.mats.near[set]) interiorize(arr[0], set === 'cw');

/* ---------- kesit: binanın katları ayrılır, her katta odalar, mobilya ve insanlar ----------
   Tüm kutular tek bir InstancedMesh (örnek başına renk), insanlar ikinci bir çift. Katlar açılırken
   yalnızca matrisler yeniden yazılır. Duvarlar alçak (1,1 m), böylece her açıdan içi görünür. */
const unitBox = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);           // tabanı y=0'da
const headG = new THREE.SphereGeometry(0.13, 10, 8);
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
const boxMat = cutMat(), bodyMat = cutMat(), skinMat = cutMat();
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
    if (rnd() < 0.8) man(r.cx - 0.4, r.z1 - 0.65, 'sit', Math.PI / 2);
    if (rnd() < 0.5) man(r.cx + 0.5, r.z1 - 0.65, 'sit', Math.PI / 2);
    if (rnd() < 0.4) man(r.x0 + r.w * 0.7, r.cz, 'stand');
  }
  function bedroom(r) {
    if (r.w < 2.6 || r.d < 2.8) return;
    const bw = Math.min(1.6, r.w - 0.8);
    put(r.cx, 0, r.z1 - 1.1, bw, 0.5, 2.0, P.wood); put(r.cx, 0.5, r.z1 - 0.32, bw - 0.2, 0.12, 0.35, P.white);
    put(r.cx, 0.5, r.z1 - 1.35, bw + 0.04, 0.07, 1.3, pick(P.bed));
    if (r.w > 3.4) put(r.x0 + 0.65, 0, r.z0 + 0.35, 1.1, 1.7, 0.55, P.wood);
    if (rnd() < 0.45) man(r.cx, r.z1 - 1.2, 'lie', 0, 0.62);
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
    if (rnd() < 0.7) man(r.x0 + 0.3 + cl / 2, r.z1 - 1.0, 'stand');
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
      if (rnd() < 0.65) man(x, z + 0.6, 'sit', -Math.PI / 2);
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
    const y0 = B + p[0] * step + p[2], pose = p[4], sway = pose === 'stand' ? Math.sin(t * 0.8 + p[8]) * 0.5 : 0;
    const ry = p[5] + sway, tall = pose === 'stand' ? 1.45 : pose === 'sit' ? 0.95 : 0.4;
    if (pose === 'lie') { cd.position.set(lot.cx + p[1], y0, lot.cz + p[3] - 0.75); cd.rotation.set(Math.PI / 2, 0, 0); cd.scale.set(0.42, 1.5, 0.28); }
    else { cd.position.set(lot.cx + p[1], y0 + (pose === 'sit' ? 0.25 : 0), lot.cz + p[3]); cd.rotation.set(0, ry, 0); cd.scale.set(0.42, tall, 0.28); }
    cd.updateMatrix(); cut.body.setMatrixAt(i, cd.matrix);
    if (pose === 'lie') cd.position.set(lot.cx + p[1], y0 + 0.02, lot.cz + p[3] + 0.85);      // baş yastıkta
    else cd.position.set(lot.cx + p[1], y0 + (pose === 'sit' ? 0.25 : 0) + tall + 0.13, lot.cz + p[3]);
    cd.rotation.set(0, 0, 0); cd.scale.set(1, 1, 1); cd.updateMatrix(); cut.head.setMatrixAt(i, cd.matrix);
  });
  cut.boxes.instanceMatrix.needsUpdate = cut.body.instanceMatrix.needsUpdate = cut.head.instanceMatrix.needsUpdate = true;
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
    cut.body = C.inst(unitBox, bodyMat, data.people.length); cut.head = C.inst(headG, skinMat, data.people.length);
    data.people.forEach((p, i) => { cut.body.setColorAt(i, ccol.set(p[6]).convertSRGBToLinear()); cut.head.setColorAt(i, ccol.set(p[7]).convertSRGBToLinear()); });
    for (const m of [cut.boxes, cut.body, cut.head]) { m.castShadow = m.receiveShadow = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; g.add(m); }
    scene.add(g); cut.group = g; writeMatrices(0);
    return data;
  },
  close() {
    if (!cut.b) return;
    const b = cut.b; b.cut = false; b.group.visible = true;
    scene.remove(cut.group); for (const m of [cut.boxes, cut.body, cut.head]) m.dispose();
    cut.b = cut.group = cut.data = null;
  }
};
C.updaters.push((dt, t) => {
  if (!cut.b) return;
  if (!cut.b.lot || cut.b.lot.building !== cut.b) { C.cutaway.close(); return; }      // bina yıkıldı ya da şehir yenilendi
  cut.g = Math.min(1, cut.g + dt / 1.2);
  writeMatrices(t);
});
})();
