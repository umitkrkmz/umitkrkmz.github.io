/* ===== street.js: ağaçlar, sokak lambaları, bankalar (örnekli çizim) ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene;
C.streetLayers = [];

C.buildStreet = function () {
  const rnd = C.rng(41);
  const std = (hex, r) => new THREE.MeshStandardMaterial({ color: C.col(hex), roughness: r === undefined ? 0.9 : r });

  /* ağaçlar: gövde + taç, ekim ayına uygun birkaç sarı yaprak */
  const T = C.treeSpots, nT = T.length;
  const trunkG = new THREE.CylinderGeometry(0.13, 0.21, 2.6, 8); trunkG.translate(0, 1.3, 0);
  /* taç: dört yuvarlak küme, yüzeyi hafif pürüzlü, yumuşak gölgeli */
  const blob = (x, y, z, r) => {
    const g = new THREE.IcosahedronGeometry(r, 1), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const k = 1 + (Math.sin(p.getX(i) * 7.1 + p.getY(i) * 3.7) * Math.cos(p.getZ(i) * 5.3)) * 0.07;
      p.setXYZ(i, p.getX(i) * k + x, p.getY(i) * k + y, p.getZ(i) * k + z);
    }
    return g;
  };
  const crownG = C.mergeGeos([blob(0, 4.05, 0, 1.55), blob(0.8, 3.6, 0.35, 1.1), blob(-0.6, 3.75, -0.55, 1.1)]);
  const trunk = C.inst(trunkG, std('#6b4f3a'), nT);
  const crown = C.inst(crownG, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 }), nT);
  const greens = ['#4f8a3c', '#5c9a45', '#3f7a36', '#6aa04a'].map(C.col), autumn = ['#c9922f', '#b8742a'].map(C.col);
  T.forEach((t, i) => {
    C.setM(trunk, i, t[0], C.SW, t[1], 0, t[2], t[2], t[2]);
    C.setM(crown, i, t[0], C.SW, t[1], rnd() * 6, t[2], t[2] * (0.9 + rnd() * 0.25), t[2]);
    crown.setColorAt(i, rnd() < 0.14 ? autumn[(rnd() * autumn.length) | 0] : greens[(rnd() * greens.length) | 0]);
  });
  trunk.instanceMatrix.needsUpdate = crown.instanceMatrix.needsUpdate = true; crown.instanceColor.needsUpdate = true;
  trunk.castShadow = crown.castShadow = true;
  scene.add(trunk, crown); C.streetLayers.push(trunk, crown);

  /* lambalar ve gece ışık havuzları */
  const L = C.lampSpots, nL = L.length;
  const poleG = new THREE.CylinderGeometry(0.07, 0.1, 6.2, 6); poleG.translate(0, 3.1, 0);
  const headG = new THREE.BoxGeometry(1.4, 0.14, 0.32);
  const headMat = new THREE.MeshStandardMaterial({ color: C.col('#3b4046'), roughness: 0.5, emissive: C.col('#ffe0a8'), emissiveIntensity: 0 });
  const pole = C.inst(poleG, std('#3b4046', 0.6), nL), head = C.inst(headG, headMat, nL);
  const gc = document.createElement('canvas'); gc.width = gc.height = 128;
  const gx = gc.getContext('2d'), gr = gx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,224,168,1)'); gr.addColorStop(0.5, 'rgba(255,200,120,.35)'); gr.addColorStop(1, 'rgba(255,190,100,0)');
  gx.fillStyle = gr; gx.fillRect(0, 0, 128, 128);
  const poolG = new THREE.PlaneGeometry(1, 1); poolG.rotateX(-Math.PI / 2);
  const poolMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(gc), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 });
  const pool = C.inst(poolG, poolMat, nL);
  L.forEach((l, i) => {
    C.setM(pole, i, l[0], C.SW, l[1], 0);
    C.setM(head, i, l[0] + l[2] * 0.7, C.SW + 6.15, l[1] + l[3] * 0.7, l[2] !== 0 ? 0 : Math.PI / 2);
    C.setM(pool, i, l[0] + l[2] * 1.5, C.SW + 0.05, l[1] + l[3] * 1.5, 0, 11, 1, 11);
  });
  pole.instanceMatrix.needsUpdate = head.instanceMatrix.needsUpdate = pool.instanceMatrix.needsUpdate = true;
  /* çöp kutuları: her iki lambadan birinin 1,2 m yanında (gövde + kapak tek geometri) */
  const binG = C.mergeGeos([new THREE.CylinderGeometry(0.24, 0.21, 0.8, 12).translate(0, 0.4, 0), new THREE.CylinderGeometry(0.28, 0.28, 0.08, 12).translate(0, 0.84, 0)]);
  const bins = C.inst(binG, std('#2f5d46', 0.6), Math.ceil(nL / 2));
  for (let i = 0, k = 0; i < nL; i += 2, k++) { const l = L[i]; C.setM(bins, k, l[0] - l[3] * 1.2, C.SW, l[1] + l[2] * 1.2, 0); }
  bins.instanceMatrix.needsUpdate = true; bins.castShadow = true; scene.add(bins); C.streetLayers.push(bins);
  scene.add(pole, head, pool); C.streetLayers.push(pole, head, pool);
  C.nightListeners.push(n => { headMat.emissiveIntensity = n * 2.4; poolMat.opacity = n * 0.7; });

  /* bankalar */
  const B = C.benchSpots, nB = B.length;
  const seat = C.inst(new THREE.BoxGeometry(1.8, 0.08, 0.5), std('#7a5a3a'), nB);
  const back = C.inst(new THREE.BoxGeometry(1.8, 0.5, 0.06), std('#7a5a3a'), nB);
  B.forEach((b, i) => {
    const ry = b[2], nx = Math.sin(ry), nz = Math.cos(ry);
    C.setM(seat, i, b[0], C.SW + 0.45, b[1], ry);
    C.setM(back, i, b[0] - nx * 0.22, C.SW + 0.75, b[1] - nz * 0.22, ry);
  });
  seat.instanceMatrix.needsUpdate = back.instanceMatrix.needsUpdate = true;
  scene.add(seat, back); C.streetLayers.push(seat, back);
};
})();
