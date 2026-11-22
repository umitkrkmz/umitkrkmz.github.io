---
appSlug: qrpeek
docType: privacy
lang: tr
title: QRPeek — Gizlilik Politikası
description: QRPeek hesap, reklam ve telemetri içermez; ekran görüntüleri yalnızca bellekte işlenir.
lastUpdated: "2026-11-12"
---

## Kısaca

* **Hesap yok, telemetri yok, reklam yok, analiz yok.** QRPeek’in geliştiricinin işlettiği bir sunucusu yoktur; uygulama size ait hiçbir veriyi geliştiriciye göndermez.
* Ekran görüntüleri yalnızca bellekte işlenir; **kaydedilmez, hiçbir yere gönderilmez.**
* QR kodu bulunamayan bir alandaki yazı, Windows’un kendi yazı tanıma özelliğiyle (OCR) yalnızca bu bilgisayarda okunur. Okunan yazı geçmişe kaydedilmez ve siz *Metni kopyala*’ya basmadıkça panoya alınmaz.
* Tüm veriler **sizin cihazınızda** kalır.

## Ekran, pano ve cihazda tutulan veriler

* **Ekranı tara / Alan seç:** QRPeek, siz istediğinizde ekran görüntüsünü alır, kodları bellekte çözer ve görüntüyü hemen atar.
* **Ekranı izleme modu** *(varsayılan olarak kapalı)*: Ekran 1,5 saniyede bir yalnızca bu bilgisayarda incelenir; görüntüler saklanmaz.
* **Pano:** Wi-Fi şifreleri ve 2FA anahtarları **asla otomatik kopyalanmaz**; kendiniz kopyaladığınızda Windows pano geçmişine (`Win + V`) ve bulut eşitlemesine girmemeleri için işaretlenir.
* **`%LOCALAPPDATA%\QRPeek` klasörü:** Yalnızca ayarlar (`settings.json`), isteğe bağlı fatura sözlüğü (`terms.txt`), kapatılabilir son 100 kod geçmişi (`history.json` — **2FA kodları hiç yazılmaz, Wi-Fi kodları şifresiz yazılır**) ve hata olursa teknik günlük (`error.log`) saklanır. Microsoft Store sürümünde bu klasör uygulamayı kaldırdığınızda silinir.

## Ağ bağlantıları

QRPeek kendi başına internete çıkmaz. Ağ yalnızca şu durumlarda kullanılır:

* **Gerçek hedefi göster:** Kısaltılmış bir bağlantının nereye gittiğini bulmak için siz bastığınızda o sunucuya çerezsiz istek gönderilir.
* **Bağlantıyı aç:** Siz bastığınızda bağlantı varsayılan tarayıcınızda açılır.
* **Sürüm kontrolü (yalnızca GitHub sürümü):** Günde en fazla bir kez GitHub API’sine yeni sürüm sorulur (ayarlardan kapatılabilir). Microsoft Store sürümü bunu yapmaz.
* **Telefona gönder / Telefondan al:** Dosyalar **yalnızca yerel ağınız üzerinden**, en fazla 10 dakika geçerli tek kullanımlık adresle aktarılır; internete açılmaz.
* **Wi-Fi’a bağlan:** Windows 11 (24H2 ve sonrası) Wi-Fi doğrulaması sırasında konum izni isteyebilir; QRPeek konumunuzu okumaz, saklamaz veya göndermez.

## Paylaşım, çocuklar ve iletişim

Geliştirici hiçbir veri toplamaz ve paylaşmaz; Store ödemelerini Microsoft yürütür. QRPeek çocuklara yönelik değildir ve kimseden kişisel veri toplamaz. Sorularınız için [zeynelumitkorkmaz@gmail.com](mailto:zeynelumitkorkmaz@gmail.com?subject=QRPeek) adresine yazabilir veya [GitHub Issues](https://github.com/umitkrkmz/qrpeek/issues/new/choose) sayfasını kullanabilirsiniz.
