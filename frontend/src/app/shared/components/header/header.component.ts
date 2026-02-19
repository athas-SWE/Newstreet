import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TenantService } from '../../../core/services/tenant.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchBarComponent],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <a routerLink="/" class="logo">
            <h1>StreetMain</h1>
          </a>
          <div class="header-actions">
            <app-search-bar></app-search-bar>
            <nav class="nav">
              @if (authService.isAuthenticated()) {
                <a routerLink="/profile" class="nav-link">Profile</a>
                @if (authService.isShopOwner()) {
                  <a routerLink="/shop-owner/dashboard" class="nav-link">My Shop</a>
                }
                @if (authService.isAdmin()) {
                  <a routerLink="/admin/dashboard" class="nav-link">Admin</a>
                }
                <button (click)="logout()" class="nav-link button">Logout</button>
              } @else {
                <a routerLink="/login" class="nav-link">Login</a>
                <a routerLink="/register" class="nav-link">Register</a>
                <a routerLink="/login" class="nav-link">For Shop Owners</a>
              }
            </nav>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      gap: 2rem;
    }
    .logo {
      text-decoration: none;
      color: #333;
    }
    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: bold;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex: 1;
      justify-content: flex-end;
    }
    .nav {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .nav-link {
      text-decoration: none;
      color: #666;
      font-size: 0.9rem;
      transition: color 0.3s;
    }
    .nav-link:hover {
      color: #3498db;
    }
    .nav-link.button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
    }
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }
      .header-actions {
        width: 100%;
        flex-direction: column;
      }
    }
  `]
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    public tenantService: TenantService
  ) {}

  logout(): void {
    this.authService.logout();
  }
}
