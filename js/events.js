/* ===== events.js: rastgele olaylar (yangın, kaza, hırsızlık), acil durum araçları, olay akışı ===== */
(function () {
'use strict';
if (!window.C || C.failed) return;
const scene = C.scene, B = C.SW, R = C.roads;
const boxG = new THREE.BoxGeometry(1, 1, 1);
const std = (hex, r, m) => new THREE.MeshStandardMaterial({ color: C.col(hex), roughness: r === undefined ? 0.6 : r, metalness: m || 0 });
const pick = a => a[(Math.random() * a.length) | 0];
const pad = n => String(n).padStart(2, '0');
const clock = () => pad(Math.floor(C.hour)) + ':' + pad(Math.floor((C.hour % 1) * 60));

/* ---------- sokak adları: x yönündeki yollar cadde, z yönündekiler sokak ---------- */
const CADDE = ['Çankırı', 'Anafartalar', 'Talatpaşa', 'Necatibey', 'Mithatpaşa', 'Sakarya', 'Meşrutiyet', 'İzmir', 'Ziya Gökalp', 'Kumrular', 'Konur', 'Bestekar', 'Tunalı Hilmi', 'Kennedy', 'Cinnah', 'Hoşdere', 'Turan Güneş', 'Eskişehir'];   // Ankara caddeleri; ortadaki Ziya Gökalp
const SOKAK = ['Lale', 'Gül', 'Menekşe', 'Papatya', 'Nergis', 'Sümbül', 'Karanfil', 'Leylak', 'Yasemin', 'Zambak', 'Erguvan', 'Manolya', 'Begonya', 'Mimoza', 'Kardelen', 'Ortanca', 'Gelincik', 'Akasya'];
const roadIdx = v => C.clamp(Math.round((v - C.roadX(0)) / C.PITCH), 0, C.N);
C.placeName = (x, z) => `${CADDE[roadIdx(z)]} Cd. × ${SOKAK[roadIdx(x)]} Sk., ${C.districtAt(x, z).name}`;

/* ---------- bloğun bir yüzüne bitişik, kaldırım tarafı bloğa bakan şerit ---------- */
const blockIdx = v => Math.round((v - C.blockC(0)) / C.PITCH);
function curbEdge(bi, bj, side) {
  const n = R.nodeId;
  const ab = side === 'pz' ? [n(bi + 1, bj + 1), n(bi, bj + 1)] : side === 'nz' ? [n(bi, bj), n(bi + 1, bj)]
    : side === 'px' ? [n(bi + 1, bj), n(bi + 1, bj + 1)] : [n(bi, bj + 1), n(bi, bj)];
  return R.edgeAt.get(ab[0] * 4096 + ab[1]);
}
const along = (e, x, z) => C.clamp((x - e.ox) * e.dx + (z - e.oz) * e.dz, 4, e.len - 3);
function sideOf(lot) {
  const ox = lot.cx - lot.bx, oz = lot.cz - lot.bz;
  return Math.abs(ox) > Math.abs(oz) ? (ox > 0 ? 'px' : 'nx') : (oz > 0 ? 'pz' : 'nz');
}
const SIDE_N = { px: [1, 0], nx: [-1, 0], pz: [0, 1], nz: [0, -1] };
/* yol koridorundan bakış: bloğun o yüzündeki yolun ortasında, yol boyunca 'back' metre geride */
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
function streetView(bx, bz, side, tx, ty, tz, back, up) {
  const [nx, nz] = SIDE_N[side], rx = bx + nx * C.PITCH / 2, rz = bz + nz * C.PITCH / 2;
  const px = nx ? rx : tx + back, pz = nz ? rz : tz + back;
  return [V3(px, ty + up, pz), V3(tx, ty, tz)];
}

/* ---------- acil durum araçları ---------- */
const sirenR = new THREE.MeshBasicMaterial({ color: 0xffffff }), sirenB = new THREE.MeshBasicMaterial({ color: 0xffffff });
const R_ON = C.col('#ff2a2a'), R_OFF = C.col('#4a1010'), B_ON = C.col('#2f7bff'), B_OFF = C.col('#10204a');
C.updaters.push((dt, t) => { const p = Math.floor(t * 6) % 2 === 0; sirenR.color.copy(p ? R_ON : R_OFF); sirenB.color.copy(p ? B_OFF : B_ON); });
const M = {
  red: std('#c62828', 0.45, 0.2), white: std('#f2f2ee', 0.45, 0.2), dark: std('#15181b', 0.8), glass: std('#1c2630', 0.15, 0.4),
  grey: std('#a7adb3', 0.5, 0.6), blue: std('#1f4e8c', 0.5), stripe: std('#d32f2f', 0.5), yellow: std('#f2c230', 0.5)
};
/* yuvarlak kenarlı parça (geometri ölçüye göre önbellekte, araç başına yeni geometri yok) */
function part(g, mat, sx, sy, sz, x, y, z) { const m = new THREE.Mesh(C.roundBox(sx, sy, sz, Math.min(0.3, Math.min(sx, sy, sz) * 0.22)), mat); m.position.set(x, y, z); m.castShadow = true; g.add(m); return m; }
const MODELS = {
  fire(g) {
    part(g, M.dark, 7.4, 0.7, 2.2, 0, 0.45, 0);
    part(g, M.red, 2.2, 2.4, 2.4, 2.9, 1.8, 0);
    part(g, M.red, 5.6, 2.1, 2.4, -0.9, 1.65, 0);
    part(g, M.glass, 0.1, 0.9, 2.0, 4.0, 2.35, 0);
    part(g, M.white, 8.05, 0.22, 2.45, 0, 1.15, 0);
    for (const z of [-0.5, 0.5]) part(g, M.grey, 6, 0.14, 0.14, -0.7, 2.85, z);
    for (let k = 0; k < 7; k++) part(g, M.grey, 0.08, 0.1, 1.0, -3.4 + k * 0.9, 2.85, 0);
    part(g, sirenR, 0.4, 0.22, 0.6, 3.0, 3.1, -0.45); part(g, sirenB, 0.4, 0.22, 0.6, 3.0, 3.1, 0.45);
    return 8;
  },
  hospital(g) {
    part(g, M.dark, 5.0, 0.5, 1.9, 0, 0.4, 0);
    part(g, M.white, 3.8, 2.4, 2.1, -0.6, 1.85, 0);
    part(g, M.white, 1.6, 1.6, 2.0, 2.0, 1.35, 0);
    part(g, M.glass, 0.1, 0.7, 1.8, 2.82, 1.75, 0);
    part(g, M.stripe, 5.45, 0.28, 2.15, 0.1, 1.25, 0);
    part(g, M.yellow, 3.85, 0.2, 2.15, -0.6, 2.4, 0);
    part(g, sirenR, 0.35, 0.2, 0.5, 1.1, 3.15, -0.45); part(g, sirenB, 0.35, 0.2, 0.5, 1.1, 3.15, 0.45);
    return 5.6;
  },
  police(g) {
    part(g, M.white, 4.4, 0.8, 1.8, 0, 0.75, 0);
    part(g, M.blue, 4.42, 0.22, 1.82, 0, 0.82, 0);
    part(g, M.glass, 2.2, 0.7, 1.6, -0.25, 1.5, 0);
    part(g, M.dark, 4.0, 0.35, 1.7, 0, 0.32, 0);
    part(g, sirenR, 0.3, 0.18, 0.55, -0.1, 1.95, -0.32); part(g, sirenB, 0.3, 0.18, 0.55, -0.1, 1.95, 0.32);
    return 4.6;
  }
};
const vehRoot = new THREE.Group(); scene.add(vehRoot); C.carLayers.push(vehRoot);
const HOME = {};
function homeOf(type) {
  if (HOME[type]) return HOME[type];
  const L = C.landmarks.find(l => l.type === type); if (!L) return null;
  const e = curbEdge(blockIdx(L.bx), blockIdx(L.bz), 'pz');
  return (HOME[type] = { e, s: along(e, L.bx, L.bz), name: L.name });
}
const vehicles = [], vp = { x: 0, z: 0, hx: 1, hz: 0 };
function dispatch(type, e, s, ev) {
  const home = homeOf(type); if (!home) return null;
  const g = new THREE.Group(); vehRoot.add(g);
  const v = { special: true, siren: true, type, group: g, len: MODELS[type](g), v0: 16, home, ev, state: 'out', t: 0, still: 0 };
  v.model = (x, z, ry) => { g.position.set(x, 0, z); g.rotation.y = ry; };
  C.spawnCar(v, home.e, home.s);
  C.setRoute(v, e, s);
  vehicles.push(v); return v;
}
function sendHome(v) {
  if (v.state === 'back' || v.state === 'gone') return;
  if (v.parked) C.unparkCar(v);
  v.state = 'back'; v.t = 0; v.still = 0; v.siren = false;
  C.setRoute(v, v.home.e, v.home.s);
}
function parkPose(v) {
  const e = v.e, rx = -e.dz, rz = e.dx;
  v.group.position.set(e.ox + e.dx * v.s + rx * 2.0, 0, e.oz + e.dz * v.s + rz * 2.0);
  v.group.rotation.y = Math.atan2(-e.dz, e.dx);
}
function updateVehicles(dt) {
  for (let i = vehicles.length - 1; i >= 0; i--) {
    const v = vehicles[i];
    if (v.state !== 'out' && v.state !== 'back') continue;
    v.t += dt;
    const onGoal = v.e === v.stopEdge && v.s > -0.1;
    v.still = onGoal && v.v < 0.15 ? v.still + dt : 0;
    v.stuck = v.v < 0.15 ? (v.stuck || 0) + dt : 0;
    /* yedek kural: olay yerine yakın ama kuyrukta kalmışsa olduğu yerde durur */
    let close = false;
    if (v.state === 'out' && v.stuck > 4 && v.s >= 0) { C.carPos(v, vp); close = Math.hypot(vp.x - v.ev.x, vp.z - v.ev.z) < 45; }
    if (!(onGoal && (v.stopS - v.s < 2.5 || v.still > 2)) && !close && v.t < 150) continue;
    if (v.state === 'out') { C.parkCar(v); parkPose(v); v.state = 'scene'; v.ev.arrive(v); }
    else { C.despawnCar(v); vehRoot.remove(v.group); v.state = 'gone'; vehicles.splice(i, 1); }
  }
}

/* ---------- parçacıklar: duman, alev, su (dünya boyutunda noktalar, kişi başına saydamlık) ---------- */
function softTex() {
  const cv = document.createElement('canvas'); cv.width = cv.height = 64;
  const x = cv.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.45, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(cv);
}
const soft = softTex(), emitters = [];
function emitter(cap, hex, additive, gravity, drag) {
  const pos = new Float32Array(cap * 3), vel = new Float32Array(cap * 3), size = new Float32Array(cap), alpha = new Float32Array(cap);
  const life = new Float32Array(cap), max = new Float32Array(cap), s0 = new Float32Array(cap), s1 = new Float32Array(cap), a0 = new Float32Array(cap);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  g.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: { map: { value: soft }, color: { value: new THREE.Color(hex) }, scale: { value: 800 } },
    vertexShader: 'attribute float aSize; attribute float aAlpha; varying float vA; uniform float scale;' +
      'void main(){ vA = aAlpha; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = aSize * scale / -mv.z; gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'uniform sampler2D map; uniform vec3 color; varying float vA;' +
      'void main(){ vec4 t = texture2D(map, gl_PointCoord); float a = t.a * vA; if (a < 0.01) discard; gl_FragColor = vec4(color, a); }',
    transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending
  });
  const pts = new THREE.Points(g, mat); pts.frustumCulled = false; pts.renderOrder = 5; scene.add(pts);
  let next = 0, alive = 0;
  const E = {
    mat,
    emit(x, y, z, vx, vy, vz, t, sa, sb, al) {
      const i = next; next = (next + 1) % cap;
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z; vel[i * 3] = vx; vel[i * 3 + 1] = vy; vel[i * 3 + 2] = vz;
      life[i] = max[i] = t; s0[i] = sa; s1[i] = sb; a0[i] = al; alive = cap;
    },
    update(dt) {
      if (!alive) return;
      let n = 0; const k = Math.pow(drag, dt);
      for (let i = 0; i < cap; i++) {
        if (life[i] <= 0) { alpha[i] = 0; size[i] = 0; continue; }
        n++; life[i] -= dt; const u = 1 - life[i] / max[i];
        vel[i * 3] *= k; vel[i * 3 + 2] *= k; vel[i * 3 + 1] = vel[i * 3 + 1] * k + gravity * dt;
        pos[i * 3] += vel[i * 3] * dt; pos[i * 3 + 1] += vel[i * 3 + 1] * dt; pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
        size[i] = s0[i] + (s1[i] - s0[i]) * u; alpha[i] = a0[i] * Math.min(1, u * 6) * (1 - u);
      }
      alive = n;
      g.attributes.position.needsUpdate = g.attributes.aSize.needsUpdate = g.attributes.aAlpha.needsUpdate = true;
    }
  };
  emitters.push(E); return E;
}
const smoke = emitter(700, '#3f4246', false, 0.6, 0.7), flame = emitter(500, '#ff6a14', true, 2.5, 0.5), water = emitter(320, '#e4f2ff', false, -9.8, 0.98);
/* yangın ışığı: ışık sayısı değişince tüm malzemeler yeniden derlenir, bu yüzden ikisi baştan hazır */
const fireLights = [0, 1].map(() => { const l = new THREE.PointLight(0xff8a3a, 0, 55, 2); scene.add(l); return { l, ev: null }; });

/* ---------- hırsız modeli ---------- */
const thiefRoot = new THREE.Group(); scene.add(thiefRoot); C.peopleLayers.push(thiefRoot);
function makeThief() {
  const g = new THREE.Group(), body = std('#22262b', 0.9), skin = std('#d9a37c', 0.9), bag = std('#8a5a2b', 0.9);
  const limb = (mat, w, h, x, y) => { const p = new THREE.Group(); p.position.set(x, y, 0); part(p, mat, w, h, w, 0, -h / 2, 0); g.add(p); return p; };
  part(g, body, 0.26, 0.62, 0.44, 0, 1.2, 0); part(g, skin, 0.24, 0.24, 0.24, 0, 1.65, 0); part(g, body, 0.27, 0.12, 0.27, 0, 1.8, 0);
  part(g, bag, 0.2, 0.36, 0.34, -0.24, 1.22, 0);           // sırt çantası (yüz +x yönünde)
  const legs = [limb(body, 0.16, 0.85, 0, 0.88), limb(body, 0.16, 0.85, 0, 0.88)];
  legs[0].position.z = 0.11; legs[1].position.z = -0.11;
  const arms = [limb(body, 0.12, 0.6, 0, 1.48), limb(body, 0.12, 0.6, 0, 1.48)];
  arms[0].position.z = 0.29; arms[1].position.z = -0.29;
  thiefRoot.add(g); return { g, legs, arms };
}

/* ---------- olaylar ---------- */
const active = [], log = [];
C.activeEvents = active; C.eventLog = log;                    // son olaylar (telefondaki haber uygulaması da okur)
C.cityStats = { fire: 0, accident: 0, crime: 0, pedestrian: 0, hero: 0 };   // bugüne kadar kaç olay oldu                                      // sürmekte olan olaylar (deneme ve dış kullanım için)
let nextId = 1;
const near = (x, z) => { const t = C.controls ? C.controls.target : { x: 0, z: 0 }; return Math.hypot(x - t.x, z - t.z); };
const prefer = list => { const close = list.filter(o => near(o.x, o.z) < 260); return pick(close.length && Math.random() < 0.7 ? close : list); };
function addEvent(ev) {
  C.cityStats[ev.type] = (C.cityStats[ev.type] || 0) + 1;
  ev.id = nextId++; ev.time = clock(); ev.hour = C.hour; ev.done = false; ev.age = 0; active.push(ev); log.unshift(ev);
  if (log.length > 6) log.length = 6;
  renderFeed(ev.id);
}
function setStatus(ev, text, done) { ev.status = text; if (done && !ev.done) { ev.done = true; ev.doneAge = ev.age; ev.doneHour = C.hour; } renderFeed(); }   // doneHour: telefondaki mesajlar
const cocoonMat = new THREE.MeshStandardMaterial({ color: 0xf4f4f0, roughness: 0.9, transparent: true, opacity: 0.8 });

function startFire() {
  const list = C.buildings.filter(b => !b.onFire && b.type !== 'house').map(b => ({ b, x: b.lot.cx, z: b.lot.cz }));
  if (!list.length) return false;
  const { b } = prefer(list), lot = b.lot, side = sideOf(lot), [nx, nz] = SIDE_N[side], bt = b.baseTier;
  const fx = lot.cx + nx * bt.w / 2, fz = lot.cz + nz * bt.d / 2, flen = nx ? bt.d : bt.w;
  const spots = [];
  const top = Math.max(2, bt.f - 1 - Math.floor(Math.random() * Math.min(6, bt.f / 3)));
  for (let k = 0; k < 3; k++) {
    const fl = C.clamp(top - k + (Math.random() < 0.5 ? 0 : 1), 1, bt.f - 1), off = (Math.random() - 0.5) * (flen - 4);
    spots.push([fx + nx * 0.4 + nz * off, B + fl * C.FLOOR_H + 1.2, fz + nz * 0.4 + nx * off]);
  }
  const roofY = B + bt.f * C.FLOOR_H;
  const e = curbEdge(blockIdx(lot.bx), blockIdx(lot.bz), side), s = along(e, lot.cx, lot.cz);
  b.onFire = true;
  const ev = {
    type: 'fire', title: 'Yangın', x: lot.cx, z: lot.cz, h: b.height, b, place: C.placeName(lot.cx, lot.cz), status: 'İtfaiye yolda',
    I: 0.45, smokeLeft: 1, spots, roof: [fx - nx * 3, roofY, fz - nz * 3], acc: [0, 0, 0],
    view: () => streetView(lot.bx, lot.bz, side, spots[0][0], spots[0][1] * 0.6, spots[0][2], 40, 12),
    arrive(v) { if (v === this.truck) setStatus(this, 'Söndürülüyor'); }
  };
  addEvent(ev);
  ev.truck = dispatch('fire', e, s, ev);
  ev.amb = dispatch('hospital', e, Math.max(3, s - 11), ev);
  const fl = fireLights.find(f => !f.ev) || fireLights[0]; fl.ev = ev; ev.light = fl;
  return true;
}
function updateFire(ev, dt, t) {
  const tr = ev.truck, spraying = tr && tr.state === 'scene' && ev.I > 0;
  if (ev.I > 0) {
    ev.I = spraying ? ev.I - dt / 16 : Math.min(1, ev.I + dt / 45);
    if (ev.I <= 0) { ev.I = 0; ev.outAt = ev.age; setStatus(ev, 'Söndürüldü ✓', true); }
  } else ev.smokeLeft = Math.max(0, ev.smokeLeft - dt / 14);
  if (ev.outAt !== undefined && ev.age - ev.outAt > 5) { if (ev.truck) sendHome(ev.truck); if (ev.amb) sendHome(ev.amb); }
  /* alevler pencerelerden, duman çatıdan ve pencerelerden */
  ev.acc[0] += dt * 45 * ev.I;
  while (ev.acc[0] > 1) {
    ev.acc[0]--; const p = pick(ev.spots);
    flame.emit(p[0] + (Math.random() - 0.5) * 1.6, p[1] + (Math.random() - 0.5) * 1.2, p[2] + (Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 0.6, 1.4 + Math.random(), (Math.random() - 0.5) * 0.6, 0.6 + Math.random() * 0.4, 2.2 + ev.I * 1.6, 0.5, 1);
  }
  ev.acc[1] += dt * (6 + 14 * ev.I) * (ev.I > 0 ? 1 : ev.smokeLeft);
  while (ev.acc[1] > 1) {
    ev.acc[1]--; const p = Math.random() < 0.5 ? ev.roof : pick(ev.spots);
    smoke.emit(p[0] + (Math.random() - 0.5) * 3, p[1] + 1, p[2] + (Math.random() - 0.5) * 3, 0.9 + Math.random() * 0.6, 2.5 + Math.random() * 1.5, (Math.random() - 0.5) * 0.8, 6 + Math.random() * 3, 3, 12 + ev.I * 6, 0.7 + 0.25 * ev.I);
  }
  /* su: merdiven ucundan en yakın aleve balistik yay */
  if (spraying) {
    ev.acc[2] += dt * 60;
    const gp = tr.group.position, sx = gp.x, sy = 3.3, sz = gp.z, T = 1.1;
    const p = ev.spots[0];
    while (ev.acc[2] > 1) {
      ev.acc[2]--;
      const tx = p[0] + (Math.random() - 0.5) * 2, ty = p[1] + (Math.random() - 0.5), tz = p[2] + (Math.random() - 0.5) * 2;
      water.emit(sx, sy, sz, (tx - sx) / T, (ty - sy) / T + 4.9 * T, (tz - sz) / T, T, 0.5, 1.5, 0.9);
    }
  }
  if (ev.light) {
    const l = ev.light.l; l.position.set(ev.spots[0][0], ev.spots[0][1], ev.spots[0][2]);
    l.intensity = ev.I * (2.2 + Math.sin(t * 17) * 0.4 + Math.sin(t * 7.3) * 0.3);
    if (ev.I <= 0) { l.intensity = 0; ev.light.ev = null; ev.light = null; }
  }
  const over = ev.I <= 0 && ev.smokeLeft <= 0 && (!ev.truck || ev.truck.state === 'gone' || ev.truck.state === 'back');
  if (over) ev.b.onFire = false;
  return over;
}

/* kaza: aynı şeritte iki araç çarpışır, yol kapanır, ambulans ve polis gelir */
const hazMat = new THREE.MeshBasicMaterial({ color: C.col('#ffa21f') });
C.updaters.push((dt, t) => { hazMat.color.copy(C.col(Math.floor(t * 3) % 2 ? '#ffa21f' : '#3a2408')); });
function startAccident() {
  const list = [];
  for (const e of R.edges) {
    const c = e.cars.filter(o => !o.special && !o.crashed).sort((p, q) => q.s - p.s);
    for (let k = 0; k + 1 < c.length; k++) if (c[k].s > 14 && c[k].s < e.len - 4 && c[k].v > 3) {
      const x = e.ox + e.dx * c[k].s, z = e.oz + e.dz * c[k].s; list.push({ e, a: c[k], b: c[k + 1], x, z });
    }
  }
  if (!list.length) return false;
  const { e, a, b, x, z } = prefer(list);
  b.s = a.s - (a.len + b.len) / 2 - 0.25;
  for (const [c, yaw] of [[a, 0.32], [b, -0.22]]) { c.crashed = true; c.v = 0; c.yaw = yaw; }
  C.blockEdge(e, true);
  const haz = new THREE.Group(); scene.add(haz); C.carLayers.push(haz);
  for (let k = 0; k < 4; k++) part(haz, hazMat, 0.18, 0.14, 0.18, 0, 0, 0).castShadow = false;
  const ev = {
    type: 'accident', title: 'Trafik kazası', x, z, h: 6, place: C.placeName(x, z), status: 'Ambulans ve polis yolda', cars: [a, b], haz, onScene: 0, edge: e,
    view: () => [V3(x - e.dx * 26 - e.dz * 3, 11, z - e.dz * 26 + e.dx * 3), V3(x, 1, z)],
    arrive() { if (this.amb.state === 'scene' && this.pol.state === 'scene') setStatus(this, 'Ekipler olay yerinde'); }
  };
  addEvent(ev);
  const st = Math.max(3, b.s - 9);
  ev.amb = dispatch('hospital', e, st, ev);
  ev.pol = dispatch('police', e, Math.max(2, st - 7), ev);
  return true;
}
const hp = { x: 0, z: 0, hx: 1, hz: 0 };
function updateAccident(ev, dt) {
  if (!ev.done) {
    ev.haz.children.forEach((m, k) => {
      const c = ev.cars[k >> 1]; C.carPos(c, hp);
      const ry = Math.atan2(-hp.hz, hp.hx) + c.yaw, fx = Math.cos(ry), fz = -Math.sin(ry), sgn = k % 2 ? 1 : -1;
      m.position.set(hp.x + fx * 2.2 * sgn - fz * 0.7, 0.85, hp.z + fz * 2.2 * sgn + fx * 0.7);
    });
    const both = [ev.amb, ev.pol].filter(v => v && v.state === 'scene').length;
    if (both === 2 || (both && ev.age > 90)) ev.onScene += dt;
    if (ev.onScene > 12 || ev.age > 200) {
      for (const c of ev.cars) { c.crashed = false; c.yaw = 0; }
      C.blockEdge(ev.edge, false);
      scene.remove(ev.haz); C.carLayers.splice(C.carLayers.indexOf(ev.haz), 1);
      setStatus(ev, 'Yol açıldı ✓', true);
      if (ev.amb) sendHome(ev.amb); if (ev.pol) sendHome(ev.pol);
    }
  }
  return ev.done;
}

/* hırsızlık: dükkândan çıkan şüpheli kaldırımda kaçar, polis gelince yakalanır */
function startCrime() {
  const list = C.blocks.filter(b => b.kind === 'city' && !b.crime).map(b => ({ blk: b, x: b.bx, z: b.bz }));
  if (!list.length) return false;
  const { blk } = prefer(list), th = makeThief();
  Object.assign(th, { f: Math.random(), dir: Math.random() < 0.5 ? 1 : -1, sp: 4.2, ph: 0, caught: 0 });
  blk.crime = true;
  const side = pick(['px', 'nx', 'pz', 'nz']), e = curbEdge(blk.i, blk.j, side);
  const ev = {
    type: 'crime', title: 'Hırsızlık', x: blk.bx, z: blk.bz, h: 20, blk, th, place: C.placeName(blk.bx + SIDE_N[side][0] * 22, blk.bz + SIDE_N[side][1] * 22), status: 'Polis yolda',
    arrive() {
      if (this.th.caught) { setStatus(this, 'Polis teslim aldı ✓', true); return; }
      this.th.caught = 0.001; setStatus(this, 'Şüpheli yakalandı ✓', true);
    },
    /* kahraman kancaları (hero.js) */
    heroComing() { setStatus(this, 'Polis ve Pijamalı Çocuk yolda'); },
    heroCatch() {
      if (this.th.caught) return;
      this.th.caught = 0.001; this.th.webbed = true; C.cityStats.hero++; part(this.th.g, cocoonMat, 0.62, 1.55, 0.66, 0, 0.95, 0);
      setStatus(this, this.pol && this.pol.state === 'scene' ? 'Polis teslim aldı ✓' : 'Pijamalı Çocuk yakaladı 🕸', this.pol && this.pol.state === 'scene');
    },
    view() {
      const p = th.g.position, ox = p.x - blk.bx, oz = p.z - blk.bz;
      const sd = Math.abs(ox) > Math.abs(oz) ? (ox > 0 ? 'px' : 'nx') : (oz > 0 ? 'pz' : 'nz');
      return streetView(blk.bx, blk.bz, sd, p.x, 1.2, p.z, 24, 9);
    }
  };
  addEvent(ev);
  ev.pol = dispatch('police', e, along(e, blk.bx, blk.bz), ev);
  if (C.hero) C.hero.alert(ev);
  return true;
}
function updateCrime(ev, dt) {
  const th = ev.th, h = 20.5;
  if (!th.caught) {
    th.f = (th.f + th.dir * th.sp * dt / (8 * h) + 1) % 1; if (th.sp) th.ph += dt * 13;   // sp 0: kahramanı görüp donakaldı
  } else th.caught += dt;
  const side = Math.floor(th.f * 4), u = (th.f * 4) % 1;
  let x, z, ry;
  if (side === 0) { x = -h + 2 * h * u; z = -h; ry = 0; } else if (side === 1) { x = h; z = -h + 2 * h * u; ry = -Math.PI / 2; }
  else if (side === 2) { x = h - 2 * h * u; z = h; ry = Math.PI; } else { x = -h; z = h - 2 * h * u; ry = Math.PI / 2; }
  if (th.dir < 0) ry += Math.PI;
  th.g.position.set(ev.blk.bx + x, B + Math.abs(Math.sin(th.ph)) * 0.08, ev.blk.bz + z); th.g.rotation.y = ry;
  const sw = th.caught || !th.sp ? 0 : Math.sin(th.ph) * 0.9;
  th.legs[0].rotation.z = sw; th.legs[1].rotation.z = -sw;
  const up = th.caught && !th.webbed;                                    // polise yakalanınca eller yukarı, ağa sarılınca yanda
  th.arms[0].rotation.z = up ? Math.PI : -sw; th.arms[1].rotation.z = up ? Math.PI : sw;
  if (th.caught > 3 && ev.done && ev.age - ev.doneAge > 4) { thiefRoot.remove(th.g); ev.blk.crime = false; if (ev.pol) sendHome(ev.pol); return true; }
  if (!th.caught && ev.age > 150) ev.arrive();
  return false;
}

/* yaya kazası: araç yayaya çarpar; yaralı yolda yatar, araç durur, meraklılar toplanır, ambulans ve polis gelir.
   Oyuncuya çarpan araç da bunu başlatır (C.pedestrianHit); o zaman yaralı oyuncunun kendisidir. */
const vict = new C.Crowd(16), vpose = {}, vFree = [];
for (let k = 15; k >= 0; k--) vFree.push(k);
scene.add(vict.group);
function curbOf(e, x, z) {                                   // şeridin sağındaki kaldırım
  const lat = e.axis === 'x' ? z : x, rc = C.roadX(Math.round((lat - C.roadX(0)) / C.PITCH)), side = Math.sign(lat - rc) || 1;
  return rc + side * (C.ROAD / 2 + 1.1);
}
function startPedestrian(hitCar, hx, hz) {
  let car = hitCar, x = hx, z = hz, e;
  if (car) e = car.e;
  else {
    const list = [];
    for (const ed of R.edges) for (const c of ed.cars) if (!c.special && !c.crashed && c.v > 4 && c.s > 14 && c.s < ed.len - 8) list.push({ e: ed, c, x: ed.ox + ed.dx * c.s, z: ed.oz + ed.dz * c.s });
    if (!list.length) return false;
    const q = prefer(list); car = q.c; e = q.e;
    const a = car.s + car.len / 2 + 0.9; x = e.ox + e.dx * a - e.dz * 0.4; z = e.oz + e.dz * a + e.dx * 0.4;
  }
  if (active.length >= 4 || !e) return false;
  car.crashed = true; car.v = 0; car.yaw = 0.07;
  C.blockEdge(e, true);
  const ev = {
    type: 'pedestrian', title: 'Yaya kazası', x, z, h: 4, place: C.placeName(x, z), status: 'Ambulans ve polis yolda', car, edge: e, onScene: 0, player: !!hitCar, slots: [],
    ry: Math.atan2(e.dz, -e.dx) + 0.5,                          // yatan: ayak araca dönük, baş ileride
    view: () => [V3(x - e.dx * 18 - e.dz * 6, 8, z - e.dz * 18 + e.dx * 6), V3(x, 0.6, z)],
    arrive() { if (this.amb && this.amb.state === 'scene' && this.pol && this.pol.state === 'scene') setStatus(this, 'Ekipler olay yerinde'); }
  };
  /* yaralı (oyuncu değilse) ve kaldırımdan bakan iki kişi */
  const cb = curbOf(e, x, z);
  const spots = [];
  if (!hitCar) spots.push({ x, z, ry: ev.ry, pose: 'lie' });
  for (const o of [-1.6, 1.4]) {
    const sx = e.axis === 'x' ? x + o : cb, sz = e.axis === 'x' ? cb : z + o;
    spots.push({ x: sx, z: sz, ry: Math.atan2(-(z - sz), x - sx), pose: o < 0 ? 'handsup' : 'talk', walk: 0 });
  }
  for (const s of spots) { if (!vFree.length) break; s.k = vFree.pop(); vict.look(s.k, C.randomLook()); ev.slots.push(s); }
  addEvent(ev);
  const st = Math.max(3, car.s - 9);
  ev.amb = dispatch('hospital', e, st, ev);
  ev.pol = dispatch('police', e, Math.max(2, st - 7), ev);
  return true;
}
C.pedestrianHit = (car, x, z) => startPedestrian(car, x, z);
function updatePedestrian(ev, dt) {
  if (!ev.done) {
    const both = [ev.amb, ev.pol].filter(v => v && v.state === 'scene').length;
    if (both === 2 || (both && ev.age > 90)) ev.onScene += dt;
    if (ev.onScene > 6 && !ev.taken) {                         // sedyeyle ambulansa
      ev.taken = true; const v = ev.slots.find(s => s.pose === 'lie'); if (v) v.gone = true;
      setStatus(ev, ev.player ? 'Yaralı kendi kalktı, ifade alınıyor' : 'Yaralı ambulansa alındı');
    }
    if (ev.onScene > 14 || ev.age > 200) {
      ev.car.crashed = false; ev.car.yaw = 0;
      C.blockEdge(ev.edge, false);
      for (const s of ev.slots) vFree.push(s.k); ev.slots.length = 0;
      setStatus(ev, 'Yol açıldı ✓', true);
      if (ev.amb) sendHome(ev.amb); if (ev.pol) sendHome(ev.pol);
    }
  }
  return ev.done;
}
C.updaters.push((dt, t, D) => {
  vict.group.visible = D <= 130;
  if (!vict.group.visible) return;
  vict.begin();
  for (const ev of active) if (ev.type === 'pedestrian') for (const s of ev.slots) if (!s.gone) vict.put(s.k, s.x, s.pose === 'lie' ? 0.02 : C.SW, s.z, s.ry, C.pose(s.pose, t + s.k, vpose));
  vict.end();
});

const START = { fire: startFire, accident: startAccident, crime: startCrime, pedestrian: () => startPedestrian() };
const UPDATE = { fire: updateFire, accident: updateAccident, crime: updateCrime, pedestrian: updatePedestrian };
C.startEvent = function (type) {
  if (active.length >= 4) return false;
  if (!type) { const r = Math.random(); type = r < 0.3 ? 'fire' : r < 0.6 ? 'accident' : r < 0.8 ? 'crime' : 'pedestrian'; }
  return START[type]() || START[pick(['fire', 'accident', 'crime', 'pedestrian'])]();
};
C.eventsOn = true;
/* rastgele olaylar seyrek: ilk olay açılıştan 1-2 dakika sonra, sonra 4-8 dakikada bir (gece 1,5 kat seyrek). Şehirde süren bir olay
   varken yenisi çıkmaz ve sayaç durur: iki olay arasında hep bu kadar boşluk kalır. Tür saate göre: sabah ve akşam yoğunluğunda kaza, gece hırsızlık
   daha olası (C.trafficLevel'ın anahtarı). "Olay çıkar" düğmesi bunlardan bağımsız, hemen çıkarır */
const tkey = () => C.trafficLevel ? C.trafficLevel().key : 'day';
const nextGap = () => (240 + Math.random() * 240) * (tkey() === 'night' ? 1.5 : 1);
function randomType() {
  const k = tkey(), rush = k === 'morning' || k === 'evening', night = k === 'night';
  const W = C.weather && C.weather.cur, wet = W ? Math.min(1, W.rain + W.snow) : 0;   // ıslak ya da karlı yolda kaza biraz daha olası (varsayım)
  const w = { fire: 0.3 - wet * 0.1, accident: (rush ? 0.5 : 0.3) + wet * 0.25, crime: night ? 0.45 : 0.2, pedestrian: rush ? 0.25 : night ? 0.08 : 0.2 };
  let r = Math.random() * (w.fire + w.accident + w.crime + w.pedestrian);
  for (const t in w) if ((r -= w[t]) < 0) return t;
  return 'fire';
}
let timer = 60 + Math.random() * 60;
C.updaters.push((dt, t) => {
  const cam = C.camera, h = C.renderer.domElement.height, sc = h / (2 * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)));
  for (const E of emitters) E.mat.uniforms.scale.value = sc;
  if (C.eventsOn && !active.length && (timer -= dt) <= 0) { timer = nextGap(); C.startEvent(randomType()); }
  updateVehicles(dt);
  for (let i = active.length - 1; i >= 0; i--) {
    const ev = active[i]; ev.age += dt;
    if (UPDATE[ev.type](ev, dt, t)) active.splice(i, 1);
  }
  for (const E of emitters) E.update(dt);
});

/* ---------- olay akışı paneli ---------- */
const feed = document.getElementById('feed'), feedList = document.getElementById('feedList');
let flash = 0;
function renderFeed(newId) {
  if (!feed) return;
  if (newId) flash = newId;
  feed.hidden = !log.length;
  feedList.innerHTML = log.map(ev => `<li><button class="feed-item${ev.done ? ' done' : ''}${ev.id === flash ? ' fresh' : ''}" data-id="${ev.id}" data-type="${ev.type}">` +
    `<span class="ft">${ev.time}</span><span class="fb"><b>${ev.title}</b><span class="fp">${ev.place}</span></span><span class="fs">${ev.status}</span></button></li>`).join('');
  if (newId) setTimeout(() => { if (flash === newId) { flash = 0; const el = feedList.querySelector('.fresh'); if (el) el.classList.remove('fresh'); } }, 1600);
}
if (feedList) feedList.addEventListener('click', e => {
  const btn = e.target.closest('button[data-id]'); if (!btn) return;
  const ev = log.find(x => x.id === +btn.dataset.id); if (!ev || !C.flyTo) return;
  const [pos, tgt] = ev.view();
  C.flyTo(pos, tgt, 2200);
});
const chk = document.getElementById('eventsChk'), btn = document.getElementById('eventBtn');
if (chk) chk.addEventListener('change', e => { C.eventsOn = e.target.checked; });
if (btn) btn.addEventListener('click', () => C.startEvent());
})();
