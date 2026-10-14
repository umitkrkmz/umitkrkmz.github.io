/* ===== buildings.js: cephe dokuları, bloklar, parseller, binalar, ayrıntı kademesi ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene;

/* ---------- cephe dokuları (16x16 hücre, hücre 64 px) ----------
   Pencere oranları interiors.js'deki pencere maskesiyle aynı: apt x 0,19–0,81, v 0,25–0,84; cw 0,06–0,94. */
function facade(style) {
  const S = 1024, n = 16, c = S / n, q = c / 32, r = C.rng(style === 'cw' ? 11 : 5);
  const a = document.createElement('canvas'); a.width = a.height = S;
  const b = document.createElement('canvas'); b.width = b.height = S;
  const x = a.getContext('2d'), y = b.getContext('2d');
  y.fillStyle = '#000'; y.fillRect(0, 0, S, S);
  x.fillStyle = style === 'cw' ? '#8aa3b5' : '#ebe5d8'; x.fillRect(0, 0, S, S);
  if (style !== 'cw') for (let k = 0; k < 900; k++) {          // sıvada hafif lekeler
    x.fillStyle = r() < 0.5 ? 'rgba(0,0,0,.035)' : 'rgba(255,255,255,.05)';
    x.fillRect(r() * S, r() * S, 4 + r() * 30, 3 + r() * 18);
  }
  const warm = ['#ffd9a0', '#ffe9bd', '#fff3d6', '#ffc98a', '#cfe6ff'];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const px = i * c, py = j * c, lit = r() < 0.42, sh = 0.85 + r() * 0.3;
    const lc = warm[(r() * warm.length) | 0];
    if (style === 'cw') {
      const g = x.createLinearGradient(px, py, px, py + c);
      g.addColorStop(0, `rgb(${95 * sh | 0},${128 * sh | 0},${152 * sh | 0})`);
      g.addColorStop(1, `rgb(${60 * sh | 0},${88 * sh | 0},${112 * sh | 0})`);
      x.fillStyle = g; x.fillRect(px + 2 * q, py + 2 * q, c - 4 * q, c - 4 * q);
      x.fillStyle = 'rgba(255,255,255,.07)';                      // çapraz yansıma
      x.beginPath(); x.moveTo(px + c * 0.15, py + 2 * q); x.lineTo(px + c * 0.45, py + 2 * q); x.lineTo(px + c * 0.2, py + c - 2 * q); x.lineTo(px + 2 * q, py + c - 2 * q); x.closePath(); x.fill();
      x.fillStyle = '#1d2a34'; x.fillRect(px, py, c, 2 * q); x.fillRect(px, py, 2 * q, c);
      x.fillStyle = '#26343f'; x.fillRect(px, py + c - 3.5 * q, c, 3.5 * q);          // kat arası bant
      if (lit) { y.globalAlpha = 0.85; y.fillStyle = lc; y.fillRect(px + 3 * q, py + 3 * q, c - 6 * q, c - 7 * q); y.globalAlpha = 1; }
    } else {
      const wx = px + 6 * q, wy = py + 5 * q, ww = c - 12 * q, wh = c - 13 * q;
      const g = x.createLinearGradient(wx, wy, wx, wy + wh);
      g.addColorStop(0, `rgb(${44 * sh | 0},${64 * sh | 0},${86 * sh | 0})`);
      g.addColorStop(1, `rgb(${70 * sh | 0},${96 * sh | 0},${122 * sh | 0})`);
      x.fillStyle = 'rgba(0,0,0,.10)'; x.fillRect(px, py + c - 2.5 * q, c, 2.5 * q);   // kat bandı
      x.fillStyle = 'rgba(255,255,255,.18)'; x.fillRect(px, py + c - 3.2 * q, c, 0.7 * q);
      x.fillStyle = '#c9c1ae'; x.fillRect(wx - 2 * q, wy - 2 * q, ww + 4 * q, wh + 4 * q);      // söve
      x.fillStyle = 'rgba(0,0,0,.18)'; x.fillRect(wx - 2 * q, wy - 2 * q, ww + 4 * q, 1.2 * q);  // lento gölgesi
      x.fillStyle = g; x.fillRect(wx, wy, ww, wh);
      x.fillStyle = 'rgba(255,255,255,.08)'; x.fillRect(wx, wy, ww, wh * 0.18);
      x.fillStyle = '#d8d1c0'; x.fillRect(wx + ww / 2 - q, wy, 2 * q, wh); x.fillRect(wx, wy + wh * 0.3, ww, 1.4 * q);   // kayıt ve vasistas
      x.fillStyle = '#f1ece0'; x.fillRect(wx - 3.5 * q, wy + wh + 1.4 * q, ww + 7 * q, 1.6 * q);       // denizlik
      x.fillStyle = 'rgba(0,0,0,.22)'; x.fillRect(wx - 3 * q, wy + wh + 3 * q, ww + 6 * q, 1.1 * q);
      if (lit) { y.fillStyle = lc; y.fillRect(wx, wy, ww / 2 - q, wh); y.fillRect(wx + ww / 2 + q, wy, ww / 2 - q, wh); }
    }
  }
  const m = new THREE.CanvasTexture(a), e = new THREE.CanvasTexture(b);
  for (const t of [m, e]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = C.maxAniso; t.encoding = THREE.sRGBEncoding; }
  return { map: m, emissive: e };
}
const fa = facade('apt'), fc = facade('cw');
const AP = ['#f4ecda', '#e6cba6', '#dcb9a1', '#d0d8dc', '#eadcb6', '#cbc1ae'];
const CW = ['#ffffff', '#d3e5f3', '#c3d9cc', '#e4e9ed'];
const roofMat = new THREE.MeshStandardMaterial({ color: C.col('#5b5c60'), roughness: 1 });
const trimMat = { apt: new THREE.MeshStandardMaterial({ color: C.col('#ddd6c6'), roughness: 0.8 }), cw: new THREE.MeshStandardMaterial({ color: C.col('#8f9ba4'), roughness: 0.4, metalness: 0.5 }) };
C.roofTile = new THREE.MeshStandardMaterial({ color: C.col('#a8503a'), roughness: 0.9 });
const glassMats = [], farMats = [];
C.mats = { near: { apt: [], cw: [] }, far: { apt: [], cw: [] } };
function pair(tex, hex, rough, metal, farMul, key) {
  const m = new THREE.MeshStandardMaterial({ color: C.col(hex), map: tex.map, roughness: rough, metalness: metal, emissive: 0xffffff, emissiveMap: tex.emissive, emissiveIntensity: 0 });
  glassMats.push(m);
  const f = new THREE.MeshStandardMaterial({ color: C.col(hex).multiply(farMul), roughness: 1, emissive: C.col('#ffcf8a'), emissiveIntensity: 0 });
  farMats.push(f);
  C.mats.near[key].push([m, trimMat[key], roofMat, roofMat, m, m]);
  C.mats.far[key].push([f, trimMat[key], roofMat, roofMat, f, f]);
}
AP.forEach(h => pair(fa, h, 0.9, 0, C.col('#b8b4ae'), 'apt'));
CW.forEach(h => pair(fc, h, 0.35, 0.15, C.col('#7b93a6'), 'cw'));
C.nightListeners.push(n => { glassMats.forEach(m => m.emissiveIntensity = n * 1.15); farMats.forEach(m => m.emissiveIntensity = n * 0.3); });
/* zemin gölgesi: cephe zemine yaklaştıkça hafifçe kararır, binalar yere oturur (interiors.js yakın malzemelerde de çağırır) */
C.addGroundAO = function (sh) {
  sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying float vAoY;')
    .replace('#include <project_vertex>', '#include <project_vertex>\nvAoY = (modelMatrix * vec4(transformed, 1.0)).y;');
  sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vAoY;')
    .replace('#include <map_fragment>', '#include <map_fragment>\ndiffuseColor.rgb *= mix(0.58, 1.0, smoothstep(0.3, 4.0, vAoY));');
};
farMats.forEach(m => { m.onBeforeCompile = C.addGroundAO; m.customProgramCacheKey = () => 'ao-far'; });

/* ---------- bina kütlesi: köşeleri yuvarlatılmış prizma, üstte korniş bandı, parapet ve içeride çatı ----------
   Yan yüzlerin UV'si hücre sayısına göre: her düz yüzde tam sayıda pencere, köşe yayında yay uzunluğu kadar.
   Malzeme dizisi [cephe, korniş, çatı, çatı, cephe, cephe]; geometri kutu gibi dikeyde ortalı. */
C.boxGeo = function (w, h, d, floors, rnd, opt) {
  opt = opt || {};
  const hx = w / 2, hz = d / 2, P = opt.parapet === undefined ? 0.55 : opt.parapet, T = 0.32;
  const r = Math.max(0.15, Math.min(opt.r === undefined ? 0.5 : opt.r, hx - 0.4, hz - 0.4)), cs = 4;
  const ou = Math.floor(rnd() * 16), ov = Math.floor(rnd() * 16);
  /* çevre: +x yüzünden -z yönüne, dışa bakan normallerle */
  const ring = [{ x: hx, z: hz - r, nx: 1, nz: 0, u: ou / 16 }];
  const corners = [[hx - r, -(hz - r), 0], [-(hx - r), -(hz - r), -Math.PI / 2], [-(hx - r), hz - r, -Math.PI], [hx - r, hz - r, -1.5 * Math.PI]];
  const sides = [d - 2 * r, w - 2 * r, d - 2 * r, w - 2 * r];
  let u = ou / 16;
  corners.forEach(([cx, cz, a0], c) => {
    u += Math.max(1, Math.round(sides[c] / C.CELL_W)) / 16;
    for (let k = 0; k <= cs; k++) {
      const a = a0 - Math.PI / 2 * k / cs;
      if (k) u += r * Math.PI / 2 / cs / C.CELL_W / 16;
      if (k || c) ring.push({ x: cx + Math.cos(a) * r, z: cz + Math.sin(a) * r, nx: Math.cos(a), nz: Math.sin(a), u });
      else ring.push({ x: cx + r, z: cz, nx: 1, nz: 0, u });
    }
  });
  const pos = [], nor = [], uv = [], idx = [], g = new THREE.BufferGeometry();
  const vtx = (x, y, z, nx, ny, nz, uu, vv) => { pos.push(x, y, z); nor.push(nx, ny, nz); uv.push(uu, vv); return pos.length / 3 - 1; };
  const n = ring.length, y0 = -h / 2, y1 = h / 2, y2 = h / 2 + P, yr = h / 2 + (P ? 0.1 : 0);
  function wall(ya, yb, va, vb, inset, inward) {
    const s = idx.length, base = pos.length / 3;
    for (const p of ring) {
      const x = p.x - p.nx * inset, z = p.z - p.nz * inset, f = inward ? -1 : 1;
      vtx(x, ya, z, p.nx * f, 0, p.nz * f, p.u, va); vtx(x, yb, z, p.nx * f, 0, p.nz * f, p.u, vb);
    }
    for (let i = 0; i < n - 1; i++) {
      const b0 = base + i * 2, t0 = b0 + 1, b1 = b0 + 2, t1 = b0 + 3;
      if (inward) idx.push(b0, t1, b1, b0, t0, t1); else idx.push(b0, b1, t1, b0, t1, t0);
    }
    return idx.length - s;
  }
  let st = 0, cnt = wall(y0, y1, ov / 16, (floors + ov) / 16, 0, false);
  g.addGroup(st, cnt, 0); st += cnt;
  if (P) {
    cnt = wall(y1, y2, 0, 0, 0, false);
    const s0 = idx.length, base = pos.length / 3;                   // parapetin üst yüzü
    for (const p of ring) { vtx(p.x, y2, p.z, 0, 1, 0, 0, 0); vtx(p.x - p.nx * T, y2, p.z - p.nz * T, 0, 1, 0, 0, 0); }
    for (let i = 0; i < n - 1; i++) { const o0 = base + i * 2, i0 = o0 + 1, o1 = o0 + 2, i1 = o0 + 3; idx.push(o0, o1, i0, i0, o1, i1); }
    cnt += idx.length - s0;
    cnt += wall(yr, y2, 0, 0, T, true);
    g.addGroup(st, cnt, 1); st += cnt;
  }
  const s1 = idx.length, c0 = vtx(0, yr, 0, 0, 1, 0, 0, 0), ins = P ? T : 0;   // çatı
  for (const p of ring) vtx(p.x - p.nx * ins, yr, p.z - p.nz * ins, 0, 1, 0, 0, 0);
  for (let i = 0; i < n - 1; i++) idx.push(c0, c0 + 1 + i, c0 + 2 + i);
  g.addGroup(st, idx.length - s1, 2);
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeBoundingSphere(); g.computeBoundingBox();
  return g;
};
C.CORNER_R = { tower: 1.1, mid: 0.6, low: 0.45, house: 0.25 };

/* ---------- bloklar ve parseller ---------- */
C.blocks = []; C.lots = []; C.buildings = []; C.pickables = [];
C.treeSpots = []; C.lampSpots = []; C.benchSpots = [];
/* 13x13 ızgara için elle seçilmiş yerler, meydan C.MID,C.MID'de */
const PARKS = new Set(['2,2', '9,1', '1,10', '11,6', '6,10', '5,3', '10,11']);
const LANDMARKS = { '4,6': 'mosque', '8,4': 'hospital', '3,9': 'fire', '9,8': 'police', '11,2': 'stadium' };

function subdivide(bx, bz, rnd) {
  const half = 18, gap = 2, out = [];
  const push = (x0, z0, x1, z1) => out.push({ cx: bx + (x0 + x1) / 2, cz: bz + (z0 + z1) / 2, w: x1 - x0, d: z1 - z0 });
  const r = rnd();
  if (r < 0.22) push(-half, -half, half, half);
  else if (r < 0.45) { const s = (rnd() - 0.5) * 8; push(-half, -half, s - gap / 2, half); push(s + gap / 2, -half, half, half); }
  else if (r < 0.62) { const s = (rnd() - 0.5) * 8; push(-half, -half, half, s - gap / 2); push(-half, s + gap / 2, half, half); }
  else {
    const sx = (rnd() - 0.5) * 6, sz = (rnd() - 0.5) * 6;
    push(-half, -half, sx - gap / 2, sz - gap / 2); push(sx + gap / 2, -half, half, sz - gap / 2);
    push(-half, sz + gap / 2, sx - gap / 2, half); push(sx + gap / 2, sz + gap / 2, half, half);
  }
  return out;
}

/* kaldırım: üst yüzde 1 m'lik taş döşeme; yan yüzler döşemenin içinden tek renk alır (çizgili görünmesin) */
const paveTex = (function () {
  const S = 256, cv = document.createElement('canvas'); cv.width = cv.height = S; const x = cv.getContext('2d'), r = C.rng(21);
  x.fillStyle = '#9a978f'; x.fillRect(0, 0, S, S);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const v = 222 + (r() - 0.5) * 18 | 0; x.fillStyle = `rgb(${v},${v - 2},${v - 6})`; x.fillRect(i * 64 + 1.5, j * 64 + 1.5, 61, 61); }
  for (let k = 0; k < 1500; k++) { x.fillStyle = r() < 0.5 ? 'rgba(0,0,0,.05)' : 'rgba(255,255,255,.06)'; x.fillRect(r() * S, r() * S, 1 + r() * 2, 1 + r() * 2); }
  const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(C.BLOCK / 4, C.BLOCK / 4);
  t.anisotropy = C.maxAniso; t.encoding = THREE.sRGBEncoding; return t;
})();
const slabGeo = new THREE.BoxGeometry(C.BLOCK, C.SW, C.BLOCK);
{ const uv = slabGeo.attributes.uv; for (let i = 0; i < uv.count; i++) if (i < 8 || i >= 12) uv.setXY(i, 0.1 / (C.BLOCK / 4) * 4, 0.1 / (C.BLOCK / 4) * 4); }
const slabMat = new THREE.MeshStandardMaterial({ color: C.col('#cfccc4'), map: paveTex, roughness: 0.95 });
const dirtMat = new THREE.MeshStandardMaterial({ color: C.col('#8b7d68'), roughness: 1 });
const planeG = new THREE.PlaneGeometry(1, 1);

C.genBlocks = function () {
  const layoutRnd = C.rng(3), cityBlocks = [];
  for (let i = 0; i < C.N; i++) for (let j = 0; j < C.N; j++) {
    const bx = C.blockC(i), bz = C.blockC(j);
    const key = i + ',' + j;
    const kind = (i === C.MID && j === C.MID) ? 'plaza' : LANDMARKS[key] ? 'landmark' : PARKS.has(key) ? 'park' : 'city';
    const blk = { i, j, bx, bz, kind };
    C.blocks.push(blk);
    /* kaldırım halkası: ağaç, lamba */
    for (let s = 0; s < 4; s++) {
      const nx = s === 0 ? 1 : s === 1 ? -1 : 0, nz = s === 2 ? 1 : s === 3 ? -1 : 0;
      const tx = -nz, tz = nx;
      for (const t of [-16, 0, 16]) C.lampSpots.push([bx + nx * 21 + tx * t, bz + nz * 21 + tz * t, nx, nz]);
      for (const t of [-20, -8, 8, 20]) C.treeSpots.push([bx + nx * 20.4 + tx * t, bz + nz * 20.4 + tz * t, 0.8 + layoutRnd() * 0.5]);
    }
    if (kind === 'city') {
      cityBlocks.push(blk);
      for (const L of subdivide(bx, bz, layoutRnd)) {
        L.bx = bx; L.bz = bz; L.building = null;
        const dirt = new THREE.Mesh(planeG, dirtMat);
        dirt.rotation.x = -Math.PI / 2; dirt.position.set(L.cx, C.SW + 0.02, L.cz); dirt.scale.set(L.w, L.d, 1);
        dirt.receiveShadow = true; dirt.visible = false; dirt.userData.lot = L; L.dirt = dirt;
        scene.add(dirt); C.lots.push(L);
      }
    } else if (kind === 'park') C.makePark(blk, layoutRnd);
    else if (kind === 'landmark') C.makeLandmark(blk, LANDMARKS[key], layoutRnd);
    else C.makePlaza(blk, layoutRnd);
  }
  const slabs = C.inst(slabGeo, slabMat, cityBlocks.length);
  cityBlocks.forEach((b, k) => C.setM(slabs, k, b.bx, C.SW / 2, b.bz));
  slabs.instanceMatrix.needsUpdate = true; slabs.receiveShadow = true; scene.add(slabs);
};

/* ---------- bina belirtimi ---------- */
const TYPE_NAME = { tower: 'Gökdelen', mid: 'Apartman bloğu', low: 'Alçak bina', house: 'Müstakil ev' };
C.typeName = b => TYPE_NAME[b.type];

C.specFor = function (lot, rnd, force) {
  const d = Math.hypot(lot.cx, lot.cz) / (C.TOTAL * 0.5);
  const z = Math.max(0, 1 - d * 1.1), r = rnd(), small = Math.min(lot.w, lot.d) < 15;
  let type;
  if (force) type = force;
  else if (!small && r < Math.pow(z, 1.3) * 0.95) type = 'tower';
  else if (r < 0.5 + z * 0.35) type = 'mid';
  else if (small && z < 0.4) type = 'house';
  else type = 'low';
  if (type === 'house' && Math.min(lot.w, lot.d) < 10) type = 'low';
  let floors;
  if (type === 'tower') floors = 22 + Math.floor(rnd() * 26 * (0.5 + z / 2));
  else if (type === 'mid') floors = 6 + Math.floor(rnd() * 9);
  else if (type === 'low') floors = 3 + Math.floor(rnd() * 3);
  else floors = 2 + Math.floor(rnd() * 2);
  const style = type === 'tower' ? 'cw' : 'apt';
  const tint = Math.floor(rnd() * (style === 'cw' ? CW.length : AP.length));
  return { type, floors, style, tint, tiered: rnd() < 0.6, seed: Math.floor(rnd() * 1e9) };
};

C.tiersOf = function (b) {
  const lot = b.lot, f = b.floors;
  let w = lot.w - 2, d = lot.d - 2;
  if (b.type === 'house') { w = Math.min(w * 0.78, 16); d = Math.min(d * 0.72, 13); }
  if (b.type === 'tower' && b.tiered && f >= 12) {
    const f1 = Math.max(1, Math.round(f * 0.58)), f2 = Math.max(1, Math.round(f * 0.28)), f3 = Math.max(1, f - f1 - f2);
    return [{ w, d, f: f1 }, { w: w * 0.78, d: d * 0.78, f: f2 }, { w: w * 0.52, d: d * 0.52, f: f3 }];
  }
  if (b.type === 'mid' && b.tiered && f >= 8) {
    const f1 = Math.round(f * 0.7);
    return [{ w, d, f: f1 }, { w: w * 0.8, d: d * 0.8, f: f - f1 }];
  }
  return [{ w, d, f }];
};

C.placeBuilding = function (lot, b) {
  b.lot = lot; lot.building = b; lot.dirt.visible = false;
  const rnd = C.rng(b.seed), tiers = C.tiersOf(b);
  const set = b.style === 'cw' ? 'cw' : 'apt';
  b.nearMats = C.mats.near[set][b.tint]; b.farMats = C.mats.far[set][b.tint];
  b.group = new THREE.Group(); b.meshes = []; b.isFar = false; b.detail = null;
  let y = C.SW;
  for (const t of tiers) {
    const h = t.f * C.FLOOR_H;
    const m = new THREE.Mesh(C.boxGeo(t.w, h, t.d, t.f, rnd, { r: C.CORNER_R[b.type], parapet: b.type === 'house' ? 0 : 0.55 }), b.nearMats);
    m.position.set(lot.cx, y + h / 2, lot.cz);
    m.castShadow = m.receiveShadow = true; m.userData.building = b;
    b.group.add(m); b.meshes.push(m); y += h;
  }
  b.baseTier = tiers[0]; b.topTier = tiers[tiers.length - 1]; b.top = y; b.height = y - C.SW;
  if (b.type === 'house') {
    const t = b.baseTier, g = new THREE.ConeGeometry((t.w + 0.8) / Math.SQRT2, 2.8, 4);
    g.rotateY(Math.PI / 4);
    const roof = new THREE.Mesh(g, C.roofTile);
    roof.position.set(lot.cx, y + 1.4, lot.cz); roof.scale.z = (t.d + 0.8) / (t.w + 0.8);
    roof.castShadow = true; roof.userData.building = b; roof.userData.roof = true;
    b.group.add(roof); b.meshes.push(roof); b.top = y + 2.8;
  }
  scene.add(b.group); C.buildings.push(b);
};

C.removeBuilding = function (lot) {
  const b = lot.building; if (!b) return;
  scene.remove(b.group);
  b.group.traverse(o => { if (o.geometry) o.geometry.dispose(); });
  if (b.detail) {
    scene.remove(b.detail);
    b.detail.traverse(o => { if (o.isInstancedMesh) o.dispose(); });
    b.detail = null;
  }
  lot.building = null; lot.dirt.visible = true;
  const k = C.buildings.indexOf(b); if (k >= 0) C.buildings.splice(k, 1);
};

C.rebuildBuilding = function (b) { const lot = b.lot; C.removeBuilding(lot); C.placeBuilding(lot, b); C.refreshPickables(); };

C.refreshPickables = function () {
  C.pickables.length = 0;
  for (const b of C.buildings) for (const m of b.meshes) C.pickables.push(m);
  for (const l of C.lots) if (!l.building) C.pickables.push(l.dirt);
  for (const m of C.landmarkMeshes) C.pickables.push(m);
};

C.populate = function (seed) {
  const rnd = C.rng(seed);
  for (const lot of C.lots) { C.removeBuilding(lot); C.placeBuilding(lot, C.specFor(lot, rnd)); }
  C.refreshPickables();
};

/* ---------- kademeli ayrıntı: uzakta düz renk, yakında pencere ve donanım ---------- */
const FAR2 = 330 * 330, NEAR2 = 140 * 140;
C.updateBuildingsLOD = function (cam) {
  let made = 0;
  for (const b of C.buildings) {
    const dx = cam.x - b.lot.cx, dz = cam.z - b.lot.cz, dy = cam.y - b.top * 0.5;
    const d2 = dx * dx + dy * dy + dz * dz;
    const far = d2 > FAR2;
    if (far !== b.isFar) { b.isFar = far; const mt = far ? b.farMats : b.nearMats; for (const m of b.meshes) if (!m.userData.roof) m.material = mt; }
    if (d2 < NEAR2) {
      if (!b.detail && made < 3) { C.buildDetail(b); made++; }
      if (b.detail) b.detail.visible = !b.cut;          // kesitteyken bina ve ayrıntısı gizli
    } else if (b.detail) b.detail.visible = false;
  }
};
})();
