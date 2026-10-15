/* ===== cats.js: sokak kedileri: kaldırımda ve parklarda dolaşır, oturur, uyur, yalanır; sevilir, kucağa alınır, peşine takılır, koşana kaçar; gece parkta kedi toplantısı ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene, B = C.SW;
const pick = a => a[(Math.random() * a.length) | 0];

/* ---------- desenler: shader, parçanın kendi koordinatından çizgi (tekir), beyaz göğüs/ağız (smokin), çorap ve üç renkli lekeler üretir ----------
   örnek başına: instanceColor ana renk, aCol2 leke rengi, aPat = (çizgi, beyaz göğüs ve ağız, beyaz çorap, leke tohumu) */
function furMat(part) {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.88 });
  m.onBeforeCompile = sh => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec4 aPat; attribute vec3 aCol2; varying vec4 vPat; varying vec3 vCol2; varying vec3 vLoc;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvPat = aPat; vCol2 = aCol2; vLoc = position;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec4 vPat; varying vec3 vCol2; varying vec3 vLoc;')
      .replace('#include <color_fragment>', `#include <color_fragment>
      {
        vec3 base = diffuseColor.rgb, wh = vec3(0.86, 0.83, 0.78);
        float st = 0.0, bib = 0.0;
        ${part === 0 ? 'st = smoothstep(0.36, 0.5, abs(fract(vLoc.x * 13.0 + sin(vLoc.z * 24.0) * 0.22) - 0.5)) * smoothstep(-0.05, -0.01, vLoc.y); bib = max(step(vLoc.y, -0.05), step(0.1, vLoc.x) * step(vLoc.y, 0.015));' : ''}
        ${part === 1 ? 'st = smoothstep(0.36, 0.5, abs(fract(vLoc.z * 30.0) - 0.5)) * step(0.035, vLoc.y) * step(vLoc.x, 0.04); bib = step(0.045, vLoc.x) * step(vLoc.y, -0.012);' : ''}
        ${part === 2 ? 'st = smoothstep(0.34, 0.5, abs(fract(vLoc.x * 17.0) - 0.5));' : ''}
        ${part === 3 ? 'st = 0.4 * smoothstep(0.38, 0.5, abs(fract(vLoc.y * 24.0) - 0.5)); bib = step(vLoc.y, -0.095);' : ''}
        diffuseColor.rgb = mix(base, base * 0.48, st * vPat.x);
        diffuseColor.rgb = mix(diffuseColor.rgb, wh, bib * ${part === 3 ? 'vPat.z' : 'vPat.y'});
        if (vPat.w > 0.0) {                                   // üç renkli: turuncu ve siyah lekeler
          float n = sin(vLoc.x * 19.0 + vPat.w * 7.0) * sin(vLoc.z * 31.0 + vPat.w) + 0.6 * sin(vLoc.y * 25.0 - vLoc.x * 11.0 + vPat.w * 3.0);
          diffuseColor.rgb = mix(diffuseColor.rgb, vCol2, step(0.42, n));
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.03, 0.03, 0.035), step(n, -0.62));
        }
      }`);
  };
  m.customProgramCacheKey = () => 'catfur' + part;
  return m;
}

/* ---------- parçalar: gövde (göğüs + bel + kalça), baş (kafatası, yanaklar, ağız, kulaklar), gözler, burun, kuyruk 3, bacak 4 (patili) ---------- */
const CAP = 96, rb = (w, h, d, r) => C.roundBox(w, h, d, r).clone();
const bodyG = C.mergeGeos([rb(0.34, 0.14, 0.15, 0.065), rb(0.14, 0.15, 0.155, 0.065).translate(0.12, 0.012, 0), rb(0.15, 0.155, 0.165, 0.07).translate(-0.12, 0.004, 0)]);
const headG = C.mergeGeos([
  rb(0.135, 0.125, 0.145, 0.058), rb(0.1, 0.075, 0.17, 0.036).translate(0.018, -0.028, 0), rb(0.05, 0.045, 0.075, 0.02).translate(0.072, -0.03, 0),
  ...[-1, 1].map(s => new THREE.ConeGeometry(0.036, 0.072, 4).rotateY(Math.PI / 4).rotateX(-s * 0.28).translate(-0.008, 0.088, s * 0.047))
]);
const eyeG = C.mergeGeos([-1, 1].map(s => new THREE.SphereGeometry(0.017, 8, 6).scale(0.6, 1.1, 1).translate(0.066, 0.012, s * 0.036)));
const noseG = new THREE.BoxGeometry(0.016, 0.014, 0.024).translate(0.098, -0.012, 0);
const tailG = new THREE.CylinderGeometry(0.019, 0.025, 0.125, 6).rotateZ(Math.PI / 2).translate(-0.0625, 0, 0);   // pivottan -x yönüne
const legG = C.mergeGeos([new THREE.CylinderGeometry(0.023, 0.027, 0.15, 6).translate(0, -0.075, 0), rb(0.05, 0.026, 0.042, 0.012).translate(0.008, -0.152, 0)]);
const eyeM = new THREE.MeshStandardMaterial({ color: C.col('#c8d64a'), emissive: C.col('#d8f060'), emissiveIntensity: 0, roughness: 0.25 });
const noseM = new THREE.MeshStandardMaterial({ color: C.col('#d98a8f'), roughness: 0.6 });
C.nightListeners.push(n => { eyeM.emissiveIntensity = n * 1.1; });          // gece gözler parlar
const parts = [];
const mk = (g, m, n, furry) => {
  const x = C.inst(g, m, n); x.castShadow = true; x.count = 0;
  if (furry) {
    x.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(n * 3).fill(1), 3);
    x.geometry = g.clone();                                   // her parçanın kendi örnek nitelikleri
    x.geometry.setAttribute('aPat', new THREE.InstancedBufferAttribute(new Float32Array(n * 4), 4));
    x.geometry.setAttribute('aCol2', new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3));
    parts.push(x);
  }
  return x;
};
const bodyI = mk(bodyG, furMat(0), CAP, true), headI = mk(headG, furMat(1), CAP, true), tailI = mk(tailG, furMat(2), CAP * 3, true), legI = mk(legG, furMat(3), CAP * 4, true);
const eyeI = mk(eyeG, eyeM, CAP), noseI = mk(noseG, noseM, CAP);
const group = new THREE.Group(); group.add(bodyI, headI, eyeI, noseI, tailI, legI); scene.add(group); C.peopleLayers.push(group);

/* ---------- tüyler: ad havuzu desene göre ---------- */
const COATS = [
  { name: 'sarman', col: '#d9873a', st: 1, bib: 0, sock: 0, names: ['Sarman', 'Fıstık', 'Tarçın', 'Karamel', 'Limon'] },
  { name: 'sarman, beyaz göğüslü', col: '#d9873a', st: 1, bib: 1, sock: 1, names: ['Paşa', 'Sarman', 'Bal'] },
  { name: 'smokin', col: '#1b1b1f', st: 0, bib: 1, sock: 1, names: ['Smokin', 'Zeytin', 'Paşa', 'Lord'] },
  { name: 'beyaz', col: '#f1eee7', st: 0, bib: 0, sock: 0, names: ['Pamuk', 'Bulut', 'Şeker', 'Kar'] },
  { name: 'tekir', col: '#8c8172', st: 1, bib: 0, sock: 0, names: ['Tekir', 'Duman', 'Mırmır'] },
  { name: 'gri tekir, beyaz çoraplı', col: '#8a8d92', st: 1, bib: 1, sock: 1, names: ['Duman', 'Çorap', 'Tekir'] },
  { name: 'kara', col: '#17171a', st: 0, bib: 0, sock: 0, names: ['Gece', 'Kömür', 'Zeytin'] },
  { name: 'üç renkli', col: '#efebe3', col2: '#d27a2c', st: 0, bib: 0, sock: 0, cal: 1, names: ['Boncuk', 'Minnoş', 'Benekli'] },
  { name: 'gri', col: '#7c8390', st: 0, bib: 0, sock: 0, names: ['Duman', 'Füme'] },
  { name: 'krem', col: '#e3cfa6', st: 0.45, bib: 0, sock: 0, names: ['Krem', 'Vanilya', 'Bisküvi'] }
].map(c => Object.assign(c, { c1: C.col(c.col), c2: C.col(c.col2 || c.col) }));
const coatByName = n => COATS.find(c => c.name === n);

/* ---------- kediler ---------- */
const cats = [], H = 19.6;                                   // kaldırım halkası (yayaların biraz içi)
function ringPos(c) {
  const side = Math.floor(c.f * 4) & 3, u = (c.f * 4) % 1, h = H;
  if (side === 0) { c.x = c.bx - h + 2 * h * u; c.z = c.bz - h; } else if (side === 1) { c.x = c.bx + h; c.z = c.bz - h + 2 * h * u; }
  else if (side === 2) { c.x = c.bx + h - 2 * h * u; c.z = c.bz + h; } else { c.x = c.bx - h; c.z = c.bz + h - 2 * h * u; }
}
function make(kind, blk, club, coat) {
  coat = coat || pick(COATS);
  const c = { kind, bx: blk.bx, bz: blk.bz, blk, club: !!club, x: blk.bx, z: blk.bz, y: B, ry: Math.random() * 6.28, f: Math.random(), df: 0,
    tx: 0, tz: 0, st: 'sit', t: Math.random() * 8, ph: Math.random() * 10, sp: 0, coat, name: pick(coat.names), purr: 0, seed: 1 + Math.random() * 9,
    size: 0.9 + Math.random() * 0.22 };
  if (kind === 'ring') ringPos(c); else { c.x = blk.bx + (Math.random() - 0.5) * 30; c.z = blk.bz + (Math.random() - 0.5) * 30; }
  cats.push(c); return c;
}
let club = null;
function spawn() {
  cats.length = 0;
  const city = C.blocks.filter(b => b.kind === 'city'), parks = C.blocks.filter(b => b.kind === 'park');
  for (let k = 0; k < C.Q.cats && city.length; k++) make('ring', pick(city));
  for (const p of parks) for (let k = 0; k < 2; k++) make('park', p);
  /* toplantı parkı: merkeze en yakın park; sekiz kedisi orada yaşar, reis iri bir sarman */
  const cp = parks.slice().sort((a, b) => Math.hypot(a.bx, a.bz) - Math.hypot(b.bx, b.bz))[0];
  if (cp) {
    const pond = cp.pond || { x: cp.bx + 9, z: cp.bz + 9 };
    club = { blk: cp, x: cp.bx - Math.sign(pond.x - cp.bx || 1) * 9, z: cp.bz - Math.sign(pond.z - cp.bz || 1) * 9, cats: [] };
    for (let k = 0; k < 8; k++) club.cats.push(make('park', cp, true, k === 0 ? coatByName('sarman') : null));
    Object.assign(club.cats[0], { name: 'Reis', size: 1.22 });
  }
}

/* ---------- davranış ---------- */
const meetingTime = () => C.hour >= 21.5 || C.hour < 1;
const P = () => C.player;
function nextState(c) {
  if (c.kind === 'go') { c.st = 'walk'; c.t = 99; return; }    // kaldırımına dönüyor
  const r = Math.random();
  if (r < 0.42) {                                            // yürü
    c.st = 'walk'; c.t = 3 + Math.random() * 7;
    if (c.kind === 'ring') c.df = (Math.random() < 0.5 ? -1 : 1);
    else { c.tx = c.bx + (Math.random() - 0.5) * 34; c.tz = c.bz + (Math.random() - 0.5) * 34; }
  } else if (r < 0.66) { c.st = 'sit'; c.t = 4 + Math.random() * 10; }
  else if (r < 0.74) { c.st = 'stretch'; c.t = 2.2; }
  else if (r < 0.86) { c.st = 'groom'; c.t = 3 + Math.random() * 5; }
  else { c.st = 'lie'; c.t = 12 + Math.random() * 30; }
}
/* serbest kalan kedi yeniden yerleşir: parktaysa park kedisi, değilse en yakın bloğun kaldırımına yürür */
function settle(c) {
  if (c.club) { c.kind = 'park'; c.bx = club.blk.bx; c.bz = club.blk.bz; c.st = 'walk'; c.tx = club.x; c.tz = club.z; c.t = 8; return; }
  const bi = C.clamp(Math.round((c.x - C.blockC(0)) / C.PITCH), 0, C.N - 1), bj = C.clamp(Math.round((c.z - C.blockC(0)) / C.PITCH), 0, C.N - 1);
  const blk = C.blocks.find(b => b.i === bi && b.j === bj); if (!blk) return;
  c.blk = blk; c.bx = blk.bx; c.bz = blk.bz;
  if (blk.kind === 'park') { c.kind = 'park'; c.st = 'sit'; c.t = 3; return; }
  const dx = c.x - blk.bx, dz = c.z - blk.bz, h = H, u = q => C.clamp((q + h) / (2 * h), 0, 0.999);
  if (Math.abs(dz) >= Math.abs(dx)) c.f = dz < 0 ? u(dx) / 4 : (2 + 1 - u(dx)) / 4; else c.f = dx > 0 ? (1 + u(dz)) / 4 : (3 + 1 - u(dz)) / 4;
  const q = { bx: blk.bx, bz: blk.bz, f: c.f, x: 0, z: 0 }; ringPos(q);
  c.kind = 'go'; c.tx = q.x; c.tz = q.z; c.st = 'walk'; c.t = 99;
}
function moveTo(c, tx, tz, sp, dt) {
  const dx = tx - c.x, dz = tz - c.z, d = Math.hypot(dx, dz);
  if (d < 0.05) return d;
  const k = Math.min(d, sp * dt); c.x += dx / d * k; c.z += dz / d * k; c.ry = Math.atan2(-dz, dx); c.sp = sp; c.ph += dt * sp * 11;
  if (C.player.groundAt) c.y = C.player.groundAt(c.x, c.z);
  return d;
}
function step(c, dt) {
  if (c.st === 'held') return;
  if (c.purr > 0) { c.purr -= dt; if (c.purr <= 0 && c.st === 'pet') { c.st = 'follow'; c.t = 15 + Math.random() * 12; } return; }
  const p = P(), pd = p && p.active && p.mode === 'citizen' ? Math.hypot(p.pos.x - c.x, p.pos.z - c.z) : 1e9;
  /* koşarak yaklaşana kaçar */
  if (pd < 2.6 && Math.hypot(p.vel.x, p.vel.z) > 4 && c.st !== 'follow' && c.st !== 'flee') { c.st = 'flee'; c.t = 1.6; }
  if (c.st === 'flee') {
    if ((c.t -= dt) <= 0) { if (c.kind === 'ring') { c.st = 'sit'; c.t = 4; } else settle(c); return; }
    c.sp = 3.4; c.ph += dt * 30;
    if (c.kind === 'ring') {
      const fx = Math.cos(c.ry), fz = -Math.sin(c.ry), away = (c.x - p.pos.x) * fx + (c.z - p.pos.z) * fz;
      if (c.df === 0 || away < 0) c.df = -(c.df || 1);
      c.f = (c.f + c.df * c.sp * dt / (8 * H) + 1) % 1; const ox = c.x, oz = c.z; ringPos(c); c.ry = Math.atan2(-(c.z - oz), c.x - ox);
    } else { const dx = c.x - p.pos.x, dz = c.z - p.pos.z, l = Math.hypot(dx, dz) || 1; moveTo(c, c.x + dx / l, c.z + dz / l, 3.4, dt); }
    return;
  }
  /* sevildikten sonra bir süre peşine takılır */
  if (c.st === 'follow' || c.st === 'sitf') {
    if (pd > 30 || (c.t -= dt) <= 0) { settle(c); return; }
    const fx = Math.cos(p.face), fz = -Math.sin(p.face), gx = p.pos.x - fx * 0.7 + fz * 0.4, gz = p.pos.z - fz * 0.7 - fx * 0.4;
    const d = Math.hypot(gx - c.x, gz - c.z);
    if (d > 0.35) { c.st = 'follow'; moveTo(c, gx, gz, Math.min(3.2, 0.6 + d * 1.4), dt); }
    else { c.st = 'sitf'; c.sp = 0; c.ry = Math.atan2(-(p.pos.z - c.z), p.pos.x - c.x); }
    return;
  }
  /* toplantı: kulüp kedileri çemberde oturur, reis ortada */
  if (c.club && club && meetingTime()) {
    const k = club.cats.indexOf(c), a = k / (club.cats.length - 1) * Math.PI * 2;
    const sx = k === 0 ? club.x : club.x + Math.cos(a) * 2.1, sz = k === 0 ? club.z : club.z + Math.sin(a) * 2.1;
    if (Math.hypot(sx - c.x, sz - c.z) > 0.15) { c.st = 'walk'; moveTo(c, sx, sz, 0.9, dt); }
    else { c.st = 'sit'; c.sp = 0; const fx = club.x - c.x, fz = club.z - c.z; c.ry = k === 0 ? c.ry + dt * 0.25 : Math.atan2(-fz, fx); }
    return;
  }
  if ((c.t -= dt) <= 0) nextState(c);
  if (c.st !== 'walk') { c.sp = 0; return; }
  c.sp = 0.75; c.ph += dt * 8;
  if (c.kind === 'ring') {
    c.f = (c.f + c.df * c.sp * dt / (8 * H) + 1) % 1;
    const ox = c.x, oz = c.z; ringPos(c);
    if (Math.hypot(c.x - ox, c.z - oz) > 1e-4) c.ry = Math.atan2(-(c.z - oz), c.x - ox);
  } else {
    const d = moveTo(c, c.tx, c.tz, 0.75, dt);
    if (d < 0.2) { if (c.kind === 'go') { c.kind = 'ring'; c.y = B; } c.t = 0; }
  }
}

/* ---------- çizim: kök > gövde > baş/bacak/kuyruk ---------- */
const M4 = THREE.Matrix4, mr = new M4(), mb = new M4(), mh = new M4(), mt = new M4(), ml = new M4(), T = new M4(), Rm = new M4(), Sm = new M4();
const tr = (out, base, x, y, z) => out.multiplyMatrices(base, T.makeTranslation(x, y, z));
const rz = (m, a) => a ? m.multiply(Rm.makeRotationZ(a)) : m, ry = (m, a) => a ? m.multiply(Rm.makeRotationY(a)) : m, rx = (m, a) => a ? m.multiply(Rm.makeRotationX(a)) : m;
const ZERO = new M4().makeScale(0, 0, 0);
function attrs(m, i, c) {
  const a = m.geometry.attributes.aPat, b = m.geometry.attributes.aCol2, k = c.coat;
  a.setXYZW(i, k.st, k.bib, k.sock, k.cal ? c.seed : 0); b.setXYZ(i, k.c2.r, k.c2.g, k.c2.b); m.setColorAt(i, k.c1);
}
function draw(c, n, t) {
  const st = c.st, run = c.sp > 2, s = Math.sin(c.ph);
  /* kuyruk: kök eğimi (tailUp, yukarı +) ve yönü (tailYaw); sonraki iki boğum için [eğim, yön] */
  let by = 0.215, pitch = 0, roll = 0, hy = 0, hp = 0, tailUp = 0.9, tailYaw = 0, curl = [[0.35, 0], [0.35, 0]], legs = [0, 0, 0, 0], fold = 0, eyes = true, legY = 1;
  const WRAP = [[0.98, 1.15], [0, 1.05]];                   // otururken kuyruk yere iner, patilerin önüne sarılır
  if (st === 'walk' || st === 'follow' || st === 'flee') {
    const a = run ? 0.75 : 0.5;
    by = 0.215 + Math.abs(s) * (run ? 0.025 : 0.008); legs = run ? [s * a, s * a, -s * a, -s * a] : [s * a, -s * a, -s * a, s * a];
    tailUp = run ? 0.25 : 1.15 + Math.sin(c.ph * 0.5) * 0.12; curl = run ? [[0.05, 0], [0.05, 0]] : [[0.45, Math.sin(c.ph * 0.5) * 0.2], [0.4, 0]]; hp = run ? 0.1 : -0.05; pitch = run ? Math.sin(c.ph) * 0.06 : 0;
  } else if (st === 'sit' || st === 'pet' || st === 'sitf') {
    pitch = 0.58; by = 0.165; fold = 1; tailUp = -0.4; tailYaw = 0; curl = WRAP; hy = Math.sin(t * 0.4 + c.ph) * 0.4; hp = -0.45;
    if (st === 'pet') { tailUp = 1.3 + Math.sin(t * 9) * 0.06; curl = [[0.15, 0], [0.25, 0]]; eyes = false; hp = -0.7; hy = Math.sin(t * 3) * 0.15; }
    if (st === 'sitf') { tailUp = 0.4; curl = [[0.5, 0], [0.6, 0]]; hy = 0; }
  } else if (st === 'groom') { pitch = 0.58; by = 0.165; fold = 1; tailUp = -0.4; curl = WRAP; hy = 1.15; hp = -1.0 + Math.sin(t * 7) * 0.12; }
  else if (st === 'stretch') {                                // öne gerinme: kalça havada, ön bacaklar uzun
    const u = Math.sin(Math.min(1, (2.2 - c.t) / 2.2) * Math.PI); pitch = -0.35 * u; by = 0.215 - 0.04 * u; legs = [1.0 * u, 1.0 * u, -0.25 * u, -0.25 * u]; tailUp = 1.3; hp = 0.25 * u;
  } else if (st === 'lie') { by = 0.085 + Math.sin(t * 1.4 + c.ph) * 0.004; fold = 2; tailUp = -0.25; tailYaw = 1.2; curl = [[0.2, 1.1], [0, 1.0]]; hy = 0.6; hp = 0.35; eyes = false; roll = 0.12; legY = 0.7; }
  else if (st === 'held') { by = 0; fold = 3; tailUp = -1.15; curl = [[0.15, 0.2], [0.2, 0]]; hp = -0.5; hy = 0.25; }

  mr.makeTranslation(c.x, c.y, c.z); ry(mr, c.ry); mr.multiply(Sm.makeScale(c.size, c.size, c.size));
  tr(mb, mr, 0, by, 0); rz(mb, pitch); rx(mb, roll);
  bodyI.setMatrixAt(n, mb); attrs(bodyI, n, c);
  tr(mh, mb, 0.215, 0.085, 0); ry(mh, hy); rz(mh, hp);
  headI.setMatrixAt(n, mh); attrs(headI, n, c);
  eyeI.setMatrixAt(n, eyes ? mh : ZERO); noseI.setMatrixAt(n, mh);
  tr(mt, mb, -0.19, 0.05, 0); ry(mt, tailYaw); rz(mt, -tailUp);
  for (let k = 0; k < 3; k++) {
    tailI.setMatrixAt(3 * n + k, mt); attrs(tailI, 3 * n + k, c);
    if (k < 2) { tr(mt, mt, -0.125, 0, 0); rz(mt, -curl[k][0]); ry(mt, curl[k][1]); }
  }
  [[0.13, 0.055], [0.13, -0.055], [-0.13, 0.055], [-0.13, -0.055]].forEach(([lx, lz], k) => {
    tr(ml, mb, lx, -0.05, lz);
    if (fold === 2) rz(ml, k < 2 ? 1.5 : -1.5);                                 // uyurken bacaklar gövdenin altında
    else if (fold === 1) rz(ml, k < 2 ? -pitch : 1.45);                        // oturunca ön bacak dik, arka bacak katlı
    else if (fold === 3) rz(ml, k < 2 ? 0.9 : -0.6);                           // kucakta: ön patiler öne, arkalar sarkık
    else rz(ml, legs[k]);
    if (legY !== 1) ml.multiply(Sm.makeScale(1, legY, 1));
    legI.setMatrixAt(4 * n + k, ml); attrs(legI, 4 * n + k, c);
  });
}

/* ---------- oyuncu: sev, kucağa al, bırak ---------- */
let held = null;
function holdPose(c) {
  const p = P(), f = p.face, fx = Math.cos(f), fz = -Math.sin(f);
  c.x = p.pos.x + fx * 0.3; c.z = p.pos.z + fz * 0.3; c.y = p.pos.y + 1.08; c.ry = f + Math.PI / 2 - 0.35;   // kollarda, başı hafif öne
}
const MEOW = ['Miyav!', 'Mrrr…', 'Miyaaav.', 'Mırr mırr ♥'];
const CLUB = ['Miyav! Toplantı başladı.', 'Bu gece balık var mı?', 'Mama kabı yine boş, bunu konuşmalıyız.', 'Çatıdaki güvercinler yine…',
  'Pijamalı Çocuk ağlarıyla bizi korkutuyor.', 'Kim benim kutuma oturdu?', 'Mrrr… oylamaya geçelim.', 'Miyav miyav!', 'Sessizlik! Reis konuşuyor.'];
C.cats = {
  list: cats,
  near(pos, r) {
    let best = null, bd = r || 1.4;
    for (const c of cats) { if (c === held) continue; const d = Math.hypot(c.x - pos.x, c.z - pos.z); if (d < bd && Math.abs(c.y - pos.y) < 1) { bd = d; best = c; } }
    return best;
  },
  get held() { return held; },
  pet(c) { c.st = c === held ? 'held' : 'pet'; c.purr = c === held ? 0 : 3.2; if (c !== held) { const p = P().pos; c.ry = Math.atan2(-(p.z - c.z), p.x - c.x); } return c; },
  pick(c) { held = c; c.st = 'held'; c.purr = 0; holdPose(c); },
  drop() {
    if (!held) return; const c = held, p = P(), f = p.face; held = null;
    c.x = p.pos.x + Math.cos(f) * 0.6; c.z = p.pos.z - Math.sin(f) * 0.6; c.y = P().groundAt ? P().groundAt(c.x, c.z) : p.pos.y; c.ry = f;
    c.st = 'follow'; c.t = 8 + Math.random() * 8;             // bırakınca biraz peşinden gelir, sonra yerleşir
  },
  meow(c) { return pick(MEOW); },
  describe: c => c.name + ', ' + c.coat.name,
  club: () => club
};

let clubT = 3;
C.updaters.push((dt, t, D) => {
  if (!cats.length) { if (C.blocks && C.blocks.length) spawn(); else return; }
  for (const c of cats) step(c, dt);
  if (held) { if (!P().active) C.cats.drop(); else holdPose(held); }
  /* toplantıda konuşmalar: kamera yakınsa balon */
  if (club && meetingTime() && P() && P().say && (clubT -= dt) <= 0) {
    clubT = 2.5 + Math.random() * 2.5;
    const cam = C.camera.position;
    if (Math.hypot(cam.x - club.x, cam.z - club.z) < 45) { const c = Math.random() < 0.4 ? club.cats[0] : pick(club.cats); P().say(() => new THREE.Vector3(c.x, c.y + 0.7, c.z), c === club.cats[0] ? 'Reis: ' + pick(CLUB) : pick(CLUB), 0, 2.6); }
  }
  group.visible = D <= 130;
  if (!group.visible) return;
  const cam = C.camera.position;
  let n = 0;
  for (const c of cats) {
    if (c !== held && Math.hypot(c.x - cam.x, c.z - cam.z) > 140) continue;     // uzaktakiler çizilmez
    draw(c, n++, t);
  }
  bodyI.count = headI.count = eyeI.count = noseI.count = n; tailI.count = 3 * n; legI.count = 4 * n;
  for (const m of [bodyI, headI, eyeI, noseI, tailI, legI]) m.instanceMatrix.needsUpdate = true;
  for (const m of parts) { m.instanceColor.needsUpdate = true; m.geometry.attributes.aPat.needsUpdate = true; m.geometry.attributes.aCol2.needsUpdate = true; }
});
})();
