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
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 100;
      transition: all var(--transition-base);
    }
    .header:hover {
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
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
      padding: 1.125rem 0;
      gap: 2rem;
    }
    .logo {
      text-decoration: none;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      transition: transform var(--transition-base);
    }
    .logo:hover {
      transform: scale(1.02);
    }
    .logo h1 {
      margin: 0;
      font-size: 1.875rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.03em;
      position: relative;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.75rem;
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
      padding: 0.625rem 1.125rem;
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
      position: relative;
    }
    .nav-link::before {
      content: '';
      position: absolute;
      bottom: 0.375rem;
      left: 1.125rem;
      right: 1.125rem;
      height: 2px;
      background: var(--primary-color);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform var(--transition-base);
      border-radius: var(--radius-full);
    }
    .nav-link:hover {
      color: var(--primary-color);
      background: var(--bg-tertiary);
    }
    .nav-link:hover::before {
      transform: scaleX(1);
    }
    .nav-link.button {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      color: white;
      border: none;
      cursor: pointer;
      padding: 0.625rem 1.25rem;
      font-size: 0.9375rem;
      font-weight: 600;
      box-shadow: var(--shadow-sm);
    }
    .nav-link.button::before {
      display: none;
    }
    .nav-link.button:hover {
      background: linear-gradient(135deg, var(--primary-hover) 0%, var(--accent-hover) 100%);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    .nav-link.button:active {
      transform: translateY(0);
    }
    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }
      .header-content {
        flex-wrap: wrap;
        gap: 1rem;
        padding: 1rem 0;
      }
      .logo h1 {
        font-size: 1.625rem;
      }
      .header-actions {
        width: 100%;
        justify-content: space-between;
        gap: 1rem;
      }
      .nav {
        flex-wrap: wrap;
        gap: 0.375rem;
      }
      .nav-link {
        padding: 0.5rem 0.875rem;
        font-size: 0.875rem;
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
