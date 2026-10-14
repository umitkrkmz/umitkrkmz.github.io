/* ===== details.js: tabelalar, çatı donanımı, balkonlar, parklar, saat kulesi ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene;
const boxG = new THREE.BoxGeometry(1, 1, 1), cylG = new THREE.CylinderGeometry(1, 1, 1, 14), planeG = new THREE.PlaneGeometry(1, 1);
const sphG = new THREE.SphereGeometry(1, 8, 6);
const std = (hex, r) => new THREE.MeshStandardMaterial({ color: C.col(hex), roughness: r === undefined ? 0.85 : r });

/* ---------- tabela dokuları ---------- */
const SIGNS = ['FIRIN', 'ECZANE', 'KIRTASİYE', 'ÇAY OCAĞI', 'MARKET', 'KUAFÖR', 'KEBAP', 'KAFE', 'OPTİK', 'ÇİÇEKÇİ', 'TAMİRCİ', 'SİMİT SARAYI'];
const SIGN_BG = ['#b3402e', '#1f5a7a', '#2f6f4e', '#c9902a', '#5a3f86', '#222b33', '#a0306a', '#2c7f86', '#7a5a2a', '#3d3d8f', '#8a2d2d', '#1e6b3a'];
const signMats = SIGNS.map((name, i) => {
  const cv = document.createElement('canvas'); cv.width = 640; cv.height = 136;
  const x = cv.getContext('2d'); x.scale(2, 2);                     // 2x çözünürlük, çizim koordinatları aynı
  x.fillStyle = SIGN_BG[i]; x.fillRect(0, 0, 320, 68);
  x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 3; x.strokeRect(4, 4, 312, 60);
  x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
  let size = 40; x.font = `700 ${size}px "Big Shoulders Display","Arial Narrow",sans-serif`;
  while (x.measureText(name).width > 280 && size > 16) { size -= 2; x.font = `700 ${size}px "Big Shoulders Display","Arial Narrow",sans-serif`; }
  x.fillText(name, 160, 36);
  const t = new THREE.CanvasTexture(cv); t.encoding = THREE.sRGBEncoding; t.anisotropy = C.maxAniso;
  return new THREE.MeshStandardMaterial({ map: t, roughness: 0.6, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0.1 });
});
const shopMat = new THREE.MeshStandardMaterial({ color: C.col('#26323d'), roughness: 0.2, metalness: 0.2, emissive: C.col('#ffd9a0'), emissiveIntensity: 0 });
C.nightListeners.push(n => { signMats.forEach(m => m.emissiveIntensity = 0.1 + 0.9 * n); shopMat.emissiveIntensity = n * 1.1; });

const awnMats = ['#b3402e', '#2f6f8f', '#d29a2d', '#3b7a57', '#6b4e8f'].map(h => std(h, 0.9));
const acMat = std('#9a9ea3', 0.8), tankMat = std('#7d8b96', 0.7), slabMat = std('#d8d2c4'), railMat = std('#2b3036', 0.6);
const mastMat = std('#8d9298', 0.6), doorMat = std('#4a3a2c');
C.blinkMat = new THREE.MeshBasicMaterial({ color: 0xff3b30, transparent: true, opacity: 1, fog: false });
C.updaters.push((dt, t) => { C.blinkMat.opacity = Math.sin(t * 3) > 0 ? 1 : 0.25; });

/* ---------- kafe önü: iki yuvarlak masa, sandalyeler, fincanlar, oturan insanlar ---------- */
const CAFE = new Set([3, 7, 11]);                       // ÇAY OCAĞI, KAFE, SİMİT SARAYI
const tableMat = std('#e8e2d0', 0.6), chairMat = std('#7a5a3a'), cupMat = std('#f6f3ea', 0.4);
/* kafede oturanlar tek bir kalabalıkta; ayrıntı grubu görünürken çizilir, bina yıkılınca yer boşalır */
const cafeCrowd = new C.Crowd(260), seats = [], freeIdx = [], cpose = {};
for (let i = 259; i >= 0; i--) freeIdx.push(i);
scene.add(cafeCrowd.group);
function seat(g, x, z, ry, rnd) {
  if (!freeIdx.length) return;
  const i = freeIdx.pop(); cafeCrowd.look(i, C.randomLook(rnd));
  seats.push({ g, i, x, z, ry, ph: rnd() * 20 });
}
C.updaters.push((dt, t, D) => {
  cafeCrowd.group.visible = D <= 130;
  if (!cafeCrowd.group.visible) return;
  for (let k = seats.length - 1; k >= 0; k--) {
    const s = seats[k];
    if (!s.g.parent) { cafeCrowd.hide(s.i); freeIdx.push(s.i); seats.splice(k, 1); continue; }   // bina yıkıldı
    if (s.g.visible) cafeCrowd.set(s.i, s.x, C.SW, s.z, s.ry, C.pose(Math.sin(t * 0.13 + s.ph) > 0.4 ? 'drink' : 'sit', t + s.ph, cpose));
    else cafeCrowd.hide(s.i);
  }
  cafeCrowd.commit();
});
function cafe(g, px, pz, f, tx, tz, rnd) {
  const add = (geo, mat, x, y, z, sx, sy, sz) => { const m = new THREE.Mesh(geo, mat); m.scale.set(sx, sy, sz); m.position.set(x, y, z); m.castShadow = true; g.add(m); return m; };
  for (const s of [-1, 1]) {
    const cx = px + f.nx * 1.7 + tx * s * 1.5, cz = pz + f.nz * 1.7 + tz * s * 1.5;
    add(cylG, tableMat, cx, C.SW + 0.36, cz, 0.05, 0.72, 0.05);
    add(cylG, tableMat, cx, C.SW + 0.74, cz, 0.42, 0.04, 0.42);
    for (const c of [-1, 1]) {
      const sx = cx + tx * c * 0.72, sz = cz + tz * c * 0.72;
      add(boxG, chairMat, sx, C.SW + 0.225, sz, 0.42, 0.45, 0.42);
      add(boxG, chairMat, sx + tx * c * 0.2, C.SW + 0.67, sz + tz * c * 0.2, Math.abs(tz) * 0.42 + 0.06, 0.45, Math.abs(tx) * 0.42 + 0.06);
      if (rnd() < 0.7) {
        seat(g, sx, sz, Math.atan2(-(cz - sz), cx - sx), rnd);
        add(cylG, cupMat, cx + tx * c * 0.2, C.SW + 0.8, cz + tz * c * 0.2, 0.05, 0.09, 0.05);
      }
    }
  }
}

C.SIGNS = SIGNS; C.shopDoors = [];
/* ---------- bina ayrıntısı (yalnızca yakınlaşınca kurulur) ---------- */
C.buildDetail = function (b) {
  const g = new THREE.Group(), rnd = C.rng(b.seed + 777), lot = b.lot, bt = b.baseTier, tt = b.topTier;
  const x0 = lot.bx - 22, x1 = lot.bx + 22, z0 = lot.bz - 22, z1 = lot.bz + 22;
  const faces = [
    { nx: 1, nz: 0, len: bt.d, cx: lot.cx + bt.w / 2, cz: lot.cz, ry: Math.PI / 2, out: lot.cx + bt.w / 2 > x1 - 8 },
    { nx: -1, nz: 0, len: bt.d, cx: lot.cx - bt.w / 2, cz: lot.cz, ry: -Math.PI / 2, out: lot.cx - bt.w / 2 < x0 + 8 },
    { nx: 0, nz: 1, len: bt.w, cx: lot.cx, cz: lot.cz + bt.d / 2, ry: 0, out: lot.cz + bt.d / 2 > z1 - 8 },
    { nx: 0, nz: -1, len: bt.w, cx: lot.cx, cz: lot.cz - bt.d / 2, ry: Math.PI, out: lot.cz - bt.d / 2 < z0 + 8 }
  ];
  /* zemin kat: tabela, tente, vitrin */
  for (const f of faces) {
    if (!f.out) continue;
    const tx = -f.nz, tz = f.nx;
    if (b.type === 'house') {
      const dr = new THREE.Mesh(boxG, doorMat); dr.scale.set(1.2, 2.1, 0.12);
      dr.position.set(f.cx + f.nx * 0.07, C.SW + 1.05, f.cz + f.nz * 0.07); dr.rotation.y = f.ry; g.add(dr);
      continue;
    }
    const nS = f.len > 14 ? 2 : 1;
    for (let k = 0; k < nS; k++) {
      const off = nS === 2 ? (k ? 1 : -1) * f.len * 0.22 : 0;
      const px = f.cx + tx * off, pz = f.cz + tz * off;
      const si = Math.floor(rnd() * signMats.length), sign = new THREE.Mesh(planeG, signMats[si]);
      sign.scale.set(5.2, 1.1, 1); sign.rotation.y = f.ry;
      sign.position.set(px + f.nx * 0.08, C.SW + 3.55, pz + f.nz * 0.08); g.add(sign);
      const shop = new THREE.Mesh(planeG, shopMat);
      shop.scale.set(4.8, 2.0, 1); shop.rotation.y = f.ry;
      shop.position.set(px + f.nx * 0.06, C.SW + 1.35, pz + f.nz * 0.06); g.add(shop);
      const aw = new THREE.Mesh(boxG, awnMats[Math.floor(rnd() * awnMats.length)]);
      aw.rotation.order = 'YXZ'; aw.rotation.set(0.22, f.ry, 0); aw.scale.set(5.6, 0.12, 1.4);
      aw.position.set(px + f.nx * 0.75, C.SW + 2.8, pz + f.nz * 0.75); aw.castShadow = true; g.add(aw);
      if (CAFE.has(si)) cafe(g, px, pz, f, tx, tz, rnd);
      C.shopDoors.push({ g, name: SIGNS[si], si, x: px, z: pz, nx: f.nx, nz: f.nz, len: f.len, two: nS === 2 });   // venues.js: girilebilir dükkân
    }
  }
  /* çatı donanımı */
  const ry = b.top;
  if (b.type !== 'house') {
    const n = 3 + Math.floor(rnd() * 4), ac = C.inst(boxG, acMat, n);
    for (let i = 0; i < n; i++) C.setM(ac, i, lot.cx + (rnd() - 0.5) * (tt.w - 3), ry + 0.45, lot.cz + (rnd() - 0.5) * (tt.d - 3), rnd() * 3, 1.5, 0.9, 1.0);
    ac.instanceMatrix.needsUpdate = true; ac.castShadow = true; g.add(ac);
    if (b.type !== 'tower') {
      const tank = new THREE.Mesh(cylG, tankMat); tank.scale.set(1.1, 1.7, 1.1);
      tank.position.set(lot.cx + (rnd() - 0.5) * (tt.w - 4), ry + 0.85, lot.cz + (rnd() - 0.5) * (tt.d - 4)); tank.castShadow = true; g.add(tank);
    } else {
      const mast = new THREE.Mesh(cylG, mastMat); mast.scale.set(0.12, 10, 0.12);
      mast.position.set(lot.cx, ry + 5, lot.cz); g.add(mast);
      const led = new THREE.Mesh(sphG, C.blinkMat); led.scale.set(0.35, 0.35, 0.35); led.position.set(lot.cx, ry + 10.2, lot.cz); g.add(led);
    }
  } else {
    const ch = new THREE.Mesh(boxG, std('#7b6a5c')); ch.scale.set(0.7, 1.8, 0.7);
    ch.position.set(lot.cx + bt.w * 0.18, b.top - 1.0, lot.cz); ch.castShadow = true; g.add(ch);
  }
  /* balkonlar */
  if (b.type === 'mid' || b.type === 'low') {
    const pts = [];
    for (const f of faces) {
      if (!f.out) continue;
      const tx = -f.nz, tz = f.nx, n = Math.max(1, Math.floor(f.len / 7.2));
      for (let fi = 1; fi < b.baseTier.f; fi++) for (let k = 0; k < n; k++) {
        const off = (k - (n - 1) / 2) * 7.2;
        pts.push([f.cx + tx * off, C.SW + fi * C.FLOOR_H + 0.05, f.cz + tz * off, f.nx, f.nz, f.ry]);
      }
    }
    if (pts.length) {
      const sl = C.inst(boxG, slabMat, pts.length), rl = C.inst(boxG, railMat, pts.length);
      pts.forEach((p, i) => {
        C.setM(sl, i, p[0] + p[3] * 0.55, p[1], p[2] + p[4] * 0.55, p[5], 2.6, 0.14, 1.1);
        C.setM(rl, i, p[0] + p[3] * 1.05, p[1] + 0.5, p[2] + p[4] * 1.05, p[5], 2.6, 0.9, 0.06);
      });
      sl.instanceMatrix.needsUpdate = rl.instanceMatrix.needsUpdate = true; g.add(sl, rl);
    }
  }
  scene.add(g); b.detail = g;
};

/* ---------- park ve meydan ---------- */
const slabGeo = new THREE.BoxGeometry(C.BLOCK, C.SW, C.BLOCK);
const circG = new THREE.CircleGeometry(1, 28); circG.rotateX(-Math.PI / 2);
const waterMat = new THREE.MeshStandardMaterial({ color: C.col('#4f86a6'), roughness: 0.15, metalness: 0.2 });
const pathMat = std('#c8bfa8', 1), stoneMat = std('#a9a49a', 0.9);

C.makePark = function (blk, rnd) {
  const bx = blk.bx, bz = blk.bz;
  const slab = new THREE.Mesh(slabGeo, std('#5f8f4a', 1)); slab.position.set(bx, C.SW / 2, bz); slab.receiveShadow = true; scene.add(slab);
  const p1 = new THREE.Mesh(boxG, pathMat); p1.scale.set(40, 0.03, 3); p1.position.set(bx, C.SW + 0.015, bz); p1.receiveShadow = true;
  const p2 = new THREE.Mesh(boxG, pathMat); p2.scale.set(3, 0.03, 40); p2.position.set(bx, C.SW + 0.015, bz); p2.receiveShadow = true;
  const px = bx + (rnd() < 0.5 ? -9 : 9), pz = bz + (rnd() < 0.5 ? -9 : 9);
  const pond = new THREE.Mesh(circG, waterMat); pond.scale.set(6.5, 1, 5); pond.position.set(px, C.SW + 0.05, pz); pond.receiveShadow = true;
  scene.add(p1, p2, pond);
  let placed = 0, guard = 0;
  while (placed < 26 && guard++ < 300) {
    const x = bx + (rnd() - 0.5) * 38, z = bz + (rnd() - 0.5) * 38;
    if (Math.abs(x - bx) < 3.5 || Math.abs(z - bz) < 3.5) continue;
    if (((x - px) / 8.5) ** 2 + ((z - pz) / 7) ** 2 < 1) continue;
    C.treeSpots.push([x, z, 1.0 + rnd() * 0.7]); placed++;
  }
  for (const s of [-1, 1]) { C.benchSpots.push([bx + s * 9, bz + 2.4, 0]); C.benchSpots.push([bx + 2.4, bz + s * 9, Math.PI / 2]); }
};

/* saat kulesi: dört yüzünde simüle edilen saati gösterir */
const clockCv = document.createElement('canvas'); clockCv.width = clockCv.height = 512;
const clockTex = new THREE.CanvasTexture(clockCv); clockTex.encoding = THREE.sRGBEncoding; clockTex.anisotropy = C.maxAniso;
C.drawClock = function (hour) {
  const x = clockCv.getContext('2d'), c = 128; x.setTransform(2, 0, 0, 2, 0, 0);
  x.fillStyle = '#f3efe3'; x.fillRect(0, 0, 256, 256);
  x.lineWidth = 10; x.strokeStyle = '#2b2b2b'; x.beginPath(); x.arc(c, c, 118, 0, Math.PI * 2); x.stroke();
  x.fillStyle = '#2b2b2b'; x.font = '700 30px "IBM Plex Sans",Arial,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  for (let i = 1; i <= 12; i++) { const a = i / 12 * Math.PI * 2 - Math.PI / 2; x.fillText(String(i), c + Math.cos(a) * 92, c + Math.sin(a) * 92); }
  const hh = hour % 12, mm = (hour % 1) * 60;
  const hand = (ang, len, w) => { x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.moveTo(c, c); x.lineTo(c + Math.sin(ang) * len, c - Math.cos(ang) * len); x.stroke(); };
  hand(hh / 12 * Math.PI * 2, 56, 9); hand(mm / 60 * Math.PI * 2, 84, 6);
  x.fillStyle = '#b3402e'; x.beginPath(); x.arc(c, c, 8, 0, Math.PI * 2); x.fill();
  clockTex.needsUpdate = true;
};
C.drawClock(C.hour);
const clockMat = new THREE.MeshStandardMaterial({ map: clockTex, roughness: 0.5, emissive: 0xffffff, emissiveMap: clockTex, emissiveIntensity: 0 });
C.nightListeners.push(n => { clockMat.emissiveIntensity = n * 0.55; });

C.makePlaza = function (blk, rnd) {
  const grp = new THREE.Group(); scene.add(grp);
  const bx = blk.bx, bz = blk.bz;
  const slab = new THREE.Mesh(slabGeo, std('#cdc7b8', 0.95)); slab.position.set(bx, C.SW / 2, bz); slab.receiveShadow = true; grp.add(slab);
  const brick = std('#b9a283', 0.9), trim = std('#d8cfbb', 0.85), roofM = std('#3f4f5f', 0.8);
  const part = (mat, sx, sy, sz, y) => { const m = new THREE.Mesh(boxG, mat); m.scale.set(sx, sy, sz); m.position.set(bx, y, bz); m.castShadow = m.receiveShadow = true; grp.add(m); };
  part(trim, 8.4, 0.6, 8.4, C.SW + 0.3);
  part(brick, 6, 20, 6, C.SW + 10.6);
  part(trim, 8.2, 0.5, 8.2, C.SW + 21.0);
  part(brick, 7.6, 5.2, 7.6, C.SW + 23.9);
  part(trim, 8.2, 0.5, 8.2, C.SW + 26.7);
  const cg = new THREE.ConeGeometry(5.6, 7, 4); cg.rotateY(Math.PI / 4);
  const cone = new THREE.Mesh(cg, roofM); cone.position.set(bx, C.SW + 30.2, bz); cone.castShadow = true; grp.add(cone);
  [[0, 0, 1], [1, 0, 0], [0, Math.PI, -1], [-1, 0, 0]].forEach((_, i) => {
    const ry = [0, Math.PI / 2, Math.PI, -Math.PI / 2][i], nx = Math.sin(ry), nz = Math.cos(ry);
    const f = new THREE.Mesh(planeG, clockMat); f.scale.set(5, 5, 1); f.rotation.y = ry;
    f.position.set(bx + nx * 3.85, C.SW + 23.9, bz + nz * 3.85); grp.add(f);
  });
  const fx = bx - 11, fz = bz + 11;
  const rim = new THREE.Mesh(cylG, stoneMat); rim.scale.set(4.4, 0.5, 4.4); rim.position.set(fx, C.SW + 0.25, fz); rim.castShadow = true; rim.receiveShadow = true;
  const wat = new THREE.Mesh(circG, waterMat); wat.scale.set(3.8, 1, 3.8); wat.position.set(fx, C.SW + 0.48, fz);
  const jet = new THREE.Mesh(cylG, stoneMat); jet.scale.set(0.4, 1.4, 0.4); jet.position.set(fx, C.SW + 0.9, fz);
  grp.add(rim, wat, jet);
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2 + 0.4; C.treeSpots.push([bx + Math.cos(a) * 15, bz + Math.sin(a) * 15, 1.2 + rnd() * 0.4]); }
  for (const s of [-1, 1]) { C.benchSpots.push([bx + s * 8, bz - 8, 0]); C.benchSpots.push([bx + 8, bz + s * 4, Math.PI / 2]); }
  const pad = n => String(n).padStart(2, '0');
  C.finishLandmark(blk, grp, 'plaza', 'Saat Kulesi Meydanı', [['Kule', '≈ 34 m'], ['Saat', () => pad(Math.floor(C.hour)) + ':' + pad(Math.floor((C.hour % 1) * 60))], ['Şadırvan', '1'], ['Bank', '4']]);
};
})();
