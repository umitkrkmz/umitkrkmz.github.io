# Yeni Uygulama Ekleme Kılavuzu (`HOW_TO_ADD_APP.md`)

Bu sitede 5. ve sonraki Microsoft Store Windows uygulamalarını **tasarıma, bileşenlere veya sayfa rotalarına hiç dokunmadan** yalnızca bir görsel klasörü ve bir içerik klasörü ekleyerek yayına alabilirsiniz.

Bir uygulama eklendiğinde Astro otomatik olarak şu 8 sayfayı ve site genelindeki tüm listeleri (ana sayfadaki Öne Çıkan Sahne / yatay vitrin rafı, `/apps/` kataloğu, Alt Bilgi / Footer ve `sitemap-index.xml`) kendiliğinden üretir. **5. uygulamayı ana sayfadaki geniş Öne Çıkan Sahne’ye almak için** `app.json` içine `"featured": true` (veya `"order": 1`) eklemeniz yeterlidir; kalan uygulamalar otomatik olarak alttaki yatay rafa dizilir.

* `/apps/<slug>/`, `/apps/<slug>/privacy/`, `/apps/<slug>/support/`, `/apps/<slug>/changelog/`
* `/en/apps/<slug>/`, `/en/apps/<slug>/privacy/`, `/en/apps/<slug>/support/`, `/en/apps/<slug>/changelog/`

---

## 2 Dakikalık Kontrol Listesi

### Adım 1 — Görselleri Hazırla (`public/images/apps/<slug>/`)

Yeni uygulamanın kısa adını (`slug`, yalnızca küçük harf, rakam ve tire — ör. `clippeek`) seçip `public/images/apps/<slug>/` klasörünü oluşturun ve şu dosyaları koyun:

* `icon.png` — `256×256` şeffaf arka planlı uygulama ikonu (PNG)
* `tr-1.webp`, `tr-2.webp`, … — Türkçe ekran görüntüleri (`1600×900` veya `16:9` WebP)
* `en-1.webp`, `en-2.webp`, … — İngilizce ekran görüntüleri (`1600×900` veya `16:9` WebP)

> **İpucu:** PNG ekran görüntülerini hızlıca `1600×900` WebP’ye çevirmek için projedeki `sharp` paketini kullanabilirsiniz:
> ```bash
> node -e "import('sharp').then(({default: s}) => s('girdi.png').resize(1600).webp({quality: 86}).toFile('public/images/apps/<slug>/tr-1.webp'))"
> ```

---

### Adım 2 — İçerik Klasörünü Oluştur (`src/content/apps/<slug>/`)

`src/content/apps/<slug>/` klasörünü açın ve içine şu **7 dosyayı** ekleyin (en hızlı yol, mevcut `src/content/apps/foliopeek/` klasörünü kopyalayıp düzenlemektir):

1. `app.json` — Uygulama metadatası, fiyatlar, renk uyumu (`theme`), özellikler ve SSS
2. `privacy.tr.md` ve `privacy.en.md` — Gizlilik politikası (TR & EN)
3. `support.tr.md` ve `support.en.md` — Destek, iletişim ve kısayollar (TR & EN)
4. `changelog.tr.md` ve `changelog.en.md` — Sürüm notları (TR & EN)

#### `app.json` Şablonu (Zod Şemasıyla Otomatik Doğrulanır)

```json
{
  "slug": "yeniapp",
  "name": "YeniApp",
  "order": 5,
  "version": "1.0.0",
  "releaseDate": "2026-12-01",
  "storeId": "9XXXXXXXXXXX",
  "storeUrl": "https://apps.microsoft.com/detail/9XXXXXXXXXXX",
  "githubUrl": "https://github.com/umitkrkmz/YeniApp",
  "issuesUrl": "https://github.com/umitkrkmz/YeniApp/issues",
  "sourceModel": "closed-source-open-docs",
  "licenseLabel": "Kapalı Kaynak · Belgeler CC BY 4.0",
  "networkModel": "offline",
  "icon": "/images/apps/yeniapp/icon.png",
  "theme": {
    "accent": "#2558c7",
    "surfaceFrom": "#f6f7f9",
    "surfaceTo": "#eff1f5",
    "borderTint": "#e3e7ef",
    "shadowTint": "rgba(17, 21, 29, 0.22)",
    "badgeBg": "#eaeff9",
    "badgeText": "#1e49a8",
    "backdropTone": "#141821"
  },
  "tr": {
    "tagline": "Uygulamayı tek cümlede anlatan kısa Türkçe özet.",
    "shortDescription": "Mağaza kısa açıklaması.",
    "description": "Detay sayfasının üstündeki ana tanıtım paragrafı.",
    "priceBadge": "₺250 · Tek seferlik",
    "pricingSummary": "Fiyatlandırma açıklaması (TR sayfada yalnızca TL kullanın).",
    "pricingTiers": [
      { "label": "YeniApp (Microsoft Store)", "price": "₺250", "note": "Tek seferlik satın alma." }
    ],
    "requirements": [
      "Windows 10 (sürüm 2004) veya Windows 11",
      "İnternet bağlantısı gerekmez"
    ],
    "features": [
      "Birinci öne çıkan özellik",
      "İkinci öne çıkan özellik"
    ],
    "privacyHighlights": [
      "İnternete bağlanmaz; hesap, reklam ve telemetri yoktur."
    ],
    "cardImage": "/images/apps/yeniapp/tr-1.webp",
    "cardImageAlt": "YeniApp ana ekran görünümü",
    "heroImage": "/images/apps/yeniapp/tr-1.webp",
    "heroAlt": "YeniApp koyu tema arayüzü",
    "screenshots": [
      { "src": "/images/apps/yeniapp/tr-1.webp", "alt": "YeniApp ekran 1", "caption": "Ana ekran" }
    ],
    "faqs": [
      { "question": "Sık sorulan soru?", "answer": "Net ve kısa yanıt." }
    ]
  },
  "en": {
    "tagline": "One-sentence natural English tagline.",
    "shortDescription": "Short Store description.",
    "description": "Main editorial overview paragraph.",
    "priceBadge": "$5.99 · One-time",
    "pricingSummary": "Pricing explanation (use USD only on EN pages).",
    "pricingTiers": [
      { "label": "YeniApp (Microsoft Store)", "price": "$5.99", "note": "One-time purchase." }
    ],
    "requirements": [
      "Windows 10 (version 2004) or Windows 11",
      "No internet connection required"
    ],
    "features": [
      "First key feature",
      "Second key feature"
    ],
    "privacyHighlights": [
      "Never goes online; no account, ads, or telemetry."
    ],
    "cardImage": "/images/apps/yeniapp/en-1.webp",
    "cardImageAlt": "YeniApp main screen",
    "heroImage": "/images/apps/yeniapp/en-1.webp",
    "heroAlt": "YeniApp dark theme interface",
    "screenshots": [
      { "src": "/images/apps/yeniapp/en-1.webp", "alt": "YeniApp screen 1", "caption": "Main screen" }
    ],
    "faqs": [
      { "question": "Common question?", "answer": "Clear, concise answer." }
    ]
  }
}
```

#### Markdown Belgeleri Frontmatter Şablonu (`privacy`, `support`, `changelog`)

Her 6 Markdown dosyasının en üstünde şu 6 alan bulunmalıdır:

```markdown
---
appSlug: yeniapp
docType: privacy # privacy | support | changelog
lang: tr         # tr | en
title: YeniApp — Gizlilik Politikası
description: Kısa SEO açıklaması.
lastUpdated: "2026-12-01"
---

## Kısaca

...
```

> **Kontrast ve Dil Kuralları:**
> * `theme.accent` ve `theme.badgeText` değerlerinin kendi açık yüzeyleri üzerinde **en az WCAG AA (4.5:1)** kontrast sağlamasına dikkat edin.
> * `surfaceFrom` / `surfaceTo` renklerini `#f5f5f7` çevresinde çok yumuşak ve nötre yakın tutun; asıl renk karakterini ikon ve `backdropTone` taşısın.
> * `tr` bloklarında yalnızca `₺` (TL), `en` bloklarında yalnızca `$` (USD) kullanın.
> * `sourceModel` için açık kaynakta `"open-source"`, kapalı kaynak + açık belgelerde `"closed-source-open-docs"` yazın.

---

### Adım 3 — Doğrula ve Yayınla

```bash
npm run build
```

1. Astro Content Collections Zod doğrulaması tüm alanları kontrol eder; eksik veya hatalı bir alan varsa derleme sırasında tam satırıyla bildirir.
2. `dist/apps/<slug>/` ve `dist/en/apps/<slug>/` altında `index.html`, `privacy/index.html`, `support/index.html` ve `changelog/index.html` dosyalarının üretildiğini görün.
3. Değişiklikleri `main` dalına gönderin (`git push`) — `.github/workflows/deploy.yml` siteyi otomatik olarak GitHub Pages’te yayınlar.
4. Microsoft Store Partner Center’da yeni uygulamanın gizlilik ve destek bağlantılarını doğrudan şu adreslere bağlayabilirsiniz:
   * Gizlilik (TR / EN): `https://umitkrkmz.github.io/apps/<slug>/privacy/` · `https://umitkrkmz.github.io/en/apps/<slug>/privacy/`
   * Destek (TR / EN): `https://umitkrkmz.github.io/apps/<slug>/support/` · `https://umitkrkmz.github.io/en/apps/<slug>/support/`
