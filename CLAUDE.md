# Mikro Şehir: proje notları

Tarayıcıda çalışan 3B şehir. Derleme yok: `index.html` dosyasını tarayıcıda aç (veya `python -m http.server 8123`). Three.js r128 CDN'den gelir. Arayüz Türkçe. Tam şartname için `PROMPT.md`.

## Dosya haritası (yükleme sırası önemli, hepsi `window.C` kullanır)
| Dosya | Ne yapar |
|---|---|
| `js/world.js` | Sabitler (`C.N, BLOCK, ROAD, PITCH, TOTAL, SW, FLOOR_H`, meydan `C.MID`, ilk şehre göre ölçek `C.SCALE`), renderer, sahne, kamera, ışıklar, gökyüzü, `C.applyTime(saat)`, asfalt, yol çizgileri, `C.inst`/`C.setM` yardımcıları |
| `js/details.js` | Tabela dokuları, `C.buildDetail(bina)` (tabela, tente, balkon, çatı donanımı), `C.makePark`, `C.makePlaza`, saat kulesi, `C.drawClock` |
| `js/landmarks.js` | Önemli yapılar: `C.makeLandmark(blok, tür)` (cami, hastane, itfaiye, karakol, stadyum), `C.finishLandmark` (meydan da bunu kullanır), `C.landmarks`, `C.landmarkMeshes` |
| `js/buildings.js` | Cephe dokuları ve malzemeler, `C.boxGeo`, blok/parsel üretimi (`C.genBlocks`; park ve yapı yerleri `PARKS`, `LANDMARKS`), `C.specFor`, `C.placeBuilding`, `C.removeBuilding`, `C.populate(tohum)`, bina kademe döngüsü `C.updateBuildingsLOD` |
| `js/street.js` | Ağaç, lamba, ışık havuzu, bank (örnekli): `C.buildStreet()` |
| `js/traffic.js` | Yol ağı (`C.roads`: kavşak düğümleri, yönlü kenarlar, Bezier dönüşler), araçlar (`C.cars`), trafik ışıkları, yayalar: `C.setDensity`, `C.updateTraffic(dt)`, `C.buildPeople`, `C.updatePeople(dt)`. Özel araç API'si: `C.spawnCar`, `C.despawnCar`, `C.setRoute(araç, kenar, s)` (kenar grafiğinde BFS), `C.parkCar`/`C.unparkCar`, `C.blockEdge`, `C.carPos` |
| `js/events.js` | Olaylar (`C.startEvent(tür)`: `fire`, `accident`, `crime`; `C.eventsOn`), acil durum araçları (istasyonları önemli yapıların +z yüzündeki şerit), parçacık yayıcıları (duman, alev, su), sokak adları (`C.placeName`), sol üstteki olay akışı |
| `js/ui.js` | Dünyayı kurar, OrbitControls (`C.controls`), imlece yakınlaşma, yön tuşları/WASD ile kaydırma, uçuş animasyonu (`C.flyTo`), engelsiz bakış noktası (`C.clearView`), bina ve yapı seçimi, kart, kontroller, kademe göstergesi, ana döngü |

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
- `C.updateTraffic` her kademede çalışır (araçlar şehir kademesinde gizli ama hareket eder).
- Kullanıcı arayüzü metinleri Türkçe. Renkler `index.html` içindeki CSS değişkenlerinden gelir.

## Bilinen sınırlar
- Kesişen yönlerdeki araçlar birbirine bakmaz; sirenli araç kırmızıda geçerken yan yoldan gelenin içinden geçebilir.
- Araçlar yalnızca kendi yolundaki öndeki araca bakar. Aynı kenara aynı anda giren iki araç (ör. sağa dönen ile karşıdan sola dönen) kısa bir an iç içe geçebilir.
- 13×13'te kuş bakışında yaklaşık 3.500 çizim çağrısı var (gölge geçişi dahil). Güçlü makinede kare 6–8 ms, zayıf dizüstünde yavaşlarsa bina geometrilerini birleştirmek ilk adım.
- Yayalar yalnızca bloğun kaldırım halkasında yürür, yol karşısına geçmez.
- 1. kat balkonları zemin kattaki dükkân tabelalarının önüne düşüyor (`details.js` balkon döngüsü `fi = 1`'den başlıyor). Henüz düzeltilmedi.
- 2026-10-14'te tarayıcıda uçtan uca denendi: konsol temiz; kademeler, gece, kat ekleme/yıkma/yeniden dikme çalışıyor.
- Tarayıcı paneli gizliyken `requestAnimationFrame` durur; otomatik testte bina ayrıntıları eksik görünebilir, bu bir hata değildir.

## Doğrulama
Tarayıcıda aç, konsolda hata olmadığını gör, kuş bakışından göz hizasına yaklaşıp her kademede ayrıntıların açıldığını, geceyi (saat 22:00), bir binayı seçip kat eklemeyi ve yıkmayı dene.
