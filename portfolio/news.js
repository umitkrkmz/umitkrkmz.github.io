/* ===== news.js: Ankara Haber'in gündemi. content.js'teki şablonlardan (newsKit) güne, üç saatlik dilime, havaya, olaylara ve maça göre seçki.
   Aynı gün aynı dilimde aynı seçki; ertesi gün ya da sonraki dilimde başkası. Şehir yoksa (tek başına açılınca) hava, gün ve mevsim haberleri. ===== */
window.MSNews = (function () {
  const pad = n => String(n).padStart(2, '0');
  const hm = h => pad(Math.floor(h)) + ':' + pad(Math.floor((h % 1) * 60));
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed | 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const T = window.T || (s => s);                                       // dil: şablon doldurulmadan önce çevrilir
  const fill = (s, v) => T(s).replace(/\{(\w+)\}/g, (m, k) => v[k] !== undefined ? v[k] : m);
  const RAINY = /drizzle|rain|storm/;

  /* o: { kit, gags, date, hour, C (şehir ya da null), wx (MSWeather verisi ya da null), pick (elle seçilmiş hava türü ya da null) } */
  function build(o) {
    const K = o.kit || {}, d = o.date, h = o.hour, C = o.C, w = o.wx;
    const md = pad(d.getMonth() + 1) + '-' + pad(d.getDate()), key = d.getFullYear() + '-' + md + '|' + Math.floor(h / 3);
    const R = name => rng(hash(key + '|' + name));
    const one = (list, name) => list && list.length ? list[Math.floor(R(name)() * list.length)] : null;
    const r = R('vars'), pickOf = a => a[Math.floor(r() * a.length)];
    const two = a => { const x = pickOf(a); let y = pickOf(a); for (let i = 0; i < 5 && y === x; i++) y = pickOf(a); return [x, y]; };
    const [semt, semt2] = two(C && C.DISTRICTS ? C.DISTRICTS.map(x => x.name) : K.semtler || ['Kızılay']);
    const [cadde, cadde2] = two(K.caddeler || ['Tunalı Hilmi']);
    const V = { semt, semt2, cadde, cadde2, n: 3 + Math.floor(r() * 12) };
    const today = w && w.daily && w.daily[0], tom = w && w.daily && w.daily[1];
    if (w) Object.assign(V, { temp: Math.round(w.temp), feels: Math.round(w.feels), wind: Math.round(w.wind), windFrom: T(w.windFrom || ''), max: today ? Math.round(today.max) : Math.round(w.temp), min: today ? Math.round(today.min) : Math.round(w.temp) });
    if (tom) Object.assign(V, { tmax: Math.round(tom.max), tmin: Math.round(tom.min), drop: today ? Math.round(today.max - tom.max) : 0 });
    if (C) Object.assign(V, { cars: C.cars ? C.cars.filter(c => !c.off && !c.parked).length : 0, cats: C.cats ? C.cats.list.length : 0, hero: C.cityStats ? C.cityStats.hero : 0 });
    if (w) V.hum = Math.round(w.hum);
    if (tom && today) V.rise = Math.round(tom.max - today.max);
    const ag = C && C.cats && C.cats.agenda ? C.cats.agenda() : null;   // kedi toplantısının bu geceki gündemi (cats.js)
    V.agenda = T(ag ? ag.title : 'mama kabı krizi');

    let out = []; const start = Math.floor(h / 3) * 3;
    const add = (cat, item, prio, extra, time) => {
      if (!item) return; const v = Object.assign({}, V, extra);
      let th = start + R('t' + item[0])() * 3; if (th > h) th = Math.max(0, th - 3);   // sabit saat; henüz gelmediyse bir önceki dilimde
      const t = time || hm(th);
      if (prio < 70) prio += R('j' + item[0])() * 8;                  // ikincil haberler dilimden dilime yer değiştirir
      out.push({ cat, title: fill(item[0], v), text: fill(item[1], v), prio, time: t });
    };

    /* özel gün */
    const sp = K.dates && K.dates[md];
    if (sp) add('Bugün', one(sp.items, 'date'), 100);
    /* son olaylar (şehrin içinden açınca) */
    const log = C && C.eventLog ? C.eventLog : [];
    log.slice(0, 2).forEach((ev, i) => {
      const m = /^(.+?) Cd\. × (.+?) Sk\., (.+)$/.exec(ev.place || '') || [];
      const status = String(ev.status || '').replace(/[✓🕸]/g, '').trim();
      const pool = K.event && (ev.done && K.event[ev.type + 'Done'] || K.event[ev.type]);   // bitmiş olayın kendi haberi var
      add(ev.type === 'accident' || ev.type === 'pedestrian' ? 'Trafik' : 'Asayiş', one(pool, 'ev' + ev.id + (ev.done ? 'd' : '')), 90 - i,
        { cad: m[1] || cadde, sk: m[2] || 'Lale', esemt: m[3] || semt, time: ev.time, status: T(status) }, ev.time);
    });
    /* hava: şehirde elle seçilmişse o, değilse Ankara'nın gerçek havası */
    const kind = o.pick || (w && w.kind);
    if (kind && K.weather) add('Hava', one(K.weather[kind], 'w' + kind), 80);
    if (w && K.weather) {
      if (w.temp >= 28) add('Hava', one(K.weather.hot, 'hot'), 60);
      else if (w.temp <= 2) add('Hava', one(K.weather.cold, 'cold'), 60);
      if (w.wind >= 30) add('Hava', one(K.weather.windy, 'windy'), 58);
      if (w.hum >= 85 && !RAINY.test(kind || '')) add('Hava', one(K.weather.humid, 'humid'), 46);
      if (w.feels <= w.temp - 4) add('Hava', one(K.weather.chilly, 'chilly'), 47);
    }
    if (tom && K.tomorrow && window.MSWeather) {
      const tk = MSWeather.code(tom.code)[0], T = K.tomorrow;
      const it = V.drop >= 4 ? one(T.colder, 'colder') : V.rise >= 4 ? one(T.warmer, 'warmer') : RAINY.test(tk) && tk !== 'storm' ? one(T.rain, 'train') : tk === 'storm' ? one(T.storm, 'tstorm') : tk === 'snow' ? one(T.snow, 'tsnow') : tk === 'clear' && kind !== 'clear' ? one(T.clear, 'tclear') : null;
      add('Hava', it, 50);
    }
    /* maç */
    const M = C && C.match, MK = K.match || {};
    if (M && M.on && M.teams) {
      const ex = { a: M.teams[0].name, b: M.teams[1].name, x: M.score[0], y: M.score[1] };
      add('Spor', one(MK.live, 'live'), 85, ex);
      if (RAINY.test(kind || '')) add('Spor', one(MK.rainy, 'rainy'), 64, ex);
    } else {
      /* son maç: sayfa açıkken bittiyse M.last, değilse aynı tohumla hesaplanan sonuç (bugünkü ya da dünkü akşam maçı) */
      const pv = C && C.matchPreview, ls = h >= 20.75 ? [19, 0] : h >= 15.25 ? [13.5, 0] : [19, -1];
      const last = M && M.last ? M.last : pv ? pv(ls[0], 90, ls[1]) : null;
      if (last) {
        const [a, b] = last.teams, [x, y] = last.score, ex = { a, b, x, y, total: x + y };
        if (x !== y) Object.assign(ex, x > y ? { w: a, l: b, ws: x, ls: y } : { w: b, l: a, ws: y, ls: x });
        add('Spor', x + y >= 5 ? one(MK.goals, 'goals') : one(x === y ? MK.draw : MK.win, 'res'), 70, ex);
      }
    }
    const next = h < 13.5 ? '13.30' : h < 19 ? '19.00' : null;
    if (next && !(M && M.on)) {
      const pv = C && C.matchPreview ? C.matchPreview(next === '13.30' ? 13.5 : 19, 0) : null;   // sahaya çıkacak takımlar
      if (pv) add('Spor', one(MK.upcomingTeams, 'upt'), 52, { next, a: pv.teams[0], b: pv.teams[1] }); else add('Spor', one(MK.upcoming, 'up'), 52, { next });
    }
    /* kahraman, sakin gün */
    if (C && C.cityStats && C.cityStats.hero > 0) add('Asayiş', one(K.hero, 'hero'), 65);
    else { if (C && !log.length && h > 9) add('Asayiş', one(K.calm, 'calm'), 40); if (R('heroAny')() < 0.45) add('Asayiş', one(K.heroAny, 'heroAny'), 31); }
    /* şehrin canlı verisinden: günün kedisi, geliştiricinin yeri */
    if (C && C.cats && C.cats.list.length && R('catday')() < 0.7) { const c = C.cats.list[Math.floor(R('catpick')() * C.cats.list.length)]; add('Kediler', one(K.catDay, 'catday'), 35, { cat: c.name, coat: T(c.coat.name) }); }
    if (C && C.developer && C.developer.where && R('dev')() < 0.6) add('Kent', one(K.dev, 'dev'), 33, { where: T(C.developer.where()) });
    /* ulaşım, semt, esnaf, kültür (şehir olmadan da) */
    if (R('transit')() < 0.55) add('Ulaşım', one(K.transit, 'transit'), 38, { line: ['12', '34', '56'][Math.floor(R('line')() * 3)] });
    if (K.semt) { const ks = Object.keys(K.semt), sk = ks[Math.floor(R('semtpick')() * ks.length)]; add('Semt', one(K.semt[sk], 'semt'), 40); }
    if (R('esnaf')() < 0.6) add('Esnaf', one(K.esnaf, 'esnaf'), 37);
    if (R('kultur')() < 0.5) add('Kültür', one(K.kultur, 'kultur'), 36);
    /* saat dilimi, kediler, gün, mevsim */
    const TK = K.time || {};
    const slot = h >= 6 && h < 10.5 ? 'morning' : h >= 11 && h < 14 ? 'noon' : h >= 14 && h < 17 ? 'afternoon' : h >= 17 && h < 20.5 ? 'evening' : h >= 22 || h < 5 ? 'night' : null;
    if (slot) add(slot === 'morning' || slot === 'evening' ? 'Trafik' : 'Kent', one(TK[slot], 's' + slot), 45);
    if (h >= 18 && h < 21.5) add('Kediler', one(TK.catsSoon, 'cs'), 48);
    else if (h >= 21.5 || h < 1) add('Kediler', one(TK.catsNow, 'cn'), 62);
    if (K.weekday) add('Kent', one(K.weekday[d.getDay()], 'wd'), 42);
    const mo = d.getMonth() + 1, season = mo >= 3 && mo <= 5 ? 'spring' : mo >= 6 && mo <= 8 ? 'summer' : mo >= 9 && mo <= 11 ? 'autumn' : 'winter';
    if (K.season && R('season')() < 0.6) add('Kent', one(K.season[season], 'season'), 30);
    if (C && K.city && R('city')() < 0.6) add('Kent', one(K.city, 'city'), 25);
    /* en önemli 8 haber, kategori başına sınırla (sayfa hep hava ya da hep spor olmasın); kalan yeri şaka haberler doldurur, toplam 10, en az 2 (anma günlerinde yok) */
    const CAP = { Hava: 2, 'Asayiş': 2 }, seen = {};   // diğer her kategori 1
    out = out.sort((p, q) => q.prio - p.prio).filter(n => (seen[n.cat] = (seen[n.cat] || 0) + 1) <= (CAP[n.cat] || 1)).slice(0, 8);
    if (!(sp && sp.solemn)) {
      const g = (o.gags || []).map(x => [x, R('gag' + x[0])()]).sort((p, q) => p[1] - q[1]).map(x => x[0]);
      for (let i = 0, n = 0; i < g.length && (out.length < 10 || n < 2); i++, n++) add('Gündem', g[i], 10 - i * 0.1);
    }
    return out;
  }
  return { build };
})();
