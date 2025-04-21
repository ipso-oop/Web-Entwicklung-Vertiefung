# Detaillierte Dokumentation der Microservices-Architektur

## 1. Backend-Services

### 1.1 restServer.js
Der REST-API-Server ist der Haupteinstiegspunkt für alle HTTP-Anfragen.

#### Hauptkomponenten:
```javascript
const express = require('express');
const app = express();
```
- Initialisiert den Express-Server
- Konfiguriert Middleware und Routen

#### CORS-Middleware:
```javascript
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3002');
    // ... weitere CORS-Konfiguration
});
```
- Ermöglicht Cross-Origin Requests vom Frontend
- Definiert erlaubte HTTP-Methoden und Header

#### Swagger-Konfiguration:
```javascript
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        // ... Swagger-Konfiguration
    }
};
```
- Dokumentiert die API-Endpunkte
- Ermöglicht interaktives API-Testing

#### Kontakt-Validierung:
```javascript
const validateContact = (contact) => {
    const errors = [];
    // Validierungslogik
    return errors;
};
```
- Prüft erforderliche Felder
- Validiert E-Mail-Format
- Gibt Fehlermeldungen zurück

#### HATEOAS-Links:
```javascript
const addHATEOASLinks = (contact, req) => {
    return {
        ...contact,
        _links: {
            self: `${baseUrl}/contacts/${contact.id}`,
            collection: `${baseUrl}/contacts`
        }
    };
};
```
- Implementiert HATEOAS-Prinzip
- Fügt Navigation-Links hinzu
- Verbessert API-Entdeckbarkeit

#### API-Endpunkte:

1. **GET /api/v1/contacts**
```javascript
app.get('/api/v1/contacts', (req, res) => {
    // Implementiert Paginierung und Filterung
    // Gibt Liste der Kontakte zurück
});
```

2. **POST /api/v1/contacts**
```javascript
app.post('/api/v1/contacts', (req, res) => {
    // Validiert Eingabedaten
    // Erstellt neuen Kontakt
    // Sendet Event über RabbitMQ
});
```

3. **GET /api/v1/contacts/:id**
```javascript
app.get('/api/v1/contacts/:id', (req, res) => {
    // Findet Kontakt nach ID
    // Fügt HATEOAS-Links hinzu
});
```

4. **PUT /api/v1/contacts/:id**
```javascript
app.put('/api/v1/contacts/:id', (req, res) => {
    // Aktualisiert gesamten Kontakt
    // Validiert Daten
    // Sendet Update-Event
});
```

5. **PATCH /api/v1/contacts/:id**
```javascript
app.patch('/api/v1/contacts/:id', (req, res) => {
    // Aktualisiert Teilinformationen
    // Behält nicht aktualisierte Felder bei
});
```

6. **DELETE /api/v1/contacts/:id**
```javascript
app.delete('/api/v1/contacts/:id', (req, res) => {
    // Löscht Kontakt
    // Sendet Lösch-Event
});
```

### 1.2 messageBus.js
Message Bus für die Event-basierte Kommunikation.

#### Hauptfunktionen:

```javascript
const connect = async () => {
    // Verbindung zu RabbitMQ herstellen
};

const publish = async (event, data) => {
    // Event an RabbitMQ senden
};

const subscribe = async (event, callback) => {
    // Auf Events hören
    // Callback bei Event-Empfang ausführen
};
```

### 1.3 notificationService.js
Service für asynchrone Benachrichtigungen.

#### Event-Handler:
```javascript
messageBus.subscribe('contact.created', (contact) => {
    // Verarbeitet Kontakt-Erstellung
});

messageBus.subscribe('contact.updated', (contact) => {
    // Verarbeitet Kontakt-Aktualisierung
});

messageBus.subscribe('contact.deleted', (contactId) => {
    // Verarbeitet Kontakt-Löschung
});
```

## 2. Frontend-Komponenten

### 2.1 src/App.js
Hauptkomponente der React-Anwendung.

```javascript
function App() {
    return (
        <Router>
            <nav>
                {/* Navigation */}
            </nav>
            <Routes>
                {/* Route-Definitionen */}
            </Routes>
        </Router>
    );
}
```
- Implementiert Routing-Logik
- Definiert Hauptnavigation
- Rendert Kind-Komponenten

### 2.2 src/components/ContactList.js
Liste aller Kontakte.

#### Hauptfunktionalitäten:
```javascript
function ContactList() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        // Lädt Kontakte beim Komponenten-Mount
    }, []);

    // Render-Logik für verschiedene Zustände
}
```
- Verwaltet Kontaktliste
- Implementiert Paginierung
- Zeigt Lade- und Fehlerzustände

### 2.3 src/components/ContactForm.js
Formular zum Erstellen/Bearbeiten von Kontakten.

#### Hauptfunktionalitäten:
```javascript
function ContactForm() {
    const [formData, setFormData] = useState({/*...*/});
    
    const handleSubmit = async (e) => {
        // Validiert Eingaben
        // Sendet API-Request
        // Zeigt Feedback
    };

    // Formular-Rendering mit Validierung
}
```
- Verwaltet Formulardaten
- Implementiert Validierung
- Handhabt API-Kommunikation

### 2.4 src/components/ContactDetails.js
Detailansicht eines Kontakts.

#### Hauptfunktionalitäten:
```javascript
function ContactDetails() {
    const [contact, setContact] = useState(null);
    
    const handleDelete = async () => {
        // Zeigt Bestätigungsdialog
        // Führt Löschung durch
        // Navigiert zurück
    };

    // Render-Logik für Kontaktdetails
}
```
- Zeigt Detailinformationen
- Ermöglicht Bearbeitung/Löschung
- Implementiert Bestätigungsdialoge

### 2.5 src/config.js
Konfigurationsdatei.

```javascript
export const API_BASE_URL = 'http://localhost:3000/api/v1';
```
- Definiert API-Endpunkte
- Zentralisiert Konfiguration

## 3. Datenfluss und Interaktionen

### 3.1 Kontakt erstellen
1. Frontend sendet POST-Request
2. Backend validiert Daten
3. Kontakt wird erstellt
4. Event wird publiziert
5. Notification Service verarbeitet Event
6. Frontend erhält Bestätigung

### 3.2 Kontakt aktualisieren
1. Frontend lädt aktuelle Daten
2. Benutzer bearbeitet Formular
3. PUT/PATCH-Request wird gesendet
4. Backend validiert und aktualisiert
5. Event wird publiziert
6. Notification Service verarbeitet Update

### 3.3 Kontakt löschen
1. Benutzer bestätigt Löschung
2. DELETE-Request wird gesendet
3. Backend entfernt Kontakt
4. Event wird publiziert
5. Notification Service verarbeitet Löschung
6. Frontend aktualisiert Liste

## 4. Fehlerbehandlung

### 4.1 Frontend
```javascript
try {
    // API-Aufruf
} catch (error) {
    // Benutzerfreundliche Fehlermeldung
    // Logging für Debugging
}
```

### 4.2 Backend
```javascript
app.use((error, req, res, next) => {
    // Fehlerbehandlung
    // Logging
    // Fehlerantwort
});
```

## 5. Sicherheit

### 5.1 Input-Validierung
- Frontend-Validierung
- Backend-Validierung
- Sanitization von Daten

### 5.2 CORS
- Konfigurierte Origins
- Sichere Methoden
- Header-Kontrolle

## 6. Performance

### 6.1 Frontend
- Lazy Loading
- Optimierte Renders
- Caching wo sinnvoll

### 6.2 Backend
- Paginierung
- Effiziente Queries
- Event-basierte Updates 