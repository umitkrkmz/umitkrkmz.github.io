export type Locale = 'tr' | 'en';

export interface StackGroup {
  category: string;
  items: string[];
}

export interface SiteLocaleData {
  title: string;
  tagline: string;
  location: string;
  roleSummary: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutIntro: string;
  aboutDetails: string[];
  education: {
    school: string;
    degree: string;
    period: string;
    location: string;
    focus: string;
  };
  publication: {
    title: string;
    authors: string;
    journal: string;
    year: string;
    volumeIssuePages: string;
    doi: string;
    doiUrl: string;
    summary: string;
  };
  stack: StackGroup[];
}

export const SITE_OWNER = {
  fullName: 'Zeynel Ümit Korkmaz',
  handle: 'umitkrkmz',
  email: 'zeynelumitkorkmaz@gmail.com',
  siteUrl: 'https://umitkrkmz.github.io',
  links: {
    github: 'https://github.com/umitkrkmz',
    linkedin: 'https://www.linkedin.com/in/zeynel-umit-korkmaz',
    orcid: 'https://orcid.org/0009-0001-5787-9859',
    sponsor: 'https://github.com/sponsors/umitkrkmz',
  },
} as const;

export const SITE_DATA: Record<Locale, SiteLocaleData> = {
  tr: {
    title: 'Zeynel Ümit Korkmaz',
    tagline: 'Bilgisayar Mühendisi · Ankara · .NET ve Python',
    location: 'Ankara, Türkiye',
    roleSummary: 'Bilgisayar Mühendisi · Windows Uygulamaları, .NET ve Python',
    heroEyebrow: 'Bilgisayar Mühendisi · Ankara',
    heroTitle: 'Sade masaüstü araçları ve mühendislik projeleri.',
    heroSubtitle:
      'Bağımsız olarak geliştirdiğim Windows uygulamalarını; .NET, Python ve yapay zekâ alanındaki çalışmalarımı burada topluyorum.',
    aboutIntro:
      'Kullanıcı verisini cihazda tutan, sade ve güvenilir masaüstü yazılımları ile ölçülebilir mühendislik araçları tasarlıyorum.',
    aboutDetails: [
      'Microsoft Store üzerinde yayımlanan Windows uygulamaları geliştiriyorum: açık kaynaklı MediaGrab ve QRPeek’in yanında, kapalı kaynaklı ve tamamen çevrimdışı çalışan TablePeek ile FolioPeek üzerinde çalışıyorum.',
      'Backend ve kurumsal yazılım tarafında .NET / ASP.NET Core, Clean Architecture ve CQRS mimarileriyle; araştırma tarafında ise Python, sayısal hesaplama ve yapay zekâ ajanlarının güvenilirliği üzerine üretiyorum.',
    ],
    education: {
      school: 'Kırıkkale Üniversitesi',
      degree: 'Bilgisayar Mühendisliği (Lisans)',
      period: '2020 – 2025',
      location: 'Kırıkkale, Türkiye',
      focus:
        'Yazılım mimarisi, sistem programlama, bilgi güvenliği ve yapay zekâ sistemleri üzerine odaklandı; lisans araştırmasını uluslararası hakemli dergi yayınına dönüştürdü.',
    },
    publication: {
      title: 'Secure Audio Steganography Using Vectorized LSB and Chaos-Based Encryption',
      authors: 'Korkmaz, Z. Ü., Horasan, F., & Çetinkaya, Z.',
      journal: 'Electrical Engineering and Energy',
      year: '2025',
      volumeIssuePages: '4(3), 68–86',
      doi: '10.64470/elene.2025.12',
      doiUrl: 'https://doi.org/10.64470/elene.2025.12',
      summary:
        '7 kaotik harita ve NumPy tabanlı vektörleştirilmiş LSB gömme yaklaşımıyla 100 dB üzeri PSNR sağlayan ses steganografisi çalışması.',
    },
    stack: [
      {
        category: 'Masaüstü ve Windows',
        items: ['.NET / WPF', 'Win32 & MSIX', 'Windows.Media.Ocr', 'Windows.Data.Pdf', 'PySide6 / Qt'],
      },
      {
        category: 'Backend ve Mimari',
        items: ['C# / ASP.NET Core', 'Entity Framework Core', 'Clean Architecture', 'MediatR (CQRS)', 'SignalR & Hangfire', 'SQL Server'],
      },
      {
        category: 'Python ve Yapay Zekâ',
        items: ['Python (Stdlib & NumPy)', 'Yerel RAG (Ollama)', 'MCP (Model Context Protocol)', 'AST Analizi & Mutasyon Testi'],
      },
      {
        category: 'Web ve Araçlar',
        items: ['TypeScript & JavaScript', 'HTML5 / CSS3', 'Astro & Tailwind CSS', 'Docker & GitHub Actions'],
      },
    ],
  },
  en: {
    title: 'Zeynel Ümit Korkmaz',
    tagline: 'Computer Engineer · Ankara · .NET & Python',
    location: 'Ankara, Türkiye',
    roleSummary: 'Computer Engineer · Windows Apps, .NET & Python',
    heroEyebrow: 'Computer Engineer · Ankara',
    heroTitle: 'Simple desktop tools and engineering projects.',
    heroSubtitle:
      'A home for my independent Windows apps alongside my work in .NET, Python, and AI engineering.',
    aboutIntro:
      'I design straightforward, dependable desktop software that keeps user data on the device, alongside verifiable engineering tools.',
    aboutDetails: [
      'I publish Windows desktop applications on the Microsoft Store—from open-source tools like MediaGrab and QRPeek to closed-source, strictly offline utilities like TablePeek and FolioPeek.',
      'On the backend and engineering side, I work with .NET / ASP.NET Core, Clean Architecture, and CQRS; on the research side, I focus on Python, scientific computing, and deterministic guardrails for AI coding agents.',
    ],
    education: {
      school: 'Kırıkkale University',
      degree: 'B.Sc. in Computer Engineering',
      period: '2020 – 2025',
      location: 'Kırıkkale, Türkiye',
      focus:
        'Focused on software architecture, systems programming, information security, and AI engineering; turned undergraduate research into an international peer-reviewed journal publication.',
    },
    publication: {
      title: 'Secure Audio Steganography Using Vectorized LSB and Chaos-Based Encryption',
      authors: 'Korkmaz, Z. Ü., Horasan, F., & Çetinkaya, Z.',
      journal: 'Electrical Engineering and Energy',
      year: '2025',
      volumeIssuePages: '4(3), 68–86',
      doi: '10.64470/elene.2025.12',
      doiUrl: 'https://doi.org/10.64470/elene.2025.12',
      summary:
        'Audio steganography combining seven chaotic maps with NumPy vectorized LSB embedding, achieving imperceptibility above 100 dB PSNR.',
    },
    stack: [
      {
        category: 'Desktop & Windows',
        items: ['.NET / WPF', 'Win32 & MSIX', 'Windows.Media.Ocr', 'Windows.Data.Pdf', 'PySide6 / Qt'],
      },
      {
        category: 'Backend & Architecture',
        items: ['C# / ASP.NET Core', 'Entity Framework Core', 'Clean Architecture', 'MediatR (CQRS)', 'SignalR & Hangfire', 'SQL Server'],
      },
      {
        category: 'Python & AI Systems',
        items: ['Python (Stdlib & NumPy)', 'Local RAG (Ollama)', 'MCP (Model Context Protocol)', 'AST Checks & Mutation Testing'],
      },
      {
        category: 'Web & Delivery',
        items: ['TypeScript & JavaScript', 'HTML5 / CSS3', 'Astro & Tailwind CSS', 'Docker & GitHub Actions'],
      },
    ],
  },
};
