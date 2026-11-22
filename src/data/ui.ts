import type { Locale } from './site';

export interface UiStrings {
  nav: {
    apps: string;
    projects: string;
    about: string;
    contact: string;
    menuOpen: string;
    menuClose: string;
    skipToContent: string;
    primaryNavLabel: string;
    languageSwitchLabel: string;
  };
  appTabs: {
    overview: string;
    privacy: string;
    support: string;
    changelog: string;
    subNavLabel: string;
  };
  actions: {
    exploreApps: string;
    viewProjects: string;
    getFromStore: string;
    viewOnGithub: string;
    viewDocsOnGithub: string;
    readPaper: string;
    learnMore: string;
    allProjectsOnGithub: string;
    copyEmail: string;
    emailCopied: string;
    sponsorOnGithub: string;
  };
  sections: {
    storeAppsEyebrow: string;
    storeAppsTitle: string;
    storeAppsSubtitle: string;
    projectsEyebrow: string;
    projectsTitle: string;
    projectsSubtitle: string;
    engineeringCategory: string;
    aiCategory: string;
    appDirectoryTitle: string;
    appDirectorySubtitle: string;
    screenshotsTitle: string;
    featuresTitle: string;
    pricingTitle: string;
    requirementsTitle: string;
    faqTitle: string;
    contactTitle: string;
    educationTitle: string;
    publicationTitle: string;
    stackTitle: string;
    linksTitle: string;
  };
  badges: {
    openSource: string;
    closedSourceDocsOpen: string;
    offline: string;
    localFirst: string;
    peerReviewed: string;
    versionPrefix: string;
  };
  footer: {
    appsColumn: string;
    privacySupportColumn: string;
    engineeringColumn: string;
    contactColumn: string;
    privacyLabel: string;
    supportLabel: string;
    copyright: string;
    allProjects: string;
  };
}

export const UI_STRINGS: Record<Locale, UiStrings> = {
  tr: {
    nav: {
      apps: 'Uygulamalar',
      projects: 'Projeler',
      about: 'Hakkımda',
      contact: 'İletişim',
      menuOpen: 'Menüyü aç',
      menuClose: 'Menüyü kapat',
      skipToContent: 'Ana içeriğe geç',
      primaryNavLabel: 'Ana gezinme',
      languageSwitchLabel: 'Dil seçimi',
    },
    appTabs: {
      overview: 'Genel Bakış',
      privacy: 'Gizlilik',
      support: 'Destek',
      changelog: 'Sürüm Notları',
      subNavLabel: 'Uygulama sayfaları',
    },
    actions: {
      exploreApps: 'Uygulamaları İncele',
      viewProjects: 'Projeler',
      getFromStore: 'Microsoft Store’dan Edin',
      viewOnGithub: 'GitHub’da İncele',
      viewDocsOnGithub: 'Belgeler ve Sorun Bildirimi',
      readPaper: 'Makaleyi Oku (DOI)',
      learnMore: 'Ayrıntılar',
      allProjectsOnGithub: 'Tüm projelerim GitHub’da',
      copyEmail: 'E-postayı kopyala',
      emailCopied: 'Kopyalandı',
      sponsorOnGithub: 'GitHub Sponsors',
    },
    sections: {
      storeAppsEyebrow: 'Microsoft Store · Windows 10 & 11',
      storeAppsTitle: 'Windows Uygulamaları',
      storeAppsSubtitle: 'Hesap yok, reklam yok, telemetri yok. İşini sessizce ve kendi bilgisayarınızda yapan yerel araçlar.',
      projectsEyebrow: 'Mühendislik ve Yapay Zekâ',
      projectsTitle: 'Seçilmiş Projeler',
      projectsSubtitle: 'Mimari, akademik araştırma ve yapay zekâ mühendisliği alanındaki seçili çalışmalar.',
      engineeringCategory: 'Mühendislik ve Akademik',
      aiCategory: 'Yapay Zekâ Araştırma ve Mühendislik',
      appDirectoryTitle: 'Uygulama Dizini',
      appDirectorySubtitle: 'Her uygulama için tanıtım, gizlilik politikası, destek ve sürüm notlarına doğrudan erişin.',
      screenshotsTitle: 'Ekran Görüntüleri',
      featuresTitle: 'Öne Çıkan Özellikler',
      pricingTitle: 'Fiyatlandırma ve Sürümler',
      requirementsTitle: 'Sistem Gereksinimleri',
      faqTitle: 'Sık Sorulan Sorular',
      contactTitle: 'İletişim',
      educationTitle: 'Eğitim',
      publicationTitle: 'Hakemli Yayın',
      stackTitle: 'Teknik Yığın',
      linksTitle: 'Bağlantılar',
    },
    badges: {
      openSource: 'Açık Kaynak',
      closedSourceDocsOpen: 'Kapalı Kaynak · Belgeler Açık',
      offline: 'Tamamen Çevrimdışı',
      localFirst: 'Yerel Çalışır',
      peerReviewed: 'Hakemli Makale',
      versionPrefix: 'Sürüm',
    },
    footer: {
      appsColumn: 'Uygulamalar',
      privacySupportColumn: 'Gizlilik & Destek',
      engineeringColumn: 'Mühendislik',
      contactColumn: 'İletişim',
      privacyLabel: 'Gizlilik',
      supportLabel: 'Destek',
      copyright: '© 2026 Zeynel Ümit Korkmaz.',
      allProjects: 'Tüm Projeler',
    },
  },
  en: {
    nav: {
      apps: 'Apps',
      projects: 'Projects',
      about: 'About',
      contact: 'Contact',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
      skipToContent: 'Skip to main content',
      primaryNavLabel: 'Primary navigation',
      languageSwitchLabel: 'Language switcher',
    },
    appTabs: {
      overview: 'Overview',
      privacy: 'Privacy',
      support: 'Support',
      changelog: 'Changelog',
      subNavLabel: 'App pages',
    },
    actions: {
      exploreApps: 'Explore Apps',
      viewProjects: 'Projects',
      getFromStore: 'Get from Microsoft Store',
      viewOnGithub: 'View on GitHub',
      viewDocsOnGithub: 'Docs & Issue Tracker',
      readPaper: 'Read Paper (DOI)',
      learnMore: 'Learn more',
      allProjectsOnGithub: 'See all repositories on GitHub',
      copyEmail: 'Copy email',
      emailCopied: 'Copied',
      sponsorOnGithub: 'GitHub Sponsors',
    },
    sections: {
      storeAppsEyebrow: 'Microsoft Store · Windows 10 & 11',
      storeAppsTitle: 'Windows Applications',
      storeAppsSubtitle: 'No accounts, no ads, no telemetry. Local-first tools built to work quietly on your own PC.',
      projectsEyebrow: 'Engineering & AI',
      projectsTitle: 'Selected Projects',
      projectsSubtitle: 'Selected work across software architecture, peer-reviewed research, and AI systems engineering.',
      engineeringCategory: 'Engineering & Academic',
      aiCategory: 'AI Research & Engineering',
      appDirectoryTitle: 'App Directory',
      appDirectorySubtitle: 'Direct links to overview, privacy policy, support, and release notes for each app.',
      screenshotsTitle: 'Screenshots',
      featuresTitle: 'Key Features',
      pricingTitle: 'Pricing & Editions',
      requirementsTitle: 'System Requirements',
      faqTitle: 'Frequently Asked Questions',
      contactTitle: 'Contact',
      educationTitle: 'Education',
      publicationTitle: 'Peer-Reviewed Publication',
      stackTitle: 'Technical Stack',
      linksTitle: 'Links',
    },
    badges: {
      openSource: 'Open Source',
      closedSourceDocsOpen: 'Closed Source · Open Docs',
      offline: 'Fully Offline',
      localFirst: 'Local-First',
      peerReviewed: 'Peer-Reviewed',
      versionPrefix: 'Version',
    },
    footer: {
      appsColumn: 'Apps',
      privacySupportColumn: 'Privacy & Support',
      engineeringColumn: 'Engineering',
      contactColumn: 'Contact',
      privacyLabel: 'Privacy',
      supportLabel: 'Support',
      copyright: '© 2026 Zeynel Ümit Korkmaz.',
      allProjects: 'All Projects',
    },
  },
};

export function getLocalePath(locale: Locale, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const withTrailing = normalized.endsWith('/') ? normalized : `${normalized}/`;
  if (locale === 'en') {
    return withTrailing === '/' ? '/en/' : `/en${withTrailing}`;
  }
  return withTrailing;
}

export function getAlternatePath(currentPathname: string, targetLocale: Locale): string {
  let clean = currentPathname || '/';
  if (clean === '/404' || clean === '/404/' || clean === '/404.html') {
    return getLocalePath(targetLocale, '/');
  }
  if (!clean.startsWith('/')) clean = `/${clean}`;
  if (!clean.endsWith('/')) clean = `${clean}/`;

  const stripped = clean === '/en/' ? '/' : clean.startsWith('/en/') ? clean.slice(3) : clean;
  return getLocalePath(targetLocale, stripped);
}
