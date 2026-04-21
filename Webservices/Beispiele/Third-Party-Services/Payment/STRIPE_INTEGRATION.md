# Stripe Integration in Angular - Konzepte und Implementierung

## 1. Grundlegende Konzepte

### 1.1 Stripe API
- **Stripe** ist ein Payment-Service-Provider, der verschiedene Zahlungsmethoden ermöglicht
- Die Integration erfolgt über zwei Schlüssel:
  - Public Key (Frontend): Für die Client-seitige Integration
  - Secret Key (Backend): Für die Server-seitige Integration

### 1.2 Architektur
- **Frontend (Angular)**: Handhabt die Benutzerinteraktion und Stripe-Elemente
- **Backend (Node.js/Express)**: Verarbeitet die Zahlungsanfragen und kommuniziert mit Stripe
- **Stripe API**: Verarbeitet die eigentlichen Zahlungen

## 2. Frontend-Integration (Angular)

### 2.1 Dependencies
```json
{
  "dependencies": {
    "@stripe/stripe-js": "^7.3.0"
  }
}
```

### 2.2 Environment-Konfiguration
```typescript
// src/environments/environment.ts
export const environment = {
  apiUrl: 'http://localhost:3000',
  stripePublicKey: 'pk_test_...' // Stripe Public Key
};
```

### 2.3 Stripe Service
Der `StripeService` ist das Herzstück der Frontend-Integration:

```typescript
@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    // Initialisierung von Stripe mit dem Public Key
    this.stripePromise = loadStripe(environment.stripePublicKey);
  }
}
```

#### Wichtige Methoden:
1. **Stripe Initialisierung**
```typescript
async getStripe(): Promise<Stripe | null> {
  return await this.stripePromise;
}
```

2. **Checkout Session erstellen**
```typescript
createCheckoutSession(priceId: string): Observable<StripeSession> {
  return this.http.post<StripeSession>(`${this.apiUrl}/create-checkout-session`, {
    priceId
  });
}
```

3. **Zur Checkout-Seite weiterleiten**
```typescript
async redirectToCheckout(sessionId: string): Promise<{ error?: StripeError }> {
  const stripe = await this.getStripe();
  return stripe.redirectToCheckout({ sessionId });
}
```

## 3. Backend-Integration (Node.js/Express)

### 3.1 Dependencies
```json
{
  "dependencies": {
    "express": "^5.1.0",
    "stripe": "^18.1.1",
    "cors": "^2.8.5"
  }
}
```

### 3.2 Server-Konfiguration
```javascript
const express = require('express');
const stripe = require('stripe')('sk_test_...'); // Stripe Secret Key
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
```

### 3.3 Checkout Session Endpoint
```javascript
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: req.body.priceId, quantity: 1 }],
      mode: 'payment',
      success_url: 'http://localhost:4200/success',
      cancel_url: 'http://localhost:4200/cancel',
    });
    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 4. Zahlungsfluss

1. **Benutzer klickt auf "Bezahlen"**
   - Frontend ruft `initiatePayment()` auf
   - Erstellt eine Checkout Session über den Backend-Endpoint

2. **Backend erstellt Stripe Session**
   - Validiert die Anfrage
   - Erstellt eine Stripe Checkout Session
   - Sendet Session-ID zurück an Frontend

3. **Frontend leitet zur Stripe Checkout-Seite weiter**
   - Verwendet `redirectToCheckout()`
   - Benutzer gibt Zahlungsinformationen ein

4. **Stripe verarbeitet die Zahlung**
   - Erfolgreiche Zahlung: Weiterleitung zur Success-URL
   - Fehlgeschlagene Zahlung: Weiterleitung zur Cancel-URL

## 5. Fehlerbehandlung

### 5.1 Frontend
```typescript
try {
  const session = await this.stripeService.createCheckoutSession(priceId);
  const result = await this.stripeService.redirectToCheckout(session.id);
  if (result.error) {
    throw new Error(result.error.message);
  }
} catch (err) {
  this.error = err.message;
}
```

### 5.2 Backend
```javascript
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});
```

## 6. Best Practices

1. **Sicherheit**
   - Niemals den Stripe Secret Key im Frontend verwenden
   - CORS korrekt konfigurieren
   - HTTPS in Produktion verwenden

2. **Fehlerbehandlung**
   - Umfassende Fehlerbehandlung implementieren
   - Benutzerfreundliche Fehlermeldungen anzeigen
   - Logging für Debugging-Zwecke

3. **Testing**
   - Stripe Test-Keys für Entwicklung verwenden
   - Verschiedene Zahlungsszenarien testen
   - Error-Cases testen

## 7. Nächste Schritte

1. **Webhook-Integration**
   - Implementierung von Stripe Webhooks für Echtzeit-Updates
   - Verarbeitung von Zahlungsstatus-Änderungen

2. **Zahlungsmethoden erweitern**
   - Weitere Zahlungsmethoden hinzufügen
   - Lokale Zahlungsmethoden integrieren

3. **UI/UX Verbesserungen**
   - Ladeanimationen
   - Besseres Feedback für Benutzer
   - Responsive Design 