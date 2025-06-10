import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PaymentService } from '../../services/payment.service';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-cart',
  template: `
    <div>
      <h2>Warenkorb</h2>
      <ul>
        <li *ngFor="let item of cart">
          {{ item.name }} - {{ item.price }} CHF
          <button (click)="onRemoveFromCart(item.id)">Entfernen</button>
        </li>
      </ul>
      <h3 *ngIf="cart.length > 0">Gesamtsumme: {{ totalPrice }} CHF</h3>
      <button 
        *ngIf="cart.length > 0" 
        (click)="onCheckout()" 
        [disabled]="isProcessing"
        class="checkout-button">
        {{ isProcessing ? 'Wird verarbeitet...' : 'Zur Kasse' }}
      </button>
    </div>
  `,
  styles: [`
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      margin: 10px 0;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      margin-left: 10px;
      padding: 5px 10px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #c82333;
    }
    .checkout-button {
      margin-top: 20px;
      background-color: #28a745;
      width: 100%;
      padding: 10px;
      font-size: 1.1em;
    }
    .checkout-button:hover {
      background-color: #218838;
    }
    .checkout-button:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
  `]
})
export class CartComponent {
  @Input() cart: Product[] = [];
  @Output() removeFromCart = new EventEmitter<number>();
  isProcessing = false;

  constructor(private paymentService: PaymentService) {}

  get totalPrice(): string {
    return this.cart.reduce((total, product) => total + product.price, 0).toFixed(2);
  }

  onRemoveFromCart(productId: number) {
    this.removeFromCart.emit(productId);
  }

  async onCheckout() {
    if (this.cart.length === 0) return;
    
    try {
      this.isProcessing = true;
      await this.paymentService.createPaymentSession(this.cart);
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Bezahlung fehlgeschlagen. Bitte versuchen Sie es später erneut.');
    } finally {
      this.isProcessing = false;
    }
  }
} 