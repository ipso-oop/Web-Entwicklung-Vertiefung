# Wie die arc42-Dokumentation anzeigen?

## Option 1: In Cursor/VS Code (Empfohlen)

### Markdown-Vorschau öffnen:
1. **Tastenkombination:** `Strg + Shift + V` (Windows/Linux) oder `Cmd + Shift + V` (Mac)
2. **Oder:** Rechtsklick auf `arc42-dokumentation.md` → "Open Preview"
3. **Oder:** Klicke auf das Vorschau-Symbol oben rechts im Editor

### Seitenweise Vorschau:
- `Strg + K V` - Öffnet Vorschau neben dem Editor

## Option 2: Als HTML im Browser

### Automatisch generiert:
1. Öffne `arc42-dokumentation.html` im Browser
2. Die Datei wurde automatisch aus der Markdown-Datei generiert

### Manuell mit Online-Tools:
- [Markdown to HTML](https://www.markdowntohtml.com/)
- [Dillinger](https://dillinger.io/)
- [StackEdit](https://stackedit.io/)

## Option 3: Als PDF exportieren

### Mit VS Code Extension:
1. Installiere Extension "Markdown PDF"
2. Rechtsklick auf `arc42-dokumentation.md`
3. Wähle "Markdown PDF: Export (pdf)"

### Mit Online-Tools:
- [Markdown to PDF](https://www.markdowntopdf.com/)
- [Dillinger](https://dillinger.io/) → Export → PDF

### Mit Pandoc (Command Line):
```bash
pandoc arc42-dokumentation.md -o arc42-dokumentation.pdf
```

## Option 4: GitHub/GitLab

Wenn das Projekt in einem Git-Repository ist:
- GitHub/GitLab rendert Markdown automatisch schön
- Einfach die Datei im Repository öffnen

## Option 5: Markdown-Viewer Browser Extension

- **Chrome:** "Markdown Viewer"
- **Firefox:** "Markdown Viewer Webext"
- Öffne die `.md` Datei direkt im Browser

---

**Tipp:** Die einfachste Methode ist Option 1 - die eingebaute Vorschau in Cursor/VS Code!

