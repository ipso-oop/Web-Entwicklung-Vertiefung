import { Component, Input, Output, EventEmitter } from '@angular/core';

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
  `]
})
export class CartComponent {
  @Input() cart: Product[] = [];
  @Output() removeFromCart = new EventEmitter<number>();

  get totalPrice(): string {
    return this.cart.reduce((total, product) => total + product.price, 0).toFixed(2);
  }

  onRemoveFromCart(productId: number) {
    this.removeFromCart.emit(productId);
  }
} 