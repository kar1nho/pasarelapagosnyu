import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaymentAuthService } from './payment-auth.service';

export interface CreatePaymentPayload {
  referenceId: string;
  originService: string;
  amount: number;
  paymentMethod: string;
  callbackUrl: string;
  description: string;
}

export interface ConfirmPaymentPayload {
  status: 'APPROVED' | 'REJECTED';
  rejectionReason?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly apiUrl = environment.paymentsUrl;

  constructor(
    private http: HttpClient,
    private paymentAuthService: PaymentAuthService
  ) {}

  createOrder(payload: CreatePaymentPayload): Observable<any> {
    return this.ensurePaymentToken().pipe(
      switchMap(token =>
        this.http.post(
          `${this.apiUrl}/orders`,
          payload,
          {
            headers: this.getAuthHeaders(token)
          }
        )
      )
    );
  }

  getPayment(referenceId: string): Observable<any> {
    return this.ensurePaymentToken().pipe(
      switchMap(token =>
        this.http.get(
          `${this.apiUrl}/${referenceId}`,
          {
            headers: this.getAuthHeaders(token)
          }
        )
      )
    );
  }

  confirmPayment(
    referenceId: string,
    payload: ConfirmPaymentPayload
  ): Observable<any> {
    return this.ensurePaymentToken().pipe(
      switchMap(token =>
        this.http.patch(
          `${this.apiUrl}/${referenceId}/confirm`,
          payload,
          {
            headers: this.getAuthHeaders(token)
          }
        )
      )
    );
  }

  private ensurePaymentToken(): Observable<string> {
    const token = this.paymentAuthService.getPaymentToken();

    if (token && !this.paymentAuthService.isTokenExpired(token)) {
      return of(token);
    }

    this.paymentAuthService.clearPaymentToken();

    return this.paymentAuthService.getTokenByPrivateKey().pipe(
      switchMap(() => {
        const newToken = this.paymentAuthService.getPaymentToken();
        return of(newToken || '');
      })
    );
  }

  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}