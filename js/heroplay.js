/* ===== heroplay.js: Pijamalı Çocuk olarak oyna: koşu, yüksek zıplama, duvara tırmanma ve duvarda koşma, ağla sallanma, ağla çekilme, hırsızı ağla sarma ===== */
(function () {
'use strict';
if (!window.C || C.failed || !C.player || !C.hero) return;
const P = C.player, camera = C.camera, scene = C.scene, B = C.SW, $ = id => document.getElementById(id);
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const G = 24, R = 0.35, STEP = 0.6, JOG = 6.5, RUN = 15, CLIMB = 4.5, WALLRUN = 12, MAXV = 42, REACH = 150, WEB_THIEF = 30;

/* ---------- engeller: bina katları ve önemli yapı parçaları yerden çatıya kutu; ağaç ve lamba alçak ince engel ---------- */
const CELL = 24, grid = new Map(), boxes = [];
let sig = '', qid = 0;
const ck = (i, j) => i * 10007 + j;
function addBox(x0, z0, x1, z1, top, thin) {
  const b = { x0, z0, x1, z1, top, thin: !!thin, q: 0 };
  if (!thin) boxes.push(b);
  for (let i = Math.floor(x0 / CELL); i <= Math.floor(x1 / CELL); i++) for (let j = Math.floor(z0 / CELL); j <= Math.floor(z1 / CELL); j++) {
    const k = ck(i, j); let l = grid.get(k); if (!l) grid.set(k, l = []); l.push(b);
  }
}
const b3 = new THREE.Box3();
function build() {
  grid.clear(); boxes.length = 0;
  for (const b of C.buildings) {
    const l = b.lot, tiers = C.tiersOf(b); let y = B;
    tiers.forEach((t, k) => {
      y += t.f * C.FLOOR_H;
      const roof = b.type === 'house' && k === tiers.length - 1 ? 1.1 : 0;   // kiremit çatının ortası
      addBox(l.cx - t.w / 2, l.cz - t.d / 2, l.cx + t.w / 2, l.cz + t.d / 2, y + roof);
    });
  }
  for (const L of C.landmarks) L.group.traverse(o => {
    if (!o.isMesh) return;
    b3.setFromObject(o); const sx = b3.max.x - b3.min.x, sz = b3.max.z - b3.min.z;
    if (b3.max.y - b3.min.y < 0.8 || b3.min.y > 1.5 || sx > 70 || sz > 70) return;   // zemin, havadaki parçalar ve saha engel değil
    addBox(b3.min.x, b3.min.z, b3.max.x, b3.max.z, b3.max.y);
  });
  for (const t of C.treeSpots) { const r = 0.3 * t[2]; addBox(t[0] - r, t[1] - r, t[0] + r, t[1] + r, 3, true); }
  for (const l of C.lampSpots) addBox(l[0] - 0.14, l[1] - 0.14, l[0] + 0.14, l[1] + 0.14, 3, true);
  for (const b of C.benchSpots) { const al = Math.abs(Math.cos(b[2])) > 0.5, hw = al ? 0.92 : 0.3, hd = al ? 0.3 : 0.92; addBox(b[0] - hw, b[1] - hd, b[0] + hw, b[1] + hd, B + 0.5); }   // bank: üstüne basılır
  sig = C.buildings.length + ':' + (C.bver || 0);
}
function each(x, z, fn) {
  qid++;
  const ci = Math.floor(x / CELL), cj = Math.floor(z / CELL);
  for (let i = ci - 1; i <= ci + 1; i++) for (let j = cj - 1; j <= cj + 1; j++) {
    const l = grid.get(ck(i, j)); if (!l) continue;
    for (const b of l) { if (b.q === qid) continue; b.q = qid; fn(b); }
  }
}
/* ayağın altındaki en yüksek yüzey (y + basamak yüksekliğine kadar) */
function support(x, z, y) {
  let h = P.groundAt(x, z);
  each(x, z, b => {
    if (b.thin || b.top > y + STEP || b.top <= h) return;
    if (x >= b.x0 - 0.12 && x <= b.x1 + 0.12 && z >= b.z0 - 0.12 && z <= b.z1 + 0.12) h = b.top;
  });
  return h;
}
/* yatay çarpışma: daire (R) ile kutular; dokunulan duvarın eksene oturtulmuş normali */
const hit = { b: null, nx: 0, nz: 0 };
function collide(p, y) {
  hit.b = null;
  for (let it = 0; it < 2; it++) each(p.x, p.z, b => {
    if (b.top <= y + STEP) return;
    const qx = C.clamp(p.x, b.x0, b.x1), qz = C.clamp(p.z, b.z0, b.z1);
    let dx = p.x - qx, dz = p.z - qz; const d = Math.hypot(dx, dz);
    if (d >= R) return;
    if (d > 1e-6) { p.x = qx + dx / d * R; p.z = qz + dz / d * R; }
    else {                                                              // içine girmiş: en yakın yüzden dışarı
      const ex = Math.min(p.x - b.x0, b.x1 - p.x), ez = Math.min(p.z - b.z0, b.z1 - p.z);
      if (ex < ez) { dx = p.x - b.x0 < b.x1 - p.x ? -1 : 1; dz = 0; p.x = dx < 0 ? b.x0 - R : b.x1 + R; }
      else { dz = p.z - b.z0 < b.z1 - p.z ? -1 : 1; dx = 0; p.z = dz < 0 ? b.z0 - R : b.z1 + R; }
    }
    if (b.thin) return;
    if (Math.abs(dx) >= Math.abs(dz)) { hit.nx = Math.sign(dx); hit.nz = 0; } else { hit.nx = 0; hit.nz = Math.sign(dz); }
    hit.b = b;
  });
  if (y < 1.6 && C.carPush) { const car = C.carPush(p, R); if (car && !car.parked && car.v > 2) { car.v = 0; if (car.v0 > 0) msg('Arabayı tek elle durdurdu!'); } }   // Pijamalı Çocuğa çarpan araç durur
  const lim = C.TOTAL / 2 - 0.4; p.x = C.clamp(p.x, -lim, lim); p.z = C.clamp(p.z, -lim, lim);   // görünmez duvar
  return hit.b ? hit : null;
}
/* ışın ve kutular (yerden çatıya) + yer düzlemi: ilk çarpılan yer ve yüzey normali */
const ray = { t: 0, b: null, ax: -1, sg: 0 }, lo = [0, 0, 0], hi = [0, 0, 0], oo = [0, 0, 0], dd = [0, 0, 0];
function rayCast(o, d, far) {
  ray.t = far; ray.b = null; ray.ax = -1;
  oo[0] = o.x; oo[1] = o.y; oo[2] = o.z; dd[0] = d.x; dd[1] = d.y; dd[2] = d.z;
  for (const b of boxes) {
    lo[0] = b.x0; lo[1] = 0; lo[2] = b.z0; hi[0] = b.x1; hi[1] = b.top; hi[2] = b.z1;
    let tn = 0, tf = ray.t, ax = -1, sg = 0, miss = false;
    for (let a = 0; a < 3; a++) {
      if (Math.abs(dd[a]) < 1e-9) { if (oo[a] < lo[a] || oo[a] > hi[a]) { miss = true; break; } continue; }
      let ta = (lo[a] - oo[a]) / dd[a], tb = (hi[a] - oo[a]) / dd[a], s = -1;
      if (ta > tb) { const q = ta; ta = tb; tb = q; s = 1; }
      if (ta > tn) { tn = ta; ax = a; sg = s; }
      if (tb < tf) tf = tb;
      if (tn > tf) { miss = true; break; }
    }
    if (!miss && ax >= 0 && tn < ray.t) { ray.t = tn; ray.b = b; ray.ax = ax; ray.sg = sg; }
  }
  if (d.y < -1e-6) { const t = -o.y / d.y; if (t < ray.t) { ray.t = t; ray.b = 'ground'; ray.ax = 1; ray.sg = 1; } }
  return ray.b ? ray : null;
}
/* ağla çekilme hedefi: çatıya (kenara yakınsa kenardan içeri), duvara ya da yere */
function targetOf(r, o, d, out) {
  out.x = o.x + d.x * r.t; out.y = o.y + d.y * r.t; out.z = o.z + d.z * r.t; out.b = null; out.nx = out.nz = 0;
  if (r.b === 'ground') { out.kind = 'ground'; out.y = P.groundAt(out.x, out.z); return out; }
  const b = r.b; out.b = b;
  if (r.ax === 1) { out.kind = 'roof'; out.y = b.top; return out; }
  const nx = r.ax === 0 ? r.sg : 0, nz = r.ax === 2 ? r.sg : 0;
  if (b.top - out.y < 5) { out.kind = 'roof'; out.x -= nx * 0.8; out.z -= nz * 0.8; out.y = b.top; }   // kenara çekil, üstüne kon
  else { out.kind = 'wall'; out.x += nx * R; out.z += nz * R; out.nx = nx; out.nz = nz; }
  return out;
}

/* ---------- durum ---------- */
const H = {
  st: 'ground', v: V(0, 0, 0), A: V(0, 0, 0), L: 0, Lmax: 0, wall: null, wallrun: false, press: 0, charge: -1, landT: 0,
  spinT: -1, noB: null, noT: 0, zip: null, webHeld: false, webT: 0, webEv: null, idle: 0, ph: 0, face: 0, msgT: 0, retry: 0
};
let baseFov = 50;
const tgt = { kind: '', x: 0, y: 0, z: 0, b: null, nx: 0, nz: 0 }, aimOk = { v: false };
const head = V(0, 0, 0), cdir = V(0, 0, 0), co = V(0, 0, 0), tmp = V(0, 0, 0), tmp2 = V(0, 0, 0);

function msg(text) { const el = $('heroMsg'); el.textContent = text; el.hidden = false; H.msgT = 2.2; }
function setFace(x, z) { if (Math.hypot(x, z) > 1e-4) H.face = Math.atan2(-z, x); }
function flip() { H.spinT = 0; }

function toWall(c, run) {
  H.st = 'wall'; H.wall = { b: c.b, ax: c.nx ? 'x' : 'z', s: c.nx || c.nz }; H.wallrun = !!run;
  H.v.set(0, 0, 0); H.press = 0; H.spinT = -1; H.charge = -1;
}
function land(vy, y) {
  P.pos.y = y; H.v.y = 0; H.spinT = -1;
  if (vy < -20) { H.st = 'land'; H.landT = 0.45; H.v.x *= 0.15; H.v.z *= 0.15; } else H.st = 'ground';
}
/* duvarın ya da çıkıntının üstüne geç: çatıya doğru küçük bir sıçrayış */
function vault(b, nx, nz, big) {
  P.pos.y = b.top + 0.02; P.pos.x -= nx * (R + 0.55); P.pos.z -= nz * (R + 0.55);
  H.st = 'air'; H.v.set(-nx * 3.5, big ? 7 : 4.5, -nz * 3.5); H.wall = null;
  if (big) flip();
}
function release(boost) {
  if (H.st !== 'swing') return;
  H.st = 'air';
  if (boost) {
    const fx = Math.cos(P.yaw), fz = -Math.sin(P.yaw);
    H.v.y += 4.5; H.v.x += fx * 2; H.v.z += fz * 2;
    if (H.v.y > 2 && Math.hypot(H.v.x, H.v.z) > 11) flip();
  }
}

/* sallanma için ağ noktası: ileride (hızla daha ileride), yukarıda bir çatı kenarı */
function findAnchor() {
  const p = P.pos, sp = Math.hypot(H.v.x, H.v.z);
  let fx = Math.cos(P.yaw), fz = -Math.sin(P.yaw);
  if (sp > 5) { fx = fx * 0.5 + H.v.x / sp * 0.5; fz = fz * 0.5 + H.v.z / sp * 0.5; const l = Math.hypot(fx, fz) || 1; fx /= l; fz /= l; }
  const ahead = 16 + sp * 0.7, qx = p.x + fx * ahead, qz = p.z + fz * ahead;
  let best = null, bs = 1e9;
  for (const b of boxes) {
    if (b.top < p.y + 5) continue;
    let cx = C.clamp(qx, b.x0, b.x1), cz = C.clamp(qz, b.z0, b.z1);
    if (cx > b.x0 && cx < b.x1 && cz > b.z0 && cz < b.z1) {           // çatının ortası değil, kahramana bakan kenarı
      const e = [[p.x < b.x0, cx - b.x0, 0], [p.x > b.x1, b.x1 - cx, 1], [p.z < b.z0, cz - b.z0, 2], [p.z > b.z1, b.z1 - cz, 3]].filter(q => q[0]).sort((a, c) => a[1] - c[1])[0];
      if (e) { if (e[2] === 0) cx = b.x0; else if (e[2] === 1) cx = b.x1; else if (e[2] === 2) cz = b.z0; else cz = b.z1; }
    }
    const dx = cx - p.x, dz = cz - p.z, hd = Math.hypot(dx, dz);
    if (hd > 85 || dx * fx + dz * fz < 2) continue;
    const h = b.top - p.y, L = Math.hypot(hd, h);
    if (L < 8 || L > 90) continue;
    const inQ = qx > b.x0 && qx < b.x1 && qz > b.z0 && qz < b.z1;      // önündeki binaya tutunursa duvarına çarpar: yoldaki kenarlar öne
    const s = Math.hypot(cx - qx, cz - qz) + Math.abs(L - 32) * 0.25 - Math.min(h, 40) * 0.15 + (inQ ? 14 : 0);
    if (s < bs) { bs = s; best = { x: cx, y: b.top, z: cz }; }
  }
  return best;
}
function attach(quiet) {
  if (H.st === 'land' || H.st === 'zip') return false;
  const a = findAnchor(), Lmax = a ? Math.max(9, (a.y - B) * 0.62) : 0;   // yayın dibi yerden yüksekte kalsın (ip kısalıp yukarı çeker)
  if (!a || Lmax < 6) { if (!quiet) msg('Ağı tutturacak yüksek bir yer yok'); return false; }
  if (H.st === 'ground') { H.v.y = 7; P.pos.y += 0.05; }
  if (H.st === 'wall') { const w = H.wall; H.v.set((w.ax === 'x' ? w.s : 0) * 4, 4, (w.ax === 'z' ? w.s : 0) * 4); H.wall = null; }
  H.A.set(a.x, a.y, a.z); H.L = P.pos.distanceTo(H.A); H.Lmax = Math.min(H.L, Lmax);
  if (Math.hypot(H.v.x, H.v.z) < 12) { const fx = Math.cos(P.yaw), fz = -Math.sin(P.yaw); H.v.x += fx * 6; H.v.z += fz * 6; }
  H.st = 'swing'; H.charge = -1; H.spinT = -1;
  return true;
}
/* nişangâhın gösterdiği yer (kahramanın önünden başlayan ışın) */
function aim() {
  camera.getWorldDirection(cdir);
  head.set(P.pos.x, P.pos.y + 1.2, P.pos.z);
  co.copy(camera.position).addScaledVector(cdir, Math.max(0, camera.position.distanceTo(head) - 0.5));
  const r = rayCast(co, cdir, REACH);
  aimOk.v = false;
  if (!r) return null;
  targetOf(r, co, cdir, tgt);
  if (Math.hypot(tgt.x - P.pos.x, tgt.y - P.pos.y, tgt.z - P.pos.z) < 2.5) return null;
  aimOk.v = true; return tgt;
}
function startZip() {
  if (H.st === 'land' || H.st === 'zip') return;
  let t = aim();
  if (H.st === 'wall' && (!t || t.b === H.wall.b) && cdir.y > -0.2) {     // tutunduğu duvara bakıyor: duvarın tepesine çekil
    const w = H.wall, nx = w.ax === 'x' ? w.s : 0, nz = w.ax === 'z' ? w.s : 0;
    t = tgt; Object.assign(t, { kind: 'roof', x: P.pos.x - nx * (R + 0.8), y: w.b.top, z: P.pos.z - nz * (R + 0.8), b: w.b, nx: 0, nz: 0 });
  } else {
    if (!t) { msg('Menzilde tutunacak yer yok'); return; }
    /* yol üstünde başka bir yapı varsa ona çekil */
    head.set(P.pos.x, P.pos.y + 1, P.pos.z); tmp.set(t.x - head.x, t.y - head.y, t.z - head.z);
    const L = tmp.length(); tmp.divideScalar(L);
    const r = rayCast(head, tmp, L - 0.8);
    if (r && r.b !== 'ground') targetOf(r, head, tmp, t);
  }
  const to = V(t.x, t.y, t.z), from = P.pos.clone(), d = from.distanceTo(to);
  H.zip = { from, to, t: 0, dur: 0.18 + d / 38, kind: t.kind, b: t.b, nx: t.nx, nz: t.nz };
  if (H.st === 'swing') H.st = 'air';
  H.st = 'zip'; H.wall = null; H.charge = -1; H.spinT = -1;
}

/* ---------- adım: duruma göre fizik ---------- */
function stepGround(dt, inp) {
  const top = inp.run ? RUN : JOG;
  let tx = inp.wx * top, tz = inp.wz * top;
  if (H.charge >= 0) { tx *= 0.15; tz *= 0.15; }                        // yüksek zıplamaya çömelirken
  const k = Math.min(1, dt * (inp.wl ? 7 : 10));
  H.v.x += (tx - H.v.x) * k; H.v.z += (tz - H.v.z) * k; H.v.y = 0;
  const q = { x: P.pos.x + H.v.x * dt, z: P.pos.z + H.v.z * dt }, c = collide(q, P.pos.y);
  if (c) {
    const into = -(inp.wx * c.nx + inp.wz * c.nz), b = c.b, hsp = Math.hypot(H.v.x, H.v.z);
    if (into > 0.5 && b.top - P.pos.y < 1.6 && H.charge < 0) { P.pos.x = q.x; P.pos.z = q.z; vault(b, c.nx, c.nz, false); return; }   // alçak çıkıntıya atla
    if (into > 0.5 && H.charge < 0) {
      H.press += dt;
      if (H.press > 0.12 || (inp.run && hsp > 8)) { P.pos.x = q.x; P.pos.z = q.z; toWall(c, inp.run); return; }
    } else H.press = 0;
    const vn = H.v.x * c.nx + H.v.z * c.nz; if (vn < 0) { H.v.x -= vn * c.nx; H.v.z -= vn * c.nz; }
  } else H.press = 0;
  P.pos.x = q.x; P.pos.z = q.z;
  const s = support(P.pos.x, P.pos.z, P.pos.y);
  if (s < P.pos.y - 0.8) { H.st = 'air'; H.v.y = 0; H.charge = -1; }   // çatı kenarından boşluğa
  else P.pos.y += (s - P.pos.y) * Math.min(1, dt * 16);
}
function stepAir(dt, inp) {
  H.v.y -= G * dt;
  if (inp.wl) {
    const hs = Math.hypot(H.v.x, H.v.z), ctl = Math.max(hs, inp.run ? 10 : 6), k = Math.min(1, dt * 1.6);
    H.v.x += (inp.wx * ctl - H.v.x) * k; H.v.z += (inp.wz * ctl - H.v.z) * k;
  }
  const q = { x: P.pos.x + H.v.x * dt, z: P.pos.z + H.v.z * dt }, c = collide(q, P.pos.y);
  if (c) {
    const b = c.b;
    if (b.top - P.pos.y < 1.6) { P.pos.x = q.x; P.pos.z = q.z; vault(b, c.nx, c.nz, false); return; }   // kenarı yakaladı
    if (inp.f >= 0 && !(H.noB === b && H.noT > 0)) { P.pos.x = q.x; P.pos.z = q.z; toWall(c, inp.run && H.v.y > -2); return; }
    const vn = H.v.x * c.nx + H.v.z * c.nz; if (vn < 0) { H.v.x -= vn * c.nx; H.v.z -= vn * c.nz; }
  }
  P.pos.x = q.x; P.pos.z = q.z;
  const s = support(P.pos.x, P.pos.z, P.pos.y), ny = P.pos.y + H.v.y * dt;
  if (ny <= s && H.v.y <= 0) land(H.v.y, s); else P.pos.y = ny;
}
function stepWall(dt, inp) {
  const w = H.wall, b = w.b;
  const rx = Math.sin(P.yaw), rz = Math.cos(P.yaw);                      // kameranın sağı
  let vy = 0, vl = 0;
  H.wallrun = inp.run && inp.f > 0;
  if (H.wallrun) vy = WALLRUN;
  else { vy = inp.f > 0 ? CLIMB : inp.f < 0 ? -6 : 0; vl = inp.s * CLIMB; }
  P.pos.y += vy * dt;
  if (w.ax === 'x') {
    P.pos.z += vl * (rz >= 0 ? 1 : -1) * dt;
    if (P.pos.z > b.z1) { w.ax = 'z'; const s0 = w.s; w.s = 1; P.pos.x = s0 > 0 ? b.x1 - 0.2 : b.x0 + 0.2; }   // köşeden yan yüze dön
    else if (P.pos.z < b.z0) { w.ax = 'z'; const s0 = w.s; w.s = -1; P.pos.x = s0 > 0 ? b.x1 - 0.2 : b.x0 + 0.2; }
  } else {
    P.pos.x += vl * (rx >= 0 ? 1 : -1) * dt;
    if (P.pos.x > b.x1) { w.ax = 'x'; const s0 = w.s; w.s = 1; P.pos.z = s0 > 0 ? b.z1 - 0.2 : b.z0 + 0.2; }
    else if (P.pos.x < b.x0) { w.ax = 'x'; const s0 = w.s; w.s = -1; P.pos.z = s0 > 0 ? b.z1 - 0.2 : b.z0 + 0.2; }
  }
  if (w.ax === 'x') P.pos.x = (w.s > 0 ? b.x1 : b.x0) + w.s * R; else P.pos.z = (w.s > 0 ? b.z1 : b.z0) + w.s * R;
  const lim = C.TOTAL / 2 - 0.4;
  if (Math.abs(P.pos.x) > lim || Math.abs(P.pos.z) > lim) { H.st = 'air'; H.wall = null; collide(P.pos, P.pos.y); return; }
  const mx = w.ax === 'x' ? w.s : 0, mz = w.ax === 'z' ? w.s : 0;
  if (P.pos.y >= b.top - 0.05) { if (vy > 0) { vault(b, mx, mz, H.wallrun); return; } P.pos.y = b.top - 0.05; }
  const g = support(P.pos.x, P.pos.z, P.pos.y);
  if (P.pos.y <= g) { P.pos.y = g; if (inp.f < 0) { H.st = 'ground'; H.wall = null; H.noB = b; H.noT = 0.5; return; } }
  H.ph += (Math.abs(vy) + Math.abs(vl)) * dt * (H.wallrun ? 0.9 : 2.2);
}
function stepSwing(dt, inp) {
  H.v.y -= G * dt;
  if (H.L > H.Lmax) H.L = Math.max(H.Lmax, H.L - dt * 16);                // ip kısalır: yukarı çeker
  tmp.subVectors(P.pos, H.A); const dl = tmp.length() || 1; tmp.divideScalar(dl);
  if (inp.wl) {                                                           // ileri bas: salınımı büyüt; yanlara dümen
    tmp2.set(inp.wx, 0, inp.wz); tmp2.addScaledVector(tmp, -tmp2.dot(tmp));
    H.v.addScaledVector(tmp2, 15 * dt);
  }
  const sp = H.v.length(); if (sp > MAXV) H.v.multiplyScalar(MAXV / sp);
  P.pos.addScaledVector(H.v, dt);
  tmp.subVectors(P.pos, H.A); const d2 = tmp.length();
  if (d2 > H.L) { tmp.divideScalar(d2); P.pos.copy(H.A).addScaledVector(tmp, H.L); const vr = H.v.dot(tmp); if (vr > 0) H.v.addScaledVector(tmp, -vr); }
  const q = { x: P.pos.x, z: P.pos.z }, c = collide(q, P.pos.y);
  if (c) {
    P.pos.x = q.x; P.pos.z = q.z; H.st = 'air';
    if (c.b.top - P.pos.y < 1.6) vault(c.b, c.nx, c.nz, false); else toWall(c, false);
    return;
  }
  const s = support(P.pos.x, P.pos.z, P.pos.y);
  if (P.pos.y < s) { P.pos.y = s; if (H.v.y < 0) H.v.y = 0; }
  if (P.pos.y > H.A.y - 1) release(false);                                // ağın üstüne çıktı: bırak
}
function stepZip(dt) {
  const z = H.zip; z.t += dt;
  const u = Math.min(1, z.t / z.dur), e = u * u * (3 - 2 * u), d = z.from.distanceTo(z.to);
  P.pos.lerpVectors(z.from, z.to, e); P.pos.y += Math.sin(Math.PI * e) * Math.min(2, d * 0.04);
  if (u < 1) return;
  const dx = z.to.x - z.from.x, dz = z.to.z - z.from.z, hl = Math.hypot(dx, dz) || 1;
  H.zip = null;
  if (z.kind === 'wall') { toWall({ b: z.b, nx: z.nx, nz: z.nz }, false); return; }
  if (z.kind === 'roof') { H.st = 'air'; H.v.set(dx / hl * 4, 5.5, dz / hl * 4); if (d > 25) flip(); return; }   // çatıya fırlayıp kon
  land(-6, P.groundAt(P.pos.x, P.pos.z));
}

/* ---------- hırsız: görev göstergesi, ışık sütunu, ağla sarma ---------- */
const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 70, 16, 1, true).translate(0, 35, 0),
  new THREE.MeshBasicMaterial({ color: C.col('#2f7bff'), transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide }));
beam.visible = false; beam.renderOrder = 5; scene.add(beam);
function thief() {
  const ev = C.hero.task;
  if (!ev) return null;
  if (ev.done || !ev.th || ev.th.caught) { if (H.webEv !== ev) C.hero.task = null; return null; }
  return ev;
}
function taskHud(t) {
  const ev = thief(), el = $('heroTask');
  beam.visible = !!ev && P.active;
  if (!ev || !P.active) { el.hidden = true; return; }
  const p = ev.th.g.position, dx = p.x - P.pos.x, dz = p.z - P.pos.z, d = Math.hypot(dx, dz, p.y - P.pos.y);
  beam.position.set(p.x, p.y, p.z); beam.material.opacity = 0.22 + 0.12 * Math.sin(t * 5);
  const rel = Math.atan2(-dz, dx) - P.yaw;
  el.hidden = false;
  el.firstChild.style.transform = `rotate(${(-rel).toFixed(3)}rad)`;
  const txt = `Hırsızlık · ${ev.place} · ${Math.round(d)} m`;
  if (el.lastChild.textContent !== txt) el.lastChild.textContent = txt;
}
const thiefChest = V(0, 0, 0);

/* ---------- çizim ---------- */
const bx = V(0, 0, 0), by = V(0, 0, 0), bz = V(0, 0, 0), bm = new THREE.Matrix4(), bq = new THREE.Quaternion();
function basis(x, y) {
  by.copy(y).normalize(); bx.copy(x).addScaledVector(by, -bx.dot(by));
  if (bx.lengthSq() < 1e-6) { bx.set(Math.cos(H.face), 0, -Math.sin(H.face)).addScaledVector(by, -bx.dot(by)); }
  bx.normalize(); bz.crossVectors(bx, by); bm.makeBasis(bx, by, bz); return bq.setFromRotationMatrix(bm);
}
const UPV = V(0, 1, 0), drv = { pos: V(0, 0, 0), ry: 0, quat: null, pose: 'stand', t: 0, ph: 0, spin: 0, anchor: null };
function render(dt, t) {
  const hs = Math.hypot(H.v.x, H.v.z);
  drv.pos.copy(P.pos); drv.quat = null; drv.anchor = null; drv.spin = 0; drv.t = t; drv.ph = H.ph;
  if (H.st === 'ground') {
    if (hs > 0.4) { setFace(H.v.x, H.v.z); H.idle = 0; } else H.idle += dt;
    if (H.charge > 0.1) drv.pose = 'crouch';
    else if (hs > 7.5) { H.ph += hs * dt * 0.85; drv.pose = 'run'; }
    else if (hs > 0.4) { H.ph += hs * dt * 2.2; drv.pose = 'walk'; }
    else drv.pose = H.idle > 1.5 && P.pos.y > 2 ? 'crouch' : 'stand';    // çatıda bekleyince çömelir
  } else if (H.st === 'air') {
    if (hs > 1) setFace(H.v.x, H.v.z);
    drv.pose = H.spinT >= 0 || H.v.y > 0 ? 'jump' : 'fall';
  } else if (H.st === 'land') drv.pose = 'land';
  else if (H.st === 'wall') {
    const w = H.wall, nx = w.ax === 'x' ? w.s : 0, nz = w.ax === 'z' ? w.s : 0;
    H.face = Math.atan2(nz, -nx);
    if (H.wallrun) { drv.pose = 'run'; tmp.set(nx, 0, nz); drv.quat = basis(UPV, tmp); drv.ph = H.ph * 3; }   // duvarda dik koşu: gövde duvardan dışa
    else { drv.pose = 'climb'; drv.pos.x -= nx * 0.06; drv.pos.z -= nz * 0.06; }
  } else if (H.st === 'swing') {
    tmp.subVectors(H.A, P.pos); setFace(H.v.x, H.v.z);
    drv.quat = basis(H.v.lengthSq() > 1 ? H.v : tmp2.set(Math.cos(H.face), 0, -Math.sin(H.face)), tmp);
    drv.pose = 'swing'; drv.anchor = H.A;
  } else if (H.st === 'zip') {
    const z = H.zip; tmp.subVectors(z.to, z.from); setFace(tmp.x, tmp.z);
    drv.quat = basis(tmp, UPV); drv.pose = 'zip';
    if (z.t / z.dur < 0.85) drv.anchor = z.to;
  }
  if (H.webT > 0 && H.webEv) {                                             // hırsıza ağ
    const p = H.webEv.th.g.position; thiefChest.set(p.x, p.y + 1.1, p.z);
    if (!drv.quat) { H.face = Math.atan2(-(p.z - P.pos.z), p.x - P.pos.x); }
    drv.anchor = thiefChest; if (drv.pose === 'crouch') drv.pose = 'stand';
  }
  if (H.spinT >= 0) {
    H.spinT += dt; const u = Math.min(1, H.spinT / 0.62);
    drv.spin = Math.PI * 2 * u * u * (3 - 2 * u);
    if (u >= 1) H.spinT = -1;
  }
  drv.ry = H.face;
  C.hero.drive(drv);
}

/* ---------- kamera: hızla biraz uzaklaşır ve görüş açısı genişler; fare durunca gidiş yönüne döner ---------- */
function cameraFx(dt) {
  const sp = H.v.length(), moving = H.st === 'swing' || H.st === 'air' || H.st === 'zip';
  const zsp = H.st === 'zip' ? H.zip.from.distanceTo(H.zip.to) / H.zip.dur : sp;
  P.distAdd += (C.clamp((zsp - 6) * 0.12, 0, 5) - P.distAdd) * Math.min(1, dt * 3);
  const fov = baseFov + C.clamp((zsp - 8) * 0.4, 0, 12);
  if (Math.abs(camera.fov - fov) > 0.05) { camera.fov += (fov - camera.fov) * Math.min(1, dt * 4); camera.updateProjectionMatrix(); }
  if (moving && sp > 10 && performance.now() - P.mouseT > 900) {
    let d = Math.atan2(-H.v.z, H.v.x) - P.yaw; d = Math.atan2(Math.sin(d), Math.cos(d));
    P.yaw += d * Math.min(1, dt * 1.3);
  }
}

C.heroPlay = {
  start() {
    if (sig !== C.buildings.length + ':' + (C.bver || 0)) build();
    P.pos.copy(C.hero.takeover(true));
    P.pos.y = support(P.pos.x, P.pos.z, P.pos.y + 0.1);
    Object.assign(H, { st: 'ground', A: H.A, L: 0, wall: null, press: 0, charge: -1, landT: 0, spinT: -1, noB: null, noT: 0, zip: null, webHeld: false, webT: 0, webEv: null, idle: 2, ph: 0 });
    H.v.set(0, 0, 0);
    camera.getWorldDirection(cdir); P.yaw = H.face = Math.atan2(-cdir.z, cdir.x);
    P.pitch = 0.3; P.dist = 6.5; P.distAdd = 0; baseFov = camera.fov;
    render(0, 0);
  },
  stop() {
    C.hero.takeover(false);
    camera.fov = baseFov; camera.updateProjectionMatrix(); P.distAdd = 0;
    beam.visible = false; $('heroTask').hidden = true; $('heroMsg').hidden = true; $('xhair').classList.remove('on');
  },
  update(dt, t) {
    if (sig !== C.buildings.length + ':' + (C.bver || 0)) build();
    const inp = P.input();
    if (H.noT > 0) H.noT -= dt;
    if (H.charge >= 0) H.charge += dt;
    if (H.st === 'land') { H.landT -= dt; if (H.landT <= 0) H.st = 'ground'; }
    if (H.st === 'zip') stepZip(dt);
    else if (H.st !== 'land') {
      const n = Math.min(8, Math.max(1, Math.ceil(H.v.length() * dt / 0.4)));   // hızlıyken alt adımlar: duvarı delmesin
      for (let k = 0; k < n; k++) {
        if (H.st === 'ground') stepGround(dt / n, inp);
        else if (H.st === 'air') stepAir(dt / n, inp);
        else if (H.st === 'wall') stepWall(dt / n, inp);
        else if (H.st === 'swing') stepSwing(dt / n, inp);
        else break;
      }
    }
    if (H.webHeld && H.st === 'air' && H.v.y < -5 && (H.retry -= dt) <= 0) { H.retry = 0.25; attach(true); }   // basılı tutarken düşüşte yeniden ağ at
    if (H.webT > 0) {
      H.webT -= dt;
      if (H.webT <= 0 && H.webEv) { const ev = H.webEv; H.webEv = null; ev.heroCatch(); if (C.hero.task === ev) C.hero.task = null; msg('Şüpheli ağa sarıldı 🕸'); }
    }
    if (H.msgT > 0 && (H.msgT -= dt) <= 0) $('heroMsg').hidden = true;
    render(dt, t); cameraFx(dt); taskHud(t);
    aim(); const xh = $('xhair'); if (xh.classList.contains('on') !== aimOk.v) xh.classList.toggle('on', aimOk.v);
  },
  jump(down) {
    if (down) {
      if (H.st === 'ground') H.charge = 0;
      else if (H.st === 'wall') {                                          // duvardan geriye sıçra
        const w = H.wall, nx = w.ax === 'x' ? w.s : 0, nz = w.ax === 'z' ? w.s : 0;
        H.st = 'air'; H.v.set(nx * 8, 9, nz * 8); H.noB = w.b; H.noT = 0.4; H.wall = null; setFace(nx, nz);
      } else if (H.st === 'swing') release(true);
      return;
    }
    if (H.st === 'ground' && H.charge >= 0) {
      const k = Math.min(1, H.charge / 0.55);
      H.st = 'air'; H.v.y = 9 + 8 * k; H.charge = -1;
      if (k > 0.9) flip();
    }
    H.charge = -1;
  },
  web(down) {
    H.webHeld = down;
    if (down) { if (H.st !== 'swing') attach(); }
    else release(true);
  },
  zip: startZip,
  onFoot: () => H.st === 'ground',
  thiefNear() {
    const ev = thief(); if (!ev || H.webT > 0) return false;
    const p = ev.th.g.position; return Math.hypot(p.x - P.pos.x, p.y - P.pos.y, p.z - P.pos.z) < WEB_THIEF;
  },
  webThief() {
    const ev = thief(); if (!ev) return;
    H.webEv = ev; H.webT = 0.45; ev.th.sp = 0;                             // şüpheli donakalır
  },
  state: () => H.st
};
})();
