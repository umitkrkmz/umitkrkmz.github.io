/* ===== content.js: portfolyonun bütün yazıları burada; sayfanın geri kalanına dokunmadan değiştirilebilir. ===== */
window.PORTFOLIO = {
  name: 'Zeynel Ümit Korkmaz',
  role: 'Bilgisayar mühendisi',
  status: 'Ankara · .NET ve Python',
  tagline: 'Bu telefonun sahibi, arkadaki şehrin de yapımcısı.',
  site: 'umitkrkmz.github.io',                                  // uygulamaların adres çubuğunda görünür
  github: 'umitkrkmz',                                          // projelerin dili ve son güncellemesi buradan canlı gelir

  about: [
    'Merhaba, ben Ümit. Ankara\'da yaşayan bir bilgisayar mühendisiyim. .NET ve Python nerede varsa ben de oradayım; merak ettiğim şeyleri deniyor, işe yarayanları açık kaynak olarak paylaşıyorum.'
  ],
  edu: 'Kırıkkale Üniversitesi · Bilgisayar Mühendisliği · 2020–2025',
  /* beceriler: genel başlık ve birkaç örnek */
  skills: [
    ['Backend ve servisler', '.NET, ASP.NET Core, Python, FastAPI'],
    ['Masaüstü ve geliştirici araçları', 'PySide6, komut satırı araçları, paketleme'],
    ['Veri ve makine öğrenmesi', 'NumPy, scikit-learn'],
    ['Yapay zekâ entegrasyonu', 'Yerel LLM, RAG, AI destekli geliştirme'],
    ['Veritabanları', 'SQL Server, PostgreSQL'],
    ['Web ve 3B grafik', 'HTML, CSS, JavaScript, Three.js'],
    ['Ortamlar', 'Linux, Docker, Git']
  ],

  /* group: başlık (sırası ilk geçişe göre), repo: GitHub deposu (Kod bağlantısı ve canlı bilgi), live: çalışan sürüm ('../index.html' = bu şehir),
     paper: makale bağlantısı, extra: [ad, bağlantı] ek düğme, slug: adres ve details.js'teki detay sayfasının anahtarı. Açıklamalar Türkçe ve elle yazılır, GitHub'a ulaşılamazsa da görünür */
  projects: [
    {
      group: 'Öne çıkanlar', title: 'Mikro Şehir', slug: 'mikro-sehir', repo: 'umitkrkmz.github.io',
      desc: 'Tarayıcıda çalışan prosedürel 3B Ankara: Kızılay\'dan Söğütözü\'ne semtler, canlı Ankara havası, dağlarla çevrili vadi, trafik ve yayalar, camın ardında yaşayan odalar, olaylar, kediler, stadyumda maç ve ağla sallanan bir kahraman.',
      tags: ['JavaScript', 'Three.js', 'GLSL', 'Prosedürel üretim'], live: '../index.html'
    },
    {
      group: 'Öne çıkanlar', title: 'MediaGrab', slug: 'mediagrab', repo: 'mediagrab',
      desc: 'Link yapıştır, indir. yt-dlp tabanlı, kendi bilgisayarında çalışan video ve ses indirme aracı: 1700\'den fazla site, playlist ve kanal takibi, QR kodla telefondan kullanım, tek tıkla Windows kurulumu, Docker ve Raspberry Pi. Reklam, hesap ve telemetri yok.',
      tags: ['Python', 'FastAPI', 'yt-dlp', 'Docker']
    },
    {
      group: 'Öne çıkanlar', title: 'Kurumsal Bilgi Yönetim Platformu', slug: 'kurumsal-bilgi', repo: 'CorporateKnowledgeBase',
      desc: 'Şirket içi belgeler, yazılar ve duyurular için bilgi platformu. Ollama ile yerel RAG asistanı bilgi tabanından soruları yanıtlar; SignalR ile anlık bildirimler, Hangfire ile arka plan işleri, rol tabanlı yetki ve içerik onay akışı.',
      tags: ['.NET 10', 'ASP.NET Core', 'Clean Architecture', 'CQRS', 'RAG']
    },
    {
      group: 'Öne çıkanlar', title: 'StegoTester', slug: 'stegotester', repo: 'StegoTester',
      desc: 'Görsel, ses ve metin dosyalarında gizli veri arayan, steganografi yöntemlerini 30\'dan fazla metrikle karşılaştıran analiz aracı. Hızlı matematiksel eşik ile Random Forest ve Gradient Boosting modellerini birleştiren hibrit tespit, pHash ve spektral parmak iziyle otomatik eşleştirme, PDF rapor.',
      tags: ['Python', 'PySide6', 'scikit-learn', 'Veri analizi'], extra: ['Model eğitimi', 'https://github.com/umitkrkmz/StegoTester-AI-Training']
    },
    {
      group: 'Öne çıkanlar', title: 'Chaotic Audio Steganography', slug: 'chaotic-audio', repo: 'Chaotic_Audio_Steganography',
      desc: 'Hakemli dergide yayımlanan "Secure Audio Steganography Using Vectorized LSB and Chaos-Based Encryption" makalesinin resmi kodu: yedi kaotik harita, NumPy ile vektörize LSB gömme, PySide6 arayüzü.',
      cite: 'Electrical Engineering and Energy (2025), 4(3), 68–86',
      tags: ['Python', 'NumPy', 'Kaos teorisi', 'Akademik'], paper: 'https://doi.org/10.64470/elene.2025.12'
    },
    {
      group: 'Öne çıkanlar', title: 'ai-context-mapping', slug: 'ai-context-mapping', repo: 'ai-context-mapping',
      desc: 'AI kodlama ajanlarının (Claude Code, Cursor, Copilot) bağlamdan kopmasını, boşa token harcamasını ve koruyucu kodu "temizlemesini" engelleyen çerçeve: proje haritası, makinece okunur kurallar, AST denetimleri ve mutasyon testi. Bağımlılık yok, yalnızca Python standart kütüphanesi.',
      tags: ['Python', 'AI ajanları', 'Geliştirici araçları']
    },
    {
      group: 'Öne çıkanlar', title: 'how-ai-actually-works', slug: 'how-ai-actually-works', repo: 'how-ai-actually-works',
      desc: "Modern AI sistemlerinin altındaki mekanizmalara ilk ilkelerden bir mühendislik rehberi: embedding, tokenizer (BPE), RAG, bağlam mühendisliği, MCP, ajan korkulukları, değerlendirme, çözümleme ve yapılandırılmış çıktı, VRAM ve nicemleme. Sekiz modül, yalnızca standart kütüphaneli Python; her iddia bir kaynakla ya da çalışan bir assert ile kanıtlanır.",
      tags: ['Python', 'LLM', 'RAG', 'MCP', 'Eğitim']
    },
    {
      group: 'Windows araçları', title: 'Limbo', slug: 'limbo', repo: 'Limbo',
      desc: 'Alan adına göre ayrı profiller kullanan DPI aşma motoru: yedi teknik, engellenen alan adlarını kendisi bulan Radar, gerçek bağlantı üzerinde otomatik kalibrasyon, DNS over HTTPS, ECH ve canlı trafik paneli. Paket ayrıştırma AVX2 ile hızlandırılmış.',
      tags: ['C#', '.NET', 'WinDivert', 'Ağ']
    },
    {
      group: 'Windows araçları', title: 'ZeroDivert', slug: 'zerodivert', repo: 'ZeroDivert',
      desc: 'VPN olmadan, hız kaybı olmadan Discord erişimi. Yalnızca Discord\'un TLS el sıkışma paketlerini düzenler, bir yöntem işe yaramazsa otomatik olarak sıradakini dener; geri kalan trafiğe dokunmaz.',
      tags: ['C#', '.NET', 'WinDivert']
    },
    {
      group: 'Windows araçları', title: 'ui2py-pyside6', slug: 'ui2py', repo: 'ui2py-pyside6',
      desc: 'Qt Designer .ui dosyalarını tek tıkla PySide6 Python koduna çeviren masaüstü aracı: toplu dönüştürme, sürükle bırak, sanal ortam algılama, açık ve koyu tema.',
      tags: ['Python', 'PySide6', 'Qt']
    }
  ],
  more: { label: 'Tüm projelerim GitHub\'da', href: 'https://github.com/umitkrkmz?tab=repositories' },

  /* tür: github, linkedin, mail, orcid, sponsor (simge ve renk app.js'te) */
  contact: [
    { kind: 'github', label: 'GitHub', value: 'github.com/umitkrkmz', href: 'https://github.com/umitkrkmz' },
    { kind: 'linkedin', label: 'LinkedIn', value: 'zeynel-umit-korkmaz', href: 'https://www.linkedin.com/in/zeynel-umit-korkmaz' },
    { kind: 'mail', label: 'E-posta', value: 'zeynelumitkorkmaz@gmail.com', href: 'mailto:zeynelumitkorkmaz@gmail.com' },
    { kind: 'orcid', label: 'ORCID', value: '0009-0001-5787-9859', href: 'https://orcid.org/0009-0001-5787-9859' },
    { kind: 'sponsor', label: 'Sponsor', value: 'github.com/sponsors/umitkrkmz', href: 'https://github.com/sponsors/umitkrkmz' }
  ],

  /* "Bu şehir" uygulamasının gündem haberleri: canlı olayların yanında karışık gösterilir */
  news: [
    ['Kedi meclisi toplandı', 'Toplantı tutanağı kayıp. Reis "Patiyle yazılmış, kimse okuyamıyor" dedi, oylama ertelendi.'],
    ['Saat kulesi yine beş dakika ileri', 'Belediye "kule kendi kafasına göre" açıklaması yaptı.'],
    ['Pijamalı Çocuk kimdir?', 'Çatılarda görülen maskeli gencin kimliği hâlâ belirsiz. Komşular pijamasından tanıdığını söylüyor.'],
    ['Tünel yolunda bayram havası', 'Şehre giren araç sayısı rekor kırdı; dağdaki tünel çıkışında kuyruk oluştu.'],
    ['Ördekler gölü paylaşamıyor', 'Parktaki üç ördek arasında nilüfer anlaşmazlığı büyüyor.'],
    ['Ankara simidi fiyatı sabit', 'Fırıncı esnafı "simit ekmek kadar önemli" diyerek zammı reddetti.'],
    ['Otobüs 56 bu sefer zamanında geldi', 'Duraktaki yolcular şaşkınlıklarını gizleyemedi.'],
    ['Geliştirici yine commit attı', 'Meydanın doğusunda dolaşan kapüşonlu vatandaş "bir commit daha, sonra kahve" dedi.'],
    ['Bank sayısı yeterli mi?', 'Parklarda oturacak yer bulamayanlar şikâyetçi; kediler bankları çoktan kapmış durumda.'],
    ['Kuaförde sıra numarası sistemi', 'Berber "Sıra numarası aldım, yine de önce beni al diyen var" diye dert yandı.'],
    ['Çay ocağında yeni rekor', 'Bir çaycı sabahtan beri 412 bardak çay taşıdığını açıkladı. Tepsi dinlenmeye çekildi.'],
    ['Market kasasında poşet tartışması', 'Kasiyer "Poşet ister misiniz?" diye sordu, müşteri on dakika düşündü.'],
    ['Pijamalı Çocuk pijamasını yıkatacak mı?', 'Çamaşırhaneler bu konuda yorum yapmadı. Komşular "en azından deseni güzel" diyor.'],
    ['Saat kulesi kendini savundu', 'Kule adına yapılan açıklamada "Ben doğru gösteriyorum, siz geç kalıyorsunuz" denildi.'],
    ['Reis\'in yeni gözdesi', 'Kedi meclisi başkanı bu hafta en çok kucak sevilen bankı ilan etti. Kesin yeri açıklanmadı.']
  ],

  /* Ankara Haber: hava, olaylar, maç, saat, gün ve mevsime bağlı haber şablonları. Her biri [başlık, metin].
     Gün ve üç saatlik dilimden tohumlanır: aynı gün aynı dilimde aynı seçki, ertesi gün ve sonraki dilimde başkası.
     Yer tutucular: {temp} {max} {min} {feels} {wind} {windFrom} {tmax} {tmin} {drop} (hava), {semt} {semt2} {cadde} {cadde2} {n} (rastgele),
     {cars} {cats} {hero} (şehir), {a} {b} {x} {y} {w} {l} {ws} {ls} {total} {next} (maç), {cad} {sk} {esemt} {time} {status} (olay).
     Ekleri yer tutucuya bitiştirme (Türkçe ses uyumu): "{semt} semtinde", "{cadde} Caddesi'nde" gibi yaz. */
  newsKit: {
    semtler: ['Kızılay', 'Çankaya', 'Ulus', 'Yenimahalle', 'Bahçelievler', 'Kavaklıdere', 'Söğütözü', 'Çukurambar', 'Ayrancı'],
    caddeler: ['Tunalı Hilmi', 'Kennedy', 'Bestekar', 'Kumrular', 'Ziya Gökalp', 'Meşrutiyet', 'Mithatpaşa', 'Sakarya', 'İzmir', 'Konur', 'Cinnah', 'Necatibey', 'Anafartalar', 'Eskişehir'],
    weather: {
      clear: [
        ['Ankara\'da güneş yüzünü gösterdi', 'Hava {temp} derece. Parklarda banklar sabahtan doldu, kediler en güneşli köşeyi çoktan kaptı.'],
        ['Gökyüzünde tek bulut yok', 'Meteoroloji "Bugün şemsiye gereksiz" dedi. {semt} semtinde balkonlarda çamaşır yarışı başladı.'],
        ['Açık hava, açık yüzler', 'Ankaralılar güneşi görünce simidi, çayı kapıp parka koştu. En yüksek sıcaklık {max} derece bekleniyor.']
      ],
      partly: [
        ['Bulutlar gelip gidiyor', 'Bir güneş bir gölge. {semt} sakinleri ceketi giyip çıkarmaktan yoruldu. Hava {temp} derece.'],
        ['Parçalı bulutlu bir Ankara günü', 'Ne tam güneş ne tam bulut. Uzmanlar "Ankara\'nın en Ankara hâli" yorumunu yaptı.']
      ],
      overcast: [
        ['Gökyüzü griye boyandı', 'Kapalı hava {temp} derecede seyrediyor. Çay ocakları "tam çay havası" diyerek ikinci semaveri yaktı.'],
        ['Güneş bugün izinli', 'Bulutlar şehrin üstüne kurulmuş durumda. Yağış beklenmiyor ama şemsiyesini alan pişman olmuyor.']
      ],
      fog: [
        ['Ankara sise gömüldü', 'Görüş mesafesi birkaç yüz metreye düştü. Sürücüler farlarını yaktı, saat kulesi bile kendi saatini zor görüyor.'],
        ['Sisli hava, yavaş trafik', '{cadde} Caddesi\'nde araçlar ağır ilerliyor. Yetkililer takip mesafesine dikkat çekti.']
      ],
      drizzle: [
        ['İnce ince çiseliyor', 'Şemsiye açmaya değmeyecek kadar, saçı bozacak kadar. Hava {temp} derece.'],
        ['Çisenti şehri ıslattı', 'Kaldırımlar parlıyor, kediler saçak altına çekildi. {semt} semtinde çay ocakları doldu.']
      ],
      rain: [
        ['Ankara\'ya yağmur geldi', 'Yağış bir süre daha sürebilir. {semt} semtinde birikintilerden atlayanlar görüntülendi.'],
        ['Şemsiyeler açıldı', 'Yağmur {temp} derecede yağıyor. Otobüs duraklarında saçak altında yer kalmadı.'],
        ['Islak yol uyarısı', 'Yollar kaygan. Sürücülerin hızını düşürmesi, yayaların birikinti kenarından uzak durması öneriliyor.']
      ],
      storm: [
        ['Gök gürültülü fırtına', 'Şimşekler Söğütözü\'nün kulelerini aydınlattı. Vatandaşlar balkonda unuttukları minderler için endişeli.'],
        ['Fırtına uyarısı', 'Rüzgâr saatte {wind} kilometreye ulaştı. Yetkililer gerekmedikçe dışarı çıkılmamasını istedi.']
      ],
      snow: [
        ['Ankara beyaza büründü', 'Kar yağışı sürüyor. Çocuklar kardan adam için parklara akın etti, Reis pencerenin önünden ayrılmıyor.'],
        ['Kar geldi, gözler valilikte', 'Öğrenciler okullarla ilgili açıklamayı bekliyor. Hava {temp} derece.'],
        ['Kaldırımlar buz tutabilir', 'Belediye tuzlama çalışmalarına başladı. Yayaların dikkatli yürümesi rica edildi.']
      ],
      hot: [['Sıcaklık {temp} dereceyi buldu', 'Ankara\'nın kuru sıcağı bastırdı. Dondurmacılar sezonun en iyi gününü yaşıyor.']],
      cold: [['Ankara ayazı geri döndü', 'Termometreler {temp} dereceyi gösteriyor, hissedilen {feels}. Simitçiler sıcak simidin tam zamanı olduğunu söylüyor.']],
      windy: [['Rüzgâr esiyor, şapkalar uçuyor', 'Saatte {wind} kilometreyle {windFrom} esen rüzgâr Kızılay\'da şemsiyeleri ters çevirdi.']]
    },
    tomorrow: {
      rain: [['Yarın şemsiyeyi unutmayın', 'Meteoroloji yarın için yağış bekliyor. En yüksek sıcaklık {tmax} derece.']],
      snow: [['Yarın kar var', 'Tahminlere göre yarın kar yağışı bekleniyor; en düşük sıcaklık {tmin} derece.']],
      storm: [['Yarın fırtına bekleniyor', 'Meteoroloji yarın için gök gürültülü sağanak uyarısı yaptı.']],
      clear: [['Yarın güneşli', 'Plan yapanlara müjde: yarın hava açık, sıcaklık {tmax} dereceye çıkacak.']],
      colder: [['Hava soğuyor', 'Yarın en yüksek sıcaklık {drop} derece düşüyor. Montları dolaptan çıkarma vakti.']]
    },
    event: {
      fire: [
        ['{cad} Caddesi\'nde yangın', 'Saat {time} sularında {esemt} semtinde bir binadan duman yükseldi; itfaiye ekipleri müdahale etti. Son durum: {status}.'],
        ['Yangın paniği', '{cad} Caddesi ile {sk} Sokağı\'nın kesiştiği köşedeki binada yangın çıktı. Son durum: {status}.']
      ],
      accident: [
        ['{cad} Caddesi\'nde trafik kazası', 'Saat {time} sularında iki araç çarpıştı. Ambulans ve polis olay yerine yönlendirildi. Son durum: {status}.'],
        ['Kaza trafiği yavaşlattı', '{esemt} semtinde yaşanan kaza nedeniyle {cad} Caddesi\'nde uzun kuyruk oluştu. Son durum: {status}.']
      ],
      crime: [
        ['{esemt} semtinde hırsızlık', 'Saat {time} sularında kaçmaya çalışan şüpheli için polis harekete geçti. Son durum: {status}.'],
        ['Hırsız {sk} Sokağı\'ndan kaçtı', 'Görgü tanıkları şüphelinin kavşaktan kavşağa koştuğunu anlattı. Son durum: {status}.']
      ],
      pedestrian: [
        ['{cad} Caddesi\'nde yaya kazası', 'Saat {time} sularında karşıdan karşıya geçen bir yayaya araç çarptı. Son durum: {status}.'],
        ['Sürücülere yaya uyarısı', '{esemt} semtindeki kazanın ardından yetkililer yaya geçitlerinde yavaşlanması çağrısı yaptı. Son durum: {status}.']
      ]
    },
    hero: [['Pijamalı Çocuk bugün {hero} hırsız yakaladı', 'Çatılarda dolaşan maskeli genç, polis gelmeden şüphelileri ağla sarıp kaldırıma bıraktı. Kimliği hâlâ sır.']],
    calm: [['Şehirde sakin bir gün', 'Bugün şimdiye kadar ciddi bir olay yaşanmadı. Ekipler istasyonlarında çay demledi.']],
    match: {
      win: [
        ['Ankara Stadı\'nda {w} sevinci', '{w}, {l} karşısında {ws}-{ls} kazandı. Taraftarlar maçtan sonra korna çalarak Kızılay\'a yürüdü.'],
        ['{w} sahadan galip ayrıldı', 'Son düdük çaldığında tabelada {ws}-{ls} yazıyordu. {l} cephesinde hakem kararlarına tepki var.']
      ],
      draw: [['Ankara Stadı\'nda kazanan çıkmadı', '{a} ile {b} {x}-{y} berabere kaldı. İki taraf da maçtan sonra "hakem" dedi.']],
      goals: [['Gol yağmuru', '{a} ile {b} arasındaki maçta tam {total} gol atıldı. Tribünler sesini kaybetti.']],
      live: [['Ankara Stadı\'nda maç sürüyor', '{a} ile {b} karşı karşıya. Skor şu an {x}-{y}, tribünler dolu.']],
      rainy: [['Maç yağmur altında', 'Saha kayganlaştı, oyuncular sık sık yere düşüyor. Taraftarlar şemsiye yerine atkılarına sarıldı.']],
      upcoming: [
        ['Gözler Ankara Stadı\'nda', 'Semt takımları saat {next} itibarıyla sahada olacak. Bilet gişelerinde kuyruk var.'],
        ['Derbi heyecanı', 'Saat {next} maçı öncesi {semt} taraftarları marşlarını tazeledi.']
      ]
    },
    time: {
      morning: [
        ['Sabah trafiği başladı', '{cadde} Caddesi\'nde araçlar ağır ilerliyor. Otobüs duraklarında kalabalık var.'],
        ['Simit kuyrukları uzadı', 'Fırınların önü sabah erkenden doldu. {semt} semtinde ilk simitler on dakikada tükendi.']
      ],
      noon: [
        ['Öğle arası çay ocaklarında yer yok', '{semt} semtinde çalışanlar öğle arasında çay ocaklarına akın etti; tavla masaları kapışıldı.'],
        ['Döner kuyruğu', 'Öğle saatlerinde {cadde} Caddesi\'ndeki dönercilerin önünde {n} metrelik kuyruk oluştu.']
      ],
      afternoon: [['İkindi çayı vakti', 'Kafelerde masalar doldu. Garsonlar "bugün kimse ayran içmiyor" diye şaşkın.']],
      evening: [
        ['Akşam trafiği', 'İş çıkışı saatlerinde {cadde} ve {cadde2} caddelerinde yoğunluk var.'],
        ['Tunalı\'da akşam kalabalığı', 'Gün batarken kafeler ve kitapçılar doldu. Sokak müzisyenleri bugünkü listesini açıkladı.']
      ],
      catsSoon: [['Kedi meclisi bu gece toplanıyor', 'Merkezdeki parkta saat 21.30\'da başlayacak toplantının gündemi: {agenda}.']],
      catsNow: [['Kedi meclisi şu an toplantıda', 'Gündem: {agenda}. Reis kürsüde, sekiz üye çember olmuş, kimse kimseyi dinlemiyor.']],
      night: [['Gece Ankara\'sı', 'Kafeler kapanmaya yakın, son otobüsler duraklardan kalktı. Şehir uykuya hazırlanıyor.']]
    },
    weekday: {
      1: [['Pazartesi sendromu', 'Uzmanlar uyardı: Bugün kahve tüketimi hafta ortalamasının iki katına çıkabilir.']],
      3: [['Hafta ortası', 'Çarşamba geldi; Ankaralılar "hafta yarılandı" diyerek kendini teselli ediyor.']],
      5: [['Hafta sonu kapıda', 'Cuma trafiği erken başladı. Plan yapmayanlar "son anda bir şey çıkar" diyor.']],
      6: [['Hafta sonu kahvaltısı', 'Ankaralılar serpme kahvaltı için Ayrancı ve Kavaklıdere\'deki mekânları doldurdu.']],
      0: [['Pazar keyfi', 'Şehir geç uyandı. Parklarda pikniğe çıkanlar, bisiklet sürenler ve gazete okuyanlar var.']]
    },
    /* özel günler (AA-GG); solemn: o gün şaka haber çıkmaz */
    dates: {
      '01-01': { items: [['Yeni yıla merhaba', 'Ankara yeni yıla Kızılay\'da geri sayımla girdi. Herkese mutlu yıllar!']] },
      '04-23': { items: [['23 Nisan coşkusu', 'Çocuklar bugün şehrin yönetimini devraldı. İlk karar: parklara daha çok salıncak.']] },
      '05-19': { items: [['19 Mayıs kutlu olsun', 'Gençlik ve Spor Bayramı\'nda Ankara Stadı\'nda gösteriler yapılıyor.']] },
      '08-30': { items: [['Zafer Bayramı kutlu olsun', 'Ankara bayraklarla donandı; törenler Anıtkabir\'de başladı.']] },
      '10-13': { items: [['Ankara bugün başkent oldu', '13 Ekim 1923\'te başkent ilan edilen Ankara bir yaşını daha kutluyor.']] },
      '10-28': { items: [['Yarın Cumhuriyet Bayramı', 'Şehir bayram hazırlığında; caddeler bayraklarla süsleniyor.']] },
      '10-29': { items: [['Cumhuriyet Bayramı kutlu olsun', 'Ankara bayraklarla donandı. Kutlamalar akşam fener alayıyla sürecek.']] },
      '11-10': { solemn: true, items: [['Ankara saat 09.05\'te durdu', 'Atatürk ölümünün yıl dönümünde saygıyla anılıyor; Anıtkabir\'e ziyaretçi akını sürüyor.']] },
      '12-31': { items: [['Yılın son günü', 'Marketlerde mandalina ve nar rafları boşaldı. Geri sayım gece yarısı Kızılay\'da.']] }
    },
    season: {
      autumn: [['Sonbahar Ankara\'da', 'Kuğulu Park\'ın ağaçları sarardı, kaldırımlar yaprakla kaplandı. Kestaneciler köşe başlarını tuttu.']],
      winter: [['Salep zamanı', 'Soğuk havayla birlikte salep satışları arttı. Simitçiler tarçını tükettiğini söylüyor.']],
      spring: [['Bahar geldi', 'Ağaçlar çiçek açtı, parklarda banklar yeniden doldu. Kediler güneşlenme mevsimini açtı.']],
      summer: [['Şehir yaz tatilinde', 'Ankaralıların yarısı Ege\'de. Kalanlar "trafik ne güzel" diyor.']]
    },
    city: [
      ['Yollarda {cars} araç', 'Şu an şehir yollarında {cars} araç var. Trafik polisi "Kavşaklarda sabırlı olun" çağrısı yaptı.'],
      ['Sokak kedisi sayımı', 'Belediyenin sayımına göre şehirde {cats} sokak kedisi var. Kediler sayıma itiraz etti.']
    ]
  },

  /* "Bu şehir nasıl yapıldı" bölümü */
  how: [
    ['Pencerelerin ardındaki odalar', 'Her pencereye geometri koymak yerine cephe shader\'ında "interior mapping": duvar, zemin, tavan ve mobilya bakış açısıyla değişir. Yakındaki birkaç pencerede cam gerçekten açılır, arkasında televizyon izleyen, yemek yapan insanlar vardır.'],
    ['Ayrıntı kademeleri', 'Kuş bakışından göz hizasına dört kademe: uzakta bina başına tek malzeme ve tek çizim çağrısı, yaklaştıkça tabelalar, tenteler, yayalar ve iç mekânlar açılır.'],
    ['Örnekli çizim', 'Araçlar, insanlar, ağaçlar, kediler ve tribündeki taraftarlar InstancedMesh ile: binlerce nesne, birkaç çizim çağrısı. Kedilerin tüy desenleri bile shader\'da üretilir.'],
    ['Trafik', 'Kavşak düğümleri ve yönlü kenarlardan oluşan yol ağı, Bezier dönüşler, ışıklar, sinyaller. Acil durum araçları kapalı yolu geçen BFS rotasıyla gider, öndekiler kenara çekilir.'],
    ['Vadi', 'fbm gürültüsüyle dağlar; yol ve akarsu boyunca açılan vadiler, ormanlar, tünele giren dört şeritli yol ve şehre girip çıkan trafik.']
  ]
};

/* ---------- haber havuzlarının ikinci partisi: yukarıdaki newsKit'e eklenir (dizi ise uca eklenir, nesne ise iç içe birleşir).
   Yeni türler: olay sonrası (fireDone…), adlı maç önizlemesi (upcomingTeams), günün kedisi (catDay), geliştirici (dev), ulaşım (transit),
   semt (semt[ad]), esnaf, kültür, kahraman (heroAny), nem (humid), hissedilen (chilly), ısınma (tomorrow.warmer) ---------- */
(function (P) {
  const more = {
    weather: {
      clear: [
        ['Mavi gök, uzun gölgeler', 'Güneş {semt} semtinin kaldırımlarını ısıttı. Hava {temp} derece, gün boyu açık bekleniyor.'],
        ['Güneş gözlüğü satışları arttı', '{cadde} Caddesi\'ndeki optikçiler "bugün herkes gözlük soruyor" diyor. Hava {temp} derece.']
      ],
      partly: [
        ['Gökte bulut trafiği', 'Bulutlar Kızılay üzerinden Çankaya\'ya doğru ilerliyor. Arada güneş de görünüyor.'],
        ['Güneşle bulut arasında', 'Hava {temp} derece. Uzmanlar ceketi yanınızda taşımanızı öneriyor, giymek size kalmış.'],
        ['Parçalı bulut, tam yürüyüş havası', '{semt} semtinde parklar doldu. Ne çok sıcak ne çok soğuk.']
      ],
      overcast: [
        ['Bulutlar alçaldı', 'Söğütözü\'nün kuleleri bulutlara değecek gibi. Hava {temp} derece, yağış beklenmiyor.'],
        ['Kapalı havada çay mesaisi', '{semt} semtinde çay ocakları "bugün herkes ikinci bardağı istiyor" diyor.'],
        ['Gri bir Ankara günü', 'Güneş bulutların arkasında saklanıyor. Fotoğrafçılar "ışık yumuşak, tam çekimlik" diyor.']
      ],
      fog: [
        ['Sis, saat kulesini yuttu', 'Meydandaki saat kulesi sabah saatlerinde görünmez oldu. Saati soranlar telefonlarına baktı.'],
        ['Görüş mesafesi düştü', 'Tünel yolunda sürücülerin sis farlarını yakması isteniyor.'],
        ['Sisli şehirde kayıp kedi yok', 'Kediler sisi fırsat bilip parkta saklambaç oynadı. Hepsi akşam yerinde bulundu.']
      ],
      drizzle: [
        ['Şemsiye mi, değil mi?', 'Çisenti şehri ikiye böldü: şemsiye açanlar ve "bu yağmur sayılmaz" diyenler.'],
        ['Kaldırımlar ıslak', '{cadde} Caddesi\'nde yürüyenler dikkatli: hafif yağış zemini kayganlaştırdı.'],
        ['Çisentiye rağmen simit kuyruğu', 'Fırınların önündeki kuyruk çisentiye aldırmadı. Hava {temp} derece.']
      ],
      rain: [
        ['Sağanak birikinti bıraktı', '{semt} semtinde kaldırım kenarlarında su birikintileri oluştu. Sürücülerin yayaları ıslatmaması rica edildi.'],
        ['Yağmurda otobüs kalabalığı', 'Yağmurla birlikte otobüsler doldu. 34 numaralı hatta ayakta yolculuk yapanlar var.']
      ],
      storm: [
        ['Rüzgâr tabelaları salladı', 'Fırtına {semt} semtinde dükkân tabelalarını salladı. Yetkililer balkonlardaki eşyaların içeri alınmasını istedi.'],
        ['Elektrik kesintisi yok', 'Fırtınaya rağmen şebekede sorun yaşanmadı. Şimşekler ise gösteriye devam ediyor.'],
        ['Fırtınada kediler saçak altında', 'Kedi meclisi bu akşam olağanüstü toplanabilir. Reis açıklama yapmadı.']
      ],
      snow: [
        ['Kardan adam yarışması', '{semt} semtindeki parkta çocuklar kardan adam yaptı. En uzunu bir metreyi geçti.'],
        ['Karda trafik yavaş', '{cadde} Caddesi\'nde araçlar ağır ilerliyor. Belediye ekipleri tuzlama yapıyor.']
      ],
      humid: [['Hava nemli', 'Nem oranı yüzde {hum} oldu. Saçlar kabardı, çamaşırlar kurumuyor.']],
      chilly: [['Hissedilen daha soğuk', 'Termometre {temp} derece gösteriyor ama hissedilen {feels}. Rüzgâr yüzünden mont şart.']]
    },
    tomorrow: {
      rain: [['Yarın yağış var', 'Tahminlere göre yarın şehirde yağmur bekleniyor. En düşük sıcaklık {tmin} derece.']],
      snow: [['Kar kapıda', 'Yarın kar bekleniyor. Okulların durumu henüz belli değil.']],
      storm: [['Yarın şimşekler çakacak', 'Meteoroloji yarın için kuvvetli sağanak ve gök gürültüsü bekliyor.']],
      clear: [['Yarın açık hava', 'Yarın güneşli bir gün bekleniyor; en yüksek sıcaklık {tmax} derece.']],
      colder: [['Montları hazırlayın', 'Yarın sıcaklık {drop} derece düşüyor; en yüksek {tmax} derece.']],
      warmer: [['Hava ısınıyor', 'Yarın sıcaklık {rise} derece artıyor; en yüksek {tmax} dereceyi görecek.']]
    },
    event: {
      fire: [
        ['{esemt} semtinde yangın alarmı', 'Saat {time} sularında yükselen duman mahalleliyi sokağa döktü. Son durum: {status}.'],
        ['İtfaiye {cad} Caddesi\'nde', 'Sirenler {esemt} semtinde yankılandı; trafik kısa süreliğine durdu. Son durum: {status}.']
      ],
      fireDone: [
        ['{cad} Caddesi\'ndeki yangın söndürüldü', 'İtfaiye ekipleri saat {time} sularında çıkan yangını kısa sürede kontrol altına aldı. Yaralı yok.'],
        ['Yangın kontrol altında', '{esemt} semtindeki binada çıkan yangın söndürüldü. Ekipler soğutma çalışması yapıyor.']
      ],
      accident: [
        ['{cad} Caddesi\'nde maddi hasarlı kaza', 'İki araç saat {time} sularında çarpıştı; sürücüler araçtan inip tartıştı. Son durum: {status}.'],
        ['Kavşakta kaza', '{esemt} semtindeki kavşakta yaşanan kaza trafiği aksattı. Son durum: {status}.']
      ],
      accidentDone: [
        ['{cad} Caddesi trafiğe açıldı', 'Saat {time} sularında yaşanan kazanın ardından yol temizlendi, trafik normale döndü.'],
        ['Kaza sonrası yol açıldı', '{esemt} semtindeki kazada yaralanan olmadı; araçlar çekildi.']
      ],
      crime: [
        ['{esemt} semtinde kovalamaca', 'Şüpheli kaldırımlar boyunca kaçtı, vatandaşlar polise yol gösterdi. Son durum: {status}.'],
        ['Dükkândan hırsızlık', '{cad} Caddesi\'ndeki bir dükkândan çıkan şüpheli aranıyor. Son durum: {status}.']
      ],
      crimeDone: [
        ['{esemt} semtindeki hırsız yakalandı', 'Saat {time} sularında kaçan şüpheli kısa sürede yakalandı. Son durum: {status}.'],
        ['Kovalamaca bitti', '{cad} Caddesi\'nde başlayan kovalamaca, şüphelinin yakalanmasıyla sona erdi. Son durum: {status}.']
      ],
      pedestrian: [['Yaya geçidinde dikkat', '{esemt} semtinde bir yayaya araç çarptı; ambulans olay yerine yönlendirildi. Son durum: {status}.']],
      pedestrianDone: [
        ['Yaralı yaya hastaneye kaldırıldı', '{cad} Caddesi\'nde aracın çarptığı yaya ambulansla hastaneye götürüldü; durumu iyi.'],
        ['Yaya kazasının ardından trafik normale döndü', '{esemt} semtindeki kazanın ardından yol yeniden açıldı.']
      ]
    },
    hero: [['Polisin işi kolaylaştı', 'Pijamalı Çocuk bugün {hero} şüpheliyi ağla sardı. Polis "teşekkürler ama izinsiz" dedi.']],
    heroAny: [
      ['Pijamalı Çocuk yine çatılarda', '{semt} semtinde gece boyunca çatıdan çatıya sallanan bir gölge görüldü.'],
      ['Pijamalı Çocuk için imza kuyruğu', 'Hayranları {cadde} Caddesi\'nde onu bekledi ama kahraman gelmedi.'],
      ['Ağ kalıntıları temizlendi', 'Belediye ekipleri {semt} semtindeki direklerden ağ parçalarını topladı.']
    ],
    calm: [['Sakin bir gün', 'Ekipler bugün sadece kedileri ağaçtan indirdi.']],
    match: {
      win: [
        ['{w} rakibini geçti', '{w}, {l} karşısında {ws}-{ls} kazandı. Teknik direktör "çocuklar sahada her şeyi verdi" dedi.'],
        ['{l} cephesinde hayal kırıklığı', '{ls}-{ws} biten maçın ardından {l} taraftarları stadyumu sessizce terk etti.']
      ],
      draw: [
        ['Puanlar paylaşıldı', '{a} ile {b} arasındaki maç {x}-{y} bitti. Tribünler sonucu beğenmedi.'],
        ['Kıran kırana bir beraberlik', '{a} ile {b} 90 dakika boyunca birbirine üstünlük kuramadı.']
      ],
      goals: [['Golcüler sahnede', '{a} ile {b} toplam {total} gol attı; skor tabelası zor yetişti.']],
      live: [
        ['Ankara Stadı\'nda nefesler tutuldu', 'Skor {x}-{y}. {a} ile {b} arasındaki mücadele tüm hızıyla sürüyor.'],
        ['Tribünler ayakta', '{a} ile {b} karşılaşıyor; skor şu an {x}-{y}.']
      ],
      upcomingTeams: [
        ['{a} ile {b} sahaya çıkıyor', 'Semt derbisi saat {next} itibarıyla Ankara Stadı\'nda. Biletler tükenmek üzere.'],
        ['Günün maçı: {a} - {b}', 'İki takım saat {next} itibarıyla karşı karşıya. Taraftarlar şimdiden stada yürüyor.'],
        ['Derbi günü', '{a} ve {b} taraftarları maç öncesi Kızılay\'da buluştu. Karşılaşma saat {next} itibarıyla.']
      ]
    },
    time: {
      morning: [
        ['Okul servisleri yolda', '{semt} semtinde sabah saatlerinde servis araçları trafiği yoğunlaştırdı.'],
        ['Sabah koşucuları parkta', '{semt} semtindeki parkta erken saatte koşanlar ördekleri uyandırdı.']
      ],
      noon: [
        ['Öğle güneşi', '{cadde} Caddesi\'nde öğle arası yürüyüşe çıkanlar kafelerin önünde mola verdi.'],
        ['Ofislerde öğle telaşı', 'Söğütözü\'nün kulelerinden inen çalışanlar asansör kuyruğunda bekledi.']
      ],
      afternoon: [
        ['İkindi trafiği başladı', '{cadde} Caddesi\'nde okul çıkışıyla birlikte trafik yavaşladı.'],
        ['Parklarda öğleden sonra', '{semt} semtinde banklar doldu; kediler en iyi yerleri çoktan kaptı.']
      ],
      evening: [
        ['Gün batımı', 'Gökyüzü kızıla döndü; Atakule\'nin ışıkları yandı.'],
        ['Akşam yemeği telaşı', 'Marketlerde ekmek rafları akşam saatlerinde boşaldı.']
      ],
      catsSoon: [['Bu gece meclis var', 'Reis toplantıya çağrı yaptı. Gündem: {agenda}. Üyelerin geç kalmaması istendi.']],
      catsNow: [['Meclisten ilk sesler', 'Bu gecenin gündemi {agenda}. Toplantıdan miyavlamalar yükseliyor.']],
      night: [
        ['Gece nöbeti', 'İtfaiye ve polis ekipleri gece nöbetini devraldı. Şehir sakin.'],
        ['Gece yarısı simitçisi', '{semt} semtinde gece geç saatte simit satan seyyar satıcı ilgi gördü.']
      ]
    },
    weekday: {
      1: [['Haftanın ilk günü', 'Kahve kuyrukları uzun, servisler kalabalık. Herkes "bu hafta kesin erken yatacağım" diyor.']],
      2: [['Salı sakinliği', 'Haftanın en sıradan günü diye bilinen salı, bugün de beklentileri karşıladı.']],
      3: [['Çarşamba pazarı', '{semt} semtinde kurulan pazarda sebze fiyatları konuşuldu.']],
      4: [['Perşembe akşamı', 'Kafeler "hafta sonu başlamadan son bir kahve" diyenlerle doldu.']],
      5: [['Cuma akşamı planları', 'Tunalı\'da masalar erkenden ayrıldı.']],
      6: [['Cumartesi alışverişi', 'Kızılay\'daki dükkânlarda hafta sonu kalabalığı başladı.']],
      0: [['Pazar kahvaltısı', 'Fırınlarda simit ve poğaça kuyruğu öğlene kadar sürdü.']]
    },
    dates: {
      '02-14': { items: [['Sevgililer Günü', 'Çiçekçilerde kırmızı gül kalmadı. Kediler de günü kutladı, en azından öyle görünüyor.']] },
      '03-08': { items: [['Dünya Kadınlar Günü', 'Ankara\'da Dünya Kadınlar Günü etkinliklerle kutlanıyor.']] },
      '03-18': { solemn: true, items: [['18 Mart Çanakkale Zaferi', 'Çanakkale şehitleri saygı ve rahmetle anılıyor.']] },
      '06-21': { items: [['Yılın en uzun günü', 'Güneş bugün Ankara\'da 15 saatten fazla gökte kalacak.']] },
      '11-24': { items: [['Öğretmenler Günü', 'Öğrenciler öğretmenlerine çiçek ve kartlarla teşekkür etti.']] },
      '12-21': { items: [['Yılın en uzun gecesi', 'Bu gece yılın en uzun gecesi. Kedi meclisi toplantıyı uzatmayı planlıyor.']] }
    },
    season: {
      autumn: [['Kestane kokusu', 'Köşe başlarında kestane közleyen satıcılar şehre geri döndü.'], ['Sararan yapraklar', 'Belediye ekipleri {semt} semtinde yaprak toplama çalışması başlattı.']],
      winter: [['Kalorifer sezonu', 'Kediler sıcak petek önlerini paylaşamıyor.'], ['Kış güneşi', 'Soğuk ama güneşli günlerde parklar yine doldu.']],
      spring: [['Erik çiçekleri açtı', 'Parklardaki ağaçlar beyaza büründü.'], ['Bahar temizliği', 'Balkonlarda halı silkeleyenler {semt} semtinde mesaiye başladı.']],
      summer: [['Dondurma kuyrukları', '{cadde} Caddesi\'ndeki dondurmacılarda akşam kuyruğu oluştu.'], ['Yaz akşamları', 'Parklarda geç saatlere kadar oturanlar var; kediler memnun.']]
    },
    city: [
      ['Banklarda yer kalmadı', 'Şehrin banklarında oturacak yer bulunmuyor; kediler "biz önce geldik" diyor.'],
      ['Otobüs hatlarında yoğunluk', '12, 34 ve 56 numaralı hatlarda yolcu sayısı arttı.'],
      ['Tünel yolunda akış', 'Dağdaki tünelden şehre giren araçlar doğu kavşağında sıra oluşturdu.']
    ],
    catDay: [
      ['Günün kedisi: {cat}', '{cat} bugün {semt} semtinde en çok sevilen kedi seçildi. Rengi: {coat}.'],
      ['{cat} kucaktan inmedi', 'Muhabirimizin tespitine göre {cat} bugün en az on kişiye kendini sevdirdi.'],
      ['Mahallenin yıldızı {cat}', '{semt} semtinde mama kabının başından ayrılmayan {cat} mahallenin gündemine oturdu.']
    ],
    dev: [
      ['Kapüşonlu geliştirici görüldü', 'Muhabirimiz meydanın doğusunda yaşayan geliştiriciyi gördü: {where}.'],
      ['Geliştirici nerede?', 'Telefonunda portfolyosu olan geliştirici şu sıralar ne yapıyor? Cevap: {where}.'],
      ['"Bir commit daha"', 'Geliştiriciyi soranlara kısa cevap: {where}. Yanında yine sırt çantası var.']
    ],
    /* saatlik trafik (traffic.js C.trafficLevel'ın anahtarları) */
    rush: {
      morning: [
        ['Sabah trafiği başladı', '{cadde} Caddesi\'nde araçlar adım adım ilerliyor. Ofise yetişmeye çalışanlar kornaya sarıldı.'],
        ['Kızılay\'da sabah yoğunluğu', 'Okul servisleri ve ofis yolcuları aynı saatte yola çıktı. Kavşaklarda kuyruk var.'],
        ['Tünel yolunda kuyruk', 'Şehre dağ tünelinden girmek isteyenler doğu kavşağında bekliyor.']
      ],
      evening: [
        ['Akşam trafiği zirvede', 'Mesai bitti, {cadde} Caddesi\'nde kırmızı ışıkta beklemeyen yok.'],
        ['Eve dönüş yoğunluğu', '{semt} çıkışında araçlar tampon tampona. Otobüs şeridi bu saatte altın değerinde.'],
        ['Söğütözü\'nden çıkış zor', 'Kulelerden inenler aynı anda otoparktan çıkınca yan sokaklar da doldu.']
      ],
      night: [
        ['Yollar boş', 'Gece yarısından sonra {cadde} Caddesi\'nde yalnızca birkaç taksi ve itfaiye aracı var.'],
        ['Gece sakinliği', 'Trafik ışıkları kimse için yanıp sönüyor. Kediler yolun ortasından karşıya geçiyor.']
      ],
      weekend: [
        ['Hafta sonu trafiği rahat', 'Sabah erken kimse yola çıkmadı. Öğleden sonra çarşılara doğru hareketlilik başladı.'],
        ['Tunalı\'da park yeri yok', 'Hafta sonu kahvaltısına gelenler park yeri bulmak için semti üç kez turladı.']
      ]
    },
    transit: [
      ['Otobüs {line} zamanında', '{line} numaralı hat bugün tarifesine uydu. Yolcular şaşkın.'],
      ['{line} numaralı hatta kalabalık', '{semt} semtindeki durakta bekleyenler otobüse sığmakta zorlandı.'],
      ['Durakta bekleme', '{line} numaralı otobüsün durakta bekleme süresi ortalama {n} dakika oldu.'],
      ['Şoförden anons', '{line} numaralı hattın şoförü "arkalara doğru ilerleyelim" çağrısı yaptı.']
    ],
    semt: {
      'Kızılay': [['Güvenpark\'ta güvercinler', 'Kızılay\'da simit kırıntısı arayan güvercinler meydanı doldurdu.'], ['Kızılay\'da kitapçı haftası', 'Sakarya Caddesi\'ndeki kitapçılar ikinci el kitap haftası başlattı.']],
      'Ulus': [['Ulus\'ta tarihi çarşı kalabalığı', 'Hanlar bölgesinde bakırcılar ve kuru meyve satan dükkânlar ziyaretçi akınına uğradı.'], ['Kale yolunda yürüyüş', 'Ulus\'tan Ankara Kalesi\'ne yürüyen gezi grupları görüldü.']],
      'Kavaklıdere': [['Tunalı\'da yeni kafe', 'Tunalı Hilmi Caddesi\'nde bir kafe daha açıldı; sayısını bilen yok.'], ['Kuğulu Park\'ta kuğular', 'Kuğulu Park\'ın kuğuları bugün de ziyaretçilerden simit kabul etmedi.']],
      'Bahçelievler': [['7. Cadde\'de akşam yürüyüşü', 'Bahçelievler\'in ünlü caddesi akşam saatlerinde yürüyenlerle doldu.'], ['Bahçelievler\'de fırın kuyruğu', 'Mahallenin eski fırınının önünde sabah erkenden kuyruk oluştu.']],
      'Çankaya': [['Atakule\'de manzara', 'Atakule\'ye çıkanlar şehri baştan sona izledi; dağlar bugün net göründü.'], ['Çankaya yokuşu', 'Çankaya yokuşunu bisikletle çıkanlar bugün de nefes nefese kaldı.']],
      'Söğütözü': [['Kuleler arasında rüzgâr', 'Söğütözü\'nün kuleleri arasında esen rüzgâr şemsiyeleri zorladı.'], ['Plazalarda yoğun gün', 'Söğütözü\'nde öğle arasında asansörler hiç boş kalmadı.']],
      'Çukurambar': [['Çukurambar\'da kahve rekoru', 'Plazaların arasındaki kahvecilerde öğleden önce yüzlerce bardak satıldı.'], ['Çukurambar\'da mesai çıkışı', 'Mesai bitiminde Çukurambar\'ın ara sokakları doldu.']],
      'Ayrancı': [['Ayrancı\'da sakin sokaklar', 'Ayrancı\'nın ağaçlı sokaklarında yürüyenler kuş seslerini dinledi.'], ['Ayrancı\'da mahalle pazarı', 'Pazarın ilk saatlerinde domatesler bitti.']],
      'Yenimahalle': [['Yenimahalle\'de bahçeler', 'Müstakil evlerin bahçelerinde son domatesler toplandı.'], ['Yenimahalle\'de tavla turnuvası', 'Mahallenin çay bahçesinde tavla turnuvası sürüyor.']]
    },
    esnaf: [
      ['Simitçiler fiyatı sabit tuttu', 'Ankara simidinin fiyatı bu hafta da değişmedi; esnaf "simit herkesin hakkı" diyor.'],
      ['Çay ocağında yeni semaver', '{semt} semtindeki çay ocağı yeni semaverini tanıttı. Müdavimler "çay daha demli" diyor.'],
      ['Berberde sıra', '{cadde} Caddesi\'ndeki berberde hafta sonu sırası şimdiden doldu.'],
      ['Çiçekçide mevsim', 'Çiçekçiler bu hafta en çok saksı çiçeği sattığını açıkladı.'],
      ['Tamirci ustası konuştu', '"Ekranı kırık telefonla gelenler arttı" diyen usta kılıf kullanmayı öneriyor.']
    ],
    kultur: [
      ['Sokak müzisyenleri sahnede', '{cadde} Caddesi\'nde bir bağlama ve bir gitar akşam boyunca çaldı.'],
      ['Kitapçıda imza günü', '{semt} semtindeki kitapçıda yerel bir yazar okurlarıyla buluştu.'],
      ['Açık hava sineması', 'Parkta kurulan perdede bu akşam eski bir Türk filmi gösteriliyor.'],
      ['Resim sergisi açıldı', 'Kızılay\'daki galeride Ankara sokaklarını anlatan bir sergi açıldı.'],
      ['Konser söylentisi', 'Ankara Stadı\'nda hafta sonu konser düzenleneceği konuşuluyor; biletler henüz satışta değil.']
    ]
  };
  const merge = (a, b) => { for (const k in b) { if (Array.isArray(b[k])) a[k] = (a[k] || []).concat(b[k]); else if (b[k] && typeof b[k] === 'object') a[k] = merge(a[k] || {}, b[k]); else a[k] = b[k]; } return a; };
  merge(P.newsKit, more);
  P.news = P.news.concat([
    ['Ördekler grev yaptı', 'Parktaki ördekler simit yerine poğaça istedi. Görüşmeler sürüyor.'],
    ['Saat kulesi bir dakika geri kaldı', 'Yetkililer "kule dinleniyordu" açıklamasını yaptı.'],
    ['Kedi meclisinde istifa', 'Bir üye "mama dağıtımı adil değil" diyerek istifa etti, beş dakika sonra geri döndü.'],
    ['Ağ kullanım kılavuzu yayımlandı', 'Pijamalı Çocuk\'un kılavuzunun ilk maddesi: "Kedilere ağ atılmaz."'],
    ['Banklar boyandı', 'Belediye bankları yeniledi; kediler boyanın kurumasını beklemeden oturdu.'],
    ['Atakule\'den merdivenle iniş', 'Asansör arızası yüzünden merdivenden inenler "manzara güzeldi" dedi.'],
    ['Otobüs 12 yolunu şaşırdı', 'Şoför "kestirme sandım" dedi, yolcular manzarayı sevdi.'],
    ['Geliştirici kahve molası verdi', 'Kapüşonlu vatandaşın molası yarım saat sürdü; kod beklemede.'],
    ['Martı değil, güvercin', 'Ankara\'da martı gördüğünü söyleyenler aslında güvercin gördüğünü kabul etti.'],
    ['Trafik ışığı rekoru', 'Bir sürücü üç yeşil ışığı arka arkaya yakaladı. Uzmanlar "şanstan öte" diyor.'],
    ['Kucak sıralaması tartışma yarattı', 'Şehrin en çok kucaklanan kedisi anketine kediler itiraz etti.'],
    ['Kafede priz savaşı', 'Laptopla gelenler tek prizi paylaşamadı; garson uzatma kablosu getirdi.'],
    ['Şemsiyeler boşuna taşındı', 'Sabah şemsiye alan herkes gün boyu yağmur bekledi. Yağmadı.'],
    ['Tünelde yankı yarışması', 'Sürücüler "tünelde korna çalmayın" uyarısına rağmen yankıyı test etti.'],
    ['Kuaförde sezonun modası', 'Bu sezonun saç modası "biraz yanlardan" olarak açıklandı.'],
    ['Poşet krizi çözüldü', 'Müşteri sonunda poşet istemedi; kasiyer alkışlandı.'],
    ['Kediler uzaylı mı?', 'Kedi meclisinden açıklama: "Şimdilik bir şey söyleyemeyiz."'],
    ['Ofsayt kararına kedi itirazı', 'Tribünü izleyen kediler ofsayt kararına miyavlayarak itiraz etti.'],
    ['Mama baronu kim?', 'Parktaki dedikodulara göre bölgenin mama baronu iri bir sarman.'],
    ['Kediler Vadisi ikinci sezon', 'Parktaki kediler arasında güç dengeleri değişiyor. Reis "her şey kontrol altında" dedi.']
  ]);
})(window.PORTFOLIO);
