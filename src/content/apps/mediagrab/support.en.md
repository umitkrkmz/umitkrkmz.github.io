---
appSlug: mediagrab
docType: support
lang: en
title: MediaGrab — Support & Troubleshooting
description: Contact channels and troubleshooting guidance for MediaGrab.
lastUpdated: "2026-11-14"
---

## Contact & bug reports

| Topic | Where |
|---|---|
| Questions, ideas, Store support | Email: [zeynelumitkorkmaz@gmail.com](mailto:zeynelumitkorkmaz@gmail.com?subject=MediaGrab) |
| Public bug reports & feature requests | [github.com/umitkrkmz/mediagrab/issues](https://github.com/umitkrkmz/mediagrab/issues/new/choose) |
| Security disclosures | Please report privately by email rather than opening a public issue |

## Common troubleshooting

* **MediaGrab does not open after installing on Windows:** Check the notification area near the clock for the blue **M** icon (on Windows 11 it may sit under the `^` chevron) and click it. If an error occurred, attach `%LOCALAPPDATA%\MediaGrab\mediagrab.log` to your report.
* **No “Paste from clipboard” button on mobile:** Browsers block clipboard reads over plain local HTTP (Remote Access). Long-press the URL field and choose **Paste**—MediaGrab still resolves the link automatically.
* **`mediagrab.local` does not open on Android:** `.local` mDNS resolution is unreliable in Android browsers. Use the direct IP address or QR code shown in *Settings → Remote Access*.
* **Age-restricted or sign-in-only videos fail:** Configure a browser cookie source or `cookies.txt` under *Settings → Cookies*.
* **“Unable to extract” errors:** Platforms update their layouts regularly. Microsoft Store updates deliver new `yt-dlp` builds automatically; on GitHub/source installs, update from Settings or run `pip install -U "yt-dlp[default,deno]"`.
