/* ===== app.js: telefon arayüzü: ana ekran, uygulamalar (Projeler, Hakkımda, İletişim, Ankara Haber), saat.
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
const ICON = { github: ['🐙', '#2b3036'], linkedin: ['💼', '#0a66c2'], mail: ['✉️', '#e2452b'], orcid: ['🎓', '#6e9a1f'], sponsor: ['💖', '#bf3989'], web: ['🌐', '#2f7bff'] };
$('dockbar').innerHTML = (P.contact || []).filter(c => c.href).map(c => `<a class="app small" href="${esc(c.href)}" target="_blank" rel="noopener"><span class="ico" style="--c:${(ICON[c.kind] || ICON.web)[1]}">${(ICON[c.kind] || ICON.web)[0]}</span>${esc(c.label)}</a>`).join('');   // ana ekrandaki gibi simgenin altında adı
function tick() {
  const C = city();
  $('clock').textContent = hm(hourNow());
  $('date').textContent = new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }) + (C ? ' · Ankara' : '');
}
tick(); setInterval(tick, 1000);
document.querySelectorAll('.url').forEach(u => { u.innerHTML = `${esc(P.site || '')}/<b>${esc(u.dataset.path)}</b>`; });

/* ---------- Projeler, Hakkımda, İletişim ---------- */
/* projeler gruplu; GitHub'dan (anahtarsız, tek istek, tarayıcıda 1 saat saklanır) dil ve son güncelleme gelir. Yıldız bilerek gösterilmez */
const GH_KEY = 'ms.gh', LANG = { Python: '#3572A5', 'C#': '#178600', JavaScript: '#f1e05a', 'Jupyter Notebook': '#DA5B0B' };
let gh = null;
try { const c = JSON.parse(localStorage.getItem(GH_KEY)); if (c && c.repos) gh = c; } catch (e) {}
const ago = iso => {                                                   // yakınsa "3 gün önce", eskiyse ay ve yıl ("9 ay önce" gibi eski izlenimi vermesin)
  const d = Math.floor((Date.now() - Date.parse(iso)) / 864e5);
  return d < 1 ? 'bugün' : d < 2 ? 'dün' : d < 30 ? d + ' gün önce' : new Date(iso).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
};
function projectCard(p) {
  const here = p.live === '../index.html', r = gh && p.repo ? gh.repos[p.repo] : null;
  const go = (label, href, cls) => `<a${cls ? ` class="${cls}"` : ''} href="${esc(href)}" target="_blank" rel="noopener">${label}</a>`;
  const links = [
    here ? (embed ? '<span>Şu an içindesin</span>' : '<a href="../index.html">Şehre gir</a>') : p.live ? go('Canlı', p.live) : '',
    p.paper ? go('Makale', p.paper) : '',
    p.repo ? go('Kod', 'https://github.com/' + (P.github || '') + '/' + p.repo, 'ghost') : here ? '<span>Kod yakında</span>' : '',
    p.extra ? go(esc(p.extra[0]), p.extra[1], 'ghost') : ''
  ].join('');
  const lang = r && r.lang ? `<span class="lang" style="--l:${LANG[r.lang] || '#8b949e'}">${esc(r.lang)}</span>` : '';
  const meta = r ? `<div class="meta">${lang}<span>Son güncelleme: ${esc(ago(r.pushed))}</span></div>` : '';
  return `<article class="card proj"><h4>${esc(p.title)}</h4>${meta}<p>${esc(p.desc)}</p>${p.cite ? `<p class="cite">${esc(p.cite)}</p>` : ''}<ul class="chips">${(p.tags || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul><div class="links">${links}</div></article>`;
}
function renderProjects() {
  const groups = [];
  for (const p of P.projects || []) { let g = groups.find(x => x.name === (p.group || '')); if (!g) groups.push(g = { name: p.group || '', list: [] }); g.list.push(p); }
  $('projectList').innerHTML = groups.map(g => (g.name ? `<h3 class="group">${esc(g.name)}</h3>` : '') + `<div class="grid">${g.list.map(projectCard).join('')}</div>`).join('');
}
renderProjects();
if (P.github && !(gh && Date.now() - gh.t < 36e5)) {
  fetch('https://api.github.com/users/' + encodeURIComponent(P.github) + '/repos?per_page=100').then(r => r.ok ? r.json() : Promise.reject(r.status)).then(list => {
    const repos = {}; for (const x of list) repos[x.name] = { lang: x.language, pushed: x.pushed_at };
    gh = { t: Date.now(), repos }; try { localStorage.setItem(GH_KEY, JSON.stringify(gh)); } catch (e) {}
    renderProjects();
  }).catch(() => {});                                                   // ağ yoksa ya da sınır dolduysa elle yazılmış özet yeter
}
if (P.more) { $('moreLink').href = P.more.href; $('moreLink').textContent = P.more.label + ' →'; } else $('moreLink').hidden = true;
$('aboutText').innerHTML = (P.about || []).map(t => `<p>${esc(t)}</p>`).join('');
$('edu').textContent = P.edu || ''; $('edu').hidden = !P.edu;
$('skills').innerHTML = (P.skills || []).map(s => Array.isArray(s) ? `<li><b>${esc(s[0])}</b><span>${esc(s[1])}</span></li>` : `<li><b>${esc(s)}</b></li>`).join('');
$('contactList').innerHTML = (P.contact || []).filter(c => c.href).map(c =>
  `<li><a href="${esc(c.href)}" target="_blank" rel="noopener"><span class="ri" aria-hidden="true">${(ICON[c.kind] || ICON.web)[0]}</span><span><b>${esc(c.label)}</b><small>${esc(c.value)}</small></span></a></li>`).join('');

/* ---------- Ankara Haber: hava, maç, son dakika olaylar, gündem, rakamlar ---------- */
const DOT = { fire: '#e2452b', accident: '#f2a516', crime: '#2f7bff', pedestrian: '#d6336c' };
/* hava: Ankara'nın canlı verisi (wxdata.js). Şehrin içindeyken şehrin aldığı, tek başınayken kendi isteği; ikisi aynı önbelleği paylaşır */
let wxd = null;
function weather(h, C) {
  const W = C && C.weather, d = (W && W.data) || wxd;
  if (!d) return `<div class="kicker">Ankara · Hava durumu · ${hm(h)}</div><h4>Hava bilgisi alınamadı</h4><p>Bağlantı gelince Ankara'nın anlık havası burada görünür.</p>`;
  const man = W && !W.live && W.KINDS ? W.KINDS[W.pick] : null;
  const days = (d.daily || []).slice(0, 3).map((x, i) => `<div><small>${i === 0 ? 'Bugün' : i === 1 ? 'Yarın' : esc(new Date(x.date + 'T12:00').toLocaleDateString('tr-TR', { weekday: 'long' }))}</small><span>${x.ico}</span><b>${Math.round(x.max)}° <i>${Math.round(x.min)}°</i></b></div>`).join('');
  const age = Math.round((Date.now() - d.t) / 60000);
  return `<div class="kicker">Ankara · Hava durumu · ${hm(h)}</div><div class="big">${d.ico} ${Math.round(d.temp)}°<span>C</span></div>` +
    `<p>${esc(d.label)}. Hissedilen ${Math.round(d.feels)}°, nem %${Math.round(d.hum)}, ${esc(d.windFrom)} ${Math.round(d.wind)} km/sa rüzgâr.</p>` +
    (man ? `<p class="wx-man">Şehirde şu an elle seçilmiş hava: ${man.ico} ${esc(man.label)}</p>` : '') +
    `<div class="wx-days">${days}</div><small class="src">Open-Meteo · ${age < 1 ? 'az önce' : age + ' dk önce'} güncellendi</small>`;
}
function match(C) {
  const M = C && C.match;
  const next = h => h < 13.5 ? '13:30' : h < 19 ? '19:00' : 'yarın 13:30';
  if (!M) return `<div class="kicker">Ankara Stadı</div><h4>Maç günü</h4><p>Maçlar her gün 13:30 ve 19:00'da. Şehrin içinden açınca skor canlı görünür.</p>`;
  if (M.on && M.teams) {
    const st = M.ph === 'half' ? 'Devre arası' : M.ph === 'end' ? 'Maç sonu' : Math.floor(M.min) + "'";
    return `<div class="kicker"><span class="live">Canlı</span> · Ankara Stadı · ${st}</div><div class="score"><span class="t">${esc(M.teams[0].name)}</span><span class="s">${M.score[0]} - ${M.score[1]}</span><span class="t">${esc(M.teams[1].name)}</span></div>`;
  }
  if (M.last) return `<div class="kicker">Son maç · Sıradaki ${next(C.hour)}</div><div class="score"><span class="t">${esc(M.last.teams[0])}</span><span class="s">${M.last.score[0]} - ${M.last.score[1]}</span><span class="t">${esc(M.last.teams[1])}</span></div>`;
  return `<div class="kicker">Ankara Stadı</div><h4>Sıradaki maç ${next(C.hour)}</h4><p>Semt takımları karşı karşıya. Tribünler şimdiden doluyor.</p>`;
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
/* gündem: news.js güne, saate, havaya, olaylara ve maça göre seçer; değişmediyse sayfaya dokunmaz */
let newsHtml = '';
function renderNews(C, h) {
  if (!window.MSNews) return;
  const W = C && C.weather;
  const items = MSNews.build({ kit: P.newsKit, gags: P.news, date: new Date(), hour: h, C, wx: (W && W.data) || wxd, pick: W && !W.live ? W.pick : null });
  const html = items.map(n => `<article class="card"><div class="kicker">${esc(n.cat)} · ${esc(n.time)}</div><h4>${esc(n.title)}</h4><p>${esc(n.text)}</p></article>`).join('');
  if (html !== newsHtml) { newsHtml = html; $('cityNews').innerHTML = html; }
}
$('cityHow').innerHTML = (P.how || []).map(([h, t]) => `<details class="card"><summary>${esc(h)}</summary><p>${esc(t)}</p></details>`).join('');
function cityRender() {
  const C = city(), h = hourNow();
  $('cityNow').textContent = (C ? 'Canlı · ' : '') + new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) + ' · ' + hm(h);
  $('cityWeather').innerHTML = weather(h, C); $('cityMatch').innerHTML = match(C); $('cityBreaking').innerHTML = breaking(C); $('cityStats').innerHTML = stats(C);
  renderNews(C, h);
}
let cityT = null;
if (window.MSWeather) MSWeather.load(d => { wxd = d; if (cityT) cityRender(); });   // önbellekteyse hemen döner

/* ---------- gezinme: uygulama açılır, geri ya da Esc ana ekrana döner. Tam ekran yalnızca elle (şehirde telefonun ⤢ düğmesi, tek başınayken sayfadaki düğme) ---------- */
let current = null, opener = null;
function setFull(on) { document.body.classList.toggle('full', on); const b = $('fullBtn'); if (b) { b.textContent = on ? '⤡' : '⤢'; b.setAttribute('aria-pressed', on); b.setAttribute('aria-label', on ? 'Telefon boyuna dön' : 'Tam ekran'); } }
if ($('fullBtn')) $('fullBtn').addEventListener('click', () => setFull(!document.body.classList.contains('full')));
function show(id) {
  const v = $(id); if (!v) return;
  if (current) current.hidden = true;
  opener = opener || document.activeElement; current = v; v.hidden = false;
  v.querySelector('.back').focus({ preventScroll: true });          // kayarken odaklanınca kap kaydırılmasın
  history.replaceState(null, '', '#' + id);
  clearInterval(cityT); if (id === 'city') { cityRender(); cityT = setInterval(cityRender, 2000); }
}
function home() {
  if (!current) return false;
  current.hidden = true; current = null; clearInterval(cityT);
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
