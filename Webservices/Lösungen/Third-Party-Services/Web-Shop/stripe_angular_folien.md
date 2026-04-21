# Stripe Integration in Angular – Schritt-für-Schritt Anleitung

---

## 1. Was ist Stripe?
- Stripe ist ein Zahlungsdienstleister für Online-Zahlungen
- Bietet einfache APIs und fertige Checkout-Lösungen
- Unterstützt Kreditkarten, Apple Pay, Google Pay u.v.m.

---

## 2. Voraussetzungen
- Stripe-Account ([stripe.com](https://stripe.com))
- Angular-Projekt
- Node.js & npm

---

## 3. Stripe im Angular-Projekt installieren
```bash
npm install @stripe/stripe-js
```

---

## 4. Stripe im Backend installieren (Node.js Beispiel)
```bash
npm install express stripe cors
```

---

## 5. PaymentService in Angular anlegen
```typescript
import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private stripePromise = loadStripe(environment.stripePublishableKey);

  async checkout(products: any[]) {
    const response = await fetch(`${environment.backendUrl}/api/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lineItems: products })
    });
    const session = await response.json();
    const stripe = await this.stripePromise;
    await stripe?.redirectToCheckout({ sessionId: session.id });
  }
}
```

---

## 6. Backend-Route für Stripe-Session
```js
app.post('/api/create-checkout-session', async (req, res) => {
  const { lineItems } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: 'http://localhost:4200/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:4200/cancel',
  });
  res.json({ id: session.id });
});
```

---

## 7. Checkout-Button im Warenkorb
```html
<button (click)="onCheckout()">Zur Kasse</button>
```

---

## 8. Umgebungsvariablen nutzen
- Lege `environment.ts` an:
```typescript
export const environment = {
  production: false,
  backendUrl: 'http://localhost:3000',
  stripePublishableKey: 'pk_test_...'
};
```

---

## 9. Ablauf im Überblick
1. Nutzer klickt auf "Zur Kasse"
2. Angular ruft das Backend auf
3. Backend erstellt Stripe-Session
4. Session-ID wird an Angular zurückgegeben
5. Stripe Checkout öffnet sich
6. Nach Zahlung: Redirect zu Success/Cancel

---

## 10. Tipps & Sicherheit
- Stripe Secret Key **niemals** im Frontend verwenden!
- HTTPS in Produktion nutzen
- Webhooks für Zahlungsstatus im Backend einrichten
- Fehlerbehandlung und Logging nicht vergessen

---

## 11. Ressourcen
- [Stripe Docs](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Angular Docs](https://angular.io/docs) 