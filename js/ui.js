/* ===== ui.js: kamera, seçim, kontroller, ana döngü ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const $ = id => document.getElementById(id);
const camera = C.camera, scene = C.scene, renderer = C.renderer, stage = $('stage'), sun = C.sun;
const fmt = new Intl.NumberFormat('tr-TR');

/* ---------- dünyayı kur ---------- */
C.genBlocks(); C.buildStreet(); C.populate(2026); C.setDensity(0.5); C.buildPeople(); C.refreshPickables();
C.playing = false; C.dayRate = 0.25;

/* ---------- kamera ---------- */
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.09; controls.screenSpacePanning = false;
controls.minDistance = 3; controls.maxDistance = 900 * C.SCALE; controls.maxPolarAngle = Math.PI; controls.rotateSpeed = 0.7;
controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
const OVER = new THREE.Vector3(0, 430 * C.SCALE, 470 * C.SCALE);
camera.position.copy(OVER); controls.target.set(0, 0, 0);

function clampTarget() {
  const lim = C.TOTAL / 2 + 100, t = controls.target, b = t.clone();
  t.x = C.clamp(t.x, -lim, lim); t.z = C.clamp(t.z, -lim, lim); t.y = C.clamp(t.y, 0, 200);
  camera.position.add(t.clone().sub(b));
}

/* ---------- uçuş animasyonu: mesafe logaritmik, böylece yakınlaşma hissi doğal ---------- */
let fly = null, follow = false;
/* keep: takip sürsün (yalnızca takibi başlatan uçuş); diğer her uçuş takibi bırakır */
function flyTo(pos, tgt, dur, keep) {
  if (!keep) setFollow(false);
  fly = { t0: controls.target.clone(), o0: camera.position.clone().sub(controls.target), t1: tgt.clone(), o1: pos.clone().sub(tgt), s: performance.now(), d: dur || 2000 };
}
function stepFly(now) {
  if (!fly) return;
  const u = C.clamp((now - fly.s) / fly.d, 0, 1), e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
  const l0 = fly.o0.length(), l1 = fly.o1.length();
  const len = Math.exp(Math.log(l0) * (1 - e) + Math.log(l1) * e);
  const dir = fly.o0.clone().normalize().lerp(fly.o1.clone().normalize(), e).normalize();
  controls.target.lerpVectors(fly.t0, fly.t1, e);
  camera.position.copy(controls.target).addScaledVector(dir, len);
  if (u >= 1) fly = null;
}
function setFollow(on) {
  follow = on; const b = $('btnHero'); if (!b) return;
  b.textContent = on ? 'İzlemeyi bırak' : "Örümcek Adam'ı izle"; b.setAttribute('aria-pressed', on);
}
C.controls = controls; C.flyTo = flyTo; C.flying = () => !!fly;     // olay akışı gibi dış kullanımlar için

/* ---------- imlece doğru yakınlaşma ---------- */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), gplane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit = new THREE.Vector3();
const el = renderer.domElement;
function ndcOf(e) { const r = el.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); }
function groundPoint(e) {
  ndcOf(e); ray.setFromCamera(ndc, camera);
  return ray.ray.intersectPlane(gplane, hit) && hit.distanceTo(camera.position) < 3000 ? hit.clone() : null;
}
stage.addEventListener('wheel', e => {
  e.preventDefault(); e.stopPropagation();
  if (C.player && C.player.active) { C.player.zoom(e.deltaY); return; }
  fly = null;
  const D = camera.position.distanceTo(controls.target);
  const k = Math.exp(e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0016));
  const nd = C.clamp(D * k, controls.minDistance, controls.maxDistance), kk = nd / D;
  const P = groundPoint(e) || controls.target.clone();
  camera.position.sub(P).multiplyScalar(kk).add(P);
  controls.target.sub(P).multiplyScalar(kk).add(P);
  clampTarget();
}, { passive: false, capture: true });
controls.addEventListener('start', () => { fly = null; });

/* ---------- seçim ---------- */
const outline = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: C.col('#ffb53d'), depthTest: false, transparent: true }));
outline.renderOrder = 10; outline.visible = false; outline.frustumCulled = false; scene.add(outline);
let sel = null;
function showOutline() {
  outline.geometry.dispose();
  if (!sel) { outline.visible = false; return; }
  if (sel.b && sel.b.cut) { outline.visible = false; return; }        // kesitte çerçeve kalabalık yapar
  const lot = sel.lot, h = sel.b ? sel.b.height + 0.8 : sel.L ? sel.L.height + 0.8 : 0.6;
  outline.geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(lot.w, h, lot.d));
  outline.position.set(lot.cx, C.SW + h / 2, lot.cz); outline.visible = true;
}
const LIM = { tower: 70, mid: 24, low: 8, house: 4 };
function renderSel() {
  const card = $('selCard');
  if (!sel) { card.hidden = true; return; }
  card.hidden = false;
  const rows = $('selRows'), act = $('selActions');
  if (sel.L) {
    $('selTitle').textContent = sel.L.name;
    rows.innerHTML = sel.L.rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${typeof v === 'function' ? v() : v}</dd></div>`).join('');
    act.innerHTML = `<button class="btn" data-act="visit">Yakından bak</button>`;
  } else if (sel.b) {
    const b = sel.b, tiers = C.tiersOf(b), per = { house: 45, mid: 30, low: 30, tower: 14 }[b.type];
    let area = 0; tiers.forEach(t => area += t.w * t.d * t.f);
    const pop = Math.round(area * 0.75 / per / 10) * 10 || 5;
    $('selTitle').textContent = C.typeName(b);
    rows.innerHTML = `<div><dt>Yükseklik</dt><dd>${fmt.format(Math.round(b.height))} m</dd></div><div><dt>Kat</dt><dd>${b.floors}</dd></div>` +
      `<div><dt>Parsel</dt><dd>${Math.round(sel.lot.w)} × ${Math.round(sel.lot.d)} m</dd></div><div><dt>${b.type === 'tower' ? 'Çalışan' : 'Sakin'}</dt><dd>~${fmt.format(pop)}</dd></div>`;
    act.innerHTML = `<button class="btn" data-act="up"${b.floors >= LIM[b.type] ? ' disabled' : ''}>+ Kat</button><button class="btn" data-act="down"${b.floors <= 1 ? ' disabled' : ''}>− Kat</button><button class="btn danger" data-act="demolish">Yık</button>` +
      `<button class="btn" data-act="cut" aria-pressed="${!!b.cut}">${b.cut ? 'Kesiti kapat' : 'Kesit'}</button>`;
  } else {
    $('selTitle').textContent = 'Boş arsa';
    rows.innerHTML = `<div><dt>Parsel</dt><dd>${Math.round(sel.lot.w)} × ${Math.round(sel.lot.d)} m</dd></div><div><dt>Alan</dt><dd>${fmt.format(Math.round(sel.lot.w * sel.lot.d))} m²</dd></div>`;
    act.innerHTML = `<button class="btn" data-act="build:house">Müstakil ev</button><button class="btn" data-act="build:mid">Apartman</button><button class="btn" data-act="build:tower">Ofis kulesi</button>`;
  }
}
function select(s) {
  if (C.cutaway.building && (!s || s.b !== C.cutaway.building)) C.cutaway.close();
  sel = s; showOutline(); renderSel();
}
/* yapıyı en az engelle gösteren bakış noktası: aday noktalardan yapının dokuz noktasına ışın atar,
   en az ışını kesilen (eşitlikte en alçak) adayı seçer */
const vrc = new THREE.Raycaster(), vdir = new THREE.Vector3(), vpt = new THREE.Vector3();
function clearView(L) {
  const h = Math.max(20, L.height), tgt = new THREE.Vector3(L.bx, h * 0.3, L.bz), r = L.r || C.BLOCK * 0.34;
  const probes = [[0, 0.3, 0]];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) for (const fy of [0.15, 0.8]) probes.push([sx * r, fy, sz * r]);
  let best = null, bestScore = 1e9;
  for (const el of [0.45, 0.7, 1.0, 1.25]) for (const dist of [h * 2.2, h * 3]) for (let k = 0; k < 8; k++) {
    const az = 0.6 + k * Math.PI / 4;
    const pos = new THREE.Vector3(L.bx + Math.sin(az) * Math.cos(el) * dist, tgt.y + Math.sin(el) * dist, L.bz + Math.cos(az) * Math.cos(el) * dist);
    let score = 0;
    for (const p of probes) {
      vpt.set(L.bx + p[0], h * p[1], L.bz + p[2]);
      vdir.subVectors(vpt, pos); vrc.far = vdir.length(); vrc.set(pos, vdir.normalize());
      if (vrc.intersectObjects(C.pickables, false).some(x => x.object.userData.landmark !== L && !(L.building && x.object.userData.building === L.building))) score++;
      if (score >= bestScore) break;
    }
    if (score < bestScore) { bestScore = score; best = pos; if (!score) return [best, tgt]; }
  }
  return [best, tgt];
}
C.clearView = clearView;     // olay akışı da kullanır: { bx, bz, height, r, building }
$('selClose').addEventListener('click', () => select(null));
window.addEventListener('keydown', e => { if (e.key === 'Escape') { select(null); setFollow(false); } });
$('selActions').addEventListener('click', e => {
  const btn = e.target.closest('button[data-act]'); if (!btn || !sel) return;
  const a = btn.dataset.act, lot = sel.lot;
  if (a === 'visit') { const [pos, tgt] = clearView(sel.L); flyTo(pos, tgt, 2200); }
  else if (a === 'cut') {
    const b = sel.b;
    if (b.cut) C.cutaway.close();
    else {
      C.cutaway.open(b);
      const H = Math.min(36, C.cutaway.heightOf(b)), [pos, tgt] = clearView({ bx: lot.cx, bz: lot.cz, height: H, r: 8, building: b });
      flyTo(pos, tgt, 2000);
    }
    select({ b, lot });
  } else if (a === 'up' || a === 'down') {
    const b = sel.b; C.cutaway.close(); b.floors = C.clamp(b.floors + (a === 'up' ? 1 : -1), 1, LIM[b.type]);
    C.rebuildBuilding(b); select({ b, lot });
  } else if (a === 'demolish') {
    C.cutaway.close(); C.removeBuilding(lot); C.refreshPickables(); select({ b: null, lot });
  } else if (a.startsWith('build:')) {
    const type = a.split(':')[1], spec = C.specFor(lot, C.rng((Math.random() * 1e9) | 0), type);
    if (type === 'tower') spec.floors = 24 + Math.floor(Math.random() * 14);
    C.placeBuilding(lot, spec); C.refreshPickables(); select({ b: spec, lot });
  }
});
let down = null;
el.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; fly = null; });
el.addEventListener('pointerup', e => {
  if (C.player && (C.player.active || C.player.entering)) { down = null; return; }
  if (!down || e.button !== 0) { down = null; return; }
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y), dt = performance.now() - down.t; down = null;
  if (moved > 6 || dt > 500) return;
  ndcOf(e); ray.setFromCamera(ndc, camera);
  const h = ray.intersectObjects(C.pickables, false)[0];
  if (!h) { select(null); return; }
  const b = h.object.userData.building, L = h.object.userData.landmark;
  if (b) select({ b, lot: b.lot });
  else if (L) select({ L, lot: { cx: L.bx, cz: L.bz, w: C.BLOCK - 2, d: C.BLOCK - 2 } });
  else if (h.object.userData.lot) select({ b: null, lot: h.object.userData.lot });
});

/* ---------- hazır görünümler ---------- */
function outwardFaces(b) {
  const lot = b.lot, bt = b.baseTier, x0 = lot.bx - 22, x1 = lot.bx + 22, z0 = lot.bz - 22, z1 = lot.bz + 22, out = [];
  if (lot.cx + bt.w / 2 > x1 - 8) out.push([1, 0, lot.cx + bt.w / 2, lot.cz]);
  if (lot.cx - bt.w / 2 < x0 + 8) out.push([-1, 0, lot.cx - bt.w / 2, lot.cz]);
  if (lot.cz + bt.d / 2 > z1 - 8) out.push([0, 1, lot.cx, lot.cz + bt.d / 2]);
  if (lot.cz - bt.d / 2 < z0 + 8) out.push([0, -1, lot.cx, lot.cz - bt.d / 2]);
  return out;
}
const V = (x, y, z) => new THREE.Vector3(x, y, z);
$('btnOverview').addEventListener('click', () => flyTo(OVER, V(0, 0, 0), 2400));
$('btnCenter').addEventListener('click', () => flyTo(V(130, 95, 170), V(0, 18, 0), 2200));
$('btnClock').addEventListener('click', () => flyTo(V(4, 2.4, 27), V(0, 14, 0), 2600));
$('btnStreet').addEventListener('click', () => {
  const cand = C.buildings.filter(b => b.type !== 'tower' && Math.hypot(b.lot.cx, b.lot.cz) < 220 && outwardFaces(b).length);
  if (!cand.length) return;
  const b = cand[(Math.random() * cand.length) | 0], fs = outwardFaces(b), f = fs[(Math.random() * fs.length) | 0];
  flyTo(V(f[2] + f[0] * 17, 2.3, f[3] + f[1] * 17), V(f[2], 3.2, f[3]), 2600);
});
/* Örümcek Adam'ı izle: kamera arkasından yaklaşır, sonra hedef onu yumuşakça izler */
$('btnHero').addEventListener('click', () => {
  if (follow || !C.hero) { setFollow(false); return; }
  const p = C.hero.pos, off = camera.position.clone().sub(controls.target).setLength(24);
  off.y = Math.max(off.y, 8);
  flyTo(p.clone().add(off), p.clone(), 1600, true); setFollow(true);
});
$('btnPlay').addEventListener('click', () => { if (C.player.active || C.player.entering) C.player.exit(); else { select(null); C.player.enter(); } });
$('btnNew').addEventListener('click', () => { select(null); C.populate((Math.random() * 1e6) | 0); });

/* ---------- gün, trafik, gölge ---------- */
let lastMin = -1;
function setHour(h) {
  C.applyTime(h);
  const m = Math.floor(h * 60); if (m !== lastMin) { lastMin = m; C.drawClock(h); }
  $('hour').value = h.toFixed(2);
  $('hourOut').textContent = String(Math.floor(h)).padStart(2, '0') + ':' + String(Math.floor((h % 1) * 60)).padStart(2, '0');
}
$('hour').addEventListener('input', e => setHour(parseFloat(e.target.value)));
$('playBtn').addEventListener('click', e => { C.playing = !C.playing; e.currentTarget.textContent = C.playing ? 'Durdur' : 'Günü ilerlet'; e.currentTarget.setAttribute('aria-pressed', C.playing); });
$('traffic').addEventListener('input', e => { C.setDensity(parseInt(e.target.value, 10) / 100); $('trafficOut').textContent = e.target.value + '%'; });
const coarse = window.matchMedia('(pointer:coarse)').matches || window.innerWidth < 720;
$('shadowChk').checked = !coarse; sun.castShadow = !coarse;
$('shadowChk').addEventListener('change', e => { sun.castShadow = e.target.checked; });
$('dockToggle').addEventListener('click', () => { const d = $('dock'), c = d.classList.toggle('collapsed'); $('dockToggle').setAttribute('aria-expanded', !c); });
if (window.innerWidth < 720) { $('dock').classList.add('collapsed'); $('dockToggle').setAttribute('aria-expanded', 'false'); }
$('hint').textContent = coarse && window.matchMedia('(pointer:coarse)').matches
  ? 'Sürükle: döndür · İki parmak: yakınlaş ve kaydır · Dokun: bina seç'
  : 'Sürükle: döndür · Sağ tuş veya yön tuşları: kaydır · Tekerlek: imlece yakınlaş · Tıkla: bina seç';

/* ---------- klavye: yön tuşları ve WASD kamerayı baktığı yöne göre kaydırır, Shift hızlandırır ---------- */
const MOVE = { ArrowUp: [0, 1], ArrowDown: [0, -1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], KeyW: [0, 1], KeyS: [0, -1], KeyA: [-1, 0], KeyD: [1, 0] };
const keys = new Set(), kf = new THREE.Vector3(), kr = new THREE.Vector3();
let boost = false;
window.addEventListener('keydown', e => {
  boost = e.shiftKey;
  if (C.player && (C.player.active || C.player.entering)) return;           // oyun modunda tuşlar karakterin
  if (!MOVE[e.code] || e.ctrlKey || e.metaKey || e.altKey || (e.target.closest && e.target.closest('input, textarea, select'))) return;
  keys.add(e.code); fly = null; setFollow(false); e.preventDefault();
});
window.addEventListener('keyup', e => { boost = e.shiftKey; keys.delete(e.code); });
window.addEventListener('blur', () => keys.clear());
function stepKeys(dt, D) {
  if (!keys.size) return;
  let f = 0, r = 0; for (const k of keys) { r += MOVE[k][0]; f += MOVE[k][1]; }
  if (!f && !r) return;
  camera.getWorldDirection(kf); kf.y = 0;
  if (kf.lengthSq() < 1e-4) { kf.set(0, 1, 0).applyQuaternion(camera.quaternion); kf.y = 0; }   // tam tepeden bakarken ekranın üstü
  kf.normalize(); kr.set(-kf.z, 0, kf.x);
  const sp = C.clamp(D * 0.8, 8, 400) * (boost ? 2.5 : 1) * dt / Math.hypot(f, r);
  kf.multiplyScalar(f * sp).addScaledVector(kr, r * sp);
  camera.position.add(kf); controls.target.add(kf); clampTarget();
}

/* ---------- kademe göstergesi ve ölçek çubuğu ---------- */
const LV = [
  ['Şehir', 'Bina kütleleri ve sokak ızgarası'],
  ['Mahalle', 'Pencereler, ağaçlar, lambalar, trafik'],
  ['Sokak', 'Tabelalar, balkonlar, çatı donanımı, yayalar'],
  ['Göz hizası', 'Vitrinler, saat kulesi, her ayrıntı']
];
const levelOf = D => D > 320 ? 0 : D > 130 ? 1 : D > 45 ? 2 : 3;
const steps = Array.from(document.querySelectorAll('#steps span'));
let shownLevel = -1;
const NICE = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
function hud(D, level) {
  if (level !== shownLevel) {
    shownLevel = level;
    steps.forEach((s, i) => { s.classList.toggle('on', i === level); s.classList.toggle('seen', i < level); if (i === level) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current'); });
    $('lodDesc').textContent = LV[level][1];
  }
  $('zoomM').textContent = fmt.format(Math.round(D));
  const mpp = 2 * D * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / (stage.clientHeight || 600);
  let len = NICE[0]; for (const n of NICE) if (n / mpp <= 110) len = n;
  $('scaleBar').style.width = Math.max(6, len / mpp) + 'px'; $('scaleLbl').textContent = len + ' m';
}

/* ---------- ana döngü ---------- */
const sdir = new THREE.Vector3(), fdv = new THREE.Vector3();
let last = performance.now(), frameN = 0, booted = false;
setHour(C.hour);
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (C.player && C.player.active) C.player.camera(dt);                // üçüncü şahıs kamera
  else {
    stepFly(now);
    if (follow && !fly && C.hero) {
      fdv.subVectors(C.hero.pos, controls.target); fdv.y += 1;
      fdv.multiplyScalar(1 - Math.exp(-dt * 5)); controls.target.add(fdv); camera.position.add(fdv);
    }
    stepKeys(dt, camera.position.distanceTo(controls.target));
    controls.update(); clampTarget();
    if (camera.position.y < 1.4) camera.position.y = 1.4;
  }
  const D = camera.position.distanceTo(controls.target), level = levelOf(D);
  const near = C.clamp(0.4 + 0.012 * D, C.player && C.player.active ? 0.08 : 0.4, 7);   // oyunda yakın çekimde baş kesilmesin
  if (Math.abs(near - camera.near) > 0.05) { camera.near = near; camera.updateProjectionMatrix(); }
  if (C.playing) setHour((C.hour + dt * C.dayRate) % 24);
  const on1 = level >= 1, on2 = level >= 2;
  C.markings.visible = on1;
  for (const m of C.streetLayers) m.visible = on1;
  for (const m of C.carLayers) m.visible = on1;
  for (const m of C.signalLayers) m.visible = on1;
  for (const m of C.peopleLayers) m.visible = on2;
  /* gölge kamerası hedefi izler */
  sun.target.position.copy(controls.target);
  sdir.copy(C.sunDir); sdir.y = Math.max(sdir.y, 0.12); sdir.normalize();
  sun.position.copy(controls.target).addScaledVector(sdir, 500);
  const s = C.clamp(D * 1.1, 70, 330), sc = sun.shadow.camera;
  if (Math.abs(sc.right - s) > 1) { sc.left = -s; sc.right = s; sc.top = s; sc.bottom = -s; sc.updateProjectionMatrix(); }
  for (const f of C.updaters) f(dt, now / 1000, D);
  C.updateBuildingsLOD(camera.position);
  C.updateTraffic(dt);                 // şehir kademesinde de akar: acil durum araçları olay yerine gitmeye devam eder
  if (on2) C.updatePeople(dt);
  renderer.render(scene, camera);
  if (++frameN % 6 === 0 || frameN < 3) hud(D, level);
  if (!booted) { booted = true; $('boot').hidden = true; }
}
requestAnimationFrame(loop);
})();
