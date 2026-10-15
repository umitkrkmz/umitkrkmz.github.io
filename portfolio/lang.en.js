/* ===== portfolio/lang.en.js: telefonun İngilizce sözlüğü (arayüz, içerik, haber şablonları). Şehrin sözlüğü (../js/lang.en.js) de yüklenir:
   olay adları, hava türleri, rüzgâr yönleri oradan gelir. content.js'e yeni yazı eklerken İngilizcesini buraya ekle. ===== */
(function () {
const L = window.MSLang; if (!L) return;
const t = L.t;
L.add({
  /* arayüz */
  'Zeynel Ümit Korkmaz · Portfolyo': 'Zeynel Ümit Korkmaz · Portfolio', 'Şehre gir': 'Enter city', '‹ Ana ekran': '‹ Home', 'Ana ekran': 'Home',
  'Projeler': 'Projects', 'Hakkımda': 'About', 'İletişim': 'Contact', 'Ankara Haber': 'Ankara News', 'Uygulamalar': 'Apps', 'Araçlar': 'Widgets', 'Kısayollar': 'Shortcuts',
  'projeler': 'projects', 'hakkimda': 'about', 'iletisim': 'contact', 'ankara-haber': 'ankara-news',
  'Neyle uğraşıyorum': 'What I work with', 'Son dakika': 'Breaking', 'Gündem': 'Today', 'Şehir rakamları': 'City in numbers', 'Bu şehir nasıl yapıldı': 'How this city was made',
  'Şu an içindesin': "You're in it right now", 'Kod': 'Code', 'Kod yakında': 'Code coming soon', 'Makale': 'Paper', 'Model eğitimi': 'Model training', 'bugün': 'today', 'dün': 'yesterday',
  'Hava bilgisi alınamadı': 'Weather unavailable', "Bağlantı gelince Ankara'nın anlık havası burada görünür.": "Ankara's live weather will appear here once you're online.",
  'Bugün': 'Today', 'Yarın': 'Tomorrow', 'Maç günü': 'Match day', "Maçlar her gün 13:30 ve 19:00'da. Şehrin içinden açınca skor canlı görünür.": 'Matches every day at 13:30 and 19:00. Open the phone inside the city to see the live score.',
  'Devre arası': 'Half-time', 'Maç sonu': 'Full time', 'Sıradaki maç': 'Next match', 'Son maç': 'Last match', 'Semt takımları karşı karşıya. Tribünler şimdiden doluyor.': 'District teams go head to head. The stands are already filling up.',
  'Son dakika haberleri şehrin içinden açınca görünür.': 'Breaking news appears when you open the phone inside the city.', 'Şimdilik sakin. Şehirde bir şey olunca ilk burada.': "Quiet for now. When something happens in the city, you'll see it here first.",
  'yoldaki araç': 'cars on the road', 'kaldırımdaki yaya': 'people on the pavement', 'sokak kedisi': 'street cats', 'Pijamalı Çocuğun yakaladığı': 'thieves caught by Underoos',
  'blok': 'blocks', 'şehir kenarı': 'city width', 'araç': 'cars', 'derleme adımı': 'build steps', '3B Ankara': '3D Ankara', 'şimdi': 'now', 'Ankara Stadı': 'Ankara Stadium',
  'Asayiş': 'Police', 'Trafik': 'Traffic', 'Spor': 'Sports', 'Kent': 'City', 'Kediler': 'Cats',
  /* kişi */
  'Bilgisayar mühendisi': 'Computer engineer', 'Ankara · .NET ve Python': 'Ankara · .NET and Python', 'Bu telefonun sahibi, arkadaki şehrin de yapımcısı.': 'Owner of this phone, and builder of the city behind it.',
  "Merhaba, ben Ümit. Ankara'da yaşayan bir bilgisayar mühendisiyim. .NET ve Python nerede varsa ben de oradayım; merak ettiğim şeyleri deniyor, işe yarayanları açık kaynak olarak paylaşıyorum.":
    "Hi, I'm Ümit, a computer engineer based in Ankara. Wherever .NET and Python are, that's where I am. I try things I'm curious about, learn from them, and share what turns out useful as open source.",
  'Kırıkkale Üniversitesi · Bilgisayar Mühendisliği · 2020–2025': 'Kırıkkale University · Computer Engineering · 2020–2025',
  'Backend ve servisler': 'Backend and services', 'Masaüstü ve geliştirici araçları': 'Desktop and developer tools', 'PySide6, komut satırı araçları, paketleme': 'PySide6, command-line tools, packaging',
  'Veri ve makine öğrenmesi': 'Data and machine learning', 'Yapay zekâ entegrasyonu': 'AI integration', 'Yerel LLM, RAG, AI destekli geliştirme': 'Local LLMs, RAG, AI-assisted development',
  'Veritabanları': 'Databases', 'Web ve 3B grafik': 'Web and 3D graphics', 'Ortamlar': 'Environments',
  'GitHub': 'GitHub', 'LinkedIn': 'LinkedIn', 'E-posta': 'Email', 'ORCID': 'ORCID', 'Sponsor': 'Sponsor',
  /* projeler */
  'Öne çıkanlar': 'Featured', 'Windows araçları': 'Windows tools', 'Kurumsal Bilgi Yönetim Platformu': 'Corporate Knowledge Base', "Tüm projelerim GitHub'da →": 'All my projects on GitHub →',
  'Prosedürel üretim': 'Procedural generation', 'Veri analizi': 'Data analysis', 'Kaos teorisi': 'Chaos theory', 'Akademik': 'Academic', 'AI ajanları': 'AI agents', 'Geliştirici araçları': 'Developer tools', 'Ağ': 'Networking',
  "Tarayıcıda çalışan prosedürel 3B Ankara: Kızılay'dan Söğütözü'ne semtler, canlı Ankara havası, dağlarla çevrili vadi, trafik ve yayalar, camın ardında yaşayan odalar, olaylar, kediler, stadyumda maç ve ağla sallanan bir kahraman.":
    'A procedural 3D Ankara in the browser: districts from Kızılay to Söğütözü, live Ankara weather, a valley ringed by mountains, traffic and pedestrians, rooms that live behind the windows, events, cats, a match at the stadium and a hero who swings on webs.',
  "Link yapıştır, indir. yt-dlp tabanlı, kendi bilgisayarında çalışan video ve ses indirme aracı: 1700'den fazla site, playlist ve kanal takibi, QR kodla telefondan kullanım, tek tıkla Windows kurulumu, Docker ve Raspberry Pi. Reklam, hesap ve telemetri yok.":
    'Paste a link, download it. A video and audio downloader built on yt-dlp that runs on your own computer: 1,700+ sites, playlists and channel following, use it from your phone via QR code, one-click Windows installer, Docker and Raspberry Pi. No ads, no account, no telemetry.',
  'Şirket içi belgeler, yazılar ve duyurular için bilgi platformu. Ollama ile yerel RAG asistanı bilgi tabanından soruları yanıtlar; SignalR ile anlık bildirimler, Hangfire ile arka plan işleri, rol tabanlı yetki ve içerik onay akışı.':
    "A knowledge platform for a company's documents, posts and announcements. A local RAG assistant built on Ollama answers questions from the knowledge base; SignalR for real-time notifications, Hangfire for background jobs, role-based access and a content approval flow.",
  "Görsel, ses ve metin dosyalarında gizli veri arayan, steganografi yöntemlerini 30'dan fazla metrikle karşılaştıran analiz aracı. Hızlı matematiksel eşik ile Random Forest ve Gradient Boosting modellerini birleştiren hibrit tespit, pHash ve spektral parmak iziyle otomatik eşleştirme, PDF rapor.":
    'An analysis tool that looks for hidden data in image, audio and text files and benchmarks steganography methods with 30+ metrics. Hybrid detection that combines a fast mathematical threshold with Random Forest and Gradient Boosting models, automatic matching via pHash and spectral fingerprints, PDF reports.',
  'Hakemli dergide yayımlanan "Secure Audio Steganography Using Vectorized LSB and Chaos-Based Encryption" makalesinin resmi kodu: yedi kaotik harita, NumPy ile vektörize LSB gömme, PySide6 arayüzü.':
    'Official code for the peer-reviewed paper "Secure Audio Steganography Using Vectorized LSB and Chaos-Based Encryption": seven chaotic maps, vectorized LSB embedding with NumPy, a PySide6 interface.',
  'AI kodlama ajanlarının (Claude Code, Cursor, Copilot) bağlamdan kopmasını, boşa token harcamasını ve koruyucu kodu "temizlemesini" engelleyen çerçeve: proje haritası, makinece okunur kurallar, AST denetimleri ve mutasyon testi. Bağımlılık yok, yalnızca Python standart kütüphanesi.':
    'A framework that stops AI coding agents (Claude Code, Cursor, Copilot) from drifting out of context, wasting tokens and "cleaning up" the code that protects you: a project map, machine-readable rules, AST checks and mutation testing. No dependencies, just the Python standard library.',
  'Alan adına göre ayrı profiller kullanan DPI aşma motoru: yedi teknik, engellenen alan adlarını kendisi bulan Radar, gerçek bağlantı üzerinde otomatik kalibrasyon, DNS over HTTPS, ECH ve canlı trafik paneli. Paket ayrıştırma AVX2 ile hızlandırılmış.':
    'A DPI bypass engine with per-domain profiles: seven techniques, Radar that finds blocked domains by itself, automatic calibration on the real connection, DNS over HTTPS, ECH and a live traffic dashboard. AVX2-accelerated packet parsing.',
  "VPN olmadan, hız kaybı olmadan Discord erişimi. Yalnızca Discord'un TLS el sıkışma paketlerini düzenler, bir yöntem işe yaramazsa otomatik olarak sıradakini dener; geri kalan trafiğe dokunmaz.":
    "Discord access without a VPN and without slowing down. It only reshapes Discord's TLS handshake packets, tries the next method automatically if one doesn't work, and leaves the rest of your traffic alone.",
  'Qt Designer .ui dosyalarını tek tıkla PySide6 Python koduna çeviren masaüstü aracı: toplu dönüştürme, sürükle bırak, sanal ortam algılama, açık ve koyu tema.':
    'A desktop tool that turns Qt Designer .ui files into PySide6 Python code in one click: batch conversion, drag and drop, virtual environment detection, light and dark themes.',
  /* nasıl yapıldı */
  'Pencerelerin ardındaki odalar': 'Rooms behind the windows',
  'Her pencereye geometri koymak yerine cephe shader\'ında "interior mapping": duvar, zemin, tavan ve mobilya bakış açısıyla değişir. Yakındaki birkaç pencerede cam gerçekten açılır, arkasında televizyon izleyen, yemek yapan insanlar vardır.':
    'Instead of geometry for every window, "interior mapping" in the facade shader: walls, floor, ceiling and furniture shift with the viewing angle. In a few nearby windows the glass really opens, with people watching TV or cooking behind it.',
  'Ayrıntı kademeleri': 'Levels of detail', 'Kuş bakışından göz hizasına dört kademe: uzakta bina başına tek malzeme ve tek çizim çağrısı, yaklaştıkça tabelalar, tenteler, yayalar ve iç mekânlar açılır.':
    "Four levels from bird's-eye to eye level: far away one material and one draw call per building; as you get closer, signs, awnings, pedestrians and interiors switch on.",
  'Örnekli çizim': 'Instanced drawing', "Araçlar, insanlar, ağaçlar, kediler ve tribündeki taraftarlar InstancedMesh ile: binlerce nesne, birkaç çizim çağrısı. Kedilerin tüy desenleri bile shader'da üretilir.":
    "Cars, people, trees, cats and the fans in the stands are InstancedMesh: thousands of objects, a handful of draw calls. Even the cats' fur patterns are generated in a shader.",
  'Trafik': 'Traffic', 'Kavşak düğümleri ve yönlü kenarlardan oluşan yol ağı, Bezier dönüşler, ışıklar, sinyaller. Acil durum araçları kapalı yolu geçen BFS rotasıyla gider, öndekiler kenara çekilir.':
    'A road network of junction nodes and directed edges, Bézier turns, traffic lights, indicators. Emergency vehicles take a BFS route around closed roads and the cars ahead pull over.',
  'Vadi': 'The valley', 'fbm gürültüsüyle dağlar; yol ve akarsu boyunca açılan vadiler, ormanlar, tünele giren dört şeritli yol ve şehre girip çıkan trafik.':
    'Mountains from fbm noise; valleys carved along the road and the river, forests, a four-lane road into a tunnel and traffic flowing in and out of the city.',
  /* şaka haberler */
  'Kedi meclisi toplandı': 'The cat council has met', 'Gündem mama kabı krizi. Reis "Bu böyle gitmez" dedi, oylama ertelendi.': 'On the agenda: the food bowl crisis. Reis said "this can\'t go on"; the vote was postponed.',
  'Saat kulesi yine beş dakika ileri': 'The clock tower is five minutes fast again', 'Belediye "kule kendi kafasına göre" açıklaması yaptı.': 'The council issued a statement: "the tower does as it pleases."',
  'Pijamalı Çocuk kimdir?': 'Who is Underoos?', 'Çatılarda görülen maskeli gencin kimliği hâlâ belirsiz. Komşular pijamasından tanıdığını söylüyor.': 'The masked youth seen on the rooftops is still unidentified. Neighbours say they recognise the pajamas.',
  'Tünel yolunda bayram havası': 'Holiday rush on the tunnel road', 'Şehre giren araç sayısı rekor kırdı; dağdaki tünel çıkışında kuyruk oluştu.': 'A record number of cars entered the city; traffic backed up at the mountain tunnel exit.',
  'Ördekler gölü paylaşamıyor': "The ducks can't share the pond", 'Parktaki üç ördek arasında nilüfer anlaşmazlığı büyüyor.': 'A water lily dispute is growing between the three ducks in the park.',
  'Ankara simidi fiyatı sabit': 'Ankara simit prices hold steady', 'Fırıncı esnafı "simit ekmek kadar önemli" diyerek zammı reddetti.': 'Bakers rejected a price rise, saying "simit matters as much as bread."',
  'Otobüs 56 bu sefer zamanında geldi': 'Bus 56 was on time for once', 'Duraktaki yolcular şaşkınlıklarını gizleyemedi.': 'Passengers at the stop could not hide their surprise.',
  'Geliştirici yine commit attı': 'The developer committed again', 'Meydanın doğusunda dolaşan kapüşonlu vatandaş "bir commit daha, sonra kahve" dedi.': 'The hooded resident who walks east of the square said: "one more commit, then coffee."',
  'Bank sayısı yeterli mi?': 'Are there enough benches?', 'Parklarda oturacak yer bulamayanlar şikâyetçi; kediler bankları çoktan kapmış durumda.': 'People who cannot find a seat in the parks are complaining; the cats took the benches long ago.',
  'Kuaförde sıra numarası sistemi': 'Queue numbers at the barber', 'Berber "Sıra numarası aldım, yine de önce beni al diyen var" diye dert yandı.': 'The barber complained: "people take a number and still ask me to take them first."',
  'Çay ocağında yeni rekor': 'New record at the tea house', 'Bir çaycı sabahtan beri 412 bardak çay taşıdığını açıkladı. Tepsi dinlenmeye çekildi.': 'A tea server said he had carried 412 glasses of tea since morning. The tray has been retired for a rest.',
  'Market kasasında poşet tartışması': 'Bag debate at the till', 'Kasiyer "Poşet ister misiniz?" diye sordu, müşteri on dakika düşündü.': 'The cashier asked "Would you like a bag?" and the customer thought about it for ten minutes.',
  'Pijamalı Çocuk pijamasını yıkatacak mı?': 'Will Underoos get his pajamas washed?', 'Çamaşırhaneler bu konuda yorum yapmadı. Komşular "en azından deseni güzel" diyor.': 'The laundromats declined to comment. Neighbours say "at least the pattern is nice."',
  'Saat kulesi kendini savundu': 'The clock tower defends itself', 'Kule adına yapılan açıklamada "Ben doğru gösteriyorum, siz geç kalıyorsunuz" denildi.': 'A statement on behalf of the tower said: "I tell the right time; you are the ones running late."',
  "Reis'in yeni gözdesi": "Reis's new favourite", 'Kedi meclisi başkanı bu hafta en çok kucak sevilen bankı ilan etti. Kesin yeri açıklanmadı.': "The cat council's chair has named this week's most cuddle-friendly bench. Its exact location was not disclosed.",
  /* haber şablonları: hava */
  "Ankara'da güneş yüzünü gösterdi": 'The sun comes out over Ankara', 'Hava {temp} derece. Parklarda banklar sabahtan doldu, kediler en güneşli köşeyi çoktan kaptı.': "It's {temp} degrees. Park benches filled up early, and the cats grabbed the sunniest corner long ago.",
  'Gökyüzünde tek bulut yok': 'Not a cloud in the sky', 'Meteoroloji "Bugün şemsiye gereksiz" dedi. {semt} semtinde balkonlarda çamaşır yarışı başladı.': 'Forecasters say "no umbrella needed today". In {semt}, the race to hang laundry on balconies has begun.',
  'Açık hava, açık yüzler': 'Clear skies, cheerful faces', 'Ankaralılar güneşi görünce simidi, çayı kapıp parka koştu. En yüksek sıcaklık {max} derece bekleniyor.': 'At the first sight of sun, Ankara grabbed its simit and tea and headed to the park. A high of {max} degrees is expected.',
  'Bulutlar gelip gidiyor': 'Clouds come and go', 'Bir güneş bir gölge. {semt} sakinleri ceketi giyip çıkarmaktan yoruldu. Hava {temp} derece.': 'Sun, then shade. {semt} residents are tired of putting their jackets on and off. It is {temp} degrees.',
  'Parçalı bulutlu bir Ankara günü': 'A partly cloudy Ankara day', 'Ne tam güneş ne tam bulut. Uzmanlar "Ankara\'nın en Ankara hâli" yorumunu yaptı.': 'Neither sunny nor cloudy. Experts called it "Ankara at its most Ankara."',
  'Gökyüzü griye boyandı': 'The sky turns grey', 'Kapalı hava {temp} derecede seyrediyor. Çay ocakları "tam çay havası" diyerek ikinci semaveri yaktı.': 'Overcast at {temp} degrees. Tea houses lit a second samovar: "perfect tea weather."',
  'Güneş bugün izinli': 'The sun has the day off', 'Bulutlar şehrin üstüne kurulmuş durumda. Yağış beklenmiyor ama şemsiyesini alan pişman olmuyor.': "The clouds have settled over the city. No rain is expected, but nobody regrets bringing an umbrella.",
  'Ankara sise gömüldü': 'Ankara wrapped in fog', 'Görüş mesafesi birkaç yüz metreye düştü. Sürücüler farlarını yaktı, saat kulesi bile kendi saatini zor görüyor.': 'Visibility is down to a few hundred metres. Drivers switched on their lights; even the clock tower can barely see its own face.',
  'Sisli hava, yavaş trafik': 'Fog slows the traffic', "{cadde} Caddesi'nde araçlar ağır ilerliyor. Yetkililer takip mesafesine dikkat çekti.": 'Traffic is crawling on {cadde} Street. Officials urged drivers to keep their distance.',
  'İnce ince çiseliyor': 'A fine drizzle', 'Şemsiye açmaya değmeyecek kadar, saçı bozacak kadar. Hava {temp} derece.': 'Not worth opening an umbrella, just enough to ruin your hair. It is {temp} degrees.',
  'Çisenti şehri ıslattı': 'Drizzle dampens the city', 'Kaldırımlar parlıyor, kediler saçak altına çekildi. {semt} semtinde çay ocakları doldu.': 'The pavements glisten and the cats have taken shelter under the eaves. Tea houses in {semt} are full.',
  "Ankara'ya yağmur geldi": 'Rain arrives in Ankara', 'Yağış bir süre daha sürebilir. {semt} semtinde birikintilerden atlayanlar görüntülendi.': 'The rain may last a while. People were spotted jumping over puddles in {semt}.',
  'Şemsiyeler açıldı': 'Umbrellas up', 'Yağmur {temp} derecede yağıyor. Otobüs duraklarında saçak altında yer kalmadı.': "It's raining at {temp} degrees. There's no room left under the shelters at the bus stops.",
  'Islak yol uyarısı': 'Wet road warning', 'Yollar kaygan. Sürücülerin hızını düşürmesi, yayaların birikinti kenarından uzak durması öneriliyor.': 'Roads are slippery. Drivers should slow down, and pedestrians should keep away from the edge of puddles.',
  'Gök gürültülü fırtına': 'Thunderstorm', "Şimşekler Söğütözü'nün kulelerini aydınlattı. Vatandaşlar balkonda unuttukları minderler için endişeli.": "Lightning lit up the towers of Söğütözü. Residents are worried about the cushions they left on the balcony.",
  'Fırtına uyarısı': 'Storm warning', 'Rüzgâr saatte {wind} kilometreye ulaştı. Yetkililer gerekmedikçe dışarı çıkılmamasını istedi.': 'Winds reached {wind} km/h. Officials asked people to stay indoors unless necessary.',
  'Ankara beyaza büründü': 'Ankara turns white', 'Kar yağışı sürüyor. Çocuklar kardan adam için parklara akın etti, Reis pencerenin önünden ayrılmıyor.': 'Snow keeps falling. Children flocked to the parks to build snowmen; Reis will not leave the window.',
  'Kar geldi, gözler valilikte': 'Snow is here: all eyes on the governor', 'Öğrenciler okullarla ilgili açıklamayı bekliyor. Hava {temp} derece.': 'Students are waiting for the announcement about schools. It is {temp} degrees.',
  'Kaldırımlar buz tutabilir': 'Pavements may ice over', 'Belediye tuzlama çalışmalarına başladı. Yayaların dikkatli yürümesi rica edildi.': 'The council has started gritting. Pedestrians are asked to walk carefully.',
  'Sıcaklık {temp} dereceyi buldu': 'Temperature hits {temp} degrees', "Ankara'nın kuru sıcağı bastırdı. Dondurmacılar sezonun en iyi gününü yaşıyor.": "Ankara's dry heat has set in. Ice cream sellers are having the best day of the season.",
  'Ankara ayazı geri döndü': "Ankara's frost is back", 'Termometreler {temp} dereceyi gösteriyor, hissedilen {feels}. Simitçiler sıcak simidin tam zamanı olduğunu söylüyor.': 'Thermometers show {temp} degrees, feels like {feels}. Simit sellers say it is the perfect time for a warm one.',
  'Rüzgâr esiyor, şapkalar uçuyor': 'Windy day, flying hats', "Saatte {wind} kilometreyle {windFrom} esen rüzgâr Kızılay'da şemsiyeleri ters çevirdi.": 'A {wind} km/h wind {windFrom} turned umbrellas inside out in Kızılay.',
  'Yarın şemsiyeyi unutmayın': "Don't forget your umbrella tomorrow", 'Meteoroloji yarın için yağış bekliyor. En yüksek sıcaklık {tmax} derece.': 'Forecasters expect rain tomorrow. A high of {tmax} degrees.',
  'Yarın kar var': 'Snow tomorrow', 'Tahminlere göre yarın kar yağışı bekleniyor; en düşük sıcaklık {tmin} derece.': 'Snow is forecast for tomorrow, with a low of {tmin} degrees.',
  'Yarın fırtına bekleniyor': 'Storm expected tomorrow', 'Meteoroloji yarın için gök gürültülü sağanak uyarısı yaptı.': 'Forecasters have issued a thunderstorm warning for tomorrow.',
  'Yarın güneşli': 'Sunny tomorrow', 'Plan yapanlara müjde: yarın hava açık, sıcaklık {tmax} dereceye çıkacak.': 'Good news for anyone making plans: clear skies tomorrow, with a high of {tmax} degrees.',
  'Hava soğuyor': 'Getting colder', 'Yarın en yüksek sıcaklık {drop} derece düşüyor. Montları dolaptan çıkarma vakti.': "Tomorrow's high drops by {drop} degrees. Time to get the coats out.",
  /* olaylar */
  "{cad} Caddesi'nde yangın": 'Fire on {cad} Street', 'Saat {time} sularında {esemt} semtinde bir binadan duman yükseldi; itfaiye ekipleri müdahale etti. Son durum: {status}.': 'Around {time}, smoke rose from a building in {esemt}; fire crews responded. Latest: {status}.',
  'Yangın paniği': 'Fire scare', "{cad} Caddesi ile {sk} Sokağı'nın kesiştiği köşedeki binada yangın çıktı. Son durum: {status}.": 'A fire broke out in a building on the corner of {cad} Street and {sk} Lane. Latest: {status}.',
  "{cad} Caddesi'nde trafik kazası": 'Traffic accident on {cad} Street', 'Saat {time} sularında iki araç çarpıştı. Ambulans ve polis olay yerine yönlendirildi. Son durum: {status}.': 'Two cars collided around {time}. An ambulance and police were sent to the scene. Latest: {status}.',
  'Kaza trafiği yavaşlattı': 'Accident slows traffic', "{esemt} semtinde yaşanan kaza nedeniyle {cad} Caddesi'nde uzun kuyruk oluştu. Son durum: {status}.": 'An accident in {esemt} caused long queues on {cad} Street. Latest: {status}.',
  '{esemt} semtinde hırsızlık': 'Theft in {esemt}', 'Saat {time} sularında kaçmaya çalışan şüpheli için polis harekete geçti. Son durum: {status}.': 'Police moved in around {time} after a suspect tried to flee. Latest: {status}.',
  "Hırsız {sk} Sokağı'ndan kaçtı": 'Thief flees down {sk} Lane', 'Görgü tanıkları şüphelinin kavşaktan kavşağa koştuğunu anlattı. Son durum: {status}.': 'Witnesses say the suspect ran from junction to junction. Latest: {status}.',
  "{cad} Caddesi'nde yaya kazası": 'Pedestrian hit on {cad} Street', 'Saat {time} sularında karşıdan karşıya geçen bir yayaya araç çarptı. Son durum: {status}.': 'A car hit a pedestrian crossing the road around {time}. Latest: {status}.',
  'Sürücülere yaya uyarısı': 'Drivers warned about pedestrians', '{esemt} semtindeki kazanın ardından yetkililer yaya geçitlerinde yavaşlanması çağrısı yaptı. Son durum: {status}.': 'After the accident in {esemt}, officials urged drivers to slow down at crossings. Latest: {status}.',
  'Pijamalı Çocuk bugün {hero} hırsız yakaladı': 'Underoos caught {hero} thieves today', 'Çatılarda dolaşan maskeli genç, polis gelmeden şüphelileri ağla sarıp kaldırıma bıraktı. Kimliği hâlâ sır.': 'The masked rooftop youth wrapped the suspects in webs and left them on the pavement before the police arrived. His identity is still a secret.',
  'Şehirde sakin bir gün': 'A quiet day in the city', 'Bugün şimdiye kadar ciddi bir olay yaşanmadı. Ekipler istasyonlarında çay demledi.': 'No serious incidents so far today. The crews brewed tea at their stations.',
  /* maç */
  "Ankara Stadı'nda {w} sevinci": 'Joy for {w} at Ankara Stadium', "{w}, {l} karşısında {ws}-{ls} kazandı. Taraftarlar maçtan sonra korna çalarak Kızılay'a yürüdü.": '{w} beat {l} {ws}-{ls}. Fans honked their way to Kızılay after the match.',
  '{w} sahadan galip ayrıldı': '{w} take the win', '{l} cephesinde hakem kararlarına tepki var.': '{l} are unhappy with the referee.',
  'Son düdük çaldığında tabelada {ws}-{ls} yazıyordu. {l} cephesinde hakem kararlarına tepki var.': 'The board read {ws}-{ls} at the final whistle. {l} are unhappy with the referee.',
  "Ankara Stadı'nda kazanan çıkmadı": 'No winner at Ankara Stadium', '{a} ile {b} {x}-{y} berabere kaldı. İki taraf da maçtan sonra "hakem" dedi.': '{a} and {b} drew {x}-{y}. Both sides blamed the referee afterwards.',
  'Gol yağmuru': 'Goal fest', '{a} ile {b} arasındaki maçta tam {total} gol atıldı. Tribünler sesini kaybetti.': '{total} goals in the match between {a} and {b}. The stands lost their voices.',
  "Ankara Stadı'nda maç sürüyor": 'Match under way at Ankara Stadium', '{a} ile {b} karşı karşıya. Skor şu an {x}-{y}, tribünler dolu.': '{a} face {b}. It is {x}-{y} right now, and the stands are full.',
  'Maç yağmur altında': 'A match in the rain', 'Saha kayganlaştı, oyuncular sık sık yere düşüyor. Taraftarlar şemsiye yerine atkılarına sarıldı.': 'The pitch is slippery and players keep going down. Fans wrapped themselves in scarves instead of umbrellas.',
  "Gözler Ankara Stadı'nda": 'All eyes on Ankara Stadium', 'Semt takımları saat {next} itibarıyla sahada olacak. Bilet gişelerinde kuyruk var.': 'The district teams take the pitch at {next}. There are queues at the ticket office.',
  'Derbi heyecanı': 'Derby fever', 'Saat {next} maçı öncesi {semt} taraftarları marşlarını tazeledi.': 'Ahead of the {next} kick-off, {semt} fans are rehearsing their chants.',
  /* saat, gün, mevsim */
  'Sabah trafiği başladı': 'Morning rush hour', "{cadde} Caddesi'nde araçlar ağır ilerliyor. Otobüs duraklarında kalabalık var.": 'Traffic is crawling on {cadde} Street. The bus stops are crowded.',
  'Simit kuyrukları uzadı': 'Long queues for simit', 'Fırınların önü sabah erkenden doldu. {semt} semtinde ilk simitler on dakikada tükendi.': 'Bakeries were packed early this morning. In {semt}, the first simits sold out in ten minutes.',
  'Öğle arası çay ocaklarında yer yok': 'No seats at the tea houses at lunchtime', '{semt} semtinde çalışanlar öğle arasında çay ocaklarına akın etti; tavla masaları kapışıldı.': 'Office workers in {semt} flocked to the tea houses at lunch; the backgammon tables were snapped up.',
  'Döner kuyruğu': 'The döner queue', "Öğle saatlerinde {cadde} Caddesi'ndeki dönercilerin önünde {n} metrelik kuyruk oluştu.": 'At lunchtime, a {n}-metre queue formed outside the döner shops on {cadde} Street.',
  'İkindi çayı vakti': 'Afternoon tea time', 'Kafelerde masalar doldu. Garsonlar "bugün kimse ayran içmiyor" diye şaşkın.': 'The cafés are full. Waiters are puzzled: "nobody is drinking ayran today."',
  'Akşam trafiği': 'Evening rush hour', 'İş çıkışı saatlerinde {cadde} ve {cadde2} caddelerinde yoğunluk var.': 'Heavy traffic on {cadde} and {cadde2} streets as people head home from work.',
  "Tunalı'da akşam kalabalığı": 'Evening crowds on Tunalı', 'Gün batarken kafeler ve kitapçılar doldu. Sokak müzisyenleri bugünkü listesini açıkladı.': 'As the sun set, cafés and bookshops filled up. Street musicians announced tonight\'s setlist.',
  'Kedi meclisi bu gece toplanıyor': 'The cat council meets tonight', "Merkezdeki parkta saat 21.30'da başlayacak toplantının gündemi yine mama kabı.": 'The meeting starts at 21:30 in the central park. On the agenda, once again: the food bowl.',
  'Kedi meclisi şu an toplantıda': 'The cat council is in session', 'Reis kürsüde. Sekiz üye çember olmuş, kimse kimseyi dinlemiyor.': 'Reis has the floor. Eight members sit in a circle, and nobody is listening to anybody.',
  "Gece Ankara'sı": 'Ankara by night', 'Kafeler kapanmaya yakın, son otobüsler duraklardan kalktı. Şehir uykuya hazırlanıyor.': 'The cafés are about to close and the last buses have left. The city is getting ready for bed.',
  'Pazartesi sendromu': 'Monday blues', 'Uzmanlar uyardı: Bugün kahve tüketimi hafta ortalamasının iki katına çıkabilir.': 'Experts warn: coffee consumption may double the weekly average today.',
  'Hafta ortası': 'Midweek', 'Çarşamba geldi; Ankaralılar "hafta yarılandı" diyerek kendini teselli ediyor.': 'It is Wednesday; Ankara consoles itself with "halfway through the week."',
  'Hafta sonu kapıda': 'The weekend is near', 'Cuma trafiği erken başladı. Plan yapmayanlar "son anda bir şey çıkar" diyor.': 'Friday traffic started early. Those without plans say "something will come up."',
  'Hafta sonu kahvaltısı': 'Weekend breakfast', "Ankaralılar serpme kahvaltı için Ayrancı ve Kavaklıdere'deki mekânları doldurdu.": 'Ankara filled the cafés of Ayrancı and Kavaklıdere for a big spread breakfast.',
  'Pazar keyfi': 'A lazy Sunday', 'Şehir geç uyandı. Parklarda pikniğe çıkanlar, bisiklet sürenler ve gazete okuyanlar var.': 'The city woke up late. The parks are full of picnickers, cyclists and newspaper readers.',
  'Yeni yıla merhaba': 'Hello, new year', "Ankara yeni yıla Kızılay'da geri sayımla girdi. Herkese mutlu yıllar!": 'Ankara welcomed the new year with a countdown in Kızılay. Happy new year, everyone!',
  '23 Nisan coşkusu': 'April 23 celebrations', 'Çocuklar bugün şehrin yönetimini devraldı. İlk karar: parklara daha çok salıncak.': "Children have taken over the city for the day. First decision: more swings in the parks.",
  '19 Mayıs kutlu olsun': 'Happy May 19', "Gençlik ve Spor Bayramı'nda Ankara Stadı'nda gösteriler yapılıyor.": 'Youth and Sports Day performances are under way at Ankara Stadium.',
  'Zafer Bayramı kutlu olsun': 'Happy Victory Day', "Ankara bayraklarla donandı; törenler Anıtkabir'de başladı.": 'Ankara is decked with flags; ceremonies have begun at Anıtkabir.',
  'Ankara bugün başkent oldu': 'Ankara became the capital on this day', "13 Ekim 1923'te başkent ilan edilen Ankara bir yaşını daha kutluyor.": 'Declared the capital on 13 October 1923, Ankara celebrates another year.',
  'Yarın Cumhuriyet Bayramı': 'Republic Day is tomorrow', 'Şehir bayram hazırlığında; caddeler bayraklarla süsleniyor.': 'The city is getting ready; the streets are being decorated with flags.',
  'Cumhuriyet Bayramı kutlu olsun': 'Happy Republic Day', 'Ankara bayraklarla donandı. Kutlamalar akşam fener alayıyla sürecek.': 'Ankara is decked with flags. Celebrations continue tonight with a lantern parade.',
  "Ankara saat 09.05'te durdu": 'Ankara stood still at 09:05', "Atatürk ölümünün yıl dönümünde saygıyla anılıyor; Anıtkabir'e ziyaretçi akını sürüyor.": 'Atatürk is remembered with respect on the anniversary of his death; visitors keep arriving at Anıtkabir.',
  'Yılın son günü': 'Last day of the year', "Marketlerde mandalina ve nar rafları boşaldı. Geri sayım gece yarısı Kızılay'da.": 'Tangerines and pomegranates have sold out. The countdown is at midnight in Kızılay.',
  "Sonbahar Ankara'da": 'Autumn in Ankara', "Kuğulu Park'ın ağaçları sarardı, kaldırımlar yaprakla kaplandı. Kestaneciler köşe başlarını tuttu.": "Kuğulu Park's trees have turned yellow and the pavements are covered in leaves. Chestnut sellers have claimed the street corners.",
  'Salep zamanı': 'Salep season', 'Soğuk havayla birlikte salep satışları arttı. Simitçiler tarçını tükettiğini söylüyor.': 'Salep sales are up with the cold. Simit sellers say they have run out of cinnamon.',
  'Bahar geldi': 'Spring is here', 'Ağaçlar çiçek açtı, parklarda banklar yeniden doldu. Kediler güneşlenme mevsimini açtı.': 'The trees are in bloom and park benches are full again. The cats have opened sunbathing season.',
  'Şehir yaz tatilinde': 'The city is on summer holiday', 'Ankaralıların yarısı Ege\'de. Kalanlar "trafik ne güzel" diyor.': 'Half of Ankara is on the Aegean coast. Those left behind say "the traffic is lovely."',
  'Yollarda {cars} araç': '{cars} cars on the road', 'Şu an şehir yollarında {cars} araç var. Trafik polisi "Kavşaklarda sabırlı olun" çağrısı yaptı.': 'There are {cars} cars on the city roads right now. Traffic police ask for patience at junctions.',
  'Sokak kedisi sayımı': 'Street cat census', 'Belediyenin sayımına göre şehirde {cats} sokak kedisi var. Kediler sayıma itiraz etti.': "According to the council's count there are {cats} street cats in the city. The cats dispute the figures."
});
const R = L.rule;
R(/^Son güncelleme: (.+)$/, d => `Updated: ${t(d)}`);
R(/^(\d+) gün önce$/, n => `${n} days ago`);
R(/^Open-Meteo · (az önce|(\d+) dk önce) güncellendi$/, (a, n) => `Open-Meteo · updated ${n ? n + ' min ago' : 'just now'}`);
R(/^Ankara · Hava durumu · (.+)$/, h => `Ankara · Weather · ${h}`);
R(/^(.+)\. Hissedilen (-?\d+)°, nem %(\d+), (\S+) (\d+) km\/sa rüzgâr\.$/, (l, f, h, d, w) => `${t(l)}. Feels like ${f}°, humidity ${h}%, wind ${t(d)} at ${w} km/h.`);
R(/^Şehirde şu an elle seçilmiş hava: (.+)$/, k => `Weather in the city is set by hand right now: ${t(k)}`);
R(/^Sıradaki maç (yarın )?(.+)$/, (y, h) => `Next match ${y ? 'tomorrow ' : ''}${h}`);
R(/^Son maç · Sıradaki (yarın )?(.+)$/, (y, h) => `Last match · Next ${y ? 'tomorrow ' : ''}${h}`);
R(/^Sıradaki (.+)$/, h => `Next ${h === 'yarın' ? 'tomorrow' : h}`);
R(/^· Ankara Stadı · (.+)$/, s => `· Ankara Stadium · ${t(s)}`);
R(/^Canlı · (.+)$/, s => `Live · ${s}`);
R(/^(Bugün|Asayiş|Trafik|Hava|Spor|Kent|Kediler|Gündem) · (\d\d:\d\d)$/, (c, h) => `${t(c)} · ${h}`);
L.watch();
})();
