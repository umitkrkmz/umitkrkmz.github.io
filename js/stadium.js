/* ===== stadium.js: Şehir Stadı'nda maç: öğleden sonra ve akşam; iki takım, hakem, top, tribünde taraftar, skor tabelası ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const B = C.SW, pick = a => a[(Math.random() * a.length) | 0];
/* stadyum ui.js şehri kurunca var olur: kurulum ilk karede */
let tick = null;
C.updaters.push((dt, t, D) => {
  if (!tick) { const L = C.landmarks.find(l => l.type === 'stadium'); if (!L) return; tick = setup(L); }
  tick(dt, t, D);
});
function setup(L) {
const G = L.group, OX = L.bx, OZ = L.bz;                       // stadyum grubu blok merkezinde; aşağıdaki koordinatlar yerel
const FX = 13.2, FZ = 8.2, GW = 1.8, GH = 1.4;                  // saha sınırları (çizgiler), kale ağzı yarı genişliği, kale yüksekliği

/* ---------- kaleler ve top ---------- */
const white = new THREE.MeshStandardMaterial({ color: C.col('#f4f4f0'), roughness: 0.5 });
const netM = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, roughness: 1, side: THREE.DoubleSide, depthWrite: false });
const bar = (x, y, z, sx, sy, sz, m) => { const o = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), m || white); o.position.set(x, y, z); o.castShadow = true; G.add(o); return o; };
for (const s of [-1, 1]) {
  const x = s * FX;
  for (const z of [-GW, GW]) bar(x, B + GH / 2, z, 0.1, GH, 0.1);
  bar(x, B + GH, 0, 0.1, 0.1, GW * 2 + 0.1);
  bar(x + s * 0.45, B + GH / 2, 0, 0.9, GH, GW * 2, netM).castShadow = false;   // ağ
}
const ball = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8), white); ball.castShadow = true; G.add(ball); ball.visible = false;

/* ---------- skor tabelası: karşı kalenin arkasında, iki direk üstünde ---------- */
const sbCv = document.createElement('canvas'); sbCv.width = 512; sbCv.height = 160;
const sbTex = new THREE.CanvasTexture(sbCv); sbTex.encoding = THREE.sRGBEncoding; sbTex.anisotropy = C.maxAniso;
const sbMat = new THREE.MeshStandardMaterial({ map: sbTex, emissive: 0xffffff, emissiveMap: sbTex, emissiveIntensity: 0.6, roughness: 0.6 });
const board = new THREE.Mesh(new THREE.PlaneGeometry(8, 2.5), sbMat); board.position.set(20.1, B + 7.2, 0); board.rotation.y = -Math.PI / 2; G.add(board);
bar(20.25, B + 7.2, 0, 0.2, 2.7, 8.2, new THREE.MeshStandardMaterial({ color: C.col('#1c2228'), roughness: 0.7 }));
for (const z of [-3, 3]) bar(20.3, B + 3, z, 0.2, 6, 0.2, new THREE.MeshStandardMaterial({ color: C.col('#c9ccd0'), roughness: 0.5, metalness: 0.6 }));

/* ---------- takımlar ---------- */
const KITS = [['#c9372c', '#f2f2ee'], ['#2f6fb0', '#f2f2ee'], ['#f2b705', '#1e3a5f'], ['#2f8f5b', '#f2f2ee'], ['#6b3fa0', '#ffd23f'], ['#f2f2ee', '#16212b'], ['#e86a1c', '#16212b']];
const SUFFIX = ['SK', 'Spor', 'Gücü', 'FK', 'Belediyespor', 'İdmanyurdu'];
const FORM = [[-0.95, 0], [-0.62, -0.62], [-0.66, -0.2], [-0.66, 0.2], [-0.62, 0.62], [-0.18, -0.62], [-0.22, -0.2], [-0.22, 0.2], [-0.18, 0.62], [0.32, -0.28], [0.32, 0.28]];
const players = new C.Crowd(23), fans = new C.Crowd(340), pp = {}, fp = {};
C.scene.add(players.group, fans.group); C.peopleLayers.push(players.group, fans.group);
const M = { on: false, min: 0, score: [0, 0], teams: null, ph: 'off', wait: 0, cheer: [0, 0], msgT: 0 };
const team = (k) => M.teams[k];
const P = [];                                                   // oyuncular: { k (takım), f (dizilim), x, z, ry, sp, cool }
function newTeams() {
  const names = C.DISTRICTS.map(d => d.name).sort(() => Math.random() - 0.5), kits = KITS.slice().sort(() => Math.random() - 0.5);
  M.teams = [0, 1].map(k => ({ name: names[k] + ' ' + pick(SUFFIX), short: names[k].slice(0, 3).toLocaleUpperCase('tr'), kit: kits[k] }));
  P.length = 0;
  for (let k = 0; k < 2; k++) FORM.forEach((f, i) => {
    const look = C.randomLook(); look.shirt = i === 0 ? (k ? '#16212b' : '#3fbf6a') : M.teams[k].kit[0]; look.pants = M.teams[k].kit[1]; look.shoes = '#16212b';
    const p = { k, i, f, x: 0, z: 0, kx: 0, kz: 0, ry: 0, sp: 0, ph: Math.random() * 6, cool: 0, slot: P.length }; players.look(p.slot, look); P.push(p);
  });
  const ref = C.randomLook(); ref.shirt = '#16212b'; ref.pants = '#16212b'; players.look(22, ref);
  /* taraftarlar: tribünde oturur, çoğu takım renginde */
  fanSeats.forEach((s, n) => {
    s.on = Math.random() < 0.62; if (!s.on) return;
    const look = C.randomLook(); s.team = s.x < 0 ? 0 : 1; if (Math.random() < 0.7) look.shirt = M.teams[s.team].kit[0];
    fans.look(n, look);
  });
}
const dirOf = k => k ? -1 : 1;                                  // takım 0 +x kalesine hücum eder
/* dizilimdeki yer: oyunda topla birlikte kayar; başlama vuruşunda kendi yarı sahası */
function home(p) {
  if (M.ph !== 'play') return [p.kx, p.kz];
  const d = dirOf(p.k), u = p.f[0] * 0.62 + C.clamp(bp.x * d / FX, -1, 1) * 0.42, v = p.f[1] * 0.85 + bp.z / FZ * 0.25;
  return [C.clamp(u * FX, -FX + 0.6, FX - 0.6) * d, C.clamp(v * FZ, -FZ + 0.4, FZ - 0.4)];
}

/* ---------- top ---------- */
const bv = { x: 0, z: 0, y: 0 }, bp = { x: 0, z: 0, y: 0.11 };
let holder = null, holdT = 0, lastKick = null;
function kickoff(k, snap) {
  bp.x = 0; bp.z = 0; bp.y = 0.11; bv.x = bv.z = bv.y = 0; holder = null; M.ph = 'kick'; M.wait = snap ? 2.5 : 4; M.kickTeam = k;
  for (const p of P) { const d = dirOf(p.k); p.kx = Math.min(-1.2, p.f[0] * FX * 0.85) * d; p.kz = p.f[1] * FZ * 0.85; if (snap) { p.x = p.kx; p.z = p.kz; } }
}
function kick(p, tx, tz, speed, lift) {
  const dx = tx - bp.x, dz = tz - bp.z, l = Math.hypot(dx, dz) || 1;
  bv.x = dx / l * speed; bv.z = dz / l * speed; bv.y = lift || 0; holder = null; p.cool = 0.7; lastKick = p;
}
function decide(p) {
  const d = dirOf(p.k), gx = FX * d, toGoal = Math.abs(gx - bp.x);
  if (p.i === 0) {                                               // kaleci: uzun degaj
    const mates = P.filter(o => o.k === p.k && o.i >= 5); const m = pick(mates); kick(p, m.x + d * 4, m.z, 15, 4); return;
  }
  if (toGoal < 9 && Math.random() < 0.22) { kick(p, gx + d, (Math.random() - 0.5) * GW * 3.2, 14 + Math.random() * 6, Math.random() < 0.45 ? 2.8 : 0.6); return; }   // şut: çoğu kaleciye ya da dışarı
  const ahead = P.filter(o => o.k === p.k && o !== p && o.i > 0 && (o.x - p.x) * d > -2 && Math.hypot(o.x - p.x, o.z - p.z) < 16);
  if (ahead.length && Math.random() < 0.6) { const m = pick(ahead); const dist = Math.hypot(m.x - p.x, m.z - p.z); kick(p, m.x + d * 1.2, m.z, C.clamp(dist * 1.1, 6, 15), dist > 11 ? 3 : 0.3); return; }   // pas
  kick(p, bp.x + d * 5, bp.z + (Math.random() - 0.5) * 4, 5.5, 0);                // top sür
}
function goal(k) {
  M.score[k]++; M.cheer[k] = 5; M.ph = 'goal'; M.wait = 4.5; M.scorer = k;
  const cam = C.camera.position;
  if (C.player && C.player.say && Math.hypot(cam.x - OX, cam.z - OZ) < 140)
    C.player.say(() => new THREE.Vector3(OX, B + 12, OZ), `GOOOL! ${team(k).name} · ${M.score[0]}-${M.score[1]}`, 0, 3.5);
  drawBoard();
}
function stepBall(dt) {
  if (holder) { bp.x = holder.x + dirOf(holder.k) * 0.4; bp.z = holder.z; bp.y = 0.6; return; }
  bp.x += bv.x * dt; bp.z += bv.z * dt; bp.y += bv.y * dt;
  if (bp.y > 0.11) bv.y -= 9.8 * dt; else { bp.y = 0.11; if (bv.y < -1.5) bv.y *= -0.45; else bv.y = 0; }
  const f = Math.exp(-(bp.y > 0.15 ? 0.15 : 0.9) * dt); bv.x *= f; bv.z *= f;
  if (Math.abs(bp.z) > FZ) { bp.z = Math.sign(bp.z) * FZ; bv.z *= -0.5; bv.x *= 0.6; }                // taç: kenardan geri
  if (Math.abs(bp.x) > FX) {
    const side = Math.sign(bp.x);
    if (Math.abs(bp.z) < GW && bp.y < GH) { goal(side > 0 ? 0 : 1); return; }
    /* aut: kaleci alır */
    const gk = P.find(o => o.i === 0 && dirOf(o.k) === -side); bp.x = side * (FX - 0.8); bp.z = 0; bv.x = bv.z = bv.y = 0;
    if (gk) { gk.x = side * (FX - 0.6); gk.z = 0; holder = gk; holdT = 1.2; }
  }
}

/* ---------- oyun döngüsü ---------- */
const MATCH_S = 300;                                            // 90 dakika = 5 gerçek dakika
const inWindow = () => (C.hour >= 13.5 && C.hour < 17) || (C.hour >= 19 && C.hour < 22.5);
function startMatch() { newTeams(); M.on = true; M.min = 0; M.score = [0, 0]; M.half = 1; kickoff(Math.random() < 0.5 ? 0 : 1, true); ball.visible = true; drawBoard(); }
function stepPlayers(dt) {
  const near = [0, 1].map(k => P.filter(p => p.k === k && p.i > 0).sort((a, b) => Math.hypot(a.x - bp.x, a.z - bp.z) - Math.hypot(b.x - bp.x, b.z - bp.z))[0]);
  /* karede tek dokunuş; sıra her karede döner: aynı anda topa giden iki oyuncudan hep sonraki kazanmasın */
  let touched = false; M.rev = !M.rev;
  for (const p of (M.rev ? P.slice().reverse() : P)) {
    p.cool -= dt;
    let tx, tz, sp;
    const d = dirOf(p.k);
    if (M.ph === 'goal' || M.ph === 'end') { tx = p.x; tz = p.z; sp = 0; }
    else if (p.i === 0 && M.ph === 'play') {                        // kaleci: çizgide, top yaklaşınca çıkar
      const gx = -d * (FX - 0.7), close = Math.abs(bp.x - gx) < 4.5 && Math.abs(bp.z) < 5;
      tx = close ? bp.x : gx; tz = close ? bp.z : C.clamp(bp.z * 0.6, -GW + 0.3, GW - 0.3); sp = close ? 5.5 : 4;
    }
    else if (M.ph === 'play' && near[p.k] === p) { tx = bp.x; tz = bp.z; sp = 6.2; }
    else { [tx, tz] = home(p); sp = M.ph === 'play' ? 3.4 : 5; }
    const dx = tx - p.x, dz = tz - p.z, l = Math.hypot(dx, dz);
    const v = l > 0.3 ? Math.min(sp, l * 2) : 0;
    if (v > 0.05) { p.x += dx / l * v * dt; p.z += dz / l * v * dt; }
    p.sp = v; p.ph += v * dt * 2.4;
    const fx = v > 0.5 ? dx : bp.x - p.x, fz = v > 0.5 ? dz : bp.z - p.z; p.ry = Math.atan2(-fz, fx);
    /* topa değdi */
    const reach = p.i === 0 ? 1.3 : 0.55, dball = Math.hypot(p.x - bp.x, p.z - bp.z);
    if (M.ph === 'play' && !holder && !touched && p.cool <= 0 && bp.y < (p.i === 0 ? 2.2 : 0.9) && dball < reach) {
      touched = true;
      if (p.i === 0) {                                               // kaleci: yavaş topu alır, şutların çoğunu tutar
        if (Math.hypot(bv.x, bv.z) < 6 || Math.random() < 0.8) { holder = p; holdT = 1.1; bv.x = bv.z = bv.y = 0; }
        else { p.cool = 1.2; bv.x *= 0.6; bv.z += (Math.random() - 0.5) * 6; }
      } else if (dball < 0.55) decide(p);
    }
  }
  if (holder && (holdT -= dt) <= 0) decide(holder);
}
function stepMatch(dt) {
  if (M.ph === 'kick') { if ((M.wait -= dt) <= 0) { M.ph = 'play'; const p = P.filter(o => o.k === M.kickTeam && o.i >= 9)[0]; if (p) { p.x = -dirOf(p.k) * 0.4; p.z = 0; kick(p, -dirOf(p.k) * 6, (Math.random() - 0.5) * 6, 7, 0); } } }
  else if (M.ph === 'goal') { if ((M.wait -= dt) <= 0) kickoff(1 - M.scorer); }
  else if (M.ph === 'half') { if ((M.wait -= dt) <= 0) { M.half = 2; kickoff(1 - M.kickTeam); } }
  else if (M.ph === 'end') { if ((M.wait -= dt) <= 0) { M.on = false; M.ph = 'off'; M.wait = 40; ball.visible = false; drawBoard(); } return; }
  if (M.ph === 'play') {
    const m0 = M.min; M.min += dt / MATCH_S * 90;
    if (m0 < 45 && M.min >= 45 && M.half === 1) { M.ph = 'half'; M.wait = 8; holder = null; bv.x = bv.z = 0; }
    if (M.min >= 90) { M.min = 90; M.ph = 'end'; M.wait = 25; holder = null; bv.x = bv.z = 0; }
    if (Math.floor(m0) !== Math.floor(M.min)) drawBoard();
  }
  stepPlayers(dt); if (M.ph === 'play' || M.ph === 'kick') stepBall(dt);
  for (let k = 0; k < 2; k++) if (M.cheer[k] > 0) M.cheer[k] -= dt;
}
function drawBoard() {
  const x = sbCv.getContext('2d'), w = 512, h = 160;
  x.fillStyle = '#10161c'; x.fillRect(0, 0, w, h);
  x.textAlign = 'center'; x.textBaseline = 'middle';
  const f = (s, wt) => `${wt || 800} ${s}px "Big Shoulders Display","Arial Narrow",sans-serif`;
  if (!M.teams || (!M.on && M.ph === 'off')) { x.fillStyle = '#ffb53d'; x.font = f(56); x.fillText('ŞEHİR STADI', w / 2, h / 2 - 14); x.fillStyle = '#9aa7b3'; x.font = f(30, 600); x.fillText('Maçlar 13:30 ve 19:00', w / 2, h / 2 + 34); sbTex.needsUpdate = true; return; }
  const [a, b] = M.teams;
  x.fillStyle = a.kit[0]; x.fillRect(18, 24, 14, 72); x.fillStyle = b.kit[0]; x.fillRect(w - 32, 24, 14, 72);
  x.fillStyle = '#f2f2ee'; x.font = f(62); x.fillText(a.short, 110, 60); x.fillText(b.short, w - 110, 60);
  x.fillStyle = '#ffb53d'; x.font = f(84); x.fillText(`${M.score[0]} - ${M.score[1]}`, w / 2, 62);
  x.fillStyle = '#9aa7b3'; x.font = f(30, 600);
  x.fillText(M.ph === 'half' ? 'DEVRE ARASI' : M.ph === 'end' ? 'MAÇ SONU' : `${Math.floor(M.min)}'`, w / 2, 130);
  sbTex.needsUpdate = true;
}
drawBoard();
C.nightListeners.push(n => { sbMat.emissiveIntensity = 0.6 + n * 0.5; });
/* kart satırı */
L.rows.push(['Maç', () => M.on ? `${team(0).name} ${M.score[0]} - ${M.score[1]} ${team(1).name} · ${M.ph === 'half' ? 'devre arası' : M.ph === 'end' ? 'maç sonu' : Math.floor(M.min) + "'"}` : 'Bugün 13:30 ve 19:00']);
C.match = M;

/* ---------- tribün yerleri ---------- */
const fanSeats = [];
/* basamağın ön kenarına oturur (kalça basamakta, bacaklar alt basamağın önünde): oturma pozu kalçayı 0,44 m indirir */
for (const s of [-1, 1]) for (let k = 0; k < 3; k++) for (let x = -14.6; x <= 14.6; x += 0.85) fanSeats.push({ x, z: s * (12.4 + k * 2.2 - 0.85), y: B + 1.4 * (k + 1) - 0.42, ry: Math.atan2(s, 0), ph: Math.random() * 9 });
for (const s of [-1, 1]) for (let k = 0; k < 2; k++) for (let z = -10; z <= 10; z += 0.85) fanSeats.push({ x: s * (17.1 + k * 1.6 - 0.55), z, y: B + 1.4 * (k + 1) - 0.42, ry: Math.atan2(0, -s), ph: Math.random() * 9 });
fanSeats.length = Math.min(fanSeats.length, 340);

return function (dt, t, D) {
  if (!M.on) { if ((M.wait -= dt) <= 0 && inWindow()) startMatch(); }
  else stepMatch(dt);
  const vis = M.on && D <= 130 && Math.hypot(C.camera.position.x - OX, C.camera.position.z - OZ) < 260;
  players.group.visible = fans.group.visible = vis;
  if (!vis) { if (M.on) { ball.position.set(bp.x, B + 0.06 + bp.y, bp.z); } return; }
  ball.position.set(bp.x, B + 0.06 + bp.y, bp.z); ball.rotation.z -= bv.x * dt * 4; ball.rotation.x += bv.z * dt * 4;
  players.begin();
  for (const p of P) {
    const cel = M.ph === 'goal' && p.k === M.scorer, pose = cel ? C.pose('handsup', t, pp) : p.sp > 3.6 ? C.pose('run', p.ph, pp) : p.sp > 0.3 ? C.pose('walk', p.ph * 1.4, pp) : C.pose('stand', t + p.slot, pp);
    players.put(p.slot, OX + p.x, B + 0.06, OZ + p.z, p.ry, pose);
  }
  /* hakem topun biraz gerisinde */
  const rx = bp.x * 0.85 - 2.5, rz = C.clamp(bp.z + 3, -FZ, FZ);
  M.rx = M.rx === undefined ? rx : M.rx + (rx - M.rx) * Math.min(1, dt * 1.2); M.rz = M.rz === undefined ? rz : M.rz + (rz - M.rz) * Math.min(1, dt * 1.2);
  players.put(22, OX + M.rx, B + 0.06, OZ + M.rz, Math.atan2(-(bp.z - M.rz), bp.x - M.rx), C.pose(Math.abs(rx - M.rx) > 0.5 ? 'walk' : 'stand', t * 3, pp));
  players.end();
  fans.begin();
  fanSeats.forEach((s, n) => {
    if (!s.on) return;
    const up = M.cheer[s.team] > 0 || (M.ph === 'play' && Math.sin(t * 0.7 + s.ph) > 0.97);
    fans.put(n, OX + s.x, s.y, OZ + s.z, s.ry, up ? C.pose('handsup', t, fp) : C.pose('sit', t + s.ph, fp));
  });
  fans.end();
};
}
})();
