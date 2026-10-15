/* ===== cats.js: sokak kedileri: kaldırımda ve parklarda dolaşır, oturur, uyur, yalanır; sevilir, kucağa alınır; gece parkta kedi toplantısı ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene, B = C.SW;
const pick = a => a[(Math.random() * a.length) | 0];

/* ---------- parçalar: gövde, baş + kulaklar, gözler, kuyruk (kedi başına 2), bacak (kedi başına 4); hepsi örnekli ---------- */
const CAP = 96;
const fur = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
const eyeM = new THREE.MeshStandardMaterial({ color: C.col('#c8d64a'), emissive: C.col('#d8f060'), emissiveIntensity: 0, roughness: 0.3 });
C.nightListeners.push(n => { eyeM.emissiveIntensity = n * 1.1; });          // gece gözler parlar
const headG = C.mergeGeos([
  C.roundBox(0.17, 0.15, 0.17, 0.06).clone(),
  ...[-1, 1].map(s => new THREE.ConeGeometry(0.035, 0.075, 4).rotateY(Math.PI / 4).translate(-0.01, 0.105, s * 0.048)),
  new THREE.BoxGeometry(0.07, 0.06, 0.09).translate(0.09, -0.03, 0)                       // ağız
]);
const eyeG = C.mergeGeos([-1, 1].map(s => new THREE.BoxGeometry(0.02, 0.032, 0.034).translate(0.085, 0.015, s * 0.038)));
const tailG = new THREE.CylinderGeometry(0.022, 0.03, 0.17, 6).rotateZ(Math.PI / 2).translate(-0.085, 0, 0);   // pivottan -x yönüne
const legG = new THREE.CylinderGeometry(0.028, 0.032, 0.17, 6).translate(0, -0.085, 0);                       // pivottan aşağı
const mk = (g, m, n) => { const x = C.inst(g, m, n); x.castShadow = true; x.count = 0; return x; };
const bodyI = mk(C.roundBox(0.44, 0.17, 0.19, 0.07).clone(), fur, CAP), headI = mk(headG, fur, CAP), eyeI = mk(eyeG, eyeM, CAP);
const tailI = mk(tailG, fur, CAP * 2), legI = mk(legG, fur, CAP * 4);
for (const [m, n] of [[bodyI, CAP], [headI, CAP], [tailI, CAP * 2], [legI, CAP * 4]]) m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(n * 3).fill(1), 3);
const group = new THREE.Group(); group.add(bodyI, headI, eyeI, tailI, legI); scene.add(group); C.peopleLayers.push(group);
const FUR = [['#d9822b', '#d9822b'], ['#1e1e22', '#1e1e22'], ['#f2efe8', '#f2efe8'], ['#8a8d92', '#8a8d92'], ['#e8d2a6', '#e8d2a6'],
  ['#6b4a2e', '#6b4a2e'], ['#1e1e22', '#f2efe8'], ['#d9822b', '#f2efe8'], ['#8a8d92', '#f2efe8']].map(p => p.map(C.col));   // gövde, ayak (beyaz çoraplı olanlar)
const NAMES = ['Tekir', 'Pamuk', 'Duman', 'Sarman', 'Boncuk', 'Minnoş', 'Zeytin', 'Fıstık', 'Karamel', 'Paşa', 'Limon', 'Mırmır', 'Şeker', 'Gece', 'Bulut', 'Tarçın'];

/* ---------- kediler ---------- */
const cats = [], H = 19.6;                                   // kaldırım halkası (yayaların biraz içi)
function ringPos(c) {
  const side = Math.floor(c.f * 4) & 3, u = (c.f * 4) % 1, h = H;
  if (side === 0) { c.x = c.bx - h + 2 * h * u; c.z = c.bz - h; } else if (side === 1) { c.x = c.bx + h; c.z = c.bz - h + 2 * h * u; }
  else if (side === 2) { c.x = c.bx + h - 2 * h * u; c.z = c.bz + h; } else { c.x = c.bx - h; c.z = c.bz + h - 2 * h * u; }
}
function make(kind, blk, club) {
  const c = { kind, bx: blk.bx, bz: blk.bz, blk, club: !!club, x: blk.bx, z: blk.bz, y: B, ry: Math.random() * 6.28, f: Math.random(), df: 0,
    tx: 0, tz: 0, st: 'sit', t: Math.random() * 8, ph: Math.random() * 10, sp: 0, col: pick(FUR), name: pick(NAMES), purr: 0, seat: null };
  if (kind === 'ring') ringPos(c); else { c.x = blk.bx + (Math.random() - 0.5) * 30; c.z = blk.bz + (Math.random() - 0.5) * 30; }
  cats.push(c); return c;
}
let club = null;
function spawn() {
  cats.length = 0;
  const city = C.blocks.filter(b => b.kind === 'city'), parks = C.blocks.filter(b => b.kind === 'park');
  for (let k = 0; k < 54 && city.length; k++) make('ring', pick(city));
  for (const p of parks) for (let k = 0; k < 2; k++) make('park', p);
  /* toplantı parkı: merkeze en yakın park; sekiz kedisi orada yaşar */
  const cp = parks.slice().sort((a, b) => Math.hypot(a.bx, a.bz) - Math.hypot(b.bx, b.bz))[0];
  if (cp) {
    const pond = cp.pond || { x: cp.bx + 9, z: cp.bz + 9 };
    club = { blk: cp, x: cp.bx - Math.sign(pond.x - cp.bx || 1) * 9, z: cp.bz - Math.sign(pond.z - cp.bz || 1) * 9, cats: [] };
    for (let k = 0; k < 8; k++) club.cats.push(make('park', cp, true));
    club.cats[0].name = 'Reis'; club.cats[0].col = FUR[0];
  }
}

/* ---------- davranış ---------- */
const meetingTime = () => C.hour >= 21.5 || C.hour < 1;
function nextState(c) {
  if (c.kind === 'go') { c.st = 'walk'; c.t = 99; return; }    // kaldırımına dönüyor
  const r = Math.random();
  if (r < 0.42) {                                            // yürü
    c.st = 'walk'; c.t = 3 + Math.random() * 7;
    if (c.kind === 'ring') c.df = (Math.random() < 0.5 ? -1 : 1);
    else { c.tx = c.bx + (Math.random() - 0.5) * 34; c.tz = c.bz + (Math.random() - 0.5) * 34; }
  } else if (r < 0.7) { c.st = 'sit'; c.t = 4 + Math.random() * 10; }
  else if (r < 0.85) { c.st = 'groom'; c.t = 3 + Math.random() * 5; }
  else { c.st = 'lie'; c.t = 12 + Math.random() * 30; }
}
const P = () => C.player;
function step(c, dt) {
  if (c.st === 'held') return;
  if (c.purr > 0) { c.purr -= dt; if (c.purr <= 0 && c.st === 'pet') { c.st = 'sit'; c.t = 3; } return; }
  /* toplantı: kulüp kedileri çemberde oturur, reis ortada */
  if (c.club && club && meetingTime()) {
    const k = club.cats.indexOf(c), a = k / (club.cats.length - 1) * Math.PI * 2;
    const sx = k === 0 ? club.x : club.x + Math.cos(a) * 2.1, sz = k === 0 ? club.z : club.z + Math.sin(a) * 2.1;
    const dx = sx - c.x, dz = sz - c.z, d = Math.hypot(dx, dz);
    if (d > 0.15) { c.st = 'walk'; c.sp = 0.9; c.x += dx / d * Math.min(d, c.sp * dt); c.z += dz / d * Math.min(d, c.sp * dt); c.ry = Math.atan2(-dz, dx); c.ph += dt * 9; }
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
    const dx = c.tx - c.x, dz = c.tz - c.z, d = Math.hypot(dx, dz);
    if (d < 0.2) { if (c.kind === 'go') { c.kind = 'ring'; c.y = B; } c.t = 0; return; }
    c.x += dx / d * c.sp * dt; c.z += dz / d * c.sp * dt; c.ry = Math.atan2(-dz, dx);
    if (c.kind === 'go' && C.player.groundAt) c.y = C.player.groundAt(c.x, c.z);   // yoldan kaldırıma çıkar
  }
}

/* ---------- çizim: kök > gövde > baş/bacak/kuyruk ---------- */
const M4 = THREE.Matrix4, mr = new M4(), mb = new M4(), mh = new M4(), mt = new M4(), ml = new M4(), T = new M4(), Rm = new M4();
const tr = (out, base, x, y, z) => out.multiplyMatrices(base, T.makeTranslation(x, y, z));
const rz = (m, a) => a ? m.multiply(Rm.makeRotationZ(a)) : m, ry = (m, a) => a ? m.multiply(Rm.makeRotationY(a)) : m, rx = (m, a) => a ? m.multiply(Rm.makeRotationX(a)) : m;
const ZERO = new M4().makeScale(0, 0, 0);
function draw(c, n, t) {
  const st = c.st, s = Math.sin(c.ph);
  let by = 0.24, pitch = 0, roll = 0, hy = 0, hp = 0, tailUp = 0.9, tailYaw = 0, curl = 0.6, legs = [0, 0, 0, 0], fold = 0, eyes = true;
  if (st === 'walk') { by = 0.24 + Math.abs(s) * 0.008; legs = [s * 0.5, -s * 0.5, -s * 0.5, s * 0.5]; tailUp = 1.1 + Math.sin(c.ph * 0.5) * 0.15; hp = -0.05; }
  else if (st === 'sit' || st === 'pet') {
    pitch = 0.55; by = 0.17; fold = 1; tailUp = -0.15; tailYaw = 1.2; curl = 0.9; hy = Math.sin(t * 0.4 + c.ph) * 0.4;
    if (st === 'pet') { tailUp = 1.3 + Math.sin(t * 9) * 0.06; tailYaw = 0; curl = 0.3; eyes = false; hp = -0.25; hy = 0; }
  } else if (st === 'groom') { pitch = 0.55; by = 0.17; fold = 1; tailUp = -0.15; tailYaw = 1.2; hy = 1.1; hp = -0.7 + Math.sin(t * 7) * 0.12; }
  else if (st === 'lie') { by = 0.1 + Math.sin(t * 1.4 + c.ph) * 0.004; fold = 2; tailUp = -0.05; tailYaw = 1.6; curl = 1.2; hy = 0.5; hp = 0.35; eyes = false; roll = 0.12; }
  else if (st === 'held') { pitch = 0; by = 0; legs = [0.3, 0.3, -0.2, -0.2]; tailUp = -1.1; hp = 0.1; hy = -0.3; }

  mr.makeTranslation(c.x, c.y, c.z); ry(mr, c.ry);
  tr(mb, mr, 0, by, 0); rz(mb, pitch); rx(mb, roll);
  bodyI.setMatrixAt(n, mb); bodyI.setColorAt(n, c.col[0]);
  tr(mh, mb, 0.25, 0.09, 0); ry(mh, hy); rz(mh, hp);
  headI.setMatrixAt(n, mh); headI.setColorAt(n, c.col[0]);
  eyeI.setMatrixAt(n, eyes ? mh : ZERO);
  tr(mt, mb, -0.21, 0.04, 0); ry(mt, tailYaw); rz(mt, -tailUp);
  tailI.setMatrixAt(2 * n, mt); tailI.setColorAt(2 * n, c.col[0]);
  tr(mt, mt, -0.17, 0, 0); rz(mt, -curl);
  tailI.setMatrixAt(2 * n + 1, mt); tailI.setColorAt(2 * n + 1, c.col[0]);
  [[0.15, 0.06], [0.15, -0.06], [-0.15, 0.06], [-0.15, -0.06]].forEach(([lx, lz], k) => {
    tr(ml, mb, lx, -0.065, lz);
    if (fold === 2) { rz(ml, k < 2 ? 1.5 : -1.5); }                            // uyurken bacaklar gövdenin altında
    else if (fold === 1) rz(ml, k < 2 ? -pitch : 1.45);                        // oturunca ön bacak dik, arka bacak katlı
    else rz(ml, legs[k]);
    legI.setMatrixAt(4 * n + k, ml); legI.setColorAt(4 * n + k, c.col[1]);
  });
}

/* ---------- oyuncu: sev, kucağa al, bırak ---------- */
let held = null;
function holdPose(c) {
  const p = P(), f = p.face, fx = Math.cos(f), fz = -Math.sin(f);
  c.x = p.pos.x + fx * 0.36; c.z = p.pos.z + fz * 0.36; c.y = p.pos.y + 1.0; c.ry = f + Math.PI / 2;
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
  pet(c) { c.st = 'pet'; c.purr = 3.2; if (c !== held) { const p = P().pos; c.ry = Math.atan2(-(p.z - c.z), p.x - c.x); } return c; },
  pick(c) { held = c; c.st = 'held'; c.purr = 0; holdPose(c); },
  drop() {
    if (!held) return; const c = held, p = P(), f = p.face; held = null;
    c.x = p.pos.x + Math.cos(f) * 0.6; c.z = p.pos.z - Math.sin(f) * 0.6; c.y = p.pos.y; c.st = 'sit'; c.t = 4; c.ry = f;
    /* bırakıldığı yer artık onun mahallesi: parksa parkta gezer, değilse en yakın bloğun kaldırımına yürür */
    const bi = C.clamp(Math.round((c.x - C.blockC(0)) / C.PITCH), 0, C.N - 1), bj = C.clamp(Math.round((c.z - C.blockC(0)) / C.PITCH), 0, C.N - 1);
    const blk = C.blocks.find(b => b.i === bi && b.j === bj);
    if (blk && !c.club) {
      c.blk = blk; c.bx = blk.bx; c.bz = blk.bz;
      if (blk.kind === 'park') c.kind = 'park';
      else {
        const dx = c.x - blk.bx, dz = c.z - blk.bz, h = H, u = (q) => C.clamp((q + h) / (2 * h), 0, 0.999);
        if (Math.abs(dz) >= Math.abs(dx)) c.f = dz < 0 ? u(dx) / 4 : (2 + 1 - u(dx)) / 4; else c.f = dx > 0 ? (1 + u(dz)) / 4 : (3 + 1 - u(dz)) / 4;
        const q = { bx: blk.bx, bz: blk.bz, f: c.f, x: 0, z: 0 }; ringPos(q);
        c.kind = 'go'; c.tx = q.x; c.tz = q.z; c.st = 'walk'; c.t = 99;
      }
    }
  },
  meow(c) { return pick(MEOW); },
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
  bodyI.count = headI.count = eyeI.count = n; tailI.count = 2 * n; legI.count = 4 * n;
  for (const m of [bodyI, headI, eyeI, tailI, legI]) m.instanceMatrix.needsUpdate = true;
  for (const m of [bodyI, headI, tailI, legI]) m.instanceColor.needsUpdate = true;
});
})();
