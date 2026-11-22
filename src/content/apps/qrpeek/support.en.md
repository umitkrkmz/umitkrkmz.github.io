---
appSlug: qrpeek
docType: support
lang: en
title: QRPeek — Support & Shortcuts
description: Contact channels, keyboard shortcuts, local phone transfers, and known limitations for QRPeek.
lastUpdated: "2026-11-12"
---

## Contact & bug reports

| Topic | Where |
|---|---|
| Questions, ideas, Store support | Email: [zeynelumitkorkmaz@gmail.com](mailto:zeynelumitkorkmaz@gmail.com?subject=QRPeek) |
| Public bug reports & requests | [github.com/umitkrkmz/qrpeek/issues](https://github.com/umitkrkmz/qrpeek/issues/new/choose) |
| Security disclosures | Report privately by email instead of opening a public issue |

## Key shortcuts & features

| Shortcut | Action |
|---|---|
| `Ctrl + Alt + Q` *(configurable)* | Scan all monitors for QR codes; freeze screen to pick an area if none found |
| `Ctrl + Alt + W` *(configurable)* | Send clipboard text or files to your phone |
| `Ctrl + V` / Drag & drop | Read QR codes or text/receipts from an image |

* **Receive from phone:** Open **Receive from phone** from the tray menu or send window and scan the QR on your phone or tablet. Your phone sends the file list first; nothing is saved until you click **Accept** on the PC.
* **Receipt card & custom labels:** When a selected region has no QR code, Windows OCR reads the text. You can add invoice labels for additional languages under *Settings → Text recognition → Receipt terms*.

## Known limitations

* Optical character recognition is not infallible; characters like `1` / `I` or tiny symbols may need quick verification, so all receipt fields remain directly editable.
* When a receipt layout is unfamiliar, QRPeek leaves uncertain fields blank rather than guessing; the complete raw text is always available in the second tab.
* Built CPU-independent for ARM64 Windows 11 devices; please report any device-specific issues.
