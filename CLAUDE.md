# Mikro Şehir: proje notları

Tarayıcıda çalışan 3B şehir. Derleme yok: `index.html` dosyasını tarayıcıda aç (veya `python -m http.server 8123`). Three.js r128 CDN'den gelir. Arayüz Türkçe. Tam şartname için `PROMPT.md`.

## Dosya haritası (yükleme sırası önemli, hepsi `window.C` kullanır)
| Dosya | Ne yapar |
|---|---|
| `js/world.js` | Sabitler (`C.N, BLOCK, ROAD, PITCH, TOTAL, SW, FLOOR_H`), renderer, sahne, kamera, ışıklar, gökyüzü, `C.applyTime(saat)`, asfalt, yol çizgileri, `C.inst`/`C.setM` yardımcıları |
| `js/details.js` | Tabela dokuları, `C.buildDetail(bina)` (tabela, tente, balkon, çatı donanımı), `C.makePark`, `C.makePlaza`, saat kulesi, `C.drawClock` |
| `js/buildings.js` | Cephe dokuları ve malzemeler, `C.boxGeo`, blok/parsel üretimi (`C.genBlocks`), `C.specFor`, `C.placeBuilding`, `C.removeBuilding`, `C.populate(tohum)`, bina kademe döngüsü `C.updateBuildingsLOD` |
| `js/street.js` | Ağaç, lamba, ışık havuzu, bank (örnekli): `C.buildStreet()` |
| `js/traffic.js` | Şeritler, araçlar, trafik ışıkları, yayalar: `C.setDensity`, `C.updateTraffic(dt)`, `C.buildPeople`, `C.updatePeople(dt)` |
| `js/ui.js` | Dünyayı kurar, OrbitControls, imlece yakınlaşma, uçuş animasyonu, bina seçimi ve kart, kontroller, kademe göstergesi, ana döngü |

## Önemli kurallar
- Kademeler `ui.js` içinde `levelOf(D)` ile: D > 320 şehir, > 130 mahalle, > 45 sokak, aksi halde göz hizası. Yeni ayrıntı eklerken hangi kademede görüneceğine karar ver ve `ui.js` döngüsündeki görünürlük satırlarına bağla.
- Her `InstancedMesh` için `frustumCulled = false` (`C.inst` bunu yapar). Örnek sayısını baştan sabitle.
- Renkler `C.col('#hex')` ile (sRGB → doğrusal). `scene.background` hariç, o `world.js` içinde geri çevriliyor.
- Gece parıltısı için malzemeyi `C.nightListeners.push(n => ...)` ile bağla, `n` 0 (gündüz) ile 1 (gece) arasındadır.
- Her kare çalışacak mantığı `C.updaters.push((dt, t, D) => ...)` ile ekle.
- Bina değişince `C.rebuildBuilding(b)` ya da `C.removeBuilding(lot)` + `C.refreshPickables()` çağır, aksi halde tıklama listesi eskir.
- Bina ayrıntısı tembel kurulur (`C.buildDetail`), paylaşılan geometrileri (`boxG`, `planeG`, `cylG`) asla `dispose` etme.
- Kullanıcı arayüzü metinleri Türkçe. Renkler `index.html` içindeki CSS değişkenlerinden gelir.

## Bilinen sınırlar
- Araçlar kavşakta dönmez, yalnızca düz gider. Kavşak çakışması yeşil geçişte nadiren olabilir.
- Yayalar yalnızca bloğun kaldırım halkasında yürür, yol karşısına geçmez.
- 1. kat balkonları zemin kattaki dükkân tabelalarının önüne düşüyor (`details.js` balkon döngüsü `fi = 1`'den başlıyor). Henüz düzeltilmedi.
- 2026-10-14'te tarayıcıda uçtan uca denendi: konsol temiz; kademeler, gece, kat ekleme/yıkma/yeniden dikme çalışıyor.
- Tarayıcı paneli gizliyken `requestAnimationFrame` durur; otomatik testte bina ayrıntıları eksik görünebilir, bu bir hata değildir.

## Doğrulama
Tarayıcıda aç, konsolda hata olmadığını gör, kuş bakışından göz hizasına yaklaşıp her kademede ayrıntıların açıldığını, geceyi (saat 22:00), bir binayı seçip kat eklemeyi ve yıkmayı dene.
