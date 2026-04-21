# Stripe Payment Integration - Dokumentation

## Übersicht
Diese Dokumentation erklärt die Integration von Stripe als Zahlungsdienstleister in den Web-Shop. Die Integration ermöglicht es Kunden, Produkte sicher mit Kreditkarte zu bezahlen.

## Voraussetzungen
- Stripe Account (kostenlos erstellbar unter [stripe.com](https://stripe.com))
- Stripe API Keys (Publishable Key und Secret Key)
- Node.js und npm installiert
- Angular CLI installiert

## Installation

1. Installiere die benötigten Pakete:
```bash
npm install @stripe/stripe-js
npm install express stripe cors
```

## Projektstruktur

```
src/
├── app/
│   ├── components/
│   │   ├── cart/
│   │   │   └── cart.component.ts
│   │   ├── success/
│   │   │   └── success.component.ts
│   │   └── cancel/
│   │       └── cancel.component.ts
│   ├── services/
│   │   └── payment.service.ts
│   ├── app.component.ts
│   └── app.module.ts
└── server.js
```

## Komponenten

### 1. Payment Service (payment.service.ts)
Der Payment Service ist für die Kommunikation mit Stripe zuständig.

```typescript
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripe: Promise<Stripe | null>;

  constructor() {
    this.stripe = loadStripe('your_publishable_key');
  }

  async createPaymentSession(products: Product[]) {
    const response = await fetch('http://localhost:3000/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lineItems }),
    });
  }
}
```

### 2. Warenkorb Komponente (cart.component.ts)
Die Warenkorb-Komponente zeigt die ausgewählten Produkte an und enthält den "Zur Kasse" Button.

```typescript
@Component({
  selector: 'app-cart',
  template: `
    <div>
      <!-- Warenkorb Inhalt -->
      <button (click)="onCheckout()">Zur Kasse</button>
    </div>
  `
})
```

### 3. Success & Cancel Komponenten
Diese Komponenten zeigen Bestätigungs- oder Abbruchmeldungen nach dem Zahlungsvorgang an.

## Backend (server.js)
Der Express-Server handhabt die Stripe Checkout Sessions:

```javascript
const express = require('express');
const stripe = require('stripe')('your_stripe_secret_key');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API-Routen zuerst!
app.post('/api/create-checkout-session', async (req, res) => {
  // ... Stripe-Session-Code ...
});

// Dann statische Angular-Dateien ausliefern
app.use(express.static(path.join(__dirname, 'dist/web-shop')));

// Alle anderen Routen auf index.html umleiten (für Angular-Routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/web-shop/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

## Konfiguration

1. Stripe API Keys einrichten:
   - Ersetze `'your_publishable_key'` in `payment.service.ts`
   - Ersetze `'your_stripe_secret_key'` in `server.js`

2. Server starten:
```bash
ng build --output-path=dist/web-shop
node server.js
```

## Zahlungsablauf

1. Kunde fügt Produkte zum Warenkorb hinzu
2. Kunde klickt auf "Zur Kasse"
3. Stripe Checkout Seite wird angezeigt
4. Kunde gibt Zahlungsinformationen ein
5. Bei erfolgreicher Zahlung: Weiterleitung zur Success-Seite
6. Bei abgebrochener Zahlung: Weiterleitung zur Cancel-Seite

## Sicherheitshinweise

- Niemals den Stripe Secret Key im Frontend verwenden
- Immer HTTPS für Produktionsumgebungen verwenden
- Webhook-Events für zusätzliche Sicherheit implementieren
- Regelmäßige Überprüfung der Stripe-Logs

## Fehlerbehandlung

Der Code enthält grundlegende Fehlerbehandlung:
- Try-Catch Blöcke für API-Aufrufe
- Benutzerfreundliche Fehlermeldungen
- Logging von Fehlern für Debugging

## Erweiterungsmöglichkeiten

1. Webhook-Integration für automatische Bestätigungen
2. Speichern von Bestellungen in einer Datenbank
3. E-Mail-Benachrichtigungen
4. Mehrere Zahlungsmethoden
5. Währungsunterstützung

## Ressourcen

- [Stripe Dokumentation](https://stripe.com/docs)
- [Angular Dokumentation](https://angular.io/docs)
- [Express.js Dokumentation](https://expressjs.com/) 