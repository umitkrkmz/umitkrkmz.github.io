/* ===== developer.js: şehirde yaşayan geliştirici; günün saatine göre başka yerde (PLAN). "Beni bul" kamerayı ona uçurur, el sallar, cebinden telefonu çıkarır.
   Telefonun içi bağımsız portfolyo sayfasıdır (portfolio/), burada çerçevenin içinde (iframe) açılır. ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene, B = C.SW, $ = id => document.getElementById(id);
const V = (x, y, z) => new THREE.Vector3(x, y, z);

/* ---------- görünüm: koyu kapüşonlu, kot, beyaz spor ayakkabı, sırtta laptop çantası ---------- */
const crowd = new C.Crowd(1), pp = {};
scene.add(crowd.group); C.peopleLayers.push(crowd.group);
crowd.look(0, { skin: '#e8b88f', shirt: '#23272e', pants: '#3a5680', shoes: '#ecebe6', hair: '#2a1d14', long: false });
const std = (hex, r) => new THREE.MeshStandardMaterial({ color: C.col(hex), roughness: r });
const bag = new THREE.Mesh(C.roundBox(0.13, 0.4, 0.32, 0.045).clone(), std('#38443a', 0.8)); bag.castShadow = true;
const hood = new THREE.Mesh(C.roundBox(0.12, 0.13, 0.3, 0.05).clone(), std('#23272e', 0.9)); hood.castShadow = true;
const phoneM = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.15, 0.074), std('#121418', 0.3));
const SCREEN = [C.col('#8fd3ff'), C.col('#ffb53d')], screenMat = new THREE.MeshBasicMaterial({ color: SCREEN[0].clone() });
const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.064, 0.136), screenMat); screen.rotation.y = Math.PI / 2; screen.position.x = 0.0065; phoneM.add(screen);
const extra = new THREE.Group(); extra.add(bag, hood, phoneM); scene.add(extra); C.peopleLayers.push(extra);

/* kafe masası, sandalye ve laptop (sabah kafede çalışırken) */
const cafe = new THREE.Group(); scene.add(cafe); C.peopleLayers.push(cafe); cafe.visible = false;
{ const wood = std('#8b6340', 0.7), metal = std('#2b2f33', 0.5), add = (g, m, x, y, z) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; cafe.add(o); return o; };
  add(new THREE.CylinderGeometry(0.36, 0.36, 0.03, 20), std('#e8e2d0', 0.6), 0, 0.74, 0); add(new THREE.CylinderGeometry(0.03, 0.03, 0.72, 8), metal, 0, 0.37, 0); add(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 12), metal, 0, 0.01, 0);
  add(new THREE.BoxGeometry(0.42, 0.04, 0.42), wood, -0.58, 0.45, 0); add(new THREE.BoxGeometry(0.04, 0.45, 0.42), wood, -0.79, 0.68, 0);
  for (const [x, z] of [[-0.4, -0.18], [-0.4, 0.18], [-0.76, -0.18], [-0.76, 0.18]]) add(new THREE.BoxGeometry(0.03, 0.45, 0.03), metal, x, 0.225, z);
  add(new THREE.BoxGeometry(0.24, 0.015, 0.33), std('#9aa0a6', 0.3), -0.08, 0.765, 0);                       // laptop
  const lid = add(new THREE.BoxGeometry(0.012, 0.22, 0.33), std('#9aa0a6', 0.3), 0.045, 0.875, 0); lid.rotation.z = 0.32;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.3), new THREE.MeshBasicMaterial({ color: C.col('#8fd3ff') })); scr.rotation.y = -Math.PI / 2; scr.position.x = -0.008; lid.add(scr);
  add(new THREE.CylinderGeometry(0.035, 0.03, 0.09, 12), std('#f4f1ea', 0.4), 0.16, 0.8, 0.2); }       // kahve

/* ---------- günlük program (Türkiye saati): her etkinliğin yeri ve hâli. Etkinlik değişince oraya geçer ---------- */
const H = 20.6;
const D = { bx: 0, bz: 0, f: 0.05, dir: 1, x: 0, z: 0, y: B, standY: B, face: 0, ph: 0, st: 'act', sub: 'walk', t: 8, step: '', wave: 0, act: '', seat: null };
C.developer = D;
const PLAN = [   // [başlangıç saati, etkinlik, açıklama]
  [1, 'home', 'Evde uyuyor'], [8, 'cafe', "Kızılay'da kafede çalışıyor"], [12, 'lunch', 'Öğle arası yürüyüşte'], [13.5, 'park', 'Parkta bankta oturuyor'],
  [18, 'gate', 'Stadyumun önünde maçı bekliyor'], [19, 'match', 'Ankara Stadı\'nda maç izliyor'], [20.75, 'stroll', 'Parka doğru yürüyor'], [21.5, 'cats', 'Kedi toplantısını izliyor']
];
const actAt = h => { let a = PLAN[PLAN.length - 1]; for (const p of PLAN) if (h >= p[0]) a = p; return h < 1 ? PLAN[PLAN.length - 1] : a; };
D.plan = PLAN; D.where = () => actAt(C.hour)[2];
function ring(f) {
  const side = Math.floor(f * 4) & 3, u = (f * 4) % 1, h = H;
  if (side === 0) return [D.bx - h + 2 * h * u, D.bz - h]; if (side === 1) return [D.bx + h, D.bz - h + 2 * h * u];
  if (side === 2) return [D.bx + h - 2 * h * u, D.bz + h]; return [D.bx - h, D.bz + h - 2 * h * u];
}
let placed = false;
const HOME = () => [C.blockC(C.MID + 1), C.blockC(C.MID)];   // meydanın doğusundaki blok: evi, kafesi, öğle yürüyüşü
const clubPark = () => { const c = C.cats && C.cats.club && C.cats.club(); if (c) return c; const p = (C.blocks || []).filter(b => b.kind === 'park').sort((a, b) => Math.hypot(a.bx, a.bz) - Math.hypot(b.bx, b.bz))[0]; return p ? { blk: p, x: p.bx, z: p.bz } : null; };
function freeSeat() { if (D.seat) { D.seat.dev = false; D.seat = null; } }
/* etkinliğe geç: yer, yön, duruş (oturuyorsa ayağa kalkınca basacağı yükseklik standY) */
function setAct(a) {
  D.act = a; freeSeat(); D.st = 'act'; D.sub = 'walk'; D.t = 6; D.y = D.standY = B;
  const [hx, hz] = HOME();
  if (a === 'lunch' || a === 'home') { D.bx = hx; D.bz = hz; [D.x, D.z] = ring(D.f); }
  else if (a === 'stroll') { const c = clubPark(), b = c ? c.blk : { bx: hx, bz: hz }; D.bx = b.bx; D.bz = b.bz; [D.x, D.z] = ring(D.f); }
  else if (a === 'cafe') { D.x = hx - H + 1.6; D.z = hz + 6; D.face = 0; cafe.position.set(D.x + 0.58, B, D.z); }   // meydana bakan kaldırımda, masaya doğru
  else if (a === 'park') {
    const c = clubPark(), b = c && c.blk, list = (C.benchSitters || []).filter(p => b && Math.abs(p.x - b.bx) < C.BLOCK / 2 && Math.abs(p.z - b.bz) < C.BLOCK / 2 && !p.player);
    const p = list.sort((u, v) => Math.hypot(u.x - b.bx, u.z - b.bz) - Math.hypot(v.x - b.bx, v.z - b.bz))[0];
    if (p) { D.seat = p; p.dev = true; p.on = false; D.x = p.x; D.z = p.z; D.face = p.ry; } else { D.x = hx; D.z = hz - H; }
  }
  else if (a === 'gate') { const L = C.landmarks && C.landmarks.find(l => l.type === 'stadium'); if (L) { D.x = L.bx + 3; D.z = L.bz - H; D.face = -Math.PI / 2; } }
  else if (a === 'match') { const s = C.match && C.match.seat; if (s) { D.x = s.x; D.y = s.y; D.standY = s.y + 0.42; D.z = s.z; D.face = s.ry; } }
  else if (a === 'cats') { const c = clubPark(); if (c) { D.x = c.x + 3.4; D.z = c.z + 1.2; D.face = Math.atan2(-(c.z - D.z), c.x - D.x); } }
}
function place() { [D.bx, D.bz] = HOME(); [D.x, D.z] = ring(D.f); placed = true; setAct(actAt(C.hour)[1]); }
const sits = () => /^(cafe|park|match)$/.test(D.act);

/* ---------- telefon (portfolyo) ---------- */
const phone = $('phone'), frame = $('phoneFrame'), btn = $('phoneBtn');
let open = false;
function openPhone() {
  if (open || !phone) return;
  open = true;
  if (!frame.getAttribute('src')) frame.setAttribute('src', 'portfolio/index.html?embed=1');   // dosya adıyla: file:// ile açınca da yüklensin
  if (document.pointerLockElement) document.exitPointerLock();
  phone.hidden = false; btn.hidden = true; document.body.classList.add('phone-open');
  setTimeout(() => phone.classList.add('open'), 20);          // önce görünür olsun, sonra kaysın
  setTimeout(() => { if (open) $('phoneClose').focus(); }, 60);
}
function closePhone() {
  if (!open) return;
  open = false; phone.classList.remove('open'); document.body.classList.remove('phone-open'); btn.hidden = false;
  if (frame.contentWindow) frame.contentWindow.postMessage({ type: 'phone-home' }, '*');   // bir dahaki açılışta ana ekran
  setFull(false);
  setTimeout(() => { if (!open) phone.hidden = true; }, 380);
  if (/^#(telefon|portfolyo)$/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);   // aynı bağlantı yeniden açabilsin
  if (D.st === 'meet') { D.st = 'act'; D.sub = 'stand'; D.t = 2.5; if (sits()) D.y = D.seatY; }   // telefonu cebine koyup işine döner
}
/* tam ekran: yalnızca elle, X'in yanındaki ⤢ düğmesiyle (GTA'daki internet sitesi gibi); kapanınca telefon boyuna döner */
function setFull(on) { phone.classList.toggle('full', on); const b = $('phoneFull'); if (b) { b.setAttribute('aria-pressed', on); b.textContent = on ? '⤡' : '⤢'; b.setAttribute('aria-label', on ? 'Telefon boyuna dön' : 'Tam ekran'); } }
C.phone = { open: openPhone, close: closePhone, full: setFull, get isOpen() { return open; } };
if (phone) {
  $('phoneClose').addEventListener('click', closePhone);
  btn.addEventListener('click', openPhone);
  /* telefon açıkken tuşlar şehre gitmez; Esc kapatır */
  window.addEventListener('keydown', e => { if (!open) return; if (e.code === 'Escape') closePhone(); e.stopImmediatePropagation(); }, true);
  window.addEventListener('message', e => {                      // yalnızca kendi telefonumuzdan
    if (e.source !== frame.contentWindow || !e.data) return;
    if (e.data.type === 'phone-close') closePhone();
  });
  $('phoneFull').addEventListener('click', () => setFull(!phone.classList.contains('full')));
  const fromHash = () => { if (/^#(telefon|portfolyo)$/.test(location.hash)) openPhone(); };
  window.addEventListener('hashchange', fromHash); setTimeout(fromHash, 400);
}

/* ---------- Beni bul: kamera önüne iner; el sallar, telefonu çıkarır ---------- */
const say = (text, delay, life) => { if (C.player && C.player.say) C.player.say(() => V(D.x, D.y + 2.15, D.z), text, delay, life); };
C.findDeveloper = function () {
  if (!placed) place();
  if (C.player && (C.player.active || C.player.entering)) { openPhone(); return; }   // oyundayken doğrudan telefon
  if (D.act !== actAt(C.hour)[1]) setAct(actAt(C.hour)[1]);
  const fx = Math.cos(D.face), fz = -Math.sin(D.face);
  D.seatY = D.y; D.y = D.standY;                                     // oturuyorsa ayağa kalkar
  let cam = V(D.x + fx * 3.3 - fz * 0.9, D.y + 1.75, D.z + fz * 3.3 + fx * 0.9), tgt = V(D.x, D.y + 1.4, D.z);
  if (D.act === 'home') {                                            // evde: kamera evin önüne, pencereye bakar
    const ox = Math.sign(D.x - D.bx) * (Math.abs(D.x - D.bx) > Math.abs(D.z - D.bz) ? 1 : 0), oz = Math.sign(D.z - D.bz) * (Math.abs(D.z - D.bz) >= Math.abs(D.x - D.bx) ? 1 : 0);
    cam = V(D.x + ox * 9, B + 3, D.z + oz * 9); tgt = V(D.x - ox * 2, B + 6, D.z - oz * 2);
  }
  D.st = 'meet'; D.step = 'fly'; D.t = 0; D.cam = cam;
  C.flyTo(cam, tgt, 2400);
};

/* ---------- her kare ---------- */
const PHRASE = ['Kod derleniyor… şaka, derleme yok.', 'Bu şehri ben yaptım, her taşını!', 'Kediler bu şehrin asıl sahibi.', 'Bir commit daha, sonra kahve.'];
const ACT_PHRASE = { cafe: ['Bir commit daha, sonra kahve.', 'Bu bug kahveyle çözülür.'], park: ['Güneşin tadını çıkarıyorum.', 'Ördekler bugün çok aktif.'], gate: ['Bilet cebimde, kapılar açılsın!'], cats: ['Reis yine kürsüde.', 'Şu sarman çok tatlı!'], match: ['Hadi be!', 'Ofsayt değil o!'] };
let timeT = 0, actT = 0, seatFace = 0;
const hp = new THREE.Vector3();
C.updaters.push((dt, t, Dist) => {
  if (!placed) { if (!C.blocks || !C.blocks.length) return; place(); }
  if (D.st === 'act' && (actT -= dt) <= 0) { actT = 2; const a = actAt(C.hour)[1]; if (a !== D.act || (a === 'match' && D.standY === B && C.match && C.match.seat)) setAct(a); }   // program saati; stadyum koltuğu sonradan hazır olabilir
  /* durum */
  let pose = 'stand', sp = 0;
  if (D.st === 'act' && sits()) {                                     // oturan etkinlikler: kafede laptop, bankta telefon, tribünde maç
    const M = C.match;
    pose = D.act === 'cafe' ? 'study' : D.act === 'match' && M && M.seat && M.cheer[M.seat.team] > 0 ? 'handsup' : 'sit';
    if ((D.t -= dt) <= 0) { D.t = 25 + Math.random() * 30; const l = ACT_PHRASE[D.act]; if (l && Math.random() < 0.3) say(l[(Math.random() * l.length) | 0], 0, 3); }
  } else if (D.st === 'act' && D.act === 'home') { pose = 'stand'; }
  else if (D.st === 'act' && (D.act === 'gate' || D.act === 'cats')) {   // ayakta bekler; kedileri izlerken arada fotoğraf çeker
    pose = Math.sin(t * 0.25) > 0.2 ? 'phone' : 'stand';
    if ((D.t -= dt) <= 0) { D.t = 25 + Math.random() * 30; const l = ACT_PHRASE[D.act]; if (l && Math.random() < 0.35) say(l[(Math.random() * l.length) | 0], 0, 3); }
  } else if (D.st === 'act' && D.sub === 'walk') {
    sp = 1.35; D.f = (D.f + D.dir * sp * dt / (8 * H) + 1) % 1;
    const [x, z] = ring(D.f); if (Math.hypot(x - D.x, z - D.z) > 1e-4) D.face = Math.atan2(-(z - D.z), x - D.x); D.x = x; D.z = z;
    D.ph += sp * dt * 3.4; pose = 'walk';
    if ((D.t -= dt) <= 0) { const r = Math.random(); D.sub = r < 0.5 ? 'look' : 'stand'; D.t = r < 0.5 ? 5 + Math.random() * 4 : 2 + Math.random() * 2; if (r < 0.15) say(PHRASE[(Math.random() * PHRASE.length) | 0], 0, 3); }
  } else if (D.st === 'act') {
    pose = D.sub === 'look' ? 'phone' : 'stand';
    if ((D.t -= dt) <= 0) { D.sub = 'walk'; D.t = 8 + Math.random() * 10; if (Math.random() < 0.25) D.dir = -D.dir; }
  } else if (D.st === 'meet') {
    const c = D.cam || C.camera.position;
    if (D.act !== 'home') D.face = Math.atan2(-(c.z - D.z), c.x - D.x);
    if (D.act === 'home') { pose = 'stand'; if (D.step === 'fly' && !C.flying()) { D.step = 'phone'; D.t = 0; if (C.player && C.player.say) C.player.say(() => V(D.x, B + 8, D.z), 'Zzz… Uyuyorum ama telefonum açık 📱', 0.1, 3.2); } else if (D.step === 'phone' && (D.t += dt) > 2.2 && !open) { D.step = 'shown'; openPhone(); } }
    else if (D.step === 'fly') { pose = 'stand'; if (!C.flying()) { D.step = 'wave'; D.t = 0; say('Selam! Portfolyom telefonumda 📱', 0.1, 2.6); } }
    else if (D.step === 'wave') { pose = 'wave'; if ((D.t += dt) > 1.5) { D.step = 'phone'; D.t = 0; } }
    else { pose = 'phone'; if ((D.t += dt) > 0.7 && !open && D.step === 'phone') { D.step = 'shown'; openPhone(); } }
  }
  cafe.visible = D.act === 'cafe' && Dist <= 130;
  /* telefon çerçevesindeki saat: şehrin saati */
  if ((timeT -= dt) <= 0 && phone) { timeT = 1; const h = Math.floor(C.hour), m = Math.floor((C.hour % 1) * 60); $('phoneTime').textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'); }
  const home = D.act === 'home' && D.st === 'act';                   // evdeyken sokakta görünmez
  crowd.group.visible = extra.visible = !home && Dist <= 130;
  if (Dist > 130 || home) return;
  const ps = C.pose(pose, pose === 'walk' ? D.ph : t, pp);
  crowd.set(0, D.x, D.y, D.z, D.face, ps); crowd.commit();
  /* çanta, kapüşon, telefon: köke göre; otururken çanta yanında yerde, kapüşon görünmez */
  const fx = Math.cos(D.face), fz = -Math.sin(D.face), rx = -fz, rz = fx, bob = pose === 'walk' ? Math.abs(Math.sin(D.ph)) * 0.025 : 0;
  const seated = /^(sit|study|handsup)$/.test(pose) && D.st === 'act' && sits();
  if (seated) { bag.position.set(D.x + rx * 0.5 + fx * 0.15, D.standY + 0.2, D.z + rz * 0.5 + fz * 0.15); bag.rotation.set(0, D.face + 0.3, 0); }
  else bag.position.set(D.x - fx * 0.2, D.y + 1.12 + bob, D.z - fz * 0.2), bag.rotation.set(0, D.face, 0);
  hood.visible = !seated; hood.position.set(D.x - fx * 0.12, D.y + 1.5 + bob, D.z - fz * 0.12); hood.rotation.set(0, D.face, 0);
  const inHand = pose === 'phone' || (seated && D.act === 'park');     // bankta telefonu elinde
  phoneM.visible = inHand;
  if (inHand) {
    C.handOf(D.x, D.y, D.z, D.face, ps, 1, hp);                         // sağ el
    phoneM.position.copy(hp).addScaledVector(V(fx, 0, fz), 0.04); phoneM.rotation.set(0, D.face + Math.PI, seated ? -1.0 : -0.5);
  }
  screenMat.color.copy(SCREEN[open ? 1 : 0]);
});
})();
