/* ===== ponds.js: park göllerinin süsü: kıyı taşları, nilüferler, sazlar, yüzen ördekler, sudaki halkalar ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene;
const std = (hex, r) => new THREE.MeshStandardMaterial({ color: C.col(hex), roughness: r === undefined ? 0.9 : r });
const rnd = C.rng(77);
const ells = (p, r, a) => [p.x + Math.cos(a) * p.a * r, p.z + Math.sin(a) * p.b * r];   // elips üstünde nokta (r: 1 kıyı)

let ducks = [], duckParts = null, ripples = [], ripI = null, built = false;
const NS = 34, NL = 7, ND = 3, NR = 3;
function build() {
  built = true;
  const P = C.ponds || []; if (!P.length) return;
  /* kıyı taşları: biraz rastgele boy, iki ton */
  const stones = C.inst(C.roundBox(0.7, 0.3, 0.5, 0.12).clone(), std('#ffffff', 0.95), P.length * NS);
  stones.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(P.length * NS * 3).fill(1), 3);
  const dm = new THREE.Object3D(), sc = [C.col('#9a968c'), C.col('#7f7b72'), C.col('#b2ada2')];
  let k = 0;
  for (const p of P) for (let i = 0; i < NS; i++) {
    const a = i / NS * Math.PI * 2 + rnd() * 0.08, [x, z] = ells(p, 1.03 + rnd() * 0.04, a), s = 0.75 + rnd() * 0.6;
    dm.position.set(x, C.SW + 0.06, z); dm.rotation.set(0, -a + (rnd() - 0.5) * 0.6, 0); dm.scale.set(s, 0.7 + rnd() * 0.6, s); dm.updateMatrix();
    stones.setMatrixAt(k, dm.matrix); stones.setColorAt(k, sc[(rnd() * 3) | 0]); k++;
  }
  stones.castShadow = stones.receiveShadow = true; stones.instanceMatrix.needsUpdate = true; stones.instanceColor.needsUpdate = true;
  /* nilüfer yaprakları (çentikli daire) ve birkaçının üstünde pembe çiçek */
  const padG = new THREE.CircleGeometry(0.42, 14, 0.4, Math.PI * 2 - 0.4); padG.rotateX(-Math.PI / 2);
  const pads = C.inst(padG, std('#3f7d3a', 0.6), P.length * NL), flowers = C.inst(C.mergeGeos([0, 1, 2, 3, 4].map(q => new THREE.ConeGeometry(0.07, 0.16, 4).rotateZ(0.5).translate(0.06, 0.06, 0).rotateY(q / 5 * Math.PI * 2))), std('#f29bc0', 0.5), P.length * 3);
  k = 0; let kf = 0;
  for (const p of P) for (let i = 0; i < NL; i++) {
    const a = rnd() * Math.PI * 2, r = 0.35 + rnd() * 0.45, [x, z] = ells(p, r, a), s = 0.7 + rnd() * 0.6;
    dm.position.set(x, p.y + 0.012, z); dm.rotation.set(0, rnd() * 6.28, 0); dm.scale.set(s, 1, s); dm.updateMatrix(); pads.setMatrixAt(k++, dm.matrix);
    if (i < 3) { dm.position.y = p.y + 0.02; dm.scale.set(1, 1, 1); dm.updateMatrix(); flowers.setMatrixAt(kf++, dm.matrix); }
  }
  pads.instanceMatrix.needsUpdate = flowers.instanceMatrix.needsUpdate = true;
  /* sazlar: kıyının bir yanında iki-üç küme; ince saplar ve kahverengi başlar */
  const stems = [], heads = [];
  for (let q = 0; q < 9; q++) {
    const x = (rnd() - 0.5) * 0.7, z = (rnd() - 0.5) * 0.7, h = 0.9 + rnd() * 0.7, lean = (rnd() - 0.5) * 0.2;
    stems.push(new THREE.CylinderGeometry(0.012, 0.018, h, 4).translate(0, h / 2, 0).rotateZ(lean).translate(x, 0, z));
    if (q % 2 === 0) heads.push(new THREE.CylinderGeometry(0.03, 0.03, 0.16, 6).translate(0, h - 0.05, 0).rotateZ(lean).translate(x, 0, z));
  }
  const reedA = C.inst(C.mergeGeos(stems), std('#6f8f3a', 0.8), P.length * 3), reedB = C.inst(C.mergeGeos(heads), std('#6b4a2b', 0.9), P.length * 3);
  k = 0;
  for (const p of P) { const a0 = rnd() * 6.28; for (let i = 0; i < 3; i++) {
    const [x, z] = ells(p, 0.9, a0 + i * 0.35); dm.position.set(x, p.y - 0.02, z); dm.rotation.set(0, rnd() * 6.28, 0); dm.scale.set(1, 1, 1); dm.updateMatrix();
    reedA.setMatrixAt(k, dm.matrix); reedB.setMatrixAt(k, dm.matrix); k++;
  } }
  reedA.instanceMatrix.needsUpdate = reedB.instanceMatrix.needsUpdate = true; reedA.castShadow = true;
  for (const m of [stones, pads, flowers, reedA, reedB]) { scene.add(m); C.streetLayers.push(m); }

  /* ördekler: gövde, baş, gaga; erkeklerin başı yeşil */
  const body = C.inst(C.roundBox(0.38, 0.17, 0.22, 0.08).clone(), std('#ffffff', 0.8), P.length * ND);
  const head = C.inst(C.roundBox(0.12, 0.12, 0.11, 0.05).clone().translate(0.15, 0.17, 0), std('#ffffff', 0.7), P.length * ND);
  const beak = C.inst(new THREE.BoxGeometry(0.08, 0.03, 0.06).translate(0.24, 0.155, 0), std('#e8a020', 0.6), P.length * ND);
  for (const m of [body, head]) m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(P.length * ND * 3).fill(1), 3);
  const BODY = [C.col('#8a6a48'), C.col('#f1efe8'), C.col('#9a8064')], HEAD = [C.col('#2f6b3a'), C.col('#f1efe8'), C.col('#7d6248')];
  P.forEach((p, pi) => { for (let i = 0; i < ND; i++) {
    const kind = (rnd() * 3) | 0, d = { p, k: pi * ND + i, a: rnd() * 6.28, r: 0.35 + rnd() * 0.3, w: (rnd() < 0.5 ? -1 : 1) * (0.05 + rnd() * 0.05), ph: rnd() * 10 };
    body.setColorAt(d.k, BODY[kind]); head.setColorAt(d.k, HEAD[kind]); ducks.push(d);
  } });
  body.instanceColor.needsUpdate = head.instanceColor.needsUpdate = true; body.castShadow = true;
  duckParts = [body, head, beak];
  for (const m of duckParts) { scene.add(m); C.peopleLayers.push(m); }
  /* halkalar: balık sıçrar ya da ördek dalar; toplamalı karışım, renk solar */
  ripI = C.inst(new THREE.RingGeometry(0.85, 1, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }), P.length * NR);
  ripI.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(P.length * NR * 3), 3);
  P.forEach(p => { for (let i = 0; i < NR; i++) ripples.push({ p, t: rnd() * 4, x: p.x, z: p.z }); });
  scene.add(ripI); C.peopleLayers.push(ripI);
}

const dm2 = new THREE.Object3D(), rc = new THREE.Color();
C.updaters.push((dt, t, D) => {
  if (!built) { if (C.ponds && C.ponds.length && C.peopleLayers) build(); else return; }
  if (!duckParts || D > 130) return;
  for (const d of ducks) {
    d.a += d.w * dt; d.ph += dt;
    const p = d.p, r = d.r + Math.sin(d.ph * 0.3) * 0.08, x = p.x + Math.cos(d.a) * p.a * r, z = p.z + Math.sin(d.a) * p.b * r;
    const tx = -Math.sin(d.a) * p.a * Math.sign(d.w), tz = Math.cos(d.a) * p.b * Math.sign(d.w);     // gidiş yönü
    dm2.position.set(x, p.y - 0.04 + Math.sin(d.ph * 2.3) * 0.01, z); dm2.rotation.set(0, Math.atan2(-tz, tx), Math.sin(d.ph * 1.7) * 0.04); dm2.scale.set(1, 1, 1); dm2.updateMatrix();
    for (const m of duckParts) m.setMatrixAt(d.k, dm2.matrix);
  }
  for (const m of duckParts) m.instanceMatrix.needsUpdate = true;
  ripples.forEach((q, i) => {
    q.t += dt;
    if (q.t > 3.2) { q.t = -Math.random() * 3; const a = Math.random() * 6.28, r = Math.random() * 0.7; q.x = q.p.x + Math.cos(a) * q.p.a * r; q.z = q.p.z + Math.sin(a) * q.p.b * r; }
    const u = Math.max(0, q.t) / 3.2, s = q.t > 0 ? 0.15 + u * 1.3 : 0;
    dm2.position.set(q.x, q.p.y + 0.015, q.z); dm2.rotation.set(0, 0, 0); dm2.scale.set(s || 1e-4, 1, s || 1e-4); dm2.updateMatrix();
    ripI.setMatrixAt(i, dm2.matrix); rc.setScalar(q.t > 0 ? (1 - u) * 0.35 : 0); ripI.setColorAt(i, rc);
  });
  ripI.instanceMatrix.needsUpdate = true; ripI.instanceColor.needsUpdate = true;
});
})();
