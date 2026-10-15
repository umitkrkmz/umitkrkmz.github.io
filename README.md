# Mikro Şehir

Tarayıcıda çalışan, **yakınlaştıkça yeni ayrıntıların açıldığı** küçük bir 3B şehir.
Uzaktan bakınca bina kütleleri, biraz yaklaşınca pencereler ve trafik, iyice inince dükkân tabelaları ve yürüyen insanlar.

> Ciddi bir proje değil, tamamen eğlencesine yapıldı. Şehrin belediye başkanı da, imar planı da, trafik polisi de biziz. 🏙️

## Nasıl açılır?

Derleme adımı yok, kurulacak bir şey yok.

- `index.html` dosyasına çift tıkla, tarayıcıda açılsın.
- Ya da klasörde küçük bir sunucu çalıştır ve `http://localhost:8123` adresine git:

```bash
python -m http.server 8123
```

İnternet bağlantısı gerekir; Three.js ve yazı tipleri CDN'den gelir. Tarayıcıda WebGL açık olmalı.

## Kontroller

| Ne | Fare | Dokunmatik |
|---|---|---|
| Döndür | Sol tuşla sürükle | Tek parmakla sürükle |
| Kaydır | Sağ tuşla sürükle ya da yön tuşları / WASD (Shift: hızlı) | İki parmakla sürükle |
| Yakınlaş | Tekerlek (imlecin altına doğru) | İki parmakla sıkıştır |
| Bina seç | Tıkla | Dokun |

Seçtiğin binaya **kat ekleyebilir**, **kat silebilir** ya da binayı **yıkabilirsin**. Boş kalan arsaya yeniden müstakil ev, apartman veya ofis kulesi dikebilirsin. **Kesit** düğmesi binanın katlarını birbirinden ayırır: dairelerde kanepeler, yataklar, mutfaklar; zemin katta dükkânlar; gökdelenlerde lobi, masa sıraları ve toplantı odaları, hepsinde küçük insanlar.

Kontrol panelinde saat kaydırıcısı, "Günü ilerlet", trafik yoğunluğu, gölgeler, rastgele olaylar, "Olay çıkar" ve hazır kamera görünümleri (Kuş bakışı, Siluet, Sokağa in, Saat kulesi) var. "Yeni şehir kur" her seferinde başka bir şehir üretir.

## Portfolyo telefonu 📱

Şehirde bir geliştirici dolaşıyor: koyu kapüşonlu, sırtında laptop çantası, meydanın doğusundaki kaldırımda. Kontrol panelindeki **Beni bul** kamerayı onun önüne indirir; el sallar, cebinden telefonunu çıkarır ve telefon ekranda açılır. Telefonun içi portfolyodur: projeler, hakkımda, iletişim ve "Bu şehir nasıl yapıldı". Kilit ekranındaki saat şehrin saatidir.

- Sağ üstteki **Portfolyo** düğmesi telefonu her an doğrudan açar; `#telefon` ile biten bağlantı da açar.
- Sağ üstteki X ya da Esc kapatır. Telefon boyunda ekranda tam ekran açılır.
- Portfolyo tek başına da açılır: `portfolio/` (WebGL'i olmayan cihazlar ve hızlı bağlantı için). Yazıların hepsi `portfolio/content.js` içinde.

## Karakteri oyna 🎮

Kontrol panelindeki **Karakteri oyna** düğmesiyle kamera kuş bakışından süzülüp bir vatandaşın arkasına iner.

| Ne | Tuş |
|---|---|
| Yürü / koş / zıpla | WASD veya yön tuşları, Shift ile koş, Space ile zıpla |
| Etrafa bak | Sahneye tıkla, imleç kilitlenir; fareyle bak (Esc bırakır) |
| Kamera uzaklığı | Tekerlek |
| Konuş / içeri gir / dışarı çık | E |
| Kediyi sev / kucağına al, bırak | E / Q |
| Banka otur / kalk | E (kalkmak için WASD da olur) |

Binalardan, ağaçlardan, lambalardan, banklardan ve araçlardan geçemezsin. Boş bir bankın yanında E ile oturursun. Yolda durursan gelen araç fren yapar; ama birden önüne atlarsan çarpabilir: yere düşer, biraz sonra kalkarsın, ambulans ve polis gelir. Yanındaki birine E'ye basarsan sana döner ve cevap verir.

Sokaklarda ve parklarda kediler dolaşır, oturur, gerinir, yalanır, kıvrılıp uyur: sarman, smokin, beyaz, tekir, kara, üç renkli, gri, krem; her birinin bir adı var. Yanına gidip E ile sevebilirsin: mırlar, kuyruğunu diker, gözlerini kapatır, sonra bir süre peşine takılır. Q ile kucağına alıp gezdirir, Q ile bırakırsın; bıraktığın yer artık onun mahallesidir. Üstüne koşarak gidersen kaçar.

Dükkânlara ve önemli yapılara girebilirsin: kafe ve çay ocağı, Ankara simidi, fırın, market, kırtasiye, eczane, optik, kuaför, kebapçı, çiçekçi, tamirci; Merkez Karakolu (nezarethanesiyle), hastanenin acil servisi ve itfaiye garajı. İçerideki herkesle konuşulabilir. Space ile zıplarsın.

## Olaylar

Şehirde yarım dakikada bir, bazen daha seyrek, bir şeyler olur. Sol üstteki akışta saati, sokak adı ve durumuyla görünür; tıklayınca kamera olay yerine uçar.

- **Yangın:** pencerelerden alev, çatıdan duman çıkar. İtfaiye gelir, su sıkıp söndürür; ambulans da yetişir.
- **Trafik kazası:** iki araç çarpışır, şerit kapanır, diğer araçlar başka yoldan gider. Ambulans ve polis gelir, yol açılır.
- **Hırsızlık:** sırt çantalı bir şüpheli kaldırımda kaçar, polis gelince elleri havada yakalanır.
- **Yaya kazası:** bir araç yayaya çarpar; yaralı yolda yatar, meraklılar kaldırımda toplanır, araç durur, şerit kapanır. Ambulans yaralıyı alır, polis ifade alır, yol açılır.

Acil durum araçları sirenle kırmızıda geçer, önlerindeki araçlar kenara çekilip yol verir. İş bitince istasyonlarına dönerler.

## Pijamalı Çocuk 🕷

Şehrin bir de mahalle kahramanı var. Boş zamanlarında çatıdan çatıya zıplar, yüksek binalara ağ atıp kendini çeker, çatı kenarına çömelip etrafı izler. Genelde senin baktığın yere doğru gelir.

Bir hırsızlık olunca yolların üstünden binalara ağ atarak kavşaktan kavşağa sallanır, şüpheliyi kovalar. Şüpheli onu görünce donakalır; Pijamalı Çocuk yanına iner, ağ fırlatıp onu kozaya sarar ve polise teslim eder. Sonra yine bir çatıya çıkar.

Kontrol panelindeki **Pijamalı Çocuğu izle** düğmesi kamerayı ona kilitler; yön tuşlarına basınca ya da başka bir görünüme geçince takip biter.

### Pijamalı Çocuk olarak oyna

**Pijamalı Çocuk olarak oyna** düğmesiyle kahramanın kontrolü sende: bulunduğu çatıdan başlarsın. Ekranın ortasındaki nişangâh ağın gideceği yeri gösterir, tutunacak bir yer varsa renklenir.

| Ne | Nasıl |
|---|---|
| Koş / hızlı koş | WASD veya yön tuşları, Shift ile hızlı |
| Zıpla | Space; basılı tutup bırakınca daha yükseğe (tam güçte takla atar) |
| Duvara tırman | Duvara doğru koş, W ile yukarı, A/D ile yana, S ile aşağı; köşeden yan yüze döner, tepede çatıya geçer |
| Duvarda koş | Duvardayken Shift + W ile dimdik yukarı koşar |
| Duvardan sıçra | Duvardayken Space |
| Ağla sallan | Sol tık ya da F basılı tut; W ile salınımı büyüt, bırakınca fırla. Basılı tutarken düşersen yeni ağ atar |
| Ağla çekil | Sağ tık ya da Q: nişangâhtaki çatıya, duvara ya da yere. Tutunduğun duvara bakarken tepesine çeker |
| Hırsızı yakala | Hırsızlık olunca üstte yön oku ve mesafe çıkar, şüphelinin üstünde mavi bir ışık sütunu yanar; 30 m içinde E ile ağa sar |
| Konuş | Yerdeyken yanındaki yayaya E: hayranların var |

Yüksekten düşünce diz çökerek iner. Kamera hızlandıkça biraz geri çekilir ve görüş açısı genişler; fareyi bırakınca gidiş yönüne döner. Kuş bakışına dönünce kahraman kaldığı yerden kendi başına devam eder, yarım kalan hırsızlığı da üstlenir.

> Adı, bir süper kahraman filminde ona "pijamalı çocuk" diye takılan dahi mucide selam olsun. Kostüm tanıdık gelebilir; tamamen hayran işi, eğlencesine bir misafir oyuncu.

## Ayrıntı kademeleri

Kameranın baktığı noktaya uzaklığına göre şehir dört kademede açılır:

| Kademe | Uzaklık | Ne görünür |
|---|---|---|
| Şehir | 320 m'den uzak | Bina kütleleri, sokak ızgarası |
| Mahalle | 130–320 m | Pencereler, ağaçlar, lambalar, yol çizgileri, trafik |
| Sokak | 45–130 m | Dükkân tabelaları, tenteler, çatı donanımı, yayalar |
| Göz hizası | 45 m'den yakın | Vitrinler, saat kulesi, her ayrıntı |

## Şehirde neler var?

- Hayali bir şehir: 17 × 17 blok, kenarı yaklaşık 964 m, dokuz ilçe. Ortada gökdelenleriyle Saatçi; çevresinde Yeşiltepe, Çınaraltı, Akpınar, Gülbahçe, Değirmendere, Taşbayır, Kuyubaşı ve Limanköy. Kenar ilçelerde müstakil evler ve alçak binalar çoğunlukta, her ilçenin kaldırım tonu ayrı; sol üstte bulunduğun ilçe yazar.
- Ortada saat kulesi olan bir meydan, on park, merkeze yaklaştıkça yükselen binalar.
- Parklarda göller: kıyı taşları, nilüferler ve pembe çiçekleri, sazlar, yüzen ördekler, suda açılan halkalar. Banklarda oturup çay içenler; gündüz kalabalık, gece seyrek.
- Sokak kedileri. Gece 21.30'dan sonra merkeze en yakın parkta kedi toplantısı olur: sekiz kedi çember olup oturur, ortada Reis; yakındaysan konuşmalarını duyarsın.
- Şehir Stadı'nda 13.30–17.00 ve 19.00–22.30 arası maç: ilçe takımları, kaleciler, hakem, tribünde takım renklerinde taraftar, gol sevinci ve skor tabelası. Stada tıklayınca kartta skor ve dakika görünür.
- Şehir dağların eteğinde bir vadide: çevresinde çayırlar, tepelerde çam ormanları, yamaçlarda kaya, zirvelerde kar; güneyinden doğudaki dağlardan inip batıdaki boğazdan çıkan bir akarsu geçer.
- Doğu kavşağından vadi boyunca tırmanan, dağdaki bir tünele giren dört şeritli bir yol: tünelden gelen araçlar şehrin trafiğine katılır, şehirden ayrılanlar yola çıkıp tünelde kaybolur.
- Dört yüzünde şehrin saatini gösteren bir saat kulesi.
- Önemli yapılar: helikopter pistli Şehir Hastanesi, İtfaiye Merkezi, bayraklı Merkez Karakolu ve ışık kuleli Şehir Stadı. Tıklayınca bilgi kartı açılır, "Yakından bak" kamerayı oraya götürür.
- Sağdan akan, kavşaklarda düz giden, sağa ve sola dönen trafik; dönecek araç sinyal verir, sola dönen araç karşıdan geleni bekler. Işıklar 20 saniyelik döngüyle çalışır.
- Eli, kolu, dizi, ayakkabısı ve yüzü olan insanlar; yürür, koşar, oturur, konuşur, çay içer, yemek yapar, ders çalışır, uyur.
- Kaldırımlarda yürüyen, köşelerde araçlara kırmızı yanınca karşıdan karşıya geçen yayalar.
- Yakındaki binaların bazı pencerelerinin camı gerçekten açıktır: içeride biri televizyon izler, biri yemek yapar, biri ders çalışır, bazıları sofrada.
- Yaklaşınca pencerelerin ardında derinliği olan odalar: duvarlar, zemin, tavan, mobilya ve perdeler bakış açısıyla değişir. Gece yalnızca ışığı yanan odalar aydınlıktır.
- Kafe ve çay ocaklarının önünde masalar, fincanlar ve oturan insanlar.
- Üç otobüs hattı (12, 34 ve şehri çevreleyen 56): duraklarda bekleyen yolcular, durağa yanaşıp yolcu alan otobüsler.
- Gün doğumu, alacakaranlık, gece; geceleri yanan pencereler, sokak lambaları, farlar ve yıldızlar.
- Ekim ayında olduğumuz için sararmış birkaç ağaç. 🍂
- Yuvarlak köşeli, kornişli ve parapetli binalar; denizlikli pencereler; yuvarlak hatlı, tekerlekli araçlar; taş döşeli kaldırımlar, çöp kutuları; ufka doğru açılan gökyüzü.

## Sırada ne var?

- [x] Şehri büyütmek, kavşakta dönen araçlar
- [x] Önemli yapılar: hastane, itfaiye, karakol, stadyum
- [x] Rastgele olaylar: yangın, trafik kazası, suç; olay yerine koşan itfaiye, ambulans ve polis
- [x] Çatılarda dolaşan, suç olunca ağla sallanarak gelen bir kahraman
- [x] Binaların içi, karşıdan karşıya geçen yayalar, şehrin küçük hayatı
- [x] Görsel cila: daha çok ayrıntı, daha keskin görüntü, keskin kenarlar yerine yuvarlatılmış hatlar
- [x] Ayrıntılı insanlar, karakter modu, girilebilir mekânlar, camın ardında yaşayan daireler
- [x] İlçelere ayrılmış daha büyük hayali şehir, zıplama, dağlarla çevrili vadi, akarsu, şehre giriş-çıkış yolu
- [x] Pijamalı Çocuk olarak oyna: koşu, yüksek zıplama, duvara tırmanma ve duvarda koşma, ağla sallanma ve çekilme, hırsızı ağla sarma
- [x] Kediler ve kedi toplantısı, araç çarpışması ve yaya kazası, dönüş sinyalleri, banklarda oturanlar, park gölleri, stadyumda maç

## Teknik

- [Three.js](https://threejs.org/) r128, düz `<script>` dosyaları, modül ya da derleme yok.
- Her şey tohumlu rastgelelikle üretilir; aynı tohum aynı şehri verir.

| Dosya | Görevi |
|---|---|
| `js/world.js` | Sahne, kamera, ışıklar, gökyüzü, gün/gece, yollar |
| `js/terrain.js` | Vadi, dağlar, orman, akarsu, giriş-çıkış yolu ve tünel |
| `js/people.js` | Eklemli insan modeli, pozlar, örnekli kalabalık |
| `js/details.js` | Tabelalar, çatı donanımı, park, meydan, saat kulesi |
| `js/landmarks.js` | Hastane, itfaiye, karakol, stadyum |
| `js/buildings.js` | Cepheler, parseller, binalar, ayrıntı kademesi |
| `js/interiors.js` | Pencere arkasındaki odalar (shader), camın ardında gerçek odalar, kesit görünümü |
| `js/street.js` | Ağaçlar, lambalar, banklar |
| `js/traffic.js` | Yol ağı, dönen araçlar, trafik ışıkları, şehre giren ve çıkan yol trafiği, karşıya geçen yayalar |
| `js/events.js` | Olaylar, acil durum araçları, duman/alev/su, olay akışı |
| `js/life.js` | Otobüs hatları, duraklar, bekleyen yolcular |
| `js/hero.js` | Pijamalı Çocuk: kostüm, devriye, kovalama, ağ |
| `js/player.js` | Karakter modu: hareket, kamera, çarpışma, konuşma |
| `js/heroplay.js` | Pijamalı Çocuk olarak oyna: koşu, tırmanma, ağla sallanma ve çekilme |
| `js/cats.js` | Sokak kedileri, sevme ve kucağa alma, kedi toplantısı |
| `js/ponds.js` | Park göllerinin taşları, nilüferleri, sazları, ördekleri |
| `js/stadium.js` | Stadyumda maç: oyuncular, top, taraftarlar, skor tabelası |
| `js/developer.js` | Şehirdeki geliştirici, Beni bul, portfolyo telefonu |
| `portfolio/` | Bağımsız portfolyo sayfası (telefonun içi); içerik `content.js` |
| `js/venues.js` | Girilebilir dükkânlar ve önemli yapıların içi |
| `js/ui.js` | Kamera kontrolü, bina seçimi, panel, ana döngü |

## Lisans

[MIT](LICENSE)
