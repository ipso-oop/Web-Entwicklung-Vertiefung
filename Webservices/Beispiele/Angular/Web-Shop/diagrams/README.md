# PlantUML Diagramme für arc42 Dokumentation

Dieses Verzeichnis enthält alle PlantUML-Diagramme für die arc42-Dokumentation des Web Shops.

## Diagramme

- **context-fachlich.puml** - Fachlicher Kontext (Komponenten und Akteure)
- **context-technisch.puml** - Technischer Kontext (Browser-Umgebung)
- **building-blocks-level1.puml** - Baustein-Sicht Level 1 (Schichtenarchitektur)
- **component-details.puml** - Detaillierte Komponenten-Übersicht mit Schnittstellen
- **runtime-add-to-cart.puml** - Sequenzdiagramm: Produkt zum Warenkorb hinzufügen
- **runtime-remove-from-cart.puml** - Sequenzdiagramm: Produkt aus Warenkorb entfernen
- **sequence-complete.puml** - Komplettes Sequenzdiagramm (Initial Load, Add, Remove)
- **deployment.puml** - Deployment-Architektur (Development & Production)
- **build-process.puml** - Build-Prozess (Activity Diagram)

## PlantUML anzeigen

### Option 1: VS Code / Cursor Extension

1. Installiere die Extension "PlantUML" (von jebbs)
2. Öffne eine `.puml` Datei
3. Drücke `Alt + D` oder klicke auf "Preview Current Diagram"

### Option 2: Online Viewer

- [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
- Kopiere den Inhalt einer `.puml` Datei und füge ihn ein

### Option 3: PlantUML Server lokal

```bash
# Mit Docker
docker run -d -p 8080:8080 plantuml/plantuml-server:jetty

# Dann im Browser: http://localhost:8080
```

### Option 4: Command Line (mit Java)

```bash
# PlantUML installieren (benötigt Java)
# Download von: https://plantuml.com/download

# Diagramm als PNG generieren
java -jar plantuml.jar diagrams/context-fachlich.puml

# Alle Diagramme generieren
java -jar plantuml.jar diagrams/*.puml
```

### Option 5: IntelliJ IDEA / WebStorm

- PlantUML Plugin installieren
- `.puml` Dateien werden automatisch gerendert

## Diagramme in Markdown einbinden

Die Diagramme sind bereits in `arc42-dokumentation.md` eingebunden. Sie werden automatisch gerendert, wenn:

- VS Code/Cursor mit PlantUML Extension verwendet wird
- Ein Markdown-Viewer mit PlantUML-Support verwendet wird
- Die Diagramme zu Bildern exportiert und in Markdown referenziert werden

## Export als Bilder

Um die Diagramme als PNG/SVG zu exportieren:

```bash
# Mit PlantUML CLI
java -jar plantuml.jar -tpng diagrams/*.puml
java -jar plantuml.jar -tsvg diagrams/*.puml

# Oder mit VS Code Extension:
# Rechtsklick auf Diagramm → "Export Current Diagram"
```

