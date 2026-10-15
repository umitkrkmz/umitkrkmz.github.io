/* ===== venues.js: girilebilir mekânlar: çay ocağı, kafe, simitçi, fırın, market, eczane, kuaför, kebapçı, çiçekçi, tamirci; karakol, hastane, itfaiye.
   İçeride al, öde, otur, iç, ye: cüzdan (C.player.money), elde taşınan şey (C.player.hold), market sepeti (C.player.basket). ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene, B = C.SW;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const unit = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
const cylU = new THREE.CylinderGeometry(1, 1, 1, 16).translate(0, 0.5, 0);
const torU = new THREE.TorusGeometry(1, 0.36, 8, 20).rotateX(Math.PI / 2);     // yatık simit
const sphU = new THREE.SphereGeometry(1, 12, 8);
const glow = { value: 0.3 };
C.nightListeners.push(n => { glow.value = 0.3 + n * 0.25; });       // iç mekan hep aydınlık, gece biraz daha
function litMat(extra) {
  const m = new THREE.MeshStandardMaterial(Object.assign({ color: 0xffffff, roughness: 0.8 }, extra));
  m.onBeforeCompile = sh => {
    sh.uniforms.uGlow = glow;
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uGlow;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += diffuseColor.rgb * uGlow;');
  };
  m.customProgramCacheKey = () => 'venue' + (extra && extra.map ? 'm' : '');
  return m;
}
const boxMat = litMat(), shinyMat = litMat({ roughness: 0.25, metalness: 0.35 });
const glassMat = new THREE.MeshStandardMaterial({ color: C.col('#bcd6e4'), roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.22, depthWrite: false });
const lampMat = new THREE.MeshBasicMaterial({ color: C.col('#fff6df') });
const pick = (r, a) => a[(r() * a.length) | 0];

/* ---------- dokular: zemin (ahşap, karo, dama, mozaik, beton) ve tabelalar ---------- */
const texCache = {};
function canvasTex(key, w, h, draw) {
  if (texCache[key]) return texCache[key];
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(cv); t.encoding = THREE.sRGBEncoding; t.anisotropy = C.maxAniso; t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return (texCache[key] = t);
}
const FLOOR = {
  wood: x => { for (let i = 0; i < 8; i++) { x.fillStyle = ['#a8805a', '#9c744f', '#b08a62', '#94704c'][i % 4]; x.fillRect(0, i * 32, 256, 32); x.fillStyle = 'rgba(0,0,0,.18)'; x.fillRect(0, i * 32, 256, 2); x.fillRect(((i * 97) % 200) + 20, i * 32, 2, 32); } },
  tile: x => { x.fillStyle = '#e6e2d8'; x.fillRect(0, 0, 256, 256); x.fillStyle = '#c9c4b8'; for (let i = 0; i <= 4; i++) { x.fillRect(i * 64 - 1, 0, 3, 256); x.fillRect(0, i * 64 - 1, 256, 3); } },
  checker: x => { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { x.fillStyle = (i + j) % 2 ? '#1f2328' : '#e9e6df'; x.fillRect(i * 64, j * 64, 64, 64); } },
  terrazzo: x => { x.fillStyle = '#cfd3d6'; x.fillRect(0, 0, 256, 256); const r = C.rng(5); for (let i = 0; i < 900; i++) { x.fillStyle = pick(r, ['#9aa1a6', '#b9bec2', '#7f878d', '#e9ecee']); x.fillRect(r() * 256, r() * 256, 2 + r() * 4, 2 + r() * 3); } },
  concrete: x => { x.fillStyle = '#9a9a95'; x.fillRect(0, 0, 256, 256); const r = C.rng(9); for (let i = 0; i < 500; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '0,0,0' : '255,255,255'},.06)`; x.fillRect(r() * 256, r() * 256, 8, 8); } x.fillStyle = 'rgba(0,0,0,.15)'; x.fillRect(127, 0, 2, 256); x.fillRect(0, 127, 256, 2); }
};
const floorMat = {};
const floorOf = type => floorMat[type] || (floorMat[type] = litMat({ map: canvasTex('f' + type, 256, 256, FLOOR[type]) }));
/* tabela: satırlar; renkler (zemin, yazı, vurgu) */
function signTex(lines, bg, fg, accent, w, h) {
  return canvasTex('s' + lines.join('|') + bg + fg + w + 'x' + h, w, h, (x) => {
    x.fillStyle = bg; x.fillRect(0, 0, w, h);
    x.textAlign = 'center'; x.textBaseline = 'middle';
    const n = lines.length, lh = h / (n + 0.6);
    lines.forEach((l, i) => {
      const head = i === 0 && n > 1;
      x.fillStyle = head ? (accent || fg) : fg;
      let size = Math.floor(lh * (head ? 0.78 : 0.6)); const f = s => `800 ${s}px "Big Shoulders Display","Arial Narrow",sans-serif`;
      x.font = f(size); while (x.measureText(l).width > w - 30 && size > 10) x.font = f(size -= 2);
      x.fillText(l, w / 2, lh * (i + 0.8));
    });
  });
}
const flagTex = () => canvasTex('flag', 300, 200, x => {           // ay yıldız
  x.fillStyle = '#e30a17'; x.fillRect(0, 0, 300, 200);
  x.fillStyle = '#fff'; x.beginPath(); x.arc(112, 100, 50, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#e30a17'; x.beginPath(); x.arc(125, 100, 40, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#fff'; x.beginPath();
  for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, r = i % 2 ? 9 : 22; x.lineTo(185 + Math.cos(a) * r, 100 + Math.sin(a) * r); }
  x.fill();
});
const posterTex = (title, lines, bg) => canvasTex('p' + title + lines.join(''), 200, 260, x => {
  x.fillStyle = bg || '#f4efe1'; x.fillRect(0, 0, 200, 260);
  x.fillStyle = '#16212b'; x.textAlign = 'center'; x.font = '800 34px "Big Shoulders Display","Arial Narrow",sans-serif'; x.fillText(title, 100, 40);
  x.fillStyle = '#55636e'; x.fillRect(45, 58, 110, 110);
  x.fillStyle = '#16212b'; x.beginPath(); x.arc(100, 98, 24, 0, Math.PI * 2); x.fill(); x.fillRect(66, 124, 68, 44);
  x.font = '600 15px "IBM Plex Sans",sans-serif'; lines.forEach((l, i) => x.fillText(l, 100, 196 + i * 20));
});

/* ---------- mekan türleri ve sözleri ---------- */
const KIND = { 'ÇAY OCAĞI': 'cafe', 'KAFE': 'cafe', 'ANKARA SİMİDİ': 'cafe', 'FIRIN': 'bakery', 'ECZANE': 'pharmacy', 'OPTİK': 'pharmacy',
  'MARKET': 'market', 'KIRTASİYE': 'market', 'KUAFÖR': 'barber', 'KEBAP': 'kebab', 'ÇİÇEKÇİ': 'florist', 'TAMİRCİ': 'repair' };
const TALK = {
  cafe: ['Hoş geldiniz! Çay mı kahve mi?', 'Simitler taze, çay demli.', 'Bugün tatlı yok, kusura bakmayın.'],
  customer: ['Burası şehrin en iyi çayı.', 'Gazeteyi okuyordum, maç berabere bitmiş.', 'Bir çay daha söylesene!', 'Hesabı ben ödüyorum.'],
  bakery: ['Ekmekler fırından yeni çıktı!', 'Poğaça da var, sıcak sıcak.', 'Yarım ekmek mi, tam mı?'],
  pharmacy: ['Reçeteniz var mı?', 'Günde iki kez, tok karnına.', 'Geçmiş olsun.'],
  market: ['Kasa burada, buyurun.', 'Domates bugün çok taze.', 'Poşet ister misiniz?'],
  shopper: ['Süt nerede acaba?', 'İndirim reyonu bitmiş yine.', 'Ekmek almayı unutmayayım.'],
  barber: ['Sıra sizde, oturun.', 'Yanlardan biraz alalım mı?', 'Dünya kupasını izlediniz mi?'],
  kebab: ['Acılı mı olsun?', 'Bir porsiyon iskender geliyor!', 'Ayran da yanına iyi gider.'],
  florist: ['Lale mi gül mü?', 'Hediye paketi yapayım mı?', 'Saksı çiçekleri de var.'],
  repair: ['Yarın gelin, hazır olur.', 'Bunun parçası yok, sipariş edeceğiz.', 'Eski ama sağlam alet bu.'],
  police: ['Kayıp eşya mı bildireceksiniz?', 'Şikâyetinizi yazalım.', 'Şehir güvende, merak etmeyin.'],
  inmate: ['Ben bir şey yapmadım!', 'Avukatımı istiyorum!', 'Pijamalı bir çocuk beni ağına sardı…'],
  hospital: ['Acil servise hoş geldiniz.', 'Sıra numaranızı alın lütfen.', 'Doktor birazdan sizi çağıracak.'],
  patient: ['Bir saattir bekliyorum…', 'Sadece biraz başım ağrıyor.', 'Geçmiş olsun bana da.'],
  fire: ['Alarm çalarsa iki dakikada çıkarız!', 'Hortumları yeni kontrol ettik.', 'Yangın tüpünüz var mı evde?']
};
const STAFF = {
  cafe: { shirt: '#f2f2ee', pants: '#2d3b55' }, bakery: { shirt: '#f2f2ee', pants: '#2d3b55' }, pharmacy: { shirt: '#f7f7f4', pants: '#3a3a3a', long: true },
  market: { shirt: '#e2452b', pants: '#2b2f36' }, barber: { shirt: '#222b33', pants: '#1f2a3a' }, kebab: { shirt: '#f2f2ee', pants: '#2d3b55' },
  police: { shirt: '#1f4e8c', pants: '#1f2a3a', shoes: '#1b1b1d' }, nurse: { shirt: '#7fb7a8', pants: '#7fb7a8', shoes: '#e8e8e4' }, doctor: { shirt: '#f7f7f4', pants: '#f7f7f4', shoes: '#e8e8e4' },
  fire: { shirt: '#2a2e33', pants: '#2a2e33', shoes: '#1b1b1d' }
};

/* ---------- kurulum araçları (yerel çerçeve: x kapı boyunca, z içeri, y yukarı; kapı z=0; yön 0: +x'e bakar) ---------- */
function Kit(seed) { this.r = C.rng(seed); this.boxes = []; this.cyls = []; this.tors = []; this.sphs = []; this.people = []; this.cols = []; this.extra = []; this.spots = []; this.seats = []; }
const K = Kit.prototype;
K.box = function (x, y, z, sx, sy, sz, col, solid, shiny) { this.boxes.push([x, y, z, sx, sy, sz, col, shiny]); if (solid) this.cols.push([x, z, sx / 2, sz / 2]); };
K.cyl = function (x, y, z, r, h, col, solid, shiny) { this.cyls.push([x, y, z, r, h, col, shiny]); if (solid) this.cols.push([x, z, r, r]); };
K.tor = function (x, y, z, R, col) { this.tors.push([x, y, z, R, col]); };
K.sph = function (x, y, z, r, col, sy) { this.sphs.push([x, y, z, r, col, sy || 1]); };
K.sign = function (x, y, z, w, h, ry, tex) { this.extra.push(['sign', x, y, z, w, h, ry, tex]); };
K.spot = function (x, z, label, act, r) { this.spots.push({ x, z, r: r || 1.15, label, act }); };
K.man = function (x, z, ry, pose, talk, look, y) { const p = { x, z, ry, pose, talk, look: look || C.randomLook(this.r), y: y || 0, ph: this.r() * 10, t: 0 }; this.people.push(p); return p; };
K.staff = function (x, z, ry, pose, talk, kind) { const s = STAFF[kind] || {}; return this.man(x, z, ry, pose, talk, Object.assign(C.randomLook(this.r), s)); };
const dirX = a => Math.cos(a), dirZ = a => -Math.sin(a);
const TO_DOOR = Math.PI / 2, TO_BACK = -Math.PI / 2;               // yön: kapıya doğru (-z), içeri doğru (+z)
/* sandalye: oturan face yönüne bakar; sırtlık arkada; sitter: 'npc' | 'free' */
K.chair = function (x, z, face, col, sitter, talk) {
  col = col || '#7a5a3a'; const fx = dirX(face), fz = dirZ(face);
  this.box(x, 0.43, z, 0.44, 0.05, 0.44, col);
  for (const [a, b] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) this.box(x + a * 0.19, 0, z + b * 0.19, 0.04, 0.43, 0.04, '#2b2f33');
  this.box(x - fx * 0.2, 0.48, z - fz * 0.2, Math.abs(fx) > 0.5 ? 0.04 : 0.44, 0.48, Math.abs(fx) > 0.5 ? 0.44 : 0.04, col);
  this.cols.push([x, z, 0.24, 0.24]);
  const seat = { x, z, face, npc: null };
  if (sitter === 'npc' || (sitter !== 'free' && this.r() < 0.6)) seat.npc = this.man(x - fx * 0.04, z - fz * 0.04, face, 'drink', talk || TALK.customer);
  this.seats.push(seat); return seat;
};
K.stool = function (x, z, col) { this.cyl(x, 0, z, 0.03, 0.62, '#2b2f33'); this.cyl(x, 0.62, z, 0.18, 0.05, col || '#b3402e'); };
K.table = function (x, z, w, d, col, round) {
  col = col || '#8b6340'; (this.tables = this.tables || []).push({ x, z, w, d: round ? w : d });
  if (round) { this.cyl(x, 0.72, z, w / 2, 0.04, col); this.cyl(x, 0, z, 0.04, 0.72, '#2b2f33'); this.cyl(x, 0, z, 0.22, 0.03, '#2b2f33'); this.cols.push([x, z, w / 2, w / 2]); return; }
  this.box(x, 0.72, z, w, 0.05, d, col);
  for (const [a, b] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) this.box(x + a * (w / 2 - 0.06), 0, z + b * (d / 2 - 0.06), 0.05, 0.72, 0.05, '#2b2f33');
  this.cols.push([x, z, w / 2, d / 2]);
};
K.counter = function (x, z, w, d, col, top) {
  this.box(x, 0.06, z, w, 0.9, d, col, true); this.box(x, 0, z, w - 0.06, 0.06, d - 0.06, '#1f2328');
  this.box(x, 0.96, z, w + 0.08, 0.05, d + 0.08, top || '#2a2e33', false, true);
};
K.shelf = function (x, z, w, d, h, items, facing) {                 // raf: dikmeler, rafta ürün (kutu, şişe, kavanoz)
  const alongX = w >= d;
  for (const s of [-1, 1]) this.box(alongX ? x + s * (w / 2 - 0.02) : x, 0, alongX ? z : z + s * (d / 2 - 0.02), alongX ? 0.04 : w, h, alongX ? d : 0.04, '#6b4a30');   // uç dikmeleri: rafın kısa kenarı kadar
  this.box(x, 0, z, w, 0.08, d, '#5a3e28');
  this.cols.push([x, z, w / 2, d / 2]);
  const f = facing || 0;                                                 // arka pano yalnızca duvar rafında (ada rafı iki yandan açık)
  if (f && alongX) this.box(x, 0, z + f * (d / 2 - 0.01), w, h, 0.02, '#7a5a3a');
  else if (f) this.box(x + f * (w / 2 - 0.01), 0, z, 0.02, h, d, '#7a5a3a');
  for (let y = 0.42; y < h - 0.05; y += 0.42) {
    this.box(x, y, z, w, 0.03, d, '#8b6340');
    if (!items) continue;
    const len = alongX ? w : d;
    for (let u = -len / 2 + 0.16; u < len / 2 - 0.1; u += 0.2 + this.r() * 0.08) {
      if (this.r() > 0.88) continue;
      const px = alongX ? x + u : x, pz = alongX ? z : z + u, c = pick(this.r, items), k = this.r();
      if (k < 0.35) this.cyl(px, y + 0.03, pz, 0.045, 0.2 + this.r() * 0.08, c);          // şişe, kutu içecek
      else if (k < 0.55) this.cyl(px, y + 0.03, pz, 0.06, 0.11, c);                        // kavanoz
      else this.box(px, y + 0.03, pz, alongX ? 0.14 : 0.2, 0.18 + this.r() * 0.12, alongX ? 0.2 : 0.14, c);
    }
  }
};
K.plant = function (x, z, big) { const s = big ? 1.4 : 1; this.cyl(x, 0, z, 0.16 * s, 0.32 * s, '#b5653a'); this.sph(x, 0.32 * s + 0.24 * s, z, 0.3 * s, '#3b7a3a', 1.2); this.sph(x + 0.12, 0.32 * s + 0.4 * s, z - 0.08, 0.2 * s, '#4f8f45'); this.cols.push([x, z, 0.18 * s, 0.18 * s]); };
K.tea = function (x, y, z) { this.cyl(x, y, z, 0.045, 0.008, '#f2f2ee'); this.cyl(x, y + 0.008, z, 0.022, 0.075, '#b5541c'); };
K.samovar = function (x, y, z) { this.cyl(x, y, z, 0.13, 0.2, '#c9ccd0', false, true); this.cyl(x, y + 0.2, z, 0.09, 0.15, '#c9ccd0', false, true); this.cyl(x, y + 0.35, z, 0.025, 0.03, '#2b2f33'); };
K.register = function (x, y, z, face) { this.box(x, y, z, 0.36, 0.12, 0.3, '#2a2e33'); this.box(x - dirX(face) * 0.08, y + 0.12, z - dirZ(face) * 0.08, 0.28, 0.18, 0.04, '#1e3a5f'); };
K.monitor = function (x, y, z, face) {
  const fx = dirX(face), fz = dirZ(face), side = Math.abs(fx) > 0.5;
  this.box(x, y, z, 0.12, 0.02, 0.12, '#2b2f33'); this.box(x, y + 0.02, z, 0.03, 0.14, 0.03, '#2b2f33');
  this.box(x - fx * 0.02, y + 0.14, z - fz * 0.02, side ? 0.03 : 0.52, 0.32, side ? 0.52 : 0.03, '#1b1f24');
  this.box(x + fx * 0.002, y + 0.16, z + fz * 0.002, side ? 0.032 : 0.46, 0.27, side ? 0.46 : 0.032, '#3f7fbf');
  this.box(x + fx * 0.25, y, z + fz * 0.25, side ? 0.16 : 0.42, 0.02, side ? 0.42 : 0.16, '#2b2f33');   // klavye
};

/* duvarlar, süpürgelik, tavan, ışıklar ve vitrinli ön duvar */
function shell(k, W, D, H, floor, wallCol, opt) {
  opt = opt || {}; k.H = H;
  k.extra.push(['floor', W + 0.3, D + 0.3, floor]);
  if (!opt.noCeiling) k.box(0, H, D / 2, W + 0.3, 0.12, D + 0.3, '#f4f1ea');
  k.box(0, 0, D + 0.07, W + 0.3, H, 0.14, wallCol);
  for (const s of [-1, 1]) k.box(s * (W / 2 + 0.07), 0, D / 2, 0.14, H, D, wallCol);
  const base = opt.base || '#3a3330';                                     // süpürgelik ve lambri
  k.box(0, 0, D - 0.005, W, 0.12, 0.02, base); for (const s of [-1, 1]) k.box(s * (W / 2 - 0.005), 0, D / 2, 0.02, 0.12, D, base);
  if (opt.wains) { k.box(0, 0, D - 0.01, W, 1.0, 0.02, opt.wains); for (const s of [-1, 1]) k.box(s * (W / 2 - 0.01), 0, D / 2, 0.02, 1.0, D, opt.wains); }
  const dw = opt.door || 1.6, side = (W - dw) / 2;
  for (const s of [-1, 1]) {
    const cx = s * (dw / 2 + side / 2);
    if (opt.window === false) k.box(cx, 0, 0.2, side, H, 0.14, wallCol);
    else { k.box(cx, 0, 0.2, side, 0.9, 0.14, wallCol); k.box(cx, 2.6, 0.2, side, H - 2.6, 0.14, wallCol); k.extra.push(['glass', cx, 1.75, 0.2, side, 1.7]); }
  }
  k.box(0, 2.4, 0.2, dw, H - 2.4, 0.14, wallCol);
  k.box(0, 0, 0.75, 1.2, 0.015, 0.7, '#3b3f44');                          // paspas
  if (!opt.noLamps) for (let x = -W / 2 + 2; x <= W / 2 - 1.5; x += 3.2) for (let z = 1.8; z < D - 0.8; z += 3.2) { k.extra.push(['lamp', x, H - 0.06, z]); k.cyl(x, H - 0.5, z, 0.008, 0.44, '#2b2f33'); k.cyl(x, H - 0.62, z, 0.2, 0.12, '#2b2f33'); }
}
const backSign = (k, W, D, w, h, y, tex) => k.sign(0, y, D - 0.01, w, h, Math.PI, tex);         // arka duvar, kapıya bakar

/* ---------- alışveriş: cüzdan, elde tutulan, sepet ---------- */
const P = () => C.player;
const tl = n => n + ' ₺';
function sayAt(p, text) { if (!cur || !P().say) return; const w = C.venues.toWorld(p.x, p.z, { x: 0, z: 0 }); P().say(() => V(w.x, B + 2.05, w.z), text, 0, 2.8); }
function sayMe(text) { const pl = P(); if (pl.say) pl.say(() => V(pl.pos.x, pl.pos.y + 2.15, pl.pos.z), text, 0, 2.6); }
function buy(seller, item, name, price, line) {
  const pl = P();
  if (pl.money >= price) { pl.money -= price; sayMe(`${name} alındı · ${tl(pl.money)} kaldı`); }
  else sayMe(`${name}: bu seferlik bizden!`);
  pl.hold = { kind: item, t: 0 };
  if (seller) { seller.talk_t = 3; sayAt(seller, line || 'Afiyet olsun!'); }
}
const EDIBLE = { tea: 'Çay', coffee: 'Kahve', simit: 'Simit', pogaca: 'Poğaça', durum: 'Dürüm', ayran: 'Ayran', cake: 'Kek' };
const holdName = () => P().hold && EDIBLE[P().hold.kind];
/* boş sandalyeye otur: oyuncu bankta oturur gibi (P.seat) */
function seatSpots(k) {
  for (const s of k.seats) {
    if (s.npc) continue;
    k.spot(s.x + dirX(s.face) * 0.55, s.z + dirZ(s.face) * 0.55, () => holdName() ? `E: Otur, ${holdName().toLocaleLowerCase('tr')} keyfi` : 'E: Otur', () => {
      const w = C.venues.toWorld(s.x, s.z, { x: 0, z: 0 }); const pl = P();
      const seat = { x: w.x, z: w.z, ry: s.face + cur.g.rotation.y, player: true };
      pl.seat = seat; pl.pos.set(w.x, cur.floor, w.z); pl.vel.set(0, 0, 0); pl.face = seat.ry;
    }, 0.9);
  }
}

/* ---------- yerleşimler ---------- */
const MENU = {
  'ÇAY OCAĞI': [['tea', 'Çay', 10, 'Demli mi açık mı? Buyrun.'], ['simit', 'Simit', 15, 'Simit de sıcak!'], ['coffee', 'Türk kahvesi', 35, 'Orta şekerli geliyor.']],
  'KAFE': [['coffee', 'Kahve', 45, 'Bir latte, afiyet olsun.'], ['tea', 'Çay', 15, 'Buyrun çayınız.'], ['cake', 'Kek', 40, 'Ev yapımı!']],
  'ANKARA SİMİDİ': [['simit', 'Simit', 15, 'Fırından yeni çıktı!'], ['tea', 'Çay', 10, 'Simitin yanına çay şart.'], ['pogaca', 'Poğaça', 15, 'Peynirli, sıcak.']]
};
const LAYOUT = {
  cafe(k, W, D, name) {
    const menu = MENU[name] || MENU['ÇAY OCAĞI'], simitci = name === 'ANKARA SİMİDİ', kafe = name === 'KAFE';
    shell(k, W, D, 3.1, kafe ? 'wood' : 'tile', kafe ? '#e9dcc6' : '#efe4d2', { wains: kafe ? '#7a5a3a' : '#b5653a' });
    const cz = D - 1.15;
    k.counter(0, cz, W - 2.4, 0.7, kafe ? '#4a3527' : '#6b4a30', '#2a2e33');
    k.samovar(-W / 2 + 1.7, 1.01, cz); k.register(W / 2 - 1.6, 1.01, cz, TO_BACK);
    if (simitci || !kafe) for (let i = 0; i < 6; i++) k.tor(-0.4 + (i % 3) * 0.22, 1.03 + Math.floor(i / 3) * 0.06, cz - 0.1 + Math.floor(i / 3) * 0.12, 0.08, '#b9742f');   // tezgâhta simitler
    if (kafe) { k.box(0.6, 1.01, cz, 0.36, 0.42, 0.3, '#2b2f33', false, true); k.cyl(0.95, 1.01, cz, 0.05, 0.1, '#f2f2ee'); }
    for (let i = 0; i < 6; i++) k.tea(-W / 2 + 1.3 + i * 0.12, 1.01, cz + 0.22);
    k.shelf(0, D - 0.2, W - 2.6, 0.28, 2.3, kafe ? ['#7a5a3a', '#f2f2ee', '#c9853f'] : ['#d4a73c', '#f2f2ee', '#3b9a57', '#b5541c'], 1);
    backSign(k, W, D, 2.4, 0.9, 2.15, signTex([name, ...menu.map(m => `${m[1]} ${tl(m[2])}`)], '#16212b', '#f2efe1', '#ffb53d', 512, 200));
    const barista = k.staff(0.3, D - 0.55, TO_DOOR, 'stand', TALK.cafe, 'cafe');
    menu.forEach((m, i) => k.spot(-1.4 + i * 1.4, cz - 0.75, () => `E: ${m[1]} al · ${tl(m[2])}`, () => buy(barista, m[0], m[1], m[2], m[3]), 0.9));
    /* masalar: biri boş kalır, oyuncu oturabilsin */
    const n = W > 6 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const x = -W / 2 + 1.5 + i * ((W - 3) / Math.max(1, n - 1)), z = 2.4 + (i % 2) * 0.5;
      k.table(x, z, 0.75, 0.75, kafe ? '#d9c9a8' : '#e8e2d0', kafe);
      const free = i === n - 1;
      for (const s of [-1, 1]) { k.chair(x + s * 0.72, z, s > 0 ? Math.PI : 0, kafe ? '#4a3527' : '#7a5a3a', free ? 'free' : null); if (!free) k.tea(x + s * 0.18, 0.77, z); }
    }
    k.plant(W / 2 - 0.5, 1.2); if (W > 6) k.plant(-W / 2 + 0.5, 1.2);
    seatSpots(k);
  },
  bakery(k, W, D) {
    shell(k, W, D, 3.1, 'tile', '#f2e6cf', { wains: '#c9853f' });
    const cz = D * 0.48;
    k.counter(0, cz, W - 2.2, 0.75, '#e9e2d4', '#cfe3ee');
    k.box(0, 1.01, cz, W - 2.3, 0.4, 0.6, '#d8ecf4', false, true);               // cam vitrin
    for (let x = -W / 2 + 1.5; x < W / 2 - 1.2; x += 0.42) { k.box(x, 1.03, cz - 0.1, 0.32, 0.1, 0.16, pick(k.r, ['#c9853f', '#b5702f', '#d9a35c'])); k.tor(x, 1.05, cz + 0.14, 0.07, '#b9742f'); }
    k.shelf(0, D - 0.3, W - 1.2, 0.5, 2.2, ['#c9853f', '#b5702f', '#d9a35c', '#a8622a'], 1);
    k.box(W / 2 - 1.0, 0, D - 0.9, 1.2, 1.6, 0.9, '#5b4a3a', true); k.box(W / 2 - 1.0, 0.5, D - 1.36, 0.8, 0.5, 0.02, '#e86a1c');   // fırın, ağzında ateş
    backSign(k, W, D, 2.2, 0.8, 2.25, signTex(['FIRIN', 'Ekmek 10 ₺', 'Poğaça 15 ₺', 'Simit 15 ₺'], '#5b3a22', '#f7ecd8', '#ffb53d', 512, 190));
    const baker = k.staff(0.4, cz + 0.85, TO_DOOR, 'stand', TALK.bakery, 'bakery');
    k.spot(-1.2, cz - 0.8, () => 'E: Ekmek al · 10 ₺', () => buy(baker, 'bread', 'Ekmek', 10, 'Sıcak sıcak, buyurun.'), 0.9);
    k.spot(0.2, cz - 0.8, () => 'E: Poğaça al · 15 ₺', () => buy(baker, 'pogaca', 'Poğaça', 15, 'Peynirli, afiyet olsun.'), 0.9);
    k.spot(1.5, cz - 0.8, () => 'E: Simit al · 15 ₺', () => buy(baker, 'simit', 'Simit', 15, 'Susamlı, taze!'), 0.9);
    k.man(-W / 2 + 1.0, cz - 1.0, TO_BACK + 0.4, 'stand', TALK.customer);        // kapıdan uzakta, tezgâha bakar
  },
  pharmacy(k, W, D, name) {
    shell(k, W, D, 3.1, 'terrazzo', '#f4f6f6', { wains: '#3b9a57' });
    const cz = D * 0.52;
    k.counter(0, cz, W - 2.4, 0.6, '#f2f2ee', '#3b9a57');
    k.register(-0.8, 1.01, cz, TO_BACK);
    k.shelf(0, D - 0.3, W - 1.0, 0.42, 2.4, ['#f2f2ee', '#e2452b', '#2f7bff', '#3b9a57', '#d8e6f2'], 1);
    for (const s of [-1, 1]) k.shelf(s * (W / 2 - 0.3), D * 0.32, 0.42, D * 0.42, 1.8, ['#f2f2ee', '#e2452b', '#2f7bff', '#d8e6f2'], s);
    backSign(k, W, D, 1.6, 0.5, 2.55, signTex([name === 'OPTİK' ? 'OPTİK' : 'ECZANE'], '#3b9a57', '#ffffff', null, 400, 120));
    const ph = k.staff(-0.3, cz + 0.75, TO_DOOR, 'stand', TALK.pharmacy, 'pharmacy');
    if (name === 'OPTİK') k.spot(0.4, cz - 0.7, () => 'E: Güneş gözlüğü al · 150 ₺', () => buy(ph, 'glasses', 'Güneş gözlüğü', 150, 'Size çok yakıştı!'), 0.9);
    else k.spot(0.4, cz - 0.7, () => 'E: Vitamin al · 80 ₺', () => buy(ph, 'medicine', 'Vitamin', 80, 'Günde bir tane, tok karnına.'), 0.9);
    k.man(W / 2 - 1.1, cz - 0.9, TO_BACK + 0.3, 'stand', TALK.patient);
  },
  market(k, W, D, name) {
    shell(k, W, D, 3.2, 'tile', '#eef0ee', { wains: '#e2452b' });
    const ITEMS = name === 'KIRTASİYE'
      ? [['Defter', 30, '#2f7bff'], ['Kalem', 10, '#e2452b'], ['Silgi', 5, '#f2f2ee'], ['Boya kalemi', 45, '#f2c230'], ['Ajanda', 60, '#3b7a57'], ['Cetvel', 8, '#d29a2d']]
      : [['Ekmek', 10, '#c9853f'], ['Süt', 25, '#f2f2ee'], ['Peynir', 90, '#f2e6a6'], ['Domates', 30, '#e2452b'], ['Elma', 20, '#3b9a57'], ['Makarna', 18, '#f2c230'], ['Çay', 60, '#b5541c'], ['Su', 5, '#8fd3ff'], ['Bisküvi', 15, '#d29a2d'], ['Yumurta', 45, '#f4efe1']];
    let i = 0;
    for (let x = -W / 2 + 1.7; x < W / 2 - 1.9; x += 1.9) {
      k.shelf(x, D * 0.6, 0.55, D * 0.52, 1.7, ['#e2452b', '#f2c230', '#2f7bff', '#3b9a57', '#f2f2ee', '#c96bb0', '#ff8a3d'], 0);
      for (const s of [-1, 1]) {
        const it = ITEMS[i++ % ITEMS.length];
        k.spot(x + s * 0.65, D * 0.6, () => `E: Sepete ekle · ${it[0]} ${tl(it[1])}` + (P().basket && P().basket.length ? ` (sepette ${P().basket.length})` : ''), () => {
          const pl = P(); pl.basket = pl.basket || []; pl.basket.push(it); pl.hold = { kind: 'basket', t: 0 }; sayMe(`${it[0]} sepette · ${pl.basket.length} ürün`);
        }, 0.75);
      }
    }
    if (name !== 'KIRTASİYE') { k.box(-W / 2 + 0.45, 0, D - 1.3, 0.7, 1.9, 1.6, '#d8e6f2', true, true); for (let y = 0.3; y < 1.8; y += 0.32) for (let z = D - 1.95; z < D - 0.7; z += 0.18) k.cyl(-W / 2 + 0.75, y, z, 0.04, 0.22, pick(k.r, ['#e2452b', '#2f7bff', '#3b9a57', '#f2c230'])); }   // içecek dolabı
    /* kasa */
    const kx = W / 2 - 1.2, kz = 1.6;
    k.counter(kx, kz, 0.7, 1.7, '#3b4046', '#2a2e33'); k.register(kx, 1.01, kz - 0.4, 0); k.box(kx, 1.01, kz + 0.35, 0.5, 0.02, 0.6, '#1f2328');
    k.box(kx - 0.75, 0, kz + 0.4, 0.4, 0.5, 0.3, '#c62828'); for (let j = 0; j < 3; j++) k.box(kx - 0.75, 0.5 + j * 0.06, kz + 0.4, 0.4, 0.05, 0.3, '#c62828');   // sepet yığını
    backSign(k, W, D, 2.4, 0.6, 2.5, signTex([name === 'KIRTASİYE' ? 'KIRTASİYE' : 'MARKET · TAZE ÜRÜN'], '#c62828', '#ffffff', null, 512, 120));
    const cashier = k.staff(kx + 0.55, kz, Math.PI, 'stand', TALK.market, 'market');
    k.spot(kx - 0.75, kz - 0.2, () => {
      const b = P().basket || []; const sum = b.reduce((s, it) => s + it[1], 0);
      return b.length ? `E: Kasada öde · ${b.length} ürün · ${tl(sum)}` : 'Kasa: önce raflardan sepete ürün ekle';
    }, () => {
      const pl = P(), b = pl.basket || []; if (!b.length) { cashier.talk_t = 2; sayAt(cashier, 'Sepetiniz boş görünüyor.'); return; }
      const sum = b.reduce((s, it) => s + it[1], 0);
      cashier.talk_t = 3; sayAt(cashier, 'Poşet ister misiniz? Güle güle kullanın!');
      if (pl.money >= sum) { pl.money -= sum; sayMe(`Ödendi: ${tl(sum)} · ${tl(pl.money)} kaldı`); } else sayMe('Para yetmedi, kasiyer "sonra getirirsin" dedi.');
      pl.basket = []; pl.hold = { kind: 'bag', t: 0 };
    }, 1.0);
    k.man(-W / 2 + 2.6, D * 0.6 + 0.4, k.r() * 6, 'stand', TALK.shopper);
  },
  barber(k, W, D) {
    shell(k, W, D, 3.1, 'checker', '#e9e2d4', { wains: '#2a2e33' });
    const z = D - 1.5;
    for (let i = 0; i < 2; i++) {
      const x = -W / 4 + i * W / 2;
      k.box(x, 1.0, D - 0.06, 1.1, 1.3, 0.03, '#cfd8de', false, true);                 // ayna
      k.box(x, 0.8, D - 0.25, 1.2, 0.05, 0.35, '#2a2e33');
      k.cyl(x, 0, z, 0.22, 0.12, '#2b2f33', false, true); k.cyl(x, 0.12, z, 0.05, 0.3, '#c9ccd0', false, true);   // berber koltuğu
      k.box(x, 0.42, z, 0.62, 0.12, 0.6, '#8a2d2d'); k.box(x, 0.54, z - 0.28, 0.62, 0.65, 0.1, '#8a2d2d');   // sırtlık kapı tarafında, müşteri aynaya bakar
      k.cols.push([x, z, 0.33, 0.33]);
      const seat = { x, z, face: TO_BACK, npc: null }; k.seats.push(seat);
      k.staff(x + 0.55, z - 0.35, Math.PI, 'cook', TALK.barber, 'barber');            // berber yanda, müşteriye döner
      if (i === 0) seat.npc = k.man(x, z + 0.05, TO_BACK, 'sit', TALK.customer);
      else seat.npc = true, k.spot(x, z - 0.8, () => 'E: Tıraş ol · 150 ₺', () => {
        const pl = P(), w = C.venues.toWorld(x, z, { x: 0, z: 0 });
        if (pl.money >= 150) pl.money -= 150;
        pl.seat = { x: w.x, z: w.z, ry: TO_BACK + cur.g.rotation.y, player: true }; pl.pos.set(w.x, cur.floor, w.z); pl.face = pl.seat.ry;
        cur.cut = 9; sayMe('Yanlardan biraz alalım…');
      }, 0.9);
    }
    k.cyl(W / 2 - 0.25, 1.2, 0.5, 0.08, 0.9, '#e2452b');                                   // berber direği
    for (let z = 1.3; z < D - 2.6; z += 0.6) k.chair(-W / 2 + 0.45, z, 0, '#3d5a80', k.r() < 0.4 ? 'npc' : 'free', TALK.customer);   // bekleme: sol duvar boyunca
    seatSpots(k);
  },
  kebab(k, W, D) {
    shell(k, W, D, 3.1, 'checker', '#efe4d2', { wains: '#8a3b3b' });
    const cz = D - 1.0;
    k.counter(0, cz, W - 2.0, 0.7, '#8a3b3b', '#c9ccd0');
    k.cyl(-1.2, 1.01, cz + 0.05, 0.04, 0.9, '#8d939a'); k.cyl(-1.2, 1.15, cz + 0.05, 0.16, 0.6, '#8a5a2b');   // döner
    k.box(-1.2, 1.0, cz + 0.32, 0.6, 1.0, 0.05, '#c9372c');
    backSign(k, W, D, 2.2, 0.8, 2.2, signTex(['KEBAP', 'Dürüm 120 ₺', 'İskender 220 ₺', 'Ayran 20 ₺'], '#8a3b3b', '#f7ecd8', '#ffd23f', 512, 190));
    const usta = k.staff(-0.4, D - 0.4, TO_DOOR, 'cook', TALK.kebab, 'kebab');
    k.spot(-0.6, cz - 0.75, () => 'E: Dürüm al · 120 ₺', () => buy(usta, 'durum', 'Dürüm', 120, 'Acılı, bol soğanlı!'), 0.9);
    k.spot(0.9, cz - 0.75, () => 'E: Ayran al · 20 ₺', () => buy(usta, 'ayran', 'Ayran', 20, 'Köpüklü, buz gibi.'), 0.9);
    for (let i = 0; i < 2; i++) { const x = -W / 4 + i * W / 2; k.table(x, 2.2, 1.1, 0.75); for (const s of [-1, 1]) k.chair(x, 2.2 + s * 0.68, s > 0 ? Math.PI / 2 : -Math.PI / 2, '#5a3e28', i === 1 ? 'free' : null); }
    seatSpots(k);
  },
  florist(k, W, D) {
    shell(k, W, D, 3.1, 'wood', '#eef3ea', { wains: '#5b6e4a' });
    const F = ['#e2452b', '#f2c230', '#ffffff', '#c96bb0', '#ff8a3d', '#8a5ac9'];
    const pot = (x, z) => { k.cyl(x, 0, z, 0.2, 0.36, '#5b6e4a'); for (let j = 0; j < 5; j++) k.sph(x + (k.r() - 0.5) * 0.25, 0.5 + k.r() * 0.2, z + (k.r() - 0.5) * 0.25, 0.08, pick(k.r, F)); k.cols.push([x, z, 0.22, 0.22]); };
    for (let x = -W / 2 + 0.6; x < W / 2 - 0.5; x += 0.7) pot(x, D - 0.5);           // arka duvar
    for (const s of [-1, 1]) for (let z = 1.6; z < D - 1.3; z += 0.75) pot(s * (W / 2 - 0.45), z);   // yan duvarlar
    k.counter(0, D * 0.55, 2.2, 0.7, '#8b6340', '#e8e2d0');
    const fl = k.staff(0, D * 0.55 + 0.8, TO_DOOR, 'stand', TALK.florist, 'cafe');
    k.spot(-0.5, D * 0.55 - 0.75, () => 'E: Buket al · 120 ₺', () => buy(fl, 'flowers', 'Buket', 120, 'Kime gidiyor bu güzel buket?'), 0.9);
  },
  repair(k, W, D) {
    shell(k, W, D, 3.1, 'concrete', '#d8d4c8', { wains: '#5b4a3a' });
    k.counter(0, D - 0.85, W - 1.6, 0.85, '#5b4a3a', '#3b3f44');
    for (let x = -W / 2 + 1.2; x < W / 2 - 1; x += 0.8) k.box(x, 1.01, D - 0.85, 0.5, 0.25 + k.r() * 0.3, 0.38, pick(k.r, ['#2a2e33', '#8d939a', '#3b4046', '#c9a227']));
    k.chair(0.6, D - 1.55, TO_BACK, '#3b4046', 'free');
    const usta = k.man(0.6, D - 1.59, TO_BACK, 'study', TALK.repair, Object.assign(C.randomLook(k.r), { shirt: '#2f6f8f', hair: '#a8a29a' }));
    k.seats[k.seats.length - 1].npc = usta;
    k.shelf(-W / 2 + 0.3, D * 0.4, 0.42, D * 0.6, 2.2, ['#2a2e33', '#8d939a', '#c9a227'], -1);
    k.spot(0.6, D - 2.6, () => 'E: Telefonu tamire bırak', () => { usta.talk_t = 3; sayAt(usta, 'Ekranı değişecek. Yarın gelin, hazır olur.'); }, 1.0);
  },
  police(k, W, D) {
    shell(k, W, D, 3.2, 'terrazzo', '#e4e8ec', { wains: '#24364d', window: false });
    /* danışma */
    k.counter(0, 2.7, 3.4, 0.8, '#24364d', '#d8dde2');
    k.monitor(-0.8, 1.01, 2.85, -Math.PI / 2); k.monitor(0.8, 1.01, 2.85, -Math.PI / 2);
    k.sign(0, 0.62, 2.28, 1.4, 0.32, Math.PI, signTex(['DANIŞMA'], '#1f4e8c', '#ffffff', null, 400, 90));   // tezgâhın önünde, kapıya bakar
    const off = k.staff(0, 3.45, TO_DOOR, 'stand', TALK.police, 'police');
    k.spot(0, 1.85, () => 'E: Şikâyet bildir', () => { off.talk_t = 3.5; sayAt(off, pick(Math.random, ['Tutanağı aldım, inceleyeceğiz.', 'Bir kedinin pencerenize bakması suç değil efendim.', 'Komşunun müziği mi? Bir uyarıda bulunuruz.', 'Pijamalı Çocuk mu? O bizden değil ama yardımı çok.'])); }, 1.0);
    /* bayrak, ilanlar */
    k.cyl(-W / 2 + 0.5, 0, D - 0.5, 0.025, 2.6, '#c9ccd0', false, true); k.sign(-W / 2 + 0.92, 2.1, D - 0.5, 0.8, 0.54, Math.PI / 2, flagTex());
    k.box(W / 2 - 0.02, 1.0, D * 0.42, 0.03, 1.1, 1.6, '#8b6340');                                                // pano
    k.sign(W / 2 - 0.04, 1.55, D * 0.42 - 0.4, 0.5, 0.66, -Math.PI / 2, posterTex('ARANIYOR', ['Sırt çantalı şüpheli', 'Ödül: 5.000 ₺']));
    k.sign(W / 2 - 0.04, 1.55, D * 0.42 + 0.4, 0.5, 0.66, -Math.PI / 2, posterTex('KAYIP KEDİ', ['Sarman, turuncu tekir', 'Bulan: 155'], '#fff4d6'));
    k.spot(W / 2 - 0.8, D * 0.42, () => 'E: İlanlara bak', () => sayMe('"KAYIP: Sarman. Turuncu tekir, tasması yok, çok sever." Şehirde bir sarman görmüştüm…'), 1.0);
    /* bekleme */
    for (let x = -W / 2 + 0.9; x < -2.2; x += 0.55) k.chair(x, 0.95, -Math.PI / 2, '#3d5a80', x < -W / 2 + 1.5 ? 'npc' : 'free', TALK.patient);
    k.cyl(-W / 2 + 0.4, 0, 2.2, 0.15, 1.0, '#d8e6f2'); k.cyl(-W / 2 + 0.4, 1.0, 2.2, 0.13, 0.35, '#8fd3ff');      // su sebili
    /* masalar */
    for (const x of [-W / 4 - 0.4, W / 4 - 1.2]) {
      k.table(x, D * 0.62, 1.5, 0.8, '#e8e2d0'); k.monitor(x - 0.3, 0.77, D * 0.62 - 0.12, TO_BACK);
      k.box(x + 0.4, 0.77, D * 0.62, 0.3, 0.04, 0.22, '#f4f1ea'); k.box(x + 0.42, 0.81, D * 0.62, 0.3, 0.04, 0.22, '#f4f1ea');   // evrak
      const s = k.chair(x, D * 0.62 + 0.65, TO_DOOR, '#2a2e33', 'free');
      s.npc = k.staff(x, D * 0.62 + 0.69, TO_DOOR, 'study', TALK.police, 'police');
    }
    for (let j = 0; j < 3; j++) { k.box(-W / 2 + 0.35, 0, D * 0.45 + j * 0.55, 0.5, 1.3, 0.5, '#8d939a', true); for (let y = 0.25; y < 1.3; y += 0.32) k.box(-W / 2 + 0.6, y, D * 0.45 + j * 0.55, 0.02, 0.04, 0.2, '#3b3f44'); }   // dosya dolapları
    k.plant(W / 2 - 0.5, 1.0, true);
    /* nezarethane */
    const cx = W / 2 - 1.8, cz = D - 1.6;
    for (let x = cx - 1.5; x <= cx + 1.5; x += 0.22) k.cyl(x, 0, cz - 1.4, 0.025, 3.0, '#3b4046', false, true);
    k.box(cx, 1.0, cz - 1.4, 3.1, 0.06, 0.06, '#3b4046'); k.box(cx, 2.0, cz - 1.4, 3.1, 0.06, 0.06, '#3b4046');
    k.cols.push([cx, cz - 1.4, 1.6, 0.1]);
    k.box(cx, 0, cz + 0.6, 2.6, 0.45, 0.7, '#8d939a', true);
    k.man(cx + 0.4, cz - 0.6, TO_DOOR, 'stand', TALK.inmate, Object.assign(C.randomLook(k.r), { shirt: '#22262b', pants: '#22262b' }));
  },
  hospital(k, W, D) {
    shell(k, W, D, 3.2, 'terrazzo', '#f4f7f8', { wains: '#8fc1d8' });
    k.counter(-W / 4, 2.4, 3.0, 0.8, '#f2f2ee', '#c62828'); k.monitor(-W / 4 - 0.6, 1.01, 2.55, -Math.PI / 2);
    k.sign(-W / 4, 0.62, 1.98, 1.2, 0.3, Math.PI, signTex(['ACİL · KAYIT'], '#c62828', '#ffffff', null, 400, 90));
    const nurse = k.staff(-W / 4, 3.15, TO_DOOR, 'stand', TALK.hospital, 'doctor');
    let no = 40 + ((Math.random() * 20) | 0);
    k.spot(-W / 4, 1.55, () => 'E: Sıra numarası al', () => { no++; nurse.talk_t = 3; sayAt(nurse, `Sıra numaranız A-${no}. Bekleme salonunda oturabilirsiniz.`); }, 1.0);
    for (let x = 1.6; x < W / 2 - 0.6; x += 0.55) k.chair(x, 1.2, TO_BACK, '#2f7bff', k.r() < 0.5 ? 'npc' : 'free', TALK.patient);   // kapı koridorunun yanında
    const bx = W / 4, bz = D - 1.6;
    k.box(bx, 0, bz, 1.0, 0.65, 2.0, '#d8e6f2', true); k.box(bx, 0.65, bz + 0.7, 0.9, 0.12, 0.4, '#ffffff');
    k.box(bx - 0.9, 0, bz, 0.04, 2.2, 2.4, '#8fc1d8');
    k.cyl(bx + 0.75, 0, bz + 0.6, 0.02, 1.8, '#c9ccd0', false, true); k.box(bx + 0.75, 1.6, bz + 0.6, 0.2, 0.3, 0.06, '#d8f0ff');   // serum askısı
    k.man(bx, bz - 0.85, Math.PI / 2, 'lie', TALK.patient, null, 0.75);
    k.staff(bx + 0.9, bz - 0.4, Math.PI, 'stand', TALK.hospital, 'nurse');
    seatSpots(k);
  },
  fire(k, W, D) {
    shell(k, W, D, 5.4, 'concrete', '#cfc8bc', { door: 3.4, window: false });
    k.box(-3, 0, D * 0.55, 2.4, 2.4, 7.6, '#c62828', true); k.box(-3, 2.4, D * 0.55 - 0.6, 0.9, 0.2, 6.0, '#a7adb3');
    k.box(-3, 0.3, D * 0.55, 2.42, 0.25, 7.62, '#f2f2ee');
    for (let x = 2; x < W / 2 - 0.5; x += 0.9) { k.box(x, 0, D - 0.45, 0.7, 2.0, 0.55, '#c9a227', true); k.box(x, 1.4, D - 0.72, 0.4, 0.4, 0.02, '#2a2e33'); }   // dolaplar ve kasklar
    k.box(4, 0, 3, 0.12, 5.4, 0.12, '#c9ccd0', true);
    backSign(k, W, D, 2.4, 0.7, 3.6, signTex(['İTFAİYE · 112'], '#c62828', '#ffffff', null, 512, 120));
    for (let i = 0; i < 3; i++) k.staff(1.5 + i * 1.2, D * 0.5, k.r() * 6, i === 1 ? 'talk' : 'stand', TALK.fire, 'fire');
  }
};
/* önemli yapıların kapıları (blok merkezine göre): dış kapı noktası, iç mekan ön duvarı, ölçüler */
const LANDMARK_DOOR = {
  hospital: { door: [-9, 14.3], anchor: [-9, 9.9], W: 12, D: 8.4, name: 'ACİL' },
  police: { door: [0, 5.6], anchor: [0, 1.9], W: 12, D: 10, name: 'KARAKOL' },
  fire: { door: [0, 4.8], anchor: [0, 3.9], W: 16, D: 13, name: 'İTFAİYE' }
};

/* ---------- kapılar: oyuncuya en yakın kapı ---------- */
function doors() {
  const out = [];
  for (let i = C.shopDoors.length - 1; i >= 0; i--) {
    const d = C.shopDoors[i];
    if (!d.g.parent) { C.shopDoors.splice(i, 1); continue; }                   // bina yıkıldı
    out.push({ name: d.name, kind: KIND[d.name] || 'market', x: d.x + d.nx * 0.8, z: d.z + d.nz * 0.8, ax: d.x - d.nx * 0.02, az: d.z - d.nz * 0.02, nx: -d.nx, nz: -d.nz, W: d.two ? Math.min(7, d.len * 0.4) : Math.min(8, d.len - 2), D: 6.5, seed: (d.x * 13 + d.z * 7) | 0 });
  }
  for (const L of C.landmarks) {
    const m = LANDMARK_DOOR[L.type]; if (!m) continue;
    out.push({ L, name: m.name, kind: L.type, x: L.bx + m.door[0], z: L.bz + m.door[1], ax: L.bx + m.anchor[0], az: L.bz + m.anchor[1], nx: 0, nz: -1, W: m.W, D: m.D, seed: L.type.length * 101 });
  }
  return out;
}

/* ---------- elde taşınanlar: elin yerinde çizilir (people.js C.handOf) ---------- */
const std = (hex, r, m) => new THREE.MeshStandardMaterial({ color: C.col(hex), roughness: r === undefined ? 0.7 : r, metalness: m || 0 });
function holdMesh(kind) {
  const g = new THREE.Group(), add = (geo, mat, x, y, z, sx, sy, sz) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.castShadow = true; g.add(m); return m; };
  const eat = (m, how) => { m.userData.eat = how; m.userData.s0 = m.scale.clone(); return m; };
  if (kind === 'tea') {                                                  // ince belli bardak: cam, içinde çay
    eat(add(cylU, std('#a5400f', 0.2), 0, -0.042, 0, 0.021, 0.068, 0.021), 'y');
    add(cylU, new THREE.MeshStandardMaterial({ color: C.col('#dfe9ee'), roughness: 0.05, transparent: true, opacity: 0.35, depthWrite: false }), 0, -0.045, 0, 0.026, 0.082, 0.026);
    add(cylU, std('#f2f2ee'), 0, -0.05, 0, 0.045, 0.008, 0.045);
  }
  else if (kind === 'coffee' || kind === 'ayran') { add(cylU, std('#f4f1ea', 0.4), 0, -0.05, 0, 0.035, 0.09, 0.035); eat(add(cylU, std(kind === 'ayran' ? '#fbfaf5' : '#3b2416'), 0, -0.045, 0, 0.031, 0.083, 0.031), 'y'); }
  else if (kind === 'simit') eat(add(torU, std('#b9742f'), 0, 0, 0, 0.085, 0.085, 0.085), 'all');
  else if (kind === 'pogaca' || kind === 'cake') eat(add(sphU, std(kind === 'cake' ? '#7a4a2a' : '#d9a35c'), 0, 0, 0, 0.07, 0.045, 0.07), 'all');
  else if (kind === 'bread') add(sphU, std('#c9853f'), 0, 0, 0, 0.16, 0.06, 0.06);
  else if (kind === 'durum') eat(add(cylU, std('#e8d2a6'), 0, -0.08, 0, 0.04, 0.17, 0.04), 'all');
  else if (kind === 'medicine' || kind === 'glasses') add(unit, std(kind === 'glasses' ? '#2a2e33' : '#f2f2ee'), 0, -0.03, 0, 0.12, 0.06, 0.06);
  else if (kind === 'flowers') { add(cylU, std('#3b7a3a'), 0, -0.2, 0, 0.03, 0.32, 0.03); for (let i = 0; i < 6; i++) add(sphU, std(['#e2452b', '#f2c230', '#ffffff', '#c96bb0'][i % 4]), Math.cos(i) * 0.05, 0.13 + (i % 2) * 0.03, Math.sin(i) * 0.05, 0.045, 0.045, 0.045); }
  else if (kind === 'basket') { add(unit, std('#c62828', 0.5), 0, -0.3, 0, 0.36, 0.2, 0.24); add(unit, std('#c62828', 0.5), 0, -0.12, 0, 0.02, 0.18, 0.2); }
  else if (kind === 'bag') { add(unit, std('#f4f4f0', 0.9), 0, -0.36, 0, 0.3, 0.32, 0.14); add(unit, std('#f4f4f0', 0.9), 0, -0.08, 0, 0.02, 0.12, 0.1); }
  return g;
}
let held = null, heldKind = '';
const hp = new THREE.Vector3();
const DRINKABLE = { tea: 1, coffee: 1, ayran: 1 };

/* ---------- arayüz ---------- */
let cur = null;
C.venues = {
  doorNear(p) {
    let best = null, bd = 1.9;
    for (const v of doors()) { const d = Math.hypot(v.x - p.x, v.z - p.z); if (d < bd) { bd = d; best = v; } }
    if (best) best.d = bd;
    return best;
  },
  enter(v) {
    this.leave(true);
    const k = new Kit(v.seed), W = v.W, D = v.D;
    LAYOUT[v.kind](k, W, D, v.name);
    const g = new THREE.Group(), th = Math.atan2(v.nx, v.nz);
    g.position.set(v.ax, B + 0.02, v.az); g.rotation.y = th;
    const col = new THREE.Color(), d = new THREE.Object3D(), meshes = [];
    /* kutular, silindirler, simitler, küreler: her biri tek örnekli çizim (parlaklar ayrı) */
    const build = (list, geo, shinyAt, colAt, set) => {
      for (const shiny of [false, true]) {
        const items = list.filter(o => !!(shinyAt >= 0 && o[shinyAt]) === shiny);
        if (!items.length) continue;
        const m = C.inst(geo, shiny ? shinyMat : boxMat, items.length);
        m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(items.length * 3), 3);
        items.forEach((o, i) => { set(o); d.updateMatrix(); m.setMatrixAt(i, d.matrix); m.setColorAt(i, col.set(o[colAt]).convertSRGBToLinear()); });
        m.instanceMatrix.needsUpdate = m.instanceColor.needsUpdate = true; m.receiveShadow = true; g.add(m); meshes.push(m);
      }
    };
    build(k.boxes, unit, 7, 6, o => { d.position.set(o[0], o[1], o[2]); d.scale.set(o[3], o[4], o[5]); d.rotation.set(0, 0, 0); });
    build(k.cyls, cylU, 6, 5, o => { d.position.set(o[0], o[1], o[2]); d.scale.set(o[3], o[4], o[3]); d.rotation.set(0, 0, 0); });
    build(k.tors, torU, -1, 4, o => { d.position.set(o[0], o[1], o[2]); d.scale.set(o[3], o[3], o[3]); d.rotation.set(0, 0, 0); });
    build(k.sphs, sphU, -1, 4, o => { d.position.set(o[0], o[1], o[2]); d.scale.set(o[3], o[3] * o[5], o[3]); d.rotation.set(0, 0, 0); });
    for (const e of k.extra) {
      if (e[0] === 'glass') { const m = new THREE.Mesh(new THREE.PlaneGeometry(e[4], e[5]), glassMat); m.position.set(e[1], e[2], e[3] + 0.08); g.add(m); }
      else if (e[0] === 'lamp') { const m = new THREE.Mesh(unit, lampMat); m.scale.set(0.3, 0.02, 0.3); m.position.set(e[1], e[2] - 0.6, e[3]); g.add(m); }
      else if (e[0] === 'floor') { const t = floorOf(e[3]); const m = new THREE.Mesh(new THREE.PlaneGeometry(e[1], e[2]).rotateX(-Math.PI / 2), t); m.position.set(0, 0.002, e[2] / 2 - 0.15); m.receiveShadow = true; g.add(m); t.map.repeat.set(e[1] / 2, e[2] / 2); }
      else if (e[0] === 'sign') { const m = new THREE.Mesh(new THREE.PlaneGeometry(e[4], e[5]), litMat({ map: e[7] })); m.position.set(e[1], e[2], e[3]); m.rotation.y = e[6]; m.userData.own = true; g.add(m); }
    }
    const crowd = new C.Crowd(Math.max(1, k.people.length), { glow });
    k.people.forEach((p, i) => crowd.look(i, Object.assign(C.randomLook(k.r), p.look)));
    g.add(crowd.group); scene.add(g);
    if (v.L) v.L.group.visible = false;               // içeriden dış kabuğun alt yüzleri görünmesin
    const t = { x: Math.cos(th), z: -Math.sin(th) }, n = { x: v.nx, z: v.nz };
    cur = { v, g, k, crowd, t, n, W, D, meshes, floor: B + 0.02, cut: 0 };
    const pl = C.player;
    if (pl.money === undefined) pl.money = 300;
    pl.indoor = { floor: B + 0.02, walls: meshes.slice(), npcs: [] };
    for (const p of k.people) pl.indoor.npcs.push(p);
    this.toWorld(0, Math.min(1.6, D * 0.3), pl.pos); pl.pos.y = B + 0.02; pl.vel.set(0, 0, 0);
    pl.face = pl.yaw = Math.atan2(-n.z, n.x);                                   // içeri bak
    pl.dist = Math.min(pl.dist, 2.8);
  },
  leave(silent) {
    if (!cur) return;
    const v = cur.v, pl = C.player;
    if (pl.seat) { pl.seat = null; }
    if (pl.basket && pl.basket.length) { sayMe('Sepeti kasaya bıraktın.'); pl.basket = []; if (pl.hold && pl.hold.kind === 'basket') pl.hold = null; }
    scene.remove(cur.g); for (const m of cur.meshes) m.dispose(); cur.crowd.dispose();
    if (v.L) v.L.group.visible = true;
    cur.g.traverse(o => { if (o.geometry && o.geometry !== unit && o.geometry !== cylU && o.geometry !== torU && o.geometry !== sphU) o.geometry.dispose(); if (o.userData.own) o.material.dispose(); });
    cur = null; pl.indoor = null;
    if (!silent) { pl.pos.set(v.x - v.nx * 0.4, B, v.z - v.nz * 0.4); pl.face = pl.yaw = Math.atan2(v.nz, -v.nx); pl.vel.set(0, 0, 0); }
  },
  /* oyuncuya en yakın etkileşim yeri (al, öde, otur...) */
  actionNear() {
    if (!cur || C.player.seat) return null;
    const [lx, lz] = this.toLocal(C.player.pos.x, C.player.pos.z);
    let best = null, bd = 1e9;
    for (const s of cur.k.spots) { const d = Math.hypot(s.x - lx, s.z - lz); if (d < s.r && d < bd) { bd = d; best = s; } }
    if (best) best.d = bd;
    return best;
  },
  act(s) { s.act(); },
  /* kalkarken bitmiş bardak ya da tabak en yakın masada kalır (mekândan çıkınca kaybolur) */
  dropOnTable(seat) {
    const pl = C.player; if (!cur || !pl.hold) return false;
    const [sx, sz] = this.toLocal(seat.x, seat.z), T = cur.k.tables || [];
    let tb = null, bd = 1.6; for (const t of T) { const d = Math.hypot(t.x - sx, t.z - sz); if (d < bd) { bd = d; tb = t; } }
    const kind = pl.hold.kind, g = new THREE.Group();
    const tx = tb ? C.clamp(sx, tb.x - tb.w / 2 + 0.1, tb.x + tb.w / 2 - 0.1) : sx, tz = tb ? C.clamp(sz, tb.z - tb.d / 2 + 0.1, tb.z + tb.d / 2 - 0.1) : sz;
    const y = tb ? 0.77 : 0.02, add = (geo, mat, x, yy, z, a, b, c) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, yy, z); m.scale.set(a, b, c); m.userData.own = true; g.add(m); };
    if (DRINKABLE[kind]) { add(cylU, std('#f2f2ee'), 0, 0, 0, 0.045, 0.008, 0.045); add(cylU, kind === 'tea' ? new THREE.MeshStandardMaterial({ color: C.col('#dfe9ee'), roughness: 0.05, transparent: true, opacity: 0.4, depthWrite: false }) : std('#f4f1ea', 0.4), 0, 0.008, 0, kind === 'tea' ? 0.026 : 0.035, kind === 'tea' ? 0.082 : 0.09, kind === 'tea' ? 0.026 : 0.035); if (kind === 'tea') add(cylU, std('#a5400f'), 0, 0.01, 0, 0.021, 0.006, 0.021); }
    else { add(cylU, std('#f4f1ea', 0.4), 0, 0, 0, 0.11, 0.01, 0.11); for (let i = 0; i < 4; i++) add(sphU, std('#b9742f'), (Math.random() - 0.5) * 0.12, 0.014, (Math.random() - 0.5) * 0.12, 0.012, 0.008, 0.012); }   // kırıntılı tabak
    g.position.set(tx, y, tz); cur.g.add(g); pl.hold = null;
    return true;
  },
  toWorld(lx, lz, out) { out.x = cur.v.ax + lx * cur.t.x + lz * cur.n.x; out.z = cur.v.az + lx * cur.t.z + lz * cur.n.z; return out; },
  toLocal(x, z) { const dx = x - cur.v.ax, dz = z - cur.v.az; return [dx * cur.t.x + dz * cur.t.z, dx * cur.n.x + dz * cur.n.z]; },
  /* içeride yürüme: duvarlar ve mobilyalar */
  confine(q) {
    if (!cur) return;
    let [lx, lz] = this.toLocal(q.x, q.z);
    const R = 0.32, W = cur.W, D = cur.D;
    lx = C.clamp(lx, -W / 2 + R, W / 2 - R); lz = C.clamp(lz, 0.45 + R, D - R);
    for (const c of cur.k.cols) {
      const qx = C.clamp(lx, c[0] - c[2], c[0] + c[2]), qz = C.clamp(lz, c[1] - c[3], c[1] + c[3]);
      const dx = lx - qx, dz = lz - qz, d = Math.hypot(dx, dz);
      if (d < R && d > 1e-6) { lx = qx + dx / d * R; lz = qz + dz / d * R; }
      else if (d <= 1e-6) { const ex = c[2] - Math.abs(lx - c[0]), ez = c[3] - Math.abs(lz - c[1]); if (ex < ez) lx = c[0] + Math.sign(lx - c[0] || 1) * (c[2] + R); else lz = c[1] + Math.sign(lz - c[1] || 1) * (c[3] + R); }
    }
    this.toWorld(lx, lz, q);
  },
  exitNear() { if (!cur) return false; const [lx, lz] = this.toLocal(C.player.pos.x, C.player.pos.z); return Math.abs(lx) < 1.2 && lz < 1.3; },
  /* kamera oda içinde kalsın */
  keepCam(c, head) {
    if (!cur) return;
    const [hx, hz] = this.toLocal(head.x, head.z), [cx, cz] = this.toLocal(c.x, c.z);
    const lim = [[cx, hx, -cur.W / 2 + 0.25, cur.W / 2 - 0.25], [cz, hz, 0.5, cur.D - 0.25], [c.y, head.y, B + 0.3, B + (cur.k.H || 3.1) - 0.25]];
    let t = 1;
    for (const [v, h, lo, hi] of lim) { if (v > hi && v !== h) t = Math.min(t, (hi - h) / (v - h)); if (v < lo && v !== h) t = Math.min(t, (lo - h) / (v - h)); }
    t = Math.max(0, t * 0.96);
    c.x = head.x + (c.x - head.x) * t; c.y = head.y + (c.y - head.y) * t; c.z = head.z + (c.z - head.z) * t;
  },
  get current() { return cur; }
};

/* iç mekandakiler: pozlar, konuşurken oyuncuya döner; elde taşınan şey, oturunca yeme/içme */
const vp = {}, wv = { x: 0, z: 0 };
C.updaters.push((dt, t) => {
  const pl = C.player;
  /* elde taşınan */
  const kind = pl.active && pl.mode === 'citizen' && pl.hold && !(C.cats && C.cats.held) ? pl.hold.kind : '';
  if (kind !== heldKind) { if (held) { scene.remove(held); held.traverse(o => { if (o.material) o.material.dispose(); }); } held = kind ? holdMesh(kind) : null; if (held) scene.add(held); heldKind = kind; }
  if (held && pl.lastPose) {
    C.handOf(pl.pos.x, pl.pos.y, pl.pos.z, pl.face, pl.lastPose, 1, hp);
    const big = /^(bag|basket|flowers|bread)$/.test(kind);                // küçükler elin içinde kaybolmasın: biraz büyük, avucun önünde
    held.position.set(hp.x + Math.cos(pl.face) * (big ? 0 : 0.07), hp.y + (big ? 0 : 0.03), hp.z - Math.sin(pl.face) * (big ? 0 : 0.07));
    held.rotation.set(0, pl.face, 0); held.scale.setScalar(big ? 1 : 1.6);
    if (EDIBLE[kind] && pl.seat && !pl.hold.done && pl.sip > 0.85) {          // oturunca: el ağzındayken bir yudum, bir ısırık
      pl.hold.t += dt;
      if (pl.hold.t > 2.6) { pl.hold.done = true; sayMe(DRINKABLE[kind] ? 'Oh be, ilaç gibi geldi!' : 'Afiyet oldu!'); }
    }
    const left = pl.hold ? (pl.hold.done ? 0 : 1 - C.clamp(pl.hold.t / 2.6, 0, 1) * 0.85) : 1;   // kalan
    held.traverse(o => { const e = o.userData.eat; if (!e) return; o.visible = left > 0.02; if (e === 'y') o.scale.set(o.userData.s0.x, o.userData.s0.y * left, o.userData.s0.z); else o.scale.copy(o.userData.s0).multiplyScalar(0.35 + 0.65 * left); });
  }
  if (!cur) return;
  if (cur.cut > 0 && (cur.cut -= dt) <= 0 && pl.seat) { sayMe('Sıhhatler olsun! Yeni saç çok yakıştı.'); if (pl.look) { pl.look.hair = pick(Math.random, ['#1d1612', '#3b2a1e', '#5c4030']); pl.look.long = false; pl.crowd.look(0, pl.look); } }
  cur.k.people.forEach((p, i) => {
    let ry = p.ry, pose = p.pose;
    if (p.talk_t > 0) {
      p.talk_t -= dt; C.venues.toWorld(p.x, p.z, wv);
      const want = Math.atan2(-(pl.pos.z - wv.z), pl.pos.x - wv.x) - cur.g.rotation.y;
      if (pose === 'stand' || pose === 'cook') { ry = want; pose = 'talk'; }
    }
    cur.crowd.set(i, p.x, p.y, p.z, ry, C.pose(pose, t + p.ph, vp));
    C.venues.toWorld(p.x, p.z, wv); p.wx = wv.x; p.wz = wv.z;
  });
  cur.crowd.commit();
});
})();
