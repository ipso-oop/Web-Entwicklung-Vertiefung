import { Component } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <h1>Web Shop</h1>
      <div class="content">
        <app-product-list [products]="products" (addToCart)="addToCart($event)"></app-product-list>
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
export class AppComponent {
  cart: Product[] = [];
  
  products: Product[] = [
    { id: 1, name: 'Produkt 1', price: 29.99, stock: 3 },
    { id: 2, name: 'Produkt 2', price: 39.99, stock: 2 },
    { id: 3, name: 'Produkt 3', price: 19.99, stock: 0 }
  ];

  addToCart(product: Product) {
    const productInList = this.products.find(p => p.id === product.id);
    if (productInList && productInList.stock > 0) {
      productInList.stock--;
      this.cart.push({ ...product });
    }
  }

  removeFromCart(productId: number) {
    const removedProduct = this.cart.find(item => item.id === productId);
    if (removedProduct) {
      const productInList = this.products.find(p => p.id === productId);
      if (productInList) {
        productInList.stock++;
      }
      this.cart = this.cart.filter(item => item.id !== productId);
    }
  }
} 