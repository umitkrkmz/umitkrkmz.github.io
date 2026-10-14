/* ===== venues.js: girilebilir mekanlar (dükkanlar, kafe, karakol, hastane, itfaiye) ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene, B = C.SW;
const unit = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
const glow = { value: 0.3 };
C.nightListeners.push(n => { glow.value = 0.3 + n * 0.25; });       // iç mekan hep aydınlık, gece biraz daha
function litMat(extra) {
  const m = new THREE.MeshStandardMaterial(Object.assign({ color: 0xffffff, roughness: 0.8 }, extra));
  m.onBeforeCompile = sh => {
    sh.uniforms.uGlow = glow;
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uGlow;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += diffuseColor.rgb * uGlow;');
  };
  m.customProgramCacheKey = () => 'venue';
  return m;
}
const boxMat = litMat(), glassMat = new THREE.MeshStandardMaterial({ color: C.col('#bcd6e4'), roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.22, depthWrite: false });
const lampMat = new THREE.MeshBasicMaterial({ color: C.col('#fff6df') });
const pick = (r, a) => a[(r() * a.length) | 0];

/* ---------- mekan türleri ---------- */
const KIND = { 'ÇAY OCAĞI': 'cafe', 'KAFE': 'cafe', 'ANKARA SİMİDİ': 'cafe', 'FIRIN': 'bakery', 'ECZANE': 'pharmacy', 'OPTİK': 'pharmacy',
  'MARKET': 'market', 'KIRTASİYE': 'market', 'KUAFÖR': 'barber', 'KEBAP': 'kebab', 'ÇİÇEKÇİ': 'florist', 'TAMİRCİ': 'repair' };
const TALK = {
  cafe: ['Hoş geldiniz! Çay mı kahve mi?', 'Simitler taze, çay demli.', 'Bugün tatlı yok, kusura bakmayın.'],
  customer: ['Burası şehrin en iyi çayı.', 'Gazeteyi okuyordum, maç berabere bitmiş.', 'Bir çay daha söylesene!', 'Hesabı ben ödüyorum.'],
  bakery: ['Ekmekler fırından yeni çıktı!', 'Poğaça da var, sıcak sıcak.', 'Yarım ekmek mi, tam mı?'],
  pharmacy: ['Reçeteniz var mı?', 'Günde iki kez, tok karnına.', 'Geçmiş olsun.'],
  market: ['Kasa burada, buyurun.', 'Domates bugün çok taze.', 'Poşet ister misiniz?'],
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

/* ---------- yerleşim yardımcıları (yerel çerçeve: x kapı boyunca, z içeri, y yukarı; kapı z=0) ---------- */
function Kit(seed) { this.r = C.rng(seed); this.boxes = []; this.people = []; this.cols = []; this.extra = []; }
Kit.prototype.box = function (x, y, z, sx, sy, sz, col, solid) {
  this.boxes.push([x, y, z, sx, sy, sz, col]);
  if (solid) this.cols.push([x, z, sx / 2, sz / 2]);
};
Kit.prototype.man = function (x, z, ry, pose, talk, look, y) { this.people.push({ x, z, ry, pose, talk, look: look || C.randomLook(this.r), y: y || 0, ph: this.r() * 10, t: 0 }); };
Kit.prototype.chair = function (x, z, col) { this.box(x, 0, z, 0.44, 0.45, 0.44, col || '#7a5a3a', true); };
Kit.prototype.table = function (x, z, w, d, col) { this.box(x, 0, z, w, 0.74, d, col || '#8b6340', true); };
Kit.prototype.shelf = function (x, z, w, d, h, items) {
  this.box(x, 0, z, w, h, d, '#8b6340', true);
  if (items) for (let y = 0.45; y < h - 0.1; y += 0.5) for (let k = -w / 2 + 0.3; k < w / 2 - 0.2; k += 0.38)
    if (this.r() < 0.85) this.box(w > d ? x + k : x, y, w > d ? z - d / 2 - 0.02 : z + k, w > d ? 0.28 : 0.2, 0.26, w > d ? 0.2 : 0.28, pick(this.r, items));
};
const GOODS = ['#e2452b', '#f2c230', '#2f7bff', '#3b9a57', '#f2f2ee', '#c96bb0', '#ff8a3d'];
const BREAD = ['#c9853f', '#b5702f', '#d9a35c', '#a8622a'];
const MEDS = ['#f2f2ee', '#e2452b', '#2f7bff', '#3b9a57', '#d8e6f2'];
const FLOWERS = ['#e2452b', '#f2c230', '#ffffff', '#c96bb0', '#ff8a3d', '#8a5ac9'];

/* duvarlar, tavan, ışıklar ve vitrinli ön duvar */
function shell(k, W, D, H, floorCol, wallCol, opt) {
  opt = opt || {}; k.H = H;
  k.box(0, -0.05, D / 2, W + 0.3, 0.05, D + 0.3, floorCol);
  if (!opt.noCeiling) k.box(0, H, D / 2, W + 0.3, 0.12, D + 0.3, '#f4f1ea');
  k.box(0, 0, D + 0.07, W + 0.3, H, 0.14, wallCol);
  for (const s of [-1, 1]) k.box(s * (W / 2 + 0.07), 0, D / 2, 0.14, H, D, wallCol);
  const dw = opt.door || 1.6, side = (W - dw) / 2;
  for (const s of [-1, 1]) {
    const cx = s * (dw / 2 + side / 2);
    if (opt.window === false) k.box(cx, 0, 0.2, side, H, 0.14, wallCol);
    else { k.box(cx, 0, 0.2, side, 0.9, 0.14, wallCol); k.box(cx, 2.6, 0.2, side, H - 2.6, 0.14, wallCol); k.extra.push(['glass', cx, 1.75, 0.2, side, 1.7]); }
  }
  k.box(0, 2.4, 0.2, dw, H - 2.4, 0.14, wallCol);
  if (!opt.noLamps) for (let x = -W / 2 + 2; x <= W / 2 - 1.5; x += 3.2) for (let z = 1.8; z < D - 0.8; z += 3.2) k.extra.push(['lamp', x, H - 0.06, z]);
}
const LAYOUT = {
  cafe(k, W, D) {
    shell(k, W, D, 3.1, '#a8805a', '#efe4d2');
    k.box(0, 0, D - 1.1, W - 2.4, 1.05, 0.7, '#6b4a30', true); k.box(0, 1.05, D - 1.1, W - 2.3, 0.05, 0.8, '#2a2e33');
    k.box(-1.2, 1.1, D - 1.1, 0.6, 0.45, 0.45, '#3b4046'); k.box(1.4, 1.1, D - 1.1, 0.35, 0.3, 0.35, '#c9853f');
    k.shelf(0, D - 0.15, W - 2.6, 0.3, 2.3, ['#f2f2ee', '#d4a73c', '#7a5a3a']);
    k.man(0.2, D - 0.5, Math.PI / 2, 'stand', TALK.cafe);
    const n = W > 6 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const x = -W / 2 + 1.5 + i * ((W - 3) / Math.max(1, n - 1)), z = 2.2 + (i % 2) * 0.6;
      k.table(x, z, 0.8, 0.8, '#e8e2d0');
      for (const s of [-1, 1]) { k.chair(x + s * 0.75, z); if (k.r() < 0.75) k.man(x + s * 0.75, z, s > 0 ? Math.PI : 0, 'drink', TALK.customer); }
      k.box(x, 0.74, z, 0.1, 0.1, 0.1, '#f6f3ea');
    }
  },
  bakery(k, W, D) {
    shell(k, W, D, 3.1, '#d9d2c4', '#f2e6cf');
    k.box(0, 0, D * 0.45, W - 2.2, 1.0, 0.7, '#e9e2d4', true); k.box(0, 1.0, D * 0.45, W - 2.2, 0.35, 0.7, '#cfe3ee');
    for (let x = -W / 2 + 1.5; x < W / 2 - 1.2; x += 0.5) k.box(x, 1.02, D * 0.45, 0.32, 0.12, 0.2, pick(k.r, BREAD));
    k.shelf(0, D - 0.3, W - 1.2, 0.5, 2.2, BREAD);
    for (const s of [-1, 1]) k.shelf(s * (W / 2 - 0.35), D * 0.72, 0.5, D * 0.45, 2.0, BREAD);
    k.man(0.4, D * 0.45 + 0.9, Math.PI / 2, 'stand', TALK.bakery, { skin: '#e8b88f', shirt: '#f2f2ee', pants: '#2d3b55', shoes: '#1b1b1d', hair: '#3b2a1e', long: false });
    k.man(-1.0, 1.4, -Math.PI / 2, 'stand', TALK.customer);
  },
  pharmacy(k, W, D) {
    shell(k, W, D, 3.1, '#e9eef0', '#f4f6f6');
    k.box(0, 0, D * 0.5, W - 2.4, 1.0, 0.6, '#f2f2ee', true); k.box(0, 1.0, D * 0.5, W - 2.4, 0.04, 0.65, '#3b9a57');
    k.shelf(0, D - 0.3, W - 1.0, 0.45, 2.4, MEDS);
    for (const s of [-1, 1]) k.shelf(s * (W / 2 - 0.3), D * 0.35, 0.45, D * 0.5, 2.0, MEDS);
    k.man(-0.3, D * 0.5 + 0.8, Math.PI / 2, 'stand', TALK.pharmacy, { skin: '#f1c9a5', shirt: '#f7f7f4', pants: '#3a3a3a', shoes: '#e8e8e4', hair: '#c9a46a', long: true });
    k.man(0.8, 1.3, -Math.PI / 2 + 0.3, 'stand', TALK.patient);
  },
  market(k, W, D) {
    shell(k, W, D, 3.2, '#d5d2ca', '#eef0ee');
    for (let x = -W / 2 + 1.8; x < W / 2 - 1.2; x += 2.0) { k.shelf(x, D * 0.58, 0.6, D * 0.55, 1.7, null); for (const s of [-1, 1]) for (let y = 0.35; y < 1.6; y += 0.42) for (let z = D * 0.32; z < D * 0.84; z += 0.36) if (k.r() < 0.9) k.box(x + s * 0.36, y, z, 0.12, 0.3, 0.26, pick(k.r, GOODS)); }
    k.box(W / 2 - 1.4, 0, 1.4, 0.7, 0.95, 1.6, '#3b4046', true);
    k.man(W / 2 - 0.7, 1.4, Math.PI, 'stand', TALK.market, { skin: '#d9a37c', shirt: '#e2452b', pants: '#2b2f36', shoes: '#1b1b1d', hair: '#1d1612', long: false });
    for (let i = 0; i < 2; i++) k.man(-W / 2 + 2.8 + i * 2.0, D * 0.6 + (k.r() - 0.5), k.r() * 6, 'stand', TALK.customer);
  },
  barber(k, W, D) {
    shell(k, W, D, 3.1, '#2a2e33', '#e9e2d4');
    for (let i = 0; i < 2; i++) {
      const x = -W / 4 + i * W / 2, z = D - 1.6;
      k.box(x, 1.0, D - 0.12, 1.2, 1.2, 0.04, '#cfd8de');
      k.box(x, 0, z, 0.65, 0.55, 0.65, '#8a2d2d', true);
      k.man(x, z, -Math.PI / 2, 'sit', TALK.customer);
      k.man(x - 0.2, z - 0.8, -Math.PI / 2 + 0.3, 'cook', TALK.barber, { skin: '#d9a37c', shirt: '#222b33', pants: '#1f2a3a', shoes: '#1b1b1d', hair: '#1d1612', long: false });
    }
    for (let x = -W / 2 + 1; x < W / 2 - 1; x += 0.6) k.chair(x, 0.9, '#3d5a80');
  },
  kebab(k, W, D) {
    shell(k, W, D, 3.1, '#a8603a', '#efe4d2');
    k.box(0, 0, D - 1.0, W - 2.0, 1.0, 0.7, '#8a3b3b', true);
    k.box(-1.2, 1.0, D - 1.0, 0.3, 1.0, 0.3, '#8a5a2b'); k.box(-1.2, 1.0, D - 0.8, 0.5, 1.1, 0.05, '#c9372c');
    k.man(-0.4, D - 0.4, Math.PI / 2, 'cook', TALK.kebab, { skin: '#d9a37c', shirt: '#f2f2ee', pants: '#2d3b55', shoes: '#1b1b1d', hair: '#1d1612', long: false });
    for (let i = 0; i < 2; i++) { const x = -W / 4 + i * W / 2; k.table(x, 2.2, 1.2, 0.8); for (const s of [-1, 1]) { k.chair(x, 2.2 + s * 0.7); if (k.r() < 0.7) k.man(x, 2.2 + s * 0.7, s > 0 ? Math.PI / 2 : -Math.PI / 2, 'drink', TALK.customer); } }
  },
  florist(k, W, D) {
    shell(k, W, D, 3.1, '#c9bfa8', '#eef3ea');
    for (let x = -W / 2 + 0.8; x < W / 2 - 0.6; x += 0.7) for (const z of [D - 0.6, 1.4]) { k.box(x, 0, z, 0.45, 0.4, 0.45, '#5b6e4a'); k.box(x, 0.4, z, 0.4, 0.45, 0.4, pick(k.r, FLOWERS)); }
    k.box(0, 0, D * 0.55, 2.2, 0.95, 0.7, '#8b6340', true);
    k.man(0, D * 0.55 + 0.8, Math.PI / 2, 'stand', TALK.florist);
  },
  repair(k, W, D) {
    shell(k, W, D, 3.1, '#7d7a72', '#d8d4c8');
    k.box(0, 0, D - 0.8, W - 1.6, 0.9, 0.9, '#5b4a3a', true);
    for (let x = -W / 2 + 1.2; x < W / 2 - 1; x += 0.9) k.box(x, 0.9, D - 0.8, 0.6, 0.4 + k.r() * 0.3, 0.45, pick(k.r, ['#2a2e33', '#8d939a', '#3b4046', '#c9a227']));
    k.chair(0.6, D - 1.8); k.man(0.6, D - 1.8, -Math.PI / 2, 'study', TALK.repair, { skin: '#b98260', shirt: '#2f6f8f', pants: '#2b2f36', shoes: '#3a2a1e', hair: '#a8a29a', long: true });
    k.shelf(-W / 2 + 0.3, D * 0.4, 0.45, D * 0.6, 2.2, ['#2a2e33', '#8d939a', '#c9a227']);
  },
  police(k, W, D) {
    shell(k, W, D, 3.2, '#c9ccd0', '#e4e8ec');
    k.box(0, 0, 2.6, 3.4, 1.1, 0.8, '#24364d', true); k.box(0, 1.1, 2.6, 3.5, 0.05, 0.9, '#d8dde2');
    k.man(0, 3.4, Math.PI / 2, 'stand', TALK.police, { skin: '#d9a37c', shirt: '#1f4e8c', pants: '#1f2a3a', shoes: '#1b1b1d', hair: '#1d1612', long: true });
    for (let x = -W / 2 + 1; x < -1.5; x += 0.6) k.chair(x, 0.9, '#3d5a80');
    k.man(-W / 2 + 1.6, 0.9, -Math.PI / 2, 'sit', TALK.customer);
    for (const x of [-W / 4, W / 4 - 1]) { k.table(x, D * 0.6, 1.5, 0.8, '#e8e2d0'); k.chair(x, D * 0.6 + 0.65, '#2a2e33'); k.man(x, D * 0.6 + 0.65, Math.PI / 2, 'study', TALK.police, { skin: pick(k.r, ['#e8b88f', '#b98260']), shirt: '#1f4e8c', pants: '#1f2a3a', shoes: '#1b1b1d', hair: '#3b2a1e', long: true }); }
    const cx = W / 2 - 1.8, cz = D - 1.6;                                // nezarethane
    for (let x = cx - 1.5; x <= cx + 1.5; x += 0.25) k.box(x, 0, cz - 1.4, 0.05, 3.0, 0.05, '#3b4046', false);
    k.cols.push([cx, cz - 1.4, 1.6, 0.1]);
    k.box(cx, 0, cz + 0.6, 2.6, 0.45, 0.7, '#8d939a', true);
    k.man(cx + 0.4, cz - 0.3, -Math.PI / 2, 'stand', TALK.inmate, { skin: '#d9a37c', shirt: '#22262b', pants: '#22262b', shoes: '#1b1b1d', hair: '#1d1612', long: true });
  },
  hospital(k, W, D) {
    shell(k, W, D, 3.2, '#e2e8ea', '#f4f7f8');
    k.box(-W / 4, 0, 2.4, 3.0, 1.1, 0.8, '#f2f2ee', true); k.box(-W / 4, 1.1, 2.4, 3.1, 0.05, 0.9, '#c62828');
    k.man(-W / 4, 3.2, Math.PI / 2, 'stand', TALK.hospital, { skin: '#f1c9a5', shirt: '#f7f7f4', pants: '#f7f7f4', shoes: '#e8e8e4', hair: '#5c4030', long: true });
    for (let x = 1; x < W / 2 - 0.8; x += 0.6) { k.chair(x, 1.2, '#2f7bff'); if (k.r() < 0.5) k.man(x, 1.2, -Math.PI / 2, 'sit', TALK.patient); }
    const bx = W / 4, bz = D - 1.6;
    k.box(bx, 0, bz, 1.0, 0.65, 2.0, '#d8e6f2', true); k.box(bx, 0.65, bz + 0.7, 0.9, 0.12, 0.4, '#ffffff');
    k.box(bx - 0.9, 0, bz, 0.04, 2.2, 2.4, '#8fc1d8');
    k.man(bx, bz - 0.85, Math.PI / 2, 'lie', TALK.patient, null, 0.75);
    k.man(bx + 0.9, bz - 0.4, Math.PI, 'stand', TALK.hospital, { skin: '#d9a37c', shirt: '#7fb7a8', pants: '#7fb7a8', shoes: '#e8e8e4', hair: '#1d1612', long: false });
  },
  fire(k, W, D) {
    shell(k, W, D, 5.4, '#9a9a95', '#cfc8bc', { door: 3.4, window: false });
    k.box(-3, 0, D * 0.55, 2.4, 2.4, 7.6, '#c62828', true); k.box(-3, 2.4, D * 0.55 - 0.6, 0.9, 0.2, 6.0, '#a7adb3');
    k.box(-3, 0.3, D * 0.55, 2.42, 0.25, 7.62, '#f2f2ee');
    for (let x = 2; x < W / 2 - 0.5; x += 0.9) k.box(x, 0, D - 0.45, 0.7, 2.0, 0.55, '#c9a227', true);
    k.box(4, 0, 3, 0.12, 5.4, 0.12, '#c9ccd0', true);
    for (let i = 0; i < 3; i++) k.man(1.5 + i * 1.2, D * 0.5, k.r() * 6, i === 1 ? 'talk' : 'stand', TALK.fire, { skin: pick(k.r, ['#e8b88f', '#b98260', '#8d5a3c']), shirt: '#2a2e33', pants: '#2a2e33', shoes: '#1b1b1d', hair: '#1d1612', long: true });
  },
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
    LAYOUT[v.kind](k, W, D);
    const g = new THREE.Group(), th = Math.atan2(v.nx, v.nz);
    g.position.set(v.ax, B + 0.02, v.az); g.rotation.y = th;
    const boxes = C.inst(unit, boxMat, k.boxes.length), col = new THREE.Color(), d = new THREE.Object3D();
    boxes.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(k.boxes.length * 3), 3);
    k.boxes.forEach((o, i) => { d.position.set(o[0], o[1], o[2]); d.scale.set(o[3], o[4], o[5]); d.updateMatrix(); boxes.setMatrixAt(i, d.matrix); boxes.setColorAt(i, col.set(o[6]).convertSRGBToLinear()); });
    boxes.instanceMatrix.needsUpdate = boxes.instanceColor.needsUpdate = true; g.add(boxes);
    for (const e of k.extra) {
      if (e[0] === 'glass') { const m = new THREE.Mesh(new THREE.PlaneGeometry(e[4], e[5]), glassMat); m.position.set(e[1], e[2], e[3] + 0.08); g.add(m); }
      else if (e[0] === 'lamp') { const m = new THREE.Mesh(unit, lampMat); m.scale.set(0.9, 0.04, 0.3); m.position.set(e[1], e[2], e[3]); g.add(m); }
    }
    const crowd = new C.Crowd(Math.max(1, k.people.length), { glow });
    k.people.forEach((p, i) => crowd.look(i, Object.assign(C.randomLook(k.r), p.look)));
    g.add(crowd.group); scene.add(g);
    if (v.L) v.L.group.visible = false;               // içeriden dış kabuğun alt yüzleri görünmesin
    const t = { x: Math.cos(th), z: -Math.sin(th) }, n = { x: v.nx, z: v.nz };
    cur = { v, g, k, crowd, t, n, W, D, boxes };
    const P = C.player;
    P.indoor = { floor: B + 0.02, walls: [boxes], npcs: [] };
    for (const p of k.people) P.indoor.npcs.push(p);
    this.toWorld(0, Math.min(2.6, D * 0.4), P.pos); P.pos.y = B + 0.02; P.vel.set(0, 0, 0);
    P.face = P.yaw = Math.atan2(-n.z, n.x);                                   // içeri bak
    P.dist = Math.min(P.dist, 2.8);
  },
  leave(silent) {
    if (!cur) return;
    const v = cur.v, P = C.player;
    scene.remove(cur.g); cur.boxes.dispose(); cur.crowd.dispose();
    if (v.L) v.L.group.visible = true;
    cur.g.traverse(o => { if (o.geometry && o.geometry !== unit) o.geometry.dispose(); });
    cur = null; P.indoor = null;
    if (!silent) { P.pos.set(v.x - v.nx * 0.4, B, v.z - v.nz * 0.4); P.face = P.yaw = Math.atan2(v.nz, -v.nx); P.vel.set(0, 0, 0); }
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
  exitNear() { if (!cur) return false; const [lx, lz] = this.toLocal(C.player.pos.x, C.player.pos.z); return Math.abs(lx) < 1.2 && lz < 1.6; },
  /* kamera oda içinde kalsın */
  keepCam(c, head) {
    if (!cur) return;
    /* baştan kameraya giden çizgi odanın kutusundan çıkıyorsa kamera o çizgi üzerinde yaklaşır */
    const [hx, hz] = this.toLocal(head.x, head.z), [cx, cz] = this.toLocal(c.x, c.z);
    const lim = [[cx, hx, -cur.W / 2 + 0.25, cur.W / 2 - 0.25], [cz, hz, 0.5, cur.D - 0.25], [c.y, head.y, B + 0.3, B + (cur.k.H || 3.1) - 0.25]];
    let t = 1;
    for (const [v, h, lo, hi] of lim) { if (v > hi && v !== h) t = Math.min(t, (hi - h) / (v - h)); if (v < lo && v !== h) t = Math.min(t, (lo - h) / (v - h)); }
    t = Math.max(0, t * 0.96);
    c.x = head.x + (c.x - head.x) * t; c.y = head.y + (c.y - head.y) * t; c.z = head.z + (c.z - head.z) * t;
  },
  get current() { return cur; }
};

/* iç mekandakiler: pozlar, konuşurken oyuncuya döner */
const vp = {}, wv = { x: 0, z: 0 };
C.updaters.push((dt, t) => {
  if (!cur) return;
  const P = C.player;
  cur.k.people.forEach((p, i) => {
    let ry = p.ry, pose = p.pose;
    if (p.talk_t > 0) {
      p.talk_t -= dt; C.venues.toWorld(p.x, p.z, wv);
      const want = Math.atan2(-(P.pos.z - wv.z), P.pos.x - wv.x) - cur.g.rotation.y;
      ry = want; if (pose === 'stand' || pose === 'cook') pose = 'talk';
    }
    cur.crowd.set(i, p.x, p.y, p.z, ry, C.pose(pose, t + p.ph, vp));
    C.venues.toWorld(p.x, p.z, wv); p.wx = wv.x; p.wz = wv.z;
  });
  cur.crowd.commit();
});
})();
