import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartComponent } from './components/cart/cart.component';
import { SuccessComponent } from './components/success/success.component';
import { CancelComponent } from './components/cancel/cancel.component';
import { ShopComponent } from './components/shop/shop.component';

const routes: Routes = [
  { path: '', component: ShopComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'cancel', component: CancelComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    CartComponent,
    SuccessComponent,
    CancelComponent,
    ShopComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 