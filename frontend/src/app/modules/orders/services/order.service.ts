import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
//import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Order } from '../models/order.model';
import { Observable, of } from 'rxjs';
import { OrderFilterDto } from '../models/order-filter.dto';
import { OrderStatus } from '../../../shared/enums/order-status.enum';
import { ORDERS_MOCK } from '../../../shared/mocks/orders.mock';


@Injectable({ providedIn: 'root' })
export class OrderService {
  private url = `${environment.apiUrl}/orders`;

  //cambiar a true cuando el backend esté listo
  private useMock = true;

  constructor(private http: HttpClient) {}

  getAll(filters?: OrderFilterDto): Observable<Order[]> {
    if (this.useMock) {
      let data = [...ORDERS_MOCK];
      if (filters?.status)        data = data.filter(o => o.status === filters.status);
      if (filters?.originService) data = data.filter(o => o.originService === filters.originService);
      return of(data);
    }
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null) params = params.set(k, String(v));
      });
    }
    return this.http.get<Order[]>(this.url, { params });
  }

  getById(id: number): Observable<Order> {
    if (this.useMock) {
      const order = ORDERS_MOCK.find(o => o.id === id);
      return of(order!);
    }
    return this.http.get<Order>(`${this.url}/${id}`);
  }

  cancel(id: number): Observable<Order> {
    if (this.useMock) {
      const order = ORDERS_MOCK.find(o => o.id === id);
      if (order) order.status = OrderStatus.CANCELLED;
      return of(order!);
    }
    return this.http.patch<Order>(`${this.url}/${id}/cancel`, {});
  }

  /*
  constructor(private http: HttpClient) {}

  getAll(filters?: OrderFilterDto): Observable<Order[]> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          params = params.set(k, String(v));
        }
      });
    }
    return this.http.get<Order[]>(this.url, { params });
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.url}/${id}`);
  }

  cancel(id: number): Observable<Order> {
    return this.http.patch<Order>(`${this.url}/${id}/cancel`, {});
  }
  */
}
