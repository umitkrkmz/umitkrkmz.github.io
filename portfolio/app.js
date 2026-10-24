/* ===== app.js: telefon arayüzü: ana ekran, uygulamalar (Projeler, Hakkımda, İletişim, Ankara Haber, Harita, Ajanda, Kedidex, Lig; ikinci sayfada GitHub, Kamera, Mesajlar, Ayarlar), saat.
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
/* GitHub'dan gelen dil ve son güncelleme (kartta ve detay sayfasında) */
function metaOf(p) {
  const r = gh && p.repo ? gh.repos[p.repo] : null; if (!r) return '';
  const lang = r.lang ? `<span class="lang" style="--l:${LANG[r.lang] || '#8b949e'}">${esc(r.lang)}</span>` : '';
  return `<div class="meta">${lang}<span>Son güncelleme: ${esc(ago(r.pushed))}</span></div>`;
}
function projectCard(p) {
  const here = p.live === '../index.html';
  const go = (label, href, cls) => `<a${cls ? ` class="${cls}"` : ''} href="${esc(href)}" target="_blank" rel="noopener">${label}</a>`;
  const links = [
    p.detail ? `<button data-detail="${esc(p.slug)}">Ayrıntılar</button>` : '',
    here ? (embed ? '<span>Şu an içindesin</span>' : '<a href="../index.html">Şehre gir</a>') : p.live ? go('Canlı', p.live) : '',
    p.paper ? go('Makale', p.paper) : '',
    p.repo ? go('Kod', 'https://github.com/' + (P.github || '') + '/' + p.repo, 'ghost') : '',
    p.extra ? go(esc(p.extra[0]), p.extra[1], 'ghost') : ''
  ].join('');
  const title = p.detail ? `<button class="tlink" data-detail="${esc(p.slug)}">${esc(p.title)}</button>` : esc(p.title);
  return `<article class="card proj"><h4>${title}</h4>${metaOf(p)}<p>${esc(p.desc)}</p>${p.cite ? `<p class="cite">${esc(p.cite)}</p>` : ''}<ul class="chips">${(p.tags || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul><div class="links">${links}</div></article>`;
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
/* ---------- proje detayı: blog yazısı gibi (details.js). Metinler { tr, en }, dile göre seçilir; görsel ve bağlantıda {l} tr ya da en.
   Bölüm blokları: h, p, quote, list, rows ([ad, açıklama]), code (komut, kopyalanır), diagram (kopyalanmaz), img / imgs, actions (kurulum kartları).
   '#projects/<slug>' bağlantısı başka bir projenin detayını açar. Son sürüm GitHub'dan (anahtarsız, depo başına 1 saat saklanır) ---------- */
const LG = window.MSLang && MSLang.en ? 'en' : 'tr', lz = s => String(s).replace(/\{l\}/g, LG);
const tx = v => v && typeof v === 'object' && !Array.isArray(v) ? (LG === 'en' ? v.en : v.tr) : v;
const REL_KEY = 'ms.rel';
let rel = {}; try { rel = JSON.parse(localStorage.getItem(REL_KEY)) || {}; } catch (e) {}
const fig = ([src, cap, kind]) => `<figure class="shot${kind ? ' ' + esc(kind) : ''}"><img src="${esc(lz(src))}" alt="${esc(tx(cap) || '')}" loading="lazy" decoding="async">${cap ? `<figcaption>${esc(tx(cap))}</figcaption>` : ''}</figure>`;
const linkTo = ([k, h], cls) => h.startsWith('#projects/') ? `<button${cls ? ` class="${cls}"` : ''} data-detail="${esc(h.slice(10))}">${esc(tx(k))}</button>`
  : `<a${cls ? ` class="${cls}"` : ''} href="${esc(lz(h))}" target="_blank" rel="noopener">${esc(tx(k))}</a>`;
const codeBox = c => `<div class="code"><pre><code>${esc(tx(c))}</code></pre><button class="copy" type="button">Kopyala</button></div>`;
const rowsOf = list => `<ul class="skillrows">${list.map(([k, v]) => `<li><b>${esc(tx(k))}</b><span>${esc(tx(v))}</span></li>`).join('')}</ul>`;
const relText = p => rel[p.repo] ? rel[p.repo].tag + ' · ' + ago(rel[p.repo].date) : null;
function block(s) {
  return (s.h ? `<h3>${esc(tx(s.h))}</h3>` : '') + (s.p || []).map(t => `<p>${esc(tx(t))}</p>`).join('') +
    (s.quote ? `<blockquote>${esc(tx(s.quote))}</blockquote>` : '') +
    (s.list ? `<ul class="bul">${s.list.map(t => `<li>${esc(tx(t))}</li>`).join('')}</ul>` : '') +
    (s.rows ? rowsOf(s.rows) : '') + (s.code ? codeBox(s.code) : '') + (s.diagram ? `<div class="code"><pre><code>${esc(tx(s.diagram))}</code></pre></div>` : '') + (s.img ? fig(s.img) : '') +
    (s.imgs ? `<div class="shots${s.imgs.some(i => i[2] === 'phone') ? ' with-phone' : ''}">${s.imgs.map(fig).join('')}</div>` : '') +
    (s.actions ? `<div class="acts">${s.actions.map(x => `<div class="act"><b>${esc(tx(x.t))}</b><p>${esc(tx(x.d))}</p>${x.code ? codeBox(x.code) : ''}<div class="links">${(x.links || []).map((l, i) => linkTo(l, i ? 'ghost' : '')).join('')}</div></div>`).join('')}</div>` : '') +
    (s.after || []).map(t => `<p>${esc(tx(t))}</p>`).join('');
}
/* bağlantılar (Kod, İndir, Kılavuz…): başlığın altında ve yazının sonunda */
const detailLinks = p => (p.repo ? `<a href="${esc('https://github.com/' + (P.github || '') + '/' + p.repo)}" target="_blank" rel="noopener">Kod</a>` : '') + (p.detail.links || []).map(l => linkTo(l, 'ghost')).join('');
/* bölümler başlığa göre gruplanır (başlıksız blok öncekine eklenir); geniş ekranda solda içindekiler, aktif bölüm vurgulu (Scrollspy) */
function detailHtml(p) {
  const d = p.detail;
  const facts = (d.facts || []).map(([k, v, live]) => `<div><small>${esc(tx(k))}</small><b${live ? ` data-live="${esc(live)}"` : ''}>${esc((live === 'release' && relText(p)) || tx(v))}</b></div>`).join('');
  const cover = d.gen && window.GEN ? `<div class="cover"><canvas class="gen" data-gen="${esc(d.gen)}" aria-hidden="true"></canvas></div>` : '';
  const nums = d.nums ? `<div class="nums">${d.nums.map(([v, l]) => `<div><b>${esc(tx(v))}</b><small>${esc(tx(l))}</small></div>`).join('')}</div>` : '';
  const groups = [{ id: 'sec-top', h: 'Özet', html: `<div class="bento">${cover}<p class="lead">${esc(tx(d.lead) || p.desc)}</p>${nums}<div class="facts">${facts}</div></div><ul class="chips">${(p.tags || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul>${d.hero ? fig([d.hero[0], d.hero[1], 'hero']) : ''}` }];
  for (const s of d.sections || []) { if (s.h) groups.push({ id: 'sec-' + groups.length, h: tx(s.h), html: '' }); groups[groups.length - 1].html += block(s); }
  if (p.repo) groups.push({ id: 'sec-rel', h: 'Sürümler', html: `<h3>Sürümler</h3><div class="tl" data-repo="${esc(p.repo)}"><p class="empty">Sürümler yükleniyor…</p></div>` });
  if (d.stack) groups.push({ id: 'sec-stack', h: 'Teknolojiler', html: `<h3>Teknolojiler</h3>${rowsOf(d.stack)}` });
  const sky = skyOf(p.slug);   // Bağlantılı projeler: takımyıldızındaki öbür projeler (nedeni details.js related'da), bağımsız yıldızda not
  if (sky && sky.c) {
    const sib = sky.c.nodes.filter(n => n[0] && n[0] !== p.slug).map(n => (P.projects || []).find(x => x.slug === n[0])).filter(Boolean);
    const why = sl => { const r = (d.related || []).find(r => r[0] === sl); return r ? tx(r[1]) : tx(sky.c.sub); };
    groups.push({ id: 'sec-links', h: 'Bağlantılı projeler', html: `<h3>Bağlantılı projeler</h3><p class="skyof"><b>${esc(sky.code)}</b> · ${esc(sky.c.name)} <span>takımyıldızı</span> · <button type="button" data-sky="${esc(p.slug)}">Gökyüzünde gör</button></p><div class="rel">${sib.map(q =>
      `<button type="button" class="relc" data-detail="${esc(q.slug)}" style="--rc:${esc((q.detail && q.detail.theme) || '#ffb53d')}"><b>${esc(q.title)}</b><span>${esc(why(q.slug))}</span></button>`).join('')}</div>` });
  } else if (sky) groups.push({ id: 'sec-links', h: 'Bağımsız yıldız', html: `<h3>Bağımsız yıldız</h3><p class="skyof"><b>${esc(sky.star)}</b> · <span>Hiçbir takımyıldıza bağlı değil; kendi başına parlıyor.</span> · <button type="button" data-sky="${esc(p.slug)}">Gökyüzünde gör</button></p>` });
  const toc = `<nav class="toc" aria-label="İçindekiler"><b>İçindekiler</b><ul>${groups.map(g => `<li><a href="#${g.id}" data-sec="${g.id}">${esc(g.h)}</a></li>`).join('')}</ul><div class="links">${detailLinks(p)}</div></nav>`;
  const media = h => (h.match(/<figure class="shot"/g) || []).length === 1 && !h.includes('class="shots') && /<p>|class="bul"/.test(h);
  return `<div class="post-wrap">${toc}<article class="post">${groups.map(g => `<section class="sec${g.id !== 'sec-top' && media(g.html) ? ' media' : ''}" id="${g.id}">${g.html}</section>`).join('')}<div class="links">${detailLinks(p)}</div></article></div>`;
}
let tocPin = null;   // içindekilerden tıklanan bölüm: başlığı yukarı çıkamasa da (sayfa sonu) işaretli kalır, kullanıcı kaydırınca bırakılır
function tocSpy() {
  const body = $('pjBody');
  if (!body.dataset.spy) {                                            // #pjBody kalıcı, dinleyiciler bir kez
    body.dataset.spy = 1; let raf = 0;
    body.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; tocMark(); }); }, { passive: true });
    for (const ev of ['wheel', 'touchstart', 'pointerdown', 'keydown']) body.addEventListener(ev, () => { tocPin = null; }, { passive: true });
  }
  tocPin = null; tocMark();
}
function tocMark() {   // etkin bölüm: başı kabın üst çeyreğini geçen son bölüm; en alta gelinince son bölüm (kısa son bölümler o banda hiç çıkamaz)
  const body = $('pjBody'), links = [...body.querySelectorAll('.toc [data-sec]')]; if (!links.length) return;
  let id = tocPin;
  if (!id) {
    const secs = [...body.querySelectorAll('.post .sec')], line = body.getBoundingClientRect().top + body.clientHeight * 0.25;
    for (const x of secs) if (!id || x.getBoundingClientRect().top <= line) id = x.id;
    if (secs.length && body.scrollTop + body.clientHeight >= body.scrollHeight - 4) id = secs[secs.length - 1].id;
  }
  links.forEach(a => a.classList.toggle('on', a.dataset.sec === id));
}
/* detay açılınca: tema rengi, canlı kapak, kaydırmada belirme, okuma çubuğu, sürüm zaman çizelgesi */
const BG = { city: 'stars', schema: 'stars', download: 'dots', stego: 'dots', rag: 'grid', graph: 'grid', vectors: 'grid', uic: 'grid', lorenz: 'rings', layers: 'rings', packets: 'lines' };
const REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
let rvObs = null;
function detailFx(p) {
  const v = $('project'), body = $('pjBody'), d = p.detail;
  v.style.setProperty('--pa', d.theme || 'var(--accent)');
  v.dataset.bg = BG[d.gen] || 'dots';                                 // arka plan deseni kapağın türüne göre (style.css #project[data-bg])
  const cv = body.querySelector('canvas.gen'); if (cv && window.GEN) GEN.mount(cv, cv.dataset.gen, d.theme);
  if (rvObs) rvObs.disconnect();
  if (!REDUCE && window.IntersectionObserver) {
    const secs = [...body.querySelectorAll('.sec')].slice(1); secs.forEach(s => s.classList.add('rv'));
    rvObs = new IntersectionObserver(es => { for (const e of es) if (e.isIntersecting) { e.target.classList.add('in'); rvObs.unobserve(e.target); } }, { root: body, rootMargin: '0px 0px -8% 0px' });
    secs.forEach(s => rvObs.observe(s));
  }
  barSync();
  const tl = body.querySelector('.tl[data-repo]'); if (tl) releases(tl.dataset.repo).then(list => drawTimeline(tl, list)).catch(() => { tl.innerHTML = '<p class="empty">Sürüm bilgisi alınamadı.</p>'; });
}
function barSync() { const b = $('pjBody'), m = b.scrollHeight - b.clientHeight; $('pjBar').style.width = (m > 0 ? Math.min(100, b.scrollTop / m * 100) : 0) + '%'; }
if ($('pjBody')) $('pjBody').addEventListener('scroll', barSync, { passive: true });
/* GitHub sürümleri (anahtarsız, depo başına 6 saat saklanır) */
const RELS_KEY = 'ms.rels';
let rels = {}; try { rels = JSON.parse(localStorage.getItem(RELS_KEY)) || {}; } catch (e) {}
function releases(repo) {
  const c = rels[repo]; if (c && Date.now() - c.t < 216e5) return Promise.resolve(c.list);
  return fetch('https://api.github.com/repos/' + encodeURIComponent(P.github) + '/' + encodeURIComponent(repo) + '/releases?per_page=40').then(r => r.ok ? r.json() : Promise.reject(r.status)).then(a => {
    const list = a.filter(x => !x.draft).map(x => ({ tag: x.tag_name, date: x.published_at || x.created_at })).sort((p, q) => Date.parse(p.date) - Date.parse(q.date));
    rels[repo] = { t: Date.now(), list }; try { localStorage.setItem(RELS_KEY, JSON.stringify(rels)); } catch (e) {}
    return list;
  });
}
function drawTimeline(el, list) {
  if (!list.length) { el.innerHTML = '<p class="empty">Henüz yayımlanmış sürüm yok.</p>'; return; }
  const t0 = Date.parse(list[0].date), t1 = Date.parse(list[list.length - 1].date), span = Math.max(1, t1 - t0), fmt = s => new Date(s).toLocaleDateString(LOC, { day: 'numeric', month: 'short', year: 'numeric' });
  const step = Math.max(1, Math.ceil(list.length / 7)), label = (k) => k === 0 || k === list.length - 1 || k % step === 0;
  const dots = list.map((r, k) => { const x = list.length === 1 ? 50 : 4 + (Date.parse(r.date) - t0) / span * 92;
    return `<i class="d${label(k) ? ' lab' : ''}${k % 2 ? ' dn' : ''}" style="left:${x.toFixed(2)}%" title="${esc(r.tag)} · ${esc(fmt(r.date))}">${label(k) ? `<span>${esc(r.tag)}</span>` : ''}</i>`; }).join('');
  el.innerHTML = `<div class="tlbar">${dots}</div><p class="src">${list.length} sürüm · ${esc(fmt(list[0].date))} – ${esc(fmt(list[list.length - 1].date))}</p>`;
}
/* Projeler sayfası: takımyıldızlar. Üç tematik küme (çizgiler yalnızca kendi içinde) ve üç bağımsız yıldız; boş yıldızlar henüz
   proje olmayan yerler. Konumlar sahnenin yüzdesi, iki yerleşim: geniş [x, y] ve dar ekranda dikey [px, py]. Düğüm
   [slug | null, yıldız kodu, x, y, px, py, parlak], bağımsız yıldız [slug, ad, x, y, px, py, efekt], küme adı lab [x, y, px, py].
   Yıldız kodları gerçek (Bayer ya da Flamsteed). Dokununca proje açılır, üzerine gelince takımyıldızın adı belirir; kenara taşan etiketler
   ölçülüp içeri kaydırılır. Gökyüzü bütün Projeler ekranının arka planı (style.css #projects). Detay sayfalarındaki "Bağlantılı projeler"
   de buradan: aynı kümedeki projeler (skyOf), nedenleri details.js related'da */
const STARS = {
  clusters: [
    { id: 'lynx', name: 'Lynx', sub: { tr: 'Steganografi ve analiz', en: 'Steganography and analysis' }, lab: [21, 15, 26, 7],
      nodes: [['chaotic-audio', 'α Lyncis', 12, 50, 16, 24, 1], ['stegotester', 'Alsciaukat (31 Lyn)', 23, 33, 38, 16], ['ui2py', '38 Lyncis', 28, 63, 54, 28],
        [null, '15 Lyncis', 6, 25, 8, 15], [null, '21 Lyncis', 36, 46, 74, 19]],
      links: [[0, 1], [1, 3], [1, 4], [0, 2], [2, 4]] },
    { id: 'reticulum', name: 'Reticulum', sub: { tr: 'Ağ ve DPI aşma', en: 'Networking and DPI bypass' }, lab: [53, 5, 30, 35],
      nodes: [['zerodivert', 'α Reticuli', 53, 18, 66, 36, 1], ['limbo', 'ζ Reticuli', 45, 37, 44, 43], [null, 'β Reticuli', 61, 38, 84, 42], [null, 'ε Reticuli', 53, 54, 64, 49]],
      links: [[0, 1], [1, 3], [3, 2], [2, 0], [0, 3]] },
    { id: 'norma', name: 'Norma', sub: { tr: 'AI mühendisliği ve korkuluklar', en: 'AI engineering and guardrails' }, lab: [82, 9, 72, 54],
      nodes: [['how-ai-actually-works', 'γ² Normae', 75, 29, 30, 57, 1], ['ai-context-mapping', 'ε Normae', 88, 48, 62, 65], [null, 'δ Normae', 92, 21, 10, 51], [null, 'η Normae', 72, 52, 34, 68]],
      links: [[2, 0], [0, 3], [3, 1]] },
    { id: 'leo', name: 'Leo', sub: { tr: 'Kurumsal veri', en: 'Enterprise data' }, lab: [53, 74, 74, 74],
      nodes: [['kurumsal-bilgi', 'Regulus (α Leo)', 16, 86, 15, 84, 1], ['sqlschema', 'Denebola (β Leo)', 40, 90, 36, 92], [null, 'γ Leonis', 22, 73, 30, 77], [null, 'δ Leonis', 34, 78, 56, 79]],
      links: [[0, 2], [2, 3], [3, 1], [1, 0]] }
  ],
  solo: [['mikro-sehir', 'Sirius', 72, 78, 70, 90, 'pulse'], ['mediagrab', 'Altair', 93, 88, 90, 80]]
};
const GHOST = [{ tr: 'Keşfedilmemiş sektör', en: 'Uncharted sector' }, { tr: 'Geliştirme aşamasında', en: 'In development' }];
let constelHot = null;
function skySpot(sl) {   // Gökyüzünde gör: göğe kaydır, takımyıldızını yak, yıldızı birkaç saniye parlat
  const box = $('constel'), pb = $('projects').querySelector('.body'); if (!box || !pb) return;
  pb.scrollTo({ top: Math.max(0, box.offsetTop - 12), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  const n = box.querySelector(`.cn[data-detail="${CSS.escape(sl)}"]`); if (!n) return;
  box.querySelectorAll('.cn.spot').forEach(e => e.classList.remove('spot'));
  void n.offsetWidth; n.classList.add('spot'); if (constelHot) constelHot(n.dataset.k || null);
  clearTimeout(skySpot.t); skySpot.t = setTimeout(() => { n.classList.remove('spot'); if (constelHot) constelHot(null); }, 4400);
}
function skyOf(sl) {   // { c: küme, code } ya da { star } (bağımsız) ya da null
  for (const c of STARS.clusters) { const n = c.nodes.find(n => n[0] === sl); if (n) return { c, code: n[1] }; }
  const s = STARS.solo.find(n => n[0] === sl); return s ? { star: s[1] } : null;
}
function drawConstel() {
  const box = $('constel'); if (!box) return;
  const byS = new Map((P.projects || []).map(p => [p.slug, p])), col = sl => (byS.get(sl) && byS.get(sl).detail && byS.get(sl).detail.theme) || '#ffb53d';
  let tall = null;
  const render = () => {
    const k = tall ? 2 : 0, at = (x, y) => `left:${x}%;top:${y}%`;
    let gi = 0, lines = '', nodes = '', labels = '';
    for (const c of STARS.clusters) {
      for (const [a, b] of c.links) { const p = c.nodes[a].slice(2 + k), q = c.nodes[b].slice(2 + k); lines += `<line class="k-${c.id}" x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/>`; }
      labels += `<div class="skyname k-${c.id}" style="${at(c.lab[k], c.lab[k + 1])}"><b>${esc(c.name)}</b><small>${esc(tx(c.sub))}</small></div>`;
      for (const n of c.nodes) {
        const [sl, code, main] = [n[0], n[1], n[6]], pos = at(n[2 + k], n[3 + k]);
        if (!sl) { nodes += `<span class="cn ghost" data-k="${c.id}" style="${pos}" tabindex="0"><i></i><small>${esc(code)}</small><em>${esc(tx(GHOST[gi++ % GHOST.length]))}</em></span>`; continue; }
        const p = byS.get(sl); if (!p) continue;
        nodes += `<button type="button" class="cn${main ? ' main' : ''}" data-k="${c.id}" data-detail="${esc(sl)}" style="${pos};--rc:${esc(col(sl))}"><i></i><span>${esc(p.title)}</span><small>${esc(code)}</small></button>`;
      }
    }
    for (const n of STARS.solo) {
      const [sl, star, fx] = [n[0], n[1], n[6]], p = byS.get(sl); if (!p) continue;
      nodes += `<button type="button" class="cn solo${fx ? ' ' + fx : ''}" data-detail="${esc(sl)}" style="${at(n[2 + k], n[3 + k])};--rc:${esc(col(sl))}"><i></i><span>${esc(p.title)}</span><small>${esc(star)} · <span>Bağımsız yıldız</span></small></button>`;
    }
    box.classList.toggle('tall', tall);
    box.innerHTML = `<h3 class="group">Takımyıldızlar</h3><div class="cstage"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>${labels}${nodes}</div>`;
  };
  const clamp = () => {   // etiketi sahnenin içine kaydır: .cn kutusu --dx kadar kayar, nokta geri kaydırılıp yerinde kalır (kutu taşarsa yatay kaydırma açılırdı)
    const st = box.querySelector('.cstage'); if (!st) return; const W = st.clientWidth;
    st.querySelectorAll('.cn, .skyname').forEach(e => {
      e.style.setProperty('--dx', '0px'); const x = e.offsetLeft, hw = Math.max(...[...e.children].map(c => c.offsetWidth)) / 2;
      e.style.setProperty('--dx', Math.round(Math.max(0, 6 - (x - hw)) - Math.max(0, x + hw - (W - 6))) + 'px');
    });
  };
  // gizliyken (genişlik 0) yerleşim değişmesin: yoksa geri dönünce yeniden çizilir, Gökyüzünde gör parıltısı silinir
  const fit = () => { if (!box.clientWidth) return; const t = box.clientWidth < 560; if (t !== tall) { tall = t; render(); } clamp(); };
  fit();
  if (window.ResizeObserver) new ResizeObserver(fit).observe(box);
  if (document.fonts) document.fonts.ready.then(clamp);
  const hot = constelHot = k => box.querySelectorAll('[class*="k-"]').forEach(e => e.classList.toggle('on', !!k && e.classList.contains('k-' + k)));
  box.addEventListener('mouseover', e => { const n = e.target.closest('.cn'); hot(n && n.dataset.k); });
  box.addEventListener('focusin', e => { const n = e.target.closest('.cn'); hot(n && n.dataset.k); });
  box.addEventListener('mouseleave', () => hot(null));
  const pv = $('projects'), pb = pv && pv.querySelector('.body');   // yakın yıldız tozu kaydırınca yavaşça kayar: derinlik
  if (pb) pb.addEventListener('scroll', () => pv.style.setProperty('--sy', (-pb.scrollTop * 0.12).toFixed(1) + 'px'), { passive: true });
}
drawConstel();
/* kopyala: panoya yazılamazsa (eski tarayıcı, izin yok) seçili metinle dener */
function copyText(t) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t);
  const a = document.createElement('textarea'); a.value = t; a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select();
  try { document.execCommand('copy'); } finally { a.remove(); }
  return Promise.resolve();
}
function openDetail(slug, from) {
  const p = (P.projects || []).find(x => x.slug === slug); if (!p || !p.detail) return;
  const v = $('project');
  v.querySelector('.url').innerHTML = `<i class="lk">${SV('lock')}</i>${esc(P.site || '')}/<b>projeler/${esc(slug)}</b>`;
  $('pjTitle').textContent = p.title; v.dataset.slug = slug; $('pjSub').innerHTML = metaOf(p) + `<div class="links top">${detailLinks(p)}</div>`; $('pjBody').innerHTML = detailHtml(p);
  show('project', from); history.replaceState(null, '', '#projects/' + slug);
  $('pjBody').scrollTop = 0;                                          // görünür olduktan sonra: gizliyken atanan kaydırma yok sayılır, önceki detayın yeri kalırdı
  tocSpy(); detailFx(p);
  const c = rel[p.repo];
  if (p.repo && P.github && !(c && Date.now() - c.t < 36e5)) {
    fetch('https://api.github.com/repos/' + encodeURIComponent(P.github) + '/' + encodeURIComponent(p.repo) + '/releases/latest').then(r => r.ok ? r.json() : Promise.reject(r.status)).then(x => {
      rel[p.repo] = { t: Date.now(), tag: x.tag_name, date: x.published_at }; try { localStorage.setItem(REL_KEY, JSON.stringify(rel)); } catch (e) {}
      const b = $('pjBody').querySelector('[data-live="release"]'); if (b) b.textContent = relText(p);
    }).catch(() => {});                                                 // yayın yoksa ya da ağ yoksa elle yazılan sürüm kalır
  }
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

/* ---------- Harita, Ajanda, Kedidex: şehrin canlı verisinden (window.parent.C). Bir yere dokununca telefon kapanır, kamera oraya uçar.
   Tek başınayken harita yerine şehre giriş, ajandada sabit saatler, Kedidex'te kaydedilen koleksiyon (localStorage, şehirle aynı köken) ---------- */
const V3 = (x, y, z) => new window.parent.THREE.Vector3(x, y, z);
const inGame = C => !!(C.player && (C.player.active || C.player.entering));
/* bir yere uç: telefonu kapatır; oyundayken kamera karakteri izlediği için uçmaz */
function goTo(C, f) {
  if (!C || !C.flyTo || inGame(C)) return false;
  if (C.phone) C.phone.close();
  setTimeout(f, 60);
  return true;
}
const flyAbove = (C, x, z) => {                                       // kuş bakışından o noktaya: bakış yönü korunur
  const cam = C.camera.position, tg = C.controls.target, d = V3(cam.x - tg.x, cam.y - tg.y, cam.z - tg.z), L = Math.min(260, Math.max(140, d.length()));
  d.normalize(); if (d.y < 0.5) { d.y = 0.75; d.normalize(); }
  C.flyTo(V3(x + d.x * L, d.y * L, z + d.z * L), V3(x, 0, z), 1800);
};
const flyNear = (C, x, z, r, h) => C.flyTo(V3(x + r, h, z + r), V3(x, 0.8, z), 2000);

/* yerler: haritada işaret ve altındaki listede satır */
function places(C) {
  const out = [], M = C.match, club = C.cats && C.cats.club ? C.cats.club() : null, h = C.hour;
  const D = C.developer;
  if (D) out.push({ k: 'dev', x: D.x, z: D.z, col: '#ffb53d', label: P.name || 'Geliştirici', sub: D.where ? D.where() : '', go: () => C.findDeveloper && C.findDeveloper() });
  if (C.hero && C.hero.pos) out.push({ k: 'hero', x: C.hero.pos.x, z: C.hero.pos.z, col: '#e23b3b', label: 'Pijamalı Çocuk', sub: C.hero.task ? 'Hırsızın peşinde' : 'Çatılarda devriyede', go: () => flyNear(C, C.hero.pos.x, C.hero.pos.z, 22, 26) });
  for (const ev of C.activeEvents || []) out.push({ k: 'ev', type: ev.type, x: ev.x, z: ev.z, col: DOT[ev.type] || '#ffb53d', label: ev.title + ' · ' + ev.place, sub: ev.status, go: () => { const [p, t] = ev.view(); C.flyTo(p, t, 2200); } });
  const st = (C.landmarks || []).find(l => l.type === 'stadium');
  if (st) {
    const pp = C.matchPostponed && [13.5, 19].find(s => C.matchPostponed(s));
    const sub = pp ? 'Maç fırtına nedeniyle ertelendi' : M && M.on ? (M.ph === 'pre' ? 'Tribünler doluyor' : M.ph === 'half' ? 'Devre arası · ' + M.score.join('-') : `Maç sürüyor · ${Math.floor(M.min)}' · ${M.score.join('-')}`) : 'Sıradaki maç ' + (h < 13.5 ? '13.30' : h < 19 ? '19.00' : 'yarın 13.30');
    out.push({ k: 'stadium', x: st.bx, z: st.bz, col: '#5ec27a', label: 'Ankara Stadı', sub, live: !!(M && M.on), go: () => { const [p, t] = C.clearView(st); C.flyTo(p, t, 2200); } });
  }
  if (club) {
    const on = h >= 21.5 || h < 1, ag = C.cats.agenda ? C.cats.agenda().title : '';
    out.push({ k: 'cats', x: club.x, z: club.z, col: '#c48bff', label: 'Kedi meclisi', sub: on ? 'Şu an toplantıda: ' + ag : 'Bu gece 21.30, gündem: ' + ag, live: on, go: () => flyNear(C, club.x, club.z, 9, 8) });
  }
  return out;
}
const LM_LETTER = { hospital: 'H', fire: 'İ', police: 'P', stadium: 'S' };
let mapBase = null, mapHits = [], mapPlaces = [];
/* sabit katman: yollar, semt renginde bloklar, parklar, meydan, önemli yapılar, semt adları (bir kez çizilir) */
function mapBaseOf(C, W) {
  if (mapBase && mapBase.width === W) return mapBase;
  const cv = document.createElement('canvas'); cv.width = cv.height = W; const x = cv.getContext('2d'), T = C.TOTAL, k = W / T, b = C.BLOCK * k;
  x.fillStyle = '#262c33'; x.fillRect(0, 0, W, W);
  for (const blk of C.blocks || []) {
    const u = (blk.bx + T / 2) * k - b / 2, v = (blk.bz + T / 2) * k - b / 2, d = C.districtAt(blk.bx, blk.bz);
    x.fillStyle = blk.kind === 'park' ? '#3d7a4b' : blk.kind === 'plaza' ? '#cbc5b6' : d.tint; x.globalAlpha = blk.kind === 'city' ? 0.5 : blk.kind === 'landmark' ? 0.75 : 0.9;
    x.beginPath(); x.roundRect ? x.roundRect(u, v, b, b, b * 0.12) : x.rect(u, v, b, b); x.fill();
  }
  x.globalAlpha = 1; x.textAlign = 'center'; x.textBaseline = 'middle';
  for (const L of C.landmarks || []) {
    const u = (L.bx + T / 2) * k, v = (L.bz + T / 2) * k;
    const lr = Math.max(b * 0.42, W / 44);
    x.fillStyle = '#10161c'; x.strokeStyle = 'rgba(238, 242, 244, .7)'; x.lineWidth = Math.max(1, W / 400); x.beginPath(); x.arc(u, v, lr, 0, 7); x.fill(); x.stroke();
    x.fillStyle = '#eef2f4'; x.font = `700 ${Math.round(lr * 1.15)}px 'IBM Plex Sans', sans-serif`; x.fillText(LM_LETTER[L.type] || '•', u, v + 1);
  }
  x.font = `800 ${Math.round(W / 26)}px 'Big Shoulders Display', 'Arial Narrow', sans-serif`;
  for (const d of C.DISTRICTS) { x.fillStyle = 'rgba(8, 11, 14, .55)'; const tw = x.measureText(d.name.toLocaleUpperCase('tr')).width; const u = (d.cx + T / 2) * k, v = (d.cz + T / 2) * k; x.fillRect(u - tw / 2 - 5, v - W / 48, tw + 10, W / 24); x.fillStyle = '#eef2f4'; x.fillText(d.name.toLocaleUpperCase('tr'), u, v + 1); }
  return (mapBase = cv);
}
function mapRender() {
  const C = city(), cv = $('mapCanvas'), list = $('mapList'), note = $('mapNote');
  const ok = !!(C && C.blocks && C.blocks.length && C.TOTAL);
  $('mapWrap').hidden = !ok; $('mapOff').hidden = ok; if (!ok) { list.innerHTML = ''; return; }
  /* liste: her işaretin satırı ve Git (tuval henüz ölçülmemiş olsa da) */
  const game = inGame(C); mapPlaces = places(C);
  note.textContent = game ? 'Oyundayken kamera karakteri izler; haritadan uçmak için oyundan çık.' : 'Bir işarete ya da haritada bir yere dokun: kamera oraya uçar.';
  const html = mapPlaces.map((p, i) => `<li><span class="dot" style="--d:${p.col}"></span><span class="tx"><b>${esc(p.label)}</b><small>${esc(p.sub)}</small></span>${game ? '' : `<button data-go="${i}">Git</button>`}</li>`).join('');
  if (list.dataset.h !== html) { list.dataset.h = html; list.innerHTML = html; }
  const W = Math.round(cv.clientWidth * (window.devicePixelRatio || 1)); if (!W) return;
  if (cv.width !== W) { cv.width = cv.height = W; }
  const x = cv.getContext('2d'), T = C.TOTAL, k = W / T, pulse = 0.5 + 0.5 * Math.sin(Date.now() / 260);
  x.drawImage(mapBaseOf(C, W), 0, 0);
  /* kamera: baktığı nokta ve yön */
  const tg = C.controls.target, cam = C.camera.position, a = Math.atan2(tg.z - cam.z, tg.x - cam.x), cu = (tg.x + T / 2) * k, cvv = (tg.z + T / 2) * k, R = W / 9;
  x.fillStyle = 'rgba(255, 255, 255, .16)'; x.beginPath(); x.moveTo(cu, cvv); x.arc(cu, cvv, R, a - 0.5, a + 0.5); x.closePath(); x.fill();
  x.fillStyle = '#fff'; x.beginPath(); x.arc(cu, cvv, W / 110, 0, 7); x.fill();
  mapHits = [];
  for (const p of mapPlaces) {
    const u = (p.x + T / 2) * k, v = (p.z + T / 2) * k, r = W / 46;
    if (p.k === 'ev' || p.live) { x.strokeStyle = p.col; x.globalAlpha = 1 - pulse * 0.7; x.lineWidth = W / 220; x.beginPath(); x.arc(u, v, r * (1.4 + pulse * 1.4), 0, 7); x.stroke(); x.globalAlpha = 1; }
    x.fillStyle = p.col; x.strokeStyle = '#0b0f13'; x.lineWidth = W / 300;
    x.beginPath(); if (p.k === 'hero') { x.moveTo(u, v - r * 1.2); x.lineTo(u + r, v); x.lineTo(u, v + r * 1.2); x.lineTo(u - r, v); x.closePath(); } else x.arc(u, v, r, 0, 7); x.fill(); x.stroke();
    if (p.k === 'dev') { x.fillStyle = '#16212b'; x.font = `800 ${Math.round(r * 1.3)}px 'Big Shoulders Display', sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText((P.name || '?').charAt(0), u, v + 1); }
    mapHits.push({ u: u / W, v: v / W, p });
  }
}
if ($('mapCanvas')) $('mapCanvas').addEventListener('click', e => {
  const C = city(); if (!C) return;
  const r = e.currentTarget.getBoundingClientRect(), u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height;
  let best = null, bd = 0.045;
  for (const h of mapHits) { const d = Math.hypot(h.u - u, h.v - v); if (d < bd) { bd = d; best = h; } }
  if (best) goTo(C, best.p.go); else goTo(C, () => flyAbove(C, u * C.TOTAL - C.TOTAL / 2, v * C.TOTAL - C.TOTAL / 2));
});
if ($('mapList')) $('mapList').addEventListener('click', e => { const b = e.target.closest('[data-go]'), C = city(); if (b && C && mapPlaces[+b.dataset.go]) goTo(C, mapPlaces[+b.dataset.go].go); });

/* ---------- Ajanda: günün programı. Geliştiricinin günü, maçlar (takımlar ve skorla), kedi meclisi (gündemle), trafik zirveleri ---------- */
const hhmm = h => { h = ((h % 24) + 24) % 24; return pad(Math.floor(h)) + '.' + pad(Math.round((h % 1) * 60) % 60); };
function peaks(C) {                                               // trafik: saatlik eğrinin sabah ve akşam yoğun aralıkları
  const out = []; let cur = null;
  for (let h = 0; h <= 24; h += 0.25) {
    const key = h < 24 ? (C && C.trafficLevel ? C.trafficLevel(h).key : h >= 6.5 && h < 9.75 ? 'morning' : h >= 16.5 && h < 19.5 ? 'evening' : 'x') : 'x';
    const pk = key === 'morning' || key === 'evening' ? key : null;
    if (pk && (!cur || cur.key !== pk)) { cur = { key: pk, t: h }; out.push(cur); } else if (!pk && cur) { cur.end = h; cur = null; }
  }
  return out;
}
function agendaItems(C) {
  const it = [], h = C ? C.hour : hourNow(), M = C && C.match;
  if (C && C.developer && C.developer.plan) {
    const PL = C.developer.plan;
    PL.forEach((p, i) => { const end = PL[i + 1] ? PL[i + 1][0] : PL[0][0] + 24; it.push({ cat: 'dev', t: p[0], end, title: p[2], go: p[1] === 'home' ? null : 'dev' }); });
  }
  for (const s of [13.5, 19]) {
    const pv = C && C.matchPreview ? C.matchPreview(s, 0) : null, end = s + 115 / 60;
    let sub = 'Semt takımları karşı karşıya', live = false;
    if (pv) sub = pv.teams.join(' – ');
    if (C && C.matchPostponed && C.matchPostponed(s)) sub = (pv ? pv.teams.join(' – ') + ' · ' : '') + 'fırtına nedeniyle ertelendi';
    else if (M && M.on && M.slot === s) { live = true; sub += M.ph === 'pre' ? ' · tribünler doluyor' : M.ph === 'half' ? ' · devre arası ' + M.score.join('-') : ` · ${Math.floor(M.min)}' · ${M.score.join('-')}`; }
    else if (pv && h >= end) { const last = M && M.last && M.last.slot === s ? M.last : C.matchPreview(s, 90); sub = last.teams.join(' – ') + ' · bitti ' + last.score.join('-'); }
    it.push({ cat: 'match', t: s, end, title: 'Maç · Ankara Stadı', sub, live, go: C ? 'stadium' : null });
  }
  const ag = C && C.cats && C.cats.agenda ? C.cats.agenda().title : null;
  it.push({ cat: 'cats', t: 21.5, end: 25, title: 'Kedi meclisi toplanıyor', sub: ag ? 'Gündem: ' + ag : 'Merkezdeki parkta, sekiz kulüp kedisi', go: C ? 'cats' : null });
  for (const p of peaks(C)) it.push({ cat: 'traffic', t: p.t, end: p.end, title: p.key === 'morning' ? 'Sabah trafiği' : 'Akşam trafiği', sub: 'Yollar en kalabalık hâlinde' });
  it.sort((a, b) => a.t - b.t);
  return it;
}
const CAT_LABEL = { dev: 'Geliştirici', match: 'Maç', cats: 'Kediler', traffic: 'Trafik' };
function agendaRender() {
  const C = city(), h = C ? C.hour : hourNow(), it = agendaItems(C), within = x => (h >= x.t && h < x.end) || (x.end > 24 && h < x.end - 24);
  let now = false, html = '';
  for (const x of it) {
    if (!now && x.t > h) { now = true; html += `<li class="now"><span>Şimdi · ${hm(h)}</span></li>`; }
    const cur = within(x) || x.live;
    html += `<li class="ag ${x.cat}${cur ? ' cur' : ''}"><time>${hhmm(x.t)}</time><span class="tx"><i>${esc(CAT_LABEL[x.cat])}</i><b>${esc(x.title)}</b>${x.sub ? `<small>${esc(x.sub)}</small>` : ''}</span>` +
      `${x.go && (cur || x.go !== 'dev') && C && !inGame(C) ? `<button data-ag="${x.go}">Git</button>` : ''}</li>`;
  }
  if (!now) html += `<li class="now"><span>Şimdi · ${hm(h)}</span></li>`;
  const l = $('agendaList'); if (l.dataset.h !== html) { l.dataset.h = html; l.innerHTML = html; }
  $('agendaNote').textContent = C ? 'Saatler Türkiye saatiyle; maç takımları ve skor, meclis gündemi şehirden canlı gelir.' : 'Takımlar, skor ve meclisin gündemi şehrin içinde görünür.';
}
if ($('agendaList')) $('agendaList').addEventListener('click', e => {
  const b = e.target.closest('[data-ag]'), C = city(); if (!b || !C) return;
  const p = places(C).find(x => x.k === b.dataset.ag); if (p) goTo(C, p.go);
});

/* ---------- Kedidex: sevilen kediler (cats.js 'ms.catdex' kaydı). Katalog tüy + ad eşleşmeleri; şu an şehirde olan eşleşmede rozet ---------- */
const DEX_KEY = 'ms.catdex';
const catSvg = (e, on) => {
  const c = on ? e.col : '#3a424b', c2 = e.col2 || c, dark = on && /^#(1|2)/.test(e.col);
  return `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 20 7 5l12 9M39 20l2-15-12 9" fill="${c}"/><ellipse cx="24" cy="27" rx="17" ry="15" fill="${c}"/>` +
    (on && e.col2 ? `<path d="M8 22a17 15 0 0 1 14-9c-2 6-7 10-14 9z" fill="${c2}"/>` : '') +
    (on && e.st ? `<path d="M24 13v6M19 14l1.5 5M29 14l-1.5 5" stroke="rgba(0,0,0,.35)" stroke-width="2" stroke-linecap="round"/>` : '') +
    (on && e.bib ? `<ellipse cx="24" cy="35" rx="7" ry="5" fill="#f4f1ea"/>` : '') +
    (on ? `<circle cx="17.5" cy="26" r="2.6" fill="${dark ? '#e8d36a' : '#2a2f35'}"/><circle cx="30.5" cy="26" r="2.6" fill="${dark ? '#e8d36a' : '#2a2f35'}"/><path d="m22 31 2 2 2-2z" fill="#d88b95"/>` : `<text x="24" y="32" text-anchor="middle" font-size="14" font-weight="700" fill="#6b7682">?</text>`) + '</svg>';
};
function dexRender() {
  const C = city(); let d = null;
  try { d = JSON.parse(localStorage.getItem(DEX_KEY)); } catch (e) {}
  const cat = (C && C.cats && C.cats.catalog ? C.cats.catalog() : d && d.catalog) || [], seen = (d && d.seen) || {};
  const here = new Set(C && C.cats ? C.cats.list.map(c => C.cats.dexKey(c)) : []);
  const n = cat.filter(e => seen[e.key]).length, top = Object.entries(seen).sort((a, b) => b[1].n - a[1].n)[0];
  $('dexHead').innerHTML = cat.length ? `<div class="bar"><i style="width:${(n / cat.length * 100).toFixed(1)}%"></i></div><p><b>${n} / ${cat.length}</b> <span>kediyle tanıştın</span></p>${top ? `<p class="top">En çok sevilen: ${esc(top[0].split('|')[1])} (${top[1].n} kez)</p>` : ''}`
    : `<p>Henüz katalog yok: şehre bir kez girince kediler burada listelenir.</p>`;
  $('dexHow').textContent = C ? 'Vatandaş olarak dolaş, bir kedinin yanında E ile sev; tanıştığın kedi buraya eklenir. "Şehirde" rozetli kediler şu an sokakta.' : 'Kedilerle şehrin içinde tanışılır: Vatandaş olarak dolaş, bir kedinin yanında E ile sev.';
  const html = cat.map(e => {
    const s = seen[e.key], live = here.has(e.key);
    const meta = s ? `${s.n} kez · ${s.place === 'club' ? 'Kedi meclisi' : esc(s.place)}` : 'henüz tanışmadın';
    return `<li class="${s ? 'met' : ''}${e.reis ? ' reis' : ''}">${catSvg(e, !!s)}<b>${s ? esc(e.name) : '???'}</b><small>${esc(e.coat)}</small><small class="m">${meta}</small>` +
      `${live ? `<button class="here" data-cat="${esc(e.key)}"${inGame(C) ? ' disabled' : ''}>Şehirde</button>` : ''}</li>`;
  }).join('');
  const l = $('dexList'); if (l.dataset.h !== html) { l.dataset.h = html; l.innerHTML = html; }
}
if ($('dexList')) $('dexList').addEventListener('click', e => {
  const b = e.target.closest('[data-cat]'), C = city(); if (!b || !C || !C.cats) return;
  const c = C.cats.list.find(x => C.cats.dexKey(x) === b.dataset.cat); if (c) goTo(C, () => C.flyTo(V3(c.x + 4, 2.6, c.z + 4), V3(c.x, 0.4, c.z), 2000));
});
/* ---------- Lig: Semt Ligi (şehrin tohumlu maçlarından, ayın 1'inden bugüne; herkes aynı tabloyu görür) ve Süper Lig (ESPN'in anahtarsız,
   resmî olmayan uç noktası; 30 dk saklanır, gelmezse yalnızca Semt Ligi). ESPN adları Türkçe karaktersiz gelir, TR_TEAM düzeltir ---------- */
/* site.web.api.espn.com: site.api.espn.com tarayıcıdan (Chrome) engelleniyor, aynı veri bu adreste CORS ile geliyor */
const LEAGUE_KEY = 'ms.league', ESPN_URL = 'https://site.web.api.espn.com/apis/v2/sports/soccer/tur.1/standings';
const TR_TEAM = { Besiktas: 'Beşiktaş', Fenerbahce: 'Fenerbahçe', Genclerbirligi: 'Gençlerbirliği', Goztepe: 'Göztepe', Kasimpasa: 'Kasımpaşa', Eyupspor: 'Eyüpspor',
  'Istanbul Basaksehir': 'Başakşehir', 'Caykur Rizespor': 'Çaykur Rizespor', 'Amed SFK': 'Amed Sportif', 'Erzurum BB': 'Erzurumspor FK', Ankaragucu: 'Ankaragücü', Keciorengucu: 'Keçiörengücü' };
const trTeam = n => TR_TEAM[n] || (/orum FK$/.test(n) ? 'Çorum FK' : n);
const ANKARA = /^(Gençlerbirliği|Ankaragücü|Keçiörengücü)$/;
let leagueTab = 'semt', espn = null, espnBusy = false, espnFail = 0;
try { const c = JSON.parse(localStorage.getItem(LEAGUE_KEY)); if (c && c.rows) espn = c; } catch (e) {}
function semtTable(C) {
  const day = new Date(Date.now() + 3 * 3600e3).getUTCDate(), h = C.hour, M = C.match, T = {}, games = [];
  const club = n => (C.DISTRICTS.find(d => n === d.name || n.startsWith(d.name + ' ')) || { name: n }).name;
  for (const d of C.DISTRICTS) T[d.name] = { name: d.name, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, form: [] };
  for (let off = 1 - day; off <= 0; off++) for (const s of [13.5, 19]) {
    if (off === 0 && (h < s + 115 / 60 || (C.matchPostponed && C.matchPostponed(s)))) continue;   // bugün henüz bitmemiş ya da ertelenmiş maç sayılmaz
    const m = off === 0 && M && M.last && M.last.slot === s ? M.last : C.matchPreview(s, 90, off);
    const [a, b] = m.teams.map(club), [x, y] = m.score;
    games.push({ off, s, a, b, x, y });
    for (const [t, f, g] of [[a, x, y], [b, y, x]]) { const r = T[t]; if (!r) continue; r.p++; r.gf += f; r.ga += g; const k = f > g ? 'w' : f < g ? 'l' : 'd'; r[k]++; r.pts += k === 'w' ? 3 : k === 'd' ? 1 : 0; r.form.push(k); }
  }
  const rows = Object.values(T).sort((p, q) => q.pts - p.pts || (q.gf - q.ga) - (p.gf - p.ga) || q.gf - p.gf || p.name.localeCompare(q.name, 'tr'));
  return { rows, games: games.slice(-6).reverse(), n: games.length, from: 1 - day };
}
const tableHtml = (rows, form) => `<table class="lg"><thead><tr><th>#</th><th class="t">Takım</th><th>O</th><th>G</th><th>B</th><th>M</th><th>Av</th><th>P</th></tr></thead><tbody>` +
  rows.map((r, i) => `<tr class="${ANKARA.test(r.name) ? 'ank' : ''}"><td>${r.rank || i + 1}</td><td class="t">${esc(r.name)}${form && r.form ? `<span class="form">${r.form.slice(-5).map(k => `<i class="${k}"></i>`).join('')}</span>` : ''}</td>` +
    `<td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${(r.gd !== undefined ? r.gd : r.gf - r.ga) > 0 ? '+' : ''}${r.gd !== undefined ? r.gd : r.gf - r.ga}</td><td><b>${r.pts}</b></td></tr>`).join('') + '</tbody></table>';
function fetchEspn() {
  if (espnBusy || (espn && Date.now() - espn.t < 18e5) || Date.now() - espnFail < 12e4) return;   // olmazsa 2 dk sonra yeniden
  espnBusy = true;
  fetch(ESPN_URL).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(d => {
    const ch = d.children && d.children[0], e = ch && ch.standings && ch.standings.entries; if (!e || !e.length) throw new Error('boş');
    const st = x => { const o = {}; for (const k of x.stats) o[k.name] = k.value !== undefined ? k.value : +k.displayValue; return o; };
    const rows = e.map(x => { const s = st(x); return { name: trTeam(x.team.displayName), rank: s.rank, p: s.gamesPlayed, w: s.wins, d: s.ties, l: s.losses, gd: s.pointDifferential, pts: s.points }; }).sort((p, q) => p.rank - q.rank);
    espn = { t: Date.now(), season: (ch.abbreviation || '').replace(/^(\d{4})-\d\d(\d\d)$/, '$1/$2'), rows };
    try { localStorage.setItem(LEAGUE_KEY, JSON.stringify(espn)); } catch (e) {}
  }).catch(() => { espnFail = Date.now(); }).finally(() => { espnBusy = false; leagueRender(); });
}
function leagueRender() {
  const C = city(), box = $('leagueBody');
  document.querySelectorAll('#league .tabs button').forEach(b => { const on = b.dataset.tab === leagueTab; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
  let html = '';
  if (leagueTab === 'semt') {
    if (!C || !C.matchPreview || !C.DISTRICTS) html = `<p class="empty">Semt Ligi şehrin içinde oynanır: maçlar 13.30 ve 19.00'da Ankara Stadı'nda.</p>`;
    else {
      const { rows, games, n, from } = semtTable(C), M = C.match;
      const dOf = off => { const d = new Date(); d.setDate(d.getDate() + off); return d.toLocaleDateString(LOC, { day: 'numeric', month: 'long' }); };
      html += `<p class="badge fake">Kurgusal</p>`;
      if (M && M.on && M.teams) html += `<div class="card live-m"><div class="kicker live">Canlı · Ankara Stadı</div><b>${esc(M.teams[0].name)} ${M.score[0]} - ${M.score[1]} ${esc(M.teams[1].name)}</b><small>${M.ph === 'pre' ? 'Başlamak üzere' : M.ph === 'half' ? 'Devre arası' : Math.floor(M.min) + '. dakika'}</small></div>`;
      html += tableHtml(rows, true) + `<h3>Son maçlar</h3><ul class="games">${games.map(g => `<li><time>${g.off === 0 ? 'Bugün' : g.off === -1 ? 'Dün' : -g.off + ' gün önce'} · ${g.s === 19 ? '19.00' : '13.30'}</time><span>${esc(g.a)} <b>${g.x} - ${g.y}</b> ${esc(g.b)}</span></li>`).join('')}</ul>` +
        `<p class="src"><b>Kurgusal veri.</b> <span>Şehirdeki semt takımlarının maçları; gerçek takımlar değil.</span> <span>${esc(dOf(from))} – ${esc(dOf(0))} · ${n} maç</span>. ` +
        (C.superligStats ? `<span>Skor dağılımı ve ev sahibi avantajı gerçek Süper Lig'den: ${esc(C.superligStats.seasons)}, ${C.superligStats.n.toLocaleString(LOC)} maç.</span> ` : '') +
        `<span>Skorlar tarihten tohumlanır, herkes aynı tabloyu görür; eşleşmeler rastgele olduğu için takımların maç sayısı eşit değil. Galibiyet 3, beraberlik 1 puan.</span></p>`;
    }
  } else {
    fetchEspn();
    if (!espn) html = `<p class="empty">${espnBusy ? 'Puan durumu yükleniyor…' : 'Puan durumu şu an alınamadı.'}</p>`;
    else {
      const wk = Math.max(...espn.rows.map(r => r.p || 0)), at = new Date(espn.t).toLocaleString(LOC, { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
      html = `<p class="badge real">Gerçek veri</p>` + tableHtml(espn.rows, false) +
        `<p class="src"><b>Gerçek veri.</b> <span>Trendyol Süper Lig ${esc(espn.season)}</span>, <span>${wk}. haftadan sonra</span>. <span>ESPN'den alındı: ${esc(at)}</span>. ` +
        `<span>Resmî olmayan bir uç nokta; 30 dakikada bir yenilenir. Ankara'nın takımı vurgulu.</span></p>`;
    }
  }
  if (box.dataset.h !== html) { box.dataset.h = html; box.innerHTML = html; }
}
if ($('league')) $('league').addEventListener('click', e => { const b = e.target.closest('.tabs [data-tab]'); if (b) { leagueTab = b.dataset.tab; leagueRender(); } });
/* ---------- ana ekran sayfaları: yana kaydırılır (dokunmatik, iz paneli), altta noktalar; noktaya tıklayınca o sayfaya geçer ---------- */
const pagesEl = $('pages'), dotsEl = $('dots');
if (pagesEl && dotsEl) {
  const pageN = pagesEl.children.length;
  dotsEl.innerHTML = Array.from({ length: pageN }, (_, i) => `<button type="button" aria-label="Sayfa ${i + 1}"${i ? '' : ' class="on" aria-current="true"'}></button>`).join('');
  const cur = () => Math.round(pagesEl.scrollLeft / Math.max(1, pagesEl.clientWidth));
  pagesEl.addEventListener('scroll', () => { const k = cur(); [...dotsEl.children].forEach((b, i) => { b.classList.toggle('on', i === k); if (i === k) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); }); }, { passive: true });
  dotsEl.addEventListener('click', e => { const b = e.target.closest('button'); if (b) pagesEl.scrollTo({ left: [...dotsEl.children].indexOf(b) * pagesEl.clientWidth, behavior: 'smooth' }); });
  /* fareyle sürükleyerek de kaydırılır (masaüstü) */
  let drag = null;
  pagesEl.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') drag = { x: e.clientX, s: pagesEl.scrollLeft, moved: false }; });
  window.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x; if (Math.abs(dx) > 6) drag.moved = true; pagesEl.scrollLeft = drag.s - dx; });
  window.addEventListener('pointerup', e => {
    if (!drag) return; const d = drag; drag = null; if (!d.moved) return;
    const k = Math.max(0, Math.min(pageN - 1, Math.round((d.s - (e.clientX - d.x) * 2.2) / pagesEl.clientWidth)));
    pagesEl.scrollTo({ left: k * pagesEl.clientWidth, behavior: 'smooth' });
    const stop = ev => { ev.stopPropagation(); ev.preventDefault(); }; pagesEl.addEventListener('click', stop, { capture: true, once: true });   // sürükleme bir uygulamayı açmasın
  });
}

/* ---------- GitHub etkinliği: herkese açık son olaylar (anahtarsız, tek istek, 15 dk saklanır). GitHub push olayında artık commit listesi
   vermiyor (yalnızca depo ve zaman), bu yüzden gönderimler depo başına toplanır; sürüm, etiket, yeni depo ayrı satır ---------- */
const GHEV_KEY = 'ms.ghev';
let ghev = null, ghevBusy = false, ghevFail = 0;
try { const c = JSON.parse(localStorage.getItem(GHEV_KEY)); if (c && c.list && c.v === 2) ghev = c; } catch (e) {}
function ghRender() {
  const box = $('ghBody');
  if (P.github && !ghevBusy && !(ghev && Date.now() - ghev.t < 9e5) && Date.now() - ghevFail > 12e4) {
    ghevBusy = true;
    fetch('https://api.github.com/users/' + encodeURIComponent(P.github) + '/events/public?per_page=40').then(r => r.ok ? r.json() : Promise.reject(r.status)).then(list => {
      const out = [];
      for (const e of list) {
        const repo = e.repo.name.split('/')[1], t = e.created_at;
        if (e.type === 'PushEvent') { const g = out.find(x => x.k === 'push' && x.repo === repo); if (g) g.n++; else out.push({ k: 'push', repo, t, n: 1, since: t }); if (g) g.since = t; }
        else if (e.type === 'ReleaseEvent' && e.payload.action === 'published') out.push({ k: 'release', repo, t, tag: e.payload.release.tag_name });
        else if (e.type === 'CreateEvent' && e.payload.ref_type === 'repository') out.push({ k: 'repo', repo, t });
        else if (e.type === 'CreateEvent' && e.payload.ref_type === 'tag') out.push({ k: 'tag', repo, t, tag: e.payload.ref });
      }
      ghev = { t: Date.now(), v: 2, list: out.slice(0, 20), from: list.length ? list[list.length - 1].created_at : null }; try { localStorage.setItem(GHEV_KEY, JSON.stringify(ghev)); } catch (e) {}
    }).catch(() => { ghevFail = Date.now(); }).finally(() => { ghevBusy = false; if (current && current.id === 'gh') ghRender(); });
  }
  let html = '';
  if (!ghev) html = `<p class="empty">${ghevBusy ? 'Yükleniyor…' : 'GitHub şu an yanıt vermiyor.'}</p>`;
  else {
    const pushes = ghev.list.filter(x => x.k === 'push'), n = pushes.reduce((k, x) => k + x.n, 0), rel = ghev.list.filter(x => x.k === 'release' || x.k === 'tag').length;
    html = `<p class="badge real">Gerçek veri</p><div class="stats gh-sum"><div><b>${n}</b><small>gönderim</small></div><div><b>${pushes.length}</b><small>depo</small></div><div><b>${rel}</b><small>sürüm</small></div></div><ul class="ghlist">` +
      ghev.list.map(x => `<li class="${x.k}"><time>${esc(ago(x.t))}</time><b><a href="https://github.com/${esc(P.github)}/${esc(x.repo)}" target="_blank" rel="noopener">${esc(x.repo)}</a></b>` +
        (x.k === 'push' ? `<span>${x.n} kez güncellendi</span>` : x.k === 'release' ? `<span>Sürüm yayımlandı: ${esc(x.tag)}</span>` : x.k === 'tag' ? `<span>Etiket: ${esc(x.tag)}</span>` : `<span>Yeni depo açıldı</span>`) + '</li>').join('') +
      `</ul><p class="src"><b>Gerçek veri.</b> <span>GitHub'ın herkese açık etkinlik akışı (son 90 gün, en çok 40 olay)</span>${ghev.from ? `, <span>${esc(ago(ghev.from))} itibarıyla</span>` : ''}. <span>Alındı: ${esc(new Date(ghev.t).toLocaleString(LOC, { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }))}</span>.</p>`;
  }
  if (box.dataset.h !== html) { box.dataset.h = html; box.innerHTML = html; }
}

/* ---------- Mesajlar: SMS gibi; gelen kutusu, dokununca sohbet. Mesajlar şehrin saatine ve olaylarına göre gelir:
   geliştirici yalnızca canlı konum paylaşır; Reis toplantıdan önce ve sonra; Pijamalı Çocuk sabah devriyede ve şehirde hırsızlık çıkınca;
   Maç Bülteni maç başlarken, devre arasında ve maç sonunda (ertelenirse o). Okunanlar localStorage['ms.msgseen'] (sohbet başına sayı) ---------- */
const MSG_SEEN = 'ms.msgseen';
let msgSeen = {}; try { msgSeen = JSON.parse(localStorage.getItem(MSG_SEEN)) || {}; } catch (e) {}
let msgOpen = null, msgLastN;
const hhm = h => hm(((h % 24) + 24) % 24);
function threads() {
  const C = city(), h = C ? C.hour : hourNow(), out = [], key = t => (h < 12 && t >= 12 ? t - 24 : t);   // öğleden önce, dün akşamki mesajlar önce gelir
  const D = C && C.developer;
  out.push({ id: 'dev', who: P.name || 'Geliştirici', ico: (P.name || '?').charAt(0), col: '#ffb53d', msgs: [{ t: h, loc: true, text: D && D.where ? D.where() : '' }] });
  if (C) {
    const ag = C.cats && C.cats.agenda ? C.cats.agenda().title : '', W = C.weather && C.weather.cur, wet = !!W && W.rain + W.snow * 0.6 > 0.3, rm = [];
    if (h >= 18 || h < 12) rm.push({ t: 18, text: "Bu gece 21.30'da meclis var, unutma." });
    if (h >= 21 || h < 12) rm.push({ t: 21, text: 'Yarım saat sonra toplanıyoruz. Gündem: ' + ag + '.' });
    if (h >= 21.5 || h < 12) rm.push({ t: 21.5, text: wet ? 'Toplantı başladı. Yağmur var, saçak altındayız.' : 'Toplantı başladı, nerede kaldın?' });
    if (h >= 1 && h < 12) rm.push({ t: 1, text: 'Toplantı bitti, kararlar yarın panoda. İyi geceler.' });
    out.push({ id: 'reis', who: 'Reis', svg: 'cat', col: '#a06cd5', msgs: rm });
    const hm2 = [];
    if (h >= 9) hm2.push({ t: 9, text: 'Günaydın! Çatılara çıkıyorum, devriye başladı.' });
    for (const ev of (C.eventLog || []).filter(e => e.type === 'crime' && e.hour !== undefined).slice().reverse()) {
      hm2.push({ t: ev.hour, text: ev.place + ' tarafında hırsızlık var, peşindeyim!' });
      if (ev.done) hm2.push({ t: ev.doneHour !== undefined ? ev.doneHour : ev.hour, text: 'Olay kapandı: ' + ev.status + '.' });
    }
    const n = C.cityStats ? C.cityStats.hero : 0;
    if (n && h >= 20) hm2.push({ t: 20, text: `Bugün ${n} hırsız yakaladım. Şehir güvende.` });
    out.push({ id: 'hero', who: 'Pijamalı Çocuk', svg: 'user', col: '#d23b3b', msgs: hm2 });
    const M = C.match, mm = [];
    if (C.matchPreview) {
      if (h >= 9) mm.push({ t: 9, text: "Bugün 13.30 ve 19.00'da Ankara Stadı'nda maç var." });
      for (const s of [13.5, 19]) {
        if (h < s - 10 / 60) continue;
        const pv = C.matchPreview(s, 0), [a, b] = pv.teams, pp = C.matchPostponed && C.matchPostponed(s);
        if (pp) { mm.push({ t: s - 10 / 60, text: `${hhmm(s)} maçı fırtına nedeniyle ertelendi.` }); continue; }
        mm.push({ t: s - 10 / 60, text: `Maç başlıyor (${hhmm(s)}): ${a} – ${b}.` });
        if (h >= s + 45 / 60) { const sc = M && M.ht && M.ht.slot === s ? M.ht.score : C.matchPreview(s, 45).score; mm.push({ t: s + 45 / 60, text: `Devre arası: ${a} ${sc[0]}-${sc[1]} ${b}.` }); }
        if (h >= s + 105 / 60) { const l = M && M.last && M.last.slot === s ? M.last : C.matchPreview(s, 90); mm.push({ t: s + 105 / 60, text: `Maç sonu: ${a} ${l.score[0]}-${l.score[1]} ${b}.` }); }
      }
    }
    out.push({ id: 'match', who: 'Maç Bülteni', svg: 'trophy', col: '#3b8b4a', msgs: mm });
  }
  for (const th of out) { th.msgs.sort((p, q) => key(p.t) - key(q.t)); th.last = th.msgs[th.msgs.length - 1]; th.k = th.last ? key(th.last.t) : -99; th.unread = Math.max(0, th.msgs.length - (msgSeen[th.id] || 0)); }
  return out.filter(t => t.msgs.length).sort((p, q) => q.k - p.k);
}
const avOf = t => `<span class="av" style="--c:${t.col}">${t.svg ? SV(t.svg) : esc(t.ico)}</span>`;
const prevOf = m => m.loc ? 'Canlı konum paylaştı' : m.text;
function msgRender() {
  const C = city(), th = threads(), list = $('msgList'), view = $('msgThread');
  const open = msgOpen && th.find(t => t.id === msgOpen);
  list.hidden = !!open; view.hidden = !open;
  if (open) {
    if ((msgSeen[open.id] || 0) !== open.msgs.length) { msgSeen[open.id] = open.msgs.length; try { localStorage.setItem(MSG_SEEN, JSON.stringify(msgSeen)); } catch (e) {} }
    const bub = m => m.loc
      ? `<div class="bub loc"><span class="li">${SV('map')}</span><b>Canlı konum</b><p>${esc(m.text || 'Konumum şehrin içinde görünür.')}</p>${C ? `<button type="button" data-msg="finddev">Haritada göster</button>` : '<a href="../index.html">Şehre gir</a>'}<time>şimdi</time></div>`
      : `<div class="bub"><p>${esc(m.text)}</p><time>${esc(hhm(m.t))}</time></div>`;
    const html = `<div class="thead"><button type="button" class="tback" data-msg="inbox">‹ Mesajlar</button>${avOf(open)}<b>${esc(open.who)}</b></div><div class="bubs">${open.msgs.map(bub).join('')}</div>`;
    if (view.dataset.h !== html) { view.dataset.h = html; view.innerHTML = html; const b = view.querySelector('.bubs'); if (b) b.scrollTop = b.scrollHeight; }
  } else {
    const html = th.map(t => `<li><button type="button" data-th="${t.id}">${avOf(t)}<span class="tx"><b>${esc(t.who)}</b><small>${esc(prevOf(t.last))}</small></span>` +
      `<span class="meta"><time>${t.last.loc ? 'şimdi' : esc(hhm(t.last.t))}</time>${t.unread ? `<i class="un">${t.unread}</i>` : ''}</span></button></li>`).join('') + (C ? '' : '<li class="note">Diğer sohbetler şehrin içinde açılır.</li>');
    if (list.dataset.h !== html) { list.dataset.h = html; list.innerHTML = html; }
  }
}
if ($('msgs')) $('msgs').addEventListener('click', e => {
  const t = e.target.closest('[data-th]'), a = e.target.closest('[data-msg]'), C = city();
  if (t) { msgOpen = t.dataset.th; msgRender(); return; }
  if (a && a.dataset.msg === 'inbox') { msgOpen = null; msgRender(); return; }
  if (a && a.dataset.msg === 'finddev' && C) { if (C.phone) C.phone.close(); setTimeout(() => C.findDeveloper && C.findDeveloper(), 60); }
});
/* ana ekran: Mesajlar simgesinde okunmamış sayısı; yeni mesaj gelince üstten bildirim (dokununca o sohbet açılır) */
function msgTick() {
  const th = threads(), n = th.reduce((k, t) => k + t.msgs.length, 0), un = th.reduce((k, t) => k + t.unread, 0);
  const ico = document.querySelector('[data-open="msgs"] .ico');
  if (ico) { let b = ico.querySelector('.nb'); if (!b) { b = document.createElement('i'); b.className = 'nb'; ico.appendChild(b); } b.textContent = un > 9 ? '9+' : un; b.hidden = !un; }
  const pg = $('pages'), dots = $('dots'), app = document.querySelector('[data-open="msgs"]');   // Mesajlar başka sayfadaysa o sayfanın noktası kırmızı
  if (pg && dots && app) { const k = [...pg.children].indexOf(app.closest('.apps')); [...dots.children].forEach((d, i) => d.classList.toggle('new', i === k && un > 0 && !d.classList.contains('on'))); }
  if (msgLastN !== undefined && n > msgLastN && !(current && current.id === 'msgs')) {
    const t = th.slice().sort((p, q) => q.k - p.k).find(x => x.unread && !x.last.loc), tt = $('toast');
    if (t && tt) {
      tt.innerHTML = `<span class="ti" style="background:${t.col};color:#fff">${t.svg ? SV(t.svg) : esc(t.ico)}</span><span class="tx"><b>${esc(t.who)} <i>şimdi</i></b><span>${esc(t.last.text)}</span></span>`;
      tt.dataset.go = 'msgs:' + t.id; tt.hidden = false; tt.classList.remove('in'); void tt.offsetWidth; tt.classList.add('in');
      clearTimeout(toastT); toastT = setTimeout(() => { tt.classList.remove('in'); setTimeout(() => { if (!tt.classList.contains('in')) tt.hidden = true; }, 300); }, 5000);
    }
  }
  msgLastN = n;
}

/* ---------- Ayarlar: dil (her yerde), şehirde grafik kalitesi, canlı saat, canlı hava, saate göre trafik, rastgele olaylar; Kedidex'i sıfırla ---------- */
function setRender() {
  const C = city(), pd = C ? window.parent.document : null, q = pd && pd.getElementById('quality');
  const row = (label, ctrl, note) => `<li><span class="tx"><b>${label}</b>${note ? `<small>${note}</small>` : ''}</span>${ctrl}</li>`;
  const tog = (id, on) => `<button type="button" class="sw${on ? ' on' : ''}" data-set="${id}" aria-pressed="${on}">${on ? (LG === 'en' ? 'On' : 'Açık') : (LG === 'en' ? 'Off' : 'Kapalı')}</button>`;   // sözlükten geçmez: 'Açık' havada 'Clear' demek
  const en = window.MSLang && MSLang.en;
  let html = row('Dil', `<span class="seg"><button type="button" data-set="lang-tr"${en ? '' : ' class="on"'}>TR</button><button type="button" data-set="lang-en"${en ? ' class="on"' : ''}>EN</button></span>`);
  if (C) {
    html += row('Grafik kalitesi', `<select data-set="quality">${q ? [...q.options].map(o => `<option value="${esc(o.value)}"${o.value === q.value ? ' selected' : ''}>${esc(o.textContent)}</option>`).join('') : ''}</select>`, 'Değişince şehir yeniden yüklenir.') +
      row('Canlı saat', tog('clock', !!C.liveClock), 'Gerçek Türkiye saati') + row('Canlı hava', tog('wx', !!(C.weather && C.weather.live)), 'Ankara\'nın şu anki havası') +
      row('Saate göre trafik', tog('traffic', !!C.trafficAuto), 'Ankara\'nın 2025 ortalaması') + row('Rastgele olaylar', tog('events', !!C.eventsOn), 'Yangın, kaza, hırsızlık');
  }
  if (window.GEN && GEN.sysReduce) html += row('Kapak animasyonları', tog('motion', GEN.moving), 'Sistemde hareketi azalt açık; açınca proje kapakları yine oynar');
  html += row('Kedidex', `<button type="button" class="sw danger" data-set="dex">${dexArm ? 'Emin misin?' : 'Sıfırla'}</button>`, 'Tanıştığın kediler silinir.');
  const l = $('setList'); if (l.dataset.h !== html) { l.dataset.h = html; l.innerHTML = html; }
}
let dexArm = false;
if ($('setList')) {
  $('setList').addEventListener('click', e => {
    const b = e.target.closest('button[data-set]'); if (!b) return;
    const C = city(), k = b.dataset.set;
    if (k === 'lang-tr' || k === 'lang-en') { const L = C && window.parent.MSLang ? window.parent.MSLang : window.MSLang; if (L) L.set(k.slice(5)); return; }   // şehirdeysek bütün sayfa dil değiştirir
    if (k === 'motion' && window.GEN) GEN.play(!GEN.moving);
    if (k === 'clock' && C) C.setLiveClock(!C.liveClock);
    if (k === 'wx' && C && C.weather) { if (C.weather.live) C.weather.set(C.weather.pick || 'clear'); else C.weather.setLive(true); }
    if (k === 'traffic' && C) { if (C.trafficAuto) { const v = C.trafficPeak * C.trafficLevel().v; C.trafficAuto = false; C.setDensity(v); } else C.setTrafficAuto(true); if (C.syncTraffic) C.syncTraffic(); }
    if (k === 'events' && C) { const chk = window.parent.document.getElementById('eventsChk'); if (chk) chk.click(); else C.eventsOn = !C.eventsOn; }
    if (k === 'dex') { if (!dexArm) { dexArm = true; setTimeout(() => { dexArm = false; setRender(); }, 3000); } else { dexArm = false; try { const d = JSON.parse(localStorage.getItem(DEX_KEY)) || {}; d.seen = {}; localStorage.setItem(DEX_KEY, JSON.stringify(d)); } catch (er) {} } }
    setRender();
  });
  $('setList').addEventListener('change', e => {
    const s = e.target.closest('select[data-set="quality"]'), C = city(); if (!s || !C) return;
    const q = window.parent.document.getElementById('quality'); if (q) { q.value = s.value; q.dispatchEvent(new Event('change', { bubbles: true })); }
  });
}

/* ---------- Kamera ve galeri: şehrin o anki görüntüsü (yalnızca 3B sahne, arayüz yok), tarayıcıda IndexedDB'de saklanır (en çok 24) ---------- */
const GAL_MAX = 24;
const galDb = () => new Promise((res, rej) => { const r = indexedDB.open('ms-gallery', 1); r.onupgradeneeded = () => r.result.createObjectStore('photos', { keyPath: 'id' }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
const galTx = (mode, f) => galDb().then(db => new Promise((res, rej) => { const tx = db.transaction('photos', mode), st = tx.objectStore('photos'); const out = f(st); tx.oncomplete = () => res(out && out.result !== undefined ? out.result : out); tx.onerror = () => rej(tx.error); }));
const galAll = () => galTx('readonly', st => st.getAll()).then(a => (a || []).sort((p, q) => q.id - p.id));
let galUrls = [], galView = null, galBusy = false;
function galRender() {
  const C = city();
  $('camShoot').hidden = !C; $('camNote').textContent = C ? 'Şehrin şu anki görüntüsünü çeker; arayüz görünmez. Fotoğraflar yalnızca bu tarayıcıda saklanır.' : 'Fotoğraf şehrin içinde çekilir; çektiklerin burada görünür.';
  galAll().then(list => {
    galUrls.forEach(u => URL.revokeObjectURL(u)); galUrls = [];
    const html = list.length ? list.map(p => { const u = URL.createObjectURL(p.blob); galUrls.push(u); return `<li><button type="button" data-ph="${p.id}"><img src="${u}" alt="${esc(p.place)}"></button><small>${esc(p.place)} · ${esc(new Date(p.id).toLocaleString(LOC, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))}</small></li>`; }).join('') : '<li class="empty">Henüz fotoğraf yok.</li>';
    $('galList').innerHTML = html;
  }).catch(() => { $('galList').innerHTML = '<li class="empty">Bu tarayıcıda galeri açılamadı.</li>'; });
}
function shoot() {
  const C = city(); if (!C || galBusy) return; galBusy = true;
  const pd = window.parent.document;
  if (C.phone) C.phone.close();
  setTimeout(() => {
    C.renderer.render(C.scene, C.camera);                             // çizimden hemen sonra okunur (preserveDrawingBuffer gerekmez)
    const src = C.renderer.domElement, W = Math.min(1280, src.width), H = Math.round(src.height * W / src.width), cv = document.createElement('canvas');
    cv.width = W; cv.height = H; cv.getContext('2d').drawImage(src, 0, 0, W, H);
    const flash = pd.createElement('div'); flash.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:99;pointer-events:none;transition:opacity .45s'; pd.body.appendChild(flash);
    requestAnimationFrame(() => { flash.style.opacity = '0'; setTimeout(() => flash.remove(), 500); });
    const tg = C.controls.target, place = (C.districtAt ? C.districtAt(tg.x, tg.z).name : 'Ankara');
    cv.toBlob(blob => {
      galTx('readwrite', st => st.put({ id: Date.now(), place, blob }))
        .then(() => galAll()).then(list => galTx('readwrite', st => { for (const p of list.slice(GAL_MAX)) st.delete(p.id); }))
        .catch(() => {}).finally(() => { galBusy = false; setTimeout(() => { if (C.phone) C.phone.open(); setTimeout(() => show('camera'), 350); }, 700); });
    }, 'image/jpeg', 0.86);
  }, 650);
}
if ($('camShoot')) $('camShoot').addEventListener('click', shoot);
if ($('galList')) $('galList').addEventListener('click', e => {
  const b = e.target.closest('[data-ph]'); if (!b) return;
  galAll().then(list => { const p = list.find(x => x.id === +b.dataset.ph); if (!p) return; galView = p; const u = URL.createObjectURL(p.blob); galUrls.push(u);
    $('galBig').src = u; $('galDl').href = u; $('galDl').download = 'mikro-sehir-' + new Date(p.id).toISOString().slice(0, 16).replace(/[:T]/g, '-') + '.jpg'; $('galView').hidden = false; });
});
if ($('galView')) $('galView').addEventListener('click', e => {
  if (e.target.closest('#galDel') && galView) { const id = galView.id; galView = null; $('galView').hidden = true; galTx('readwrite', st => st.delete(id)).finally(galRender); }
  else if (e.target.closest('#galClose') || e.target === $('galView')) { galView = null; $('galView').hidden = true; }
});
const LIVE = { city: [cityRender, 2000], map: [mapRender, 400], agenda: [agendaRender, 5000], catdex: [dexRender, 3000], league: [leagueRender, 5000],
  gh: [ghRender, 30000], msgs: [msgRender, 3000], settings: [setRender, 2000], camera: [galRender, 60000] };   // açıkken yenilenen uygulamalar
window.addEventListener('resize', () => { mapBase = null; });

/* ---------- bildirim: şehirde yeni bir olay olunca üstten Ankara Haber bildirimi ---------- */
let lastEv, toastT = null;
function watchEvents() {
  const C = city(), log = C && C.eventLog, ev = log && log[0];
  if (lastEv === undefined) { lastEv = ev ? ev.id : null; return; }   // açılıştaki olaylar bildirim olmaz
  if (!ev || ev.id === lastEv) return;
  lastEv = ev.id;
  const t = $('toast'); if (!t) return;
  t.dataset.go = '';
  t.innerHTML = `<span class="ti">${SV('news')}</span><span class="tx"><b>Ankara Haber <i>şimdi</i></b><span>${esc(ev.title)} · ${esc(ev.place)}</span></span>`;
  t.hidden = false; t.classList.remove('in'); void t.offsetWidth; t.classList.add('in');
  clearTimeout(toastT); toastT = setTimeout(() => { t.classList.remove('in'); setTimeout(() => { if (!t.classList.contains('in')) t.hidden = true; }, 300); }, 5000);
}
if ($('toast')) $('toast').addEventListener('click', () => { const t = $('toast'), g = t.dataset.go || ''; t.hidden = true; t.dataset.go = ''; if (g.startsWith('msgs:')) { msgOpen = g.slice(5); show('msgs'); } else show('city'); });
/* tablet ana ekranı (telefon büyütülünce, 900 px ve üstü): büyük hava kartı (3 gün), bugünün maçları, ajandadan sıradakiler */
function paintBigs() {
  const dv = $('device'), wide = !!dv && dv.clientWidth >= 900 && dv.clientHeight >= 560;
  for (const id of ['bigWx', 'bigMatch', 'bigNext']) $(id).hidden = !wide;
  if (!wide) return;
  const C = city(), h = hourNow(), put = (id, html) => { const e = $(id); if (e.dataset.h !== html) { e.dataset.h = html; e.innerHTML = html; } };
  put('bigWx', weather(h, C));
  const it = agendaItems(C), within = x => (h >= x.t && h < x.end) || (x.end > 24 && h < x.end - 24) || x.live;
  const row = x => `<li class="${within(x) ? 'cur' : ''}"><time>${hhmm(x.t)}</time><span><b>${esc(x.title)}</b>${x.sub ? `<small>${esc(x.sub)}</small>` : ''}</span></li>`;
  const mrow = x => { const [teams, ...st] = (x.sub || '').split(' · '); return row({ ...x, title: teams, sub: st.join(' · ') || (C ? '' : 'Semt takımları') }); };   // başlık takımlar, alt satır durum
  put('bigMatch', `<div class="kicker">Ankara Stadı · Bugün</div><ul class="bigl">${it.filter(x => x.cat === 'match').map(mrow).join('')}</ul><button type="button" class="more-b" data-open="league">Lig tablosu ›</button>`);
  const nx = it.filter(x => x.cat !== 'match' && (within(x) || x.t > h)).slice(0, 4);
  put('bigNext', `<div class="kicker">Sıradakiler</div><ul class="bigl">${nx.length ? nx.map(row).join('') : '<li><span><small>Bugün için başka bir şey yok.</small></span></li>'}</ul><button type="button" class="more-b" data-open="agenda">Ajanda ›</button>`);
}
function homeTick() { paintWall(); paintMinis(); paintBigs(); watchEvents(); msgTick(); }
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
  clearInterval(cityT); const lv = LIVE[id]; if (lv) { lv[0](); cityT = setInterval(lv[0], lv[1]); }
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
  const o = e.target.closest('[data-open]'); if (o) { if (o.dataset.open === 'msgs') msgOpen = null; show(o.dataset.open, o); return; }
  const dt = e.target.closest('[data-detail]'); if (dt) { openDetail(dt.dataset.detail, dt); return; }
  const sk = e.target.closest('[data-sky]'); if (sk) { show('projects'); skySpot(sk.dataset.sky); return; }
  const to = e.target.closest('[data-to]'); if (to) { show(to.dataset.to); return; }
  const sec = e.target.closest('.toc [data-sec]');
  if (sec) { e.preventDefault(); const t = $(sec.dataset.sec); if (t) { tocPin = t.id; tocMark(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); } return; }
  const cp = e.target.closest('.copy');
  if (cp) copyText(cp.parentNode.querySelector('pre').textContent).then(() => { cp.textContent = 'Kopyalandı'; clearTimeout(cp.t); cp.t = setTimeout(() => { cp.textContent = 'Kopyala'; }, 1600); }).catch(() => {});
  if (e.target.closest('[data-home]')) home();
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (current && current.id === 'project') { show('projects'); return; }   // detaydan projelere
  if (!home()) tell({ type: 'phone-close' });                       // ana ekrandaysa telefonu kapat
});
window.addEventListener('message', e => { if (e.data && e.data.type === 'phone-home') home(); });   // telefon kapanınca ana ekrana dön
const start = location.hash.slice(1); if (['projects', 'about', 'contact', 'city', 'map', 'agenda', 'catdex', 'league', 'gh', 'msgs', 'settings', 'camera'].includes(start)) show(start); else if (start.startsWith('projects/')) openDetail(start.slice(9));
})();
