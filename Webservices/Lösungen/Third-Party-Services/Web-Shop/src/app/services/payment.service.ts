import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripe: Promise<Stripe | null>;

  constructor() {
    // Replace with your actual Stripe publishable key
      this.stripe = loadStripe('Add-Own-Public-Key');
  }

  async createPaymentSession(products: { id: number; name: string; price: number }[]) {
    try {
      const stripe = await this.stripe;
      if (!stripe) throw new Error('Stripe failed to initialize');

      // Create line items for the payment
      const lineItems = products.map(product => ({
        price_data: {
          currency: 'chf',
          product_data: {
            name: product.name,
          },
          unit_amount: Math.round(product.price * 100), // Convert to cents
        },
        quantity: 1,
      }));

      // Create a checkout session
        const response = await fetch(`${environment.backendUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lineItems }),
      });

      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  }
} 