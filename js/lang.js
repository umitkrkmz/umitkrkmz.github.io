/* ===== lang.js: dil (Türkçe / İngilizce). Şehir ve telefon (portfolio) ortak kullanır, ilk yüklenen betik.
   Seçim: elle (localStorage 'ms.lang') ya da otomatik: tarayıcı dili Türkçeyse veya saat dilimi İstanbul'sa Türkçe, değilse İngilizce.
   Kaynak dil Türkçe; İngilizcede sözlük (Türkçe metin > İngilizce) ve kalıplar (değişkenli metinler) kullanılır.
   Çeviri ekrana yazılan yerde yapılır: sayfadaki metin ve sonradan değişen metin, title, aria-label gözlemciyle çevrilir.
   Özel adlar (semt, cadde, takım, kedi adları) ve şehirdeki tabelalar (canvas) Türkçe kalır. ===== */
window.MSLang = (function () {
  const KEY = 'ms.lang';
  let pick = 'auto'; try { pick = localStorage.getItem(KEY) || 'auto'; } catch (e) {}
  let tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
  const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
  const auto = langs.some(l => /^tr\b/i.test(l)) || tz === 'Europe/Istanbul' ? 'tr' : 'en';
  const lang = pick === 'tr' || pick === 'en' ? pick : auto;
  document.documentElement.lang = lang;
  const en = lang === 'en', D = new Map(), RULES = [], FALL = [];   // FALL: genel kalıplar, her zaman en son
  /* t('Türkçe metin', ...değerler): sözlükte yoksa kalıplara bakar, o da yoksa metnin kendisi. {0} {1} yer tutucu */
  function t(s, ...a) {
    if (s == null) return s;
    let r = s;
    if (en) {
      const k = String(s), w = k.trim();
      if (D.has(w)) r = k.replace(w, D.get(w));
      else { for (const [re, f] of RULES.concat(FALL)) { const m = re.exec(w); if (m) { r = k.replace(w, typeof f === 'function' ? f(...m.slice(1)) : w.replace(re, f)); break; } } }
    }
    return a.length ? String(r).replace(/\{(\d)\}/g, (m, i) => a[i]) : r;
  }
  const add = o => { for (const k in o) D.set(k, o[k]); };
  const rule = (re, f) => RULES.push([re, f]), fallback = (re, f) => FALL.push([re, f]);
  function set(l) { try { if (l === 'auto') localStorage.removeItem(KEY); else localStorage.setItem(KEY, l); } catch (e) {} location.reload(); }
  /* sayfa çevirisi: metin düğümleri ve birkaç öznitelik; yazdığımız çeviri tekrar tetiklese de sözlükte olmadığından durur */
  const ATTR = ['title', 'aria-label', 'placeholder', 'alt'];
  function node(n) {
    if (n.nodeType === 3) { const v = n.nodeValue; if (v && /\S/.test(v)) { const r = t(v); if (r !== v) n.nodeValue = r; } return; }
    if (n.nodeType !== 1 || n.tagName === 'SCRIPT' || n.tagName === 'STYLE' || n.closest && n.closest('svg')) return;
    for (const a of ATTR) { const v = n.getAttribute(a); if (v) { const r = t(v); if (r !== v) n.setAttribute(a, r); } }
    for (const c of n.childNodes) node(c);
  }
  let watching = false;
  function watch(root) {                                              // ikinci çağrı yalnızca yeniden tarar (yeni sözlük yüklendiyse)
    if (!en) return;
    root = root || document.body;
    node(root); if (document.title) document.title = t(document.title);
    if (watching) return; watching = true;
    new MutationObserver(list => { for (const m of list) {
      if (m.type === 'characterData') node(m.target);
      else if (m.type === 'attributes') node(m.target);
      else for (const n of m.addedNodes) node(n);
    } }).observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTR });
  }
  return { lang, en, pick, t, add, rule, fallback, set, watch, locale: en ? 'en-GB' : 'tr-TR' };
})();
window.T = window.MSLang.t;
