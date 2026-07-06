import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-error.component.html',
  styleUrls: ['./payment-error.component.css']
})
export class PaymentErrorComponent {

  error: any;
  callbackUrl: string | null = null;

  constructor() {
    this.error =
      history.state.error ??
      {
        status: 500,
        message: 'No se pudo procesar el pago',
        detail: 'Ocurrió un error inesperado.'
      };

    this.callbackUrl =
      history.state.callbackUrl ??
      sessionStorage.getItem('payment_callback_url');
  }

  returnToOrigin(): void {
    if (!this.callbackUrl) {
      window.history.back();
      return;
    }

    const cleanUrl = this.callbackUrl.trim();

    const normalizedUrl =
      cleanUrl.startsWith('http://') ||
      cleanUrl.startsWith('https://')
        ? cleanUrl
        : `https://${cleanUrl}`;

    window.location.href = normalizedUrl;
  }
}