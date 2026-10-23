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
const LOC = window.MSLang ? MSLang.locale : 'tr-TR';
/* dil düğmesi (tek başınayken): TR / EN arasında geçer, sayfa yenilenir */
if ($('langBtn') && window.MSLang) { $('langBtn').textContent = MSLang.en ? 'TR' : 'EN'; $('langBtn').title = MSLang.en ? 'Türkçe' : 'English'; $('langBtn').addEventListener('click', () => MSLang.set(MSLang.en ? 'tr' : 'en')); }

/* ---------- ana ekran ---------- */
$('name').textContent = P.name || ''; $('role').textContent = P.role || ''; $('tagline').textContent = P.tagline || '';
$('status').textContent = P.status || ''; $('status').hidden = !P.status;
$('avatar').textContent = (P.name || '?').trim().charAt(0).toLocaleUpperCase('tr');
const SV = window.ICONS ? ICONS.svg : () => '', WXI = window.ICONS ? ICONS.wx : () => '';
const ICON = { github: ['github', '#2b3036'], linkedin: ['linkedin', '#0a66c2'], mail: ['mail', '#e2452b'], orcid: ['orcid', '#6e9a1f'], sponsor: ['sponsor', '#bf3989'], web: ['web', '#2f7bff'] };
const ico = kind => SV((ICON[kind] || ICON.web)[0]);
document.querySelectorAll('[data-icon]').forEach(e => { e.innerHTML = SV(e.dataset.icon); });   // ana ekran uygulama simgeleri
$('dockbar').innerHTML = (P.contact || []).filter(c => c.href).map(c => `<a class="app small" href="${esc(c.href)}" target="_blank" rel="noopener"><span class="ico" style="--c:${(ICON[c.kind] || ICON.web)[1]}">${ico(c.kind)}</span>${esc(c.label)}</a>`).join('');   // ana ekrandaki gibi simgenin altında adı
function tick() {
  const C = city();
  $('clock').textContent = hm(hourNow());
  $('date').textContent = new Date().toLocaleDateString(LOC, { weekday: 'long', day: 'numeric', month: 'long' }) + (C ? ' · Ankara' : '');
}
tick(); setInterval(tick, 1000);
document.querySelectorAll('.url').forEach(u => { u.innerHTML = `<i class="lk">${SV('lock')}</i>${esc(P.site || '')}/<b>${esc(u.dataset.path)}</b>`; });

/* ---------- Projeler, Hakkımda, İletişim ---------- */
/* projeler gruplu; GitHub'dan (anahtarsız, tek istek, tarayıcıda 1 saat saklanır) dil ve son güncelleme gelir. Yıldız bilerek gösterilmez */
const GH_KEY = 'ms.gh', LANG = { Python: '#3572A5', 'C#': '#178600', JavaScript: '#f1e05a', 'Jupyter Notebook': '#DA5B0B' };
let gh = null;
try { const c = JSON.parse(localStorage.getItem(GH_KEY)); if (c && c.repos) gh = c; } catch (e) {}
const ago = iso => {                                                   // yakınsa "3 gün önce", eskiyse ay ve yıl ("9 ay önce" gibi eski izlenimi vermesin)
  const d = Math.floor((Date.now() - Date.parse(iso)) / 864e5);
  return d < 1 ? 'bugün' : d < 2 ? 'dün' : d < 30 ? d + ' gün önce' : new Date(iso).toLocaleDateString(LOC, { month: 'long', year: 'numeric' });
};
function projectCard(p) {
  const here = p.live === '../index.html', r = gh && p.repo ? gh.repos[p.repo] : null;
  const go = (label, href, cls) => `<a${cls ? ` class="${cls}"` : ''} href="${esc(href)}" target="_blank" rel="noopener">${label}</a>`;
  const links = [
    here ? (embed ? '<span>Şu an içindesin</span>' : '<a href="../index.html">Şehre gir</a>') : p.live ? go('Canlı', p.live) : '',
    p.paper ? go('Makale', p.paper) : '',
    p.repo ? go('Kod', 'https://github.com/' + (P.github || '') + '/' + p.repo, 'ghost') : '',
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
  `<li><a href="${esc(c.href)}" target="_blank" rel="noopener"><span class="ri" aria-hidden="true" style="--c:${(ICON[c.kind] || ICON.web)[1]}">${ico(c.kind)}</span><span><b>${esc(c.label)}</b><small>${esc(c.value)}</small></span></a></li>`).join('');

/* ---------- Ankara Haber: hava, maç, son dakika olaylar, gündem, rakamlar ---------- */
const DOT = { fire: '#e2452b', accident: '#f2a516', crime: '#2f7bff', pedestrian: '#d6336c' };
/* hava: Ankara'nın canlı verisi (wxdata.js). Şehrin içindeyken şehrin aldığı, tek başınayken kendi isteği; ikisi aynı önbelleği paylaşır */
let wxd = null;
function weather(h, C) {
  const W = C && C.weather, d = (W && W.data) || wxd;
  if (!d) return `<div class="kicker">Ankara · Hava durumu · ${hm(h)}</div><h4>Hava bilgisi alınamadı</h4><p>Bağlantı gelince Ankara'nın anlık havası burada görünür.</p>`;
  const man = W && !W.live && W.KINDS ? W.KINDS[W.pick] : null;
  const days = (d.daily || []).slice(0, 3).map((x, i) => `<div><small>${i === 0 ? 'Bugün' : i === 1 ? 'Yarın' : esc(new Date(x.date + 'T12:00').toLocaleDateString(LOC, { weekday: 'long' }))}</small><span class="wi">${WXI(window.MSWeather ? MSWeather.code(x.code)[0] : 'cloud', true)}</span><b>${Math.round(x.max)}° <i>${Math.round(x.min)}°</i></b></div>`).join('');
  const age = Math.round((Date.now() - d.t) / 60000);
  return `<div class="kicker">Ankara · Hava durumu · ${hm(h)}</div><div class="big"><i class="wi">${WXI(man ? W.pick : d.kind, d.day)}</i>${Math.round(d.temp)}°<span>C</span></div>` +
    `<p>${esc(d.label)}. Hissedilen ${Math.round(d.feels)}°, nem %${Math.round(d.hum)}, ${esc(d.windFrom)} ${Math.round(d.wind)} km/sa rüzgâr.</p>` +
    (man ? `<p class="wx-man">Şehirde şu an elle seçilmiş hava: ${esc(man.label)}</p>` : '') +
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
  $('cityNow').textContent = (C ? 'Canlı · ' : '') + new Date().toLocaleDateString(LOC, { day: 'numeric', month: 'long' }) + ' · ' + hm(h);
  $('cityWeather').innerHTML = weather(h, C); $('cityMatch').innerHTML = match(C); $('cityBreaking').innerHTML = breaking(C); $('cityStats').innerHTML = stats(C);
  renderNews(C, h);
}
let cityT = null;
if (window.MSWeather) MSWeather.load(d => { wxd = d; if (cityT) cityRender(); });   // önbellekteyse hemen döner

/* ---------- canlı duvar kâğıdı: saate ve havaya göre gökyüzü, güneş ya da ay, yıldızlar, bulutlar, yağmur, kar, sis;
   önde gece pencereleri yanan, Atakule'li bir Ankara silueti. Şehrin içindeysek şehrin saati ve havası, değilse gerçek saat ve Ankara'nın havası ---------- */
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = c => `rgb(${c.join(',')})`;
const SKY = { night: ['#03060c', '#0b1424', '#17243e'], twi: ['#1c2a4a', '#7b4f6e', '#ff9a52'], day: ['#2f6fc4', '#7fb6ea', '#d3e6f5'] };
const GREY = { night: ['#090c11', '#12161d', '#20252e'], day: ['#77828d', '#9ea8b1', '#c2c9cf'] };
const CLOUDS = { clear: 0.05, partly: 0.45, overcast: 0.95, fog: 0.85, drizzle: 0.9, rain: 1, storm: 1, snow: 0.95 };
function skyline() {
  let sd = 20251; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
  let b = '', w = '';
  for (let x = -10; x < 810;) {
    const bw = 14 + r() * 26, tall = Math.abs(x - 300) < 90 ? 1.9 : Math.abs(x - 560) < 60 ? 1.35 : 1;   // solda Söğütözü, sağda Kızılay kuleleri
    const bh = Math.min(128, (16 + r() * 44) * tall), y = 150 - bh;
    if (Math.abs(x + bw / 2 - 432) > 18) {
      b += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(bw + 0.6).toFixed(1)}" height="${bh.toFixed(1)}"/>`;
      for (let wy = y + 6; wy < 146; wy += 7) for (let wx = x + 3; wx < x + bw - 3; wx += 5) if (r() < 0.17) w += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="2" height="3"/>`;
    }
    x += bw + (r() < 0.3 ? 2 + r() * 6 : 0);
  }
  const ata = '<path d="M428.5 150V46h7v104z"/><path d="M420 150l8.5-15v15zM444 150l-8.5-15v15z"/><ellipse cx="432" cy="41" rx="21" ry="6"/><ellipse cx="432" cy="35" rx="13" ry="6.5"/><path d="M431 29V7h2v22z"/>';   // Atakule
  return `<svg class="skyline" viewBox="0 0 800 150" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><g class="sil">${b}${ata}</g><g class="win">${w}<rect x="412" y="40" width="40" height="1.6"/></g><circle class="beacon" cx="432" cy="7" r="1.7"/></svg>`;
}
const wallEl = document.querySelector('.wall');
if (wallEl) wallEl.innerHTML = '<div class="stars"></div><div class="orb"></div><div class="clouds"><i></i><i></i><i></i><i></i></div><div class="precip"></div><div class="mist"></div>' + skyline();
let wallSig = '';
const wxKind = () => { const C = city(), W = C && C.weather; return W ? (W.live ? (W.data ? W.data.kind : 'clear') : W.pick) : wxd ? wxd.kind : 'clear'; };
function paintWall() {
  if (!wallEl) return;
  const C = city(), W = C && C.weather, h = hourNow(), kind = wxKind();
  const cloud = W && W.cur ? W.cur.cloud : wxd && /clear|partly/.test(kind) ? Math.min(wxd.cloud, kind === 'clear' ? 0.3 : 0.7) : CLOUDS[kind] || 0;
  const e = Math.sin((h - 6) / 12 * Math.PI), oc = cloud * cloud;
  const sky = i => { const n = hex(SKY.night[i]), t = hex(SKY.twi[i]), d = hex(SKY.day[i]); return e >= 0.3 ? d : e >= 0.05 ? mix(t, d, (e - 0.05) / 0.25) : e >= -0.15 ? mix(n, t, (e + 0.15) / 0.2) : n; };
  const grey = i => mix(hex(GREY.night[i]), hex(GREY.day[i]), cl(e * 4 + 0.35, 0, 1));
  const night = cl((0.12 - e) / 0.3, 0, 1), sun = e > -0.05;
  const a = cl(sun ? (h - 6) / 12 : ((h + 6) % 24) / 12, 0, 1);           // gündüz güneş, gece ay doğudan batıya
  const rain = kind === 'drizzle' ? 0.4 : kind === 'rain' ? 0.75 : kind === 'storm' ? 1 : 0, snow = kind === 'snow' ? 1 : 0;
  const cc = mix(mix(hex('#f4f6f8'), hex('#2b2e37'), night), hex('#8a929b'), rain * 0.6 * (1 - night));
  const V = { '--s1': rgb(mix(sky(0), grey(0), 0.85 * oc)), '--s2': rgb(mix(sky(1), grey(1), 0.85 * oc)), '--s3': rgb(mix(sky(2), grey(2), 0.85 * oc)),
    '--night': night.toFixed(2), '--cloud': cloud.toFixed(2), '--ox': (10 + 80 * a).toFixed(1) + '%', '--oy': (72 - 68 * Math.sin(a * Math.PI)).toFixed(1) + '%',   // öğlende saatin üstünde
    '--sil': rgb(mix(mix(hex('#3a4756'), hex('#5b636c'), oc), hex('#06090d'), night)),   // siluet gündüz puslu mavi, gece kara
    '--rain': rain, '--snow': snow, '--fog': kind === 'fog' ? 1 : 0, '--cc': rgb(cc) };
  const sig = JSON.stringify(V) + sun; if (sig === wallSig) return; wallSig = sig;
  for (const k in V) wallEl.style.setProperty(k, V[k]);
  wallEl.classList.toggle('sun', sun); wallEl.classList.toggle('rainy', rain > 0); wallEl.classList.toggle('snowy', snow > 0); wallEl.classList.toggle('stormy', kind === 'storm');
}

/* ---------- ana ekran araçları: Ankara'nın havası ve maç (şehirde canlı skor, değilse şehre giriş) ---------- */
let miniSig = '';
function paintMinis() {
  const el = $('minis'); if (!el) return;
  const C = city(), W = C && C.weather, d = (W && W.data) || wxd, h = hourNow(), kind = wxKind(), day = h >= 6.5 && h < 19;
  const lbl = W && !W.live && W.KINDS ? W.KINDS[W.pick].label : d ? d.label : 'Ankara';
  const wx = `<button class="mini" data-open="city"><span class="mi">${WXI(kind, day)}</span><b>${d ? Math.round(d.temp) + '°' : '—'}</b><small>${esc(lbl)}</small><small class="dim">Ankara</small></button>`;
  const M = C && C.match;
  let m;
  if (M && M.on && M.teams) m = `<button class="mini" data-open="city"><span class="mi">${SV('ball')}</span><b>${M.score[0]} - ${M.score[1]}</b><small>${esc(M.teams[0].short)} · ${esc(M.teams[1].short)}</small><small class="live">Canlı</small></button>`;
  else if (M && M.last) m = `<button class="mini" data-open="city"><span class="mi">${SV('ball')}</span><b>${M.last.score[0]} - ${M.last.score[1]}</b><small>Son maç</small><small class="dim">Sıradaki ${h < 13.5 ? '13.30' : h < 19 ? '19.00' : 'yarın'}</small></button>`;
  else if (C) m = `<button class="mini" data-open="city"><span class="mi">${SV('ball')}</span><b>${h < 13.5 ? '13.30' : h < 19 ? '19.00' : 'Yarın'}</b><small>Sıradaki maç</small><small class="dim">Ankara Stadı</small></button>`;
  else m = `<a class="mini" href="../index.html"><span class="mi">${SV('city')}</span><b>Şehre gir</b><small>Mikro Şehir</small><small class="dim">3B Ankara</small></a>`;
  const html = wx + m; if (html === miniSig) return; miniSig = html; el.innerHTML = html;
}

/* ---------- bildirim: şehirde yeni bir olay olunca üstten Ankara Haber bildirimi ---------- */
let lastEv, toastT = null;
function watchEvents() {
  const C = city(), log = C && C.eventLog, ev = log && log[0];
  if (lastEv === undefined) { lastEv = ev ? ev.id : null; return; }   // açılıştaki olaylar bildirim olmaz
  if (!ev || ev.id === lastEv) return;
  lastEv = ev.id;
  const t = $('toast'); if (!t) return;
  t.innerHTML = `<span class="ti">${SV('news')}</span><span class="tx"><b>Ankara Haber <i>şimdi</i></b><span>${esc(ev.title)} · ${esc(ev.place)}</span></span>`;
  t.hidden = false; t.classList.remove('in'); void t.offsetWidth; t.classList.add('in');
  clearTimeout(toastT); toastT = setTimeout(() => { t.classList.remove('in'); setTimeout(() => { if (!t.classList.contains('in')) t.hidden = true; }, 300); }, 5000);
}
if ($('toast')) $('toast').addEventListener('click', () => { $('toast').hidden = true; show('city'); });
function homeTick() { paintWall(); paintMinis(); watchEvents(); }
homeTick(); setInterval(homeTick, 1000);

/* ---------- gezinme: uygulama açılır, geri ya da Esc ana ekrana döner. Tam ekran yalnızca elle (şehirde telefonun ⤢ düğmesi, tek başınayken sayfadaki düğme) ---------- */
let current = null, opener = null;
function setFull(on) { document.body.classList.toggle('full', on); const b = $('fullBtn'); if (b) { b.textContent = on ? '⤡' : '⤢'; b.setAttribute('aria-pressed', on); b.setAttribute('aria-label', on ? 'Telefon boyuna dön' : 'Tam ekran'); } }
if ($('fullBtn')) $('fullBtn').addEventListener('click', () => setFull(!document.body.classList.contains('full')));
function show(id, from) {
  const v = $(id); if (!v) return;
  if (current && current !== v) current.hidden = true;
  opener = opener || document.activeElement; current = v; v.hidden = false;
  v.classList.remove('zoom', 'slide', 'out'); void v.offsetWidth;          // animasyon her açılışta yeniden başlasın
  const dv = $('device'), r = from && from.closest('.home') && from.getBoundingClientRect();
  if (r && dv) { const d = dv.getBoundingClientRect(); v.style.transformOrigin = `${r.left + r.width / 2 - d.left}px ${r.top + r.height / 2 - d.top}px`; v.classList.add('zoom'); }
  else v.classList.add('slide');
  v.querySelector('.back').focus({ preventScroll: true });          // kayarken odaklanınca kap kaydırılmasın
  history.replaceState(null, '', '#' + id);
  clearInterval(cityT); if (id === 'city') { cityRender(); cityT = setInterval(cityRender, 2000); }
}
function home() {
  if (!current) return false;
  const v = current; current = null; clearInterval(cityT);
  v.classList.remove('zoom', 'slide'); v.classList.add('out');
  setTimeout(() => { v.classList.remove('out'); if (current !== v) v.hidden = true; }, 190);
  history.replaceState(null, '', location.pathname + location.search);
  if (opener && opener.focus) opener.focus({ preventScroll: true }); opener = null;
  return true;
}
document.addEventListener('click', e => {
  const o = e.target.closest('[data-open]'); if (o) { show(o.dataset.open, o); return; }
  if (e.target.closest('[data-home]')) home();
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!home()) tell({ type: 'phone-close' });                       // ana ekrandaysa telefonu kapat
});
window.addEventListener('message', e => { if (e.data && e.data.type === 'phone-home') home(); });   // telefon kapanınca ana ekrana dön
const start = location.hash.slice(1); if (['projects', 'about', 'contact', 'city'].includes(start)) show(start);
})();
