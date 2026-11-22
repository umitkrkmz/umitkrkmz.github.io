---
appSlug: tablepeek
docType: support
lang: en
title: TablePeek — Support & Usage Tips
description: Contact channels, Windows OCR language pack setup, keyboard shortcuts, and tips for TablePeek.
lastUpdated: "2026-11-14"
---

## Contact & problem reports

| Topic | Where |
|---|---|
| Questions, ideas, purchase help | Email: [zeynelumitkorkmaz@gmail.com](mailto:zeynelumitkorkmaz@gmail.com?subject=TablePeek) |
| Public bug reports & feature requests | [github.com/umitkrkmz/tablepeek/issues](https://github.com/umitkrkmz/tablepeek/issues/new/choose) |

When reporting a misread table, attaching a sample screenshot **without personal data** along with your Windows version helps reproduce and fix it quickly.

## Windows OCR language packs

TablePeek relies on Windows’ built-in text recognition. **Settings → Text recognition** shows which languages are installed. To add a missing language:

1. Click **Open Windows language settings** (*Settings → Time & language → Language & region*).
2. Click **Add a language** if it is not yet listed.
3. Open **⋯ → Language options → Optical character recognition → Download**.
4. Return to TablePeek and click **Check again**.

## Keyboard shortcuts

| Context | Shortcut | Action |
|---|---|---|
| Anywhere | `Ctrl + Alt + Shift + T` *(configurable)* | Capture a table |
| Selecting region | `Esc` | Cancel |
| Main window | `Ctrl + V` | Read image from clipboard |
| Studio | `Ctrl + Z` / `Ctrl + Y` | Undo / Redo |
| Studio | `Delete` | Delete rows / clear cells |

## Tips for best recognition results

* **Small text:** Zooming in on screen (`Ctrl + +`) before capturing significantly improves accuracy.
* **Column borders:** If columns split imperfectly, drag, add, or remove the blue divider lines right over the image in the Studio.
* **Re-read a cell:** Right-click any uncertain cell and choose **Read this cell again**, or edit it inline.
* **Select only the table:** Keep surrounding toolbars or filter panels outside the box for cleaner rows and columns.
* **Turkish tables:** Installing the Turkish OCR pack ensures accurate `₺` symbols and Turkish characters.
