import { Component, EventEmitter, Input, Output } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-product-list',
  template: `
    <div>
      <h2>Produkte</h2>
      <ul>
        <li *ngFor="let product of products">
          {{ product.name }} - {{ product.price }} CHF - Lager: {{ product.stock }}
          <button (click)="onAddToCart(product)" [disabled]="product.stock === 0">In den Warenkorb</button>
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
  @Input() products: Product[] = [];
  @Output() addToCart = new EventEmitter<Product>();

  onAddToCart(product: Product) {
    if (product.stock > 0) {
      this.addToCart.emit({ ...product });
    }
  }
} 