# PowerShell Script zum Rendern von PlantUML-Diagrammen
# Benötigt: Java und PlantUML.jar

$ErrorActionPreference = "Stop"

# PlantUML JAR Download URL
$plantUmlUrl = "https://github.com/plantuml/plantuml/releases/download/v1.2024.3/plantuml-1.2024.3.jar"
$plantUmlJar = "plantuml.jar"
$diagramsDir = "diagrams"
$imagesDir = "diagrams/images"

# Erstelle images Verzeichnis
if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force | Out-Null
    Write-Host "Erstellt Verzeichnis: $imagesDir" -ForegroundColor Green
}

# Prüfe ob PlantUML.jar existiert
if (-not (Test-Path $plantUmlJar)) {
    Write-Host "PlantUML.jar nicht gefunden. Lade herunter..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $plantUmlUrl -OutFile $plantUmlJar
        Write-Host "PlantUML.jar erfolgreich heruntergeladen." -ForegroundColor Green
    } catch {
        Write-Host "Fehler beim Herunterladen von PlantUML.jar: $_" -ForegroundColor Red
        Write-Host "Versuche Online-Rendering..." -ForegroundColor Yellow
        $useOnline = $true
    }
} else {
    Write-Host "PlantUML.jar gefunden." -ForegroundColor Green
    $useOnline = $false
}

# Funktion zum Rendern mit PlantUML.jar
function Render-WithPlantUML {
    param($pumlFile)
    
    $outputFile = Join-Path $imagesDir ([System.IO.Path]::GetFileNameWithoutExtension($pumlFile) + ".png")
    
    try {
        java -jar $plantUmlJar -tpng -o (Resolve-Path $imagesDir).Path $pumlFile
        if (Test-Path $outputFile) {
            Write-Host "  ✓ Gerendert: $outputFile" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "  ✗ Fehler: $_" -ForegroundColor Red
    }
    return $false
}

# Funktion zum Online-Rendering
function Render-Online {
    param($pumlFile)
    
    $pumlContent = Get-Content $pumlFile -Raw -Encoding UTF8
    $encoded = [System.Web.HttpUtility]::UrlEncode($pumlContent)
    $url = "http://www.plantuml.com/plantuml/png/$encoded"
    $outputFile = Join-Path $imagesDir ([System.IO.Path]::GetFileNameWithoutExtension($pumlFile) + ".png")
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $outputFile
        if (Test-Path $outputFile) {
            Write-Host "  ✓ Gerendert (Online): $outputFile" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "  ✗ Fehler (Online): $_" -ForegroundColor Red
    }
    return $false
}

# Rendere alle .puml Dateien
Write-Host "`nStarte Rendering der PlantUML-Diagramme..." -ForegroundColor Cyan

$pumlFiles = Get-ChildItem -Path $diagramsDir -Filter "*.puml" -Exclude "*.puml.bak"

foreach ($file in $pumlFiles) {
    Write-Host "`nVerarbeite: $($file.Name)" -ForegroundColor Yellow
    
    if (-not $useOnline) {
        $success = Render-WithPlantUML $file.FullName
        if (-not $success) {
            Write-Host "  Versuche Online-Rendering..." -ForegroundColor Yellow
            $success = Render-Online $file.FullName
        }
    } else {
        $success = Render-Online $file.FullName
    }
}

Write-Host "`nRendering abgeschlossen!" -ForegroundColor Green
Write-Host "Bilder gespeichert in: $imagesDir" -ForegroundColor Cyan

