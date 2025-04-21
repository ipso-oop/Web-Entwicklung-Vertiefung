# Microservices-Architektur mit React Frontend

Dieses Projekt demonstriert eine moderne Microservices-Architektur mit einem React Frontend, einer REST-API und einem Benachrichtigungsservice, die über RabbitMQ kommunizieren.

## Systemarchitektur

Das System besteht aus drei Hauptkomponenten:

1. **React Frontend** (Port 3002)
   - Benutzeroberfläche für die Kontaktverwaltung
   - Implementiert in React mit modernen Hooks
   - Verwendet Bootstrap für das UI-Design

2. **REST API Service** (Port 3000)
   - Hauptbackend-Service für die Kontaktverwaltung
   - Implementiert in Node.js/Express
   - Bietet CRUD-Operationen für Kontakte
   - Swagger-Dokumentation verfügbar

3. **Notification Service** (Port 3001)
   - Verarbeitet asynchrone Benachrichtigungen
   - Empfängt Events über RabbitMQ
   - Implementiert in Node.js

4. **RabbitMQ Message Broker**
   - Ermöglicht asynchrone Kommunikation zwischen Services
   - Verarbeitet Events wie Kontakterstellung, -aktualisierung und -löschung

## Technologie-Stack

### Frontend
- React 18
- React Router v6 für Navigation
- Axios für HTTP-Requests
- Bootstrap 5 für UI-Komponenten
- Modern JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- RabbitMQ (amqplib)
- Swagger für API-Dokumentation

## Installation und Start

### Voraussetzungen
- Node.js (Version 14 oder höher)
- RabbitMQ Server
- npm oder yarn als Paketmanager

### RabbitMQ Installation
1. RabbitMQ Server installieren
2. Sicherstellen, dass RabbitMQ auf Port 5672 läuft

### Backend Services starten

1. **REST API Service starten:**
   ```bash
   node restServer.js
   ```
   Der Service läuft auf http://localhost:3000
   - Swagger-Dokumentation: http://localhost:3000/api-docs

2. **Notification Service starten:**
   ```bash
   node notificationService.js
   ```
   Der Service läuft auf http://localhost:3001

### Frontend starten

1. **In das Frontend-Verzeichnis wechseln:**
   ```bash
   cd frontend
   ```

2. **Dependencies installieren:**
   ```bash
   npm install
   ```

3. **Frontend starten:**
   ```bash
   npm start
   ```
   Die Anwendung läuft auf http://localhost:3002

## Frontend-Funktionalitäten

### Komponenten

1. **ContactList** (src/components/ContactList.js)
   - Zeigt alle Kontakte in einer Tabelle an
   - Implementiert Paginierung
   - Bietet Links zum Anzeigen und Bearbeiten von Kontakten
   - Zeigt Feedback-Nachrichten bei leerer Liste

2. **ContactForm** (src/components/ContactForm.js)
   - Formular zum Erstellen und Bearbeiten von Kontakten
   - Validierung der Eingabefelder
   - Responsives Design
   - Unterstützt Abbrechen-Aktion

3. **ContactDetails** (src/components/ContactDetails.js)
   - Detailansicht eines Kontakts
   - Optionen zum Bearbeiten und Löschen
   - Bestätigungsdialog beim Löschen

### Routing

- "/" - Hauptseite mit Kontaktliste
- "/contacts/new" - Neuen Kontakt erstellen
- "/contacts/:id" - Kontaktdetails anzeigen
- "/contacts/:id/edit" - Kontakt bearbeiten

## Backend-API-Endpunkte

### Kontakte

1. **GET /api/v1/contacts**
   - Liste aller Kontakte abrufen
   - Unterstützt Paginierung und Filterung
   - Query-Parameter:
     - page: Seitennummer
     - limit: Einträge pro Seite
     - lastName: Filter nach Nachname

2. **POST /api/v1/contacts**
   - Neuen Kontakt erstellen
   - Required Fields:
     - firstName
     - lastName
     - email

3. **GET /api/v1/contacts/:id**
   - Einzelnen Kontakt abrufen

4. **PUT /api/v1/contacts/:id**
   - Kontakt vollständig aktualisieren

5. **PATCH /api/v1/contacts/:id**
   - Kontakt teilweise aktualisieren

6. **DELETE /api/v1/contacts/:id**
   - Kontakt löschen

### Datenstruktur eines Kontakts

```javascript
{
  "id": number,
  "firstName": string,
  "lastName": string,
  "email": string,
  "phone": string (optional)
}
```

## Event-System

### RabbitMQ Events

1. **contact.created**
   - Ausgelöst wenn neuer Kontakt erstellt wird
   - Payload enthält kompletten Kontakt

2. **contact.updated**
   - Ausgelöst bei Kontaktaktualisierung
   - Payload enthält aktualisierten Kontakt

3. **contact.deleted**
   - Ausgelöst beim Löschen eines Kontakts
   - Payload enthält Kontakt-ID

## Fehlerbehandlung

### Frontend
- Anzeige von Ladezuständen
- Benutzerfreundliche Fehlermeldungen
- Validierung von Formulareingaben
- Bestätigungsdialoge für kritische Aktionen

### Backend
- Validierung aller Eingaben
- HTTP-Statuscodes für verschiedene Fehlerfälle
- Detaillierte Fehlermeldungen
- CORS-Konfiguration für Frontend-Zugriff

## Entwicklungshinweise

### Frontend-Entwicklung
1. Komponenten befinden sich in `src/components/`
2. API-Konfiguration in `src/config.js`
3. Routing-Logik in `App.js`

### Backend-Entwicklung
1. API-Routen in `restServer.js`
2. Event-Handling in `notificationService.js`
3. Message Bus Konfiguration in `messageBus.js`

## Debugging

### Frontend
- React Developer Tools im Browser
- Console.log Ausgaben für API-Responses
- Network Tab für API-Requests

### Backend
- Swagger UI für API-Tests
- Logging von HTTP-Requests
- RabbitMQ Management Interface

## Best Practices

1. **Code-Organisation**
   - Komponenten logisch trennen
   - Wiederverwendbare Funktionen auslagern
   - Konsistente Namenskonventionen

2. **Fehlerbehandlung**
   - Try-Catch Blöcke für asynchrone Operationen
   - Benutzerfreundliche Fehlermeldungen
   - Logging für Debugging

3. **Sicherheit**
   - Input-Validierung
   - CORS-Konfiguration
   - Sichere HTTP-Methoden

4. **Performance**
   - Paginierung für große Datensätze
   - Optimierte API-Aufrufe
   - Caching wo sinnvoll

## Häufige Probleme und Lösungen

1. **CORS-Fehler**
   - Überprüfen der CORS-Konfiguration im Backend
   - Korrekte Port-Konfiguration
   - Browser-Cache leeren

2. **RabbitMQ-Verbindungsprobleme**
   - RabbitMQ-Service-Status prüfen
   - Verbindungseinstellungen überprüfen
   - Logs auf Fehlermeldungen prüfen

3. **Frontend startet nicht auf Port 3002**
   - PORT=3002 in package.json prüfen
   - Bereits belegte Ports überprüfen
   - Server neu starten

## Weiterentwicklung

Mögliche Erweiterungen für das Projekt:

1. **Frontend**
   - Erweiterte Suchfunktionen
   - Sortierung der Kontaktliste
   - Filter-Optionen
   - Export-Funktionalität

2. **Backend**
   - Authentifizierung
   - Rate Limiting
   - Caching
   - Datenbankanbindung

3. **Monitoring**
   - Logging-System
   - Performance-Monitoring
   - Error-Tracking 