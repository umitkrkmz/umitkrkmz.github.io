/* ===== app.js: telefon arayüzü: ana ekran, uygulamalar (Projeler, Hakkımda, İletişim, Bu şehir), saat. İçerik content.js'ten gelir. ===== */
(function () {
'use strict';
const P = window.PORTFOLIO || {}, $ = id => document.getElementById(id);
const embed = window.parent !== window || /[?&]embed=1/.test(location.search);
if (embed) document.body.classList.add('embed');
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- ana ekran ---------- */
$('name').textContent = P.name || ''; $('role').textContent = P.role || ''; $('tagline').textContent = P.tagline || '';
$('status').textContent = P.status || ''; $('status').hidden = !P.status;
$('avatar').textContent = (P.name || '?').trim().charAt(0).toLocaleUpperCase('tr');
const gh = (P.contact || []).find(c => c.kind === 'github' && c.href);
if (gh) $('ghLink').href = gh.href; else $('ghLink').hidden = true;

/* saat: şehrin içindeysek şehrin saati, değilse gerçek saat */
const city = () => { try { return embed && window.parent.C ? window.parent.C : null; } catch (e) { return null; } };
function tick() {
  const C = city(), now = new Date();
  let h = now.getHours(), m = now.getMinutes();
  if (C && typeof C.hour === 'number') { h = Math.floor(C.hour); m = Math.floor((C.hour % 1) * 60); }
  $('clock').textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  $('date').textContent = now.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }) + (C ? ' · Mikro Şehir' : '');
}
tick(); setInterval(tick, 1000);

/* ---------- uygulamalar ---------- */
$('projectList').innerHTML = (P.projects || []).map(p => `<article class="card">
  <h4>${esc(p.title)}</h4><p>${esc(p.desc)}</p>
  <ul class="chips">${(p.tags || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul>
  <div class="links">${p.live === '../' ? (embed ? '<span>Şu an içindesin</span>' : '<a href="../">Şehre gir</a>') : p.live ? `<a href="${esc(p.live)}" target="_blank" rel="noopener">Canlı</a>` : ''}${p.code ? `<a class="ghost" href="${esc(p.code)}" target="_blank" rel="noopener">Kod</a>` : '<span>Kod yakında</span>'}</div>
</article>`).join('');
$('aboutText').innerHTML = (P.about || []).map(t => `<p>${esc(t)}</p>`).join('');
$('skills').innerHTML = (P.skills || []).map(t => `<li>${esc(t)}</li>`).join('');
const ICON = { github: '🐙', linkedin: '💼', mail: '✉️', web: '🌐', cv: '📄' };
$('contactList').innerHTML = (P.contact || []).map(c => {
  const inner = `<span class="ri" aria-hidden="true">${ICON[c.kind] || '🔗'}</span><span><b>${esc(c.label)}</b><small>${esc(c.value)}</small></span>`;
  const href = c.kind === 'mail' && c.href && !/^mailto:/.test(c.href) ? 'mailto:' + c.href : c.href;
  return `<li>${href ? `<a href="${esc(href)}" target="_blank" rel="noopener">${inner}</a>` : `<span>${inner}</span>`}</li>`;
}).join('');
const cy = P.city || {};
$('cityStats').innerHTML = (cy.stats || []).map(([v, k]) => `<div><b>${esc(v)}</b><small>${esc(k)}</small></div>`).join('');
$('cityPoints').innerHTML = (cy.points || []).map(([h, t]) => `<article class="card"><h4>${esc(h)}</h4><p>${esc(t)}</p></article>`).join('');

/* ---------- gezinme: bir uygulama açılır, geri ya da Esc ana ekrana döner ---------- */
let current = null, opener = null;
function show(id) {
  const v = $(id); if (!v) return;
  if (current) current.hidden = true;
  opener = document.activeElement; current = v; v.hidden = false; v.querySelector('.back').focus({ preventScroll: true });   // kayarken odaklanınca kap kaydırılmasın
  history.replaceState(null, '', '#' + id);
}
function home() {
  if (!current) return false;
  current.hidden = true; current = null; history.replaceState(null, '', location.pathname + location.search);
  if (opener && opener.focus) opener.focus({ preventScroll: true });
  return true;
}
document.addEventListener('click', e => {
  const o = e.target.closest('[data-open]'); if (o) { show(o.dataset.open); return; }
  if (e.target.closest('[data-home]')) home();
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!home() && embed) window.parent.postMessage({ type: 'phone-close' }, location.origin);   // ana ekrandaysa telefonu kapat
});
const start = location.hash.slice(1); if (['projects', 'about', 'contact', 'city'].includes(start)) show(start);
})();
