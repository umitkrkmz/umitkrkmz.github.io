---
appSlug: qrpeek
docType: changelog
lang: tr
title: QRPeek — Sürüm Notları
description: QRPeek sürümlerindeki yenilikler ve düzeltmeler.
lastUpdated: "2026-11-12"
---

## v0.3.0 — 2026-11-12

### Yeni

* **QR yoksa yazıyı ve makbuzu oku:** Seçilen alanda QR kodu bulunamazsa yazı Windows’un yerleşik OCR motoruyla yerelde okunur; makbuz ve faturalar seçilebilir alanlı bir karta dönüşür (özet, Excel, CSV veya özet QR).
* **Fatura sözlüğü:** Yerleşik Türkçe ve İngilizce fatura başlıklarına ek olarak *Ayarlar → Yazı tanıma* altından başka diller veya kendi başlıklarınız eklenip `.txt` olarak içe/dışa aktarılabilir.
* **Bölümlü yeni Ayarlar penceresi:** Kısayollar, Genel, Dil, Yazı tanıma ve Hakkında sekmeleriyle tüm ekran boyutlarına sığan düzen.

### Düzeltme

* *Gerçek hedefi göster*, bir site otomatik denetimi engellediğinde (ör. HTTP 403) artık *Yönlendirme yok* demek yerine engellendiğini açıkça bildiriyor.

## v0.2.0 — 2026-11-11

* **Telefondan al:** Cihaza uygulama kurmadan, yalnızca yerel ağdan ve bilgisayar onayıyla fotoğraf ve dosya alma (4 haneli eşleşme kodu, 10 dakika oturum süresi, güvenli dosya adı temizliği).
* **Çoklu ekran bilgisi:** Birden çok monitörde kodun hangi ekranda bulunduğunu gösterme ve farklı DPI ölçeklerinde doğrulama.

## v0.1.0 — 2026-11-11

* İlk sürüm: `Ctrl + Alt + Q` ile tüm ekranlardan QR okuma, yoğun e-Arşiv kod okuyucu, bağlantı güvenlik kartı, tek tıkla Wi-Fi, maskeli 2FA, e-Fatura CSV aktarımı, `Ctrl + Alt + W` telefona gönderme ve okunabilirliği doğrulanan logolu QR oluşturucu.
