/* ===== player.js: karakter modu (üçüncü şahıs kamera, WASD, imleç kilidi, çarpışma, konuşma) ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene, camera = C.camera, B = C.SW;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const $ = id => document.getElementById(id);

const P = C.player = {
  active: false, entering: false, pos: V(0, 0, 0), vel: V(0, 0, 0), vy: 0, air: false, yaw: 0, pitch: 0.22, dist: 4.2, face: 0, ph: 0,
  crowd: new C.Crowd(1), look: null, indoor: null
};
scene.add(P.crowd.group); P.crowd.group.visible = false;
const keys = new Set();
const MOVE = { KeyW: [1, 0], ArrowUp: [1, 0], KeyS: [-1, 0], ArrowDown: [-1, 0], KeyA: [0, -1], ArrowLeft: [0, -1], KeyD: [0, 1], ArrowRight: [0, 1] };
let run = false;

/* ---------- çarpışma: binalar, yapılar, ağaçlar, lambalar; 24 m'lik ızgarada ---------- */
const CELL = 24, R = 0.32, grid = new Map();
let gridSig = '';
const cellKey = (i, j) => i * 10007 + j;
function addCol(c, x0, z0, x1, z1) {
  for (let i = Math.floor(x0 / CELL); i <= Math.floor(x1 / CELL); i++) for (let j = Math.floor(z0 / CELL); j <= Math.floor(z1 / CELL); j++) {
    const k = cellKey(i, j); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(c);
  }
}
const rect = (cx, cz, hw, hd) => { const c = { t: 0, cx, cz, hw, hd }; addCol(c, cx - hw, cz - hd, cx + hw, cz + hd); };
const circ = (x, z, r) => { const c = { t: 1, x, z, r }; addCol(c, x - r, z - r, x + r, z + r); };
const box3 = new THREE.Box3();
function buildGrid() {
  grid.clear();
  for (const b of C.buildings) { const bt = b.baseTier; rect(b.lot.cx, b.lot.cz, bt.w / 2 + 0.05, bt.d / 2 + 0.05); }
  for (const L of C.landmarks) L.group.traverse(o => {
    if (!o.isMesh) return;
    box3.setFromObject(o); const sx = box3.max.x - box3.min.x, sz = box3.max.z - box3.min.z;
    if (box3.max.y - box3.min.y < 1.2 || sx > 40 || sz > 40) return;          // zemin ve döşemeler engel değil
    rect((box3.min.x + box3.max.x) / 2, (box3.min.z + box3.max.z) / 2, sx / 2, sz / 2);
  });
  for (const t of C.treeSpots) circ(t[0], t[1], 0.3 * t[2]);
  for (const l of C.lampSpots) circ(l[0], l[1], 0.14);
  gridSig = C.buildings.length + ':' + (C.bver || 0);
}
const P2 = { x: 0, z: 0 };
function resolve(p) {
  for (let it = 0; it < 2; it++) {
    const ci = Math.floor(p.x / CELL), cj = Math.floor(p.z / CELL);
    for (let i = ci - 1; i <= ci + 1; i++) for (let j = cj - 1; j <= cj + 1; j++) {
      const list = grid.get(cellKey(i, j)); if (!list) continue;
      for (const c of list) {
        if (c.t === 0) {
          const qx = C.clamp(p.x, c.cx - c.hw, c.cx + c.hw), qz = C.clamp(p.z, c.cz - c.hd, c.cz + c.hd);
          let dx = p.x - qx, dz = p.z - qz; const d = Math.hypot(dx, dz);
          if (d >= R) continue;
          if (d > 1e-6) { p.x = qx + dx / d * R; p.z = qz + dz / d * R; }
          else {                                                            // içeride: en kısa yoldan dışarı
            const ex = c.hw - Math.abs(p.x - c.cx), ez = c.hd - Math.abs(p.z - c.cz);
            if (ex < ez) p.x = c.cx + Math.sign(p.x - c.cx || 1) * (c.hw + R); else p.z = c.cz + Math.sign(p.z - c.cz || 1) * (c.hd + R);
          }
        } else {
          const dx = p.x - c.x, dz = p.z - c.z, d = Math.hypot(dx, dz), m = R + c.r;
          if (d < m && d > 1e-6) { p.x = c.x + dx / d * m; p.z = c.z + dz / d * m; }
        }
      }
    }
  }
  const lim = C.TOTAL / 2 - 0.4; p.x = C.clamp(p.x, -lim, lim); p.z = C.clamp(p.z, -lim, lim);   // görünmez duvar: en dış yolun kaldırım çizgisi
}
/* zemin: blok içindeyse kaldırım (0,3 m), değilse yol */
function groundAt(x, z) {
  const bi = Math.round((x - C.blockC(0)) / C.PITCH), bj = Math.round((z - C.blockC(0)) / C.PITCH);
  if (bi < 0 || bj < 0 || bi >= C.N || bj >= C.N) return 0;
  return Math.abs(x - C.blockC(bi)) <= C.BLOCK / 2 && Math.abs(z - C.blockC(bj)) <= C.BLOCK / 2 ? B : 0;
}
P.groundAt = groundAt; P.resolve = resolve;

/* ---------- kamera: başın arkasında; duvara çarpıyorsa yaklaşır ---------- */
const head = V(0, 0, 0), camRay = new THREE.Raycaster(), dir = V(0, 0, 0), wp = V(0, 0, 0);
let near = [], nearT = 0;
function camPose(out, dist) {
  head.set(P.pos.x, P.pos.y + 1.55, P.pos.z);
  const d = dist === undefined ? P.dist : dist, cp = Math.cos(P.pitch), sp = Math.sin(P.pitch);
  out.set(head.x - Math.cos(P.yaw) * cp * d, head.y + sp * d, head.z + Math.sin(P.yaw) * cp * d);
  return out;
}
const camWant = V(0, 0, 0);
P.camera = function (dt) {
  if ((nearT -= dt) <= 0) {
    nearT = 0.4; near = C.pickables.filter(m => { m.getWorldPosition(wp); return Math.hypot(wp.x - P.pos.x, wp.z - P.pos.z) < 70; });
    if (P.indoor) near = near.concat(P.indoor.walls);
  }
  camPose(camWant);
  dir.subVectors(camWant, head); const L = dir.length(); dir.divideScalar(L);
  camRay.set(head, dir); camRay.far = L;
  const hit = camRay.intersectObjects(near, false)[0];
  if (hit) camPose(camWant, Math.max(0.7, hit.distance - 0.3));
  if (P.indoor) C.venues.keepCam(camWant, head);
  camera.position.copy(camWant); camera.lookAt(head);
  C.controls.target.copy(head);
};

/* ---------- giriş / çıkış ---------- */
function spawnPoint() {
  const t = C.controls.target, bi = C.clamp(Math.round((t.x - C.blockC(0)) / C.PITCH), 0, C.N - 1), bj = C.clamp(Math.round((t.z - C.blockC(0)) / C.PITCH), 0, C.N - 1);
  const bx = C.blockC(bi), bz = C.blockC(bj), h = 20.6;
  let x = C.clamp(t.x - bx, -h, h), z = C.clamp(t.z - bz, -h, h);
  if (Math.abs(Math.abs(x) - h) > Math.abs(Math.abs(z) - h)) z = Math.sign(z || 1) * h; else x = Math.sign(x || 1) * h;   // kaldırım halkasına
  const p = { x: bx + x, z: bz + z }; resolve(p);
  const along = Math.abs(Math.abs(x) - h) < 0.01 ? Math.PI / 2 : 0;                   // halka boyunca bak
  return { x: p.x, z: p.z, face: along };
}
P.enter = function () {
  if (P.active || P.entering) return;
  if (gridSig !== C.buildings.length + ':' + (C.bver || 0)) buildGrid();
  const s = spawnPoint();
  P.pos.set(s.x, groundAt(s.x, s.z), s.z); P.vel.set(0, 0, 0); P.face = P.yaw = s.face; P.pitch = 0.22; P.dist = 4.2;
  P.look = C.randomLook(); P.crowd.look(0, P.look); P.crowd.group.visible = true; draw(0);
  const cam = camPose(V(0, 0, 0)); C.flyTo(cam, head.clone(), 2600);
  P.entering = true; setHud();
};
P.exit = function () {
  if (!P.active && !P.entering) return;
  if (P.indoor && C.venues) C.venues.leave(true);
  P.active = P.entering = false; keys.clear();
  if (document.pointerLockElement) document.exitPointerLock();
  P.crowd.group.visible = false; hideBubbles();
  C.flyTo(V(P.pos.x + 70, 110, P.pos.z + 90), V(P.pos.x, 0, P.pos.z), 2200);
  setHud();
};

/* ---------- hareket ---------- */
const pp = {};
function draw(t) {
  const sp = Math.hypot(P.vel.x, P.vel.z);
  const pose = P.air ? C.pose('jump', t, pp) : sp > 3.2 ? C.pose('run', P.ph, pp) : sp > 0.25 ? C.pose('walk', P.ph, pp) : C.pose(talkT > 0 ? 'talk' : 'stand', t, pp);
  P.crowd.set(0, P.pos.x, P.pos.y, P.pos.z, P.face, pose); P.crowd.commit();
}
P.update = function (dt, t) {
  if (P.entering && !C.flying()) { P.entering = false; P.active = true; setHud(); }
  if (!P.active) return;
  if (gridSig !== C.buildings.length + ':' + (C.bver || 0)) buildGrid();
  let f = 0, s = 0; for (const k of keys) { f += MOVE[k][0]; s += MOVE[k][1]; }
  const cy = Math.cos(P.yaw), sy = -Math.sin(P.yaw);           // bakış yönü (x, z)
  let wx = cy * f + (-sy) * s, wz = sy * f + cy * s;              // sağ = (-sy, cy)
  const wl = Math.hypot(wx, wz), top = run ? 5.6 : 2.0;
  if (wl > 0) { wx /= wl; wz /= wl; }
  const ax = wx * top - P.vel.x, az = wz * top - P.vel.z, k = Math.min(1, dt * (P.air ? 2 : wl ? 10 : 8));   // havada az kontrol
  P.vel.x += ax * k; P.vel.z += az * k;
  const sp = Math.hypot(P.vel.x, P.vel.z);
  const q = { x: P.pos.x + P.vel.x * dt, z: P.pos.z + P.vel.z * dt };
  if (P.indoor) C.venues.confine(q); else resolve(q);
  P.vel.x = (q.x - P.pos.x) / Math.max(dt, 1e-4); P.vel.z = (q.z - P.pos.z) / Math.max(dt, 1e-4);
  P.pos.x = q.x; P.pos.z = q.z;
  const gy = P.indoor ? P.indoor.floor : groundAt(P.pos.x, P.pos.z);
  if (P.air) {                                                     // zıplama: yer çekimi, yere değince iner
    P.vy -= 13 * dt; P.pos.y += P.vy * dt;
    if (P.pos.y <= gy && P.vy < 0) { P.pos.y = gy; P.vy = 0; P.air = false; }
  } else P.pos.y += (gy - P.pos.y) * Math.min(1, dt * 14);
  if (sp > 0.25 && !P.air) {
    const want = Math.atan2(-P.vel.z, P.vel.x); let d = want - P.face; d = Math.atan2(Math.sin(d), Math.cos(d));
    P.face += d * Math.min(1, dt * 10); P.ph += sp * dt * (sp > 3.2 ? 2.6 : 3.4);
  }
  if (talkT > 0) talkT -= dt;
  draw(t); updatePrompt(); updateBubbles(dt);
};

/* ---------- konuşma: yanındaki yayaya E ---------- */
const LINES = ['Günaydın komşu!', 'Çay demlendi, gel otur.', 'Bugün hava güzel ha?', 'Otobüs yine gecikti.', 'Pijamalı Çocuğu gördün mü? Az önce buradaydı!',
  'Fırından taze simit aldım.', 'Trafik de bir dert…', 'Kolay gelsin!', 'Saat kulesi yine beş dakika ileri.', 'Kafede yer var mı acaba?',
  'Bu şehirde hep bir şey oluyor.', 'Akşama maç var, kaçırma.', 'Kirada zam varmış, duydun mu?', 'Marketten ekmek alacaktım, unuttum!'];
const HELLO = ['Merhaba!', 'Selam!', 'Kolay gelsin!', 'İyi günler!'];
let talkT = 0, prompt = null;
/* dışarıda yayalar, içeride mekandakiler (venues.js her karede wx, wz yazar) */
const px = p => P.indoor ? p.wx : p.x, pz = p => P.indoor ? p.wz : p.z;
function nearestPerson() {
  let best = null, bd = 2.4;
  for (const p of (P.indoor ? P.indoor.npcs : C.people)) {
    if (p.hid || px(p) === undefined) continue;
    const d = Math.hypot(px(p) - P.pos.x, pz(p) - P.pos.z); if (d < bd) { bd = d; best = p; }
  }
  return best;
}
function updatePrompt() {
  let text = '';
  prompt = null;
  if (P.indoor) {
    const p = nearestPerson();
    if (C.venues.exitNear()) { prompt = { kind: 'exit' }; text = 'E: Dışarı çık'; }
    else if (p) { prompt = { kind: 'talk', p }; text = 'E: Konuş'; }
  }
  else {
    const v = C.venues && C.venues.doorNear(P.pos);
    const p = nearestPerson();
    if (p && (!v || Math.hypot(p.x - P.pos.x, p.z - P.pos.z) < v.d)) { prompt = { kind: 'talk', p }; text = 'E: Konuş'; }
    else if (v) { prompt = { kind: 'door', v }; text = 'E: Gir · ' + v.name; }
  }
  const el = $('playPrompt'); if (el.textContent !== text) { el.textContent = text; el.hidden = !text; }
}
function act() {
  if (!prompt) return;
  if (prompt.kind === 'talk') {
    const p = prompt.p, lines = P.indoor && p.talk ? p.talk : LINES; talkT = 1.4;
    if (P.indoor) p.talk_t = 5; else p.talk = 5.5;
    P.face = Math.atan2(-(pz(p) - P.pos.z), px(p) - P.pos.x);
    bubble(() => V(P.pos.x, P.pos.y + 2.1, P.pos.z), HELLO[(Math.random() * HELLO.length) | 0], 0, 2.2);
    bubble(() => V(px(p), B + 2.1 + (p.y || 0), pz(p)), lines[(Math.random() * lines.length) | 0], 0.8, 4.6);
  } else if (prompt.kind === 'door') C.venues.enter(prompt.v);
  else if (prompt.kind === 'exit') C.venues.leave();
}
/* konuşma balonları: DOM, her karede ekrana yansıtılır */
const bubbles = [], pv = V(0, 0, 0);
function bubble(at, text, delay, life) {
  const el = document.createElement('div'); el.className = 'bubble'; el.textContent = text; el.hidden = true;
  $('bubbles').appendChild(el); bubbles.push({ el, at, delay, life });
}
function updateBubbles(dt) {
  const w = C.renderer.domElement.clientWidth, h = C.renderer.domElement.clientHeight;
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    if ((b.delay -= dt) > 0) continue;
    if ((b.life -= dt) <= 0) { b.el.remove(); bubbles.splice(i, 1); continue; }
    pv.copy(b.at()).project(camera);
    const vis = pv.z < 1 && Math.abs(pv.x) < 1.1 && Math.abs(pv.y) < 1.1;
    b.el.hidden = !vis;
    if (vis) { b.el.style.transform = `translate(${(pv.x + 1) / 2 * w}px, ${(1 - pv.y) / 2 * h}px) translate(-50%, -100%)`; b.el.style.opacity = Math.min(1, b.life * 2); }
  }
}
function hideBubbles() { for (const b of bubbles) b.el.remove(); bubbles.length = 0; }

/* ---------- girdi ---------- */
const el = C.renderer.domElement;
window.addEventListener('keydown', e => {
  if (!P.active) return;
  run = e.shiftKey;
  if (e.target.closest && e.target.closest('input, textarea, select')) return;
  if (MOVE[e.code]) { keys.add(e.code); e.preventDefault(); }
  else if (e.code === 'KeyE' && !e.repeat) { act(); e.preventDefault(); }
  else if (e.code === 'Space') { e.preventDefault(); if (!P.air && !e.repeat) { P.air = true; P.vy = 4.8; } }
});
window.addEventListener('keyup', e => { run = e.shiftKey; keys.delete(e.code); });
window.addEventListener('blur', () => keys.clear());
el.addEventListener('click', () => { if (P.active && document.pointerLockElement !== el) el.requestPointerLock(); });
document.addEventListener('pointerlockchange', setHud);
document.addEventListener('mousemove', e => {
  if (!P.active || document.pointerLockElement !== el) return;
  P.yaw -= e.movementX * 0.0026; P.pitch = C.clamp(P.pitch + e.movementY * 0.0022, -0.45, 1.25);
});
P.zoom = dy => { P.dist = C.clamp(P.dist * Math.exp(dy * 0.0012), 1.6, 12); };

let dockWasOpen = null;
function setHud() {
  const on = P.active || P.entering, hud = $('playHud'), btn = $('btnPlay'), dock = $('dock');
  /* oyunda kontrol paneli kapanır, çıkınca eski hâline döner */
  if (on && dockWasOpen === null) { dockWasOpen = !dock.classList.contains('collapsed'); dock.classList.add('collapsed'); $('dockToggle').setAttribute('aria-expanded', 'false'); }
  if (!on && dockWasOpen !== null) { if (dockWasOpen) { dock.classList.remove('collapsed'); $('dockToggle').setAttribute('aria-expanded', 'true'); } dockWasOpen = null; }
  hud.hidden = !on; document.body.classList.toggle('playing', on);
  if (btn) { btn.textContent = on ? 'Kuş bakışına dön' : 'Karakteri oyna'; btn.setAttribute('aria-pressed', on); }
  $('playLock').hidden = !P.active || document.pointerLockElement === el;
  if (!on) $('playPrompt').hidden = true;
}
C.updaters.push((dt, t) => P.update(dt, t));
})();
