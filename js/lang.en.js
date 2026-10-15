/* ===== lang.en.js: şehrin İngilizce sözlüğü (Türkçe metin > İngilizce) ve değişkenli metinler için kalıplar.
   Yeni bir arayüz metni eklerken buraya da ekle; eksik kalırsa Türkçesi görünür. Özel adlar ve tabelalar Türkçe kalır. ===== */
(function () {
const L = window.MSLang; if (!L) return;
const t = L.t, lc = s => /^(Turkish|İskender|Ayran|Simit|Poğaça)/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1);   // özel adlar büyük kalır
/* küçük harfli Türkçe ad (ör. "çay") için büyük harfli sözlük girdisini dener */
const tw = s => { const c = s.charAt(0).toLocaleUpperCase('tr') + s.slice(1), r = t(c); return r === c ? s : lc(r); };
L.add({
  /* üst panel, kademeler */
  'Mikro Şehir': 'Mikro Şehir', 'Mikro Şehir · Ankara': 'Mikro Şehir · Ankara',
  'Kameranın hedefe uzaklığı': 'Camera distance to target', 'Ayrıntı kademesi': 'Level of detail',
  'Şehir': 'City', 'Mahalle': 'District', 'Sokak': 'Street', 'Göz hizası': 'Eye level',
  'Bina kütleleri ve sokak ızgarası': 'Building masses and the street grid', 'Pencereler, ağaçlar, lambalar, trafik': 'Windows, trees, lamps, traffic',
  'Tabelalar, tenteler, çatı donanımı, yayalar': 'Signs, awnings, rooftop gear, pedestrians', 'Vitrinler, saat kulesi, her ayrıntı': 'Shop windows, the clock tower, every detail',
  'Sürükle: döndür · İki parmak: yakınlaş ve kaydır · Dokun: bina seç': 'Drag: rotate · Two fingers: zoom and pan · Tap: select a building',
  'Sürükle: döndür · Sağ tuş veya yön tuşları: kaydır · Tekerlek: imlece yakınlaş · Tıkla: bina seç': 'Drag: rotate · Right button or arrow keys: pan · Wheel: zoom to cursor · Click: select a building',
  'Olay akışı': 'Event feed', 'Olaylar · tıkla, oraya git': 'Events · click to go there',
  /* kontroller */
  'Kontroller': 'Controls', 'Saat': 'Time', 'Hava': 'Weather', '● Canlı': '● Live', 'Canlı': 'Live', 'Şimdi': 'Now',
  'Gerçek Türkiye saati (GMT+3)': 'Real Turkey time (GMT+3)', 'Gerçek saate dön': 'Back to real time',
  "Ankara'nın şu anki havası (Open-Meteo)": "Ankara's current weather (Open-Meteo)", "Ankara'nın gerçek havasına dön": "Back to Ankara's real weather",
  'bağlantı yok': 'offline', 'Canlı hava alınamadı; elle seçebilirsin.': 'Live weather unavailable; you can pick it by hand.', "Ankara'nın havası alınıyor…": "Getting Ankara's weather…",
  'Trafik yoğunluğu': 'Traffic density', 'Gölgeler': 'Shadows', 'Günü ilerlet': 'Fast-forward day', 'Durdur': 'Stop',
  'Rastgele olaylar': 'Random events', 'Olay çıkar': 'Trigger event', 'Grafik': 'Graphics',
  'Otomatik (cihaza göre)': 'Automatic (by device)', 'Yüksek': 'High', 'Orta': 'Medium', 'Düşük (telefon)': 'Low (phone)', 'düşük': 'low', 'orta': 'medium', 'yüksek': 'high',
  'Dil · Language': 'Language · Dil', 'Otomatik': 'Automatic',
  'Beni bul 📱': 'Find me 📱', 'Kuş bakışı': "Bird's-eye", 'Siluet': 'Skyline', 'Sokağa in': 'Street level', 'Saat kulesi': 'Clock tower',
  'Karakteri oyna': 'Play as citizen', 'Pijamalı Çocuğu izle': 'Follow Pajama Kid', 'İzlemeyi bırak': 'Stop following', 'Pijamalı Çocuk olarak oyna': 'Play as Pajama Kid',
  'Kuş bakışına dön': "Back to bird's-eye", 'Yeni şehir kur': 'Build a new city', 'Seçimi kaldır': 'Clear selection',
  'Şehir kuruluyor…': 'Building the city…', 'Bu tarayıcıda WebGL açık değil. Donanım hızlandırmayı açıp sayfayı yenileyin.': 'WebGL is not available in this browser. Turn on hardware acceleration and reload the page.',
  /* hava türleri */
  'Açık': 'Clear', 'Az bulutlu': 'Mostly clear', 'Parçalı bulutlu': 'Partly cloudy', 'Kapalı': 'Overcast', 'Sisli': 'Foggy', 'Kırağılı sis': 'Freezing fog',
  'Çisenti': 'Drizzle', 'Hafif çisenti': 'Light drizzle', 'Yoğun çisenti': 'Heavy drizzle', 'Donan çisenti': 'Freezing drizzle',
  'Yağmurlu': 'Rainy', 'Hafif yağmur': 'Light rain', 'Kuvvetli yağmur': 'Heavy rain', 'Donan yağmur': 'Freezing rain',
  'Fırtına': 'Storm', 'Karlı': 'Snowy', 'Hafif kar': 'Light snow', 'Kar yağışlı': 'Snowing', 'Yoğun kar': 'Heavy snow', 'Kar taneleri': 'Snow grains',
  'Hafif sağanak': 'Light showers', 'Sağanak': 'Showers', 'Şiddetli sağanak': 'Violent showers', 'Kar sağanağı': 'Snow showers', 'Yoğun kar sağanağı': 'Heavy snow showers',
  'Gök gürültülü fırtına': 'Thunderstorm', 'Dolulu fırtına': 'Thunderstorm with hail',
  'kuzeyden': 'from the north', 'kuzeydoğudan': 'from the northeast', 'doğudan': 'from the east', 'güneydoğudan': 'from the southeast',
  'güneyden': 'from the south', 'güneybatıdan': 'from the southwest', 'batıdan': 'from the west', 'kuzeybatıdan': 'from the northwest',
  /* seçim kartı */
  'Yakından bak': 'Take a closer look', 'Yükseklik': 'Height', 'Kat': 'Floors', 'Parsel': 'Lot', 'Semt': 'District', 'Çalışan': 'Workers', 'Sakin': 'Residents', 'Alan': 'Area',
  '+ Kat': '+ Floor', '− Kat': '− Floor', 'Yık': 'Demolish', 'Kesit': 'Cutaway', 'Kesiti kapat': 'Close cutaway', 'Boş arsa': 'Empty lot',
  'Müstakil ev': 'Detached house', 'Apartman': 'Apartment block', 'Ofis kulesi': 'Office tower', 'Gökdelen': 'Skyscraper', 'Apartman bloğu': 'Apartment block', 'Alçak bina': 'Low-rise',
  'Ankara Şehir Hastanesi': 'Ankara City Hospital', 'İtfaiye Merkezi': 'Fire Station', 'Merkez Karakolu': 'Central Police Station', 'Ankara Stadı': 'Ankara Stadium',
  'Yatak': 'Beds', 'Acil': 'Emergency', 'Helikopter pisti': 'Helipad', 'Var': 'Yes', 'Araç': 'Vehicles', '3 itfaiye': '3 fire engines', 'Ekip': 'Crew', '24 kişi': '24 people',
  'Hortum kulesi': 'Hose tower', 'Çıkış': 'Turnout', '~60 sn': '~60 s', 'Devriye': 'Patrol', '4 araç': '4 cars', 'Nöbet': 'On duty',
  'Kapasite': 'Capacity', 'Saha': 'Pitch', 'Işık kulesi': 'Floodlights', 'Çatı': 'Roof', 'Ana tribün': 'Main stand', 'Maç': 'Match',
  /* olaylar */
  'Yangın': 'Fire', 'İtfaiye yolda': 'Fire crew on the way', 'Söndürülüyor': 'Being put out', 'Söndürüldü ✓': 'Put out ✓',
  'Trafik kazası': 'Traffic accident', 'Ambulans ve polis yolda': 'Ambulance and police on the way', 'Ekipler olay yerinde': 'Crews on the scene', 'Yol açıldı ✓': 'Road cleared ✓',
  'Hırsızlık': 'Theft', 'Polis yolda': 'Police on the way', 'Polis teslim aldı ✓': 'Handed over to police ✓', 'Şüpheli yakalandı ✓': 'Suspect caught ✓',
  'Polis ve Pijamalı Çocuk yolda': 'Police and Pajama Kid on the way', 'Pijamalı Çocuk yakaladı 🕸': 'Caught by Pajama Kid 🕸',
  'Yaya kazası': 'Pedestrian hit', 'Yaralı kendi kalktı, ifade alınıyor': 'The injured got up; taking a statement', 'Yaralı ambulansa alındı': 'The injured is in the ambulance',
  /* oyun */
  'Fareyle bakmak için sahneye tıkla': 'Click the scene to look around with the mouse', '‹ Çık': '‹ Exit', 'Zıpla': 'Jump', 'Koş': 'Run', 'Ağ': 'Web', 'Çekil': 'Zip', 'Kucak': 'Hold',
  'Sol alttaki çubuk: yürü · Ekranı sürükle: bak · İki parmak: yakınlaş · Sağdaki düğmeler: zıpla, koş, E': 'Stick at bottom left: walk · Drag the screen: look · Two fingers: zoom · Buttons on the right: jump, run, E',
  'WASD: yürü · Shift: koş · Space: zıpla · Fare: bak · Tekerlek: yakınlaş · E: konuş / gir / kediyi sev · Q: kediyi kucağına al · Esc: imleci bırak': 'WASD: walk · Shift: run · Space: jump · Mouse: look · Wheel: zoom · E: talk / enter / pet a cat · Q: pick up a cat · Esc: release cursor',
  'WASD: koş · Shift: hızlı koş, duvarda yukarı koş · Space: zıpla (basılı tut: yüksek) · Sol tık / F basılı: ağla sallan · Sağ tık / Q: ağla çekil · Duvara koş: tırman · E: hırsızı ağla sar · Esc: imleci bırak': 'WASD: run · Shift: sprint, run up walls · Space: jump (hold: higher) · Left click / hold F: swing on a web · Right click / Q: zip on a web · Run into a wall: climb · E: web up a thief · Esc: release cursor',
  'E: Hırsızı ağla sar': 'E: Web up the thief', 'E: Konuş': 'E: Talk', 'E ya da WASD: Kalk': 'E or WASD: Stand up', 'E: Sev · Q: Yere bırak': 'E: Pet · Q: Put down',
  'E: Dışarı çık': 'E: Go outside', 'E: Banka otur': 'E: Sit on the bench', 'E: Otur': 'E: Sit',
  'Arabayı tek elle durdurdu!': 'Stopped the car with one hand!', 'Ağı tutturacak yüksek bir yer yok': 'Nothing high enough to anchor a web', 'Menzilde tutunacak yer yok': 'Nothing in range to grab',
  'Şüpheli ağa sarıldı 🕸': 'Suspect webbed up 🕸',
  'Portfolyoyu aç': 'Open the portfolio', 'Portfolyo': 'Portfolio', 'Portfolyo telefonu': 'Portfolio phone', 'Telefonu kapat': 'Close the phone', 'Tam ekran': 'Full screen', 'Telefon boyuna dön': 'Back to phone size',
  /* dükkân tabelası (kapı ipucunda) */
  'FIRIN': 'BAKERY', 'ECZANE': 'PHARMACY', 'KIRTASİYE': 'STATIONERY', 'ÇAY OCAĞI': 'TEA HOUSE', 'MARKET': 'GROCERY', 'KUAFÖR': 'BARBER', 'KEBAP': 'KEBAB',
  'KAFE': 'CAFÉ', 'OPTİK': 'OPTICIAN', 'ÇİÇEKÇİ': 'FLORIST', 'TAMİRCİ': 'REPAIR SHOP', 'ANKARA SİMİDİ': 'ANKARA SİMİT', 'ACİL': 'EMERGENCY', 'KARAKOL': 'POLICE', 'İTFAİYE': 'FIRE STATION',
  /* ürünler */
  'Çay': 'Tea', 'Kahve': 'Coffee', 'Türk kahvesi': 'Turkish coffee', 'Simit': 'Simit', 'Poğaça': 'Poğaça', 'Dürüm': 'Wrap', 'Ayran': 'Ayran', 'Kek': 'Cake', 'Ekmek': 'Bread',
  'Güneş gözlüğü': 'Sunglasses', 'Vitamin': 'Vitamins', 'Defter': 'Notebook', 'Kalem': 'Pen', 'Silgi': 'Eraser', 'Boya kalemi': 'Crayons', 'Ajanda': 'Planner', 'Cetvel': 'Ruler',
  'Süt': 'Milk', 'Peynir': 'Cheese', 'Domates': 'Tomatoes', 'Elma': 'Apples', 'Makarna': 'Pasta', 'Su': 'Water', 'Bisküvi': 'Biscuits', 'Yumurta': 'Eggs', 'Buket': 'Bouquet', 'İskender': 'İskender',
  /* mekânlarda konuşmalar */
  'Hoş geldiniz! Çay mı kahve mi?': 'Welcome! Tea or coffee?', 'Simitler taze, çay demli.': 'The simits are fresh, the tea is brewed.', 'Bugün tatlı yok, kusura bakmayın.': 'No desserts today, sorry.',
  'Burası şehrin en iyi çayı.': 'Best tea in the city, this.', 'Gazeteyi okuyordum, maç berabere bitmiş.': 'I was reading the paper; the match ended in a draw.', 'Bir çay daha söylesene!': 'Order another tea, will you?',
  'Hesabı ben ödüyorum.': "I'm paying.", 'Ekmekler fırından yeni çıktı!': 'The bread just came out of the oven!', 'Poğaça da var, sıcak sıcak.': "There's poğaça too, piping hot.",
  'Yarım ekmek mi, tam mı?': 'Half a loaf or a whole one?', 'Reçeteniz var mı?': 'Do you have a prescription?', 'Günde iki kez, tok karnına.': 'Twice a day, after meals.', 'Geçmiş olsun.': 'Get well soon.',
  'Kasa burada, buyurun.': 'The till is over here.', 'Domates bugün çok taze.': 'The tomatoes are really fresh today.', 'Poşet ister misiniz?': 'Would you like a bag?', 'Süt nerede acaba?': 'Where is the milk, I wonder?',
  'İndirim reyonu bitmiş yine.': 'The discount shelf is empty again.', 'Ekmek almayı unutmayayım.': "Mustn't forget the bread.", 'Sıra sizde, oturun.': "You're next, have a seat.",
  'Yanlardan biraz alalım mı?': 'A little off the sides?', 'Dünya kupasını izlediniz mi?': 'Did you watch the World Cup?', 'Acılı mı olsun?': 'Spicy?', 'Bir porsiyon iskender geliyor!': 'One İskender coming up!',
  'Ayran da yanına iyi gider.': 'Ayran goes well with it.', 'Lale mi gül mü?': 'Tulips or roses?', 'Hediye paketi yapayım mı?': 'Shall I gift-wrap it?', 'Saksı çiçekleri de var.': 'We have potted plants too.',
  'Yarın gelin, hazır olur.': "Come back tomorrow, it'll be ready.", 'Bunun parçası yok, sipariş edeceğiz.': "No parts for this one; we'll order them.", 'Eski ama sağlam alet bu.': 'Old but solid, this one.',
  'Kayıp eşya mı bildireceksiniz?': 'Reporting a lost item?', 'Şikâyetinizi yazalım.': "Let's write up your complaint.", 'Şehir güvende, merak etmeyin.': "The city is safe, don't worry.",
  'Ben bir şey yapmadım!': "I didn't do anything!", 'Avukatımı istiyorum!': 'I want my lawyer!', 'Pijamalı bir çocuk beni ağına sardı…': 'A kid in pajamas wrapped me in a web…',
  'Acil servise hoş geldiniz.': 'Welcome to the emergency department.', 'Sıra numaranızı alın lütfen.': 'Please take a queue number.', 'Doktor birazdan sizi çağıracak.': 'The doctor will call you shortly.',
  'Bir saattir bekliyorum…': "I've been waiting for an hour…", 'Sadece biraz başım ağrıyor.': 'Just a bit of a headache.', 'Geçmiş olsun bana da.': 'Get well soon to me too.',
  'Alarm çalarsa iki dakikada çıkarız!': 'If the alarm goes, we roll out in two minutes!', 'Hortumları yeni kontrol ettik.': 'We just checked the hoses.', 'Yangın tüpünüz var mı evde?': 'Do you have a fire extinguisher at home?',
  'Afiyet olsun!': 'Enjoy!', 'Demli mi açık mı? Buyrun.': 'Strong or light? Here you go.', 'Simit de sıcak!': 'The simit is warm too!', 'Orta şekerli geliyor.': 'Medium sweet, coming up.',
  'Bir latte, afiyet olsun.': 'One latte, enjoy.', 'Buyrun çayınız.': 'Here is your tea.', 'Ev yapımı!': 'Homemade!', 'Fırından yeni çıktı!': 'Fresh out of the oven!', 'Simitin yanına çay şart.': 'Simit needs tea.',
  'Peynirli, sıcak.': 'Cheese-filled, warm.', 'Sıcak sıcak, buyurun.': 'Piping hot, here you go.', 'Peynirli, afiyet olsun.': 'Cheese-filled, enjoy.', 'Susamlı, taze!': 'Sesame-covered, fresh!',
  'Size çok yakıştı!': 'They really suit you!', 'Günde bir tane, tok karnına.': 'One a day, after a meal.', 'MARKET · TAZE ÜRÜN': 'MARKET · TAZE ÜRÜN',
  'Kasa: önce raflardan sepete ürün ekle': 'Checkout: first add items from the shelves to your basket', 'Sepetiniz boş görünüyor.': 'Your basket looks empty.',
  'Poşet ister misiniz? Güle güle kullanın!': 'Would you like a bag? Enjoy them!', 'Para yetmedi, kasiyer "sonra getirirsin" dedi.': 'Not enough money; the cashier said "bring it later".',
  'E: Tıraş ol · 150 ₺': 'E: Get a haircut · 150 ₺', 'Yanlardan biraz alalım…': 'A little off the sides…', 'Acılı, bol soğanlı!': 'Spicy, lots of onions!', 'Köpüklü, buz gibi.': 'Frothy and ice cold.',
  'Kime gidiyor bu güzel buket?': 'Who is this lovely bouquet for?', 'E: Telefonu tamire bırak': 'E: Leave the phone for repair', 'Ekranı değişecek. Yarın gelin, hazır olur.': "The screen needs replacing. Come back tomorrow, it'll be ready.",
  'E: Şikâyet bildir': 'E: File a complaint', 'Tutanağı aldım, inceleyeceğiz.': "I've taken your statement; we'll look into it.", 'Bir kedinin pencerenize bakması suç değil efendim.': "A cat looking in your window isn't a crime, sir.",
  'Komşunun müziği mi? Bir uyarıda bulunuruz.': "Your neighbour's music? We'll have a word.", 'Pijamalı Çocuk mu? O bizden değil ama yardımı çok.': "Pajama Kid? He's not one of us, but he helps a lot.",
  'E: İlanlara bak': 'E: Read the notices', '"KAYIP: Sarman. Turuncu tekir, tasması yok, çok sever." Şehirde bir sarman görmüştüm…': '"LOST: Sarman. Orange tabby, no collar, very cuddly." I think I saw a ginger cat in the city…',
  'E: Sıra numarası al': 'E: Take a queue number', 'Sepeti kasaya bıraktın.': 'You left the basket at the till.', 'Oh be, ilaç gibi geldi!': 'Ahh, just what I needed!', 'Afiyet oldu!': 'That was delicious!',
  'Sıhhatler olsun! Yeni saç çok yakıştı.': 'Looking sharp! The new haircut suits you.',
  /* sokakta */
  'Günaydın komşu!': 'Morning, neighbour!', 'Çay demlendi, gel otur.': "The tea's brewed, come sit.", 'Bugün hava güzel ha?': 'Lovely weather today, huh?', 'Otobüs yine gecikti.': 'The bus is late again.',
  'Pijamalı Çocuğu gördün mü? Az önce buradaydı!': 'Did you see Pajama Kid? He was just here!', 'Fırından taze simit aldım.': 'I got fresh simit from the bakery.', 'Trafik de bir dert…': 'And the traffic, ugh…',
  'Kolay gelsin!': 'Keep up the good work!', 'Saat kulesi yine beş dakika ileri.': 'The clock tower is five minutes fast again.', 'Kafede yer var mı acaba?': 'Is there room at the café, I wonder?',
  'Bu şehirde hep bir şey oluyor.': 'Something is always happening in this city.', 'Akşama maç var, kaçırma.': "There's a match tonight, don't miss it.", 'Kirada zam varmış, duydun mu?': 'Did you hear? The rent is going up.',
  'Marketten ekmek alacaktım, unuttum!': 'I was going to get bread from the market, I forgot!', 'Merhaba!': 'Hello!', 'Selam!': 'Hi!', 'İyi günler!': 'Good day!',
  'Pijamalı Çocuk! Bir imza verir misin?': 'Pajama Kid! Can I have your autograph?', 'Vay, gerçekten sen misin?': 'Wow, is it really you?', 'Çatılarda dikkat et evlat!': 'Careful on those roofs, kid!',
  'Oğlum senin pijamana bayılıyor!': 'My son loves your pajamas!', 'Sayende mahalle güvende, sağ ol.': 'The neighbourhood is safe thanks to you.', 'O ağları nereden alıyorsun?': 'Where do you get those webs?',
  'Annen biliyor mu bu saatte dışarıda olduğunu?': "Does your mum know you're out at this hour?", 'Dün otobüsü durdurdun, gördüm!': 'You stopped the bus yesterday, I saw it!',
  'Selam! Her şey yolunda mı?': 'Hi! Everything all right?', 'Merhaba, mahalle sakin mi?': 'Hello, is the neighbourhood quiet?', 'Selam komşu!': 'Hi, neighbour!',
  'Bunlar benim için mi? Çok naziksiniz!': 'Are these for me? How kind of you!', 'Ay ne güzel çiçekler, teşekkür ederim!': 'Oh, what lovely flowers, thank you!',
  /* kediler */
  'sarman': 'ginger tabby', 'sarman, beyaz göğüslü': 'ginger tabby, white chest', 'smokin': 'tuxedo', 'beyaz': 'white', 'tekir': 'tabby', 'gri tekir, beyaz çoraplı': 'grey tabby, white socks',
  'kara': 'black', 'üç renkli': 'calico', 'gri': 'grey', 'krem': 'cream',
  'Mırr… ♥': 'Purr… ♥', 'Mırr mırr ♥': 'Purr purr ♥', 'Miyav!': 'Meow!', 'Mrrr…': 'Mrrr…', 'Miyaaav.': 'Meeeow.', 'Miyav miyav!': 'Meow meow!',
  'Miyav! Toplantı başladı.': 'Meow! The meeting has begun.', 'Bu gece balık var mı?': 'Is there fish tonight?', 'Mama kabı yine boş, bunu konuşmalıyız.': 'The food bowl is empty again; we need to talk about this.',
  'Çatıdaki güvercinler yine…': 'The pigeons on the roof again…', 'Pijamalı Çocuk ağlarıyla bizi korkutuyor.': 'Pajama Kid scares us with his webs.', 'Kim benim kutuma oturdu?': 'Who sat in my box?',
  'Mrrr… oylamaya geçelim.': "Mrrr… let's put it to a vote.", 'Sessizlik! Reis konuşuyor.': 'Silence! Reis is speaking.',
  /* geliştirici */
  'Kod derleniyor… şaka, derleme yok.': "Compiling… just kidding, there's no build step.", 'Bu şehri ben yaptım, her taşını!': 'I built this city, every stone of it!',
  'Kediler bu şehrin asıl sahibi.': 'The cats really own this city.', 'Bir commit daha, sonra kahve.': 'One more commit, then coffee.', 'Bu bug kahveyle çözülür.': 'This bug needs coffee.',
  'Güneşin tadını çıkarıyorum.': 'Enjoying the sun.', 'Ördekler bugün çok aktif.': 'The ducks are busy today.', 'Bilet cebimde, kapılar açılsın!': 'Ticket in my pocket, open the gates!',
  'Reis yine kürsüde.': 'Reis has the floor again.', 'Şu sarman çok tatlı!': 'That ginger cat is so cute!', 'Hadi be!': 'Come on!', 'Ofsayt değil o!': "That's not offside!",
  'Zzz… Uyuyorum ama telefonum açık 📱': "Zzz… I'm asleep, but my phone is on 📱", 'Selam! Portfolyom telefonumda 📱': 'Hi! My portfolio is on my phone 📱',
  'Evde uyuyor': 'Asleep at home', "Kızılay'da kafede çalışıyor": 'Working at a café in Kızılay', 'Öğle arası yürüyüşte': 'Out for a lunchtime walk', 'Parkta bankta oturuyor': 'Sitting on a park bench',
  'Stadyumun önünde maçı bekliyor': 'Waiting outside the stadium', "Ankara Stadı'nda maç izliyor": 'Watching the match at Ankara Stadium', 'Parka doğru yürüyor': 'Walking to the park', 'Kedi toplantısını izliyor': 'Watching the cat meeting'
});

/* değişkenli metinler */
const R = L.rule;
R(/^E: Kediyi sev \((.+?), (.+)\) · Q: Kucağına al$/, (n, c) => `E: Pet the cat (${n}, ${t(c)}) · Q: Pick up`);
R(/^E: Gir · (.+)$/, n => `E: Enter · ${t(n)}`);
R(/^E: (.+) al · (.+ ₺)$/, (i, p) => `E: Buy ${lc(t(i))} · ${p}`);
R(/^E: Otur, (.+) keyfi$/, i => `E: Sit and enjoy your ${tw(i)}`);
R(/^E: Sepete ekle · (.+) (\S+ ₺)(?: \(sepette (\d+)\))?$/, (i, p, n) => `E: Add to basket · ${t(i)} ${p}` + (n ? ` (${n} in basket)` : ''));
R(/^E: Kasada öde · (\d+) ürün · (.+)$/, (n, s) => `E: Pay at the till · ${n} item${n === '1' ? '' : 's'} · ${s}`);
R(/^(.+) alındı · (.+) kaldı$/, (i, m) => `${t(i)} bought · ${m} left`);
R(/^(.+): bu seferlik bizden!$/, i => `${t(i)}: on the house this time!`);
R(/^(.+) sepette · (\d+) ürün$/, (i, n) => `${t(i)} in the basket · ${n} item${n === '1' ? '' : 's'}`);
R(/^Ödendi: (.+) · (.+) kaldı$/, (s, m) => `Paid: ${s} · ${m} left`);
R(/^Sıra numaranız A-(\d+)\. Bekleme salonunda oturabilirsiniz\.$/, n => `Your number is A-${n}. Please take a seat in the waiting room.`);
R(/^Hırsızlık · (.+) · (\d+) m$/, (p, d) => `Theft · ${p} · ${d} m`);
R(/^GOOOL! (.+) · (\d+-\d+)$/, (k, s) => `GOAL! ${k} · ${s}`);
R(/^(.+ \d+ - \d+ .+) · (birazdan|devre arası|maç sonu|\d+')$/, (s, p) => `${s} · ${({ birazdan: 'starting soon', 'devre arası': 'half-time', 'maç sonu': 'full time' })[p] || p}`);
R(/^Bugün (.+) ve (.+)$/, (a, b) => `Today ${a} and ${b}`);
R(/^Ankara · (.+) · nem %(\d+) · rüzgâr (\d+) km\/sa$/, (l, h, w) => `Ankara · ${t(l)} · humidity ${h}% · wind ${w} km/h`);
R(/^Elle: ([^·]+?)(?: · Ankara'da şu an (-?\d+)° (.+))?$/, (k, d, l) => `Manual: ${t(k)}` + (d ? ` · Ankara now ${d}° ${t(l)}` : ''));
R(/^(\S+) elle$/, i => `${i} manual`);
R(/^(Yangın|Trafik kazası|Hırsızlık|Yaya kazası) · (.+)$/, (a, p) => `${t(a)} · ${p}`);
L.fallback(/^([^:]{1,24}): (.+)$/, (a, b) => { const r = t(b); return r === b ? `${a}: ${b}` : `${a}: ${r}`; });   // "Reis: ..." gibi
L.watch();
})();
