---
appSlug: mediagrab
docType: support
lang: tr
title: MediaGrab — Destek ve Sorun Giderme
description: MediaGrab iletişim kanalları, başlarken rehberi, Microsoft Store notları ve sık karşılaşılan sorunlar için çözüm adımları.
lastUpdated: "2026-11-24"
---

## Bize ulaşın

MediaGrab bağımsız bir geliştiricinin işidir; her mesajı okuyorum ve en kısa sürede yanıtlamaya çalışıyorum. Uygulama içindeki *Ayarlar → Geri Bildirim → Yardım ve Destek* düğmesi ve *Hakkında* sayfası, GitHub hesabı olmadan okunabilen [GitHub destek sayfasına (`SUPPORT.md`)](https://github.com/umitkrkmz/mediagrab/blob/master/SUPPORT.md) doğrudan bağlanır.

| Konu | Kanal |
|---|---|
| Soru, sorun, öneri, satın alma | E-posta: [zeynelumitkorkmaz@gmail.com](mailto:zeynelumitkorkmaz@gmail.com?subject=MediaGrab) |
| Herkese açık sorun bildirimi | [github.com/umitkrkmz/mediagrab/issues](https://github.com/umitkrkmz/mediagrab/issues) |
| Güvenlik açığı | Herkese açık kayıt açmadan doğrudan e-posta ile bildirin |

Yazarken *Ayarlar → Geri Bildirim → **Tanılama bilgisini kopyala*** çıktısını (MediaGrab, `yt-dlp` ve Windows sürümleri ile kurulum türü; dosya yolu, IP adresi veya çerez içermez), ne yaptığınızı, varsa ekran görüntüsünü ve sorun tek bir videodaysa bağlantısını eklemeniz çözümü hızlandırır. **Çerez dosyanızı (`cookies.txt`) asla göndermeyin;** hesabınıza erişim sağlar.

## Başlarken ve indirme

* **Açmak:** MediaGrab’ı Başlat menüsünden açın; ayrı bir pencere yerine varsayılan tarayıcınızda `http://127.0.0.1:8420` adresinde açılır.
* **Bildirim alanı:** Çalışırken saatin yanında mavi **M** simgesi durur (Windows 11’de `^` altında olabilir). Tıklamak sayfayı yeniden açar; sağ tık → **MediaGrab’ı kapat** uygulamayı kapatır. Tarayıcı sekmesini kapatmak uygulamayı kapatmaz.
* **İndirme ve dosyalar:** Ana sayfadaki kutuya bağlantıyı yapıştırın (1700’den fazla site desteklenir); **En İyi Ses** / **En İyi Video** veya belirli bir kalite, altyazı ve transkript seçin. Dosyalar varsayılan olarak `İndirilenler\MediaGrab` altında kanal klasörlerine kaydedilir (*Ayarlar → İndirme Ayarları*’ndan değiştirilebilir).
* **Telefondan kullanım:** *Ayarlar → Uzaktan Erişim* bölümünden bir şifre belirleyip yerel ağ erişimini açın ve aynı Wi-Fi ağındaki telefonunuzla QR kodu okutun. Bağlantı düz HTTP’dir; yalnızca güvendiğiniz ev veya ofis ağında kullanın.

## Microsoft Store sürümü

* **Güncellemeler:** MediaGrab ve içindeki `yt-dlp` motoru Store üzerinden güncellenir. Bir site indirmeyi bozarsa *Microsoft Store → Kitaplık → Güncellemeleri al* ile en son sürümü yükleyin. Store kuralı gereği `yt-dlp` uygulama içinden ayrıca güncellenmez.
* **Kaldırma ve yedekleme:** Uygulamayı kaldırdığınızda ayarlarınız ve takip listeniz silinir; **indirdiğiniz dosyalar kalır.** Ayarlarınızı korumak için kaldırmadan önce *Ayarlar → Yedekle* ile dışa aktarabilir, yeniden kurulum sonrası aynı yerden içe aktarabilirsiniz.
* **Başka bilgisayarda kullanım:** Satın alma Microsoft hesabınıza bağlıdır; aynı hesapla Store’dan yeniden yükleyebilirsiniz. Ücretsiz ve açık kaynak sürüm [GitHub’da](https://github.com/umitkrkmz/mediagrab) da sunulur.

## Sorun giderme

* **MediaGrab açılmıyor ya da sayfa gelmiyor:** Bildirim alanında mavi **M** simgesi varsa tıklayın veya tarayıcıda `http://127.0.0.1:8420` adresini açın. Simge yoksa Başlat menüsünden yeniden başlatın.
* **Bir video inmiyor ya da yarıda kalıyor:** Önce Store’dan güncellemeleri alın (*Kitaplık → Güncellemeleri al*). GitHub/kaynak kurulumunda Ayarlar’dan veya `pip install -U "yt-dlp[default,deno]"` ile `yt-dlp` güncellenebilir. Sorun sürerse bağlantıyı ve tanılama bilgisini e-postayla gönderin.
* **Yaş sınırlı, üyelere özel veya giriş gerektiren videolar:** Hata mesajının altındaki *Ayarlar → Çerezler* bağlantısından çerez kaynağınızı tanımlayın.
* **“DRM” hatası:** Kopya korumalı (DRM) ücretli film ve dizi akışları yasal olarak indirilemez; MediaGrab bu korumayı aşmaz.
* **Kalite adları sitedekinden farklı (ör. `1020p`):** MediaGrab her formatı videonun gerçek yüksekliğiyle gösterir; standart dışı boyutlu videolarda listenin altında kısa bir not görünür.
* **Telefon bağlanamıyor:** İki cihazın aynı ağda olduğunu ve *Uzaktan Erişim*’in açık olduğunu kontrol edin. `mediagrab.local` bazı telefonlarda (özellikle Android’de) çalışmaz; paneldeki **IP adresini** veya QR kodu kullanın. Telefonda pano yapıştırma düğmesi yerine alana uzun basıp **Yapıştır**’ı seçin.
* **Uzaktan erişim şifremi unuttum:** Şifre sıfırlama adımları [kılavuzun Uzaktan Erişim bölümünde](https://github.com/umitkrkmz/mediagrab/blob/master/docs/README.tr.md#uzaktan-eri%C5%9Fim-yerel-a%C4%9Fdan) yer alır.
