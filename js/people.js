/* ===== people.js: eklemli insan modeli, pozlar ve örnekli kalabalık çizimi ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;

/* ---------- parça geometrileri: eklem yerinde, uzuv -y yönünde sarkar, yüz +x ----------
   Her parçanın iki renk alanı var (aMask 0/1): örneğin kol ve el, bacak ve ayakkabı, baş ve saç.
   Köşe rengi (color) ayrıntıyı karartır: gözler, ağız. Örnek başına iki renk shader'da karıştırılır. */
function build(list) {
  const gs = list.map(([g, mask, shade]) => {
    const n = (g.index ? g.toNonIndexed() : g);
    const c = n.attributes.position.count, col = new Float32Array(c * 3).fill(1), m = new Float32Array(c).fill(mask);
    if (shade !== undefined) for (let i = 0; i < c; i++) { col[i * 3] = shade[0]; col[i * 3 + 1] = shade[1]; col[i * 3 + 2] = shade[2]; }
    n.setAttribute('color', new THREE.BufferAttribute(col, 3)); n.setAttribute('aMask', new THREE.BufferAttribute(m, 1));
    return n;
  });
  let total = 0; for (const g of gs) total += g.attributes.position.count;
  const out = new THREE.BufferGeometry();
  for (const [name, size] of [['position', 3], ['normal', 3], ['color', 3], ['aMask', 1]]) {
    const arr = new Float32Array(total * size); let o = 0;
    for (const g of gs) { arr.set(g.attributes[name].array, o); o += g.attributes[name].array.length; }
    out.setAttribute(name, new THREE.BufferAttribute(arr, size));
  }
  out.computeBoundingSphere(); return out;
}
const rb = (w, h, d, r, x, y, z) => C.roundBox(w, h, d, r, 1).clone().translate(x || 0, y || 0, z || 0);
const DARK = [0.08, 0.07, 0.07], LIP = [0.62, 0.38, 0.38];
const GEO = {
  torso: build([[rb(0.22, 0.5, 0.36, 0.08, 0, 0.29, 0), 0], [rb(0.21, 0.17, 0.33, 0.06, 0, 0.05, 0), 1]]),
  head: build([
    [new THREE.SphereGeometry(0.115, 14, 10).scale(1, 1.12, 0.95).translate(0, 0.13, 0), 0],
    [rb(0.035, 0.045, 0.028, 0.012, 0.112, 0.115, 0), 0],                                         // burun
    [new THREE.SphereGeometry(0.017, 6, 5).translate(0.098, 0.145, 0.04), 0, DARK],               // gözler
    [new THREE.SphereGeometry(0.017, 6, 5).translate(0.098, 0.145, -0.04), 0, DARK],
    [rb(0.012, 0.013, 0.038, 0.004, 0.104, 0.175, 0.042), 1], [rb(0.012, 0.013, 0.038, 0.004, 0.104, 0.175, -0.042), 1],   // kaşlar saç renginde
    [rb(0.012, 0.012, 0.046, 0.004, 0.106, 0.075, 0), 0, LIP],                                     // ağız
    [new THREE.SphereGeometry(0.126, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.55).scale(1, 1.05, 1).translate(-0.012, 0.15, 0), 1]   // saç
  ]),
  uarm: build([[rb(0.1, 0.32, 0.1, 0.045, 0, -0.15, 0), 0]]),
  farm: build([[rb(0.085, 0.27, 0.085, 0.04, 0, -0.13, 0), 0], [rb(0.09, 0.1, 0.055, 0.025, 0.005, -0.31, 0), 1]]),
  thigh: build([[rb(0.15, 0.46, 0.15, 0.065, 0, -0.22, 0), 0]]),
  shin: build([[rb(0.12, 0.42, 0.12, 0.05, 0, -0.2, 0), 0], [rb(0.25, 0.08, 0.11, 0.035, 0.05, -0.43, 0), 1]])
};
const PARTS = ['torso', 'head', 'uarmL', 'uarmR', 'farmL', 'farmR', 'thighL', 'thighR', 'shinL', 'shinR'];
const GEO_OF = { torso: 'torso', head: 'head', uarmL: 'uarm', uarmR: 'uarm', farmL: 'farm', farmR: 'farm', thighL: 'thigh', thighR: 'thigh', shinL: 'shin', shinR: 'shin' };

/* iki renkli örnek malzemesi: renk = köşe rengi × mix(örnek rengi, örnek rengi 2, maske) */
function crowdMat(glow) {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, vertexColors: true });
  m.onBeforeCompile = sh => {
    if (glow) {
      sh.uniforms.uGlow = glow;
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uGlow;')
        .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += diffuseColor.rgb * uGlow;');
    }
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aMask;\nattribute vec3 instanceColor2;')
      .replace('#include <color_vertex>', [
        '#if defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )', 'vColor = vec3( 1.0 );', '#endif',
        '#ifdef USE_COLOR', 'vColor.xyz *= color.xyz;', '#endif',
        '#ifdef USE_INSTANCING_COLOR', 'vColor.xyz *= mix( instanceColor.xyz, instanceColor2, aMask );', '#endif'].join('\n'));
  };
  m.customProgramCacheKey = () => glow ? 'crowd2g' : 'crowd2';
  return m;
}

/* ---------- görünüm: deri, gömlek, pantolon, ayakkabı, saç, kol boyu ---------- */
const SKIN = ['#f1c9a5', '#e8b88f', '#d9a37c', '#b98260', '#8d5a3c', '#6b4430'];
const SHIRT = ['#c9372c', '#2f6f8f', '#e8e2d0', '#3b7a57', '#d29a2d', '#6b4e8f', '#222b33', '#b3566b', '#f2f2ee', '#4a6fa5', '#8a5a3a', '#2a9d8f'];
const PANTS = ['#2d3b55', '#3a3a3a', '#4a4036', '#1f2a3a', '#6b6255', '#2b2f36', '#5a4a6a'];
const SHOES = ['#1b1b1d', '#3a2a1e', '#e8e8e4', '#5a2f22'];
const HAIR = ['#1d1612', '#3b2a1e', '#5c4030', '#8a6a42', '#c9a46a', '#a8a29a', '#2a2420'];
C.randomLook = function (rnd) {
  rnd = rnd || Math.random; const p = a => a[(rnd() * a.length) | 0];
  return { skin: p(SKIN), shirt: p(SHIRT), pants: p(PANTS), shoes: p(SHOES), hair: p(HAIR), long: rnd() < 0.45 };
};

/* ---------- pozlar: açılar radyan; +z dönüşü uzvu öne, gövdeyi arkaya yatırır ---------- */
const Z = () => ({ y: 0, roll: 0, lean: 0, twist: 0, hy: 0, hp: 0, hip: [0, 0], knee: [0, 0], sh: [0, 0], ab: [0.08, 0.08], el: [0.15, 0.15] });
const P = Z();
C.pose = function (name, t, out) {
  const p = out || P, s = Math.sin;
  Object.assign(p, Z()); p.hip = [0, 0]; p.knee = [0, 0]; p.sh = [0, 0]; p.ab = [0.08, 0.08]; p.el = [0.15, 0.15];
  const sit = () => { p.y = -0.44; p.hip = [1.5, 1.5]; p.knee = [-1.5, -1.5]; };
  switch (name) {
    case 'walk': case 'run': {
      const a = name === 'run' ? 0.85 : 0.5, k = name === 'run' ? 1.2 : 0.65;
      p.hip = [s(t) * a, -s(t) * a]; p.knee = [-Math.max(0, s(t + 1.6)) * k, -Math.max(0, -s(t + 1.6)) * k];
      p.sh = [-s(t) * a * 0.9, s(t) * a * 0.9]; p.el = [0.3 + (name === 'run' ? 1.0 : 0.15) + Math.max(0, -s(t)) * 0.3, 0.3 + (name === 'run' ? 1.0 : 0.15) + Math.max(0, s(t)) * 0.3];
      p.y = Math.abs(s(t)) * (name === 'run' ? 0.06 : 0.025); p.lean = name === 'run' ? -0.18 : -0.04; break;
    }
    case 'stand': p.lean = s(t * 0.9) * 0.02; p.hy = s(t * 0.37) * 0.4; p.el = [0.2, 0.2]; break;
    case 'talk': p.hy = s(t * 0.5) * 0.2; p.sh = [0.35 + s(t * 2.2) * 0.25, 0.1]; p.el = [1.1 + s(t * 3.1) * 0.3, 0.2]; p.ab = [0.25, 0.08]; break;
    case 'sit': sit(); p.sh = [0.35, 0.35]; p.el = [0.9, 0.9]; p.hy = s(t * 0.3) * 0.3; break;
    case 'drink': sit(); p.sh = [0.35, 0.5 + Math.max(0, s(t * 0.7)) * 0.6]; p.el = [0.9, 1.4 + Math.max(0, s(t * 0.7)) * 0.9]; break;
    case 'tv': sit(); p.lean = 0.22; p.hp = -0.1; p.sh = [0.25, 0.25]; p.el = [0.6, 0.6]; p.ab = [0.2, 0.2]; break;
    case 'study': sit(); p.lean = -0.22; p.hp = 0.35; p.sh = [1.0, 0.9]; p.el = [1.0, 1.1 + s(t * 6) * 0.08]; p.ab = [0.15, 0.15]; break;
    case 'cook': p.lean = -0.08; p.sh = [0.95, 0.85 + s(t * 2.4) * 0.2]; p.el = [0.9, 1.0]; p.ab = [0.12, 0.12 + s(t * 2.4) * 0.15]; p.hp = 0.25; break;
    case 'jump': p.hip = [0.95, 0.35]; p.knee = [-1.35, -0.7]; p.sh = [2.3, 2.5]; p.el = [0.35, 0.35]; p.ab = [0.3, 0.3]; p.lean = -0.12; break;
    case 'kneel': p.y = -0.47; p.hip = [0.12, 0.12]; p.knee = [-1.6, -1.6]; p.sh = [0.15, 0.15]; p.el = [0.5, 0.5]; p.lean = -0.05; break;   // halıda diz çökmüş
    case 'lie': p.roll = Math.PI / 2; p.sh = [0.1, 0.1]; p.hp = -0.2; break;     // kök ayak ucunda, baş -x yönünde
    case 'handsup': p.sh = [2.9, 2.9]; p.el = [0.2, 0.2]; p.ab = [0.25, 0.25]; break;
    default: break;
  }
  return p;
};

/* ---------- kalabalık: her parça bir InstancedMesh; set() eklem zincirinden matrisleri hesaplar ---------- */
const M4 = THREE.Matrix4, m0 = new M4(), mp = new M4(), mh = new M4(), ms = new M4(), me = new M4(), mt = new M4(), mk = new M4(), T = new M4(), R = new M4(), ZERO = new M4().makeScale(0, 0, 0);
const ccol = new THREE.Color();
function joint(out, parent, x, y, z, rz, rx, ry) {
  out.multiplyMatrices(parent, T.makeTranslation(x, y, z));
  if (ry) out.multiply(R.makeRotationY(ry));
  if (rz) out.multiply(R.makeRotationZ(rz));
  if (rx) out.multiply(R.makeRotationX(rx));
  return out;
}
C.Crowd = function (cap, opts) {
  opts = opts || {};
  this.cap = cap; this.group = new THREE.Group(); this.mesh = {}; this.store = []; this.slot = new Int32Array(cap).fill(-1); this.n = 0;
  const mat = crowdMat(opts.glow);
  for (const k of PARTS) {
    const g = GEO[GEO_OF[k]].clone();
    g.setAttribute('instanceColor2', new THREE.InstancedBufferAttribute(new Float32Array(cap * 3).fill(1), 3));
    const m = C.inst(g, mat, cap);
    m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(cap * 3).fill(1), 3);
    m.castShadow = opts.shadow !== false; m.receiveShadow = false;
    for (let i = 0; i < cap; i++) m.setMatrixAt(i, ZERO);
    this.mesh[k] = m; this.group.add(m);
  }
};
/* görünüm renkleri ayrıca saklanır: sıkıştırılmış çizimde kişi her karede başka bir yuvaya düşebilir */
C.Crowd.prototype.look = function (i, L) {
  const st = this.store[i] = this.store[i] || {};
  const c1 = (k, a, b) => {
    const m = this.mesh[k]; ccol.set(a).convertSRGBToLinear(); const r1 = ccol.r, g1 = ccol.g, b1 = ccol.b; ccol.set(b).convertSRGBToLinear();
    st[k] = [r1, g1, b1, ccol.r, ccol.g, ccol.b];
    m.instanceColor.setXYZ(i, r1, g1, b1); m.geometry.attributes.instanceColor2.setXYZ(i, ccol.r, ccol.g, ccol.b);
    m.instanceColor.needsUpdate = m.geometry.attributes.instanceColor2.needsUpdate = true;
  };
  c1('torso', L.shirt, L.pants); c1('head', L.skin, L.hair);
  for (const s of ['L', 'R']) {
    c1('uarm' + s, L.shirt, L.shirt); c1('farm' + s, L.long ? L.shirt : L.skin, L.skin);
    c1('thigh' + s, L.pants, L.pants); c1('shin' + s, L.pants, L.shoes);
  }
};
C.Crowd.prototype.hide = function (i) { for (const k of PARTS) this.mesh[k].setMatrixAt(i, ZERO); };
/* x, y, z ayak tabanı; ry yön (0: +x'e bakar); p bir C.pose çıktısı */
C.Crowd.prototype.set = function (i, x, y, z, ry, p, scale) {
  const M = this.mesh, sc = scale || 1;
  m0.makeTranslation(x, y + p.y * sc, z); m0.multiply(R.makeRotationY(ry));
  if (p.roll) m0.multiply(R.makeRotationZ(p.roll));
  if (sc !== 1) m0.multiply(R.makeScale(sc, sc, sc));
  joint(mp, m0, 0, 0.9, 0, p.lean, 0, p.twist); M.torso.setMatrixAt(i, mp);
  joint(mh, mp, 0, 0.55, 0, p.hp, 0, p.hy); M.head.setMatrixAt(i, mh);
  joint(ms, mp, 0, 0.47, 0.205, p.sh[0], -p.ab[0]); M.uarmL.setMatrixAt(i, ms);
  joint(me, ms, 0, -0.31, 0, p.el[0]); M.farmL.setMatrixAt(i, me);
  joint(ms, mp, 0, 0.47, -0.205, p.sh[1], p.ab[1]); M.uarmR.setMatrixAt(i, ms);
  joint(me, ms, 0, -0.31, 0, p.el[1]); M.farmR.setMatrixAt(i, me);
  joint(mt, m0, 0, 0.9, 0.095, p.hip[0]); M.thighL.setMatrixAt(i, mt);
  joint(mk, mt, 0, -0.45, 0, p.knee[0]); M.shinL.setMatrixAt(i, mk);
  joint(mt, m0, 0, 0.9, -0.095, p.hip[1]); M.thighR.setMatrixAt(i, mt);
  joint(mk, mt, 0, -0.45, 0, p.knee[1]); M.shinR.setMatrixAt(i, mk);
};
C.Crowd.prototype.commit = function () { for (const k of PARTS) this.mesh[k].instanceMatrix.needsUpdate = true; };
/* sıkıştırılmış çizim: begin(); her görünen için put(kişi, ...); end(). Gizli kişiler hiç işlenmez (count küçülür). */
C.Crowd.prototype.begin = function () { this.n = 0; };
C.Crowd.prototype.put = function (i, x, y, z, ry, p, scale) {
  const n = this.n++;
  if (this.slot[n] !== i) {
    const st = this.store[i];
    if (st) for (const k of PARTS) { const c = st[k], m = this.mesh[k]; m.instanceColor.setXYZ(n, c[0], c[1], c[2]); m.geometry.attributes.instanceColor2.setXYZ(n, c[3], c[4], c[5]); }
    this.slot[n] = i; this.dirty = true;
  }
  this.set(n, x, y, z, ry, p, scale);
};
C.Crowd.prototype.end = function () {
  for (const k of PARTS) {
    const m = this.mesh[k]; m.count = this.n; m.instanceMatrix.needsUpdate = true;
    if (this.dirty) m.instanceColor.needsUpdate = m.geometry.attributes.instanceColor2.needsUpdate = true;
  }
  this.dirty = false;
};
C.Crowd.prototype.dispose = function () { for (const k of PARTS) { this.mesh[k].geometry.dispose(); this.mesh[k].dispose(); } };
})();
