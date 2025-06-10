import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PaymentSession {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = environment.apiUrl + '/payments';

  constructor(private http: HttpClient) {}

  createPaymentSession(amount: number, currency: string = 'CHF'): Observable<PaymentSession> {
    return this.http.post<PaymentSession>(`${this.apiUrl}/create-session`, {
      amount,
      currency
    });
  }

  getPaymentStatus(sessionId: string): Observable<PaymentSession> {
    return this.http.get<PaymentSession>(`${this.apiUrl}/session/${sessionId}`);
  }

  confirmPayment(sessionId: string): Observable<PaymentSession> {
    return this.http.post<PaymentSession>(`${this.apiUrl}/confirm/${sessionId}`, {});
  }
} 
