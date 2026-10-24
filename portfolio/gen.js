/* ===== gen.js: proje detaylarının canlı kapakları. Her proje kendi fikrini anlatan küçük bir canvas animasyonu (details.js 'gen'):
   city, download, rag, stego, lorenz, graph, schema, vectors, layers, packets, uic. Kütüphane yok. Ekranda değilken ve sekme arka plandayken durur;
   "hareketi azalt" açıksa tek kare çizilir (setup still verirse o an) ve kapakta Oynat çıkar (GEN.play, localStorage ms.motion). GEN.mount(canvas, tür, renk); kapak DOM'dan çıkınca kendiliğinden bırakılır ===== */
window.GEN = (function () {
  'use strict';
  const sysReduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches), KEY = 'ms.motion';
  // sistem "hareketi azalt" diyorsa tek kare; kapaktaki Oynat ya da Ayarlar KEY'e '1' yazar, kapaklar yine oynar
  let reduce = sysReduce && (() => { try { return localStorage.getItem(KEY) !== '1'; } catch (e) { return true; } })();
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const rgba = (h, a) => { const [r, g, b] = rgb(h); return `rgba(${r},${g},${b},${a})`; };
  const rnd = seed => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const mono = (x, px, wt) => { x.font = `${wt || 500} ${px}px 'IBM Plex Mono', ui-monospace, monospace`; };
  const bg = (x, w, h, col) => {
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0d141b'); g.addColorStop(1, '#090d11'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    const r = x.createRadialGradient(w * 0.7, h * 0.2, 0, w * 0.7, h * 0.2, w * 0.7); r.addColorStop(0, rgba(col, 0.16)); r.addColorStop(1, rgba(col, 0)); x.fillStyle = r; x.fillRect(0, 0, w, h);
  };
  const rr = (x, a, b, w, h, r) => { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); };

  const A = {
    /* Mikro Şehir: izometrik bloklar, gece pencereleri, sokakta akan araç ışıkları */
    city: {
      setup() { const r = rnd(7), b = []; for (let i = 0; i < 10; i++) for (let j = 0; j < 7; j++) b.push({ i, j, h: 0.4 + r() * (r() < 0.2 ? 2.4 : 1.3), s: r() }); return { b }; },
      draw(x, w, h, t, s, col) {
        bg(x, w, h, col);
        const cw = Math.min(w / 16, h / 7.2), ox = w * 0.5 + Math.sin(t * 0.08) * cw * 0.6, oy = h * 0.38;   // en yüksek kule de kapakta kalsın
        const P = (i, j, z) => [ox + (i - j) * cw * 0.9, oy + (i + j) * cw * 0.45 - z * cw];
        for (const k of s.b.slice().sort((p, q) => (p.i + p.j) - (q.i + q.j))) {
          const z = k.h, [ax, ay] = P(k.i, k.j, z), [bx, by] = P(k.i + 0.8, k.j, z), [cx, cy] = P(k.i + 0.8, k.j + 0.8, z), [dx, dy] = P(k.i, k.j + 0.8, z);
          const [ex, ey] = P(k.i + 0.8, k.j + 0.8, 0), [fx, fy] = P(k.i, k.j + 0.8, 0), [gx, gy] = P(k.i + 0.8, k.j, 0);
          x.fillStyle = '#1a232d'; x.beginPath(); x.moveTo(dx, dy); x.lineTo(cx, cy); x.lineTo(ex, ey); x.lineTo(fx, fy); x.fill();
          x.fillStyle = '#141b23'; x.beginPath(); x.moveTo(cx, cy); x.lineTo(bx, by); x.lineTo(gx, gy); x.lineTo(ex, ey); x.fill();
          x.fillStyle = '#26313c'; x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.lineTo(cx, cy); x.lineTo(dx, dy); x.fill();
          const rows = Math.max(1, Math.round(z * 3));
          for (let q = 0; q < rows; q++) for (let p = 0; p < 3; p++) {
            const on = Math.sin(k.s * 90 + q * 7.1 + p * 3.3 + t * 0.3 * (k.s > 0.5 ? 1 : 0)) > 0.25; if (!on) continue;
            const u = (p + 0.5) / 3.2, v = (q + 0.6) / (rows + 0.4), wx = fx + (ex - fx) * u, wy = fy + (ey - fy) * u - (fy - dy) * v;
            x.fillStyle = rgba(col, 0.75); x.fillRect(wx - 1.2, wy - 1.6, 2.4, 2.4);
          }
        }
        for (let c = 0; c < 14; c++) {                                   // yollardaki ışıklar
          const lane = c % 7, u = ((t * (0.05 + (c % 3) * 0.02) + c * 0.37) % 1) * 10, [px, py] = P(u, lane - 0.1, 0);
          x.fillStyle = c % 2 ? 'rgba(255,90,80,.9)' : 'rgba(255,236,180,.95)'; x.beginPath(); x.arc(px, py, 1.6, 0, 7); x.fill();
        }
      }
    },
    /* MediaGrab: link girer, indirmeler paralel dolar */
    download: {
      setup() { return { items: [['video · 1080p.mp4', 0.11], ['audio · opus', 0.19], ['playlist · 12/40', 0.07], ['subtitles · tr.srt', 0.28]] }; },
      draw(x, w, h, t, s, col) {
        bg(x, w, h, col);
        const L = w * 0.08, R = w * 0.92, top = h * 0.2, gap = h * 0.17;
        mono(x, Math.max(10, h * 0.045)); const lw = x.measureText('https://youtu.be/…').width + h * 0.08;   // kutu yazıya göre
        rr(x, L, top - h * 0.1, lw, h * 0.09, h * 0.045); x.fillStyle = 'rgba(255,255,255,.06)'; x.fill(); x.strokeStyle = rgba(col, 0.5); x.stroke();
        x.fillStyle = '#c9d2d8'; x.textBaseline = 'middle'; x.fillText('https://youtu.be/…', L + h * 0.04, top - h * 0.055);
        s.items.forEach(([lab, sp], k) => {
          const y = top + gap * (k + 0.6), p = Math.min(1, ((t * sp + k * 0.31) % 1.25)), done = p >= 1;
          mono(x, Math.max(9, h * 0.04)); x.fillStyle = done ? '#7fd99a' : '#9aa8b3'; x.fillText(lab, L, y - h * 0.045);
          x.fillText(done ? '✓' : Math.round(p * 100) + '%', R - h * 0.09, y - h * 0.045);
          rr(x, L, y, R - L, h * 0.035, h * 0.0175); x.fillStyle = 'rgba(255,255,255,.07)'; x.fill();
          rr(x, L, y, Math.max(h * 0.035, (R - L) * p), h * 0.035, h * 0.0175); x.fillStyle = done ? '#5ec27a' : col; x.fill();
        });
      }
    },
    /* Kurumsal Bilgi: soru gelir, en yakın belgeler parlar, yanıt yazılır (RAG) */
    rag: {
      setup() { const r = rnd(11), d = []; for (let k = 0; k < 22; k++) d.push({ x: 0.06 + r() * 0.5, y: 0.12 + r() * 0.76 }); return { d }; },
      draw(x, w, h, t, s, col) {
        bg(x, w, h, col);
        const ph = (t / 5) % 1, q = { x: 0.3 + 0.18 * Math.cos(Math.floor(t / 5) * 2.4), y: 0.5 + 0.28 * Math.sin(Math.floor(t / 5) * 1.7) };
        const near = s.d.map((p, i) => [i, Math.hypot(p.x - q.x, (p.y - q.y) * h / w)]).sort((a, b) => a[1] - b[1]).slice(0, 3).map(a => a[0]);
        const ans = { x: w * 0.82, y: h * 0.5 };
        s.d.forEach((p, i) => {
          const on = near.includes(i) && ph > 0.2;
          if (on) { x.strokeStyle = rgba(col, Math.min(1, (ph - 0.2) * 4) * 0.6); x.lineWidth = 1.5; x.beginPath(); x.moveTo(p.x * w + 9, p.y * h); x.quadraticCurveTo(w * 0.65, p.y * h, ans.x - 40, ans.y); x.stroke(); }
          rr(x, p.x * w - 9, p.y * h - 12, 18, 24, 3); x.fillStyle = on ? rgba(col, 0.9) : 'rgba(255,255,255,.1)'; x.fill();
          x.fillStyle = on ? '#0d141b' : 'rgba(255,255,255,.18)'; for (let l = 0; l < 3; l++) x.fillRect(p.x * w - 5, p.y * h - 6 + l * 5, l === 2 ? 6 : 10, 1.6);
        });
        const r0 = 10 + 30 * (ph < 0.2 ? ph * 5 : 1); x.strokeStyle = rgba(col, 0.5 * (1 - ph)); x.beginPath(); x.arc(q.x * w, q.y * h, r0, 0, 7); x.stroke();
        x.fillStyle = col; x.beginPath(); x.arc(q.x * w, q.y * h, 6, 0, 7); x.fill();
        rr(x, ans.x - 40, ans.y - h * 0.22, w * 0.15, h * 0.44, 8); x.fillStyle = 'rgba(255,255,255,.06)'; x.fill(); x.strokeStyle = rgba(col, 0.45); x.stroke();
        const lines = Math.floor(Math.max(0, ph - 0.45) * 14);
        x.fillStyle = '#d6dde2'; for (let l = 0; l < Math.min(6, lines); l++) x.fillRect(ans.x - 30, ans.y - h * 0.16 + l * h * 0.055, (w * 0.15 - 20) * (l === 5 ? 0.5 : 0.9), 2.4);
      }
    },
    /* StegoTester: gürültünün içindeki gizli yazı, tarayıcı çizgisi geçince belirir */
    stego: {
      setup(w, h) {
        const cv = document.createElement('canvas'), c = 7, W = Math.ceil(w / c), H = Math.ceil(h / c); cv.width = W; cv.height = H;
        const m = cv.getContext('2d'); m.fillStyle = '#fff'; m.font = `800 ${Math.floor(H * 0.62)}px 'Big Shoulders Display', 'Arial Narrow', sans-serif`; m.textAlign = 'center'; m.textBaseline = 'middle'; m.fillText('HIDDEN', W / 2, H / 2 + 1);
        const d = m.getImageData(0, 0, W, H).data, r = rnd(5), cells = [];
        for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) cells.push({ v: 22 + r() * 30, m: d[(j * W + i) * 4] > 128 });
        return { c, W, H, cells };
      },
      draw(x, w, h, t, s, col) {
        const { c, W, cells } = s, scan = ((t * 0.12) % 1.3) * w;
        for (let k = 0; k < cells.length; k++) {
          const e = cells[k], i = k % W, j = (k / W) | 0, px = i * c, d = px - scan, glow = d < 0 && d > -w * 0.35 ? 1 + d / (w * 0.35) : 0;
          const v = e.v + Math.sin(t * 2 + k) * 2;
          x.fillStyle = e.m && glow > 0 ? rgba(col, 0.25 + glow * 0.75) : `rgb(${v},${v + 6},${v + 12})`; x.fillRect(px, j * c, c - 1, c - 1);
        }
        x.fillStyle = rgba(col, 0.9); x.fillRect(scan, 0, 2, h);
        const g = x.createLinearGradient(scan - 40, 0, scan, 0); g.addColorStop(0, rgba(col, 0)); g.addColorStop(1, rgba(col, 0.25)); x.fillStyle = g; x.fillRect(scan - 40, 0, 40, h);
      }
    },
    /* Chaotic Audio: gerçek Lorenz denklemleri, dönen çeker ve altta ses dalgası */
    lorenz: {
      setup() { return { p: [0.1, 0, 0], tr: [] }; },
      draw(x, w, h, t, s, col) {
        bg(x, w, h, col);
        for (let k = 0; k < (reduce ? 4000 : 5); k++) {
          const [a, b, c] = s.p, dt = 0.009; s.p = [a + 10 * (b - a) * dt, b + (a * (28 - c) - b) * dt, c + (a * b - 8 / 3 * c) * dt];
          s.tr.push(s.p); if (s.tr.length > 1600) s.tr.shift();
        }
        const ang = t * 0.18, sc = h / 62, cx = w * 0.5, cy = h * 0.88;
        x.lineWidth = 1.3;
        for (let k = 1; k < s.tr.length; k++) {
          const [a, b, c] = s.tr[k], [a0, b0, c0] = s.tr[k - 1];
          const X = (a * Math.cos(ang) - b * Math.sin(ang)) * sc + cx, Y = cy - c * sc, X0 = (a0 * Math.cos(ang) - b0 * Math.sin(ang)) * sc + cx, Y0 = cy - c0 * sc;
          x.strokeStyle = rgba(col, k / s.tr.length * 0.9); x.beginPath(); x.moveTo(X0, Y0); x.lineTo(X, Y); x.stroke();
        }
        x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 1; x.beginPath();
        const n = Math.min(260, s.tr.length);
        for (let k = 0; k < n; k++) { const v = s.tr[s.tr.length - n + k][0]; const X = w * 0.04 + k / n * w * 0.92, Y = h * 0.93 + v * h * 0.0016 * 2; k ? x.lineTo(X, Y) : x.moveTo(X, Y); }
        x.stroke();
        mono(x, Math.max(9, h * 0.04)); x.fillStyle = '#9aa8b3'; x.fillText('dx/dt = σ(y − x)   dy/dt = x(ρ − z) − y   dz/dt = xy − βz', w * 0.04, h * 0.08);
      }
    },
    /* ai-context-mapping: proje haritası; ajan aramadan önce haritayı okur, nabız düğümden düğüme gider */
    graph: {
      setup() {
        const r = rnd(3), names = ['AGENTS.md', 'maps/', 'invariants', 'decisions', 'mcp', 'scripts', 'tests', 'hooks', 'templates', 'docs', 'skills', 'benchmarks'];
        const n = names.map((nm, i) => ({ nm, x: i ? 0.5 + Math.cos(i / 11 * 6.28) * (0.25 + r() * 0.14) : 0.5, y: i ? 0.52 + Math.sin(i / 11 * 6.28) * (0.3 + r() * 0.08) : 0.52 }));
        const e = []; for (let i = 1; i < n.length; i++) { e.push([0, i]); if (r() < 0.6) e.push([i, i % (n.length - 1) + 1]); }
        return { n, e };
      },
      draw(x, w, h, t, s, col) {
        bg(x, w, h, col);
        const P = k => [s.n[k].x * w, s.n[k].y * h];
        for (const [a, b] of s.e) { const [ax, ay] = P(a), [bx, by] = P(b); x.strokeStyle = 'rgba(255,255,255,.12)'; x.lineWidth = 1; x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.stroke(); }
        const E = s.e[Math.floor(t * 0.9) % s.e.length], u = (t * 0.9) % 1, [ax, ay] = P(E[0]), [bx, by] = P(E[1]);
        x.strokeStyle = rgba(col, 0.8); x.lineWidth = 2; x.beginPath(); x.moveTo(ax, ay); x.lineTo(ax + (bx - ax) * u, ay + (by - ay) * u); x.stroke();
        x.fillStyle = col; x.beginPath(); x.arc(ax + (bx - ax) * u, ay + (by - ay) * u, 4, 0, 7); x.fill();
        mono(x, Math.max(9, h * 0.04)); x.textAlign = 'center'; x.textBaseline = 'middle';
        s.n.forEach((p, k) => {
          const [px, py] = P(k), hot = k === E[0] || k === E[1] || k === 0, tw = x.measureText(p.nm).width + 14;
          rr(x, px - tw / 2, py - 10, tw, 20, 10); x.fillStyle = k === 0 ? col : hot ? rgba(col, 0.3) : 'rgba(255,255,255,.07)'; x.fill();
          x.fillStyle = k === 0 ? '#0d141b' : hot ? '#eef2f4' : '#9aa8b3'; x.fillText(p.nm, px, py + 1);
        });
        x.textAlign = 'left';
      }
    },
    /* sqlSchema: şema bir gökyüzü; kamera sırayla bir takımyıldıza yaklaşır, adlı yıldızlar kolon listeli tablo kartına döner, karga ayağıyla bağlanır */
    schema: {
      setup() {
        const r = rnd(11), n = [], e = [], dust = [];
        const C = [['BILLING', 0.25, 0.3, ['INVOICE', 'BILLING_ACCOUNT', 'PAYMENT', 'TARIFF']], ['CRM', 0.72, 0.27, ['CUSTOMER', 'CONTACT', 'ADDRESS', 'SEGMENT']],
          ['ORDERS', 0.3, 0.74, ['ORDERS', 'ORDER_ITEM', 'PRODUCT', 'SHIPMENT']], ['NETWORK', 0.75, 0.72, ['SUBSCRIPTION', 'CDR', 'CELL_SITE', 'DEVICE']]];
        const OFF = [[0, 0], [0.12, -0.1], [-0.11, 0.1], [0.1, 0.13]];   // adlı yıldızlar elle: yaklaşınca kartlar çakışmasın
        C.forEach(([, cx, cy, names], c) => {
          const b = n.length;
          for (let k = 0; k < 7; k++) {
            const a = r() * 6.28, d = 0.15 + r() * 0.05, o = OFF[k] || [Math.cos(a) * d, Math.sin(a) * d * 0.8];
            n.push({ c, x: cx + o[0], y: cy + o[1], nm: names[k] || '', m: k < 4 ? 1.7 - k * 0.2 : 0.7 });
          }
          e.push([b, b + 1], [b, b + 2], [b + 1, b + 3], [b + 2, b + 4], [b + 1, b + 5], [b + 3, b + 6]);
        });
        e.push([0, 7], [7, 21], [14, 21], [2, 14]);                     // şemalar arası
        for (let i = 0; i < 70; i++) dust.push([r(), r(), r()]);
        return { C, n, e, dust, still: 6 };                                // hareketsiz kipte kartların göründüğü kare
      },
      draw(x, w, h, t, s, col) {
        bg(x, w, h, col);
        const T = 11, f = Math.floor(t / T) % 4, p = (t % T) / T, sm = v => v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v);
        const a = sm((p - 0.12) / 0.28) * (1 - sm((p - 0.8) / 0.16)), z = 1 + a * 1.7, pal = [col, '#a58cf2', '#ef7b86', '#f2b45a'];
        const fx = 0.5 + (s.C[f][1] - 0.5) * a, fy = 0.5 + (s.C[f][2] - 0.5) * a, P = q => [w / 2 + (q.x - fx) * w * z, h / 2 + (q.y - fy) * h * z];
        for (const [u, v, k] of s.dust) { x.fillStyle = `rgba(220,230,255,${0.15 + k * 0.35})`; x.fillRect(((u - fx) * z * 0.3 + u) % 1 * w, v * h, 1, 1); }
        const vis = q => q.c === f ? 1 : 1 - a * 0.85, card = a > 0.55 ? sm((a - 0.55) / 0.35) : 0, CW = Math.max(88, Math.min(124, w * 0.27)), CH = 50, nc = Math.floor((CW - 14) / 5.8);   // dar kapakta kart yazısı sığsın
        for (const [i, j] of s.e) {
          const A = s.n[i], B = s.n[j], [ax, ay] = P(A), [bx, by] = P(B), same = A.c === B.c;
          x.strokeStyle = same ? rgba(pal[A.c], 0.28 * Math.min(vis(A), vis(B))) : `rgba(200,210,240,${0.12 * (1 - a)})`; x.lineWidth = 1;
          x.setLineDash(same ? [] : [4, 4]); x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.stroke(); x.setLineDash([]);
          if (card && A.c === f && A.nm && B.nm) {                           // karga ayağı: B ucunda çok, A ucunda bir
            const L = Math.hypot(bx - ax, by - ay) || 1, ux = (bx - ax) / L, uy = (by - ay) / L, cut = (cx, cy, sg) => { const k = Math.min(CW / 2 / (Math.abs(ux) || 1e-6), CH / 2 / (Math.abs(uy) || 1e-6)); return [cx - ux * k * sg, cy - uy * k * sg]; };
            const [qx, qy] = cut(bx, by, 1), [ox, oy] = cut(ax, ay, -1);
            x.strokeStyle = rgba(col, 0.9 * card); x.lineWidth = 1.5; x.beginPath();
            for (const sg of [-1, 0, 1]) { x.moveTo(qx - ux * 11, qy - uy * 11); x.lineTo(qx - uy * 6 * sg, qy + ux * 6 * sg); }
            for (const d of [6, 10]) { x.moveTo(ox + ux * d - uy * 5, oy + uy * d + ux * 5); x.lineTo(ox + ux * d + uy * 5, oy + uy * d - ux * 5); }
            x.stroke();
          }
        }
        mono(x, Math.max(9, h * 0.036));
        s.n.forEach(q => {
          const [px, py] = P(q), al = vis(q), c = pal[q.c], R = q.m * 2.2 * (1 + a * 0.4);
          const g = x.createRadialGradient(px, py, 0, px, py, R * 5); g.addColorStop(0, rgba(c, 0.5 * al)); g.addColorStop(1, rgba(c, 0)); x.fillStyle = g; x.beginPath(); x.arc(px, py, R * 5, 0, 7); x.fill();
          x.fillStyle = `rgba(255,255,255,${0.9 * al})`; x.beginPath(); x.arc(px, py, R * 0.6, 0, 7); x.fill();
          if (q.c === f && q.nm && a > 0.2 && card < 1) { x.fillStyle = `rgba(228,233,247,${0.8 * sm((a - 0.2) / 0.2) * (1 - card)})`; x.textAlign = 'center'; x.fillText('αβγδ'[s.n.indexOf(q) % 7] + ' ' + s.C[f][0], px, py + R * 4 + 6); }
          if (card && q.c === f && q.nm) {                                    // tablo kartı: başlık şemanın renginde, PK, FK, sıradan kolon
            const k = s.n.indexOf(q) % 7, rows = [['id', 'PK'], [k ? s.C[f][3][0].toLowerCase() + '_id' : 'name', k ? 'FK' : ''], ['created_at', '']];
            x.globalAlpha = card; rr(x, px - CW / 2, py - CH / 2, CW, CH, 6); x.fillStyle = 'rgba(10,16,39,.94)'; x.fill(); x.strokeStyle = rgba(col, 0.6); x.lineWidth = 1; x.stroke();
            x.fillStyle = col; x.textAlign = 'left'; mono(x, 9.5, 700); x.fillText(q.nm.length > nc ? q.nm.slice(0, nc - 1) + '…' : q.nm, px - CW / 2 + 7, py - CH / 2 + 11);
            mono(x, 8.5); rows.forEach(([nm, tg], i) => { const yy = py - CH / 2 + 23 + i * 10; x.fillStyle = tg ? '#e4e9f7' : '#8a96b8'; x.fillText(nm.slice(0, nc - 3), px - CW / 2 + 7, yy); if (tg) { x.fillStyle = tg === 'PK' ? '#f2b45a' : col; x.textAlign = 'right'; x.fillText(tg, px + CW / 2 - 7, yy); x.textAlign = 'left'; } });
            x.globalAlpha = 1; mono(x, Math.max(9, h * 0.036));
          }
        });
        x.textAlign = 'center'; mono(x, Math.max(10, h * 0.042), 600);
        s.C.forEach(([nm, cx, cy], c) => { const [px, py] = P({ x: cx, y: cy - 0.17 }); x.fillStyle = rgba(pal[c], 0.75 * (1 - a)); x.fillText(nm, px, py); });
        x.textAlign = 'left';
      }
    },
    /* how-ai-actually-works: kelime vektörleri ve aralarındaki açının kosinüsü */
    vectors: {
      setup() { return { v: [0.2, 0.9, 1.5, 2.3, 3.6, 4.4, 5.2] }; },
      draw(x, w, h, t, s, col) {
        bg(x, w, h, col);
        const ox = w * 0.34, oy = h * 0.6, R = h * 0.42;
        x.strokeStyle = 'rgba(255,255,255,.06)'; x.lineWidth = 1;
        for (let g = -6; g <= 6; g++) { x.beginPath(); x.moveTo(ox + g * R / 3, oy - R * 1.2); x.lineTo(ox + g * R / 3, oy + R); x.stroke(); x.beginPath(); x.moveTo(ox - R * 2, oy + g * R / 3); x.lineTo(ox + R * 2, oy + g * R / 3); x.stroke(); }
        const a1 = s.v[1] + Math.sin(t * 0.4) * 0.5, a2 = s.v[2] + Math.cos(t * 0.33) * 0.7;
        const arrow = (a, c, wd, L) => { const ex = ox + Math.cos(a) * R * L, ey = oy - Math.sin(a) * R * L; x.strokeStyle = c; x.lineWidth = wd; x.beginPath(); x.moveTo(ox, oy); x.lineTo(ex, ey); x.stroke(); x.fillStyle = c; x.beginPath(); x.arc(ex, ey, wd + 1.5, 0, 7); x.fill(); };
        s.v.forEach((a, k) => { if (k !== 1 && k !== 2) arrow(a + Math.sin(t * 0.2 + k) * 0.08, 'rgba(255,255,255,.22)', 1.5, 0.55 + (k % 3) * 0.15); });
        arrow(a1, col, 3, 1); arrow(a2, '#eef2f4', 3, 0.9);
        x.strokeStyle = rgba(col, 0.7); x.lineWidth = 1.5; x.beginPath(); x.arc(ox, oy, R * 0.3, -Math.max(a1, a2), -Math.min(a1, a2)); x.stroke();
        mono(x, Math.max(11, h * 0.065), 600); x.fillStyle = '#eef2f4'; x.fillText('cos θ = ' + Math.cos(a2 - a1).toFixed(2), w * 0.64, h * 0.42);
        mono(x, Math.max(9, h * 0.04)); x.fillStyle = '#9aa8b3'; x.fillText('a · b / (|a| |b|)', w * 0.64, h * 0.54);
      }
    },
    /* Limbo: iç içe rüya katmanları, sonsuz içeri yakınlaşma; ortada dönen topaç */
    layers: {
      setup() { return {}; },
      draw(x, w, h, t, s, col) {
        bg(x, w, h, col);
        const cx = w / 2, cy = h / 2, N = 9, ph = (t * 0.12) % 1;
        for (let k = N; k >= 0; k--) {
          const f = (k + ph) / N, S = Math.pow(f, 2.2) * Math.max(w, h) * 1.1, a = (k + ph) * 0.22 + t * 0.03;
          x.save(); x.translate(cx, cy); x.rotate(a); x.strokeStyle = rgba(col, 0.12 + (1 - f) * 0.55); x.lineWidth = 1.5; rr(x, -S / 2, -S * 0.31, S, S * 0.62, S * 0.06); x.stroke(); x.restore();
        }
        x.save(); x.translate(cx, cy); const sp = Math.sin(t * 9) * 0.25; x.rotate(sp * 0.3);
        x.fillStyle = '#eef2f4'; x.beginPath(); x.moveTo(0, h * 0.06); x.lineTo(-h * 0.045, -h * 0.01); x.lineTo(h * 0.045, -h * 0.01); x.closePath(); x.fill(); x.fillRect(-1.5, -h * 0.05, 3, h * 0.04); x.restore();
      }
    },
    /* ZeroDivert: SNI'li TLS paketi DPI kapısına gelir, küçük parçalara bölünüp geçer, ötede birleşir */
    packets: {
      setup() { return {}; },
      draw(x, w, h, t, s, col) {
        bg(x, w, h, col);
        const gate = w * 0.52, ph = (t / 4.5) % 1, y = h * 0.52, bw = w * 0.3, bh = h * 0.16;
        x.setLineDash([6, 6]); x.strokeStyle = 'rgba(255,90,80,.55)'; x.lineWidth = 2; x.beginPath(); x.moveTo(gate, h * 0.12); x.lineTo(gate, h * 0.9); x.stroke(); x.setLineDash([]);
        mono(x, Math.max(10, h * 0.045), 600); x.fillStyle = '#ff8a80'; x.textAlign = 'center'; x.fillText('DPI', gate, h * 0.09); x.textAlign = 'left';
        const sni = 'SNI: discord.com';
        if (ph < 0.35) {                                                    // bütün paket kapıya yaklaşır
          const px = w * 0.04 + (gate - bw - w * 0.08) * (ph / 0.35);
          rr(x, px, y - bh / 2, bw, bh, 6); x.fillStyle = rgba(col, 0.25); x.fill(); x.strokeStyle = col; x.stroke();
          mono(x, Math.max(9, h * 0.045)); x.fillStyle = '#eef2f4'; x.fillText('TLS ClientHello', px + 10, y - bh * 0.12); x.fillStyle = '#ffb53d'; x.fillText(sni, px + 10, y + bh * 0.28);
        } else {                                                            // parçalar teker teker geçer
          const parts = 8, pw = bw / parts;
          for (let k = 0; k < parts; k++) {
            const u = Math.max(0, Math.min(1, (ph - 0.35 - k * 0.045) / 0.4)), sx = gate - bw - w * 0.04 + k * pw, ex = gate + w * 0.08 + k * pw * 1.02;
            const px = sx + (ex - sx) * u, py = y + Math.sin(k * 1.7) * h * 0.18 * Math.sin(Math.PI * u);
            rr(x, px, py - bh / 2, pw - 3, bh, 3); x.fillStyle = rgba(col, 0.3); x.fill(); x.strokeStyle = rgba(col, 0.9); x.stroke();
            mono(x, Math.max(8, h * 0.04)); x.fillStyle = '#ffb53d'; x.fillText(sni.slice(k * 2, k * 2 + 2), px + 3, py + 4);
          }
          if (ph > 0.9) { mono(x, Math.max(10, h * 0.05), 600); x.fillStyle = '#7fd99a'; x.fillText('✓ gateway.discord.gg', gate + w * 0.08, h * 0.25); }
        }
      }
    },
    /* ui2py: .ui (XML) satırları soldan, Python satırları sağda yazılarak çıkar */
    uic: {
      setup() {
        return { a: ['<ui version="4.0">', ' <widget class="QMainWindow">', '  <widget class="QPushButton"', '   name="convert">', '  <property name="text">', '   <string>Convert</string>', ' </widget>', '</ui>'],
          b: ['from PySide6.QtWidgets import *', '', 'class Ui_MainWindow(object):', '    def setupUi(self, win):', '        self.convert = QPushButton(win)', '        self.convert.setText("Convert")', '', '# ui_main_window.py'] };
      },
      draw(x, w, h, t, s, col) {
        bg(x, w, h, col);
        const lh = h * 0.095, L = w * 0.05, M = w * 0.53, top = h * 0.16, fs = Math.max(8, Math.min(h * 0.045, w * 0.42 / 36 / 0.62));   // en uzun satır panele sığsın
        rr(x, L - 10, top - lh, w * 0.42, lh * 9.4, 8); x.fillStyle = 'rgba(255,255,255,.04)'; x.fill();
        rr(x, M - 10, top - lh, w * 0.43, lh * 9.4, 8); x.fillStyle = 'rgba(255,255,255,.04)'; x.fill();
        mono(x, fs); s.a.forEach((l, k) => { x.fillStyle = l.includes('class') ? '#8ab4f8' : '#9aa8b3'; x.fillText(l, L, top + k * lh); });
        const ph = (t * 0.6) % (s.b.length + 3), shown = Math.floor(ph);
        s.b.forEach((l, k) => {
          if (k > shown) return; const txt = k === shown ? l.slice(0, Math.floor((ph % 1) * l.length)) : l;
          x.fillStyle = l.startsWith('#') ? '#6b7682' : l.includes('class') || l.includes('def') || l.startsWith('from') ? col : '#d6dde2'; x.fillText(txt, M, top + k * lh);
        });
        x.fillStyle = col; x.beginPath(); const ay = h * 0.5; x.moveTo(w * 0.475, ay - 7); x.lineTo(w * 0.495, ay); x.lineTo(w * 0.475, ay + 7); x.fill();
      }
    }
  };

  const live = new Set();
  const io = window.IntersectionObserver ? new IntersectionObserver(es => { for (const e of es) for (const o of live) if (o.cv === e.target) o.vis = e.isIntersecting; }) : null;
  function size(o) {
    const d = Math.min(2, window.devicePixelRatio || 1), w = o.cv.clientWidth, h = o.cv.clientHeight; if (!w || !h) return false;
    if (o.w !== w || o.h !== h) { o.cv.width = w * d; o.cv.height = h * d; o.w = w; o.h = h; o.d = d; o.st = o.A.setup(w, h); }
    return true;
  }
  function frame(o, now) {
    if (!size(o)) return;
    const x = o.cv.getContext('2d'); x.setTransform(o.d, 0, 0, o.d, 0, 0);
    o.A.draw(x, o.w, o.h, reduce ? o.st.still || 12 : Math.max(0, now - o.t0) / 1000, o.st, o.col);   // ilk rAF damgası mount'tan önce olabilir
  }
  let raf = 0;
  function loop(now) {
    raf = 0;
    for (const o of [...live]) { if (!o.cv.isConnected) { live.delete(o); if (io) io.unobserve(o.cv); continue; } if (o.vis && !document.hidden) frame(o, now); }
    if (live.size && !reduce) raf = requestAnimationFrame(loop);
  }
  function mount(cv, kind, col) {
    const Akind = A[kind]; if (!cv || !Akind) return;
    const o = { cv, A: Akind, col: col || '#ffb53d', t0: performance.now(), vis: true };
    live.add(o); if (io) io.observe(cv);
    if (sysReduce && window.ResizeObserver) new ResizeObserver(() => { if (reduce && cv.isConnected) frame(o, 0); }).observe(cv);
    if (reduce) playBtn(cv);   // döngü yok: boyut değişince (tam ekran) tek kare yeniden
    requestAnimationFrame(now => { frame(o, now); if (!raf && !reduce) raf = requestAnimationFrame(loop); });
  }
  function playBtn(cv) {                                              // hareketsiz kapakta Oynat
    const box = cv.parentNode; if (!box || box.querySelector('.gen-play')) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'gen-play'; b.textContent = '▶ Oynat';
    b.addEventListener('click', () => play(true)); box.appendChild(b);
  }
  function play(on) {                                                 // true: kapaklar oynar (tercih saklanır), false: sisteme uy
    try { if (on) localStorage.setItem(KEY, '1'); else localStorage.removeItem(KEY); } catch (e) {}
    reduce = sysReduce && !on;
    document.querySelectorAll('.gen-play').forEach(b => b.remove());
    for (const o of live) { o.t0 = performance.now(); if (reduce) { frame(o, 0); playBtn(o.cv); } }
    if (!reduce && live.size && !raf) raf = requestAnimationFrame(loop);
  }
  return { mount, kinds: Object.keys(A), play, sysReduce, get moving() { return !reduce; } };
})();
