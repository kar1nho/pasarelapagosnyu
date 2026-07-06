import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.css']
})
export class PaymentResultComponent {

  result: any;

  constructor(private router: Router) {
    this.result = history.state.result;
  }

  isApproved(): boolean {
    return this.result?.status === 'APPROVED' ||
           this.result?.status === 'PAID';
  }

  isRejected(): boolean {
    return this.result?.status === 'REJECTED';
  }

  getTitle(): string {
    if (this.isApproved()) {
      return 'Comprobante de Pago';
    }

    if (this.isRejected()) {
      return 'Pago Rechazado';
    }

    return 'Resultado del Pago';
  }

  getSubtitle(): string {
    if (this.isApproved()) {
      return 'Operación finalizada correctamente';
    }

    if (this.isRejected()) {
      return 'La transacción no pudo completarse';
    }

    return 'Operación finalizada';
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'APPROVED':
      case 'PAID':
        return 'Pagado';

      case 'PENDING':
        return 'Pendiente';

      case 'REJECTED':
        return 'Rechazado';

      case 'CANCELLED':
        return 'Cancelado';

      default:
        return status || 'Sin estado';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED':
      case 'PAID':
        return 'status-paid';

      case 'REJECTED':
        return 'status-rejected';

      case 'PENDING':
        return 'status-pending';

      case 'CANCELLED':
        return 'status-cancelled';

      default:
        return 'status-default';
    }
  }

  returnToOrigin(): void {
    const callbackUrl = this.result?.callbackUrl;

    if (callbackUrl) {
      window.location.href = this.normalizeExternalUrl(callbackUrl);
      return;
    }

    this.router.navigate(['/']);
  }

  private normalizeExternalUrl(url: string): string {
    const cleanUrl = url.trim();

    if (
      cleanUrl.startsWith('http://') ||
      cleanUrl.startsWith('https://')
    ) {
      return cleanUrl;
    }

    return `https://${cleanUrl}`;
  }

  printReceipt(): void {
    if (!this.isApproved()) {
      return;
    }

    window.print();
  }
}