/* ===== weather.js: hava durumu. Canlıda Ankara'nın şu anki havası (wxdata.js, Open-Meteo), istenirse elle seçilir.
   Bulut ve sis gökyüzünde (world.js applyTime, C.wx), ıslak ve karlı zemin yüzey shader'ında (C.surfaces), yağmur ve kar kameranın çevresinde. ===== */
(function () {
const { scene, camera, renderer } = C;
const $ = id => document.getElementById(id);

/* türler: bulut, yağmur, kar, sis, fırtına (0..1) */
const KINDS = {
  clear: { label: 'Açık', ico: '☀️', cloud: 0.04 },
  partly: { label: 'Parçalı bulutlu', ico: '⛅', cloud: 0.45 },
  overcast: { label: 'Kapalı', ico: '☁️', cloud: 0.96 },
  fog: { label: 'Sisli', ico: '🌫️', cloud: 0.8, fog: 1 },
  drizzle: { label: 'Çisenti', ico: '🌦️', cloud: 0.92, rain: 0.25 },
  rain: { label: 'Yağmurlu', ico: '🌧️', cloud: 1, rain: 0.7 },
  storm: { label: 'Fırtına', ico: '⛈️', cloud: 1, rain: 1, storm: 1 },
  snow: { label: 'Karlı', ico: '🌨️', cloud: 0.96, snow: 0.75 }
};
const ORDER = Object.keys(KINDS);
const W = C.weather = { live: true, pick: 'clear', data: null, status: 'loading', KINDS,
  cur: { cloud: 0, rain: 0, snow: 0, fog: 0, storm: 0 }, wet: 0, cover: 0, steam: 0, sun: 0, temp: 14, wind: new THREE.Vector2(2, 1.5), snap: true };

/* hedef: canlıda veriden, elle seçimde türden */
function target() {
  const d = W.live ? W.data : null;
  if (!d) { const k = KINDS[W.live ? 'clear' : W.pick]; return { kind: W.live ? 'clear' : W.pick, cloud: k.cloud, rain: k.rain || 0, snow: k.snow || 0, fog: k.fog || 0, storm: k.storm || 0, wet: k.rain ? 1 : k.snow ? 0.4 : k.fog ? 0.25 : 0, cover: k.snow ? 1 : 0 }; }
  const k = KINDS[d.kind], p = d.power;
  const cloud = d.kind === 'clear' ? Math.min(d.cloud, 0.3) : d.kind === 'partly' ? C.clamp(d.cloud, 0.3, 0.7) : Math.max(k.cloud * 0.9, d.cloud);
  const rain = /drizzle|rain|storm/.test(d.kind) ? p : 0, snow = d.kind === 'snow' ? p : 0;
  const wet = rain ? 1 : snow ? 0.4 : d.recent > 0.05 ? C.clamp(0.25 + d.recent * 1.5, 0.25, 0.8) : d.kind === 'fog' ? 0.25 : 0;   // az önce yağdıysa nemli
  const cover = snow ? Math.min(1, 0.45 + snow * 0.6) : d.snowDepth > 0.005 ? C.clamp(d.snowDepth * 30, 0.3, 1) : 0;               // yerde kar kalmış olabilir
  return { kind: d.kind, cloud, rain, snow, fog: d.kind === 'fog' ? 1 : 0, storm: d.kind === 'storm' ? 1 : 0, wet, cover };
}
function setWind() {
  const d = W.live && W.data, kmh = d ? d.wind : W.pick === 'storm' ? 36 : 9, from = d ? d.windDir : 225;
  const to = (from + 180) * Math.PI / 180, s = kmh / 3.6;                // kuzey -z, doğu +x
  W.wind.set(Math.sin(to) * s, -Math.cos(to) * s);
  C.sky.uCW.value.set(W.wind.x * 0.0012, W.wind.y * 0.0012);
}

/* ---------- yüzeyler: ıslaklık koyulaştırır ve parlatır (su birikintisi, gökyüzü yansıması), kar üste bakan yüzü örter ---------- */
const WXU = { uWet: { value: 0 }, uSnow: { value: 0 }, uWxSky: { value: new THREE.Color() } };
/* tür: [ıslanma, en çok kar örtüsü, birikinti] ve karın tuttuğu aralık [başlangıç, tam]: kar önce çime, çatıya, ağaca tutar, yola en son;
   erirken tersi: önce yol (araçlar ezer), sonra kaldırım, en son çim ve çatı */
const KIND = { road: [1, 0.6, 1, 0.45, 1], mark: [1, 0.6, 0, 0.45, 1], pave: [0.9, 1, 0.45, 0.2, 0.9], grass: [0.35, 1, 0, 0, 0.6], roof: [0.6, 1, 0.15, 0, 0.6], terrain: [0.4, 1, 0, 0, 0.6], tree: [0.15, 0.85, 0, 0.05, 0.7] };
const HEAD = [
  'uniform float uWet; uniform float uSnow; uniform vec3 uWxSky; uniform vec3 uWxK; uniform vec2 uWxR;',
  'float wxH(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }',
  'float wxN(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(wxH(i), wxH(i + vec2(1.0, 0.0)), f.x), mix(wxH(i + vec2(0.0, 1.0)), wxH(i + vec2(1.0, 1.0)), f.x), f.y); }'
].join('\n');
const BODY = [
  'float wxW = 0.0, wxD = 0.0;',
  'if (uWet + uSnow > 0.002) {',
  '  vec3 wxP = (vec4(-vViewPosition, 0.0) * viewMatrix).xyz + cameraPosition;            // dünya konumu',
  '  float wxUp = smoothstep(0.6, 0.9, (vec4(normalize(vNormal), 0.0) * viewMatrix).y);  // üste bakan yüz',
  '  float wxA = wxN(wxP.xz * 0.21) * 0.6 + wxN(wxP.xz * 0.93) * 0.4;',
  '  float wxSe = smoothstep(uWxR.x, uWxR.y, uSnow);                                     // bu yüzeyin kar payı',
  '  float wxT = 1.0 - wxSe * 1.25;',
  '  float wxS = wxUp * smoothstep(wxT, wxT + 0.18, wxA) * uWxK.y * step(0.001, wxSe);   // kar önce lekeler, sonra örter',
  '  float wxC = wxN(wxP.xz * 0.11 + 7.0);                                                // çukurlar: su burada birikir, en son burası kurur',
  '  float wxL = smoothstep(1.0 - uWet * 1.2, 1.25 - uWet * 1.2, wxC * 0.6 + wxN(wxP.xz * 0.37 + 3.0) * 0.4);   // lekeli kuruma',
  '  wxW = uWxK.x * wxUp * wxL * smoothstep(0.0, 0.1, uWet) * (1.0 - wxS);',
  '  float wxPt = 0.52 + (1.0 - uWet) * 0.3;                                               // kurudukça birikinti küçülür',
  '  wxD = uWxK.z * wxUp * smoothstep(wxPt, wxPt + 0.12, wxC) * smoothstep(0.0, 0.15, uWet) * (1.0 - wxS);',
  '  diffuseColor.rgb *= (1.0 - 0.38 * wxW) * (1.0 - 0.45 * wxD);',
  '  roughnessFactor = mix(roughnessFactor, 0.22, wxW * 0.9); roughnessFactor = mix(roughnessFactor, 0.05, wxD);',
  '  diffuseColor.rgb = mix(diffuseColor.rgb, mix(vec3(0.42, 0.44, 0.47), vec3(0.85, 0.88, 0.93), uWxK.y), wxS);',
  '  roughnessFactor = mix(roughnessFactor, 0.8, wxS);',
  '}'
].join('\n');
const EMIS = 'float wxF = pow(1.0 - clamp(dot(normalize(vNormal), normalize(vViewPosition)), 0.0, 1.0), 4.0);\n' +
  'totalEmissiveRadiance += uWxSky * (wxW * 0.35 * wxF + wxD * (0.05 + 0.9 * wxF));   // ıslak zeminde gök ve şehir ışığı';
let patched = 0;
function patch(m, kind) {
  if (m.userData.wx) return; m.userData.wx = true;
  const prev = m.onBeforeCompile, key = m.customProgramCacheKey(), k = KIND[kind] || KIND.pave, K = new THREE.Vector3().fromArray(k), R = new THREE.Vector2(k[3], k[4]);
  m.onBeforeCompile = (sh, r) => {
    prev.call(m, sh, r);                                                 // önceki eklemeler (gölge AO, pencereler) korunur
    Object.assign(sh.uniforms, WXU); sh.uniforms.uWxK = { value: K }; sh.uniforms.uWxR = { value: R };
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n' + HEAD)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n' + BODY)
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n' + EMIS);
  };
  m.customProgramCacheKey = () => key + '|wx';
  m.needsUpdate = true;
}

/* ---------- yağmur (çizgi) ve kar (nokta): kameranın çevresinde dünyaya sabit, kutu boyunca tekrar eden desen ---------- */
const NQ = { low: [2200, 1500], mid: [4500, 3000], high: [7000, 5000] }[C.QUALITY] || [4500, 3000];
const RB = new THREE.Vector3(64, 32, 64), SB = new THREE.Vector3(50, 30, 50);
const rainU = { uCam: { value: new THREE.Vector3() }, uOff: { value: new THREE.Vector3() }, uBox: { value: RB }, uVel: { value: new THREE.Vector3(0, -1, 0) }, uLen: { value: 0.9 },
  uCol: { value: new THREE.Color('#c3cdd8') }, uAlpha: { value: 0.3 } };
const rain = (function () {
  const n = NQ[0], pos = new Float32Array(n * 6), end = new Float32Array(n * 2), r = C.rng(808);
  for (let i = 0; i < n; i++) { const x = r(), y = r(), z = r(); pos.set([x, y, z, x, y, z], i * 6); end[i * 2 + 1] = 1; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aEnd', new THREE.BufferAttribute(end, 1));
  const m = new THREE.LineSegments(g, new THREE.ShaderMaterial({
    uniforms: rainU, transparent: true, depthWrite: false,
    vertexShader: [
      'uniform vec3 uCam; uniform vec3 uOff; uniform vec3 uBox; uniform vec3 uVel; uniform float uLen; attribute float aEnd; varying float vA;',
      'void main() {',
      '  vec3 p = mod(position * uBox + uOff - uCam + uBox * 0.5, uBox) - uBox * 0.5;',
      '  vA = (1.0 - smoothstep(0.55, 1.0, length(p.xz) / (uBox.x * 0.5))) * (1.0 - smoothstep(0.3, 0.5, abs(p.y) / uBox.y)) * (0.55 + 0.45 * fract(position.x * 91.7));',
      '  vec3 w = uCam + p - uVel * uLen * aEnd * (0.7 + 0.6 * fract(position.z * 53.1));',
      '  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);',
      '}'].join('\n'),
    fragmentShader: 'uniform vec3 uCol; uniform float uAlpha; varying float vA; void main() { gl_FragColor = vec4(uCol, uAlpha * vA); }'
  }));
  m.frustumCulled = false; m.visible = false; m.renderOrder = 5; scene.add(m); return m;
})();
const snowU = { uCam: { value: new THREE.Vector3() }, uOff: { value: new THREE.Vector3() }, uBox: { value: SB }, uT: { value: 0 }, uSize: { value: 40 },
  uCol: { value: new THREE.Color('#f4f7fb') }, uAlpha: { value: 0.9 } };
const snow = (function () {
  const n = NQ[1], pos = new Float32Array(n * 3), r = C.rng(909);
  for (let i = 0; i < n * 3; i++) pos[i] = r();
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.Points(g, new THREE.ShaderMaterial({
    uniforms: snowU, transparent: true, depthWrite: false,
    vertexShader: [
      'uniform vec3 uCam; uniform vec3 uOff; uniform vec3 uBox; uniform float uT; uniform float uSize; varying float vA;',
      'void main() {',
      '  float ph = position.x * 40.0 + position.z * 17.0;',
      '  vec3 p = position * uBox + uOff + vec3(sin(uT * 0.9 + ph), 0.0, cos(uT * 0.7 + ph * 1.3)) * 0.7;   // savrulma',
      '  p = mod(p - uCam + uBox * 0.5, uBox) - uBox * 0.5;',
      '  vA = (1.0 - smoothstep(0.6, 1.0, length(p.xz) / (uBox.x * 0.5))) * (1.0 - smoothstep(0.3, 0.5, abs(p.y) / uBox.y));',
      '  vec4 mv = viewMatrix * vec4(uCam + p, 1.0);',
      '  gl_PointSize = clamp(uSize * (0.6 + 0.8 * fract(position.y * 71.3)) / -mv.z, 1.0, 14.0);',
      '  gl_Position = projectionMatrix * mv;',
      '}'].join('\n'),
    fragmentShader: 'uniform vec3 uCol; uniform float uAlpha; varying float vA; void main() { float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(uCol, uAlpha * vA * smoothstep(0.5, 0.15, d)); }'
  }));
  m.frustumCulled = false; m.visible = false; m.renderOrder = 5; scene.add(m); return m;
})();
/* buhar: yağmurdan sonra güneş çıkınca ıslak zeminden yükselen ince, yumuşak tüller (yalnızca şehirde, yere yakın, sokak kademesinde) */
const NS = { low: 120, mid: 240, high: 400 }[C.QUALITY] || 240, VB = new THREE.Vector3(40, 3, 40);
const steamU = { uCam: { value: new THREE.Vector3() }, uOff: { value: new THREE.Vector3() }, uBox: { value: VB }, uT: { value: 0 }, uSize: { value: 400 }, uHalf: { value: C.TOTAL / 2 },
  uCol: { value: new THREE.Color('#eef1f4') }, uAlpha: { value: 0 } };
const steam = (function () {
  const pos = new Float32Array(NS * 3), r = C.rng(707);
  for (let i = 0; i < NS * 3; i++) pos[i] = r();
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.Points(g, new THREE.ShaderMaterial({
    uniforms: steamU, transparent: true, depthWrite: false,
    vertexShader: [
      'uniform vec3 uCam; uniform vec3 uOff; uniform vec3 uBox; uniform float uT; uniform float uSize; uniform float uHalf; varying float vA;',
      'void main() {',
      '  vec2 p = mod(position.xz * uBox.xz + uOff.xz - uCam.xz + uBox.xz * 0.5, uBox.xz) - uBox.xz * 0.5;',
      '  float life = fract(position.y + uT * (0.08 + 0.06 * fract(position.x * 13.7)));   // yerden kalkar, sönerek dağılır',
      '  vec3 w = vec3(uCam.x + p.x, 0.15 + life * uBox.y, uCam.z + p.y);',
      '  w.xz += vec2(sin(uT * 0.5 + position.z * 30.0), cos(uT * 0.4 + position.x * 20.0)) * 0.35 * life;',
      '  vA = sin(3.14159 * life) * (1.0 - smoothstep(0.5, 1.0, length(p) / (uBox.x * 0.5))) * step(abs(w.x), uHalf) * step(abs(w.z), uHalf);',
      '  vec4 mv = viewMatrix * vec4(w, 1.0);',
      '  gl_PointSize = clamp(uSize * (0.7 + 0.8 * life) / -mv.z, 2.0, 120.0);',
      '  gl_Position = projectionMatrix * mv;',
      '}'].join('\n'),
    fragmentShader: 'uniform vec3 uCol; uniform float uAlpha; varying float vA; void main() { float d = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5)); gl_FragColor = vec4(uCol, uAlpha * vA * d * d); }'
  }));
  m.frustumCulled = false; m.visible = false; m.renderOrder = 5; scene.add(m); return m;
})();
const wrap = (v, L) => ((v % L) + L) % L, lerp = THREE.MathUtils.lerp;

/* ---------- güncelleme ---------- */
const LAMP = C.col('#ffcf8a'), cTmp = new THREE.Color();
let flashT = -1, nextFlash = 4, lastSig = '', fogNear = 0, fogFar = 0;
function update(dt, t, D) {
  if (patched < C.surfaces.length) { for (; patched < C.surfaces.length; patched++) patch(C.surfaces[patched][0], C.surfaces[patched][1]); }
  const T = target(), cur = W.cur, k = W.snap ? 1 : 1 - Math.exp(-dt / 3);    // ~3 sn'de yeni havaya geçer
  for (const key in cur) cur[key] += (T[key] - cur[key]) * k;
  /* ıslaklık ve kar örtüsü yavaş birikir; güneşte, rüzgârda ve sıcakta hızlı, gece ve soğukta yavaş kurur, erir. Eriyen kar zemini ıslatır.
     sıcaklık canlıda gerçek; elle seçimde kar yağarken 0°, sonra 4°, diğer havada 14° sayılır */
  const d = W.live && W.data;
  W.temp = d ? d.temp : T.snow ? 0 : W.cover > 0.05 ? 4 : 14;
  W.sun = (1 - C.night) * (1 - 0.75 * cur.cloud);
  const dry = (0.3 + 1.6 * W.sun + 0.04 * W.wind.length()) * (W.temp < 3 ? 0.4 : 1) * (W.cover > 0.05 ? 0.3 : 1);
  const melt = W.temp <= 0 ? 0.08 : (0.35 + 1.5 * W.sun) * C.clamp(W.temp / 4, 0.4, 2.5);
  const step = (v, to, up, down) => W.snap ? to : v + C.clamp(to - v, -dt / down, dt / up);
  const was = W.cover;
  W.cover = step(W.cover, T.cover, 40, 420 / melt);
  W.wet = step(W.wet, T.wet, 20, 300 / dry);
  if (W.cover < was) W.wet = Math.min(1, W.wet + (was - W.cover) * 1.5);   // eriyen kar su olur
  /* buhar: ıslak zemin + güneş + yağış yok + ılık */
  const st = W.wet * C.clamp(W.sun * 1.5 - 0.3, 0, 1) * (cur.rain < 0.05 ? 1 : 0) * (W.temp > 2 ? 1 : 0) * (1 - W.cover);
  W.steam += (st - W.steam) * (1 - Math.exp(-dt / 2));
  W.snap = false;
  WXU.uWet.value = W.wet; WXU.uSnow.value = W.cover;
  /* gökyüzü: değiştiyse ışıklar yeniden kurulur */
  const wx = C.wx; wx.cloud = cur.cloud; wx.dark = Math.min(1, cur.rain * 0.7 + cur.storm * 0.3 + cur.snow * 0.2); wx.fog = cur.fog;
  const sig = wx.cloud.toFixed(3) + wx.dark.toFixed(3) + wx.fog.toFixed(3);
  if (sig !== lastSig) { lastSig = sig; if (!C.playing) C.applyTime(C.hour); }
  /* ıslak zeminin yansıttığı: sokakta çoğunlukla binalar, bu yüzden gökten koyu; gece sokak lambası sarısı */
  WXU.uWxSky.value.copy(scene.fog.color).multiplyScalar(0.45 * (1 - 0.5 * C.night)).add(cTmp.copy(LAMP).multiplyScalar(0.13 * C.night));
  /* sis ve yağış görüşü daraltır; kuş bakışında şehir yine seçilsin diye kamera uzaklığı eklenir */
  const B = C.fogBase || { near: scene.fog.near, far: scene.fog.far };
  let near = B.near, far = B.far;
  far = Math.min(far, lerp(B.far, 1500 + D * 1.2, cur.rain * 0.8), lerp(B.far, 900 + D * 1.2, cur.snow)); near = Math.min(near, lerp(B.near, 40, Math.max(cur.rain * 0.8, cur.snow)));
  far = lerp(far, 180 + D * 0.85, cur.fog); near = lerp(near, 5, cur.fog);
  if (Math.abs(near - fogNear) + Math.abs(far - fogFar) > 0.5) { fogNear = near; fogFar = far; scene.fog.near = near; scene.fog.far = far; }
  /* yağmur ve kar: kapalı mekânda yok */
  const inside = C.player && C.player.indoor;
  const nr = Math.round(NQ[0] * C.clamp(cur.rain * 1.1, 0, 1)), ns = Math.round(NQ[1] * C.clamp(cur.snow * 1.2, 0, 1));
  rain.visible = nr > 20 && !inside; snow.visible = ns > 20 && !inside;
  steam.visible = W.steam > 0.03 && !inside && D < 160;
  if (steam.visible) {
    const o = steamU.uOff.value; o.x = wrap(o.x + W.wind.x * 0.25 * dt, VB.x); o.z = wrap(o.z + W.wind.y * 0.25 * dt, VB.z);
    steamU.uCam.value.copy(camera.position); steamU.uT.value = t % 600;
    steamU.uSize.value = 1.1 * renderer.domElement.height / (2 * Math.tan(camera.fov * Math.PI / 360));
    steamU.uAlpha.value = 0.11 * W.steam;
  }
  if (rain.visible) {
    const sp = 5 + cur.rain * 5, o = rainU.uOff.value;
    o.y = wrap(o.y - sp * dt, RB.y); o.x = wrap(o.x + W.wind.x * 0.5 * dt, RB.x); o.z = wrap(o.z + W.wind.y * 0.5 * dt, RB.z);
    rainU.uVel.value.set(W.wind.x * 0.5, -sp, W.wind.y * 0.5).normalize(); rainU.uLen.value = 0.35 + cur.rain * 0.6;
    rainU.uCam.value.copy(camera.position); rainU.uAlpha.value = (0.28 + 0.3 * cur.rain) * (1 - 0.3 * C.night);
    rain.geometry.setDrawRange(0, nr * 2);
  }
  if (snow.visible) {
    const o = snowU.uOff.value;
    o.y = wrap(o.y - 1.1 * dt, SB.y); o.x = wrap(o.x + W.wind.x * 0.4 * dt, SB.x); o.z = wrap(o.z + W.wind.y * 0.4 * dt, SB.z);
    snowU.uCam.value.copy(camera.position); snowU.uT.value = t % 600;
    snowU.uSize.value = 0.09 * renderer.domElement.height / (2 * Math.tan(camera.fov * Math.PI / 360));
    snowU.uAlpha.value = 0.95 - 0.35 * C.night;
    snow.geometry.setDrawRange(0, ns);
  }
  /* şimşek: fırtınada ara sıra çift çakış */
  let f = 0;
  if (cur.storm > 0.5) { if ((nextFlash -= dt) < 0) { flashT = 0; nextFlash = 5 + Math.random() * 12; } }
  if (flashT >= 0) {
    flashT += dt; f = Math.exp(-flashT * 18) + (flashT > 0.2 ? 0.7 * Math.exp(-(flashT - 0.2) * 14) : 0);
    if (flashT > 1) { flashT = -1; f = 0; }
    C.hemi.intensity = C.lightBase.hemi + f * 2.2 * cur.storm; C.sky.uFlash.value = f * 0.45 * cur.storm;
  }
}
C.updaters.push(update);

/* ---------- veri: açılışta ve 5 dakikada bir (önbellek 15 dakikadan eskiyse ağa çıkar) ---------- */
let retries = 0;
function use(d) {
  const first = !W.data && W.live;
  if (d) { W.data = d; W.status = 'ok'; } else if (!W.data) W.status = 'off';
  if (!d && !W.data && retries < 3 && window.MSWeather) { retries++; setTimeout(() => MSWeather.load(use), 20e3); }   // ilk istek düştüyse (ör. 503) kısa aralıkla yeniden dene
  if (first && d) W.snap = true;                                       // açılışta geçiş beklemeden
  setWind(); ui();
}

/* ---------- arayüz: Canlı düğmesi ve tür seçimi (saat gibi: elle seçince canlı kapanır) ---------- */
const pickEl = $('wxPick');
if (pickEl) pickEl.innerHTML = ORDER.map(k => `<button class="wxb" data-k="${k}" title="${KINDS[k].label}" aria-label="${KINDS[k].label}" aria-pressed="false">${KINDS[k].ico}</button>`).join('');
function ui() {
  const d = W.data, b = $('wxLive'); if (!b) return;
  const shown = W.live ? (d ? d.kind : null) : W.pick;
  b.setAttribute('aria-pressed', W.live); b.classList.toggle('on', W.live); b.textContent = W.live ? '● Canlı' : 'Canlı';
  b.title = W.live ? "Ankara'nın şu anki havası (Open-Meteo)" : "Ankara'nın gerçek havasına dön";
  if (pickEl) pickEl.querySelectorAll('.wxb').forEach(x => x.setAttribute('aria-pressed', x.dataset.k === shown));
  const now = d ? `${Math.round(d.temp)}° ${d.label}` : '';
  $('wxOut').textContent = W.live ? (d ? `${d.ico} ${Math.round(d.temp)}°` : W.status === 'off' ? 'bağlantı yok' : '…') : KINDS[W.pick].ico + ' elle';
  $('wxNote').textContent = W.live
    ? (d ? `Ankara · ${d.label} · nem %${Math.round(d.hum)} · rüzgâr ${Math.round(d.wind)} km/sa` : W.status === 'off' ? 'Canlı hava alınamadı; elle seçebilirsin.' : "Ankara'nın havası alınıyor…")
    : `Elle: ${KINDS[W.pick].label}` + (now ? ` · Ankara'da şu an ${now}` : '');
}
W.set = function (kind) { W.live = false; W.pick = kind; setWind(); ui(); };
W.setLive = function (on) { W.live = on !== false; if (W.live && window.MSWeather) MSWeather.load(use); setWind(); ui(); };
if (pickEl) pickEl.addEventListener('click', e => { const x = e.target.closest('.wxb'); if (x) W.set(x.dataset.k); });
if ($('wxLive')) $('wxLive').addEventListener('click', () => W.setLive(true));
ui();
/* veri: önbellekteyse hemen (arayüz kurulduktan sonra), değilse ağdan */
if (window.MSWeather) { MSWeather.load(use); setInterval(() => { if (!document.hidden) MSWeather.load(use); }, 5 * 60e3); } else use(null);
})();
