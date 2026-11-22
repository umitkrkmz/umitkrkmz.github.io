---
appSlug: mediagrab
docType: changelog
lang: tr
title: MediaGrab — Sürüm Notları
description: MediaGrab sürümlerindeki önemli yenilikler ve düzeltmeler.
lastUpdated: "2026-11-14"
---

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
