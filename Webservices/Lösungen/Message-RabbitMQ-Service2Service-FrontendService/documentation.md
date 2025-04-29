# Service-to-Service Kommunikation mit RabbitMQ
## Technische Dokumentation

### 1. Einführung
Diese Dokumentation beschreibt die Implementierung einer Service-to-Service Kommunikation zwischen zwei Microservices unter Verwendung von RabbitMQ als Message Broker. Das Beispiel demonstriert die asynchrone Kommunikation zwischen einem REST API Service und einem Notification Service.

### 2. Systemarchitektur

#### 2.1 Übersicht
Das System besteht aus drei Hauptkomponenten:
1. REST API Service (Node.js/Express)
2. Notification Service (Node.js/Express)
3. RabbitMQ Message Broker

#### 2.2 Technologie-Stack
- **Backend Services:**
  - Node.js
  - Express.js
  - amqplib (RabbitMQ Client)
- **Message Broker:**
  - RabbitMQ
- **Entwicklungstools:**
  - npm (Node Package Manager)
  - concurrently (für paralleles Starten der Services)

### 3. Detaillierte Komponentenbeschreibung

#### 3.1 REST API Service
**Konfiguration:**
- Port: 3000
- Framework: Express.js
- Message Broker Integration: amqplib

**API-Endpunkte:**
1. **Kontakt erstellen**
   - Route: POST /api/v1/contacts
   - Request Body:
     ```json
     {
       "firstName": "string",
       "lastName": "string",
       "email": "string"
     }
     ```
   - Response: 201 Created
   - Event: contact.created

2. **Kontakt aktualisieren**
   - Route: PUT /api/v1/contacts/:id
   - Request Body:
     ```json
     {
       "firstName": "string",
       "lastName": "string",
       "email": "string"
     }
     ```
   - Response: 200 OK
   - Event: contact.updated

3. **Kontakt löschen**
   - Route: DELETE /api/v1/contacts/:id
   - Response: 204 No Content
   - Event: contact.deleted

#### 3.2 Notification Service
**Konfiguration:**
- Port: 3001
- Framework: Express.js
- Message Broker Integration: amqplib

**Event-Handler:**
1. **Contact Created Handler**
   ```javascript
   async handleContactCreated(contact) {
     // 1. Benachrichtigung erstellen
     // 2. E-Mail senden
     // 3. SMS senden
     // 4. Benachrichtigung speichern
   }
   ```

2. **Contact Updated Handler**
   ```javascript
   async handleContactUpdated(contact) {
     // 1. Benachrichtigung erstellen
     // 2. E-Mail senden
     // 3. Benachrichtigung speichern
   }
   ```

3. **Contact Deleted Handler**
   ```javascript
   async handleContactDeleted(contactId) {
     // 1. Benachrichtigung erstellen
     // 2. E-Mail senden
     // 3. Benachrichtigung speichern
   }
   ```

**API-Endpunkte:**
1. **Benachrichtigungen abrufen**
   - Route: GET /api/v1/notifications
   - Response: Array von Benachrichtigungen

2. **Einzelne Benachrichtigung abrufen**
   - Route: GET /api/v1/notifications/:id
   - Response: Einzelne Benachrichtigung

#### 3.3 RabbitMQ Konfiguration
**Exchange:**
- Name: contact_events
- Type: topic
- Durable: true

**Queues:**
1. contact.created
2. contact.updated
3. contact.deleted

**Bindings:**
- Alle Queues sind an den Exchange gebunden
- Routing Keys entsprechen den Queue-Namen

### 4. Implementierungsdetails

#### 4.1 Message Bus Implementation
```javascript
class MessageBus {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.exchange = 'contact_events';
        this.queues = {
            contactCreated: 'contact.created',
            contactUpdated: 'contact.updated',
            contactDeleted: 'contact.deleted'
        };
    }

    async connect() {
        // Verbindung zu RabbitMQ herstellen
        // Exchange und Queues deklarieren
    }

    async publish(eventType, message) {
        // Nachricht an RabbitMQ senden
    }

    async subscribe(queue, callback) {
        // Queue abonnieren und Callback registrieren
    }
}
```

#### 4.2 Event Flow
1. **Publishing:**
   - REST API erstellt/aktualisiert/löscht Kontakt
   - Event wird an RabbitMQ gesendet
   - Bestätigung wird zurückgegeben

2. **Subscribing:**
   - Notification Service abonniert Queue
   - Nachricht wird empfangen
   - Handler wird ausgeführt
   - Bestätigung wird gesendet

### 5. Fehlerbehandlung

#### 5.1 Connection Handling
- Automatische Wiederverbindung bei Verbindungsverlust
- Timeout-Handling
- Fehlerprotokollierung

#### 5.2 Message Handling
- Message Validation
- Error Callbacks
- Dead Letter Queue für fehlgeschlagene Nachrichten

### 6. Monitoring und Logging

#### 6.1 Logging
- Service Start/Stop
- Event Publishing/Receiving
- Fehler und Warnungen

#### 6.2 Monitoring
- RabbitMQ Management Interface
- Service Health Checks
- Message Queue Monitoring

### 7. Deployment

#### 7.1 Voraussetzungen
- Node.js Installation
- RabbitMQ Server
- npm Dependencies

#### 7.2 Startsequenz
1. RabbitMQ Server starten
2. Dependencies installieren
3. Services starten

### 8. Teststrategie

#### 8.1 Unit Tests
- Service-Komponenten
- Event-Handler
- Message Bus

#### 8.2 Integration Tests
- Service-zu-Service Kommunikation
- RabbitMQ Integration
- API-Endpunkte

#### 8.3 End-to-End Tests
- Kompletter Workflow
- Fehlerszenarien
- Performance Tests

### 9. Sicherheitsaspekte

#### 9.1 API Security
- Input Validation
- Rate Limiting
- CORS Konfiguration

#### 9.2 Message Security
- Message Encryption
- Access Control
- Authentication

### 10. Skalierbarkeit

#### 10.1 Horizontale Skalierung
- Mehrere Service-Instanzen
- Load Balancing
- Queue Partitioning

#### 10.2 Vertikale Skalierung
- Resource Optimization
- Performance Tuning
- Caching Strategien

### 11. Wartung und Updates

#### 11.1 Versionierung
- API Versionierung
- Message Schema Versionierung
- Dependency Updates

#### 11.2 Deployment
- Zero-Downtime Updates
- Rollback Strategien
- Backup und Recovery

### 12. Best Practices

#### 12.1 Code Organisation
- Modularer Aufbau
- Clean Code Prinzipien
- Dokumentation

#### 12.2 Performance
- Connection Pooling
- Message Batching
- Resource Management

### 13. Troubleshooting

#### 13.1 Häufige Probleme
- Connection Issues
- Message Loss
- Performance Bottlenecks

#### 13.2 Lösungsstrategien
- Debugging Tools
- Monitoring Alerts
- Recovery Procedures 