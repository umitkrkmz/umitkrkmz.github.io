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

## Olaylar

Şehirde yarım dakikada bir, bazen daha seyrek, bir şeyler olur. Sol üstteki akışta saati, sokak adı ve durumuyla görünür; tıklayınca kamera olay yerine uçar.

- **Yangın:** pencerelerden alev, çatıdan duman çıkar. İtfaiye gelir, su sıkıp söndürür; ambulans da yetişir.
- **Trafik kazası:** iki araç çarpışır, şerit kapanır, diğer araçlar başka yoldan gider. Ambulans ve polis gelir, yol açılır.
- **Hırsızlık:** sırt çantalı bir şüpheli kaldırımda kaçar, polis gelince elleri havada yakalanır.

Acil durum araçları sirenle kırmızıda geçer, önlerindeki araçlar kenara çekilip yol verir. İş bitince istasyonlarına dönerler.

## Örümcek Adam 🕷

Şehrin bir de mahalle kahramanı var. Boş zamanlarında çatıdan çatıya zıplar, yüksek binalara ağ atıp kendini çeker, çatı kenarına çömelip etrafı izler. Genelde senin baktığın yere doğru gelir.

Bir hırsızlık olunca yolların üstünden binalara ağ atarak kavşaktan kavşağa sallanır, şüpheliyi kovalar. Şüpheli onu görünce donakalır; Örümcek Adam yanına iner, ağ fırlatıp onu kozaya sarar ve polise teslim eder. Sonra yine bir çatıya çıkar.

Kontrol panelindeki **Örümcek Adam'ı izle** düğmesi kamerayı ona kilitler; yön tuşlarına basınca ya da başka bir görünüme geçince takip biter.

> Örümcek Adam, Marvel'ın karakteridir. Burada tamamen hayran işi, eğlencesine bir misafir oyuncu.

## Ayrıntı kademeleri

Kameranın baktığı noktaya uzaklığına göre şehir dört kademede açılır:

| Kademe | Uzaklık | Ne görünür |
|---|---|---|
| Şehir | 320 m'den uzak | Bina kütleleri, sokak ızgarası |
| Mahalle | 130–320 m | Pencereler, ağaçlar, lambalar, yol çizgileri, trafik |
| Sokak | 45–130 m | Dükkân tabelaları, tenteler, balkonlar, çatı donanımı, yayalar |
| Göz hizası | 45 m'den yakın | Vitrinler, saat kulesi, her ayrıntı |

## Şehirde neler var?

- 13 × 13 blok, kenarı 740 m; ortada saat kulesi olan bir meydan, yedi park, merkeze yaklaştıkça yükselen binalar.
- Dört yüzünde şehrin saatini gösteren bir saat kulesi.
- Önemli yapılar: dört minareli Merkez Camii, helikopter pistli Şehir Hastanesi, İtfaiye Merkezi, bayraklı Merkez Karakolu ve ışık kuleli Şehir Stadı. Tıklayınca bilgi kartı açılır, "Yakından bak" kamerayı oraya götürür.
- Sağdan akan, kavşaklarda düz giden, sağa ve sola dönen trafik; sola dönen araç karşıdan geleni bekler. Işıklar 20 saniyelik döngüyle çalışır.
- Kaldırımlarda yürüyen, köşelerde araçlara kırmızı yanınca karşıdan karşıya geçen yayalar.
- Yaklaşınca pencerelerin ardında derinliği olan odalar: duvarlar, zemin, tavan, mobilya ve perdeler bakış açısıyla değişir. Gece yalnızca ışığı yanan odalar aydınlıktır.
- Kafe ve çay ocaklarının önünde masalar, fincanlar ve oturan insanlar.
- İki otobüs hattı (12 ve 34): duraklarda bekleyen yolcular, durağa yanaşıp yolcu alan otobüsler.
- Gün doğumu, alacakaranlık, gece; geceleri yanan pencereler, sokak lambaları, farlar ve yıldızlar.
- Ekim ayında olduğumuz için sararmış birkaç ağaç. 🍂
- Yuvarlak köşeli, kornişli ve parapetli binalar; denizlikli pencereler; yuvarlak hatlı, tekerlekli araçlar; taş döşeli kaldırımlar, çöp kutuları; ufka doğru açılan gökyüzü.

## Sırada ne var?

- [x] Şehri büyütmek, kavşakta dönen araçlar
- [x] Önemli yapılar: hastane, itfaiye, karakol, cami, stadyum
- [x] Rastgele olaylar: yangın, trafik kazası, suç; olay yerine koşan itfaiye, ambulans ve polis
- [x] Çatılarda dolaşan, suç olunca ağla sallanarak gelen bir kahraman
- [x] Binaların içi, karşıdan karşıya geçen yayalar, şehrin küçük hayatı
- [x] Görsel cila: daha çok ayrıntı, daha keskin görüntü, keskin kenarlar yerine yuvarlatılmış hatlar

## Teknik

- [Three.js](https://threejs.org/) r128, düz `<script>` dosyaları, modül ya da derleme yok.
- Her şey tohumlu rastgelelikle üretilir; aynı tohum aynı şehri verir.

| Dosya | Görevi |
|---|---|
| `js/world.js` | Sahne, kamera, ışıklar, gökyüzü, gün/gece, yollar |
| `js/details.js` | Tabelalar, balkonlar, çatı donanımı, park, meydan, saat kulesi |
| `js/landmarks.js` | Cami, hastane, itfaiye, karakol, stadyum |
| `js/buildings.js` | Cepheler, parseller, binalar, ayrıntı kademesi |
| `js/interiors.js` | Pencere arkasındaki odalar (shader) ve kesit görünümü |
| `js/street.js` | Ağaçlar, lambalar, banklar |
| `js/traffic.js` | Yol ağı, dönen araçlar, trafik ışıkları, karşıya geçen yayalar |
| `js/events.js` | Olaylar, acil durum araçları, duman/alev/su, olay akışı |
| `js/life.js` | Otobüs hatları, duraklar, bekleyen yolcular |
| `js/hero.js` | Örümcek Adam: kostüm, devriye, kovalama, ağ |
| `js/ui.js` | Kamera kontrolü, bina seçimi, panel, ana döngü |

## Lisans

[MIT](LICENSE)
