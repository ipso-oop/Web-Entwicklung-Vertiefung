# Service-to-Service Kommunikation mit RabbitMQ

## Übersicht
Dieses Beispiel demonstriert die Kommunikation zwischen zwei Microservices über einen Message Broker (RabbitMQ). Es besteht aus:
1. Einem REST API Service für die Kontaktverwaltung
2. Einem Notification Service für Benachrichtigungen
3. RabbitMQ als Message Broker

## Architektur

### Komponenten
1. **REST API Service (Port 3000)**
   - Verwaltet Kontakte (CRUD-Operationen)
   - Veröffentlicht Events über RabbitMQ
   - Endpunkte:
     - POST /api/v1/contacts
     - PUT /api/v1/contacts/:id
     - DELETE /api/v1/contacts/:id

2. **Notification Service (Port 3001)**
   - Abonniert Events von RabbitMQ
   - Verarbeitet Benachrichtigungen
   - Endpunkte:
     - GET /api/v1/notifications
     - GET /api/v1/notifications/:id

3. **RabbitMQ (Port 5672)**
   - Message Broker
   - Verantwortlich für die asynchrone Kommunikation
   - Topics:
     - contact.created
     - contact.updated
     - contact.deleted

## Kommunikationsfluss

### 1. Kontakt erstellen
1. Client sendet POST-Request an REST API
2. REST API erstellt Kontakt
3. REST API veröffentlicht "contact.created" Event
4. Notification Service empfängt Event
5. Notification Service sendet E-Mail und SMS
6. Notification Service speichert Benachrichtigung

### 2. Kontakt aktualisieren
1. Client sendet PUT-Request an REST API
2. REST API aktualisiert Kontakt
3. REST API veröffentlicht "contact.updated" Event
4. Notification Service empfängt Event
5. Notification Service sendet E-Mail
6. Notification Service speichert Benachrichtigung

### 3. Kontakt löschen
1. Client sendet DELETE-Request an REST API
2. REST API löscht Kontakt
3. REST API veröffentlicht "contact.deleted" Event
4. Notification Service empfängt Event
5. Notification Service sendet E-Mail
6. Notification Service speichert Benachrichtigung

## Vorteile dieser Architektur

1. **Entkopplung**
   - Services sind voneinander unabhängig
   - Änderungen in einem Service beeinflussen andere nicht direkt

2. **Skalierbarkeit**
   - Services können unabhängig skaliert werden
   - Mehrere Instanzen des Notification Service möglich

3. **Zuverlässigkeit**
   - RabbitMQ garantiert Nachrichtenübermittlung
   - Nachrichten bleiben erhalten, auch wenn ein Service ausfällt

4. **Asynchrone Verarbeitung**
   - REST API muss nicht auf Benachrichtigungen warten
   - Bessere Performance für den Client

## Setup und Ausführung

### Voraussetzungen
- Node.js
- RabbitMQ Server
- npm oder yarn

### Installation
```bash
# Dependencies installieren
npm install

# RabbitMQ starten (falls nicht bereits laufend)
# Windows: RabbitMQ als Service installieren
# Linux/Mac: rabbitmq-server starten
```

### Services starten
```bash
# Beide Services gleichzeitig starten
npm run start:all

# Oder einzeln starten
npm run start:api        # REST API Service
npm run start:notifications  # Notification Service
```

### Testen
1. REST API testen:
```bash
# Kontakt erstellen
curl -X POST http://localhost:3000/api/v1/contacts \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Max","lastName":"Mustermann","email":"max@example.com"}'

# Kontakt aktualisieren
curl -X PUT http://localhost:3000/api/v1/contacts/1 \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Maximilian"}'

# Kontakt löschen
curl -X DELETE http://localhost:3000/api/v1/contacts/1
```

2. Benachrichtigungen anzeigen:
```bash
# Alle Benachrichtigungen
curl http://localhost:3001/api/v1/notifications

# Spezifische Benachrichtigung
curl http://localhost:3001/api/v1/notifications/1
```

## Unterrichtsziele

1. **Verständnis von Microservices**
   - Unabhängige Services
   - Service-Grenzen
   - Kommunikationsmuster

2. **Message Broker Konzepte**
   - Publish/Subscribe Pattern
   - Message Queues
   - Event-Driven Architecture

3. **Asynchrone Kommunikation**
   - Vorteile gegenüber synchroner Kommunikation
   - Eventual Consistency
   - Fehlertoleranz

4. **Praktische Implementierung**
   - RabbitMQ Integration
   - Event-Handling
   - Service-Isolation

## Erweiterungsmöglichkeiten

1. **Monitoring**
   - RabbitMQ Management Interface
   - Service Health Checks
   - Logging

2. **Fehlerbehandlung**
   - Retry-Mechanismen
   - Dead Letter Queues
   - Circuit Breaker

3. **Sicherheit**
   - API Authentication
   - Message Encryption
   - Access Control

4. **Testing**
   - Unit Tests
   - Integration Tests
   - End-to-End Tests 