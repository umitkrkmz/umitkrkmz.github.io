# Mikro Şehir: proje notları

Tarayıcıda çalışan 3B şehir. Derleme yok: `index.html` dosyasını tarayıcıda aç (veya `python -m http.server 8123`). Geliştirirken `.claude/devserver.py` kullan (önbelleği kapatır; `python -m http.server` ile tarayıcı eski JS'yi tutabiliyor). Three.js r128 CDN'den gelir. Arayüz Türkçe. Tam şartname için `PROMPT.md`.

## Dosya haritası (yükleme sırası önemli, hepsi `window.C` kullanır)
| Dosya | Ne yapar |
|---|---|
| `js/world.js` | Sabitler (`C.N, BLOCK, ROAD, PITCH, TOTAL, SW, FLOOR_H`, meydan `C.MID`, ilk şehre göre ölçek `C.SCALE`, `C.coarse`), renderer (piksel oranı masaüstünde 2, dokunmatikte 1,5; gölge haritası 4096/2048), sahne, kamera, ışıklar, gökyüzü kubbesi (tepe/ufuk geçişi, ufuk = sis rengi), `C.applyTime(saat)`, dokulu asfalt (`C.noiseTex`), yol çizgileri, `C.inst`/`C.setM`, `C.roundBox` (yuvarlak kenarlı kutu, ölçüye göre önbellekli, değiştirmeden önce `clone()`), `C.mergeGeos` |
| `js/details.js` | Tabela dokuları, `C.buildDetail(bina)` (tabela, tente, balkon, çatı donanımı), `C.makePark`, `C.makePlaza`, saat kulesi, `C.drawClock` |
| `js/landmarks.js` | Önemli yapılar: `C.makeLandmark(blok, tür)` (cami, hastane, itfaiye, karakol, stadyum), `C.finishLandmark` (meydan da bunu kullanır), `C.landmarks`, `C.landmarkMeshes` |
| `js/buildings.js` | Cephe dokuları (1024 px, hücre 64 px) ve malzemeler, `C.boxGeo(w, h, d, kat, rnd, { r, parapet })` (yuvarlak köşeli prizma + korniş + parapet + çatı; malzeme dizisi `[cephe, korniş, çatı, çatı, cephe, cephe]`), `C.CORNER_R`, `C.addGroundAO` (cephe zemine yakın kararır), taş döşemeli kaldırım, blok/parsel üretimi (`C.genBlocks`; park ve yapı yerleri `PARKS`, `LANDMARKS`), `C.specFor`, `C.placeBuilding`, `C.removeBuilding`, `C.populate(tohum)`, bina kademe döngüsü `C.updateBuildingsLOD` |
| `js/interiors.js` | Pencere arkasında sahte odalar: cephe malzemelerine `onBeforeCompile` ile interior mapping (yakın malzemeler, `INTERIOR`/`CW` tanımları, 220 m'de söner). Kesit: `C.cutaway.open(bina)`/`close()`/`heightOf`; katlar ızgaraya bölünür (daire ~11 m, dükkân ~12 m), tüm kutular tek InstancedMesh, insanlar ikinci bir çift |
| `js/street.js` | Ağaç, lamba, ışık havuzu, bank (örnekli): `C.buildStreet()` |
| `js/traffic.js` | Yol ağı (`C.roads`: kavşak düğümleri, yönlü kenarlar, Bezier dönüşler), araçlar (`C.cars`), trafik ışıkları, yayalar: `C.setDensity`, `C.updateTraffic(dt)`, `C.buildPeople`, `C.updatePeople(dt)`. Özel araç API'si: `C.spawnCar`, `C.despawnCar`, `C.setRoute(araç, kenar, s)` (kenar grafiğinde BFS), `C.parkCar`/`C.unparkCar`, `C.blockEdge`, `C.carPos` |
| `js/life.js` | Otobüs hatları (`C.transit`: `LINES` durak listesi blok, yüz), durak sığınakları, bekleyen yolcular; otobüsler özel araçtır, durakta kaldırıma park eder |
| `js/events.js` | Olaylar (`C.startEvent(tür)`: `fire`, `accident`, `crime`; `C.eventsOn`), acil durum araçları (istasyonları önemli yapıların +z yüzündeki şerit), parçacık yayıcıları (duman, alev, su), sokak adları (`C.placeName`), sol üstteki olay akışı |
| `js/hero.js` | Örümcek Adam (`C.hero`: `pos`, `root`, `state()`, `alert(olay)`): canvas kostüm dokuları, kalça > gövde > kol/baş hiyerarşisi, hareket parçaları (`hop` zıplama, `swing` sallanma, `zip` ağla çekilme), devriye (kameranın baktığı yere yönelir), hırsızlıkta kavşaktan kavşağa kovalama ve ağla yakalama |
| `js/ui.js` | Dünyayı kurar, OrbitControls (`C.controls`), imlece yakınlaşma, yön tuşları/WASD ile kaydırma, uçuş animasyonu (`C.flyTo`; `keep` verilmezse kahraman takibini bırakır), kahraman takibi ("Örümcek Adam'ı izle"), engelsiz bakış noktası (`C.clearView`), bina ve yapı seçimi, kart, kontroller, kademe göstergesi, ana döngü |

## Önemli kurallar
- Kademeler `ui.js` içinde `levelOf(D)` ile: D > 320 şehir, > 130 mahalle, > 45 sokak, aksi halde göz hizası. Yeni ayrıntı eklerken hangi kademede görüneceğine karar ver ve `ui.js` döngüsündeki görünürlük satırlarına bağla.
- Her `InstancedMesh` için `frustumCulled = false` (`C.inst` bunu yapar). Örnek sayısını baştan sabitle.
- r128'de `setColorAt` renk tamponunu ilk çağrıldığı andaki `count` kadar açar. `count`'u sonradan değiştirilen bir mesh'te `instanceColor`'ı tam kapasiteyle kendin oluştur (araçlarda öyle).
- `C.N` tek sayı olmalı (meydan tam ortada). `C.N` değişirse `buildings.js` içindeki `PARKS` ve `LANDMARKS` yerlerini de güncelle.
- Renkler `C.col('#hex')` ile (sRGB → doğrusal). `scene.background` hariç, o `world.js` içinde geri çevriliyor.
- Gece parıltısı için malzemeyi `C.nightListeners.push(n => ...)` ile bağla, `n` 0 (gündüz) ile 1 (gece) arasındadır.
- Her kare çalışacak mantığı `C.updaters.push((dt, t, D) => ...)` ile ekle.
- Bina değişince `C.rebuildBuilding(b)` ya da `C.removeBuilding(lot)` + `C.refreshPickables()` çağır, aksi halde tıklama listesi eskir.
- Bina ayrıntısı tembel kurulur (`C.buildDetail`), paylaşılan geometrileri (`boxG`, `planeG`, `cylG`) asla `dispose` etme.
- Özel araç nesneleri `special: true` taşır, `C.setDensity` onları silmez. `siren` kırmızıda geçirir ve öndeki araçları kenara çektirir (`car.pull`), `crashed` aracı yerinde tutar, `yaw` görüntüyü döndürür.
- Sahneye çalışırken ışık ekleme ya da çıkarma: tüm malzemeler yeniden derlenir. Yangın ışıkları `events.js` içinde baştan iki tane hazır.
- Hırsızlık olayı kahraman kancaları taşır: `heroComing()`, `heroCatch()` (şüpheliyi kozaya sarar); polis gelince `arrive()` teslim alır. Kahraman aynı anda tek göreve gider, meşgulse yalnızca polis gelir.
- Özel araç nesnesinde `next` alanını kullanma: trafik sistemi onu sıradaki kenar için kullanır (otobüslerde durak sırası `stopNo`).
- Kesitteki bina `b.cut` taşır: bina grubu ve ayrıntısı gizlenir; kat ekleme/yıkma ve başka seçim kesiti kapatır.
- Yayalar köşede `tryCross` ile karşıya geçer; yalnızca kestikleri yolun kırmızısı geçişe yetecek kadar uzunsa yürürler (`redLeft`).
- `C.updateTraffic` her kademede çalışır (araçlar şehir kademesinde gizli ama hareket eder).
- Shader'a kod eklerken `onBeforeCompile` zincirlenir: yakın cephe malzemelerinde `interiors.js` hem `C.addGroundAO` hem oda kodunu ekler. Yeni ekleme yaparken mevcut `onBeforeCompile`'ı ezme.
- Python ile JS düzenlerken ters eğik çizgi kaçışları bash heredoc'ta kaybolabiliyor; bu tür değişiklikleri betik dosyasına yazıp çalıştır.
- Kullanıcı arayüzü metinleri Türkçe. Renkler `index.html` içindeki CSS değişkenlerinden gelir.

## Bilinen sınırlar
- Kesişen yönlerdeki araçlar birbirine bakmaz; sirenli araç kırmızıda geçerken yan yoldan gelenin içinden geçebilir.
- Araçlar yalnızca kendi yolundaki öndeki araca bakar. Aynı kenara aynı anda giren iki araç (ör. sağa dönen ile karşıdan sola dönen) kısa bir an iç içe geçebilir.
- 13×13'te kuş bakışında yaklaşık 1.900 çizim çağrısı, sokak seviyesinde ~2,2 milyon üçgen var (gölge geçişi dahil). Güçlü makinede kare 5,5–7 ms; gölge geçişi bunun yarısından fazlası. Zayıf makinede ilk adım gölgeyi kapatmak ya da gölge haritasını küçültmek.
- 1. kat balkonları zemin kattaki dükkân tabelalarının önüne düşüyor (`details.js` balkon döngüsü `fi = 1`'den başlıyor). Henüz düzeltilmedi.
- 2026-10-14'te tarayıcıda uçtan uca denendi: konsol temiz; kademeler, gece, kat ekleme/yıkma/yeniden dikme çalışıyor.
- Tarayıcı paneli gizliyken `requestAnimationFrame` durur; otomatik testte bina ayrıntıları eksik görünebilir, bu bir hata değildir.

## Doğrulama
Tarayıcıda aç, konsolda hata olmadığını gör, kuş bakışından göz hizasına yaklaşıp her kademede ayrıntıların açıldığını, geceyi (saat 22:00), bir binayı seçip kat eklemeyi ve yıkmayı dene.
