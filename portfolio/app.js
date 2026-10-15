/* ===== app.js: telefon arayüzü: ana ekran, uygulamalar (Projeler, Hakkımda, İletişim, Şehir Haber), saat.
   Uygulama açılınca sayfa tam ekrana geçer (şehirdeysek telefon büyür); içerik content.js'ten, canlı şehir bilgisi şehrin kendisinden (window.parent.C). ===== */
(function () {
'use strict';
const P = window.PORTFOLIO || {}, $ = id => document.getElementById(id);
const embed = window.parent !== window || /[?&]embed=1/.test(location.search);
if (embed) document.body.classList.add('embed');
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tell = msg => { if (embed) window.parent.postMessage(msg, '*'); };   // file:// ile köken yok; mesajlar zararsız
/* şehrin içindeysek şehrin kendisi; file:// ile açılınca tarayıcı izin vermez, o zaman null */
const city = () => { try { return embed && window.parent.C ? window.parent.C : null; } catch (e) { return null; } };
const pad = n => String(n).padStart(2, '0');
const hourNow = () => { const C = city(); if (C && typeof C.hour === 'number') return C.hour; const d = new Date(); return d.getHours() + d.getMinutes() / 60; };
const hm = h => pad(Math.floor(h)) + ':' + pad(Math.floor((h % 1) * 60));

/* ---------- ana ekran ---------- */
$('name').textContent = P.name || ''; $('role').textContent = P.role || ''; $('tagline').textContent = P.tagline || '';
$('status').textContent = P.status || ''; $('status').hidden = !P.status;
$('avatar').textContent = (P.name || '?').trim().charAt(0).toLocaleUpperCase('tr');
const ICON = { github: ['🐙', '#2b3036'], linkedin: ['💼', '#0a66c2'], mail: ['✉️', '#e2452b'], web: ['🌐', '#2f7bff'] };
$('dockbar').innerHTML = (P.contact || []).filter(c => c.href).map(c => `<a class="app small" href="${esc(c.href)}" target="_blank" rel="noopener"><span class="ico" style="--c:${(ICON[c.kind] || ICON.web)[1]}">${(ICON[c.kind] || ICON.web)[0]}</span><span class="sr">${esc(c.label)}</span></a>`).join('');
function tick() {
  const C = city();
  $('clock').textContent = hm(hourNow());
  $('date').textContent = new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }) + (C ? ' · Mikro Şehir' : '');
}
tick(); setInterval(tick, 1000);
document.querySelectorAll('.url').forEach(u => { u.innerHTML = `${esc(P.site || '')}/<b>${esc(u.dataset.path)}</b>`; });

/* ---------- Projeler, Hakkımda, İletişim ---------- */
$('projectList').innerHTML = (P.projects || []).map(p => {
  const here = p.live === '../index.html';
  const live = here ? (embed ? '<span>Şu an içindesin</span>' : '<a href="../index.html">Şehre gir</a>') : p.live ? `<a href="${esc(p.live)}" target="_blank" rel="noopener">Canlı</a>` : '';
  const code = p.code ? `<a class="ghost" href="${esc(p.code)}" target="_blank" rel="noopener">Kod</a>` : '<span>Kod yakında</span>';
  return `<article class="card"><h4>${esc(p.title)}</h4><p>${esc(p.desc)}</p><ul class="chips">${(p.tags || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul><div class="links">${live}${code}</div></article>`;
}).join('');
if (P.more) { $('moreLink').href = P.more.href; $('moreLink').textContent = P.more.label + ' →'; } else $('moreLink').hidden = true;
$('aboutText').innerHTML = (P.about || []).map(t => `<p>${esc(t)}</p>`).join('');
$('skills').innerHTML = (P.skills || []).map(t => `<li>${esc(t)}</li>`).join('');
$('contactList').innerHTML = (P.contact || []).filter(c => c.href).map(c =>
  `<li><a href="${esc(c.href)}" target="_blank" rel="noopener"><span class="ri" aria-hidden="true">${(ICON[c.kind] || ICON.web)[0]}</span><span><b>${esc(c.label)}</b><small>${esc(c.value)}</small></span></a></li>`).join('');

/* ---------- Şehir Haber: hava, maç, son dakika olaylar, gündem, rakamlar ---------- */
const DOT = { fire: '#e2452b', accident: '#f2a516', crime: '#2f7bff', pedestrian: '#d6336c' };
function weather(h) {
  const t = Math.round(13 + 8 * Math.sin((h - 9) / 24 * Math.PI * 2));          // ekim: öğleden sonra ılık, gece serin
  const [ico, txt] = h >= 5 && h < 7.5 ? ['🌫', 'Vadide sabah sisi'] : h < 18.5 && h >= 7.5 ? ['☀️', 'Açık ve güneşli'] : h >= 18.5 && h < 20 ? ['🌇', 'Gün batımı, açık'] : ['🌙', 'Açık, yıldızlı'];
  return `<div class="kicker">Hava durumu · ${hm(h)}</div><div class="big">${ico} ${t}°<span>C</span></div><p>${txt}. Dağlardan tünele doğru hafif esinti, nem %${55 + Math.round(10 * Math.sin(h))}.</p>`;
}
function match(C) {
  const M = C && C.match;
  const next = h => h < 13.5 ? '13:30' : h < 19 ? '19:00' : 'yarın 13:30';
  if (!M) return `<div class="kicker">Şehir Stadı</div><h4>Maç günü</h4><p>Maçlar her gün 13:30 ve 19:00'da. Şehrin içinden açınca skor canlı görünür.</p>`;
  if (M.on && M.teams) {
    const st = M.ph === 'half' ? 'Devre arası' : M.ph === 'end' ? 'Maç sonu' : Math.floor(M.min) + "'";
    return `<div class="kicker"><span class="live">Canlı</span> · Şehir Stadı · ${st}</div><div class="score"><span class="t">${esc(M.teams[0].name)}</span><span class="s">${M.score[0]} - ${M.score[1]}</span><span class="t">${esc(M.teams[1].name)}</span></div>`;
  }
  if (M.last) return `<div class="kicker">Son maç · Sıradaki ${next(C.hour)}</div><div class="score"><span class="t">${esc(M.last.teams[0])}</span><span class="s">${M.last.score[0]} - ${M.last.score[1]}</span><span class="t">${esc(M.last.teams[1])}</span></div>`;
  return `<div class="kicker">Şehir Stadı</div><h4>Sıradaki maç ${next(C.hour)}</h4><p>İlçe takımları karşı karşıya. Tribünler şimdiden doluyor.</p>`;
}
function breaking(C) {
  const log = C && C.eventLog;
  if (!C) return '<p class="empty">Son dakika haberleri şehrin içinden açınca görünür.</p>';
  if (!log || !log.length) return '<p class="empty">Şimdilik sakin. Şehirde bir şey olunca ilk burada.</p>';
  return log.slice(0, 5).map(ev => `<div class="brk${ev.done ? ' done' : ''}" style="--dot:${DOT[ev.type] || 'var(--accent)'}"><time>${esc(ev.time)}</time><b>${esc(ev.title)} · ${esc(ev.place)}</b><small>${esc(ev.status)}</small></div>`).join('');
}
function stats(C) {
  const S = C && C.cityStats;
  const rows = C ? [
    [C.cars ? C.cars.filter(c => !c.off && !c.parked).length : '—', 'yoldaki araç'], [C.people ? C.people.length : '—', 'kaldırımdaki yaya'],
    [C.cats ? C.cats.list.length : '—', 'sokak kedisi'], [S ? S.hero : 0, 'Pijamalı Çocuğun yakaladığı']
  ] : [['17 × 17', 'blok'], ['964 m', 'şehir kenarı'], ['~1.250', 'araç'], ['0', 'derleme adımı']];
  return rows.map(([v, k]) => `<div><b>${esc(v)}</b><small>${esc(k)}</small></div>`).join('');
}
/* gündem: her gün aynı sırada karışık (tarihten tohum) */
const day = Math.floor(Date.now() / 864e5), frac = x => x - Math.floor(x);
const news = (P.news || []).map((n, i) => [n, frac(Math.sin(i * 12.9898 + day * 78.233) * 43758.5453)]).sort((a, b) => a[1] - b[1]).map(x => x[0]).slice(0, 6);
$('cityNews').innerHTML = news.map(([h, t]) => `<article class="card"><div class="kicker">Gündem</div><h4>${esc(h)}</h4><p>${esc(t)}</p></article>`).join('');
$('cityHow').innerHTML = (P.how || []).map(([h, t]) => `<details class="card"><summary>${esc(h)}</summary><p>${esc(t)}</p></details>`).join('');
function cityRender() {
  const C = city(), h = hourNow();
  $('cityNow').textContent = (C ? 'Canlı · ' : '') + new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) + ' · ' + hm(h);
  $('cityWeather').innerHTML = weather(h); $('cityMatch').innerHTML = match(C); $('cityBreaking').innerHTML = breaking(C); $('cityStats').innerHTML = stats(C);
}
let cityT = null;

/* ---------- gezinme: uygulama açılınca tam ekran, geri ya da Esc ana ekrana ve telefon boyuna döner ---------- */
let current = null, opener = null;
function setFull(on) { document.body.classList.toggle('full', on); tell({ type: 'phone-mode', full: on }); }
function show(id) {
  const v = $(id); if (!v) return;
  if (current) current.hidden = true;
  opener = opener || document.activeElement; current = v; v.hidden = false; setFull(true);
  v.querySelector('.back').focus({ preventScroll: true });          // kayarken odaklanınca kap kaydırılmasın
  history.replaceState(null, '', '#' + id);
  clearInterval(cityT); if (id === 'city') { cityRender(); cityT = setInterval(cityRender, 2000); }
}
function home() {
  if (!current) return false;
  current.hidden = true; current = null; setFull(false); clearInterval(cityT);
  history.replaceState(null, '', location.pathname + location.search);
  if (opener && opener.focus) opener.focus({ preventScroll: true }); opener = null;
  return true;
}
document.addEventListener('click', e => {
  const o = e.target.closest('[data-open]'); if (o) { show(o.dataset.open); return; }
  if (e.target.closest('[data-home]')) home();
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!home()) tell({ type: 'phone-close' });                       // ana ekrandaysa telefonu kapat
});
window.addEventListener('message', e => { if (e.data && e.data.type === 'phone-home') home(); });   // telefon kapanınca ana ekrana dön
const start = location.hash.slice(1); if (['projects', 'about', 'contact', 'city'].includes(start)) show(start);
})();
