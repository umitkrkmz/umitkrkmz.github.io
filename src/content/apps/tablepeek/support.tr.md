---
appSlug: tablepeek
docType: support
lang: tr
title: TablePeek — Destek ve Kullanım İpuçları
description: TablePeek iletişim kanalları, OCR dil paketleri, klavye kısayolları ve en iyi okuma ipuçları.
lastUpdated: "2026-11-14"
---

## İletişim ve sorun bildirimi

| Konu | Kanal |
|---|---|
| Soru, öneri, satın alma desteği | E-posta: [zeynelumitkorkmaz@gmail.com](mailto:zeynelumitkorkmaz@gmail.com?subject=TablePeek) |
| Herkese açık hata ve öneri bildirimi | [github.com/umitkrkmz/tablepeek/issues](https://github.com/umitkrkmz/tablepeek/issues/new/choose) |

Yanlış okunan bir tablo bildirirken mümkünse **kişisel veri içermeyen** bir örnek görüntü ve Windows sürümünüzü eklemeniz çözümü hızlandırır.

## Yazı tanıma (OCR) dil paketleri

TablePeek, Windows’un yerleşik yazı tanımasını kullanır. **Ayarlar → Yazı tanıma** ekranı hangi dillerin kurulu olduğunu gösterir. Eksik bir dili kurmak için:

1. **Windows dil ayarlarını aç** düğmesine basın (*Ayarlar → Zaman ve dil → Dil ve bölge*).
2. Dil listede yoksa **Dil ekle** ile ekleyin.
3. Dilin yanındaki **⋯ → Dil seçenekleri → Optik karakter tanıma → İndir** yolunu izleyin.
4. TablePeek’te **Yeniden denetle** düğmesine basın.

## Klavye kısayolları

| Nerede | Kısayol | İşlev |
|---|---|---|
| Her yerde | `Ctrl + Alt + Shift + T` *(değiştirilebilir)* | Tablo yakala |
| Alan seçerken | `Esc` | İptal |
| Ana pencere | `Ctrl + V` | Panodaki resmi oku |
| Stüdyo | `Ctrl + Z` / `Ctrl + Y` | Geri al / Yinele |
| Stüdyo | `Delete` | Satırları sil / hücreleri boşalt |

## En iyi okuma sonuçları için ipuçları

* **Küçük yazı:** Tabloyu ekranda yakalamadan önce yakınlaştırmak (`Ctrl + +`) doğruluğu belirgin biçimde artırır.
* **Sütun sınırları:** Sütunlar yanlış ayrıldıysa Stüdyo’da görüntü üzerindeki mavi çizgileri sürükleyebilir, yeni sınır ekleyebilir veya fazlalığı kaldırabilirsiniz.
* **Tek hücreyi yeniden okuma:** Hatalı bir hücreye sağ tıklayıp **Bu hücreyi yeniden oku** seçeneğini deneyebilir ya da doğrudan düzenleyebilirsiniz.
* **Yalnızca tabloyu seçin:** Çevredeki menü ve filtre panellerini seçimin dışında bırakmak daha temiz sonuç verir.
* **Türkçe tablolar:** `₺` ve Türkçe harfler için Windows Türkçe OCR paketinin kurulu olması önerilir.
