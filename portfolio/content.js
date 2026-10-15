/* ===== content.js: portfolyonun bütün yazıları burada; sayfanın geri kalanına dokunmadan değiştirilebilir. ===== */
window.PORTFOLIO = {
  name: 'Zeynel Ümit Korkmaz',
  role: 'Yazılım geliştirici',
  status: 'Geliştirme aşamasında',
  tagline: 'Bu telefonun sahibi, arkadaki şehrin de yapımcısı.',
  site: 'umitkrkmz.github.io',                                  // uygulamaların adres çubuğunda görünür

  about: [
    'Merhaba, ben Ümit. Yazılım geliştiriyorum; en çok bir şeyin gerçekten çalışır hâle geldiği anı seviyorum.',
    'Arkadaki Mikro Şehir boş zamanlarımda eğlencesine yaptığım bir proje: tarayıcıda, derleme adımı olmadan, düz JavaScript ve Three.js ile.'
  ],
  skills: ['JavaScript', 'Three.js / WebGL', 'GLSL', 'HTML / CSS', 'Git'],

  /* kod: kaynak kodun bağlantısı, canli: çalışan sürüm ('../index.html' = bu şehir) */
  projects: [
    {
      title: 'Mikro Şehir',
      desc: 'Tarayıcıda çalışan prosedürel 3B Ankara: Kızılay\'dan Söğütözü\'ne semtler, canlı Ankara havası, dağlarla çevrili vadi, trafik ve yayalar, camın ardında yaşayan odalar, olaylar, kediler, stadyumda maç ve ağla sallanan bir kahraman.',
      tags: ['Three.js', 'GLSL', 'Prosedürel üretim', 'Simülasyon'],
      code: '', live: '../index.html'
    }
  ],
  more: { label: 'Diğer projelerim GitHub\'da', href: 'https://github.com/umitkrkmz?tab=repositories' },

  /* tür: github, linkedin, mail */
  contact: [
    { kind: 'github', label: 'GitHub', value: 'github.com/umitkrkmz', href: 'https://github.com/umitkrkmz' },
    { kind: 'linkedin', label: 'LinkedIn', value: 'zeynel-umit-korkmaz', href: 'https://www.linkedin.com/in/zeynel-umit-korkmaz' },
    { kind: 'mail', label: 'E-posta', value: 'zeynelumitkorkmaz@gmail.com', href: 'mailto:zeynelumitkorkmaz@gmail.com' }
  ],

  /* "Bu şehir" uygulamasının gündem haberleri: canlı olayların yanında karışık gösterilir */
  news: [
    ['Kedi meclisi toplandı', 'Gündem mama kabı krizi. Reis "Bu böyle gitmez" dedi, oylama ertelendi.'],
    ['Saat kulesi yine beş dakika ileri', 'Belediye "kule kendi kafasına göre" açıklaması yaptı.'],
    ['Pijamalı Çocuk kimdir?', 'Çatılarda görülen maskeli gencin kimliği hâlâ belirsiz. Komşular pijamasından tanıdığını söylüyor.'],
    ['Tünel yolunda bayram havası', 'Şehre giren araç sayısı rekor kırdı; dağdaki tünel çıkışında kuyruk oluştu.'],
    ['Ördekler gölü paylaşamıyor', 'Parktaki üç ördek arasında nilüfer anlaşmazlığı büyüyor.'],
    ['Ankara simidi fiyatı sabit', 'Fırıncı esnafı "simit ekmek kadar önemli" diyerek zammı reddetti.'],
    ['Otobüs 56 bu sefer zamanında geldi', 'Duraktaki yolcular şaşkınlıklarını gizleyemedi.'],
    ['Geliştirici yine commit attı', 'Meydanın doğusunda dolaşan kapüşonlu vatandaş "bir commit daha, sonra kahve" dedi.'],
    ['Bank sayısı yeterli mi?', 'Parklarda oturacak yer bulamayanlar şikâyetçi; kediler bankları çoktan kapmış durumda.']
  ],

  /* "Bu şehir nasıl yapıldı" bölümü */
  how: [
    ['Pencerelerin ardındaki odalar', 'Her pencereye geometri koymak yerine cephe shader\'ında "interior mapping": duvar, zemin, tavan ve mobilya bakış açısıyla değişir. Yakındaki birkaç pencerede cam gerçekten açılır, arkasında televizyon izleyen, yemek yapan insanlar vardır.'],
    ['Ayrıntı kademeleri', 'Kuş bakışından göz hizasına dört kademe: uzakta bina başına tek malzeme ve tek çizim çağrısı, yaklaştıkça tabelalar, tenteler, yayalar ve iç mekânlar açılır.'],
    ['Örnekli çizim', 'Araçlar, insanlar, ağaçlar, kediler ve tribündeki taraftarlar InstancedMesh ile: binlerce nesne, birkaç çizim çağrısı. Kedilerin tüy desenleri bile shader\'da üretilir.'],
    ['Trafik', 'Kavşak düğümleri ve yönlü kenarlardan oluşan yol ağı, Bezier dönüşler, ışıklar, sinyaller. Acil durum araçları kapalı yolu geçen BFS rotasıyla gider, öndekiler kenara çekilir.'],
    ['Vadi', 'fbm gürültüsüyle dağlar; yol ve akarsu boyunca açılan vadiler, ormanlar, tünele giren dört şeritli yol ve şehre girip çıkan trafik.']
  ]
};
