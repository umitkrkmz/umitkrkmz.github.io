---
appSlug: mediagrab
docType: support
lang: tr
title: MediaGrab — Destek ve Sorun Giderme
description: MediaGrab iletişim kanalları, kurulum ve sık karşılaşılan sorunlar için çözüm adımları.
lastUpdated: "2026-11-14"
---

## İletişim ve sorun bildirimi

| Konu | Kanal |
|---|---|
| Soru, öneri, Store desteği | E-posta: [zeynelumitkorkmaz@gmail.com](mailto:zeynelumitkorkmaz@gmail.com?subject=MediaGrab) |
| Herkese açık hata bildirimi | [github.com/umitkrkmz/mediagrab/issues](https://github.com/umitkrkmz/mediagrab/issues/new/choose) |
| Güvenlik açığı | Herkese açık kayıt açmadan doğrudan e-posta ile bildirin |

## Sık karşılaşılan sorunlar

* **Windows kurulumu sonrası pencere açılmıyorsa:** Önce saatin yanındaki bildirim alanında mavi **M** simgesine bakın (Windows 11’de `^` altında olabilir); varsa tıklayıp açabilirsiniz. Hata oluştuysa `%LOCALAPPDATA%\MediaGrab\mediagrab.log` dosyasını hata bildirimine ekleyebilirsiniz.
* **Telefonda “Panodan yapıştır” düğmesi görünmüyorsa:** Tarayıcılar yerel ağdaki düz HTTP bağlantılarında pano okumasına izin vermez. Bağlantı alanına uzun basıp **Yapıştır**’ı seçtiğinizde bağlantı otomatik çözümlenir.
* **Android telefonda `mediagrab.local` açılmıyorsa:** Android tarayıcılarında `.local` çözümlemesi her zaman çalışmaz. *Ayarlar → Uzaktan Erişim* ekranındaki IP adresini veya QR kodu kullanın.
* **Yaş sınırlı veya giriş gerektiren video inmiyorsa:** *Ayarlar → Çerezler* bölümünden tarayıcı veya `cookies.txt` kaynağını tanımlayabilirsiniz.
* **Bir site çözümlenemiyorsa (“Unable to extract”):** Video platformları arayüzlerini sık günceller. Microsoft Store sürümünde güncellemeler Store üzerinden gelir; GitHub/kaynak sürümünde Ayarlar’dan veya `pip install -U "yt-dlp[default,deno]"` ile `yt-dlp` güncellenebilir.
