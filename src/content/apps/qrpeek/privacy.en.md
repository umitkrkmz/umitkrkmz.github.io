---
appSlug: qrpeek
docType: privacy
lang: en
title: QRPeek — Privacy Policy
description: QRPeek has no account, ads, or telemetry; screen captures are processed in memory only.
lastUpdated: "2026-11-12"
---

## In short

* **No account, no telemetry, no ads, no analytics.** QRPeek has no server operated by the developer and sends none of your data anywhere.
* Screen captures are processed in memory only; **they are never saved or uploaded.**
* Text in an area without a QR code is read on this PC only via built-in Windows OCR. Recognized text is not added to history and is not copied unless you click *Copy text*.
* All data remains **on your device**.

## Screen, clipboard, and local data

* **Scan screen / Select area:** When triggered, QRPeek captures the screen, decodes QR codes in memory, and discards the image immediately.
* **Watch mode** *(off by default)*: Checks the screen every 1.5 seconds on this PC only; no images are retained.
* **Clipboard:** Wi-Fi passwords and 2FA keys are **never auto-copied**; when copied manually, they are flagged to stay out of Windows clipboard history (`Win + V`) and cloud sync.
* **`%LOCALAPPDATA%\QRPeek` folder:** Stores only settings (`settings.json`), optional custom receipt labels (`terms.txt`), optional last-100 scan history (`history.json` — **2FA codes are never written; Wi-Fi entries omit passwords**), and a technical error log (`error.log`) when needed. In the Microsoft Store version, uninstalling the app removes this folder.

## Network connections

QRPeek never goes online on its own. Network access occurs only when you trigger it:

* **Show real destination:** Sends a cookie-free check to resolve a shortened URL only when clicked.
* **Open link:** Opens the URL in your default browser only on your click.
* **Version check (GitHub build only):** Checks `api.github.com` at most once per day (can be disabled). The Microsoft Store version does not perform this check.
* **Send to phone / Receive from phone:** Runs **strictly over your local network** via an unguessable one-off URL valid for up to 10 minutes, never exposed to the internet.
* **Connect to Wi-Fi:** On Windows 11 (24H2+), Windows may prompt for location permission to confirm Wi-Fi state; QRPeek never reads, stores, or transmits your location.

## Sharing, children, and contact

The developer collects and shares no data; Microsoft handles Store purchases. QRPeek is not directed at children and does not knowingly collect personal information. Questions: [zeynelumitkorkmaz@gmail.com](mailto:zeynelumitkorkmaz@gmail.com?subject=QRPeek) or [GitHub Issues](https://github.com/umitkrkmz/qrpeek/issues/new/choose).
