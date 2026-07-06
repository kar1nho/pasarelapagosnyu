import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentAuthService {

  private readonly PAYMENT_TOKEN_KEY = 'nyu_payment_token';
  private readonly PAYMENT_USER_KEY = 'nyu_payment_user';

  constructor(private http: HttpClient) {}

  getPaymentToken(): string | null {
    return localStorage.getItem(this.PAYMENT_TOKEN_KEY);
  }

  clearPaymentToken(): void {
    localStorage.removeItem(this.PAYMENT_TOKEN_KEY);
    localStorage.removeItem(this.PAYMENT_USER_KEY);
  }

  getTokenByPrivateKey(): Observable<any> {
    return this.http.post<any>(
      `${environment.authUrl}/token`,
      {
        privateKey: environment.systemPrivateKey
      }
    ).pipe(
      tap(res => {
        localStorage.setItem(this.PAYMENT_TOKEN_KEY, res.access_token);

        localStorage.setItem(
          this.PAYMENT_USER_KEY,
          JSON.stringify({
            service: res.service,
            role: 'SYSTEM'
          })
        );
      })
    );
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);

      return payload.exp <= now;
    } catch {
      return true;
    }
  }
}