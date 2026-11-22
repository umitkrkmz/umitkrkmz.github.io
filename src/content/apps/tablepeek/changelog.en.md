---
appSlug: tablepeek
docType: changelog
lang: en
title: TablePeek — Release Notes
description: Notable changes and fixes across TablePeek releases.
lastUpdated: "2026-11-14"
---

## v0.1.1 — 2026-11-14

### Fixed

* Fixed an issue where thank-you add-ons bought on the Store page, on another PC, or redeemed with a code were not recognized immediately due to Windows’ cached licence lag. TablePeek now queries Microsoft Store ownership directly so colour themes and the supporter mark unlock immediately.

## v0.1.0 — 2026-11-14

Initial Microsoft Store release.

### Reading & Studio

* Capture tables via global shortcut (`Ctrl + Alt + Shift + T`), image file, clipboard image, or drag and drop—powered locally by Windows OCR.
* Supports bordered tables, borderless tables, and spreadsheet captures (automatically stripping row numbers and column letters).
* Automatic, Turkish, or English table language selection with fixes for common OCR confusions (`0/O`, `1/I`, separators, currency, and `%`).
* Studio editor with draggable column borders, single-cell re-read, merge, split, row/column insertion, and undo/redo.

### Excel export & app

* Copy for Excel as values only or formatted (fills, text colours, bold, alignment, borders, column widths, merged cells) with real numeric, currency, percentage, and date values.
* Save as `.xlsx` with a filtered Excel table and frozen header row, plus copy-directly mode.
* English/Turkish UI, light/dark themes, optional Start with Windows, OCR pack diagnostics, and optional cosmetic thank-you add-ons.
