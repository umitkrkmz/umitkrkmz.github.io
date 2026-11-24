---
appSlug: mediagrab
docType: changelog
lang: tr
title: MediaGrab — Sürüm Notları
description: MediaGrab sürümlerindeki önemli yenilikler ve düzeltmeler.
lastUpdated: "2026-11-24"
---

## v2.5.3 — 2026-11-24

Yardım ve destek sayfası eklendi.

### Eklenen

* **Yardım ve destek sayfası (`SUPPORT.md`):** Türkçe ve İngilizce olarak e-posta ile iletişim, başlarken, indirme, telefondan kullanım, Microsoft Store sürümü notları ve sık karşılaşılan sorunların çözümleri eklendi. GitHub hesabı olmadan okunabilir; uygulama içindeki *Ayarlar → Geri Bildirim → Yardım ve Destek* düğmesi ve *Hakkında* sayfası doğrudan buraya bağlanır.

### Değiştirilen

* **Gizlilik politikasında iletişim:** Hesap gerektiren GitHub sorun formu yerine destek sayfasındaki doğrudan e-posta adresi öne çıkarıldı.

## v2.5.2 — 2026-11-24

Uzun YouTube videolarında yarıda kalan indirmeler için düzeltme.

### Düzeltilen

* **Uzun YouTube HLS indirmeleri:** YouTube’un yalnızca HLS biçiminde sunduğu videolarda paralel parça indirmesinin birkaç dakika sonra `401 Unauthorized` ve `.part-FragNN` hatasıyla durması giderildi. YouTube parçaları artık sırayla indirilir; diğer siteler etkilenmedi.

### Değiştirilen

* **Paketlenen bileşenler güncellendi:** `yt-dlp 2026.11.23` ve güncel Python bağımlılıkları (Windows kurulum programı ve Microsoft Store sürümü).

## v2.5.1 — 2026-11-14

### Düzeltilen

* **Microsoft Store sürümünde HLS video indirme düzeltmesi:** Windows’un Store uygulamalarını salt okunur `C:\Windows\System32` dizininde başlatmasından kaynaklanan `Permission denied` hatası giderildi; MediaGrab açılışta kendi veri klasörüne geçiyor.

### Eklenen

* **Standart dışı çözünürlük notu:** Kalite listesi artık videonun gerçek yüksekliği ile platformun standart adı arasındaki farkı (ör. `1020p` / `1080p`) açıklayan kısa bir not gösteriyor.
* Yerleşik FFmpeg bileşeni güncellendi.

## v2.5.0 — 2026-11-08

* **Microsoft Store sürümü:** GitHub’daki ücretsiz sürümün yanında tek tıkla kurulan, SmartScreen uyarısız ve otomatik güncellenen Store MSIX paketi yayımlandı.
* **Store modu ve gizlilik politikası:** Paket salt okunur çalışma modu ve iki dilli gizlilik politikası eklendi.
* **Uzaktan Erişim ağ düzeltmesi:** WSL, Hyper-V veya Docker Desktop kurulu sistemlerde sanal ağ kartı yerine ev ağı IP adresinin kullanılması sağlandı.

## v2.4.0 — 2026-10-12

* **Hepsi bir arada Windows kurulumu (`MediaGrabSetup.exe`):** Python, FFmpeg ve Deno dâhil, yönetici izni gerektirmeyen kurulum ve bildirim alanı **M** simgesi.
* **Ayarlanabilir indirme klasörü ve taşıma:** Eski indirmeleri güvenli biçimde yeni klasöre taşıma, Docker ile kurulum seçeneği ve üçüncü taraf lisans bildirimleri.
