import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { loadStripe, Stripe, StripeError } from '@stripe/stripe-js';
import { tap } from 'rxjs/operators';

export interface StripeSession {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log('Initializing Stripe with public key:', environment.stripePublicKey);
    this.stripePromise = loadStripe(environment.stripePublicKey)
      .then(stripe => {
        console.log('Stripe loaded successfully:', !!stripe);
        return stripe;
      })
      .catch(error => {
        console.error('Failed to load Stripe:', error);
        return null;
      });
  }

  async getStripe(): Promise<Stripe | null> {
    try {
      const stripe = await this.stripePromise;
      if (!stripe) {
        console.error('Stripe failed to initialize');
        return null;
      }
      return stripe;
    } catch (error) {
      console.error('Error getting Stripe instance:', error);
      return null;
    }
  }

  createCheckoutSession(priceId: string): Observable<StripeSession> {
    console.log('Creating checkout session for price:', priceId);
    console.log('API URL:', `${this.apiUrl}/create-checkout-session`);
    return this.http.post<StripeSession>(`${this.apiUrl}/create-checkout-session`, {
      priceId
    }).pipe(
      tap({
        next: (response) => console.log('Checkout session created successfully:', response),
        error: (error) => console.error('Error creating checkout session:', error)
      })
    );
  }

  async redirectToCheckout(sessionId: string): Promise<{ error?: StripeError }> {
    try {
      const stripe = await this.getStripe();
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }
      console.log('Redirecting to checkout with session:', sessionId);
      return stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      return { error: { message: 'Failed to redirect to checkout' } as StripeError };
    }
  }

  getSessionStatus(sessionId: string): Observable<StripeSession> {
    return this.http.get<StripeSession>(`${this.apiUrl}/session/${sessionId}`);
  }

  handleWebhook(event: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/webhook`, event);
  }
} 
