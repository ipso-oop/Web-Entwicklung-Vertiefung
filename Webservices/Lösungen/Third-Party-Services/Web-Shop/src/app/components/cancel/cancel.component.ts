import { Component } from '@angular/core';

@Component({
  selector: 'app-cancel',
  template: `
    <div class="cancel-container">
      <h1>Zahlung abgebrochen</h1>
      <p>Ihre Zahlung wurde abgebrochen. Sie können es jederzeit erneut versuchen.</p>
      <button routerLink="/">Zurück zum Shop</button>
    </div>
  `,
  styles: [`
    .cancel-container {
      text-align: center;
      padding: 50px 20px;
    }
    button {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.1em;
    }
    button:hover {
      background-color: #0056b3;
    }
  `]
})
export class CancelComponent {} 