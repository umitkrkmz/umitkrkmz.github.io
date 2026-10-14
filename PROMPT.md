# Mikro Şehir: başlangıç promptu

Aşağıdaki metni Claude'a (masaüstü uygulamasında yeni bir proje açıp) olduğu gibi yapıştır. Kod zaten `js/` altında hazır. Sıfırdan yeniden yazdırmak istersen bu prompt yeterli, devam etmek istersen `CLAUDE.md` dosyasını okutmak yeterli.

---

## Prompt

Tarayıcıda çalışan, **yakınlaştıkça yeni ayrıntıların açıldığı**, etkileşimli, 3 boyutlu bir şehir simülasyonu yap. Derleme adımı olmasın: düz `index.html` + klasik `<script>` dosyaları, `file://` ile çift tıklayınca açılsın. Arayüz Türkçe olsun.

### Teknik çerçeve
- Three.js **r128**, CDN'den (`cdn.jsdelivr.net/npm/three@0.128.0`), OrbitControls aynı sürümden `examples/js/controls/OrbitControls.js`.
- Modül yok. Tek global ad alanı: `window.C`. Dosyalar sırayla yüklenir: `world.js`, `details.js`, `buildings.js`, `street.js`, `traffic.js`, `ui.js`.
- Yazı tipleri Google Fonts: Big Shoulders Display (başlık ve sayılar), IBM Plex Sans (metin), IBM Plex Mono (etiket ve düğmeler).
- Açık ve koyu tema desteği (CSS değişkenleri, `prefers-color-scheme`). WebGL yoksa anlaşılır bir mesaj göster.

### Dünya
- 9 × 9 blok. Blok 44 m, yol 12 m, aralık (pitch) 56 m, toplam 516 m. Kaldırım yüksekliği 0,3 m, kat yüksekliği 3,2 m.
- Ortadaki blok meydan: saat kulesi (dört yüzünde **simüle edilen saati gösteren** canvas saat), havuz, bankalar, ağaçlar.
- 5 blok park: çim, iki yol, gölet, 26 ağaç, bankalar. Kalan bloklar 1, 2 veya 4 parsele bölünür.
- Binalar merkeze yaklaştıkça yükselir: gökdelen (22–48 kat, çoğu 3 kademeli geri çekilmeli, cam cephe), apartman (6–14 kat), alçak bina (3–5), kiremit çatılı müstakil ev (2–3). Her şey tohumlu rastgeleliktir (mulberry32), "Yeni şehir kur" yeni tohum seçer.
- Cepheler tek paylaşılan canvas dokusundan gelir (16 × 16 hücre, pencere ve emissive harita). Kutu UV'leri hücre sayısına göre ölçeklenir, böylece pencere boyutu her binada aynı kalır.

### Ayrıntı kademeleri (en önemli özellik)
Kamera ile hedef arası mesafe D'ye göre: **D > 320 Şehir**, **130–320 Mahalle**, **45–130 Sokak**, **≤ 45 Göz hizası**.
- Şehir: bina kütleleri düz renk, sokak ızgarası. Ağaç, lamba, trafik, yol çizgisi yok.
- Mahalle: pencere dokuları, ağaçlar, lambalar, yol çizgileri ve yaya geçitleri, trafik ışıkları, akan araçlar.
- Sokak: yayalar (yürüme animasyonlu), ve kameraya 140 m'den yakın her binada dükkân tabelaları (12 Türkçe isim: FIRIN, ECZANE, KIRTASİYE, ÇAY OCAĞI…), tente, vitrin, balkonlar, çatı klima ve su deposu, gökdelende yanıp sönen kırmızı anten ışığı.
- Bina ayrıntıları **tembel** kurulur (kare başına en fazla 3 bina), görünmezken gizlenir. Binalar kameraya 330 m'den uzaksa düz renkli malzemeye geçer.

### Sistemler
- **Trafik:** 2 eksen × 10 yol × 2 şerit, sağdan akış. Aşırı basit ama inandırıcı: halka şerit, öndeki araca mesafe + trafik ışığında durma çizgisi, hızlanma 3 m/s², frenleme 9 m/s². Işık döngüsü 20 sn (yeşil 7, sarı 1,5, hepsi kırmızı 1,5, sonra diğer eksen). Yoğunluk kaydırıcısı şerit başına 0–12 araç. Araçlar örnekli (instanced) çizilir, parçalar aynı matrisi paylaşır.
- **Yayalar:** her bloğun kaldırım halkasında dolaşır, bacak ve kol salınımı vardır, örnekli çizim.
- **Gün/gece:** 0–24 saat kaydırıcısı ve "Günü ilerlet". Güneş yayı, alacakaranlık rengi, yıldızlar, ay, gece yanan pencereler, lamba ışık havuzları (eklemeli karışım), far ve stop lambaları, tabela ve saat parıltısı. Ekim ayı olduğu için bazı ağaçlar sarı.
- **Gölge:** tek yönlü ışık, gölge kamerası hedefi izler, genişlik `clamp(D*1.1, 70, 330)`. Dokunmatik cihazda varsayılan kapalı.

### Etkileşim
- Fare: sürükle döndür, sağ tuş kaydır, **tekerlek imlecin altındaki zemine doğru yakınlaştırır** (yakınlaşma noktası zemin düzlemiyle ışın kesişimi). Dokunmatik: tek parmak döndür, iki parmak yakınlaş/kaydır.
- Bina seçimi: tıklayınca amber çerçeve ve kart (yükseklik, kat, parsel, tahmini sakin/çalışan). Düğmeler: **+ Kat**, **− Kat**, **Yık**. Yıkılan parsel "Boş arsa" olur, oradan **Müstakil ev / Apartman / Ofis kulesi** dikilir.
- Hazır görünümler (uçuşlu, mesafe logaritmik interpolasyon): Kuş bakışı, Siluet, Sokağa in (rastgele bir dükkân önü), Saat kulesi.
- Sol üst: 4 kademeli gösterge (aktif olan vurgulu), o kademede ne açıldığını anlatan cümle, hedefe mesafe (m), ölçek çubuğu. Sağ alt: seçim kartı ve katlanabilir kontrol paneli. Telefonda panel alta yayılır ve katlanmış başlar.

### Görsel dil
Tabela dünyası: soğuk kâğıt grisi zemin (`#dfe3e6`), koyu mürekkep (`#16212b`), vurgu rengi yol levhası kehribarı (`#b85c00`, koyu temada `#ffb53d`). Büyük harfli, sıkıştırılmış başlıklar, mono etiketler. Kartlarda 8 px yarıçap ve bulanık arka plan, başka süs yok.

### Performans ve tuzaklar (r128'e özgü, bunları bil)
- `InstancedMesh` için **`frustumCulled = false`** şart, yoksa geometri merkezi görünür dışındayken tüm örnekler kaybolur.
- Renk yönetimi: `outputEncoding = sRGBEncoding`, tüm renkleri `Color.convertSRGBToLinear()` ile ver. **`scene.background` shader'dan geçmez**, bu yüzden arka planı `convertLinearToSRGB()` ile geri çevir, yoksa ufukta sis rengiyle arka plan arasında şerit oluşur.
- Z-fighting: yol çizgileri asfalttan 2 cm yüksekte. Kameranın `near` değerini `clamp(0.4 + 0.012*D, 0.4, 7)` yap ve `polygonOffset` kullan.
- OrbitControls kendi tekerlek dinleyicisini çalıştırmasın diye sahne kabında **capture** aşamasında `wheel` yakala ve `stopPropagation()` çağır. `maxPolarAngle = π` ver, kamerayı elle `y ≥ 1,4` ile sınırla (hedef yüksekteyken yukarı bakabilmek için).
- Kutu geometrisinde yalnızca yan yüzlerin UV'sini ölçekle (yüz 2 ve 3 çatı/taban). Malzeme dizisi `[yan, yan, çatı, çatı, yan, yan]`.

### Kabul ölçütleri
1. Açılışta kuş bakışında tüm şehir görünür, kademe göstergesi "Şehir" der.
2. İmleçle yaklaştıkça sırayla pencereler, ağaçlar, trafik, tabelalar, yayalar belirir, kademe göstergesi buna eşlik eder.
3. Bir binaya tıklayıp kat ekleyip yıkabilir, boş arsaya yeni bina dikebilirim.
4. Gece 22:00'de pencereler, lambalar ve farlar yanar, yıldızlar görünür.
5. Telefonda dikey ekranda taşma yok, kontrol paneli katlanır.
6. Konsolda hata yok.

### Çalışma şekli
Önce `world.js` ve boş bloklarla sahneyi ayağa kaldır, tarayıcıda aç, ekran görüntüsüyle doğrula; sonra sırayla binalar, ayrıntılar, sokak donanımı, trafik, yayalar, arayüz. Her aşamada tarayıcıda çalıştırıp konsolu kontrol et.

---

## Sonraki adım fikirleri
- Araçların kavşakta dönmesi, sarı taksiler, otobüs hatları.
- Binaya tıklayınca içine girip kat planı ya da pencerelerde ışık açma/kapama.
- Parselleri sürükleyerek imar planı çizme, bina türünü fırçayla boyama.
- Yağmur ve sis, ıslak asfalt yansıması.
- Kaydet / yükle (şehir tohumu + yapılan değişiklikler `localStorage`'a).
- Yayaların yol karşısına geçmesi, kalabalık yoğunluğu kaydırıcısı.
- Gerçek ölçekli harita verisinden (OpenStreetMap) şehir üretimi.
