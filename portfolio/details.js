/* ===== details.js: projelerin detay sayfaları (blog gibi), app.js 'detailHtml' çizer. Yazılar burada, iki dilli; çeviri sözlüğünden geçmez.
   Her metin { tr, en }; görsel ve bağlantıda {l} dile göre tr ya da en. Bölüm blokları: h, p, quote, list, rows ([ad, açıklama]),
   code (komut, kopyalanır), diagram (kopyalanmaz), img / imgs ([görsel, açıklama, 'phone' | 'fit']), actions (kurulum kartları: t, d, code, links), after (bloktan sonra paragraf).
   facts: [ad, değer, 'release' ise GitHub'dan son sürüm]; theme (renk), gen (gen.js kapak animasyonu), nums (öne çıkan rakamlar), related ([slug, neden]). links: [ad, adres]; '#projects/<slug>' başka bir projenin detayını açar.
   Görseller portfolio/img/<slug>/ altında WebP. Anahtar content.js'teki projenin 'slug'ı ===== */
(function (P) {
'use strict';
const D = {
 "mikro-sehir": {
  "hero": [
   "img/mikro-sehir/cover.webp",
   {
    "tr": "Mikro Şehir: kuş bakışı Ankara",
    "en": "Mikro Şehir: Ankara from above"
   }
  ],
  "lead": {
   "tr": "Tarayıcıda çalışan prosedürel bir 3B Ankara: Kızılay'dan Söğütözü'ne dokuz semt, dağlarla çevrili bir vadi, gerçek saatle akan gün, Ankara'nın canlı havası, trafik, yayalar, kediler, stadyumda maç ve çatılarda ağla sallanan bir kahraman. Derleme adımı yok, sunucu yok: tek bir sayfa ve Three.js.",
   "en": "A procedural 3D Ankara that runs in the browser: nine districts from Kızılay to Söğütözü, a valley ringed by mountains, a day that follows the real clock, Ankara's live weather, traffic, pedestrians, cats, a match at the stadium and a hero swinging across the rooftops on webs. No build step and no server: one page and Three.js."
  },
  "facts": [
   [
    {
     "tr": "Son sürüm",
     "en": "Latest release"
    },
    "",
    "release"
   ],
   [
    {
     "tr": "Çalıştığı yer",
     "en": "Runs on"
    },
    {
     "tr": "Tarayıcı, masaüstü ve telefon",
     "en": "Browser, desktop and phone"
    }
   ],
   [
    {
     "tr": "Lisans",
     "en": "License"
    },
    "MIT"
   ],
   [
    {
     "tr": "Derleme",
     "en": "Build step"
    },
    {
     "tr": "Yok",
     "en": "None"
    }
   ]
  ],
  "sections": [
   {
    "h": {
     "tr": "Fikir",
     "en": "The idea"
    },
    "p": [
     {
      "tr": "Bir portfolyo sayfası yerine içinde dolaşılabilen bir şehir yapmak istedim. Sayfayı açan Ankara'nın o anki saatini ve havasını görüyor; kuş bakışından sokağa inebiliyor, bir binayı seçip kat ekleyebiliyor, vatandaş ya da kahraman olarak dolaşabiliyor. Portfolyonun kendisi de şehrin içinde: geliştiricinin elindeki telefonda.",
      "en": "Instead of a portfolio page I wanted to build a city you can walk around in. Whoever opens the page sees Ankara at its current hour and in its current weather; they can drop from a bird's-eye view to the street, pick a building and add floors, or walk around as a citizen or as the hero. The portfolio itself lives inside the city too: on the phone in the developer's hand."
     }
    ]
   },
   {
    "h": {
     "tr": "Canlı Ankara",
     "en": "Live Ankara"
    },
    "p": [
     {
      "tr": "Gün gerçek Türkiye saatiyle akar; gece pencereler ve sokak lambaları yanar. Hava Open-Meteo'dan anahtarsız bir istekle gelir. Yağmurda zemin ıslanır ve birikintiler oluşur, güneş çıkınca lekeli lekeli kurur; kar önce çimde ve çatıda tutar, yolda en son; eriyen kar zemini ıslatır, ıslak asfalttan buhar yükselir. Trafik de saate bağlı: hafta içi sabah ve akşam yoğun, gece sakin.",
      "en": "The day follows real Turkish time; at night the windows and street lamps light up. The weather comes from Open-Meteo with a keyless request. In the rain the ground gets wet and puddles form, and when the sun comes out it dries in patches; snow settles on grass and roofs first and on the road last, melting snow wets the ground, and steam rises from wet asphalt. Traffic follows the clock as well: busy on weekday mornings and evenings, quiet at night."
     }
    ],
    "imgs": [
     [
      "img/mikro-sehir/rain.webp",
      {
       "tr": "Yağmurda ıslak zemin ve birikintiler",
       "en": "Wet ground and puddles in the rain"
      }
     ],
     [
      "img/mikro-sehir/snow.webp",
      {
       "tr": "Kar önce çatıda ve çimde tutar",
       "en": "Snow settles on roofs and grass first"
      }
     ]
    ]
   },
   {
    "h": {
     "tr": "Şehir yaşıyor",
     "en": "The city is alive"
    },
    "p": [
     {
      "tr": "Araçlar trafik ışıklarına uyar, dönerken sinyal verir, sirene yol verir; yayalar karşıya geçmek için kırmızının yetmesini bekler, otobüsler durakta yolcu alır. Kameraya yakın binalarda camın ardında gerçek odalar var: yemek yapan, televizyon izleyen insanlar. Kafeye, berbere, markete girip oturabilir, simit alabilirsin. Sokak kedileri sevilmeyi sever; gece 21.30'da merkezdeki parkta kedi meclisi toplanır ve o gecenin gündemini tartışır.",
      "en": "Cars obey the traffic lights, signal when they turn and make way for sirens; pedestrians wait until the red light is long enough to cross, and buses pick up passengers at the stops. In buildings close to the camera there are real rooms behind the glass: people cooking or watching TV. You can walk into a café, a barber's or a market, sit down and buy a simit. The street cats love being petted; at 21:30 the cat council meets in the central park to debate the night's agenda."
     }
    ],
    "img": [
     "img/mikro-sehir/dusk.webp",
     {
      "tr": "Akşam: ışıklar yanarken trafik",
      "en": "Dusk: traffic as the lights come on"
     }
    ]
   },
   {
    "h": {
     "tr": "Olaylar ve Pijamalı Çocuk",
     "en": "Events and Underoos"
    },
    "p": [
     {
      "tr": "Şehirde yangın, kaza ve hırsızlık çıkar; itfaiye, ambulans ve polis sirenleriyle olay yerine gider. Pijamalı Çocuk hırsızın peşine düşer, kavşaktan kavşağa sallanıp onu ağla sarar. İstersen kahramanı sen oynarsın: duvarlara tırmanır, duvarda koşar, ağla çekilirsin. Stadyumda 13.30 ve 19.00'da semt takımları gerçek sürede maç yapar; takımlar ve skor tarih ve saatten tohumlandığı için o anda bakan herkes aynı maçı görür.",
      "en": "Fires, accidents and thefts break out; fire engines, ambulances and police cars race to the scene with their sirens on. Underoos chases the thief, swings from junction to junction and wraps them up in a web. If you like, you can play the hero yourself: climb walls, run along them and pull yourself in on a web line. At the stadium the district teams play in real time at 13:30 and 19:00; the teams and the score are seeded from the date and time, so everyone watching at that moment sees the same match."
     }
    ],
    "img": [
     "img/mikro-sehir/night.webp",
     {
      "tr": "Gece: yanan pencereler",
      "en": "Night: lit windows"
     }
    ]
   },
   {
    "h": {
     "tr": "Telefon",
     "en": "The phone"
    },
    "p": [
     {
      "tr": "Portfolyo, şehirdeki geliştiricinin telefonu: projeler, hakkımda, iletişim ve Ankara Haber. Haberler şehrin canlı verisinden yazılır: son yangın, maç sonucu, günün kedisi, saatlik trafik, o geceki kedi meclisinin gündemi. Telefon tek başına da açılır; şehrin içindeyken bilgiyi doğrudan şehirden okur.",
      "en": "The portfolio is the phone of the developer who lives in the city: projects, about, contact and Ankara News. The news is written from the city's live data: the latest fire, the match result, the cat of the day, the hourly traffic, tonight's cat council agenda. The phone also opens on its own; inside the city it reads straight from the city."
     }
    ]
   },
   {
    "h": {
     "tr": "Nasıl yapıldı",
     "en": "How it is built"
    },
    "p": [
     {
      "tr": "Derleme adımı yok: düz JavaScript betikleri tek bir paylaşılan nesne üzerinden konuşur, Three.js r128 CDN'den gelir. Her şey prosedürel: binalar, cephe dokuları, tabelalar ve kostümler kodla ve canvas'ta üretilir, dışarıdan model ya da doku yüklenmez. Binlerce araç, yaya, ağaç ve kedi örnekli çizimle (InstancedMesh) az sayıda çağrıda çizilir; yalnızca görünenler ekran kartına gönderilir.",
      "en": "There is no build step: plain JavaScript files talk through one shared object, and Three.js r128 comes from a CDN. Everything is procedural: buildings, facade textures, signs and costumes are generated in code and on canvas, and no model or texture is loaded from outside. Thousands of cars, pedestrians, trees and cats are drawn with instancing (InstancedMesh) in a handful of calls, and only the visible ones are sent to the GPU."
     },
     {
      "tr": "Kuş bakışından göz hizasına dört ayrıntı kademesi var. Islaklık, kar, pencere ardındaki odalar ve kedi tüyleri, malzemelere sonradan eklenen küçük shader parçalarıyla yapılıyor. Kalite ekran kartına göre otomatik seçilir; kare yavaşlarsa önce gölge, sonra ayrıntılar kendiliğinden azalır. Sunucu, hesap ve izleme yok; dış istekler yalnızca hava için Open-Meteo ve proje bilgisi için GitHub.",
      "en": "There are four levels of detail between the bird's-eye view and eye level. Wetness, snow, the rooms behind the windows and the cats' fur are small shader snippets added to the materials. Quality is picked automatically from the graphics card; if frames slow down, shadows go first and then other detail. No server, no accounts and no tracking; the only outside requests are Open-Meteo for the weather and GitHub for project info."
     }
    ]
   }
  ],
  "stack": [
   [
    {
     "tr": "Grafik",
     "en": "Graphics"
    },
    "Three.js r128, WebGL, GLSL"
   ],
   [
    {
     "tr": "Dil",
     "en": "Language"
    },
    {
     "tr": "JavaScript (derleme yok), HTML, CSS",
     "en": "JavaScript (no build step), HTML, CSS"
    }
   ],
   [
    {
     "tr": "Veri",
     "en": "Data"
    },
    {
     "tr": "Open-Meteo (hava), GitHub API (projeler)",
     "en": "Open-Meteo (weather), GitHub API (projects)"
    }
   ],
   [
    {
     "tr": "Yayın",
     "en": "Hosting"
    },
    "GitHub Pages"
   ],
   [
    {
     "tr": "Dil desteği",
     "en": "Languages"
    },
    {
     "tr": "Türkçe ve İngilizce",
     "en": "Turkish and English"
    }
   ]
  ],
  "links": [
   [
    {
     "tr": "Sürüm notları",
     "en": "Release notes"
    },
    "https://github.com/umitkrkmz/umitkrkmz.github.io/releases/latest"
   ]
  ],
  "theme": "#ffb53d",
  "gen": "city",
  "nums": [
   [
    "9",
    {
     "tr": "semt",
     "en": "districts"
    }
   ],
   [
    "1.750",
    {
     "tr": "gerçek maçtan skor dağılımı",
     "en": "real matches behind the scores"
    }
   ],
   [
    "0",
    {
     "tr": "derleme adımı",
     "en": "build steps"
    }
   ]
  ],
  "related": [
   [
    "mediagrab",
    {
     "tr": "İkisi de sunucusuz, hesapsız, telemetrisiz; veri kullanıcıda kalır.",
     "en": "Both need no server, no account and no telemetry; data stays with the user."
    }
   ]
  ]
 },
 "mediagrab": {
  "hero": [
   "img/mediagrab/hero.webp",
   {
    "tr": "MediaGrab masaüstünde ve telefonda",
    "en": "MediaGrab on the desktop and on a phone"
   }
  ],
  "lead": {
   "tr": "Link yapıştır, indir. MediaGrab kendi bilgisayarında çalışan bir video ve ses indirme aracı: YouTube, YouTube Music ve yt-dlp'nin desteklediği 1700'den fazla site. Hesap, veritabanı, reklam ve telemetri yok; indirdiklerin ve ayarların o cihazda kalır.",
   "en": "Paste a link, download it. MediaGrab is a video and audio downloader that runs on your own computer: YouTube, YouTube Music and the 1,700+ other sites yt-dlp supports. No account, no database, no ads and no telemetry; your downloads and settings stay on that device."
  },
  "facts": [
   [
    {
     "tr": "İlk sürüm",
     "en": "First release"
    },
    {
     "tr": "Ağustos 2026",
     "en": "August 2026"
    }
   ],
   [
    {
     "tr": "Son sürüm",
     "en": "Latest release"
    },
    "",
    "release"
   ],
   [
    {
     "tr": "Lisans",
     "en": "License"
    },
    "GPL-3.0"
   ],
   [
    {
     "tr": "Çalıştığı yer",
     "en": "Runs on"
    },
    "Windows, Linux, macOS, Raspberry Pi"
   ]
  ],
  "sections": [
   {
    "h": {
     "tr": "Neden",
     "en": "Why"
    },
    "p": [
     {
      "tr": "iPhone'da App Store indirme uygulamalarına izin vermiyor, kısayollar da sık bozuluyor; çevrim içi indirme siteleri ise reklamla dolu. İstediğim şey basitti: kendi bilgisayarımda çalışan, link yapıştırınca dosyayı veren ve kimseye veri göndermeyen bir araç. Ağustos 2026'da küçük bir FastAPI uygulaması olarak başladı; 19 sürümde kanal takibi, telefondan kullanım ve tek dosyalık Windows kurulumu olan bir projeye dönüştü.",
      "en": "On iPhone the App Store doesn't allow downloader apps and shortcuts break often, while online download sites are full of ads. What I wanted was simple: a tool that runs on my own computer, hands over the file when I paste a link and sends data to no one. It started in August 2026 as a small FastAPI app; over 19 releases it grew into a project with channel following, use from a phone and a one-file Windows installer."
     }
    ]
   },
   {
    "h": {
     "tr": "Link yapıştır, gerisi kendiliğinden",
     "en": "Paste a link, the rest takes care of itself"
    },
    "p": [
     {
      "tr": "Kutuya yapıştırılan link hemen çözümlenir: MediaGrab yt-dlp ile videonun bütün ses ve video kalitelerini, varsa dublaj dillerini ve altyazıları listeler. Acelen varsa \"En iyi ses\" ya da \"En iyi video\" tek tıkla iner; ayrıntı isteyen her çözünürlüğü, Opus, M4A ya da MP3'ü, birden fazla ses parçasını tek bir .mkv dosyasında seçebilir. YouTube dosya boyutunu vermediğinde ortalama bit hızından tahmini boyut gösterilir.",
      "en": "A pasted link is resolved right away: MediaGrab uses yt-dlp to list every audio and video quality of the video, plus any dubbed languages and subtitles. In a hurry, \"Best audio\" or \"Best video\" downloads in one click; for more control you can pick any resolution, Opus, M4A or MP3, or several audio tracks in a single .mkv file. When YouTube doesn't give the file size, an estimate is shown from the average bitrate."
     }
    ],
    "img": [
     "img/mediagrab/resolve-{l}.webp",
     {
      "tr": "Çözümlenmiş bir video: ses ve video seçenekleri",
      "en": "A resolved video: audio and video options"
     }
    ]
   },
   {
    "h": {
     "tr": "Aynı anda birden fazla indirme",
     "en": "Several downloads at once"
    },
    "p": [
     {
      "tr": "İndirmeler sayfanın altındaki kalıcı panelde ilerler: hız, kalan süre, iptal. Sayfa değişse ya da uygulama kapanıp açılsa da durum korunur. Aynı video yeniden indirilirken bir şey ters giderse eski dosya geri gelir; disk alanı yetmeyecekse indirme hiç başlamaz. Her dosyanın yanına başlık, kanal, tarih ve açıklamayı içeren bir JSON bilgi dosyası, istenirse altyazı (.srt) ve transkript (.txt) de kaydedilir.",
      "en": "Downloads run in a persistent panel at the bottom of the page: speed, time left, cancel. The state survives a page change or an app restart. If something goes wrong while re-downloading a video, the old file comes back; if disk space won't be enough, the download never starts. Next to every file goes a JSON info file with the title, channel, date and description, plus subtitles (.srt) and a transcript (.txt) if you want them."
     }
    ],
    "img": [
     "img/mediagrab/dock-{l}.webp",
     {
      "tr": "İndirme paneli",
      "en": "The download panel"
     }
    ]
   },
   {
    "h": {
     "tr": "Telefondan, QR kodla",
     "en": "From your phone, with a QR code"
    },
    "p": [
     {
      "tr": "Ayarlar'da bir parola belirleyip uzaktan erişimi açınca bir QR kod çıkar; telefonun kamerasıyla okutup aynı Wi-Fi'dan MediaGrab'ı tarayıcıda açarsın. Link yapıştırırsın, dosya doğrudan telefona iner. Telefona hiçbir şey kurulmaz; arayüz küçük ekranda açılır menü ve dokunmaya uygun düğmelerle gelir, istenirse ana ekrana uygulama (PWA) olarak eklenir.",
      "en": "Set a password in Settings and turn on remote access, and a QR code appears; scan it with the phone's camera and open MediaGrab in the browser over the same Wi-Fi. Paste a link and the file lands right on the phone. Nothing is installed on the phone; on a small screen the interface has a drop-down menu and touch-sized buttons, and it can be added to the home screen as an app (PWA)."
     }
    ],
    "imgs": [
     [
      "img/mediagrab/settings-remote-{l}.webp",
      {
       "tr": "Uzaktan erişim: parola ve QR kod",
       "en": "Remote access: password and QR code"
      }
     ],
     [
      "img/mediagrab/mobile-home-{l}.webp",
      {
       "tr": "Telefonda MediaGrab",
       "en": "MediaGrab on a phone"
      },
      "phone"
     ]
    ]
   },
   {
    "h": {
     "tr": "Kütüphane, istatistik, kanal takibi",
     "en": "Library, statistics, channel following"
    },
    "p": [
     {
      "tr": "Geçmiş sayfası indirilenleri kapaklı kartlar ya da liste olarak gösterir: arama, kanala ve dosya türüne göre süzme, yeniden indirme. Detay sayfasında dosyanın gerçek çözünürlüğü, kare hızı ve codec'leri ffprobe ile okunur; kendi oynatıcısı YouTube'un klavye kısayollarıyla çalışır. İstatistikler yalnızca sayı tutar: hangi siteden, hangi biçimde, ne kadar; başlık ya da bağlantı kaydedilmez.",
      "en": "The history page shows downloads as cards with covers or as a list: search, filter by channel and file type, download again. The detail page reads the file's real resolution, frame rate and codecs with ffprobe, and the built-in player uses YouTube's keyboard shortcuts. Statistics keep only numbers: which site, which format, how much; no titles or links are stored."
     }
    ],
    "img": [
     "img/mediagrab/history-{l}.webp",
     {
      "tr": "İndirme geçmişi",
      "en": "Download history"
     }
    ]
   },
   {
    "p": [
     {
      "tr": "Takibe alınan YouTube kanalları her açılışta denetlenir: \"Bildir\" modunda yeni video ana sayfada haber verilir, \"Otomatik indir\" modunda seçilen biçimde kendiliğinden iner. Ev Sunucusu Modu'nda (ör. Raspberry Pi) denetim, kimse uygulamayı açmasa da üç saatte bir yapılır.",
      "en": "Followed YouTube channels are checked each time the app opens: in \"Notify\" mode a new video is announced on the home page, in \"Auto-download\" mode it downloads by itself in the chosen format. In Home Server Mode (on a Raspberry Pi, say) the check runs every three hours, even if nobody opens the app."
     }
    ],
    "img": [
     "img/mediagrab/channels-{l}.webp",
     {
      "tr": "Takip edilen kanallar",
      "en": "Followed channels"
     }
    ]
   },
   {
    "h": {
     "tr": "Kurulum: tek dosya",
     "en": "Setup: a single file"
    },
    "p": [
     {
      "tr": "Windows'ta MediaGrabSetup.exe her şeyi içinde getirir: gömülü Python, FFmpeg ve Deno. Python, Git ya da ffmpeg kurmak gerekmez, yönetici izni istenmez; MediaGrab bildirim alanında kendi simgesiyle, konsol penceresi olmadan çalışır. Kurulum önceki bir sürümü bulup ayarları, kanalları ve istatistikleri aktarmayı, videoları yeni klasöre taşımayı teklif eder. Linux, macOS ve Raspberry Pi için amd64 ve arm64 Docker imajı var.",
      "en": "On Windows, MediaGrabSetup.exe brings everything with it: embedded Python, FFmpeg and Deno. No Python, Git or ffmpeg to install and no admin rights needed; MediaGrab runs in the notification area with its own icon, without a console window. Setup finds an earlier version and offers to bring over the settings, channels and statistics and to move the videos into the new folder. For Linux, macOS and Raspberry Pi there is an amd64 and arm64 Docker image."
     }
    ]
   },
   {
    "h": {
     "tr": "Nasıl yapıldı",
     "en": "How it is built"
    },
    "p": [
     {
      "tr": "Sunucu FastAPI; sayfalar Jinja2 ile sunucuda basılıyor, arayüz sade HTML, CSS ve JavaScript. yt-dlp yalnızca tek bir dosyada (downloader.py) içe aktarılıyor, böylece yt-dlp'deki değişiklikler tek yerden karşılanıyor. Veritabanı yok: ayarlar, kanallar ve istatistikler küçük JSON dosyalarında.",
      "en": "The server is FastAPI; pages are rendered on the server with Jinja2, and the interface is plain HTML, CSS and JavaScript. yt-dlp is imported in a single file only (downloader.py), so changes in yt-dlp are handled in one place. There is no database: settings, channels and statistics live in small JSON files."
     },
     {
      "tr": "Windows paketi bir Python betiğiyle (gömülü Python, paketler ve her indirmesi SHA256 ile doğrulanan FFmpeg) hazırlanıp Inno Setup ile tek dosyaya çevriliyor. GitHub Actions her push'ta testleri Linux'ta ve Windows'ta çalıştırıyor; yayın iş akışı kurulum programını derleyip Windows'a sessizce kurarak deniyor ve kaldırıyor.",
      "en": "The Windows package is prepared by a Python script (embedded Python, the packages and FFmpeg, each download checked against a SHA256) and turned into a single file with Inno Setup. GitHub Actions runs the tests on Linux and Windows on every push; the release workflow builds the installer, installs it silently on Windows to try it, then uninstalls it."
     }
    ]
   },
   {
    "h": {
     "tr": "Güven",
     "en": "Trust"
    },
    "p": [
     {
      "tr": "Reklam, ücret, hesap ve telemetri yok. MediaGrab dışarıyla yalnızca işi için konuşur: indirdiğin siteyle, takip ettiğin kanallar için YouTube ile, sürüm kontrolünde GitHub ve PyPI ile. Her yayının notlarında kurulum dosyasının SHA256 değeri ve VirusTotal tarama bağlantısı var.",
      "en": "No ads, no payment, no account and no telemetry. MediaGrab talks to the outside world only to do its job: to the site you download from, to YouTube for the channels you follow, and to GitHub and PyPI for version checks. Every release's notes list the installer's SHA256 and a VirusTotal scan link."
     }
    ]
   }
  ],
  "stack": [
   [
    {
     "tr": "Sunucu",
     "en": "Server"
    },
    "Python 3.12, FastAPI, Pydantic, Jinja2"
   ],
   [
    {
     "tr": "İndirme",
     "en": "Downloading"
    },
    "yt-dlp, FFmpeg, ffprobe, Deno"
   ],
   [
    {
     "tr": "Arayüz",
     "en": "Interface"
    },
    {
     "tr": "HTML, CSS, JavaScript, PWA; Türkçe ve İngilizce",
     "en": "HTML, CSS, JavaScript, PWA; Turkish and English"
    }
   ],
   [
    {
     "tr": "Veri",
     "en": "Data"
    },
    {
     "tr": "JSON dosyaları, veritabanı yok",
     "en": "JSON files, no database"
    }
   ],
   [
    {
     "tr": "Dağıtım",
     "en": "Distribution"
    },
    "Inno Setup, Docker (amd64, arm64), GitHub Container Registry"
   ],
   [
    {
     "tr": "Test ve CI",
     "en": "Tests and CI"
    },
    {
     "tr": "pytest, GitHub Actions (Linux ve Windows)",
     "en": "pytest, GitHub Actions (Linux and Windows)"
    }
   ]
  ],
  "links": [
   [
    {
     "tr": "İndir",
     "en": "Download"
    },
    "https://github.com/umitkrkmz/mediagrab/releases/latest"
   ],
   [
    {
     "tr": "Kılavuz",
     "en": "Guide"
    },
    "https://github.com/umitkrkmz/mediagrab/blob/master/docs/README.{l}.md"
   ]
  ],
  "theme": "#5b8def",
  "gen": "download",
  "nums": [
   [
    "1.700+",
    {
     "tr": "desteklenen site",
     "en": "supported sites"
    }
   ],
   [
    "19",
    {
     "tr": "sürüm, iki ayda",
     "en": "releases in two months"
    }
   ],
   [
    "0",
    {
     "tr": "reklam ve telemetri",
     "en": "ads and telemetry"
    }
   ]
  ],
  "related": [
   [
    "ai-context-mapping",
    {
     "tr": "MediaGrab, ai-context-mapping'in gerçek bir mimarideki vaka çalışması.",
     "en": "MediaGrab is ai-context-mapping's case study in a real architecture."
    }
   ],
   [
    "mikro-sehir",
    {
     "tr": "İkisi de sunucusuz, hesapsız, telemetrisiz; veri kullanıcıda kalır.",
     "en": "Both need no server, no account and no telemetry; data stays with the user."
    }
   ]
  ]
 },
 "kurumsal-bilgi": {
  "lead": {
   "tr": "Şirket içi belgeleri, blog yazılarını ve duyuruları tek yerde toplayan bir bilgi platformu. Yerelde çalışan bir dil modeli (Ollama, Llama 3.2) bilgi tabanındaki içerikten soruları yanıtlar; anlık bildirimler, içerik onay akışı, rol ve departman bazlı yetki, denetim kaydı.",
   "en": "A knowledge platform that brings a company's internal documents, blog posts and announcements together in one place. A language model running locally (Ollama, Llama 3.2) answers questions from the knowledge base; real-time notifications, a content approval workflow, role- and department-based access, and an audit log."
  },
  "facts": [
   [
    {
     "tr": "Çatı",
     "en": "Framework"
    },
    "ASP.NET Core 10"
   ],
   [
    {
     "tr": "Mimari",
     "en": "Architecture"
    },
    "Clean Architecture, CQRS"
   ],
   [
    {
     "tr": "Veritabanı",
     "en": "Database"
    },
    "SQL Server"
   ],
   [
    {
     "tr": "Lisans",
     "en": "License"
    },
    "MIT"
   ]
  ],
  "sections": [
   {
    "h": {
     "tr": "Ne yapar",
     "en": "What it does"
    },
    "p": [
     {
      "tr": "Kurumlarda bilgi e-postalara, paylaşılan klasörlere ve birkaç kişinin aklına dağılır. Bu platform onu tek bir yerde toplar ve aranabilir kılar:",
      "en": "In organizations, knowledge is scattered across emails, shared folders and a few people's heads. This platform gathers it in one place and makes it searchable:"
     }
    ],
    "list": [
     {
      "tr": "Belgeler: sürümleme, kategori ve etiket",
      "en": "Documents: versioning, categories and tags"
     },
     {
      "tr": "Blog yazıları: beğeni, yorum, içerik bildirimi",
      "en": "Blog posts: likes, comments, content reporting"
     },
     {
      "tr": "Kurum geneline duyurular",
      "en": "Organization-wide announcements"
     },
     {
      "tr": "Bütün içerik türlerinde tam metin arama",
      "en": "Full-text search across every content type"
     },
     {
      "tr": "Yayından önce içerik onayı; yeni kayıtlar için kullanıcı onayı",
      "en": "Content approval before publishing; user approval for new sign-ups"
     },
     {
      "tr": "Kullanıcı, rol ve departman yönetimi; departmana göre içerik görünürlüğü",
      "en": "User, role and department management; content visibility by department"
     },
     {
      "tr": "Denetim kaydı, zamanlanmış bakım işleri ve PDF çıktısı",
      "en": "An audit log, scheduled maintenance jobs and PDF export"
     }
    ]
   },
   {
    "h": {
     "tr": "Bilgi tabanına soru sor",
     "en": "Ask the knowledge base"
    },
    "p": [
     {
      "tr": "AI asistanı Ollama üzerinden yerelde çalışan bir modelle konuşur: soru gelince ilgili içerik bilgi tabanından embedding'lerle (nomic-embed-text) bulunur ve modele bağlam olarak verilir; yanıt, dayandığı kaynakların rozetleriyle döner. Veri şirketin dışına çıkmaz. Sohbet geçmişi oturum bazında tutulur ve arşivlenir. Model, donanıma göre değiştirilebilir:",
      "en": "The AI assistant talks to a model running locally through Ollama: when a question comes in, the relevant content is found in the knowledge base with embeddings (nomic-embed-text) and given to the model as context, and the answer comes back with badges for the sources it relied on. The data never leaves the company. Chat history is kept per session and archived. The model can be swapped to fit the hardware:"
     }
    ],
    "rows": [
     [
      "llama3.2",
      {
       "tr": "Varsayılan, ~2 GB. Genel kullanım, iyi Türkçe desteği",
       "en": "Default, ~2 GB. General use, good Turkish support"
      }
     ],
     [
      "llama3.2:1b",
      {
       "tr": "~700 MB. Raspberry Pi ve düşük kaynaklı cihazlar",
       "en": "~700 MB. Raspberry Pi and low-resource devices"
      }
     ],
     [
      "mistral",
      {
       "tr": "~4,1 GB. Daha yüksek kaliteli yanıtlar",
       "en": "~4.1 GB. Higher-quality answers"
      }
     ],
     [
      "gemma2",
      {
       "tr": "~5 GB. En iyi çok dilli destek",
       "en": "~5 GB. Best multilingual support"
      }
     ]
    ]
   },
   {
    "h": {
     "tr": "Mimari",
     "en": "Architecture"
    },
    "p": [
     {
      "tr": "Proje, ASP.NET Core 9 ile yazılmış ve üç büyük sürümden geçmiş monolitik bir MVC uygulamasının baştan yeniden yazımı. Dört katman var: Domain bağımlılığı olmayan varlıkları, Application MediatR ile CQRS komut ve sorgularını, Infrastructure EF Core, Identity ve Ollama servislerini, Web Razor görünümlerini ve controller'ları tutar. Denetim kaydı bir MediatR pipeline davranışı olarak her komutta kendiliğinden yazılır.",
      "en": "The project is a ground-up rewrite of a monolithic MVC app written with ASP.NET Core 9 that went through three major versions. It has four layers: Domain holds entities with no dependencies, Application holds CQRS commands and queries with MediatR, Infrastructure holds EF Core, Identity and the Ollama services, and Web holds the Razor views and controllers. The audit log is a MediatR pipeline behavior, so every command writes it automatically."
     }
    ],
    "diagram": "CorporateKnowledgeBase/\n|-- CorporateKnowledgeBase.Domain/          # Entities, Enums, Interfaces\n|-- CorporateKnowledgeBase.Application/     # CQRS Commands/Queries, DTOs, MediatR\n|-- CorporateKnowledgeBase.Infrastructure/  # EF Core, Identity, Services, Ollama\n|-- CorporateKnowledgeBase.Web/             # ASP.NET Core MVC, Views, Controllers"
   },
   {
    "h": {
     "tr": "Tasarım",
     "en": "Design"
    },
    "p": [
     {
      "tr": "Bootstrap'in üstüne yaklaşık 3000 satırlık kendi kb-* tasarım sistemi: CSS değişkenleriyle tutarlı renkler, tablolar, kartlar, sohbet balonları; masaüstünde, tablette ve telefonda çalışır. Giriş ve kayıt aynı sayfada, kayan bir kapakla; parola alanına yazarken gözlerini kapatan bir baykuş maskotu var.",
      "en": "On top of Bootstrap sits its own kb-* design system of about 3,000 lines: consistent colors through CSS variables, tables, cards and chat bubbles, working on desktop, tablet and phone. Sign-in and sign-up share one page with a sliding cover, and an owl mascot covers its eyes while you type your password."
     }
    ]
   },
   {
    "h": {
     "tr": "Dene",
     "en": "Try it"
    },
    "p": [
     {
      "tr": ".NET 10 SDK ve SQL Server (LocalDB yeter) gerekir; AI özellikleri için Ollama isteğe bağlı. İlk açılışta bir yönetici hesabı oluşturulur, Yönetim → Ayarlar'dan örnek veriler yüklenebilir.",
      "en": "You need the .NET 10 SDK and SQL Server (LocalDB is enough); Ollama is optional, for the AI features. An admin account is created on first run, and demo data can be loaded from Admin → Settings."
     }
    ],
    "code": "git clone https://github.com/umitkrkmz/CorporateKnowledgeBase.git\ncd CorporateKnowledgeBase/CorporateKnowledgeBase.Web\ndotnet ef database update\ndotnet run\n\n# isteğe bağlı: AI asistanı\nollama pull llama3.2\nollama pull nomic-embed-text"
   }
  ],
  "stack": [
   [
    {
     "tr": "Çatı",
     "en": "Framework"
    },
    "ASP.NET Core 10 MVC, Razor"
   ],
   [
    {
     "tr": "Veri",
     "en": "Data"
    },
    "Entity Framework Core 10, SQL Server"
   ],
   [
    {
     "tr": "Kimlik",
     "en": "Identity"
    },
    "ASP.NET Core Identity"
   ],
   [
    {
     "tr": "Mimari",
     "en": "Architecture"
    },
    "Clean Architecture, MediatR (CQRS)"
   ],
   [
    {
     "tr": "Gerçek zamanlı",
     "en": "Real time"
    },
    "SignalR"
   ],
   [
    {
     "tr": "Arka plan işleri",
     "en": "Background jobs"
    },
    "Hangfire"
   ],
   [
    {
     "tr": "AI",
     "en": "AI"
    },
    "Ollama, Llama 3.2, nomic-embed-text (RAG)"
   ],
   [
    {
     "tr": "Arayüz",
     "en": "Interface"
    },
    {
     "tr": "Bootstrap 5, kendi tasarım sistemi, Tagify; PDF için QuestPDF",
     "en": "Bootstrap 5, its own design system, Tagify; QuestPDF for PDFs"
    }
   ]
  ],
  "links": [
   [
    {
     "tr": "Eski sürüm (v1–v3)",
     "en": "Legacy version (v1–v3)"
    },
    "https://github.com/umitkrkmz/CorporateKnowledgeBase-legacy"
   ]
  ],
  "theme": "#8b6cf6",
  "gen": "rag",
  "nums": [
   [
    "4",
    {
     "tr": "katmanlı mimari",
     "en": "architecture layers"
    }
   ],
   [
    "~3.000",
    {
     "tr": "satırlık tasarım sistemi",
     "en": "lines of design system"
    }
   ],
   [
    {
     "tr": "Yerel",
     "en": "Local"
    },
    {
     "tr": "dil modeli, veri dışarı çıkmaz",
     "en": "language model, data stays in"
    }
   ]
  ],
  "related": [
   [
    "how-ai-actually-works",
    {
     "tr": "RAG: biri bir ürünün içinde çalışıyor, öbürü mekanizmayı sıfırdan kuruyor.",
     "en": "RAG: one runs inside a product, the other builds the mechanism from scratch."
    }
   ],
   [
    "limbo",
    {
     "tr": "Aynı yığın: C# ve .NET 10.",
     "en": "The same stack: C# and .NET 10."
    }
   ]
  ]
 },
 "stegotester": {
  "hero": [
   "img/stegotester/image-results.webp",
   {
    "tr": "Görsel sonuçları: AI skoru ve metrikler",
    "en": "Image results: AI score and metrics"
   }
  ],
  "lead": {
   "tr": "Görsel, ses ve metin dosyalarında gizli veri arayan bir adli analiz aracı ve steganografi yöntemlerini 30'dan fazla standart metrikle karşılaştıran bir ölçüm tezgâhı. Tespit iki aşamalı: hızlı bir matematiksel eşik ve onu geçenler için eğitilmiş makine öğrenmesi modelleri.",
   "en": "A forensic tool that looks for hidden data in image, audio and text files, and a benchmark that compares steganography methods with more than 30 standard metrics. Detection has two stages: a fast mathematical threshold, and trained machine learning models for whatever passes it."
  },
  "facts": [
   [
    {
     "tr": "Son sürüm",
     "en": "Latest release"
    },
    "",
    "release"
   ],
   [
    {
     "tr": "Dil",
     "en": "Language"
    },
    "Python 3.10+"
   ],
   [
    {
     "tr": "Arayüz",
     "en": "Interface"
    },
    "PySide6 (Qt)"
   ],
   [
    {
     "tr": "Lisans",
     "en": "License"
    },
    "MIT"
   ]
  ],
  "sections": [
   {
    "h": {
     "tr": "İki aşamalı tespit",
     "en": "Two-stage detection"
    },
    "p": [
     {
      "tr": "Kapıcı (Gatekeeper) sesteki LSB geçiş oranını anında hesaplar; oran 0,455'i aşarsa dosya, model hiç çalışmadan \"kritik\" işaretlenir. Standart LSB saldırılarında bu kural yaklaşık %99,9 doğru. Kuralı geçen karmaşık ses dosyaları ve bütün görseller Dedektif'e, yani eğitilmiş modellere gider: Random Forest ve Gradient Boosting, entropi, kenar yoğunluğu, MFCC, spektral düzlük ve LSB korelasyonu gibi özelliklerle eko gizleme ya da doku maskeleme gibi eşiğin kaçırdığı izleri yakalar.",
      "en": "The Gatekeeper computes the LSB transition rate of an audio file instantly; if it is above 0.455, the file is flagged \"critical\" without running a model at all. On standard LSB attacks this rule is about 99.9% accurate. Complex audio that passes the rule, and every image, goes to the Detective, the trained models: Random Forest and Gradient Boosting use features such as entropy, edge density, MFCC, spectral flatness and LSB correlation to catch traces the threshold misses, like echo hiding or texture masking."
     }
    ],
    "rows": [
     [
      "0,00 – 0,50",
      {
       "tr": "Temiz: dosya temiz görünüyor",
       "en": "Safe: the file looks clean"
      }
     ],
     [
      "0,50 – 0,80",
      {
       "tr": "Şüpheli: ince bir saldırı ya da doğal olarak karmaşık bir dosya",
       "en": "Suspicious: a subtle attack or a naturally complex file"
      }
     ],
     [
      "0,80 – 1,00",
      {
       "tr": "Kritik: gizli veriye dair güçlü istatistiksel kanıt",
       "en": "Critical: strong statistical evidence of hidden data"
      }
     ]
    ]
   },
   {
    "h": {
     "tr": "Metrikler",
     "en": "Metrics"
    },
    "list": [
     {
      "tr": "Görsel: MSE, PSNR, SSIM, DSSIM, LPIPS (algısal), BER",
      "en": "Image: MSE, PSNR, SSIM, DSSIM, LPIPS (perceptual), BER"
     },
     {
      "tr": "Ses: MSE, PSNR, SNR, MAE, log-spektral uzaklık, algısal puan",
      "en": "Audio: MSE, PSNR, SNR, MAE, log-spectral distance, perceptual score"
     },
     {
      "tr": "Metin: benzerlik, Levenshtein uzaklığı, Jaccard indeksi",
      "en": "Text: similarity, Levenshtein distance, Jaccard index"
     },
     {
      "tr": "Yük: bit düzeyinde BER, bayt doğruluğu, tam eşleşme",
      "en": "Payload: bitwise BER, byte accuracy, exact match"
     }
    ],
    "img": [
     "img/stegotester/audio-results.webp",
     {
      "tr": "Ses sonuçları",
      "en": "Audio results"
     }
    ]
   },
   {
    "h": {
     "tr": "Akıllı eşleştirme ve rapor",
     "en": "Smart matching and reports"
    },
    "p": [
     {
      "tr": "Orijinal ve aday dosyalar elle yeniden adlandırmaya gerek kalmadan eşleşir: görsellerde algısal karma (pHash), seste spektral parmak izi. Sonuçlar önce ve sonra kaydırıcısıyla karşılaştırılır; PDF raporda yönetici özeti, risk pasta grafiği ve ayrıntılı bulgular var, sonuçlar JSON ve CSV olarak da dışa aktarılır. Metrik seçimleri profil olarak kaydedilip yeniden yüklenebilir.",
      "en": "Original and candidate files are paired without any manual renaming: perceptual hashing (pHash) for images, a spectral fingerprint for audio. Results are compared with a before/after slider; the PDF report has an executive summary, a risk pie chart and detailed findings, and results can also be exported as JSON and CSV. Metric selections can be saved as profiles and loaded again."
     }
    ]
   },
   {
    "h": {
     "tr": "Modeller nasıl eğitildi",
     "en": "How the models were trained"
    },
    "p": [
     {
      "tr": "Eğitim ayrı bir depoda: binlerce sentetik örnek üretilir (LSB, DCT, eko gizleme, yayılı spektrum), Librosa ve OpenCV ile istatistiksel ve spektral özellikler çıkarılır, birkaç model (Random Forest, Gradient Boosting, SVM, deneysel bir CNN) yarıştırılıp en iyisi kaydedilir. Ölçülen doğruluk görselde ~%87, sesteki LSB'de kuralla ~%99,9, eko gizlemede ~%68. Ana uygulama yalnızca hazır modelleri yükler, böylece hafif kalır.",
      "en": "Training lives in a separate repository: thousands of synthetic samples are generated (LSB, DCT, echo hiding, spread spectrum), statistical and spectral features are extracted with Librosa and OpenCV, and several models (Random Forest, Gradient Boosting, SVM, an experimental CNN) compete, with the best one saved. Measured accuracy is ~87% on images, ~99.9% with the rule on audio LSB and ~68% on echo hiding. The main app only loads the finished models, so it stays light."
     }
    ]
   },
   {
    "h": {
     "tr": "Çalıştır",
     "en": "Run it"
    },
    "code": "git clone https://github.com/umitkrkmz/StegoTester.git\ncd StegoTester\npip install -r requirements.txt\npython main.py"
   }
  ],
  "stack": [
   [
    {
     "tr": "Arayüz",
     "en": "Interface"
    },
    "PySide6 (Qt)"
   ],
   [
    {
     "tr": "Görüntü",
     "en": "Image"
    },
    "Pillow, OpenCV, scikit-image, ImageHash"
   ],
   [
    {
     "tr": "Ses",
     "en": "Audio"
    },
    "Librosa, SoundFile, SciPy"
   ],
   [
    {
     "tr": "Makine öğrenmesi",
     "en": "Machine learning"
    },
    "scikit-learn (Random Forest, Gradient Boosting), joblib, NumPy, pandas"
   ],
   [
    {
     "tr": "Rapor",
     "en": "Reports"
    },
    "fpdf, Matplotlib; JSON, CSV"
   ],
   [
    {
     "tr": "İsteğe bağlı",
     "en": "Optional"
    },
    {
     "tr": "PyTorch ve LPIPS (algısal görsel metriği)",
     "en": "PyTorch and LPIPS (perceptual image metric)"
    }
   ]
  ],
  "links": [
   [
    {
     "tr": "Model eğitimi",
     "en": "Model training"
    },
    "https://github.com/umitkrkmz/StegoTester-AI-Training"
   ]
  ],
  "theme": "#3fbf7f",
  "gen": "stego",
  "nums": [
   [
    "30+",
    {
     "tr": "metrik",
     "en": "metrics"
    }
   ],
   [
    "%99,9",
    {
     "tr": "sesteki LSB, kuralla",
     "en": "audio LSB, by rule"
    }
   ],
   [
    "3",
    {
     "tr": "medya türü",
     "en": "media types"
    }
   ]
  ],
  "related": [
   [
    "chaotic-audio",
    {
     "tr": "İkisi de steganografi: biri veriyi seste gizler, öbürü gizli veriyi arar.",
     "en": "Both are steganography: one hides data in audio, the other hunts for hidden data."
    }
   ],
   [
    "ui2py",
    {
     "tr": "StegoTester'ın PySide6 arayüzü, ui2py'nin çözdüğü iş akışıyla yazıldı.",
     "en": "StegoTester's PySide6 interface was built with the workflow ui2py solves."
    }
   ]
  ]
 },
 "chaotic-audio": {
  "lead": {
   "tr": "Hakemli bir dergide yayımlanan \"Secure Audio Steganography Using Vectorized LSB and Chaos-Based Encryption\" makalesinin resmi kodu: gizlenecek metni ya da görseli yedi kaotik haritadan biriyle şifreleyip bir .wav dosyasının en düşük anlamlı bitlerine gömen, NumPy ile vektörize bir araç.",
   "en": "The official code of the peer-reviewed paper \"Secure Audio Steganography Using Vectorized LSB and Chaos-Based Encryption\": a NumPy-vectorized tool that encrypts a text or image with one of seven chaotic maps and embeds it in the least significant bits of a .wav file."
  },
  "facts": [
   [
    {
     "tr": "Yayın",
     "en": "Published in"
    },
    "Electrical Engineering and Energy, 2025"
   ],
   [
    {
     "tr": "Cilt ve sayfa",
     "en": "Volume and pages"
    },
    "4(3), 68–86"
   ],
   [
    {
     "tr": "Dil",
     "en": "Language"
    },
    "Python 3.11+"
   ],
   [
    {
     "tr": "Lisans",
     "en": "License"
    },
    {
     "tr": "MIT (kod), CC BY 4.0 (makale)",
     "en": "MIT (code), CC BY 4.0 (paper)"
    }
   ]
  ],
  "sections": [
   {
    "h": {
     "tr": "Fikir",
     "en": "The idea"
    },
    "p": [
     {
      "tr": "Steganografi bir mesajın varlığını gizler, şifreleme okunmasını engeller; bu çalışma ikisini birleştiriyor. Önce yük (metin ya da görsel), kaotik bir haritanın ürettiği anahtar akışıyla bayt bayt XOR'lanarak şifrelenir, sonra ses örneklerinin en düşük anlamlı bitine (LSB) yazılır. Kaotik haritalar başlangıç değerine aşırı duyarlıdır: anahtardaki küçük bir fark bambaşka bir dizi üretir. Kırıkkale Üniversitesi'ndeki bitirme projemin yazılımı, arayüzü ve deneyleri bu depoda.",
      "en": "Steganography hides that a message exists, encryption keeps it from being read; this work combines the two. First the payload (text or an image) is encrypted by XOR-ing it byte by byte with a keystream from a chaotic map, then it is written into the least significant bit (LSB) of the audio samples. Chaotic maps are extremely sensitive to their initial values: a tiny change in the key produces an entirely different sequence. The software, interface and experiments of my senior project at Kırıkkale University are in this repository."
     }
    ]
   },
   {
    "h": {
     "tr": "Yedi kaotik harita",
     "en": "Seven chaotic maps"
    },
    "list": [
     "Logistic",
     "Lorenz",
     "PWLCM",
     "Tent",
     "Hénon",
     {
      "tr": "Chua devresi",
      "en": "Chua circuit"
     },
     "Chebyshev"
    ],
    "after": [
     {
      "tr": "Harita parametreleri (r, x₀ gibi) kullanıcının anahtarından belirlenimli olarak türetilir; tahmin edilebilir ilk değerler bir ısınma süresiyle atılır.",
      "en": "The map parameters (such as r and x₀) are derived deterministically from the user's key, and the predictable first values are thrown away during a warm-up period."
     }
    ]
   },
   {
    "h": {
     "tr": "Hız ve kalite",
     "en": "Speed and quality"
    },
    "p": [
     {
      "tr": "Gömme Python döngüsüyle değil, NumPy matris işlemleriyle yapılır; bu yüzden uzun ses dosyalarında da hızlı. Bozulma çok küçük: stego ses ile orijinal arasında PSNR 100 dB'nin üzerinde. Makaledeki deneyler (PSNR, SSIM, BER), depodaki test verileriyle (Baboon, Cameraman ve Pepper görselleri, SQAM ses dosyaları) yeniden üretilebilir.",
      "en": "Embedding is done with NumPy matrix operations rather than Python loops, so it stays fast on long audio files too. The distortion is tiny: the PSNR between the stego audio and the original is above 100 dB. The paper's experiments (PSNR, SSIM, BER) can be reproduced with the test data in the repository (the Baboon, Cameraman and Pepper images and SQAM audio files)."
     }
    ]
   },
   {
    "h": {
     "tr": "Kullanım",
     "en": "Using it"
    },
    "p": [
     {
      "tr": "Şifrelemede metin ya da görsel seçilir, kapak .wav dosyası yüklenir, anahtar girilip harita seçilir. Sonunda bir bileşik anahtar üretilir: algoritma türü, yük boyutu ve boyutlar bu anahtarda olduğu için çözmek için mutlaka saklanmalı. Çözerken stego ses ve bileşik anahtar verilir, orijinal dosya geri gelir.",
      "en": "To encrypt, pick text or an image, load a cover .wav file, enter a key and choose a map. At the end a composite key is generated: it holds the algorithm, payload size and dimensions, so it must be kept to decrypt. To decrypt, give the stego audio and the composite key, and the original file comes back."
     }
    ],
    "imgs": [
     [
      "img/chaotic-audio/encryption-step1.webp",
      {
       "tr": "Anahtar ve harita seçimi",
       "en": "Choosing the key and the map"
      },
      "fit"
     ],
     [
      "img/chaotic-audio/encryption-step2.webp",
      {
       "tr": "Üretilen bileşik anahtar",
       "en": "The generated composite key"
      },
      "fit"
     ]
    ]
   },
   {
    "h": {
     "tr": "Çalıştır",
     "en": "Run it"
    },
    "code": "git clone https://github.com/umitkrkmz/Chaotic_Audio_Steganography.git\ncd Chaotic_Audio_Steganography\npip install -r requirements.txt\npython main.py"
   }
  ],
  "stack": [
   [
    {
     "tr": "Dil",
     "en": "Language"
    },
    "Python 3.11+"
   ],
   [
    {
     "tr": "Hesap",
     "en": "Computation"
    },
    "NumPy, SciPy"
   ],
   [
    {
     "tr": "Görüntü",
     "en": "Image"
    },
    "Pillow"
   ],
   [
    {
     "tr": "Arayüz",
     "en": "Interface"
    },
    "PySide6 (Qt)"
   ],
   [
    {
     "tr": "Ses",
     "en": "Audio"
    },
    "WAV, LSB"
   ]
  ],
  "links": [
   [
    {
     "tr": "Makale",
     "en": "Paper"
    },
    "https://doi.org/10.64470/elene.2025.12"
   ]
  ],
  "theme": "#ef5b4f",
  "gen": "lorenz",
  "nums": [
   [
    "7",
    {
     "tr": "kaotik harita",
     "en": "chaotic maps"
    }
   ],
   [
    ">100 dB",
    "PSNR"
   ],
   [
    "2025",
    {
     "tr": "hakemli yayın",
     "en": "peer-reviewed paper"
    }
   ]
  ],
  "related": [
   [
    "stegotester",
    {
     "tr": "İkisi de steganografi: biri veriyi seste gizler, öbürü gizli veriyi arar.",
     "en": "Both are steganography: one hides data in audio, the other hunts for hidden data."
    }
   ],
   [
    "ui2py",
    {
     "tr": "Aynı PySide6 ve Qt Designer iş akışı.",
     "en": "The same PySide6 and Qt Designer workflow."
    }
   ]
  ]
 },
 "ai-context-mapping": {
  "lead": {
   "tr": "AI kodlama ajanları (Claude Code, Cursor, Copilot) bağlamdan kopuyor, yön bulmak için token harcıyor ve bazen sizi koruyan kodu \"gereksiz\" diye siliyor. ai-context-mapping buna karşı küçük, bağımlılıksız bir çerçeve: projenin haritası, makinece denetlenen kurallar ve testlerin gerçekten kırılabildiğini kanıtlayan bir mutasyon koruyucusu.",
   "en": "AI coding agents (Claude Code, Cursor, Copilot) lose context, spend tokens finding their way around and sometimes delete the code that protects you as \"redundant\". ai-context-mapping is a small, dependency-free framework against that: a map of the project, rules a machine checks, and a mutation guard that proves your tests can actually fail."
  },
  "facts": [
   [
    {
     "tr": "Son sürüm",
     "en": "Latest release"
    },
    "",
    "release"
   ],
   [
    {
     "tr": "Bağımlılık",
     "en": "Dependencies"
    },
    {
     "tr": "Yok, Python standart kütüphanesi",
     "en": "None, Python standard library"
    }
   ],
   [
    {
     "tr": "Deney",
     "en": "Experiments"
    },
    {
     "tr": "7 deney, 90 ajan çalıştırması",
     "en": "7 experiments, 90 agent runs"
    }
   ],
   [
    {
     "tr": "Lisans",
     "en": "License"
    },
    "MIT"
   ]
  ],
  "sections": [
   {
    "h": {
     "tr": "Sorun",
     "en": "The problem"
    },
    "list": [
     {
      "tr": "Bağlam kayması: ajan yapıyı uydurur, yanlış dosyayı düzenler, eski bir API kullanır.",
      "en": "Context drift: the agent invents structure, edits the wrong file, uses a stale API."
     },
     {
      "tr": "Token israfı: yön bulmak için dosya listelemek, grep ve okuma.",
      "en": "Token waste: listing, grepping and reading files just to orient."
     },
     {
      "tr": "Yıkıcı yeniden düzenleme: \"gereksiz\" görünen bir koruma silinir, geçen ay düzeltilen hata geri gelir.",
      "en": "Destructive refactoring: a \"redundant\" guard is deleted, and a bug fixed last month comes back."
     }
    ]
   },
   {
    "h": {
     "tr": "Üç ayak",
     "en": "Three pillars"
    },
    "p": [
     {
      "tr": "Çerçeve yalnızca üç şey yapar; depodaki her şey bunlardan birine hizmet eder. AGENTS.md, Cursor ve Copilot kuralları, Claude Code komutları ve hook'lar dördüncü bir ayak değil, bu üçünü ajana ulaştıran kanallar.",
      "en": "The framework does three things and only three; everything in the repository serves one of them. AGENTS.md, the Cursor and Copilot rules, and the Claude Code commands and hooks are not a fourth pillar but the channels that deliver these three to the agent."
     }
    ],
    "rows": [
     [
      {
       "tr": "Bağlamı haritala",
       "en": "Map the context"
      },
      {
       "tr": "Nerede, ne işe yarıyor? Proje haritası, site haritası, MCP sunucusu, .agentignore",
       "en": "Where is it, and what is it for? Project map, site map, MCP server, .agentignore"
      }
     ],
     [
      {
       "tr": "Kısıtları yaz",
       "en": "Encode the constraints"
      },
      {
       "tr": "Ne değişmemeli, ne yasak? Negatif değişmezler, makinece okunur karar kayıtları, bağımlılık bütçesi",
       "en": "What must not change, and what is forbidden? Negative invariants, machine-readable decision records, a dependency budget"
      }
     ],
     [
      {
       "tr": "Değişikliği doğrula",
       "en": "Verify the changes"
      },
      {
       "tr": "Kurallara uyuldu mu, test kırılabiliyor mu? AST denetimleri, mutasyon testi, kendini koruyan testler",
       "en": "Were the constraints respected, and can the test fail? AST checks, mutation testing, self-guarding tests"
      }
     ]
    ]
   },
   {
    "h": {
     "tr": "Beş kural",
     "en": "The five rules"
    },
    "list": [
     {
      "tr": "Aramadan önce haritayı oku.",
      "en": "Read the map before you search."
     },
     {
      "tr": "Regresyon testi olmadan düzeltme yok; test, mutasyonla kırılabildiğini kanıtlamalı.",
      "en": "No fix without a regression test, and the test must survive mutation."
     },
     {
      "tr": "Yıkmadan önce izin al: force push, veri silme, dosya temizleme.",
      "en": "Ask before destroying anything: force pushes, deleting data, wiping files."
     },
     {
      "tr": "İzinsiz bağımlılık yok; önce standart kütüphane.",
      "en": "No unauthorized dependencies; the standard library first."
     },
     {
      "tr": "Proje bilgisi uydurma: harita, değişmez ya da karar bir kısıt tanımlamıyorsa dur ve sor.",
      "en": "Don't invent project knowledge: if no map row, invariant or decision defines a constraint, stop and ask."
     }
    ]
   },
   {
    "h": {
     "tr": "İşe yarıyor mu? Dürüst sonuçlar",
     "en": "Does it work? Honest results"
    },
    "p": [
     {
      "tr": "Aynı modelle, çerçeveli ve çerçevesiz yedi deney yapıldı (90 ajan çalıştırması, transkriptlerden ölçüldü). En güvenilir ikisi önceden kayıtlı ve rastgele; her çalıştırma kendi projesinde ayrı bir Claude Code oturumu.",
      "en": "Seven experiments were run with the same model, with and without the framework (90 agent runs, measured from transcripts). The two most trustworthy are pre-registered and randomized, each run a separate Claude Code session in its own project."
     }
    ],
    "rows": [
     [
      {
       "tr": "Zararlı \"tutarlı yap\" isteği",
       "en": "A harmful \"make it consistent\" request"
      },
      {
       "tr": "Çerçevesiz 6 çalıştırmanın 4'ünde zarar, çerçeveyle 6'da 0 (Fisher p = 0,030)",
       "en": "Harm in 4 of 6 runs without the framework, 0 of 6 with it (Fisher p = 0.030)"
      }
     ],
     [
      {
       "tr": "Testler durdurdu mu?",
       "en": "Did the tests stop it?"
      },
      {
       "tr": "Hayır: ajanlar sınır testlerini kendi değişikliklerine göre yeniden yazdı",
       "en": "No: the agents rewrote the boundary tests to match their change"
      }
     ],
     [
      {
       "tr": "Çerçeveli ajanlar ne yaptı?",
       "en": "What did the framework agents do?"
      },
      {
       "tr": "12 çalıştırmanın 12'sinde durup sordu, değişmezi göstererek",
       "en": "Stopped and asked in 12 of 12 runs, citing the invariant"
      }
     ],
     [
      {
       "tr": "Maliyet",
       "en": "Cost"
      },
      {
       "tr": "Basit bir hata düzeltmesinde medyan %38 fazla token; düzeltme kalitesi aynı (24'te 24 doğru)",
       "en": "A median 38% more tokens on a simple bug fix; fix quality identical (24 of 24 correct)"
      }
     ]
    ],
    "after": [
     {
      "tr": "Kısacası: tek bir grep'in bulduğu bir hatada çerçeve ek yük, token tasarrufu sağlamıyor. Var olma sebebi olan istekte ise işe yarıyor: başka yerde kaydı olmayan bilgiyi koruyor. Her kurala neyin serbest kaldığını söyleyen tek bir cümle eklemek (deney 7), \"dur ve sor\"u \"güvenli kısmı yap, gerisini reddet\"e çevirdi.",
      "en": "In short: on a bug a single grep finds, the framework is overhead and saves no tokens. On the request it exists for, it works: it protects knowledge that has no other home. Adding one sentence to each rule saying what stays allowed (experiment 7) turned \"stop and ask\" into \"do the safe part, decline the rest\"."
     }
    ],
    "quote": {
     "tr": "Bağlamı azaltmak kendi başına iyi değil. Amaç daha az değil, hedefli bağlam.",
     "en": "Context reduction is not inherently good. The goal is targeted context, not less context."
    }
   },
   {
    "h": {
     "tr": "Kur",
     "en": "Install"
    },
    "p": [
     {
      "tr": "Dört yol var; hepsi aynı kuralları getirir ve hiçbir dosyanın üstüne yazmaz.",
      "en": "There are four ways in; they all bring the same rules, and none of them overwrites a file."
     }
    ],
    "actions": [
     {
      "t": {
       "tr": "Claude Code eklentisi",
       "en": "Claude Code plugin"
      },
      "d": {
       "tr": "Claude Code'da tek komut. Sonra projende /ai-context-mapping:adopt planı gösterir, onayını bekler, haritayı üretir ve tanımlamana yardım eder.",
       "en": "One command in Claude Code. Then /ai-context-mapping:adopt in your project shows a plan, waits for your yes, generates the map and helps you describe it."
      },
      "code": "/plugin install ai-context-mapping --marketplace umitkrkmz/ai-context-mapping",
      "links": [
       [
        {
         "tr": "Kurulum adımları",
         "en": "Setup steps"
        },
        "https://github.com/umitkrkmz/ai-context-mapping#claude-code-install-the-plugin"
       ]
      ]
     },
     {
      "t": {
       "tr": "Her ajan için kurucu",
       "en": "Installer for any agent"
      },
      "d": {
       "tr": "Depoyu projenin yanına indir, projenin kökünden çalıştır. ‑‑dry-run planı gösterir, hiçbir şey yazmaz; ‑‑agent ile Claude, Cursor ya da Copilot dosyası, ‑‑ci ile GitHub Actions eklenir.",
       "en": "Download the repository next to your project and run it from your project's root. ‑‑dry-run shows the plan and writes nothing; ‑‑agent adds the Claude, Cursor or Copilot file, and ‑‑ci adds a GitHub Actions workflow."
      },
      "code": "python ../ai-context-mapping/scripts/adopt.py --dry-run\npython ../ai-context-mapping/scripts/adopt.py --agent claude --agent cursor --ci",
      "links": [
       [
        {
         "tr": "ZIP indir",
         "en": "Download ZIP"
        },
        "https://github.com/umitkrkmz/ai-context-mapping/archive/refs/heads/main.zip"
       ],
       [
        {
         "tr": "Kurucu belgesi",
         "en": "Installer guide"
        },
        "https://github.com/umitkrkmz/ai-context-mapping#any-agent-run-the-installer"
       ]
      ]
     },
     {
      "t": {
       "tr": "MCP sunucusu",
       "en": "MCP server"
      },
      "d": {
       "tr": "Claude Desktop, Cursor ya da Codex'e proje haritasını dört salt okunur araçla sunar: read_project_map, get_file_purpose, get_invariants_for_file, check_map. Tek dosya, bağımlılık yok.",
       "en": "Serves the project map to Claude Desktop, Cursor or Codex through four read-only tools: read_project_map, get_file_purpose, get_invariants_for_file, check_map. One file, no dependencies."
      },
      "links": [
       [
        {
         "tr": "MCP kurulumu",
         "en": "MCP setup"
        },
        "https://github.com/umitkrkmz/ai-context-mapping/blob/main/mcp/README.md"
       ],
       [
        "context_server.py",
        "https://github.com/umitkrkmz/ai-context-mapping/blob/main/mcp/context_server.py"
       ]
      ]
     },
     {
      "t": {
       "tr": "AGENTS.md ve CLAUDE.md",
       "en": "AGENTS.md and CLAUDE.md"
      },
      "d": {
       "tr": "Beş kuralı ajana anlatan manifesto; CLAUDE.md, AGENTS.md'nin birebir kopyası. Yığınına göre bir şablon seç, projenin köküne koy. Cursor ve Copilot için kendi kural dosyaları da var.",
       "en": "The manifesto that tells the agent the five rules; CLAUDE.md is a byte-identical copy of AGENTS.md. Pick the template for your stack and put it in your project root. Cursor and Copilot have their own rule files too."
      },
      "links": [
       [
        {
         "tr": "Genel şablon",
         "en": "Generic template"
        },
        "https://github.com/umitkrkmz/ai-context-mapping/blob/main/templates/generic/AGENTS.md"
       ],
       [
        "Python",
        "https://github.com/umitkrkmz/ai-context-mapping/blob/main/templates/python/AGENTS.md"
       ],
       [
        "TypeScript",
        "https://github.com/umitkrkmz/ai-context-mapping/blob/main/templates/typescript/AGENTS.md"
       ],
       [
        "Cursor",
        "https://github.com/umitkrkmz/ai-context-mapping/blob/main/.cursor/rules/context-guardrails.mdc"
       ],
       [
        "Copilot",
        "https://github.com/umitkrkmz/ai-context-mapping/blob/main/.github/copilot-instructions.md"
       ]
      ]
     }
    ]
   },
   {
    "h": {
     "tr": "Bir testin gerçek olduğunu kanıtlamak",
     "en": "Proving a test is real"
    },
    "p": [
     {
      "tr": "Mutasyon koruyucusu fonksiyonu bilerek bozar; test kırmızıya dönmüyorsa hiçbir şey kanıtlamıyordur. Fonksiyonu mock'layıp geçen bir test bu denetimi \"fonksiyon hiçbir şey yapmadığında da testler geçiyor\" uyarısıyla geçemez.",
      "en": "The mutation guard breaks the function on purpose; if the test doesn't turn red, it proves nothing. A test that mocks the function away fails this check with \"the tests still pass when the function does nothing\"."
     }
    ],
    "diagram": "$ python scripts/mutation_guard.py --test tests/test_clamp.py --target src/calc.py:clamp\n[ok] baseline passed (0.34s)\n\n  #   line  operator   mutation                                   result\n  0      4  neutralize replace the whole body with 'return None'  KILLED\n  1      6  compare    < -> >=                                    KILLED\n  2      7  return     return None instead of the computed value  KILLED\n\nKilled 3/3 mutants (100%); required at least 50%.\n[ok] The tests fail when the function is broken."
   },
   {
    "h": {
     "tr": "Kardeş depo",
     "en": "Companion repository"
    },
    "p": [
     {
      "tr": "how-ai-actually-works bu projenin öbür yarısı: burada araç ve ölçülen kanıt, orada altındaki mekanizmalar; bağlam mühendisliği, MCP, ajan korkulukları ve değerlendirme modülleri buradaki araçlarla birebir eşleşir.",
      "en": "how-ai-actually-works is the other half of this project: here the tool and the measured evidence, there the mechanisms underneath; its context engineering, MCP, agent guardrails and evaluation modules map one to one onto the tools here."
     }
    ]
   }
  ],
  "stack": [
   [
    {
     "tr": "Dil",
     "en": "Language"
    },
    {
     "tr": "Python 3.9+, yalnızca standart kütüphane",
     "en": "Python 3.9+, standard library only"
    }
   ],
   [
    {
     "tr": "Ajan entegrasyonu",
     "en": "Agent integration"
    },
    {
     "tr": "Claude Code eklentisi (skill'ler, hook'lar), Cursor kuralları, Copilot talimatları",
     "en": "Claude Code plugin (skills, hooks), Cursor rules, Copilot instructions"
    }
   ],
   [
    "MCP",
    {
     "tr": "JSON-RPC 2.0, stdio",
     "en": "JSON-RPC 2.0, stdio"
    }
   ],
   [
    {
     "tr": "Denetim",
     "en": "Checks"
    },
    {
     "tr": "AST denetimleri, mutasyon testi, pre-commit hook, GitHub Actions",
     "en": "AST checks, mutation testing, a pre-commit hook, GitHub Actions"
    }
   ],
   [
    {
     "tr": "Şablonlar",
     "en": "Templates"
    },
    {
     "tr": "Python, TypeScript, genel",
     "en": "Python, TypeScript, generic"
    }
   ]
  ],
  "links": [
   [
    {
     "tr": "Deney sonuçları",
     "en": "Benchmark results"
    },
    "https://github.com/umitkrkmz/ai-context-mapping/blob/main/docs/benchmark-results.md"
   ],
   [
    "how-ai-actually-works",
    "#projects/how-ai-actually-works"
   ]
  ],
  "theme": "#22b8cf",
  "gen": "graph",
  "nums": [
   [
    "90",
    {
     "tr": "ajan çalıştırması",
     "en": "agent runs"
    }
   ],
   [
    "0 / 6",
    {
     "tr": "zararlı değişiklik, çerçeveyle",
     "en": "harmful changes, with the framework"
    }
   ],
   [
    "0",
    {
     "tr": "bağımlılık",
     "en": "dependencies"
    }
   ]
  ],
  "related": [
   [
    "how-ai-actually-works",
    {
     "tr": "Kardeş depolar: biri araç ve ölçülen kanıt, öbürü altındaki mekanizmalar.",
     "en": "Companion repositories: one is the tool and the measured evidence, the other the mechanisms underneath."
    }
   ],
   [
    "mediagrab",
    {
     "tr": "MediaGrab, ai-context-mapping'in gerçek bir mimarideki vaka çalışması.",
     "en": "MediaGrab is ai-context-mapping's case study in a real architecture."
    }
   ]
  ]
 },
 "how-ai-actually-works": {
  "lead": {
   "tr": "Modern AI sistemlerinin altındaki mekanizmalara ilk ilkelerden bir mühendislik rehberi. Her mekanizma birkaç düzine satır standart kütüphaneli Python ile bir kez kurulur ve gizem kalkar; geriye bildik takaslarıyla sistem mühendisliği kalır.",
   "en": "A first-principles engineering guide to the mechanisms behind modern AI systems. Build each mechanism once in a few dozen lines of standard-library Python and the mystery goes; what remains is systems engineering, with all its usual trade-offs."
  },
  "facts": [
   [
    {
     "tr": "Son sürüm",
     "en": "Latest release"
    },
    "",
    "release"
   ],
   [
    {
     "tr": "Modül",
     "en": "Modules"
    },
    "8"
   ],
   [
    {
     "tr": "Betik",
     "en": "Scripts"
    },
    {
     "tr": "15, hepsi assert'le biter",
     "en": "15, all ending in asserts"
    }
   ],
   [
    {
     "tr": "Bağımlılık",
     "en": "Dependencies"
    },
    {
     "tr": "Yok, Python 3.10+",
     "en": "None, Python 3.10+"
    }
   ]
  ],
  "sections": [
   {
    "quote": {
     "tr": "Matrise bakınca sihir buharlaşır.",
     "en": "The magic evaporates when you look at the matrix."
    },
    "p": [
     {
      "tr": "AI mühendisliğinin üstü jargon, sarmalayıcı kütüphaneler ve pazarlamayla kaplandı; teknoloji incelenemez bir şeymiş gibi sunuluyor. Değil. Altındaki her mekanizma sıradan mühendislik:",
      "en": "AI engineering has gathered a thick layer of jargon, wrapper libraries and marketing that presents the technology as something beyond inspection. It is not. Each mechanism underneath is ordinary engineering:"
     }
    ],
    "list": [
     {
      "tr": "Embedding bir kayan noktalı sayı listesi: modelin eğitimde öğrendiği bir uzayda koordinatlar.",
      "en": "An embedding is a list of floating-point numbers: coordinates in a space a model learned during training."
     },
     {
      "tr": "Anlamsal benzerlik, iki vektör arasındaki açının kosinüsü.",
      "en": "Semantic similarity is the cosine of the angle between two of those vectors."
     },
     {
      "tr": "Tokenizer, sırayla uygulanan öğrenilmiş birleştirmeler artı parçalardan tam sayılara bir tablo.",
      "en": "A tokenizer is a learned list of pair merges applied in order, plus a lookup table from pieces to integer IDs."
     },
     {
      "tr": "RAG'in iskeleti basit: metni bul, prompta ekle. Zor kısımlar arama ve değerlendirme problemleri.",
      "en": "RAG has a simple skeleton: retrieve some text and add it to the prompt. The hard parts are search and evaluation problems."
     },
     {
      "tr": "Ajan bir döngü: modeli çağır, ürettiği araç çağrılarını çalıştır, sonucu ekle; model durana ya da bütçe bitene kadar tekrarla.",
      "en": "An agent is a loop: call the model, run the tool calls it emits, append the results, and repeat until it stops or a budget runs out."
     },
     {
      "tr": "MCP, tanımlı bir yaşam döngüsü olan JSON-RPC 2.0 mesajları; stdio ya da HTTP üzerinden.",
      "en": "MCP is JSON-RPC 2.0 messages with a defined lifecycle, carried over stdio or HTTP."
     }
    ]
   },
   {
    "h": {
     "tr": "Beş değişmez kural",
     "en": "The five invariant rules"
    },
    "rows": [
     [
      {
       "tr": "Önce ilk ilkeler",
       "en": "First principles first"
      },
      {
       "tr": "Mekanizma düz Python ile kurulmadan Chroma, LangChain ya da FAISS yok; depoda üçüncü taraf bağımlılık yok.",
       "en": "No Chroma, LangChain or FAISS before the mechanism is built in plain Python; the repository has no third-party dependencies."
      }
     ],
     [
      {
       "tr": "Zorunlu anti-desenler",
       "en": "Compulsory anti-patterns"
      },
      {
       "tr": "Her modülde maliyet, gecikme ve hata takaslarıyla bir \"Ne zaman kullanma\" bölümü; grep, regex, SQLite FTS5 gibi sıkıcı alternatiflerle tartılır.",
       "en": "Every module has a \"When NOT to use this\" section weighing cost, latency and failure modes against boring alternatives like grep, regex or SQLite FTS5."
      }
     ],
     [
      {
       "tr": "Çalışan, kanıtlı kod",
       "en": "Runnable, asserted code"
      },
      {
       "tr": "Her betik assert'lerle biter; verify_all.py README'lerdeki her Python bloğunu da çalıştırır, assert'i olmayan bloğu reddeder.",
       "en": "Every script ends in asserts; verify_all.py also runs every Python block in the READMEs and fails a block that has no assert."
      }
     ],
     [
      {
       "tr": "Görsel zihinsel modeller",
       "en": "Visual mental models"
      },
      {
       "tr": "Her modül formülden ve koddan önce bir ASCII ya da Mermaid diyagramıyla açılır.",
       "en": "Every module opens with an ASCII or Mermaid diagram before formulas and code."
      }
     ],
     [
      {
       "tr": "Abartı yok, kaynaklı iddia",
       "en": "No hype, sourced claims"
      },
      {
       "tr": "Her sayı bir makaleden, bir ölçümden ya da \"varsayım\" etiketinden gelir.",
       "en": "Every number comes from a cited paper, a measurement, or a label saying it is an assumption."
      }
     ]
    ]
   },
   {
    "h": {
     "tr": "Müfredat",
     "en": "Curriculum"
    },
    "rows": [
     [
      {
       "tr": "01 · Temel taşlar ve embedding",
       "en": "01 · Primitives & embeddings"
      },
      {
       "tr": "BPE birleştirmeleri, embedding matrisi, kosinüs benzerliği. Sıkıcı alternatif: regex, SQLite FTS5",
       "en": "BPE merges, the embedding matrix, cosine similarity. Boring alternative: regex, SQLite FTS5"
      }
     ],
     [
      {
       "tr": "02 · Arama ve RAG",
       "en": "02 · Retrieval & RAG"
      },
      {
       "tr": "Parçalama, tam ve yaklaşık arama, naif RAG iskeleti. Alternatif: grep, ripgrep, FTS5 (BM25)",
       "en": "Chunking, exact vs approximate search, the naive RAG skeleton. Alternative: grep, ripgrep, FTS5 (BM25)"
      }
     ],
     [
      {
       "tr": "03 · Bağlam mühendisliği",
       "en": "03 · Context engineering"
      },
      {
       "tr": "\"Lost in the Middle\", ön doldurma maliyeti, üç önbellek politikası, araç okumalarının maliyeti",
       "en": "\"Lost in the Middle\", prefill cost, three prompt-caching policies, the cost of tool reads"
      }
     ],
     [
      {
       "tr": "04 · Araçlar ve MCP",
       "en": "04 · Tools & MCP"
      },
      {
       "tr": "JSON Schema araç tanımları, host döngüsü, MCP yaşam döngüsü, saldırı yüzeyi olarak araçlar",
       "en": "JSON Schema tool definitions, the host loop, the MCP lifecycle, tools as an attack surface"
      }
     ],
     [
      {
       "tr": "05 · Ajan korkulukları",
       "en": "05 · Agent guardrails"
      },
      {
       "tr": "Ajan döngüsü, adım bütçesi, AST kapıları ve kör noktaları, yazılı değişmezlerin ölçülen etkisi",
       "en": "The agent loop, step budgets, AST gates and their blind spots, the measured effect of written invariants"
      }
     ],
     [
      {
       "tr": "06 · Değerlendirme",
       "en": "06 · Evals & benchmarking"
      },
      {
       "tr": "Precision@K, MRR, sadakat denetimi, mutasyon testi, ajanı deney gibi değerlendirmek",
       "en": "Precision@K, MRR, a faithfulness check, mutation testing, evaluating agents like an experiment"
      }
     ],
     [
      {
       "tr": "07 · Çözümleme ve yapılandırılmış çıktı",
       "en": "07 · Decoding & structured outputs"
      },
      {
       "tr": "Logit, softmax, sıcaklık, top-k, top-p, dilbilgisi kısıtlı çözümleme (FSM)",
       "en": "Logits, softmax, temperature, top-k, top-p, grammar-constrained decoding (FSM)"
      }
     ],
     [
      {
       "tr": "08 · Donanım, VRAM ve nicemleme",
       "en": "08 · Hardware, VRAM & quantization"
      },
      {
       "tr": "FP16, INT8, INT4 ağırlık belleği, KV önbelleği, GQA, bant genişliği tavanı",
       "en": "FP16, INT8 and INT4 weight memory, the KV cache, GQA, the memory-bandwidth ceiling"
      }
     ]
    ]
   },
   {
    "h": {
     "tr": "Çalıştır",
     "en": "Run it"
    },
    "p": [
     {
      "tr": "Her şey Python 3.10+ ile, kurulum gerekmeden çalışır: 15 betik ve README'lerdeki çalıştırılabilir bloklar iki saniyenin altında.",
      "en": "Everything runs on Python 3.10+ with nothing to install: the 15 scripts and the runnable README blocks finish in under two seconds."
     }
    ],
    "code": "git clone https://github.com/umitkrkmz/how-ai-actually-works.git\ncd how-ai-actually-works\npython verify_all.py\n\n# ya da tek bir modül, örneğin BPE tokenizer\npython 01-primitives-and-embeddings/bpe_tokenizer.py"
   },
   {
    "h": {
     "tr": "Kardeş depo",
     "en": "Companion repository"
    },
    "p": [
     {
      "tr": "ai-context-mapping bu mekanizmaları gerçek bir depoda çalışan kodlama ajanlarına uygular: proje haritası, negatif değişmezler, AST doğrulayıcı, mutasyon koruyucusu, MCP bağlam sunucusu ve Claude Code hook'ları. Korkulukların ajan davranışını değiştirip değiştirmediğini önceden kayıtlı deneylerle ölçer.",
      "en": "ai-context-mapping applies these mechanisms to coding agents working in a real repository: a project map, negative invariants, an AST verifier, a mutation guard, an MCP context server and Claude Code hooks. It measures, with pre-registered experiments, whether those guardrails change agent behavior."
     }
    ]
   }
  ],
  "stack": [
   [
    {
     "tr": "Dil",
     "en": "Language"
    },
    {
     "tr": "Python 3.10+, yalnızca standart kütüphane",
     "en": "Python 3.10+, standard library only"
    }
   ],
   [
    {
     "tr": "Diyagramlar",
     "en": "Diagrams"
    },
    "Mermaid, ASCII"
   ],
   [
    {
     "tr": "Doğrulama",
     "en": "Verification"
    },
    {
     "tr": "verify_all.py: her betik ve README bloğu ayrı bir süreçte",
     "en": "verify_all.py: every script and README block in its own process"
    }
   ]
  ],
  "links": [
   [
    "ai-context-mapping",
    "#projects/ai-context-mapping"
   ]
  ],
  "theme": "#f0913a",
  "gen": "vectors",
  "nums": [
   [
    "8",
    {
     "tr": "modül",
     "en": "modules"
    }
   ],
   [
    "15",
    {
     "tr": "assert'le biten betik",
     "en": "scripts ending in asserts"
    }
   ],
   [
    "< 2 sn",
    {
     "tr": "bütün doğrulama",
     "en": "full verification"
    }
   ]
  ],
  "related": [
   [
    "ai-context-mapping",
    {
     "tr": "Kardeş depolar: biri araç ve ölçülen kanıt, öbürü altındaki mekanizmalar.",
     "en": "Companion repositories: one is the tool and the measured evidence, the other the mechanisms underneath."
    }
   ],
   [
    "kurumsal-bilgi",
    {
     "tr": "RAG: biri bir ürünün içinde çalışıyor, öbürü mekanizmayı sıfırdan kuruyor.",
     "en": "RAG: one runs inside a product, the other builds the mechanism from scratch."
    }
   ]
  ]
 },
 "limbo": {
  "lead": {
   "tr": "Her site için ayrı strateji kullanan bir DPI aşma motoru. İSS'nin bir alan adını engellediğini kendisi fark eder, onun için bir profil açar ve hangi tekniğin işe yaradığını gerçek bağlantı üzerinde dener. Adını Inception'daki en derin rüya katmanından alıyor: DPI'nin kaybolduğu yer.",
   "en": "A DPI bypass engine that uses a separate strategy for each site. It notices on its own when the ISP blocks a domain, opens a profile for it and tries out on the real connection which technique works. It is named after the deepest dream layer in Inception: the place where DPI gets lost."
  },
  "facts": [
   [
    {
     "tr": "Son sürüm",
     "en": "Latest release"
    },
    "",
    "release"
   ],
   [
    {
     "tr": "Çalıştığı yer",
     "en": "Runs on"
    },
    {
     "tr": "Windows 10/11, 64 bit",
     "en": "Windows 10/11, 64-bit"
    }
   ],
   [
    {
     "tr": "Dil",
     "en": "Language"
    },
    "C#, .NET 10"
   ],
   [
    {
     "tr": "Lisans",
     "en": "License"
    },
    "GPL-2.0"
   ]
  ],
  "sections": [
   {
    "h": {
     "tr": "Neden alan adı bazlı",
     "en": "Why per domain"
    },
    "p": [
     {
      "tr": "Benzer araçlar genelde bütün trafiğe tek bir global ayar uygular. Oysa her engel aynı değil: bir sitede TCP parçalamak yeter, ötekinde SNI'yi tamamen şifrelemek (ECH) gerekir. Limbo her alan adı için ayrı bir profil tutar, joker karakterle eşler (*.discord.com gibi) ve yalnızca o trafiğe dokunur. GoodbyeDPI'den ilham aldı, ama soruna bu farklı mimariyle yaklaşıyor.",
      "en": "Similar tools usually apply one global setting to all traffic. But blocks differ: on one site splitting TCP is enough, on another the SNI has to be encrypted entirely (ECH). Limbo keeps a separate profile for each domain, matches it with wildcards (like *.discord.com) and touches only that traffic. It was inspired by GoodbyeDPI but approaches the problem with this different architecture."
     }
    ]
   },
   {
    "h": {
     "tr": "Yedi strateji ve Adaptive",
     "en": "Seven strategies and Adaptive"
    },
    "rows": [
     [
      "ECH",
      {
       "tr": "SNI'yi HPKE (X25519 + AES-GCM) ile tamamen şifreler. Cloudflare siteleri için",
       "en": "Encrypts the SNI entirely with HPKE (X25519 + AES-GCM). For Cloudflare sites"
      }
     ],
     [
      "QuicFake",
      {
       "tr": "QUIC için sahte datagram enjeksiyonu. HTTP/3, Discord sesi",
       "en": "Fake datagram injection for QUIC. HTTP/3, Discord voice"
      }
     ],
     [
      "TcpFragmentation",
      {
       "tr": "TCP yükünü küçük parçalara böler. Genel DPI",
       "en": "Splits the TCP payload into small pieces. General DPI"
      }
     ],
     [
      "SmartFragmentation",
      {
       "tr": "Tam SNI konumunda böler (SIMD). En az paketle",
       "en": "Splits exactly at the SNI offset (SIMD). With the fewest packets"
      }
     ],
     [
      "Desync",
      {
       "tr": "Paketleri sırasız gönderir. Durum tutan DPI",
       "en": "Sends packets out of order. Stateful DPI"
      }
     ],
     [
      "FakeTtl",
      {
       "tr": "Düşük TTL'li yem paketler. Pasif DPI",
       "en": "Low-TTL decoy packets. Passive DPI"
      }
     ],
     [
      "UdpFake",
      {
       "tr": "UDP ve QUIC trafiği için sahte paketler. Sesli ve görüntülü görüşme",
       "en": "Fake packets for UDP and QUIC traffic. Voice and video calls"
      }
     ],
     [
      "Adaptive",
      {
       "tr": "Hepsini dener, en iyisini kaydeder. Bilinmeyen siteler",
       "en": "Tries them all and saves the best. Unknown sites"
      }
     ]
    ]
   },
   {
    "h": {
     "tr": "Radar",
     "en": "Radar"
    },
    "p": [
     {
      "tr": "Limbo trafiği izlerken iki işaret arar: İSS'nin araya soktuğu sahte RST paketleri ve isteğin gidip hiçbir şeyin geri gelmediği 3 saniyelik sessiz düşürmeler. Bir alan adı engelli görünürse kara listeye eklenir, onun için (varsayılan olarak Adaptive) bir profil açılır ve aşma hemen başlar.",
      "en": "While watching traffic, Limbo looks for two signs: fake RST packets injected by the ISP, and 3-second silent drops where a request goes out and nothing comes back. When a domain looks blocked, it is added to the blacklist, a profile is opened for it (Adaptive by default) and the bypass starts right away."
     }
    ],
    "diagram": {
     "tr": "Paket analizi\n    ↓\nIspBehaviorAnalyzer          ConnectionTracker\n (RST enjeksiyonu)     +      (3 sn sessiz düşürme)\n    ↓                               ↓\n         BlacklistManager (Auto-Blacklist.txt)\n                    ↓\n         Otomatik Adaptive profili\n                    ↓\n         Konsol yeni alan adını gösterir",
     "en": "Packet analysis\n    ↓\nIspBehaviorAnalyzer          ConnectionTracker\n (RST injection)       +      (3 s silent drop)\n    ↓                               ↓\n         BlacklistManager (Auto-Blacklist.txt)\n                    ↓\n         Automatic Adaptive profile\n                    ↓\n         Console shows the new domain"
    }
   },
   {
    "h": {
     "tr": "Ağ analizi ve kalibrasyon",
     "en": "Network analysis and calibration"
    },
    "p": [
     {
      "tr": "\"İSS'im bu bağlantıya gerçekte ne yapıyor?\" sorusunu yanıtlar: genel IP ve İSS (ASN), sistemin DNS sunucuları ve bir alan adı için canlı tarama. Tarama DNS kurcalamayı (sistem DNS'i ile DNS over HTTPS uyuşmuyor mu), RST enjeksiyonunu, sessiz düşürmeyi ya da sorunsuz erişimi raporlar. Kalibrasyon her stratejiyi simülasyonla değil, süzülmüş canlı bir yakalama üzerinde gerçekten uygulayarak o alan adı için çalışanı bulur.",
      "en": "It answers \"what is my ISP actually doing to this connection?\": public IP and ISP (ASN), the system's DNS servers, and a live scan for a domain. The scan reports DNS tampering (does the system DNS disagree with DNS over HTTPS?), RST injection, silent drops, or clean access. Calibration finds what works for a domain by really applying each strategy over a filtered live capture, not a simulation."
     }
    ]
   },
   {
    "h": {
     "tr": "Konsol",
     "en": "Console"
    },
    "p": [
     {
      "tr": "Argümansız açılınca Spectre.Console ile bir menü ve canlı trafik paneli gelir; aynı işlemler betikte kullanılabilecek komutlar olarak da var. Paket ayrıştırma AVX2 ile hızlandırılmış, DNS over HTTPS paralel A ve AAAA sorgularıyla çalışır. Arayüz İngilizce ve Türkçe.",
      "en": "Run without arguments, it opens a menu and a live traffic panel built with Spectre.Console; the same operations exist as scriptable commands. Packet parsing is accelerated with AVX2, and DNS over HTTPS runs parallel A and AAAA queries. The interface is in English and Turkish."
     }
    ],
    "code": "limbo calibrate discord.com\nlimbo add-profile \"*.discord.com\" TcpFragmentation --frag 2\nlimbo test twitter.com\nlimbo radar\nlimbo run -v"
   },
   {
    "h": {
     "tr": "İndir",
     "en": "Download"
    },
    "p": [
     {
      "tr": "Hazır paket Releases'te: .NET kurulumu gerektirmeyen, WinDivert'i içinde getiren tek bir ZIP. Yönetici olarak çalıştırılır; her yayında SHA-256 değerleri var. Yalnızca eğitim ve araştırma amaçlıdır, kullanmadan önce yerel yasalara bakın.",
      "en": "The ready-made package is on the Releases page: a single ZIP that needs no .NET install and bundles WinDivert. Run it as administrator; every release lists SHA-256 checksums. It is for education and research only; check your local laws before using it."
     }
    ]
   }
  ],
  "stack": [
   [
    {
     "tr": "Dil",
     "en": "Language"
    },
    "C#, .NET 10"
   ],
   [
    {
     "tr": "Paket yakalama",
     "en": "Packet capture"
    },
    "WinDivert 2.2 (P/Invoke)"
   ],
   [
    {
     "tr": "Şifreleme",
     "en": "Cryptography"
    },
    "X25519, AES-GCM (HPKE, ECH)"
   ],
   [
    {
     "tr": "Performans",
     "en": "Performance"
    },
    "SIMD (AVX2)"
   ],
   [
    {
     "tr": "Konsol",
     "en": "Console"
    },
    "Spectre.Console"
   ],
   [
    {
     "tr": "Test ve CI",
     "en": "Tests and CI"
    },
    "xUnit, GitHub Actions"
   ]
  ],
  "links": [
   [
    {
     "tr": "İndir",
     "en": "Download"
    },
    "https://github.com/umitkrkmz/Limbo/releases/latest"
   ]
  ],
  "theme": "#9c7bff",
  "gen": "layers",
  "nums": [
   [
    "7",
    {
     "tr": "strateji",
     "en": "strategies"
    }
   ],
   [
    {
     "tr": "Alan adı",
     "en": "Per domain"
    },
    {
     "tr": "başına profil",
     "en": "profiles"
    }
   ],
   [
    "AVX2",
    {
     "tr": "paket ayrıştırma",
     "en": "packet parsing"
    }
   ]
  ],
  "related": [
   [
    "zerodivert",
    {
     "tr": "İkisi de WinDivert ile DPI aşıyor: Limbo her site için ayrı strateji, ZeroDivert yalnızca Discord.",
     "en": "Both bypass DPI with WinDivert: Limbo with a strategy per site, ZeroDivert for Discord only."
    }
   ],
   [
    "kurumsal-bilgi",
    {
     "tr": "Aynı yığın: C# ve .NET 10.",
     "en": "The same stack: C# and .NET 10."
    }
   ]
  ]
 },
 "zerodivert": {
  "lead": {
   "tr": "VPN olmadan, hız kaybı olmadan Discord erişimi. İSS'lerin DPI cihazları TLS el sıkışmasındaki SNI alanından Discord'u tanıyıp bağlantıyı keser; ZeroDivert yalnızca bu paketleri parçalar ya da sırasını değiştirir, DPI SNI'yi okuyamaz. Geri kalan trafiğe dokunmaz.",
   "en": "Discord access without a VPN and without losing speed. ISPs' DPI devices spot Discord in the SNI field of the TLS handshake and cut the connection; ZeroDivert only splits or reorders those packets, so the DPI can't read the SNI. The rest of the traffic is left alone."
  },
  "facts": [
   [
    {
     "tr": "Son sürüm",
     "en": "Latest release"
    },
    "",
    "release"
   ],
   [
    {
     "tr": "Çalıştığı yer",
     "en": "Runs on"
    },
    {
     "tr": "Windows 10/11, 64 bit",
     "en": "Windows 10/11, 64-bit"
    }
   ],
   [
    {
     "tr": "Dil",
     "en": "Language"
    },
    "C#, .NET 10"
   ],
   [
    {
     "tr": "Lisans",
     "en": "License"
    },
    "GPL-3.0"
   ]
  ],
  "sections": [
   {
    "h": {
     "tr": "Ne yapar, ne yapmaz",
     "en": "What it does and doesn't"
    },
    "p": [
     {
      "tr": "VPN değildir: trafiği başka bir sunucudan geçirmez, sunucu tarafında hiçbir şey değişmez. Yalnızca discord.com, discordapp.com gibi Discord alan adlarının trafiğini işler. Bazı İSS'ler Discord'u DNS düzeyinde de engellediği için DNS sunucusu uygulamanın içinden Cloudflare ya da Google'a çevrilebilir.",
      "en": "It is not a VPN: traffic doesn't go through another server and nothing changes on the server side. It only handles traffic for Discord domains such as discord.com and discordapp.com. Some ISPs also block Discord at the DNS level, so the DNS server can be switched to Cloudflare or Google from inside the app."
     }
    ],
    "list": [
     {
      "tr": "IP adresini gizlemez.",
      "en": "It doesn't hide your IP address."
     },
     {
      "tr": "Oyunlarda ya da genel internette hızı değiştirmez.",
      "en": "It doesn't change speed in games or general browsing."
     },
     {
      "tr": "IP tabanlı engelleri aşamaz.",
      "en": "It can't get around IP-based blocks."
     },
     {
      "tr": "Discord dışındaki sitelere karışmaz.",
      "en": "It doesn't touch sites other than Discord."
     }
    ]
   },
   {
    "h": {
     "tr": "Kendini ayarlayan motor",
     "en": "A self-tuning engine"
    },
    "p": [
     {
      "tr": "İlk açılışta teknikler sırayla denenir; bağlantı RST ile kesilir ya da yanıt gelmezse sıradakine geçilir, beş ardışık başarıdan sonra çalışan ayar kaydedilir ve sonraki açılışlarda doğrudan yüklenir. Sesli görüşme (UDP) için UDP Fake her zaman ek olarak uygulanır.",
      "en": "On first run the techniques are tried in order; if the connection is cut with an RST or nothing comes back, it moves to the next one, and after five successes in a row the working setting is saved and loaded directly on later runs. For voice calls (UDP), UDP Fake is always applied on top."
     }
    ],
    "rows": [
     [
      {
       "tr": "1 · Akıllı TCP parçalama",
       "en": "1 · Smart TCP fragmentation"
      },
      {
       "tr": "SNI'nin bulunduğu ilk ~50 baytı 2 baytlık TCP parçalarına böler; DPI parçaları birleştiremez",
       "en": "Splits the first ~50 bytes, where the SNI sits, into 2-byte TCP segments; the DPI cannot reassemble them"
      }
     ],
     [
      {
       "tr": "2 · TCP Desync",
       "en": "2 · TCP desync"
      },
      {
       "tr": "Paket sırasını bozarak DPI'nin TCP durum makinesini şaşırtır",
       "en": "Breaks the packet order to confuse the DPI's TCP state machine"
      }
     ],
     [
      {
       "tr": "3 · Fake TTL",
       "en": "3 · Fake TTL"
      },
      {
       "tr": "DPI'nin gördüğü ama sunucuya ulaşmayan düşük TTL'li sahte paket",
       "en": "A low-TTL fake packet the DPI sees but the server never receives"
      }
     ],
     [
      {
       "tr": "4 · Birleşik",
       "en": "4 · Combined"
      },
      {
       "tr": "Parçalama ve desync birlikte",
       "en": "Fragmentation and desync together"
      }
     ]
    ]
   },
   {
    "h": {
     "tr": "Arka planda, tepside",
     "en": "In the background, in the tray"
    },
    "p": [
     {
      "tr": "Konsol penceresini kapatmak uygulamayı kapatmaz: tepside çalışmaya devam eder ve aynı anda tek kopya açılır. İstenirse Windows'a girişte konsol açmadan, her seferinde UAC sormadan (Görev Zamanlayıcı ile) başlar ve son durumu hatırlar. Açılışta GitHub'a tek bir anonim istekle yeni sürüm var mı diye bakar; bunun dışında hiçbir yere veri göndermez.",
      "en": "Closing the console window doesn't quit the app: it keeps running in the tray, and only one copy runs at a time. If you want, it starts when you sign in to Windows, without a console window and without a UAC prompt each time (via Task Scheduler), and remembers its last state. At startup it makes one anonymous request to GitHub to check for a new version; apart from that it sends data nowhere."
     }
    ],
    "diagram": "╭──────────────────┬────────┬─────────┬──────────────┬────────┬───────────╮\n│ Teknik           │ Paket  │ Discord │ Değiştirilen │ Veri   │ Hız       │\n├──────────────────┼────────┼─────────┼──────────────┼────────┼───────────┤\n│ TcpFragmentation │ 1.2K   │ 45      │ 45           │ 2.1 MB │ 150 pkt/s │\n╰──────────────────┴────────┴─────────┴──────────────┴────────┴───────────╯\n╭ Durum ────────────────────────────────────────────────────────────────╮\n│ TLS -> gateway.discord.gg                                             │\n╰───────────────────────────────────────────────────────────────────────╯"
   },
   {
    "h": {
     "tr": "Güven",
     "en": "Trust"
    },
    "p": [
     {
      "tr": "Kod imzası yok. Windows 11'de Akıllı Uygulama Denetimi açıksa çalışmaz ve sırf bunun için kapatılmasını önermiyoruz; README nedenini ve sonuçlarını anlatıyor. Her yayında dosyaların SHA-256 değerleri var; isteyen kaynak koddan kendisi derleyebilir.",
      "en": "It isn't code-signed. If Smart App Control is on in Windows 11 it won't run, and we don't recommend turning it off just for this; the README explains why and what it means. Every release lists SHA-256 checksums, and anyone can build it from source."
     }
    ]
   }
  ],
  "stack": [
   [
    {
     "tr": "Dil",
     "en": "Language"
    },
    {
     "tr": "C#, .NET 10 (runtime pakette)",
     "en": "C#, .NET 10 (runtime bundled)"
    }
   ],
   [
    {
     "tr": "Paket yakalama",
     "en": "Packet capture"
    },
    "WinDivert"
   ],
   [
    {
     "tr": "Konsol",
     "en": "Console"
    },
    "Spectre.Console"
   ],
   [
    {
     "tr": "Dağıtım",
     "en": "Distribution"
    },
    {
     "tr": "Inno Setup kurulumu, taşınabilir ZIP",
     "en": "Inno Setup installer, portable ZIP"
    }
   ],
   [
    "CI",
    "GitHub Actions"
   ]
  ],
  "links": [
   [
    {
     "tr": "İndir",
     "en": "Download"
    },
    "https://github.com/umitkrkmz/ZeroDivert/releases/latest"
   ]
  ],
  "theme": "#7289da",
  "gen": "packets",
  "nums": [
   [
    "4",
    {
     "tr": "teknik, sırayla",
     "en": "techniques, in order"
    }
   ],
   [
    "5",
    {
     "tr": "ardışık başarıda kalibrasyon",
     "en": "successes to calibrate"
    }
   ],
   [
    "0",
    {
     "tr": "VPN, hız kaybı",
     "en": "VPN, speed loss"
    }
   ]
  ],
  "related": [
   [
    "limbo",
    {
     "tr": "İkisi de WinDivert ile DPI aşıyor: Limbo her site için ayrı strateji, ZeroDivert yalnızca Discord.",
     "en": "Both bypass DPI with WinDivert: Limbo with a strategy per site, ZeroDivert for Discord only."
    }
   ]
  ]
 },
 "ui2py": {
  "lead": {
   "tr": "Qt Designer'da çizilen .ui dosyalarını tek tıkla PySide6 Python koduna çeviren küçük bir masaüstü aracı. Komut satırındaki pyside6-uic'in üstüne bir arayüz: toplu dönüştürme, sürükle bırak, sanal ortam algılama, açık ve koyu tema.",
   "en": "A small desktop tool that turns .ui files drawn in Qt Designer into PySide6 Python code in one click. A GUI on top of the command-line pyside6-uic: batch conversion, drag and drop, virtual environment detection, light and dark themes."
  },
  "facts": [
   [
    {
     "tr": "Son sürüm",
     "en": "Latest release"
    },
    "",
    "release"
   ],
   [
    {
     "tr": "Çalıştığı yer",
     "en": "Runs on"
    },
    "Windows, macOS, Linux"
   ],
   [
    {
     "tr": "Dil",
     "en": "Language"
    },
    "Python 3.11+, PySide6"
   ],
   [
    {
     "tr": "Lisans",
     "en": "License"
    },
    "MIT"
   ]
  ],
  "sections": [
   {
    "h": {
     "tr": "Neden",
     "en": "Why"
    },
    "p": [
     {
      "tr": "PySide6 projelerinde her .ui değişikliğinde terminale dönüp pyside6-uic komutunu doğru yollarla yazmak gerekiyor. ui2py bunu bir pencereye indiriyor: dosyayı bırak, Dönüştür'e bas.",
      "en": "In PySide6 projects, every .ui change means going back to the terminal and typing the pyside6-uic command with the right paths. ui2py brings it down to one window: drop the file, press Convert."
     }
    ],
    "img": [
     "img/ui2py/main-empty.webp",
     {
      "tr": "Ana pencere",
      "en": "The main window"
     },
     "fit"
    ]
   },
   {
    "h": {
     "tr": "Toplu dönüştürme",
     "en": "Batch conversion"
    },
    "p": [
     {
      "tr": "Birden çok .ui dosyası aynı anda bırakılabilir; her biri ui_<ad>.py olarak kaydedilir. Tek dosyada çıktı adı düzenlenebilir, hedef klasör seçilebilir; yalnızca .ui dosyaları işlenir, listeden dosya çıkarılabilir.",
      "en": "Several .ui files can be dropped at once, and each is saved as ui_<name>.py. For a single file the output name can be edited and the target folder chosen; only .ui files are processed, and files can be removed from the list."
     }
    ],
    "imgs": [
     [
      "img/ui2py/multi-files.webp",
      {
       "tr": "Yedi dosya bırakıldı",
       "en": "Seven files dropped"
      },
      "fit"
     ],
     [
      "img/ui2py/conversion-done.webp",
      {
       "tr": "Dönüştürme tamam",
       "en": "Conversion done"
      },
      "fit"
     ]
    ]
   },
   {
    "h": {
     "tr": "Doğru derleyici",
     "en": "The right compiler"
    },
    "p": [
     {
      "tr": "Araç kendi derleyicisini getirmez, sistemdeki ya da sanal ortamdaki pyside6-uic'i kullanır; böylece üretilen kod senin PySide6 sürümünle uyumlu olur. (i) düğmesine tıklayınca ortamın durumu görünür, sağ tıklayınca bir venv'deki derleyici seçilir. Tema, sistemin açık ya da koyu ayarını anında izler.",
      "en": "The tool doesn't ship its own compiler; it uses the pyside6-uic on your system or in your virtual environment, so the generated code matches your PySide6 version. Clicking the (i) button shows the environment status, and right-clicking picks a compiler from a venv. The theme follows the system's light or dark setting in real time."
     }
    ],
    "img": [
     "img/ui2py/env-status.webp",
     {
      "tr": "Ortam durumu ve derleyici seçimi",
      "en": "Environment status and compiler choice"
     },
     "fit"
    ]
   },
   {
    "h": {
     "tr": "Çalıştır",
     "en": "Run it"
    },
    "p": [
     {
      "tr": "Windows için hazır ui2py.exe Releases'te; dönüştürme için yine sistemde PySide6 kurulu olmalı. Kaynaktan:",
      "en": "A ready-made ui2py.exe for Windows is on the Releases page; PySide6 still needs to be installed for the conversion. From source:"
     }
    ],
    "code": "pip install PySide6\ngit clone https://github.com/umitkrkmz/ui2py-pyside6.git\ncd ui2py-pyside6\npython ui2py.py"
   }
  ],
  "stack": [
   [
    {
     "tr": "Dil",
     "en": "Language"
    },
    "Python 3.11+"
   ],
   [
    {
     "tr": "Arayüz",
     "en": "Interface"
    },
    "PySide6 (Qt 6), QSS"
   ],
   [
    {
     "tr": "Derleyici",
     "en": "Compiler"
    },
    "pyside6-uic"
   ]
  ],
  "links": [
   [
    {
     "tr": "İndir",
     "en": "Download"
    },
    "https://github.com/umitkrkmz/ui2py-pyside6/releases/latest"
   ]
  ],
  "theme": "#41cd52",
  "gen": "uic",
  "nums": [
   [
    "1",
    {
     "tr": "tıkla dönüştürme",
     "en": "click to convert"
    }
   ],
   [
    {
     "tr": "Toplu",
     "en": "Batch"
    },
    {
     "tr": "dönüştürme",
     "en": "conversion"
    }
   ],
   [
    "venv",
    {
     "tr": "derleyici seçimi",
     "en": "compiler choice"
    }
   ]
  ],
  "related": [
   [
    "stegotester",
    {
     "tr": "StegoTester'ın PySide6 arayüzü, ui2py'nin çözdüğü iş akışıyla yazıldı.",
     "en": "StegoTester's PySide6 interface was built with the workflow ui2py solves."
    }
   ],
   [
    "chaotic-audio",
    {
     "tr": "Aynı PySide6 ve Qt Designer iş akışı.",
     "en": "The same PySide6 and Qt Designer workflow."
    }
   ]
  ]
 }
};
for (const p of (P && P.projects) || []) if (p.slug && D[p.slug]) p.detail = D[p.slug];
})(window.PORTFOLIO);
