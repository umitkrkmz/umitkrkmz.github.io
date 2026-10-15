/* ===== hero.js: çatılarda dolaşan, hırsızlık olunca ağ atarak gelen Pijamalı Çocuk ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene, B = C.SW;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const pick = a => a[(Math.random() * a.length) | 0];
const boxG = new THREE.BoxGeometry(1, 1, 1);

/* ---------- kostüm dokuları: kırmızı üstünde siyah ağ, göğüste örümcek, kaskta beyaz gözler ---------- */
const RED = '#c8102e', BLUE = '#1f3f9a';
function tex(draw) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128; draw(cv.getContext('2d'));
  const t = new THREE.CanvasTexture(cv); t.encoding = THREE.sRGBEncoding; t.anisotropy = C.maxAniso; return t;
}
function web(x, cx, cy) {
  x.fillStyle = RED; x.fillRect(0, 0, 128, 128);
  x.strokeStyle = 'rgba(10,10,14,.6)'; x.lineWidth = 1.5;
  const n = 12, pt = (k, r) => [cx + Math.cos(k / n * Math.PI * 2) * r, cy + Math.sin(k / n * Math.PI * 2) * r];
  for (let k = 0; k < n; k++) { const [a, b] = pt(k, 200); x.beginPath(); x.moveTo(cx, cy); x.lineTo(a, b); x.stroke(); }
  for (let r = 13; r < 200; r += 13) {
    x.beginPath();
    for (let k = 0; k < n; k++) {
      const [a, b] = pt(k, r), [c, d] = pt(k + 1, r), [m1, m2] = pt(k + 0.5, r * 0.86);
      x.moveTo(a, b); x.quadraticCurveTo(m1, m2, c, d);
    }
    x.stroke();
  }
}
const webT = tex(x => web(x, 64, 40));
const faceT = tex(x => {
  web(x, 64, 56);
  for (const s of [-1, 1]) {
    x.save(); x.translate(64 + s * 25, 58); x.rotate(s * 0.5);
    x.beginPath(); x.ellipse(0, 0, 21, 13, 0, 0, Math.PI * 2);
    x.fillStyle = '#f7f7f2'; x.fill(); x.lineWidth = 5; x.strokeStyle = '#0b0b0e'; x.stroke(); x.restore();
  }
});
const chestT = tex(x => {
  web(x, 64, 30);
  x.fillStyle = '#0b0b0e'; x.strokeStyle = '#0b0b0e'; x.lineWidth = 3; x.lineCap = 'round';
  x.beginPath(); x.ellipse(64, 50, 6, 11, 0, 0, Math.PI * 2); x.fill();
  x.beginPath(); x.arc(64, 36, 5, 0, Math.PI * 2); x.fill();
  for (const s of [-1, 1]) for (const [y0, dx, dy] of [[42, 22, -16], [46, 26, -4], [52, 24, 10], [56, 18, 24]]) {
    x.beginPath(); x.moveTo(64, y0); x.lineTo(64 + s * dx * 0.6, y0 + dy * 0.4); x.lineTo(64 + s * dx, y0 + dy); x.stroke();
  }
});
const mat = t => new THREE.MeshStandardMaterial({ map: t, roughness: 0.55 });
const mWeb = mat(webT), mFace = mat(faceT), mChest = mat(chestT);
const mBlue = new THREE.MeshStandardMaterial({ color: C.col(BLUE), roughness: 0.55 });
const mRed = new THREE.MeshStandardMaterial({ color: C.col(RED), roughness: 0.55 });
/* kutu yüz sırası: +x (ön), -x, +y, -y, +z, -z */
const HEAD = [mFace, mWeb, mWeb, mWeb, mWeb, mWeb], TORSO = [mChest, mWeb, mRed, mBlue, mBlue, mBlue];

/* ---------- model: kalça grubu > gövde grubu > baş ve kollar; bacaklar kalçada ---------- */
function makeHero() {
  const root = new THREE.Group(), hip = new THREE.Group(), torso = new THREE.Group();
  root.add(hip); hip.add(torso);
  const box = (mats, sx, sy, sz, x, y, z, parent) => {
    const m = new THREE.Mesh(C.roundBox(sx, sy, sz, Math.min(sx, sy, sz) * 0.3), mats); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m;
  };
  box(TORSO, 0.24, 0.62, 0.42, 0, 0.31, 0, torso);
  box(HEAD, 0.27, 0.28, 0.25, 0.01, 0.79, 0, torso);
  const limb = (parent, y, z, segs) => {
    const p = new THREE.Group(); p.position.set(0, y, z); parent.add(p);
    let top = 0; for (const [m, w, h] of segs) { box(m, w, h, w, 0, top - h / 2, 0, p); top -= h; }
    return p;
  };
  const legs = [0.11, -0.11].map(z => limb(hip, 0, z, [[mBlue, 0.17, 0.5], [mWeb, 0.16, 0.42]]));
  const arms = [0.28, -0.28].map(z => limb(torso, 0.58, z, [[mWeb, 0.13, 0.36], [mRed, 0.12, 0.28]]));
  return { root, hip, torso, legs, arms };
}
const heroRoot = new THREE.Group(); scene.add(heroRoot); C.peopleLayers.push(heroRoot);
const M = makeHero(); heroRoot.add(M.root);

/* ağ ipi: ince silindir, iki nokta arasına gerilir */
const strandG = new THREE.CylinderGeometry(0.035, 0.035, 1, 6).translate(0, 0.5, 0);
const strandM = new THREE.MeshStandardMaterial({ color: 0xf2f2ee, roughness: 0.8, emissive: 0xffffff, emissiveIntensity: 0.15 });
const strand = new THREE.Mesh(strandG, strandM); strand.visible = false; heroRoot.add(strand);
const UP = V(0, 1, 0), DOWN = V(0, -1, 0), tv = V(0, 0, 0), sv = V(0, 0, 0), qv = new THREE.Quaternion();
function stretch(a, b) {
  tv.subVectors(b, a); const L = tv.length(); if (L < 0.01) return;
  strand.position.copy(a); strand.quaternion.setFromUnitVectors(UP, tv.divideScalar(L)); strand.scale.set(1, L, 1); strand.visible = true;
}
/* kolu dünyadaki bir noktaya doğrult, el konumunu döndür */
function aim(arm, target, hand) {
  arm.getWorldPosition(sv); tv.subVectors(target, sv).normalize();
  if (hand) hand.copy(sv).addScaledVector(tv, 0.66);
  arm.parent.getWorldQuaternion(qv); qv.invert(); tv.applyQuaternion(qv);
  arm.quaternion.setFromUnitVectors(DOWN, tv);
}
const armZ = (arm, z) => { arm.quaternion.identity(); arm.rotation.set(0, 0, z); };
function pose(name, t, ph) {
  const { hip, torso, legs, arms } = M;
  hip.rotation.set(0, 0, 0); torso.rotation.set(0, 0, 0);
  if (name === 'crouch') {
    hip.position.y = 0.52; torso.rotation.z = -0.55 + Math.sin(t * 1.3) * 0.04; torso.rotation.y = Math.sin(t * 0.7) * 0.35;
    legs[0].rotation.z = 1.3; legs[1].rotation.z = 1.05; armZ(arms[0], 0.75); armZ(arms[1], 0.35);
  } else if (name === 'jump') {
    hip.position.y = 0.92; torso.rotation.set(0, 0, -0.35);
    legs[0].rotation.z = 1.0; legs[1].rotation.z = 0.45; armZ(arms[0], 2.5); armZ(arms[1], 2.2);
  } else if (name === 'swing') {
    hip.position.y = 0.92; torso.rotation.set(0, 0, -0.25);
    legs[0].rotation.z = -0.3; legs[1].rotation.z = 0.15; armZ(arms[1], -0.5);
  } else if (name === 'run' || name === 'walk') {                 // koşu: kollar bacaklarla ters salınır
    const r = name === 'run', a = r ? 1.05 : 0.5, s = Math.sin(ph || 0);
    hip.position.y = 0.92 + (r ? Math.abs(Math.cos(ph || 0)) * 0.07 : 0); torso.rotation.z = r ? -0.34 : -0.05;
    legs[0].rotation.z = a * s; legs[1].rotation.z = -a * s; armZ(arms[0], -a * 0.9 * s); armZ(arms[1], a * 0.9 * s);
  } else if (name === 'climb') {                                 // duvarda: eller yukarıda, sırayla uzanır
    const s = Math.sin(ph || 0);
    hip.position.y = 0.92; torso.rotation.z = -0.08;
    legs[0].rotation.z = 0.55 + 0.45 * s; legs[1].rotation.z = 0.55 - 0.45 * s; armZ(arms[0], 2.75 + 0.35 * s); armZ(arms[1], 2.75 - 0.35 * s);
  } else if (name === 'fall') {                                  // düşüş: kollar açık
    hip.position.y = 0.92; torso.rotation.z = 0.12;
    legs[0].rotation.z = 0.35; legs[1].rotation.z = -0.25; armZ(arms[0], 2.1 + Math.sin(t * 9) * 0.15); armZ(arms[1], 1.8 - Math.sin(t * 9) * 0.15);
  } else if (name === 'land') {                                  // kahraman inişi: diz çöker, bir el yerde
    hip.position.y = 0.5; torso.rotation.z = -0.7;
    legs[0].rotation.z = 1.35; legs[1].rotation.z = -0.9; armZ(arms[0], 0.5); armZ(arms[1], 1.3);
  } else if (name === 'zip') {
    hip.position.y = 0.92; legs[0].rotation.z = -0.35; legs[1].rotation.z = -0.1; armZ(arms[1], -0.7);
  } else {          // ayakta
    hip.position.y = 0.92; torso.rotation.set(0, 0, 0);
    legs[0].rotation.z = 0; legs[1].rotation.z = 0; armZ(arms[0], 0.08); armZ(arms[1], -0.08);
  }
}

/* ---------- hareket parçaları: zıplama, sallanma, ağla çekilme ---------- */
function seg(kind, p0, p1, extra) {
  const d = p0.distanceTo(p1);
  const dur = kind === 'hop' ? 0.55 + d / 15 : kind === 'zip' ? 0.6 + d / 28 : 0.8 + d / 36;
  return Object.assign({ kind, p0: p0.clone(), p1: p1.clone(), d, dur }, extra);
}
function swingSeg(p0, p1, anchor) {
  const d = p0.distanceTo(p1), m = p0.clone().lerp(p1, 0.5);
  return seg('swing', p0, p1, { anchor: anchor || V(m.x, Math.max(p0.y, p1.y) + 12 + d * 0.25, m.z), sag: Math.min(10, d * 0.2) });
}
function posOf(s, u, out) {
  if (s.kind === 'zip') {
    const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    out.lerpVectors(s.p0, s.p1, e); out.y += 1.5 * Math.sin(Math.PI * e);
  } else {
    out.lerpVectors(s.p0, s.p1, u);
    if (s.kind === 'hop') out.y += 4 * s.a * u * (1 - u);
    else out.y -= s.sag * Math.sin(Math.PI * u);
  }
  out.y = Math.max(B, out.y);
  return out;
}

/* ---------- durum ---------- */
const S = { pos: V(0, 0, 0), ry: 0, seg: null, t: 0, idle: 2, roof: null, mission: null, node: null, phase: 'patrol', wait: 0, side: 1, look: null, user: false };
const live = b => b.type !== 'house' && b.lot.building === b;
function roofPoint(b, toward) {
  const tt = b.topTier, l = b.lot, mx = Math.max(0.4, tt.w / 2 - 1.2), mz = Math.max(0.4, tt.d / 2 - 1.2);
  const x = toward ? C.clamp(toward.x - l.cx, -mx, mx) : (Math.random() * 2 - 1) * mx;
  const z = toward ? C.clamp(toward.z - l.cz, -mz, mz) : (Math.random() * 2 - 1) * mz;
  return V(l.cx + x, b.top, l.cz + z);
}
function topAt(x, z) {
  for (const b of C.buildings) { const l = b.lot; if (Math.abs(x - l.cx) < l.w / 2 && Math.abs(z - l.cz) < l.d / 2) return b.top; }
  return 0;
}
function start(s) { S.seg = s; S.t = 0; }

/* devriye: yakındaki bir çatıya; uzaktaysa kameranın baktığı yere doğru */
function planPatrol() {
  const here = S.pos, cam = C.controls ? C.controls.target : V(0, 0, 0);
  const dc = Math.hypot(here.x - cam.x, here.z - cam.z);
  const all = C.buildings.filter(b => live(b) && b !== S.roof);
  const dist = b => Math.hypot(b.lot.cx - here.x, b.lot.cz - here.z);
  let near = all.filter(b => { const d = dist(b); return d > 14 && d < 60 && Math.abs(b.top - here.y) < 35; });
  if (dc > 200) { const closer = near.filter(b => Math.hypot(b.lot.cx - cam.x, b.lot.cz - cam.z) < dc - 10); if (closer.length) near = closer; }
  const b = near.length ? pick(near) : all.sort((p, q) => dist(p) - dist(q))[(Math.random() * 5) | 0];
  if (!b) return;
  const p1 = roofPoint(b, null), dy = p1.y - here.y, d = here.distanceTo(p1);
  if (dy > 10) start(seg('zip', here, p1, { anchor: p1.clone().add(V(0, 1.2, 0)) }));
  else if (d > 45 || dy < -15) start(swingSeg(here, p1));
  else start(seg('hop', here, p1, { a: 1.5 + d * 0.18 + Math.max(0, dy) }));
  S.roof = b;
}
/* görev dönüşü: en yakın çatıya ağla çıkar */
function planReturn() {
  S.mission = null; S.node = null; S.phase = 'patrol';
  const all = C.buildings.filter(live), here = S.pos;
  const b = all.sort((p, q) => Math.hypot(p.lot.cx - here.x, p.lot.cz - here.z) - Math.hypot(q.lot.cx - here.x, q.lot.cz - here.z))[0];
  if (!b) return;
  const p1 = roofPoint(b, here);
  start(p1.y > here.y + 4 ? seg('zip', here, p1, { anchor: p1.clone().add(V(0, 1.2, 0)) }) : swingSeg(here, p1));
  S.roof = b;
}

/* kovalama: kavşaktan kavşağa yolların üstünden sallanır, her kavşakta şüphelinin yerine göre rotayı yeniler */
const NODE_Y = 16;
const nodeOf = (x, z) => [C.clamp(Math.round((x - C.roadX(0)) / C.PITCH), 0, C.N), C.clamp(Math.round((z - C.roadX(0)) / C.PITCH), 0, C.N)];
const nodePos = (i, j) => V(C.roadX(i), NODE_Y, C.roadX(j));
function planMission() {
  const ev = S.mission, th = ev.th;
  if (ev.done || th.caught) return planReturn();
  const tp = th.g.position, [ti, tj] = nodeOf(tp.x, tp.z);
  if (!S.node) { S.node = nodeOf(S.pos.x, S.pos.z); start(swingSeg(S.pos, nodePos(S.node[0], S.node[1]))); return; }
  const [i, j] = S.node;
  if (i === ti && j === tj) {
    th.sp = 0;                                         // şüpheli kahramanı görünce donakalır
    const ox = tp.x - ev.blk.bx, oz = tp.z - ev.blk.bz;
    const nx = Math.abs(ox) > Math.abs(oz) ? Math.sign(ox) : 0, nz = nx ? 0 : Math.sign(oz);
    const L = V(tp.x + nx * 1.6, B, tp.z + nz * 1.6);
    const s = swingSeg(S.pos, L); s.sag = 2; s.final = true; start(s); return;
  }
  const di = ti - i, dj = tj - j, step = Math.abs(di) >= Math.abs(dj) ? [i + Math.sign(di), j] : [i, j + Math.sign(dj)];
  const p1 = nodePos(step[0], step[1]), m = S.pos.clone().lerp(p1, 0.5);
  const ax = step[0] !== i ? 0 : 1, az = 1 - ax;                         // yola dik yön
  S.side = -S.side;
  const sx = m.x + ax * S.side * 14, sz = m.z + az * S.side * 14;
  const anchor = V(sx, C.clamp(Math.max(topAt(sx, sz), 30), 30, 80), sz);
  S.node = step; start(swingSeg(S.pos, p1, anchor));
}
function onSegEnd(s) {
  S.pos.copy(s.p1);
  if (s.final) { S.phase = 'catch'; S.wait = 0.8; }
}

const hand = V(0, 0, 0), look = V(0, 0, 0);
C.hero = {
  pos: S.pos, root: M.root, task: null,
  state: () => S.user ? 'user' : S.seg ? S.seg.kind : S.mission ? S.phase : 'crouch',     // hop, swing, zip, catch, stand, mission, crouch, user
  get ry() { return S.ry; },
  /* oyuncu kontrolü (heroplay.js): açılınca yapay zekâ durur, sürmekte olduğu hırsızlık oyuncunun görevi olur; kapanınca kaldığı yerden devam eder */
  takeover(on) {
    if (on) {
      if (!placed) place();
      const ev = S.mission;
      this.task = ev && !ev.done && !ev.th.caught ? ev : null;
      if (S.seg || S.mission) {                                    // havadaysa en yakın çatıya konar
        const here = S.pos, b = C.buildings.filter(live).sort((p, q) => Math.hypot(p.lot.cx - here.x, p.lot.cz - here.z) - Math.hypot(q.lot.cx - here.x, q.lot.cz - here.z))[0];
        if (b) { S.pos.copy(roofPoint(b, here)); S.roof = b; }
      }
      S.seg = null; S.mission = null; S.node = null; S.phase = 'patrol'; S.user = true;
      return S.pos.clone();
    }
    S.user = false; S.seg = null; S.roof = null; S.idle = 1.2;
    const ev = this.task; this.task = null;
    if (ev && !ev.done && !ev.th.caught) { S.mission = ev; S.node = null; S.phase = 'mission'; }
    return null;
  },
  /* oyuncu modunda modeli çiz: o = { pos, ry | quat, pose, t, ph, spin, anchor }; elin dünyadaki yerini döndürür */
  drive(o) {
    S.pos.copy(o.pos); M.root.position.copy(o.pos);
    if (o.quat) M.root.quaternion.copy(o.quat); else M.root.rotation.set(0, o.ry, 0);
    if (!o.quat) S.ry = o.ry;
    pose(o.pose, o.t, o.ph);
    if (o.spin) M.hip.rotation.z -= o.spin;                         // takla: kalça ekseninde öne döner
    M.root.updateMatrixWorld(true);
    if (o.anchor) { aim(M.arms[0], o.anchor, hand); stretch(hand, o.anchor); } else strand.visible = false;
    return hand;
  },
  alert(ev) {
    if (S.user) { if (this.task && !this.task.done) return false; this.task = ev; ev.heroComing(); return true; }
    if (S.mission) return false;
    S.mission = ev; S.node = null; S.phase = 'mission'; ev.heroComing();
    return true;
  }
};

/* başlangıç: merkeze yakın bir çatı (binalar ui.js'de kurulduğu için ilk karede) */
let placed = false;
function place() {
  const all = C.buildings.filter(live).sort((p, q) => Math.hypot(p.lot.cx, p.lot.cz) - Math.hypot(q.lot.cx, q.lot.cz));
  const b = all[(Math.random() * Math.min(12, all.length)) | 0];
  if (b) { S.pos.copy(roofPoint(b, null)); S.roof = b; placed = true; }
}

C.updaters.push((dt, t) => {
  if (!placed) { place(); if (!placed) return; }
  if (S.user) return;                                             // oyuncu sürüyor (heroplay.js)
  let poseName = 'crouch', anchor = null;
  if (S.seg) {
    S.t += dt; const s = S.seg, u = Math.min(1, S.t / s.dur);
    posOf(s, u, S.pos);
    S.ry = Math.atan2(-(s.p1.z - s.p0.z), s.p1.x - s.p0.x);
    poseName = s.kind === 'hop' ? 'jump' : 'swing';
    if (s.kind === 'zip' || (s.kind === 'swing' && u < 0.8)) anchor = s.anchor;
    if (s.kind === 'swing' && u >= 0.8) poseName = 'jump';
    if (u >= 1) { S.seg = null; onSegEnd(s); }
  } else if (S.phase === 'catch' || S.phase === 'stand') {
    const th = S.mission.th.g.position;
    S.ry = Math.atan2(-(th.z - S.pos.z), th.x - S.pos.x); poseName = 'stand';
    S.wait -= dt;
    if (S.phase === 'catch') { look.set(th.x, th.y + 1.1, th.z); anchor = look; }
    if (S.wait <= 0) {
      if (S.phase === 'catch') { S.mission.heroCatch(); S.phase = 'stand'; S.wait = 2.2; }
      else planReturn();
    }
  } else if (S.mission) planMission();
  else if ((S.idle -= dt) <= 0) { planPatrol(); S.idle = 1.5 + Math.random() * 3; }

  M.root.position.copy(S.pos); M.root.rotation.y = S.ry;
  pose(poseName, t);
  M.root.updateMatrixWorld(true);
  if (anchor) { aim(M.arms[0], anchor, hand); stretch(hand, anchor); } else strand.visible = false;
});
})();
