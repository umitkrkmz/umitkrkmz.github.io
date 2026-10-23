/* ===== icons.js: telefonun SVG simgeleri (emoji her cihazda başka görünür). Çizgi simgeler 24'lük, currentColor; markalar dolgu.
   window.ICONS.svg(ad) ve window.ICONS.wx(tür, gündüz) ===== */
window.ICONS = (function () {
  const line = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const fill = d => `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${d}</svg>`;
  const CLOUD_HI = '<path d="M7 14a4 4 0 0 1-.6-8A6 6 0 0 1 18 5.5a4.3 4.3 0 0 1-.5 8.5z"/>';
  const I = {
    folder: line('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 10h18"/>'),
    user: line('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>'),
    chat: line('<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>'),
    trophy: line('<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4"/><path d="M12 13v4M8.5 20h7M10 17h4"/>'),
    map: line('<path d="m9 4-6 2.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>'),
    calendar: line('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M7.5 14h3v3h-3z"/>'),
    cat: line('<path d="M5 11 4 3l5 4h6l5-4-1 8"/><path d="M5 11c0 5 3 9 7 9s7-4 7-9"/><path d="M9.5 13.5h.01M14.5 13.5h.01M12 16l-1 1M12 16l1 1"/>'),
    news: line('<path d="M4 5h13v14H6a2 2 0 0 1-2-2z"/><path d="M17 9h3v8a2 2 0 0 1-2 2"/><path d="M7 9h7M7 13h7M7 16h4"/>'),
    mail: line('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    sponsor: line('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
    web: line('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
    lock: line('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    city: line('<path d="M3 21h18M5 21V10l5-3v14M10 21V4l6 3v14M16 21v-9l3 1.5V21"/>'),
    ball: line('<circle cx="12" cy="12" r="9"/><path d="m12 7 4 3-1.5 4.5h-5L8 10z"/><path d="M12 3v4M21 10.5l-5-.5M18 19l-3.5-4.5M6 19l3.5-4.5M3 10.5l5-.5"/>'),
    bell: line('<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>'),
    github: fill('<path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/>'),
    linkedin: fill('<path d="M20.4 20.5h-3.5v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5zM5.3 7.4a2 2 0 1 1 0-4.1 2 2 0 0 1 0 4.1zm1.8 13.1H3.6V9h3.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z"/>'),
    orcid: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="currentColor"/><text x="12" y="16.2" text-anchor="middle" font-size="10.5" font-weight="700" font-family="Arial, sans-serif" fill="var(--c, #6e9a1f)">iD</text></svg>`,
    /* hava */
    sun: line('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    moon: line('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'),
    cloud: line('<path d="M7 19a4 4 0 0 1-.6-8A6 6 0 0 1 18 10.5a4.3 4.3 0 0 1-.5 8.5z"/>'),
    partly: line('<path d="M8 2.5V4M3 7.5H1.5M4.5 4l1 1M11.5 4l-1 1"/><path d="M5.4 10A3.5 3.5 0 0 1 11.6 6.5"/><path d="M9 21a3.5 3.5 0 0 1-.5-7 5 5 0 0 1 9.6-.8A3.7 3.7 0 0 1 17.5 21z"/>'),
    partlyNight: line('<path d="M10.5 3.5a4 4 0 0 0 4.4 5A4.5 4.5 0 1 1 10.5 3.5z"/><path d="M9 21a3.5 3.5 0 0 1-.5-7 5 5 0 0 1 9.6-.8A3.7 3.7 0 0 1 17.5 21z"/>'),
    rain: line(CLOUD_HI + '<path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3"/>'),
    drizzle: line(CLOUD_HI + '<path d="M9 18v.5M13 19v.5M11 21.5v.5M15 21.5v.5"/>'),
    storm: line(CLOUD_HI + '<path d="M12.5 15l-2.5 3.5h3.5L11 22"/>'),
    snow: line(CLOUD_HI + '<path d="M8 18h.01M12 19h.01M16 18h.01M10 22h.01M14 22h.01"/>'),
    fog: line('<path d="M6 9a4 4 0 0 1 7.6-1.7A3.5 3.5 0 0 1 18 9"/><path d="M3 13h18M5 17h14M8 21h8"/>')
  };
  const svg = name => I[name] || I.web;
  const wx = (kind, day) => svg(kind === 'clear' ? (day ? 'sun' : 'moon') : kind === 'partly' ? (day ? 'partly' : 'partlyNight') : kind === 'overcast' ? 'cloud' : kind || 'cloud');
  return { svg, wx };
})();
