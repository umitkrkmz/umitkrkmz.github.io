/* ===== player.js: karakter modu (üçüncü şahıs kamera, WASD, imleç kilidi, çarpışma, konuşma) ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene, camera = C.camera, B = C.SW;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const $ = id => document.getElementById(id);

const P = C.player = {
  active: false, entering: false, mode: 'citizen', pos: V(0, 0, 0), vel: V(0, 0, 0), vy: 0, air: false, yaw: 0, pitch: 0.22, dist: 4.2, distAdd: 0, face: 0, ph: 0, mouseT: 0,
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
  for (const b of C.benchSpots) {                                     // banklar: oturak + sırtlık kadar kutu
    const along = Math.abs(Math.cos(b[2])) > 0.5, nx = Math.sin(b[2]), nz = Math.cos(b[2]);
    rect(b[0] - nx * 0.06, b[1] - nz * 0.06, along ? 0.92 : 0.3, along ? 0.3 : 0.92);
  }
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
  const d = dist === undefined ? P.dist + P.distAdd : dist, cp = Math.cos(P.pitch), sp = Math.sin(P.pitch);
  out.set(head.x - Math.cos(P.yaw) * cp * d, head.y + sp * d, head.z + Math.sin(P.yaw) * cp * d);
  return out;
}
const camWant = V(0, 0, 0);
P.camera = function (dt) {
  if ((nearT -= dt) <= 0) {
    const rr = P.mode === 'hero' ? 110 : 70;                       // kahraman hızlı: daha geniş çevre
    nearT = 0.4; near = C.pickables.filter(m => { m.getWorldPosition(wp); return Math.hypot(wp.x - P.pos.x, wp.z - P.pos.z) < rr; });
    if (P.indoor) near = near.concat(P.indoor.walls);
  }
  camPose(camWant);
  dir.subVectors(camWant, head); const L = dir.length(); dir.divideScalar(L);
  camRay.set(head, dir); camRay.far = L;
  const hit = camRay.intersectObjects(near, false)[0];
  if (hit) camPose(camWant, Math.max(0.7, hit.distance - 0.3));
  if (P.indoor) C.venues.keepCam(camWant, head);
  else camWant.y = Math.max(camWant.y, groundAt(camWant.x, camWant.z) + 0.25);   // kamera yerin altına inmesin
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
P.enter = function (mode) {
  if (P.active || P.entering) return;
  if (gridSig !== C.buildings.length + ':' + (C.bver || 0)) buildGrid();
  P.mode = mode === 'hero' && C.heroPlay ? 'hero' : 'citizen'; P.distAdd = 0;
  if (P.mode === 'hero') C.heroPlay.start();                     // Pijamalı Çocuk: bulunduğu çatıdan başlar
  else {
    const s = spawnPoint();
    P.pos.set(s.x, groundAt(s.x, s.z), s.z); P.vel.set(0, 0, 0); P.face = P.yaw = s.face; P.pitch = 0.22; P.dist = 4.2;
    P.look = C.randomLook(); P.crowd.look(0, P.look); P.crowd.group.visible = true; draw(0);
  }
  const cam = camPose(V(0, 0, 0)); C.flyTo(cam, head.clone(), 2600);
  P.entering = true; setHud();
};
P.exit = function () {
  if (!P.active && !P.entering) return;
  if (P.indoor && C.venues) C.venues.leave(true);
  P.active = P.entering = false; keys.clear();
  if (document.pointerLockElement) document.exitPointerLock();
  if (P.mode === 'hero') C.heroPlay.stop();
  if (C.cats && C.cats.held) C.cats.drop();
  standUp();
  P.crowd.group.visible = false; hideBubbles();
  C.flyTo(V(P.pos.x + 70, 110, P.pos.z + 90), V(P.pos.x, 0, P.pos.z), 2200);
  setHud();
};

/* ---------- hareket ---------- */
const pp = {};
function draw(t) {
  const sp = Math.hypot(P.vel.x, P.vel.z);
  const pose = P.seat ? C.pose(Math.sin(t * 0.2) > 0.75 ? 'drink' : 'sit', t, pp) : P.down > 0 ? C.pose(P.down > 0.7 ? 'lie' : 'kneel', t, pp) : P.petT > 0 ? C.pose('pet', t, pp) : P.air ? C.pose('jump', t, pp) : sp > 3.2 ? C.pose('run', P.ph, pp) : sp > 0.25 ? C.pose('walk', P.ph, pp) : C.pose(talkT > 0 ? 'talk' : 'stand', t, pp);
  if (C.cats && C.cats.held && !(P.down > 0)) { pose.sh = [0.62, 0.62]; pose.el = [1.05, 1.05]; pose.ab = [0.02, 0.02]; }   // kucakta kedi
  P.crowd.set(0, P.pos.x, P.pos.y, P.pos.z, P.face, pose); P.crowd.commit();
}
/* tuşlardan bakış yönüne göre istenen hareket (kahraman modu da kullanır) */
P.input = function () {
  let f = 0, s = 0; for (const k of keys) { f += MOVE[k][0]; s += MOVE[k][1]; }
  const cy = Math.cos(P.yaw), sy = -Math.sin(P.yaw);
  let wx = cy * f + (-sy) * s, wz = sy * f + cy * s; const wl = Math.hypot(wx, wz);
  if (wl > 0) { wx /= wl; wz /= wl; }
  return { f: Math.sign(f), s: Math.sign(s), wx, wz, wl, run };
};
/* araç çarparsa: savrulur, yere düşer, biraz sonra kalkar; yaya kazası olayı başlar */
function knock(car) {
  const fx = Math.cos(car.wr), fz = -Math.sin(car.wr), k = Math.min(7, car.v * 0.6);
  P.down = 3.2; P.vel.set(fx * k, 0, fz * k); P.air = false; P.vy = 0; P.face = Math.atan2(fz, -fx) + Math.PI;
  if (C.pedestrianHit) C.pedestrianHit(car, P.pos.x, P.pos.z);
  car.v = 0;
}
P.update = function (dt, t) {
  if (P.entering && !C.flying()) { P.entering = false; P.active = true; setHud(); }
  if (!P.active) { if (C.setObstacle) C.setObstacle(1e9, 1e9); updateBubbles(dt); return; }   // balonlar kuş bakışında da (geliştirici, kedi toplantısı)
  if (C.setObstacle) { if (!P.indoor && P.pos.y < 1) C.setObstacle(P.pos.x, P.pos.z); else C.setObstacle(1e9, 1e9); }
  if (gridSig !== C.buildings.length + ':' + (C.bver || 0)) buildGrid();
  if (P.mode === 'hero') { C.heroPlay.update(dt, t); if (talkT > 0) talkT -= dt; updatePrompt(); updateBubbles(dt); return; }
  let f = 0, s = 0; for (const k of keys) { f += MOVE[k][0]; s += MOVE[k][1]; }
  const cy = Math.cos(P.yaw), sy = -Math.sin(P.yaw);           // bakış yönü (x, z)
  let wx = cy * f + (-sy) * s, wz = sy * f + cy * s;              // sağ = (-sy, cy)
  let wl = Math.hypot(wx, wz), top = run ? 5.6 : 2.0;
  if (wl > 0) { wx /= wl; wz /= wl; }
  if (P.seat) { if (wl) standUp(); else { wx = wz = 0; wl = 0; top = 0; P.vel.set(0, 0, 0); } }   // bankta: yürümeye kalkınca kalkar
  if (P.down > 0) { P.down -= dt; wx = wz = 0; wl = 0; top = 0; }        // yerde: hareket yok
  if (P.petT > 0) { P.petT -= dt; if (wl) P.petT = 0; else top = 0; }    // kedi severken; yürüyünce bırakır
  const ax = wx * top - P.vel.x, az = wz * top - P.vel.z, k = Math.min(1, dt * (P.air ? 2 : wl ? 10 : 8));   // havada az kontrol
  P.vel.x += ax * k; P.vel.z += az * k;
  const sp = Math.hypot(P.vel.x, P.vel.z);
  const q = { x: P.pos.x + P.vel.x * dt, z: P.pos.z + P.vel.z * dt };
  if (P.seat) { q.x = P.seat.x; q.z = P.seat.z; }
  if (P.seat) {} else if (P.indoor) C.venues.confine(q);
  else {
    resolve(q);
    const car = C.carPush && P.pos.y < 1.5 ? C.carPush(q, R) : null;     // araçların içinden geçilmez
    if (car && !car.parked && car.v > 3.5 && !P.down) knock(car);
  }
  P.vel.x = (q.x - P.pos.x) / Math.max(dt, 1e-4); P.vel.z = (q.z - P.pos.z) / Math.max(dt, 1e-4);
  P.pos.x = q.x; P.pos.z = q.z;
  const gy = P.indoor ? P.indoor.floor : groundAt(P.pos.x, P.pos.z);
  if (P.air) {                                                     // zıplama: yer çekimi, yere değince iner
    P.vy -= 13 * dt; P.pos.y += P.vy * dt;
    if (P.pos.y <= gy && P.vy < 0) { P.pos.y = gy; P.vy = 0; P.air = false; }
  } else P.pos.y += (gy - P.pos.y) * Math.min(1, dt * 14);
  if (sp > 0.25 && !P.air && !(P.down > 0) && !P.seat) {
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
/* kahramanla konuşanlar */
const FAN = ['Pijamalı Çocuk! Bir imza verir misin?', 'Vay, gerçekten sen misin?', 'Çatılarda dikkat et evlat!', 'Oğlum senin pijamana bayılıyor!',
  'Sayende mahalle güvende, sağ ol.', 'O ağları nereden alıyorsun?', 'Annen biliyor mu bu saatte dışarıda olduğunu?', 'Dün otobüsü durdurdun, gördüm!'];
const HERO_HELLO = ['Selam! Her şey yolunda mı?', 'Merhaba, mahalle sakin mi?', 'Selam komşu!'];
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
  if (P.mode === 'hero') {                                         // kahraman: hırsızı ağla sar, yerdeyken konuş
    const p = P.pos.y < 1 && C.heroPlay.onFoot() ? nearestPerson() : null;
    if (C.heroPlay.thiefNear()) { prompt = { kind: 'web' }; text = 'E: Hırsızı ağla sar'; }
    else if (p) { prompt = { kind: 'talk', p }; text = 'E: Konuş'; }
  }
  else if (P.seat) { prompt = { kind: 'stand' }; text = 'E ya da WASD: Kalk'; }
  else if (!P.indoor && C.cats && (C.cats.held || C.cats.near(P.pos))) {          // kedi: sev, kucağa al, bırak
    prompt = { kind: 'cat', c: C.cats.held || C.cats.near(P.pos) };
    text = C.cats.held ? 'E: Sev · Q: Yere bırak' : 'E: Kediyi sev (' + C.cats.describe(prompt.c) + ') · Q: Kucağına al';
  }
  else if (P.indoor) {
    const p = nearestPerson();
    if (C.venues.exitNear()) { prompt = { kind: 'exit' }; text = 'E: Dışarı çık'; }
    else if (p) { prompt = { kind: 'talk', p }; text = 'E: Konuş'; }
  }
  else {
    const v = C.venues && C.venues.doorNear(P.pos);
    const p = nearestPerson();
    const seat = freeSeat();
    if (p && (!v || Math.hypot(p.x - P.pos.x, p.z - P.pos.z) < v.d)) { prompt = { kind: 'talk', p }; text = 'E: Konuş'; }
    else if (v) { prompt = { kind: 'door', v }; text = 'E: Gir · ' + v.name; }
    else if (seat) { prompt = { kind: 'sit', seat }; text = 'E: Banka otur'; }
  }
  const el = $('playPrompt'); if (el.textContent !== text) { el.textContent = text; el.hidden = !text; }
}
/* bank: 1,1 m içinde boş bir oturma yeri; kalkınca bankın önüne adım atar */
function freeSeat() {
  if (!C.benchSitters || P.air) return null;
  let best = null, bd = 1.1;
  for (const s of C.benchSitters) { if (s.on || s.player) continue; const d = Math.hypot(s.x - P.pos.x, s.z - P.pos.z); if (d < bd) { bd = d; best = s; } }
  return best;
}
function standUp() {
  const s = P.seat; if (!s) return; P.seat = null; s.player = false;
  const fx = Math.cos(s.ry), fz = -Math.sin(s.ry); P.pos.x = s.x + fx * 0.75; P.pos.z = s.z + fz * 0.75;
}
function act() {
  if (!prompt) return;
  if (prompt.kind === 'talk') {
    const p = prompt.p, hero = P.mode === 'hero', lines = P.indoor && p.talk ? p.talk : hero ? FAN : LINES; talkT = 1.4;
    if (P.indoor) p.talk_t = 5; else p.talk = 5.5;
    P.face = Math.atan2(-(pz(p) - P.pos.z), px(p) - P.pos.x);
    const hl = hero ? HERO_HELLO : HELLO;
    bubble(() => V(P.pos.x, P.pos.y + 2.1, P.pos.z), hl[(Math.random() * hl.length) | 0], 0, 2.2);
    bubble(() => V(px(p), B + 2.1 + (p.y || 0), pz(p)), lines[(Math.random() * lines.length) | 0], 0.8, 4.6);
  } else if (prompt.kind === 'cat') {
    const c = C.cats.pet(prompt.c);
    if (!C.cats.held) { P.petT = 2.6; P.vel.set(0, 0, 0); P.face = Math.atan2(-(c.z - P.pos.z), c.x - P.pos.x); }
    bubble(() => V(c.x, c.y + 0.7, c.z), 'Mırr… ♥', 0.3, 2.6);
  } else if (prompt.kind === 'sit') {
    const s = prompt.seat; s.player = true; s.on = false; P.seat = s;
    P.pos.set(s.x, C.SW, s.z); P.vel.set(0, 0, 0); P.face = s.ry; P.air = false;
  } else if (prompt.kind === 'stand') standUp();
  else if (prompt.kind === 'web') C.heroPlay.webThief();
  else if (prompt.kind === 'door') C.venues.enter(prompt.v);
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
P.say = bubble;                                                   // başka dosyalar da balon çıkarabilsin (kedi toplantısı)

/* ---------- girdi ---------- */
const el = C.renderer.domElement;
window.addEventListener('keydown', e => {
  if (!P.active) return;
  run = e.shiftKey;
  if (e.target.closest && e.target.closest('input, textarea, select')) return;
  if (MOVE[e.code]) { keys.add(e.code); e.preventDefault(); }
  else if (e.code === 'KeyE' && !e.repeat) { act(); e.preventDefault(); }
  else if (P.mode === 'hero') {                                     // kahraman: Space zıplama (basılı tut: yüksek), F ağ, Q ağla çekil
    if (e.code === 'Space') { e.preventDefault(); if (!e.repeat) C.heroPlay.jump(true); }
    else if (e.code === 'KeyF') { e.preventDefault(); if (!e.repeat) C.heroPlay.web(true); }
    else if (e.code === 'KeyQ') { e.preventDefault(); if (!e.repeat) C.heroPlay.zip(); }
  }
  else if (e.code === 'KeyQ' && !e.repeat && C.cats && !P.indoor) {           // kediyi kucağa al / bırak
    e.preventDefault();
    if (C.cats.held) C.cats.drop();
    else { const c = C.cats.near(P.pos); if (c) { C.cats.pick(c); bubble(() => V(c.x, c.y + 0.5, c.z), C.cats.meow(c), 0.2, 2); } }
  }
  else if (e.code === 'Space') { e.preventDefault(); if (P.seat) standUp(); else if (!P.air && !e.repeat && !(P.down > 0)) { P.air = true; P.vy = 4.8; } }
});
window.addEventListener('keyup', e => {
  run = e.shiftKey; keys.delete(e.code);
  if (P.active && P.mode === 'hero') { if (e.code === 'Space') C.heroPlay.jump(false); else if (e.code === 'KeyF') C.heroPlay.web(false); }
});
window.addEventListener('blur', () => keys.clear());
el.addEventListener('click', () => { if (P.active && document.pointerLockElement !== el) el.requestPointerLock(); });
/* kahraman: sol tık basılı ağla sallan, sağ tık ağla çekil (imleç kilitliyken) */
el.addEventListener('mousedown', e => {
  if (!P.active || P.mode !== 'hero' || document.pointerLockElement !== el) return;
  if (e.button === 0) C.heroPlay.web(true); else if (e.button === 2) C.heroPlay.zip();
});
window.addEventListener('mouseup', e => { if (P.active && P.mode === 'hero' && e.button === 0) C.heroPlay.web(false); });
el.addEventListener('contextmenu', e => { if (P.active) e.preventDefault(); });
document.addEventListener('pointerlockchange', setHud);
document.addEventListener('mousemove', e => {
  if (!P.active || document.pointerLockElement !== el) return;
  P.yaw -= e.movementX * 0.0026; P.pitch = C.clamp(P.pitch + e.movementY * 0.0022, -0.45, 1.25);
  if (e.movementX || e.movementY) P.mouseT = performance.now();
});
P.zoom = dy => { P.dist = C.clamp(P.dist * Math.exp(dy * 0.0012), 1.6, P.mode === 'hero' ? 20 : 12); };
const KEYS = {
  citizen: 'WASD: yürü · Shift: koş · Space: zıpla · Fare: bak · Tekerlek: yakınlaş · E: konuş / gir / kediyi sev · Q: kediyi kucağına al · Esc: imleci bırak',
  hero: 'WASD: koş · Shift: hızlı koş, duvarda yukarı koş · Space: zıpla (basılı tut: yüksek) · Sol tık / F basılı: ağla sallan · Sağ tık / Q: ağla çekil · Duvara koş: tırman · E: hırsızı ağla sar · Esc: imleci bırak'
};

let dockWasOpen = null;
function setHud() {
  const on = P.active || P.entering, hud = $('playHud'), btn = $('btnPlay'), dock = $('dock');
  /* oyunda kontrol paneli kapanır, çıkınca eski hâline döner */
  if (on && dockWasOpen === null) { dockWasOpen = !dock.classList.contains('collapsed'); dock.classList.add('collapsed'); $('dockToggle').setAttribute('aria-expanded', 'false'); }
  if (!on && dockWasOpen !== null) { if (dockWasOpen) { dock.classList.remove('collapsed'); $('dockToggle').setAttribute('aria-expanded', 'true'); } dockWasOpen = null; }
  hud.hidden = !on; document.body.classList.toggle('playing', on);
  if (btn) { btn.textContent = on ? 'Kuş bakışına dön' : 'Karakteri oyna'; btn.setAttribute('aria-pressed', on && P.mode === 'citizen'); }
  const hb = $('btnPlayHero'); if (hb) { hb.textContent = on ? 'Kuş bakışına dön' : 'Pijamalı Çocuk olarak oyna'; hb.setAttribute('aria-pressed', on && P.mode === 'hero'); }
  $('playKeys').textContent = KEYS[P.mode];
  $('xhair').hidden = !(P.active && P.mode === 'hero');
  if (!on) { $('heroTask').hidden = true; $('heroMsg').hidden = true; }
  $('playLock').hidden = !P.active || document.pointerLockElement === el;
  if (!on) $('playPrompt').hidden = true;
}
C.updaters.push((dt, t) => P.update(dt, t));
})();
