# Mikro Şehir: proje notları

Tarayıcıda çalışan 3B şehir. Derleme yok: `index.html` dosyasını tarayıcıda aç (veya `python -m http.server 8123`). Geliştirirken `.claude/devserver.py` kullan (önbelleği kapatır; `python -m http.server` ile tarayıcı eski JS'yi tutabiliyor). Three.js r128 CDN'den gelir. Arayüz Türkçe. Tam şartname için `PROMPT.md`.

## Dosya haritası (yükleme sırası önemli, hepsi `window.C` kullanır)
| Dosya | Ne yapar |
|---|---|
| `js/world.js` | Sabitler (`C.N` = 17, `BLOCK, ROAD, PITCH, TOTAL, SW, FLOOR_H`, meydan `C.MID`, ilk şehre göre ölçek `C.SCALE`, `C.coarse`), ilçeler (`C.DISTRICTS` 3×3: ad, kaldırım tonu, gökdelen/apartman/ev eğilimi; `C.districtOf(i, j)`, `C.districtAt(x, z)`), renderer (piksel oranı masaüstünde 2, dokunmatikte 1,5; gölge haritası 4096/2048), sahne, kamera, ışıklar, gökyüzü kubbesi (tepe/ufuk geçişi, ufuk = sis rengi), `C.applyTime(saat)`, dokulu asfalt (`C.noiseTex`), yol çizgileri, `C.inst`/`C.setM`, `C.roundBox` (yuvarlak kenarlı kutu, ölçüye göre önbellekli, değiştirmeden önce `clone()`), `C.mergeGeos` |
| `js/terrain.js` | Vadi ve çevresi: `C.terrainH(x, z)` (fbm dağlar, şehir kutusunda düz, yol ve akarsu boyunca vadi, akarsu yatağı, yol koridoru ve tünel önü yarması), merkeze sık ızgaralı arazi ağı (yükseklik/eğimden renk: çayır, orman, kaya, kar, kum), örnekli çam ve yapraklı ağaçlar, akan akarsu şeridi, yol şeridi + bariyer + lambalar + tünel ağzı. Yol bilgisi `C.highway` (`pts`, `L`, `y(s)`, `startNode`); sis ve `camera.far` burada |
| `js/people.js` | Eklemli insan: 10 parça (gövde+kalça, yüzlü ve saçlı baş, üst kol, ön kol+el, üst bacak, alt bacak+ayakkabı), parça başına iki renk (`aMask` + `instanceColor2`, shader'da karışır). `C.Crowd(kapasite, { glow, shadow })`: `look(i, görünüm)`, `set(i, x, y, z, ry, poz)`, `hide`, `commit`, `dispose`. `C.pose(ad, t, çıktı)`: walk, run, stand, talk, sit, drink, tv, study, cook, kneel, lie, handsup. `C.randomLook` |
| `js/details.js` | Tabela dokuları, `C.buildDetail(bina)` (tabela, tente, balkon, çatı donanımı), `C.makePark`, `C.makePlaza`, saat kulesi, `C.drawClock` |
| `js/landmarks.js` | Önemli yapılar: `C.makeLandmark(blok, tür)` (hastane, itfaiye, karakol, stadyum), `C.finishLandmark` (meydan da bunu kullanır), `C.landmarks`, `C.landmarkMeshes` |
| `js/buildings.js` | Cephe dokuları (1024 px, hücre 64 px) ve malzemeler, `C.boxGeo(w, h, d, kat, rnd, { r, parapet })` (yuvarlak köşeli prizma + korniş + parapet + çatı; malzeme dizisi `[cephe, korniş, çatı, çatı, cephe, cephe]`), `C.CORNER_R`, `C.addGroundAO` (cephe zemine yakın kararır), taş döşemeli kaldırım, blok/parsel üretimi (`C.genBlocks`; park ve yapı yerleri `PARKS`, `LANDMARKS`), `C.specFor`, `C.placeBuilding`, `C.removeBuilding`, `C.populate(tohum)`, bina kademe döngüsü `C.updateBuildingsLOD` |
| `js/interiors.js` | Camın ardında gerçek odalar (`C.living`): kameraya 75 m içindeki en fazla 2 binada kameraya bakan cephede 3 pencere; cephe malzemesi klonlanır (`HOLES`, `uHoles`) ve o hücrelerde cam `discard` edilir, arkasına oda kurulur (tv, cook, study, dinner); geometri `userData.sides` ile hücrenin dünyadaki yeri bulunur; `b.holeMats` LOD'da korunur. Pencere arkasında sahte odalar: cephe malzemelerine `onBeforeCompile` ile interior mapping (yakın malzemeler, `INTERIOR`/`CW` tanımları, 220 m'de söner). Kesit: `C.cutaway.open(bina)`/`close()`/`heightOf`; katlar ızgaraya bölünür (daire ~11 m, dükkân ~12 m), tüm kutular tek InstancedMesh, insanlar ikinci bir çift |
| `js/street.js` | Ağaç, lamba, ışık havuzu, bank (örnekli): `C.buildStreet()` |
| `js/traffic.js` | Şehir dışı yol trafiği: her yönde iki şerit, tünelden gelen araç doğu kavşağında `RES` (24) araçlık yedek havuzdan biriyle şehre katılır; çıkış şeridine gelenler (ve arada bir `leaving` rotası verilenler) yola çıkıp tünelde kaybolur (`C.hwCars`, `C.reserve`; havuzdaki araç `off`). Yol ağı (`C.roads`: kavşak düğümleri, yönlü kenarlar, Bezier dönüşler), araçlar (`C.cars`), trafik ışıkları, yayalar: `C.setDensity`, `C.updateTraffic(dt)`, `C.buildPeople`, `C.updatePeople(dt)`. Özel araç API'si: `C.spawnCar`, `C.despawnCar`, `C.setRoute(araç, kenar, s)` (kenar grafiğinde BFS), `C.parkCar`/`C.unparkCar`, `C.blockEdge`, `C.carPos` |
| `js/life.js` | Otobüs hatları (`C.transit`: `LINES` durak listesi blok, yüz), durak sığınakları, bekleyen yolcular; otobüsler özel araçtır, durakta kaldırıma park eder |
| `js/events.js` | Olaylar (`C.startEvent(tür)`: `fire`, `accident`, `crime`; `C.eventsOn`), acil durum araçları (istasyonları önemli yapıların +z yüzündeki şerit), parçacık yayıcıları (duman, alev, su), sokak adları (`C.placeName`), sol üstteki olay akışı |
| `js/hero.js` | Pijamalı Çocuk (`C.hero`: `pos`, `root`, `state()`, `alert(olay)`): canvas kostüm dokuları, kalça > gövde > kol/baş hiyerarşisi, hareket parçaları (`hop` zıplama, `swing` sallanma, `zip` ağla çekilme), devriye (kameranın baktığı yere yönelir), hırsızlıkta kavşaktan kavşağa kovalama ve ağla yakalama |
| `js/player.js` | Karakter modu (`C.player`: `enter`, `exit`, `active`, `pos`, `indoor`): üçüncü şahıs kamera (imleç kilidi, duvara çarpınca yaklaşır), WASD/Shift, 24 m ızgarada çarpışma (binalar, yapılar, ağaçlar, lambalar; `C.bver` değişince yenilenir), kaldırım basamağı, E ile konuşma balonları, kapı/çıkış ipucu |
| `js/venues.js` | Girilebilir mekanlar (`C.venues`): kapılar `C.shopDoors` (details.js kaydeder) ve `LANDMARK_DOOR`; iç mekan binanın zemin katına, kapının arkasına kurulur (yerel çerçeve: x kapı boyunca, z içeri); `LAYOUT` türleri; içerideyken önemli yapının dış kabuğu gizlenir; kamera oda kutusunda tutulur |
| `js/ui.js` | Dünyayı kurar, OrbitControls (`C.controls`), imlece yakınlaşma, yön tuşları/WASD ile kaydırma, uçuş animasyonu (`C.flyTo`; `keep` verilmezse kahraman takibini bırakır), kahraman takibi ("Pijamalı Çocuğu izle"), engelsiz bakış noktası (`C.clearView`), bina ve yapı seçimi, kart, kontroller, kademe göstergesi, ana döngü |

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
- `C.peopleLayers` traffic.js'de sıfırlanır; ondan önce yüklenen dosyalar (details.js gibi) kendi görünürlüğünü `C.updaters` içinde D'ye göre yönetir.
- Oyun modunda (`C.player.active`) OrbitControls güncellenmez; kamerayı player.js sürer, `controls.target` başa eşitlenir (kademe ve gölge ona göre çalışır). ui.js tuş, tekerlek ve tıklama işleyicileri oyun modunda karakter tarafına bırakır.
- Bina kaldırılırken `C.onRemove` dinleyicileri çağrılır (camın ardındaki odalar burada temizlenir); binaya bağlı yeni bir şey eklersen buraya bağla.
- Kalabalığı çok olan yerlerde (yayalar, kafe) `begin()` / `put()` / `end()` kullan: yalnızca görünenler sırayla yazılır, `count` küçülür; gizlenenler GPU'ya hiç gitmez.
- Uzaktaki binalar tek malzemeyle (dizi değil) çizilir: grup başına ayrı çizim çağrısı olmaz.
- Geliştirme için `C.freeCam = true` kamera sınırını kapatır (yolu, tüneli denetlemek için).
- Arazi ağı merkezden uzaklaştıkça seyrekleşir (~20 m'den ~35 m'ye); ince ayrıntı (yol, tünel ağzı) arazinin altında kalabiliyorsa koridor/yarma ile düzleştir, ağır yapıyla (tünel ön duvarı gibi) örtülü bırak.
- `C.updateTraffic` her kademede çalışır (araçlar şehir kademesinde gizli ama hareket eder).
- Shader'a kod eklerken `onBeforeCompile` zincirlenir: yakın cephe malzemelerinde `interiors.js` hem `C.addGroundAO` hem oda kodunu ekler. Yeni ekleme yaparken mevcut `onBeforeCompile`'ı ezme.
- Python ile JS düzenlerken ters eğik çizgi kaçışları bash heredoc'ta kaybolabiliyor; bu tür değişiklikleri betik dosyasına yazıp çalıştır.
- Kullanıcı arayüzü metinleri Türkçe. Renkler `index.html` içindeki CSS değişkenlerinden gelir.

## Bilinen sınırlar
- Kesişen yönlerdeki araçlar birbirine bakmaz; sirenli araç kırmızıda geçerken yan yoldan gelenin içinden geçebilir.
- Araçlar yalnızca kendi yolundaki öndeki araca bakar. Aynı kenara aynı anda giren iki araç (ör. sağa dönen ile karşıdan sola dönen) kısa bir an iç içe geçebilir.
- 17×17'de kuş bakışında ~1.250 çizim çağrısı, sokak seviyesinde ~3,5 milyon üçgen (gölge geçişi dahil). Güçlü makinede kare 5–6 ms. Zayıf makinede ilk adım gölgeyi kapatmak ya da gölge haritasını küçültmek; sonra ağaç sayısı ve araç yoğunluğu.
- 1. kat balkonları zemin kattaki dükkân tabelalarının önüne düşüyor (`details.js` balkon döngüsü `fi = 1`'den başlıyor). Henüz düzeltilmedi.
- 2026-10-14'te tarayıcıda uçtan uca denendi: konsol temiz; kademeler, gece, kat ekleme/yıkma/yeniden dikme çalışıyor.
- Tarayıcı paneli gizliyken `requestAnimationFrame` durur; otomatik testte bina ayrıntıları eksik görünebilir, bu bir hata değildir.

## Doğrulama
Tarayıcıda aç, konsolda hata olmadığını gör, kuş bakışından göz hizasına yaklaşıp her kademede ayrıntıların açıldığını, geceyi (saat 22:00), bir binayı seçip kat eklemeyi ve yıkmayı dene.
