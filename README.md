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
| Kaydır | Sağ tuşla sürükle | İki parmakla sürükle |
| Yakınlaş | Tekerlek (imlecin altına doğru) | İki parmakla sıkıştır |
| Bina seç | Tıkla | Dokun |

Seçtiğin binaya **kat ekleyebilir**, **kat silebilir** ya da binayı **yıkabilirsin**. Boş kalan arsaya yeniden müstakil ev, apartman veya ofis kulesi dikebilirsin.

Kontrol panelinde saat kaydırıcısı, "Günü ilerlet", trafik yoğunluğu, gölgeler ve hazır kamera görünümleri (Kuş bakışı, Siluet, Sokağa in, Saat kulesi) var. "Yeni şehir kur" her seferinde başka bir şehir üretir.

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
- Kaldırımlarda yürüyen yayalar.
- Gün doğumu, alacakaranlık, gece; geceleri yanan pencereler, sokak lambaları, farlar ve yıldızlar.
- Ekim ayında olduğumuz için sararmış birkaç ağaç. 🍂

## Sırada ne var?

- [x] Şehri büyütmek, kavşakta dönen araçlar
- [x] Önemli yapılar: hastane, itfaiye, karakol, cami, stadyum
- [ ] Rastgele olaylar: yangın, trafik kazası, suç; olay yerine koşan itfaiye, ambulans ve polis
- [ ] Çatılarda dolaşan, suç olunca ağla sallanarak gelen bir kahraman
- [ ] Binaların içi, karşıdan karşıya geçen yayalar, şehrin küçük hayatı

## Teknik

- [Three.js](https://threejs.org/) r128, düz `<script>` dosyaları, modül ya da derleme yok.
- Her şey tohumlu rastgelelikle üretilir; aynı tohum aynı şehri verir.

| Dosya | Görevi |
|---|---|
| `js/world.js` | Sahne, kamera, ışıklar, gökyüzü, gün/gece, yollar |
| `js/details.js` | Tabelalar, balkonlar, çatı donanımı, park, meydan, saat kulesi |
| `js/landmarks.js` | Cami, hastane, itfaiye, karakol, stadyum |
| `js/buildings.js` | Cepheler, parseller, binalar, ayrıntı kademesi |
| `js/street.js` | Ağaçlar, lambalar, banklar |
| `js/traffic.js` | Yol ağı, dönen araçlar, trafik ışıkları, yayalar |
| `js/ui.js` | Kamera kontrolü, bina seçimi, panel, ana döngü |

## Lisans

[MIT](LICENSE)
