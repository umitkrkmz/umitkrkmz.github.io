---
appSlug: qrpeek
docType: support
lang: tr
title: QRPeek — Destek ve Kısayollar
description: QRPeek iletişim kanalları, temel kısayollar, yerel ağ aktarımı ve bilinen kısıtlar.
lastUpdated: "2026-11-12"
---

## İletişim ve sorun bildirimi

| Konu | Kanal |
|---|---|
| Soru, öneri, Store desteği | E-posta: [zeynelumitkorkmaz@gmail.com](mailto:zeynelumitkorkmaz@gmail.com?subject=QRPeek) |
| Herkese açık hata bildirimi | [github.com/umitkrkmz/qrpeek/issues](https://github.com/umitkrkmz/qrpeek/issues/new/choose) |
| Güvenlik açığı | Herkese açık kayıt açmadan doğrudan e-posta ile bildirin |

## Temel kısayollar ve kullanım

| Kısayol | İşlev |
|---|---|
| `Ctrl + Alt + Q` *(değiştirilebilir)* | Tüm ekranlardaki QR kodlarını tara; bulunamazsa alan seç |
| `Ctrl + Alt + W` *(değiştirilebilir)* | Panodaki metni veya dosyayı telefona gönder |
| `Ctrl + V` / Sürükle-bırak | Görselden QR veya metin/makbuz oku |

* **Telefondan al:** Bildirim alanı simgesinden veya gönderme penceresinden **Telefondan al**’ı açın, QR’ı telefonunuzla okutun. Telefon önce yalnızca dosya listesini gönderir; bilgisayarda **Kabul et** demeden hiçbir dosya yazılmaz.
* **Makbuz kartı ve fatura sözlüğü:** Seçtiğiniz alanda QR yoksa yazı Windows OCR ile okunur. Başka dillerdeki fatura başlıklarını *Ayarlar → Yazı tanıma → Fatura sözlüğü* üzerinden ekleyebilirsiniz.

## Bilinen kısıtlar

* Yazı tanıma (OCR) kusursuz değildir; harf ve rakam karışık kodlarda `1` / `I` karışabilir veya küçük işaretler kaybolabilir. Bu nedenle makbuz kartındaki tüm değerler düzenlenebilir sunulur.
* Makbuz kartı tanımadığı bir düzende alanları tahminle doldurmak yerine boş bırakır; tam metin her zaman ikinci sekmededir.
* ARM64 işlemcili Windows 11 cihazlar için işlemciden bağımsız derlenir; karşılaştığınız sorunları bildirebilirsiniz.
