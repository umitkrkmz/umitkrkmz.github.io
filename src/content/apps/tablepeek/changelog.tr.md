---
appSlug: tablepeek
docType: changelog
lang: tr
title: TablePeek — Sürüm Notları
description: TablePeek sürümlerindeki yenilikler ve düzeltmeler.
lastUpdated: "2026-11-14"
---

## v0.1.1 — 2026-11-14

### Düzeltme

* Store sayfasından, başka bir bilgisayardan ya da promosyon koduyla alınan teşekkür eklentilerinin Windows lisans önbelleği nedeniyle geç tanınması düzeltildi. TablePeek artık sahipliği doğrudan Microsoft Store’dan da doğruluyor; satın alma onaylanınca renk temaları ve destekçi işareti hemen açılıyor.

## v0.1.0 — 2026-11-14

Microsoft Store’daki ilk sürüm.

### Okuma ve Stüdyo

* Kısayolla (`Ctrl + Alt + Shift + T`), resim dosyasından, panodan veya sürükle-bırak ile tamamen yerel tablo okuma.
* Kenarlıklı tablolar, çizgisiz tablolar ve e-tablo görüntülerinde (satır numaraları ve sütun harfleri ayıklanarak) sütun/satır tespiti.
* Otomatik, Türkçe veya İngilizce tablo dili seçimi; sık OCR hataları (`0/O`, `1/I`, nokta/virgül, `₺` ve `%`) için düzeltmeler.
* Stüdyo’da görüntü üzerinde sütun sınırlarını sürükleme, hücre yeniden okuma, birleştirme, bölme, satır/sütun ekleme ve geri al / yinele.

### Excel’e aktarma ve uygulama

* Yalnızca değerler veya dolgu, renk, kalınlık, hizalama, kenarlık ve birleştirilmiş hücreleri koruyan biçimli yapıştırma; para, yüzde, sayı ve tarihlerin gerçek değer olarak aktarılması.
* Filtreli Excel tablosu ve sabit başlık satırıyla `.xlsx` olarak kaydetme ve doğrudan kopyalama modu.
* Türkçe/İngilizce arayüz, açık/koyu tema, Windows ile başlatma, OCR dil paketi denetimi ve isteğe bağlı kozmetik teşekkür eklentileri.
