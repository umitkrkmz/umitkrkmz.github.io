/* ===== wxdata.js: Ankara'nın canlı havası (Open-Meteo, anahtar gerekmez). Şehir (weather.js) ve telefon (portfolio) ortak kullanır.
   Yanıt tarayıcıda 15 dakika saklanır; ağ yoksa eldeki eski kayıt, o da yoksa sessizce null. ===== */
window.MSWeather = (function () {
  const LAT = 39.9208, LON = 32.8541, KEY = 'ms.weather', TTL = 15 * 60e3;
  const URL = 'https://api.open-meteo.com/v1/forecast?latitude=' + LAT + '&longitude=' + LON +
    '&current=temperature_2m,apparent_temperature,relative_humidity_2m,is_day,precipitation,rain,showers,snowfall,snow_depth,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m' +
    '&hourly=precipitation&past_hours=3&forecast_hours=1&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=Europe%2FIstanbul';

  /* WMO hava kodu: [şehirdeki tür, şiddet 0..1, Türkçe ad, gündüz simgesi, gece simgesi] */
  const CODES = {
    0: ['clear', 0, 'Açık', '☀️', '🌙'], 1: ['clear', 0, 'Az bulutlu', '🌤️', '🌙'], 2: ['partly', 0, 'Parçalı bulutlu', '⛅', '☁️'], 3: ['overcast', 0, 'Kapalı', '☁️'],
    45: ['fog', 1, 'Sisli', '🌫️'], 48: ['fog', 1, 'Kırağılı sis', '🌫️'],
    51: ['drizzle', 0.15, 'Hafif çisenti', '🌦️', '🌧️'], 53: ['drizzle', 0.25, 'Çisenti', '🌦️', '🌧️'], 55: ['drizzle', 0.35, 'Yoğun çisenti', '🌧️'],
    56: ['drizzle', 0.25, 'Donan çisenti', '🌧️'], 57: ['drizzle', 0.35, 'Donan çisenti', '🌧️'],
    61: ['rain', 0.45, 'Hafif yağmur', '🌦️', '🌧️'], 63: ['rain', 0.65, 'Yağmurlu', '🌧️'], 65: ['rain', 0.9, 'Kuvvetli yağmur', '🌧️'],
    66: ['rain', 0.5, 'Donan yağmur', '🌧️'], 67: ['rain', 0.8, 'Donan yağmur', '🌧️'],
    71: ['snow', 0.4, 'Hafif kar', '🌨️'], 73: ['snow', 0.7, 'Kar yağışlı', '🌨️'], 75: ['snow', 1, 'Yoğun kar', '❄️'], 77: ['snow', 0.3, 'Kar taneleri', '🌨️'],
    80: ['rain', 0.45, 'Hafif sağanak', '🌦️', '🌧️'], 81: ['rain', 0.7, 'Sağanak', '🌧️'], 82: ['rain', 1, 'Şiddetli sağanak', '🌧️'],
    85: ['snow', 0.5, 'Kar sağanağı', '🌨️'], 86: ['snow', 0.9, 'Yoğun kar sağanağı', '❄️'],
    95: ['storm', 0.85, 'Gök gürültülü fırtına', '⛈️'], 96: ['storm', 1, 'Dolulu fırtına', '⛈️'], 99: ['storm', 1, 'Dolulu fırtına', '⛈️']
  };
  const code = c => CODES[c] || CODES[c < 50 ? 3 : c < 70 ? 63 : c < 80 ? 73 : c < 95 ? 81 : 95];
  const DIRS = ['kuzeyden', 'kuzeydoğudan', 'doğudan', 'güneydoğudan', 'güneyden', 'güneybatıdan', 'batıdan', 'kuzeybatıdan'];   // rüzgârın geldiği yön

  /* ham yanıttan kullanılan alanlar */
  function parse(raw, t) {
    const c = raw && raw.current; if (!c) return null;
    const k = code(c.weather_code), day = c.is_day !== 0;
    const recent = ((raw.hourly && raw.hourly.precipitation) || []).reduce((s, v) => s + (v || 0), 0);   // son 3 saatte yağış (mm)
    const daily = raw.daily ? raw.daily.time.map((d, i) => ({ date: d, code: raw.daily.weather_code[i], max: raw.daily.temperature_2m_max[i], min: raw.daily.temperature_2m_min[i], ico: code(raw.daily.weather_code[i])[3], label: code(raw.daily.weather_code[i])[2] })) : [];
    return {
      t: t || Date.now(), code: c.weather_code, kind: k[0], power: k[1], label: k[2], ico: day ? k[3] : (k[4] || k[3]),
      temp: c.temperature_2m, feels: c.apparent_temperature, hum: c.relative_humidity_2m, cloud: (c.cloud_cover || 0) / 100,
      precip: c.precipitation || 0, snowfall: c.snowfall || 0, snowDepth: c.snow_depth || 0, recent,
      wind: c.wind_speed_10m || 0, windDir: c.wind_direction_10m || 0, windFrom: DIRS[Math.round((c.wind_direction_10m || 0) / 45) % 8],
      day, daily
    };
  }
  function cached() { try { const s = JSON.parse(localStorage.getItem(KEY)); return s && s.d ? s : null; } catch (e) { return null; } }
  /* cb(veri | null): önbellek tazeyse ağa çıkmaz */
  function load(cb, force) {
    const c = cached();
    if (c && !force && Date.now() - c.t < TTL) { cb(parse(c.d, c.t)); return; }
    fetch(URL).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(d => {
      const t = Date.now(); try { localStorage.setItem(KEY, JSON.stringify({ t, d })); } catch (e) {}
      cb(parse(d, t));
    }).catch(() => cb(c ? parse(c.d, c.t) : null));
  }
  return { load, parse, cached, code, TTL };
})();
