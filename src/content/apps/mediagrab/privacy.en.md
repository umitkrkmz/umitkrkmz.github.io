---
appSlug: mediagrab
docType: privacy
lang: en
title: MediaGrab — Privacy Policy
description: MediaGrab runs locally on your own device with no account, ads, analytics, or telemetry.
lastUpdated: "2026-11-07"
---

## In short

* **No account, no telemetry, no ads, no analytics.** MediaGrab has no developer-operated server and sends none of your data to the developer.
* All data stays **on your device**. This policy covers the Microsoft Store, GitHub, and Docker editions.

## Data kept on your device

The app stores only what it needs in its local data folder:

* **Settings (`settings.json`):** Language, download folder, and quality preferences.
* **Followed channels (`channels.json`)** and **download statistics (`stats.json`)**.
* **Downloaded media files** and companion `.json` metadata files in your chosen folder.
* **Remote Access password (optional):** Stored only as a one-way `PBKDF2` hash; active sessions live in memory only.
* **Cookies (optional):** Used strictly for requests to the matching site and never sent elsewhere.

In the Microsoft Store version, app settings reside in the Windows app container and **are deleted on uninstall** (your downloaded media files remain in your chosen folder). You can back up settings from the Settings page.

## Network connections

* **Target media sites:** When resolving a URL or checking followed channels, MediaGrab connects to that site via `yt-dlp`. Those sites’ own privacy policies apply.
* **Version checks:** Sends non-personal version check requests to GitHub (`api.github.com`) and PyPI (`pypi.org`).
* **Local network (only when Remote Access is enabled):** Listens on your LAN and advertises via mDNS so devices on the same network can connect; never exposed to the public internet.

## Sharing, children, and contact

The developer collects and shares no data; Microsoft handles Store payments and licensing. MediaGrab is not directed at children and does not knowingly collect personal information. Questions: [zeynelumitkorkmaz@gmail.com](mailto:zeynelumitkorkmaz@gmail.com?subject=MediaGrab) or [GitHub Issues](https://github.com/umitkrkmz/mediagrab/issues/new/choose).
