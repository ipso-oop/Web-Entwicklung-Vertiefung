# Game Testing Lab - REST API Dokumentation

## Authentifizierung (Auth)

| Endpunkt | Methode | Beschreibung | Parameter | Response |
|----------|---------|--------------|-----------|----------|
| `/api/auth/login` | POST | Benutzer anmelden | `{email: string, password: string}` | `{token: string, user: User}` |
| `/api/auth/register` | POST | Benutzer registrieren | `{email: string, password: string, username: string}` | `{token: string, user: User}` |
| `/api/auth/logout` | POST | Benutzer abmelden | - | `void` |

## Bewertungen (Ratings)

| Endpunkt | Methode | Beschreibung | Parameter | Response |
|----------|---------|--------------|-----------|----------|
| `/api/ratings` | GET | Alle Bewertungen abrufen | - | `Rating[]` |
| `/api/ratings/:id` | GET | Einzelne Bewertung abrufen | `id: string` | `Rating` |
| `/api/ratings` | POST | Neue Bewertung erstellen | `Rating` | `Rating` |
| `/api/ratings/:id` | PUT | Bewertung aktualisieren | `id: string`, `Rating` | `Rating` |
| `/api/ratings/:id` | DELETE | Bewertung löschen | `id: string` | `void` |

## Datentypen

### User
```typescript
interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

### Rating
```typescript
interface Rating {
  id: string;
  gameId: string;
  userId: string;
  score: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Authentifizierung

Alle API-Endpunkte (außer Login und Register) erfordern einen gültigen JWT-Token im Authorization-Header:

```
Authorization: Bearer <token>
```

## Fehlerbehandlung

Die API gibt folgende HTTP-Statuscodes zurück:

- 200: Erfolgreiche Anfrage
- 201: Ressource erfolgreich erstellt
- 400: Ungültige Anfrage
- 401: Nicht authentifiziert
- 403: Keine Berechtigung
- 404: Ressource nicht gefunden
- 500: Server-Fehler

Fehlerantworten haben folgendes Format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Fehlerbeschreibung"
  }
}
``` 