---
appSlug: mediagrab
docType: changelog
lang: en
title: MediaGrab — Release Notes
description: Notable changes and fixes across MediaGrab releases.
lastUpdated: "2026-11-24"
---

## v2.5.3 — 2026-11-24

Added a dedicated help and support page.

### Added

* **Help and support page (`SUPPORT.md`):** Bilingual Turkish and English guide covering direct email contact, getting started, downloading, phone access, Microsoft Store version notes, and troubleshooting. Readable without a GitHub account; linked directly from *Settings → Feedback → Help & Support* and the *About* page inside the app.

### Changed

* **Privacy policy contact:** Points directly to the email address on the support page instead of requiring a GitHub account for the issue form.

## v2.5.2 — 2026-11-24

Fixed long YouTube downloads stopping halfway.

### Fixed

* **Long YouTube HLS downloads:** Fixed HLS-only YouTube downloads stopping after a few minutes with `401 Unauthorized` and missing `.part-FragNN` errors caused by fetching four fragments concurrently. YouTube fragments are now downloaded one at a time; other sites are unaffected.

### Changed

* **Updated bundled components:** Updated to `yt-dlp 2026.11.23` and current Python dependencies across both the Windows installer and Microsoft Store builds.

## v2.5.1 — 2026-11-14

### Fixed

* **HLS downloads in the Microsoft Store edition:** Fixed a `Permission denied` error caused by Windows launching Store apps from read-only `C:\Windows\System32`; MediaGrab now switches to its own writable data directory on startup.

### Added

* **Non-standard resolution note:** The quality picker now explains cases where a video’s real height (e.g., `1020p`) differs from the platform’s standard label (`1080p`).
* Updated the bundled FFmpeg build.

## v2.5.0 — 2026-11-08

* **Microsoft Store edition:** Launched the MSIX Store release alongside the free GitHub build, with one-click install, no SmartScreen warning, and automatic updates.
* **Store mode & privacy policy:** Added read-only package detection for Store builds and published the bilingual privacy policy.
* **Remote Access adapter fix:** Fixed QR codes and LAN addresses picking virtual WSL/Hyper-V/Docker adapters instead of the real home network adapter.

## v2.4.0 — 2026-10-12

* **All-in-one Windows installer (`MediaGrabSetup.exe`):** Bundles Python, FFmpeg, and Deno with zero admin privileges required, plus a system tray **M** icon.
* **Configurable downloads folder & migration:** Safe download migration between folders, Docker install option, and bundled third-party license notices.
