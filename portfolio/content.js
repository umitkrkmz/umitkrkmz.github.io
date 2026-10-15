/* ===== content.js: portfolyonun bütün yazıları burada. "(doldurulacak)" yazan yerleri değiştir; sayfanın geri kalanına dokunmana gerek yok. ===== */
window.PORTFOLIO = {
  name: 'Adın Soyadın (doldurulacak)',
  role: 'Yazılım geliştirici (doldurulacak)',
  status: 'Geliştirme aşamasında',
  tagline: 'Bu telefonun sahibi, arkadaki şehrin de yapımcısı.',

  about: [
    'Kendini birkaç cümleyle anlat: ne üzerinde çalışıyorsun, neyi seviyorsun, nereye gidiyorsun. (doldurulacak)',
    'İkinci paragraf: eğitim, deneyim ya da ilgi alanları. (doldurulacak)'
  ],
  skills: ['JavaScript', 'Three.js / WebGL', 'GLSL', 'Python', '(doldurulacak)'],

  /* kod: kaynak kodun bağlantısı, canli: çalışan sürüm; boş bırakılırsa "yakında" görünür */
  projects: [
    {
      title: 'Mikro Şehir',
      desc: 'Tarayıcıda çalışan prosedürel 3B şehir: dağlarla çevrili vadi, trafik ve yayalar, camın ardında yaşayan odalar, olaylar ve acil durum araçları, kediler, stadyumda maç ve ağla sallanan bir kahraman. Derleme yok, düz Three.js.',
      tags: ['Three.js', 'GLSL', 'Prosedürel üretim', 'Simülasyon'],
      code: '', live: '../'
    },
    { title: 'Proje adı (doldurulacak)', desc: 'Kısa açıklama: ne yapar, neden yaptın, neyi çözdü.', tags: ['Etiket'], code: '', live: '' },
    { title: 'Proje adı (doldurulacak)', desc: 'Kısa açıklama.', tags: ['Etiket'], code: '', live: '' }
  ],

  /* tür: github, linkedin, mail, web, cv */
  contact: [
    { kind: 'github', label: 'GitHub', value: 'umitkrkmz', href: 'https://github.com/umitkrkmz' },
    { kind: 'linkedin', label: 'LinkedIn', value: '(doldurulacak)', href: '' },
    { kind: 'mail', label: 'E-posta', value: '(doldurulacak)', href: '' },
    { kind: 'cv', label: 'Özgeçmiş (PDF)', value: 'yakında', href: '' }
  ],

  /* "Bu şehir nasıl yapıldı" uygulaması */
  city: {
    stats: [['17 × 17', 'blok'], ['964 m', 'şehir kenarı'], ['~1.250', 'araç'], ['0', 'derleme adımı']],
    points: [
      ['Pencerelerin ardındaki odalar', 'Her pencereye geometri koymak yerine cephe shader\'ında "interior mapping": duvar, zemin, tavan ve mobilya bakış açısıyla değişir. Yakındaki birkaç pencerede cam gerçekten açılır, arkasında televizyon izleyen, yemek yapan insanlar vardır.'],
      ['Ayrıntı kademeleri', 'Kuş bakışından göz hizasına dört kademe: uzakta bina başına tek malzeme ve tek çizim çağrısı, yaklaştıkça tabelalar, tenteler, yayalar ve iç mekânlar açılır.'],
      ['Örnekli çizim', 'Araçlar, insanlar, ağaçlar, kediler ve tribündeki taraftarlar InstancedMesh ile: binlerce nesne, birkaç çizim çağrısı. Görünmeyenler GPU\'ya hiç gitmez.'],
      ['Trafik', 'Kavşak düğümleri ve yönlü kenarlardan oluşan bir yol ağı, Bezier dönüşler, ışıklar, sinyaller. Acil durum araçları kapalı yolları geçen BFS rotasıyla gider, öndekiler kenara çekilir.'],
      ['Olaylar', 'Yangın, kaza, hırsızlık ve yaya kazası: itfaiye, ambulans, polis istasyonlarından çıkar, olay yerinde kalır, işi bitince döner.'],
      ['Vadi', 'fbm gürültüsüyle dağlar; yol ve akarsu boyunca açılan vadiler, ormanlar, tünele giren dört şeritli yol ve şehre girip çıkan trafik.']
    ]
  }
};
