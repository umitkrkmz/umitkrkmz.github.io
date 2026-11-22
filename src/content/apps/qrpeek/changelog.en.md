---
appSlug: qrpeek
docType: changelog
lang: en
title: QRPeek — Release Notes
description: Notable changes and fixes across QRPeek releases.
lastUpdated: "2026-11-12"
---

## v0.3.0 — 2026-11-12

### New

* **No QR? Read text and receipts:** If the selected area or image has no QR code, built-in Windows OCR reads the text locally and turns receipts and invoices into an editable card with pickable fields (summary, Excel, CSV, or summary QR).
* **Receipt term dictionary:** Built-in Turkish and English invoice labels plus customizable terms under *Settings → Text recognition* with `.txt` import/export.
* **Sectioned Settings window:** Organized into Shortcuts, General, Language, Text recognition, and About, sized to fit cleanly on every display.

### Fixed

* *Show real destination* now reports explicitly when a site blocks automated redirect checks (e.g. HTTP 403) instead of claiming no redirects exist.

## v0.2.0 — 2026-11-11

* **Receive from phone:** Receive photos and files from a phone or tablet over your local network without installing any mobile app, protected by a 4-digit match code, explicit PC approval, and 10-minute idle timeout.
* **Multi-monitor indicator:** Result cards indicate which monitor a code came from, verified across mixed-DPI displays.

## v0.1.0 — 2026-11-11

* Initial release: global `Ctrl + Alt + Q` screen scanning, dense e-invoice grid decoder, link safety card, one-click Wi-Fi join, masked 2FA handling, `Ctrl + Alt + W` send to phone, and a live-verified QR code generator with logos.
