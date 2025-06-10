import { Component } from '@angular/core';

@Component({
  selector: 'app-success',
  template: `
    <div class="success-container">
      <h1>Vielen Dank für Ihren Einkauf!</h1>
      <p>Ihre Zahlung wurde erfolgreich verarbeitet.</p>
      <button routerLink="/">Zurück zum Shop</button>
    </div>
  `,
  styles: [`
    .success-container {
      text-align: center;
      padding: 50px 20px;
    }
    button {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.1em;
    }
    button:hover {
      background-color: #218838;
    }
  `]
})
export class SuccessComponent {} 