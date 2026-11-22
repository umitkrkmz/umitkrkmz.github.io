# umitkrkmz.github.io

Personal portfolio and Windows desktop applications showcase of **Zeynel Ümit Korkmaz**.

**Live Site:** [umitkrkmz.github.io](https://umitkrkmz.github.io/) (TR) · [umitkrkmz.github.io/en](https://umitkrkmz.github.io/en/) (EN)

---

## Featured Windows Apps

Published on the Microsoft Store for Windows 10 & 11 — local-first, no accounts, no ads, no telemetry:

- **FolioPeek** — Fast, offline PDF workspace for reading, annotating, signing, and organizing documents.
- **TablePeek** — Capture on-screen tables with a shortcut and paste cleanly into Excel.
- **QRPeek** — Read and generate QR codes directly from the screen without a phone or camera.
- **MediaGrab** — Personal video and audio archiver supporting 1,700+ sites.

## Architecture & Highlights

- **Framework:** [Astro](https://astro.build) static site generation (41 localized TR/EN pages).
- **Zero-JS Focus:** 0 KB client-side JavaScript on all 24 app documentation pages (`/privacy/`, `/support/`, `/changelog/`), `/apps/`, `/projects/`, and `/404`.
- **Pure CSS & SVG Pixel Art:** Synchronized 4-station footer workshop diorama and interactive Store badge mascot peek animations — built with crisp inline SVG and CSS `@keyframes`, respecting `prefers-reduced-motion`.
- **Deployment:** Automated build and deploy via GitHub Actions to GitHub Pages.

## Local Development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # Static build into ./dist
```

For adding a new Windows app and its localized documentation pages, see [`HOW_TO_ADD_APP.md`](./HOW_TO_ADD_APP.md).

---

© 2026 Zeynel Ümit Korkmaz. All rights reserved for personal content, branding, app screenshots, and custom pixel-art assets.