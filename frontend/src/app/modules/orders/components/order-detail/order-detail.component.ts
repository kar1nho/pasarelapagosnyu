import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { OrderStatus } from '../../../../shared/enums/order-status.enum';

@Component({
  selector: 'app-order-detail',
  standalone: false,
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading    = false;
  errorMsg   = '';
  cancelMsg  = '';

  // Enum disponible en el template
  OrderStatus = OrderStatus;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Obtiene el ID de la URL
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrder(id);
  }

  loadOrder(id: number): void {
    this.loading = true;
    this.orderService.getById(id).subscribe({
      next: (data) => {
        this.order   = data;
        this.loading = false;
      },
      error: (err: Error) => {
        this.errorMsg = err.message;
        this.loading  = false;
      }
    });
  }

  cancelOrder(): void {
    if (!this.order) return;
    this.orderService.cancel(this.order.id).subscribe({
      next: (updated) => {
        this.order    = updated;
        this.cancelMsg = 'Orden cancelada correctamente.';
      },
      error: (err: Error) => {
        this.errorMsg = err.message;
      }
    });
  }

  goToPayment(): void {
    this.router.navigate(['/payment', this.order?.id]);
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  getBadgeClass(status: string): string {
    const map: Record<string, string> = {
      PENDING:   'badge-pending',
      PAID:      'badge-paid',
      REJECTED:  'badge-rejected',
      CANCELLED: 'badge-cancelled'
    };
    return map[status] ?? 'bg-secondary';
  }
}