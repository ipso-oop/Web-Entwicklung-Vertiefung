import { Component, EventEmitter, Output } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-product-list',
  template: `
    <div>
      <h2>Produkte</h2>
      <ul>
        <li *ngFor="let product of products">
          {{ product.name }} - {{ product.price }} CHF
          <button (click)="onAddToCart(product)">In den Warenkorb</button>
        </li>
      </ul>
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
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
  `]
})
export class ProductListComponent {
  @Output() addToCart = new EventEmitter<Product>();

  products: Product[] = [
    { id: 1, name: 'Produkt 1', price: 29.99 },
    { id: 2, name: 'Produkt 2', price: 39.99 },
    { id: 3, name: 'Produkt 3', price: 19.99 }
  ];

  onAddToCart(product: Product) {
    this.addToCart.emit(product);
  }
} 