import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ShopService } from '../../../core/services/shop.service';
import { Shop } from '../../../core/models/shop.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="profile-container">
      <div class="container">
        <h1>Profile</h1>
        @if (authService.user(); as user) {
          <div class="profile-card">
            <div class="profile-header">
              <div class="profile-info">
                <h2 class="profile-title">User Information</h2>
                <p><strong>Email:</strong> {{ user.email }}</p>
                <p><strong>Role:</strong> {{ user.role }}</p>
              </div>
            </div>

            @if (authService.isShopOwner() && loadingShop()) {
              <div class="shop-section">
                <app-loading-spinner></app-loading-spinner>
              </div>
            } @else if (authService.isShopOwner() && shop()) {
              <div class="shop-section">
                <h2 class="shop-title">My Shop</h2>
                <div class="shop-info">
                  <div class="shop-logo-container">
                    @if (shop()!.logoUrl) {
                      <img [src]="shop()!.logoUrl" [alt]="shop()!.name" class="shop-logo" />
                    } @else {
                      <div class="shop-logo-placeholder">
                        <span class="shop-initial">{{ shop()!.name.charAt(0).toUpperCase() }}</span>
                      </div>
                    }
                  </div>
                  <div class="shop-details">
                    <h3 class="shop-name">
                      {{ shop()!.name }}
                      @if (shop()!.isVerified) {
                        <span class="verified-badge">✓ Verified</span>
                      }
                    </h3>
                    <p class="shop-address">
                      <span class="icon">📍</span>
                      {{ shop()!.address }}
                    </p>
                    <p class="shop-phone">
                      <span class="icon">📞</span>
                      {{ shop()!.phone }}
                    </p>
                    @if (shop()!.whatsApp) {
                      <p class="shop-whatsapp">
                        <span class="icon">💬</span>
                        <a [href]="'https://wa.me/' + shop()!.whatsApp" target="_blank">{{ shop()!.whatsApp }}</a>
                      </p>
                    }
                    <div class="shop-status">
                      <span class="status-badge" [class.active]="shop()!.status === 'active'" [class.inactive]="shop()!.status !== 'active'">
                        {{ shop()!.status }}
                      </span>
                      @if (shop()!.isDeliveryAvailable) {
                        <span class="delivery-badge">🚚 Delivery Available</span>
                      }
                    </div>
                    <a [routerLink]="['/shop-owner/dashboard']" class="manage-shop-button">Manage Shop</a>
                  </div>
                </div>
              </div>
            }

            <button (click)="logout()" class="logout-button">Logout</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem 0;
      min-height: calc(100vh - 200px);
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    h1 {
      margin-bottom: 2rem;
    }
    .profile-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .profile-header {
      margin-bottom: 2rem;
    }
    .profile-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 1rem;
      color: var(--text-primary, #1a1a1a);
    }
    .profile-info p {
      margin: 0.75rem 0;
      font-size: 1.1rem;
      color: var(--text-secondary, #666);
    }
    .shop-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid #f0f0f0;
    }
    .shop-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 1.5rem;
      color: var(--text-primary, #1a1a1a);
    }
    .shop-info {
      display: flex;
      gap: 2rem;
      align-items: flex-start;
    }
    .shop-logo-container {
      flex-shrink: 0;
    }
    .shop-logo {
      width: 120px;
      height: 120px;
      border-radius: 12px;
      object-fit: cover;
      border: 2px solid #e0e0e0;
    }
    .shop-logo-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #e0e0e0;
    }
    .shop-initial {
      font-size: 3rem;
      font-weight: 700;
      color: white;
    }
    .shop-details {
      flex: 1;
    }
    .shop-name {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 1rem;
      color: var(--text-primary, #1a1a1a);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .verified-badge {
      background: #10b981;
      color: white;
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-weight: 600;
    }
    .shop-details p {
      margin: 0.75rem 0;
      font-size: 1rem;
      color: var(--text-secondary, #666);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .icon {
      font-size: 1.125rem;
    }
    .shop-whatsapp a {
      color: #25D366;
      text-decoration: none;
    }
    .shop-whatsapp a:hover {
      text-decoration: underline;
    }
    .shop-status {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      margin: 1rem 0;
      flex-wrap: wrap;
    }
    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    .status-badge.active {
      background: #d1fae5;
      color: #065f46;
    }
    .status-badge.inactive {
      background: #fee2e2;
      color: #991b1b;
    }
    .delivery-badge {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      background: #dbeafe;
      color: #1e40af;
      font-size: 0.875rem;
      font-weight: 600;
    }
    .manage-shop-button {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      background: var(--primary-color, #3b82f6);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s;
    }
    .manage-shop-button:hover {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
    .logout-button {
      margin-top: 2rem;
      padding: 0.75rem 1.5rem;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.3s;
    }
    .logout-button:hover {
      background: #c0392b;
    }
    @media (max-width: 768px) {
      .shop-info {
        flex-direction: column;
      }
      .shop-logo, .shop-logo-placeholder {
        width: 100px;
        height: 100px;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  shop = signal<Shop | null>(null);
  loadingShop = signal<boolean>(false);

  constructor(
    public authService: AuthService,
    private shopService: ShopService
  ) {}

  ngOnInit(): void {
    if (this.authService.isShopOwner()) {
      this.loadShop();
    }
  }

  loadShop(): void {
    this.loadingShop.set(true);
    this.shopService.getMyShop().subscribe({
      next: (shop) => {
        this.shop.set(shop);
        this.loadingShop.set(false);
      },
      error: (error) => {
        console.error('Error loading shop:', error);
        this.loadingShop.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
