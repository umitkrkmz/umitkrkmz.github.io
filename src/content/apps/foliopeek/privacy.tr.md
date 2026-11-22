---
appSlug: foliopeek
docType: privacy
lang: tr
title: FolioPeek — Gizlilik Politikası
description: FolioPeek tamamen çevrimdışı çalışır; ağ izni, hesap, reklam veya telemetri içermez.
lastUpdated: "2026-11-20"
---

## Kısaca

* Hesap veya oturum açma gerekmez.
* Reklam, izleme, analiz veya telemetri yoktur.
* Geliştiricinin işlettiği hiçbir sunucu yoktur.
* FolioPeek **internete hiç çıkmaz**; uygulama paketinde ağ erişim yetkisi (`internetClient`) bulunmaz.

## Belgeleriniz

* Açtığınız PDF’ler yalnızca bilgisayarınızda, Windows’un kendi PDF ve yazı tanıma bileşenleriyle ve uygulamanın içindeki kütüphanelerle işlenir. Hiçbir belge içeriği cihazınızdan çıkmaz.
* Siz kaydetmedikçe açık dosyada değişiklik yapılmaz. Kaydettiğiniz ya da dışa aktardığınız dosyalar yalnızca sizin seçtiğiniz yere yazılır. Kayıt sırasında veri kaybını önlemek için önce geçici bir dosya yazılır, doğrulandıktan sonra hedef dosyayla değiştirilir.
* **İmza:** Oluşturduğunuz imza bilgisayarda saklanmaz; yalnızca uygulama açıkken bellekte tutulur (*Son imzayı kullan*). Uygulamayı kapatınca silinir. İmza, siz bir belgeye yerleştirip kaydettiğinizde o belgenin parçası olur.
* **Not yazarı:** Ayarlar’a bir ad yazarsanız, eklediğiniz notlara yazar olarak bu ad yazılır ve kaydettiğiniz belgeyle birlikte gider. Boş bırakabilirsiniz.
* **Belge özellikleri:** Başlık, yazar gibi bilgiler belgenin kendisinden okunur. Pro ile düzenlediğiniz ya da temizlediğiniz bilgiler yalnızca sizin kaydettiğiniz yeni dosyaya yazılır.
* **Pano:** *Kopyala* dediğinizde seçili metin ya da alan yalnızca Windows panosuna yazılır.
* **Yazı tanıma:** Windows’ta yüklü yazı tanıma dil paketleri kullanılır. Eksik bir dil paketi için FolioPeek yalnızca Windows’un dil ayarlarını açar.

## Bilgisayarınızda tutulanlar

Hepsi `%LOCALAPPDATA%\FolioPeek` klasöründe, yalnızca bu bilgisayardadır:

* **`settings.json` — ayarlar:** Dil, tema ve vurgu rengi, okuma modu, yakınlaştırma, not renkleri ve not yazarı adı; son açılan belgelerin yolları ve açılma zamanları; isterseniz son kalınan sayfalar ve açık sekmeler.
* **`license.dat` — Pro lisans önbelleği:** Pro eklentisini satın aldıysanız, uygulamanın çevrimdışı da Pro olarak açılabilmesi için lisans durumu Windows Veri Koruma API’si (DPAPI) ile şifrelenerek saklanır.
* **`error.log` — hata günlüğü:** Beklenmeyen bir hata olursa yalnızca teknik hata ayrıntıları yazılır; belge içeriği asla yazılmaz.

Son açılanlar listesini Ayarlar’dan temizleyebilirsiniz. Microsoft Store sürümünde bu klasör uygulamaya özeldir ve uygulamayı kaldırdığınızda Windows tarafından silinir.

## Uygulama içi satın alma

Tek seferlik **Pro** eklentisinin satın alınması tamamen Microsoft Store üzerinden yapılır. Ödeme ve kart bilgileriniz geliştiriciyle paylaşılmaz. FolioPeek, Windows’un Store bileşeninden yalnızca Pro eklentisinin fiyatını ve sizde etkin olup olmadığını sorar.

## Bağlantılar

Uygulama içindeki gizlilik politikası ve hata bildirimi bağlantıları varsayılan tarayıcınızda, Windows ayarları bağlantıları Windows Ayarları’nda açılır. Bir PDF’in içindeki web bağlantısına tıkladığınızda (ayarınıza göre önce sorularak) tarayıcınızda açılır. Dış sayfalar kendi gizlilik politikalarına tabidir.

## Paylaşım ve çocuklar

FolioPeek hiçbir veri toplamadığı için üçüncü taraflarla paylaşılan bir kullanıcı ya da belge verisi yoktur. 13 yaş altındaki çocuklar dâhil kimseden kişisel veri toplamaz.

## Değişiklikler ve iletişim

Bu politika, yeni bir yetki ya da veri işleme eklendiğinde güncellenir ve en üstteki tarih yenilenir. Sorularınız için [zeynelumitkorkmaz@gmail.com](mailto:zeynelumitkorkmaz@gmail.com?subject=FolioPeek) adresine e-posta gönderebilir ya da [GitHub Issues](https://github.com/umitkrkmz/FolioPeek/issues) sayfasını kullanabilirsiniz.
