import { Component } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-shop',
  template: `
    <div class="container">
      <h1>Web Shop</h1>
      <div class="content">
        <app-product-list (addToCart)="addToCart($event)"></app-product-list>
        <app-cart [cart]="cart" (removeFromCart)="removeFromCart($event)"></app-cart>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
  `]
})
export class ShopComponent {
  cart: Product[] = [];

  addToCart(product: Product) {
    this.cart.push(product);
  }

  removeFromCart(productId: number) {
    this.cart = this.cart.filter(item => item.id !== productId);
  }
} 