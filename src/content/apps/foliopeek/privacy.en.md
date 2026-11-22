---
appSlug: foliopeek
docType: privacy
lang: en
title: FolioPeek — Privacy Policy
description: FolioPeek runs strictly offline with no network capability, no accounts, no ads, and no telemetry.
lastUpdated: "2026-11-20"
---

## In short

* No account or sign-in required.
* No ads, tracking, analytics, or telemetry.
* No developer servers exist.
* FolioPeek **never connects to the internet**; the app package declares no network capability (`internetClient`).

## Your documents

* The PDFs you open are processed only on your PC, using Windows’ own PDF and text recognition components along with the libraries inside the app. No document content ever leaves your device.
* The open file is not changed unless you save. Files you save or export are written only where you choose. To prevent data loss, a temporary file is written first and replaces the target only after verification.
* **Signature:** A signature you create is not stored on your PC; it is kept in memory only while the app is open (*Use last signature*) and is cleared when you close the app. Once you place it in a document and save, it becomes part of that document.
* **Note author:** If you enter a name in Settings, it is written as the author of the notes you add and travels with the document you save. You can leave it empty.
* **Document properties:** Information such as title and author is read from the document itself. Values you edit or clear with Pro are written only to the new file you save.
* **Clipboard:** When you copy, the selected text or region goes only to the Windows clipboard.
* **Text recognition:** The text recognition language packs installed in Windows are used. For a missing pack, FolioPeek only opens Windows language settings.

## Data stored on your PC

All of it lives in `%LOCALAPPDATA%\FolioPeek`, on this PC only:

* **`settings.json` — settings:** Language, theme and accent colour, reading mode, zoom, note colours, and note author name; paths of recently opened documents and timestamps; optionally last page read and open tabs.
* **`license.dat` — Pro license cache:** If you bought the Pro add-on, its status is encrypted with the Windows Data Protection API (DPAPI) so the app can open as Pro offline too.
* **`error.log` — error log:** If an unexpected error occurs, only technical error details are written; document content is never logged.

You can clear the recent documents list in Settings. In the Microsoft Store version this folder belongs to the app and Windows removes it when you uninstall FolioPeek.

## In-app purchase

The one-time **Pro** add-on is purchased entirely through the Microsoft Store. Payment and card details are never shared with the developer. FolioPeek only asks Windows’ Store component for the add-on’s price and whether it is active for you.

## Links

The privacy policy and issue links in the app open in your default browser; links to Windows settings open in Windows Settings. A web link inside a PDF opens in your browser when you click it (after asking first, depending on your setting). External pages are governed by their own policies.

## Sharing and children

Because FolioPeek collects no data, no user or document data is shared with third parties. FolioPeek does not collect personal information from anyone, including children under 13.

## Changes and contact

This policy is updated whenever a new capability or data handling is added, and the date at the top is renewed. For questions, email [zeynelumitkorkmaz@gmail.com](mailto:zeynelumitkorkmaz@gmail.com?subject=FolioPeek) or use the [GitHub Issues](https://github.com/umitkrkmz/FolioPeek/issues) page.
