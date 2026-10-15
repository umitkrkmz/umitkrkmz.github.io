/* ===== developer.js: şehirde dolaşan geliştirici; "Beni bul" kamerayı ona uçurur, el sallar, cebinden telefonu çıkarır.
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

/* ---------- dolaşma: meydanın doğusundaki bloğun kaldırımında ---------- */
const H = 20.6;
const D = { bx: 0, bz: 0, f: 0.05, dir: 1, x: 0, z: 0, y: B, face: 0, ph: 0, st: 'walk', t: 8, step: '', wave: 0 };
C.developer = D;
function ring(f) {
  const side = Math.floor(f * 4) & 3, u = (f * 4) % 1, h = H;
  if (side === 0) return [D.bx - h + 2 * h * u, D.bz - h]; if (side === 1) return [D.bx + h, D.bz - h + 2 * h * u];
  if (side === 2) return [D.bx + h - 2 * h * u, D.bz + h]; return [D.bx - h, D.bz + h - 2 * h * u];
}
let placed = false;
function place() { D.bx = C.blockC(C.MID + 1); D.bz = C.blockC(C.MID); [D.x, D.z] = ring(D.f); placed = true; }

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
  if (D.st === 'meet') { D.st = 'stand'; D.t = 2.5; }         // telefonu cebine koyup yürümeye döner
}
/* tam ekran: uygulama açılınca telefon büyür (GTA'daki internet sitesi gibi), ana ekranda telefon boyu; düğmeyle elle de */
function setFull(on) { phone.classList.toggle('full', on); const b = $('phoneFull'); if (b) { b.setAttribute('aria-pressed', on); b.textContent = on ? '⤡' : '⤢'; b.setAttribute('aria-label', on ? 'Telefon boyuna dön' : 'Tam ekran'); } }
C.phone = { open: openPhone, close: closePhone, full: setFull, get isOpen() { return open; } };
if (phone) {
  $('phoneClose').addEventListener('click', closePhone);
  btn.addEventListener('click', openPhone);
  /* telefon açıkken tuşlar şehre gitmez; Esc kapatır */
  window.addEventListener('keydown', e => { if (!open) return; if (e.code === 'Escape') closePhone(); e.stopImmediatePropagation(); }, true);
  window.addEventListener('message', e => {                      // yalnızca kendi telefonumuzdan
    if (e.source !== frame.contentWindow || !e.data) return;
    if (e.data.type === 'phone-close') closePhone(); else if (e.data.type === 'phone-mode') setFull(!!e.data.full);
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
  const fx = Math.cos(D.face), fz = -Math.sin(D.face);
  const cam = V(D.x + fx * 3.3 - fz * 0.9, D.y + 1.75, D.z + fz * 3.3 + fx * 0.9), tgt = V(D.x, D.y + 1.4, D.z);
  D.st = 'meet'; D.step = 'fly'; D.t = 0; D.cam = cam;
  C.flyTo(cam, tgt, 2400);
};

/* ---------- her kare ---------- */
const PHRASE = ['Kod derleniyor… şaka, derleme yok.', 'Bu şehri ben yaptım, her taşını!', 'Kediler bu şehrin asıl sahibi.', 'Bir commit daha, sonra kahve.'];
let timeT = 0;
C.updaters.push((dt, t, Dist) => {
  if (!placed) { if (!C.blocks || !C.blocks.length) return; place(); }
  /* durum */
  let pose = 'stand', sp = 0;
  if (D.st === 'walk') {
    sp = 1.35; D.f = (D.f + D.dir * sp * dt / (8 * H) + 1) % 1;
    const [x, z] = ring(D.f); if (Math.hypot(x - D.x, z - D.z) > 1e-4) D.face = Math.atan2(-(z - D.z), x - D.x); D.x = x; D.z = z;
    D.ph += sp * dt * 3.4; pose = 'walk';
    if ((D.t -= dt) <= 0) { const r = Math.random(); D.st = r < 0.5 ? 'look' : 'stand'; D.t = r < 0.5 ? 5 + Math.random() * 4 : 2 + Math.random() * 2; if (r < 0.15) say(PHRASE[(Math.random() * PHRASE.length) | 0], 0, 3); }
  } else if (D.st === 'look' || D.st === 'stand') {
    pose = D.st === 'look' ? 'phone' : 'stand';
    if ((D.t -= dt) <= 0) { D.st = 'walk'; D.t = 8 + Math.random() * 10; if (Math.random() < 0.25) D.dir = -D.dir; }
  } else if (D.st === 'meet') {
    const c = D.cam || C.camera.position;
    D.face = Math.atan2(-(c.z - D.z), c.x - D.x);
    if (D.step === 'fly') { pose = 'stand'; if (!C.flying()) { D.step = 'wave'; D.t = 0; say('Selam! Portfolyom telefonumda 📱', 0.1, 2.6); } }
    else if (D.step === 'wave') { pose = 'wave'; if ((D.t += dt) > 1.5) { D.step = 'phone'; D.t = 0; } }
    else { pose = 'phone'; if ((D.t += dt) > 0.7 && !open && D.step === 'phone') { D.step = 'shown'; openPhone(); } }
  }
  /* telefon çerçevesindeki saat: şehrin saati */
  if ((timeT -= dt) <= 0 && phone) { timeT = 1; const h = Math.floor(C.hour), m = Math.floor((C.hour % 1) * 60); $('phoneTime').textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'); }
  if (Dist > 130) return;
  const ps = C.pose(pose, pose === 'walk' ? D.ph : t, pp);
  crowd.set(0, D.x, D.y, D.z, D.face, ps); crowd.commit();
  /* çanta, kapüşon, telefon: köke göre */
  const fx = Math.cos(D.face), fz = -Math.sin(D.face), rx = -fz, rz = fx, bob = pose === 'walk' ? Math.abs(Math.sin(D.ph)) * 0.025 : 0;
  bag.position.set(D.x - fx * 0.2, D.y + 1.12 + bob, D.z - fz * 0.2); bag.rotation.set(0, D.face, 0);
  hood.position.set(D.x - fx * 0.12, D.y + 1.5 + bob, D.z - fz * 0.12); hood.rotation.set(0, D.face, 0);
  const inHand = pose === 'phone';
  phoneM.visible = inHand;
  if (inHand) { phoneM.position.set(D.x + fx * 0.3 - rx * 0.1, D.y + 1.3, D.z + fz * 0.3 - rz * 0.1); phoneM.rotation.set(0, D.face + Math.PI, -0.5); }
  screenMat.color.copy(SCREEN[open ? 1 : 0]);
});
})();
