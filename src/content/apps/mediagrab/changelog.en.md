---
appSlug: mediagrab
docType: changelog
lang: en
title: MediaGrab — Release Notes
description: Notable changes and fixes across MediaGrab releases.
lastUpdated: "2026-11-14"
---

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
