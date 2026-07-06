import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

import { AuthService } from './core/services/auth.service';
import { SharedModule } from './shared/shared.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SharedModule],
  template: `
    <div class="d-flex">

      <app-sidebar *ngIf="showSidebar"></app-sidebar>

      <div
        class="main-content flex-grow-1"
        [class.main-with-sidebar]="showSidebar">

        <app-spinner></app-spinner>
        <router-outlet></router-outlet>

      </div>

    </div>
  `,
  styles: [`
    .main-with-sidebar {
      margin-left: 220px;
      min-height: 100vh;
      background: #F5F7FA;
    }

    .main-content {
      min-height: 100vh;
      background: #F5F7FA;
    }
  `]
})
export class AppComponent implements OnInit {

  showSidebar = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.checkSession();

    this.updateLayout();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.updateLayout();
      });
  }

  private updateLayout(): void {
    const isLoggedIn = this.authService.isAuthenticated();
    const isPaymentRoute = this.router.url.startsWith('/payment');

    this.showSidebar = isLoggedIn && !isPaymentRoute;
  }
}