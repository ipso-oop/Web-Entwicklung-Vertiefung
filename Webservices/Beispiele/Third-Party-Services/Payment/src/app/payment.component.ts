import { Component, OnInit } from '@angular/core';
import { StripeService, StripeSession } from './services/stripe.service';
import { StripeError } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  loading = false;
  error: string | null = null;
  stripeLoaded = false;
  initializationError = false;

  constructor(private stripeService: StripeService) {}

  async ngOnInit() {
    try {
      console.log('Initializing payment component...');
      const stripe = await this.stripeService.getStripe();
      this.stripeLoaded = !!stripe;
      
      if (!this.stripeLoaded) {
        this.initializationError = true;
        this.error = 'Failed to load payment system. Please refresh the page or try again later.';
        console.error('Stripe failed to load in component');
      } else {
        console.log('Payment component initialized successfully');
      }
    } catch (err) {
      this.initializationError = true;
      this.error = 'Failed to initialize payment system. Please refresh the page or try again later.';
      console.error('Stripe initialization error in component:', err);
    }
  }

  async initiatePayment() {
    if (!this.stripeLoaded) {
      this.error = 'Payment system is not ready. Please refresh the page and try again.';
      return;
    }

    this.loading = true;
    this.error = null;
    
    try {
      console.log('Initiating payment...');
      const session = await this.stripeService.createCheckoutSession('price_1RT5uqE7oQVvcUcVeeTnGMI0').toPromise();
      if (!session) {
        throw new Error('Failed to create payment session');
      }

      console.log('Redirecting to checkout...');
      const result = await this.stripeService.redirectToCheckout(session.id);
      if (result.error) {
        throw new Error(result.error.message || 'An error occurred during checkout');
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'An error occurred during payment';
      console.error('Payment error:', err);
    } finally {
      this.loading = false;
    }
  }
}
