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
     paper: makale bağlantısı, extra: [ad, bağlantı] ek düğme. Açıklamalar Türkçe ve elle yazılır, GitHub'a ulaşılamazsa da görünür */
  projects: [
    {
      group: 'Öne çıkanlar', title: 'Mikro Şehir',
      desc: 'Tarayıcıda çalışan prosedürel 3B Ankara: Kızılay\'dan Söğütözü\'ne semtler, canlı Ankara havası, dağlarla çevrili vadi, trafik ve yayalar, camın ardında yaşayan odalar, olaylar, kediler, stadyumda maç ve ağla sallanan bir kahraman.',
      tags: ['JavaScript', 'Three.js', 'GLSL', 'Prosedürel üretim'], live: '../index.html'
    },
    {
      group: 'Öne çıkanlar', title: 'MediaGrab', repo: 'mediagrab',
      desc: 'Link yapıştır, indir. yt-dlp tabanlı, kendi bilgisayarında çalışan video ve ses indirme aracı: 1700\'den fazla site, playlist ve kanal takibi, QR kodla telefondan kullanım, tek tıkla Windows kurulumu, Docker ve Raspberry Pi. Reklam, hesap ve telemetri yok.',
      tags: ['Python', 'FastAPI', 'yt-dlp', 'Docker']
    },
    {
      group: 'Öne çıkanlar', title: 'Kurumsal Bilgi Yönetim Platformu', repo: 'CorporateKnowledgeBase',
      desc: 'Şirket içi belgeler, yazılar ve duyurular için bilgi platformu. Ollama ile yerel RAG asistanı bilgi tabanından soruları yanıtlar; SignalR ile anlık bildirimler, Hangfire ile arka plan işleri, rol tabanlı yetki ve içerik onay akışı.',
      tags: ['.NET 10', 'ASP.NET Core', 'Clean Architecture', 'CQRS', 'RAG']
    },
    {
      group: 'Öne çıkanlar', title: 'StegoTester', repo: 'StegoTester',
      desc: 'Görsel, ses ve metin dosyalarında gizli veri arayan, steganografi yöntemlerini 30\'dan fazla metrikle karşılaştıran analiz aracı. Hızlı matematiksel eşik ile Random Forest ve Gradient Boosting modellerini birleştiren hibrit tespit, pHash ve spektral parmak iziyle otomatik eşleştirme, PDF rapor.',
      tags: ['Python', 'PySide6', 'scikit-learn', 'Veri analizi'], extra: ['Model eğitimi', 'https://github.com/umitkrkmz/StegoTester-AI-Training']
    },
    {
      group: 'Öne çıkanlar', title: 'Chaotic Audio Steganography', repo: 'Chaotic_Audio_Steganography',
      desc: 'Hakemli dergide yayımlanan "Secure Audio Steganography Using Vectorized LSB and Chaos-Based Encryption" makalesinin resmi kodu: yedi kaotik harita, NumPy ile vektörize LSB gömme, PySide6 arayüzü.',
      cite: 'Electrical Engineering and Energy (2025), 4(3), 68–86',
      tags: ['Python', 'NumPy', 'Kaos teorisi', 'Akademik'], paper: 'https://doi.org/10.64470/elene.2025.12'
    },
    {
      group: 'Öne çıkanlar', title: 'ai-context-mapping', repo: 'ai-context-mapping',
      desc: 'AI kodlama ajanlarının (Claude Code, Cursor, Copilot) bağlamdan kopmasını, boşa token harcamasını ve koruyucu kodu "temizlemesini" engelleyen çerçeve: proje haritası, makinece okunur kurallar, AST denetimleri ve mutasyon testi. Bağımlılık yok, yalnızca Python standart kütüphanesi.',
      tags: ['Python', 'AI ajanları', 'Geliştirici araçları']
    },
    {
      group: 'Windows araçları', title: 'Limbo', repo: 'Limbo',
      desc: 'Alan adına göre ayrı profiller kullanan DPI aşma motoru: yedi teknik, engellenen alan adlarını kendisi bulan Radar, gerçek bağlantı üzerinde otomatik kalibrasyon, DNS over HTTPS, ECH ve canlı trafik paneli. Paket ayrıştırma AVX2 ile hızlandırılmış.',
      tags: ['C#', '.NET', 'WinDivert', 'Ağ']
    },
    {
      group: 'Windows araçları', title: 'ZeroDivert', repo: 'ZeroDivert',
      desc: 'VPN olmadan, hız kaybı olmadan Discord erişimi. Yalnızca Discord\'un TLS el sıkışma paketlerini düzenler, bir yöntem işe yaramazsa otomatik olarak sıradakini dener; geri kalan trafiğe dokunmaz.',
      tags: ['C#', '.NET', 'WinDivert']
    },
    {
      group: 'Windows araçları', title: 'ui2py-pyside6', repo: 'ui2py-pyside6',
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
    ['Kedi meclisi toplandı', 'Gündem mama kabı krizi. Reis "Bu böyle gitmez" dedi, oylama ertelendi.'],
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
      catsSoon: [['Kedi meclisi bu gece toplanıyor', 'Merkezdeki parkta saat 21.30\'da başlayacak toplantının gündemi yine mama kabı.']],
      catsNow: [['Kedi meclisi şu an toplantıda', 'Reis kürsüde. Sekiz üye çember olmuş, kimse kimseyi dinlemiyor.']],
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
