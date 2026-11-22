---
appSlug: mediagrab
docType: privacy
lang: tr
title: MediaGrab — Gizlilik Politikası
description: MediaGrab kendi cihazınızda çalışır; hesap, reklam, analiz veya telemetri içermez.
lastUpdated: "2026-11-07"
---

## Kısaca

* **Hesap yok, telemetri yok, reklam yok, analiz yok.** MediaGrab’ın geliştiricinin işlettiği bir sunucusu yoktur; uygulama size ait hiçbir veriyi geliştiriciye göndermez.
* Tüm veriler **sizin cihazınızda** kalır. Bu politika Microsoft Store, GitHub ve Docker sürümleri için geçerlidir.

## Cihazınızda tutulan veriler

Uygulama yalnızca çalışması için gerekenleri kendi veri klasöründe saklar:

* **Ayarlar (`settings.json`):** Dil, indirme klasörü ve kalite tercihleri.
* **Takip ettiğiniz kanallar (`channels.json`)** ve **indirme istatistikleri (`stats.json`)**.
* **İndirdiğiniz dosyalar** ve yanlarındaki `.json` bilgi dosyaları — seçtiğiniz indirme klasöründe.
* **Uzaktan erişim şifresi (açarsanız):** Şifrenin kendisi değil, yalnızca geri çevrilemez bir özeti (`PBKDF2`) saklanır; oturumlar yalnızca bellekte tutulur.
* **Çerezler (açarsanız):** Yalnızca ilgili siteye istek yapılırken kullanılır; başka hiçbir yere gönderilmez.

Microsoft Store sürümünde uygulama verileri Windows’un ayırdığı klasördedir ve **uygulamayı kaldırdığınızda silinir** (indirilen medya dosyalarınız seçtiğiniz klasörde kalır). Ayarlarınızı Ayarlar sayfasından yedekleyebilirsiniz.

## Uygulamanın kurduğu ağ bağlantıları

* **İndirmek istediğiniz siteler:** Bir bağlantı yapıştırdığınızda veya kanal kontrol edildiğinde uygulama `yt-dlp` aracılığıyla o siteye bağlanır. Bu sitelerin kendi gizlilik politikaları geçerlidir.
* **Sürüm kontrolü:** Yeni sürüm kontrolü için GitHub (`api.github.com`) ve PyPI (`pypi.org`) adreslerine kişisel bilgi içermeyen istekler gönderilir.
* **Yerel ağ (yalnızca Uzaktan Erişim açıksa):** Aynı ağdaki cihazların bağlanabilmesi için yerel ağda dinler ve kendini mDNS ile duyurur; internete açılmaz.

## Paylaşım, çocuklar ve iletişim

Geliştirici hiçbir veri toplamaz ve üçüncü taraflarla paylaşmaz; Microsoft Store ödemelerini Microsoft yürütür. MediaGrab çocuklara yönelik değildir ve kimseden bilerek kişisel veri toplamaz. Sorularınız için [zeynelumitkorkmaz@gmail.com](mailto:zeynelumitkorkmaz@gmail.com?subject=MediaGrab) adresine yazabilir veya [GitHub Issues](https://github.com/umitkrkmz/mediagrab/issues/new/choose) üzerinden ulaşabilirsiniz.
