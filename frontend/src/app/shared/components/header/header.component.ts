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
                <a routerLink="/shop-owner/register" class="nav-link">For Shop Owners</a>
              }
            </nav>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: var(--bg-primary);
      box-shadow: var(--shadow-sm);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.95);
    }
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
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
      color: var(--text-primary);
      display: flex;
      align-items: center;
    }
    .logo h1 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.02em;
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
      gap: 0.5rem;
      align-items: center;
    }
    .nav-link {
      text-decoration: none;
      color: var(--text-secondary);
      font-size: 0.9375rem;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
    }
    .nav-link:hover {
      color: var(--primary-color);
      background: var(--bg-tertiary);
    }
    .nav-link.button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem 1rem;
      font-size: 0.9375rem;
      font-weight: 500;
    }
    .nav-link.button:hover {
      background: var(--bg-tertiary);
    }
    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }
      .header-content {
        flex-wrap: wrap;
        gap: 1rem;
      }
      .header-actions {
        width: 100%;
        justify-content: space-between;
      }
      .nav {
        flex-wrap: wrap;
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
