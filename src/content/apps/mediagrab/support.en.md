---
appSlug: mediagrab
docType: support
lang: en
title: MediaGrab — Support & Troubleshooting
description: Contact channels, getting started guide, Microsoft Store notes, and troubleshooting for MediaGrab.
lastUpdated: "2026-11-24"
---

## Contact

MediaGrab is built by an independent developer; I read every message and reply as soon as I can. Inside the app, *Settings → Feedback → Help & Support* and the *About* page link directly to the login-free [GitHub support page (`SUPPORT.md`)](https://github.com/umitkrkmz/mediagrab/blob/master/SUPPORT.md).

| Topic | Where |
|---|---|
| Questions, problems, ideas, purchases | Email: [zeynelumitkorkmaz@gmail.com](mailto:zeynelumitkorkmaz@gmail.com?subject=MediaGrab) |
| Public issue reports | [github.com/umitkrkmz/mediagrab/issues](https://github.com/umitkrkmz/mediagrab/issues) |
| Security disclosures | Please report privately by email rather than opening a public issue |

When writing, it helps to include the output from *Settings → Feedback → **Copy diagnostic info*** (MediaGrab, `yt-dlp`, and Windows versions plus install type; no file paths, IP addresses, or cookies), what you did, what happened, a screenshot if helpful, and the link if the issue affects a specific video. **Never send your `cookies.txt` file;** it grants access to your account.

## Getting started & downloading

* **Opening it:** Launch MediaGrab from the Start menu. It opens in your default browser at `http://127.0.0.1:8420`—there is no separate desktop window.
* **Notification area:** While running, a blue **M** icon sits next to the clock (on Windows 11 it may be under the `^` chevron). Click it to reopen the page, or right-click → **Quit MediaGrab** to stop the app. Closing the browser tab does not stop MediaGrab.
* **Downloading & folders:** Paste any link on the home page (1700+ sites supported) and pick **Best Audio**, **Best Video**, or a specific quality, subtitle, or transcript. Files are saved by default under `Downloads\MediaGrab` grouped by channel (configurable in *Settings → Download Settings*).
* **Using from your phone:** In *Settings → Remote Access*, set a password, turn on local network access, and scan the QR code on the same Wi-Fi network. Connections use plain HTTP—use only on a trusted home or office network.

## Microsoft Store version

* **Updates:** MediaGrab and its bundled `yt-dlp` engine are updated through Microsoft Store. If a site stops working, check *Microsoft Store → Library → Get updates*. By Store policy, `yt-dlp` is not updated separately inside the app.
* **Uninstalling & backups:** Uninstalling removes your settings and followed channels, while **your downloaded files remain intact.** Export your settings first under *Settings → Backup* and import them back after reinstalling.
* **Another PC:** Your purchase is tied to your Microsoft account and can be reinstalled from the Store on another Windows PC. The identical open-source build stays free [on GitHub](https://github.com/umitkrkmz/mediagrab).

## Troubleshooting

* **MediaGrab does not open or the page fails to load:** Look for the blue **M** icon in the notification area—click it or open `http://127.0.0.1:8420`. If the icon is not there, start MediaGrab again from the Start menu.
* **A video does not download or stops halfway:** Get the latest update from Microsoft Store (*Library → Get updates*). On GitHub/source installs, update from Settings or run `pip install -U "yt-dlp[default,deno]"`. If it persists, email the video link and diagnostic info.
* **Age-restricted, members-only, or sign-in-only videos:** Follow the *Settings → Cookies* link under the error message to configure cookies.
* **“DRM” error:** Copy-protected (DRM) content from paid streaming services cannot legally be downloaded; MediaGrab does not bypass DRM.
* **Quality names differ from the site (e.g., `1020p`):** MediaGrab reports each stream’s real height and displays a short note below the list when a video uses non-standard dimensions.
* **Phone cannot connect:** Verify both devices are on the same network and *Remote Access* is enabled. Because `mediagrab.local` does not resolve reliably on some phones (especially Android), use the **IP address** or QR code shown in the panel. Long-press the link box and pick **Paste** on mobile.
* **Forgot remote access password:** Follow the reset steps in the [Remote Access guide](https://github.com/umitkrkmz/mediagrab/blob/master/docs/README.en.md#remote-access-from-your-local-network).
