import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-shop-verification',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="shop-verification-container">
      <div class="container">
        <h1>Shop Verification</h1>
        @if (loading()) {
          <app-loading-spinner></app-loading-spinner>
        } @else {
          <div class="shops-list">
            @for (shop of shops(); track shop.id) {
              <div class="shop-card">
                <div class="shop-header">
                  <h3>{{ shop.name }}</h3>
                  <span [class]="'status-badge ' + (shop.isVerified ? 'verified' : 'pending')">
                    {{ shop.isVerified ? 'Verified' : 'Pending' }}
                  </span>
                </div>
                <p><strong>Address:</strong> {{ shop.address }}</p>
                <p><strong>Phone:</strong> {{ shop.phone }}</p>
                <div class="actions">
                  <button
                    (click)="verifyShop(shop.id, !shop.isVerified)"
                    [class]="shop.isVerified ? 'unverify-button' : 'verify-button'"
                  >
                    {{ shop.isVerified ? 'Unverify' : 'Verify' }}
                  </button>
                </div>
              </div>
            }
            @if (shops().length === 0) {
              <p>No pending shops</p>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .shop-verification-container {
      padding: 2rem 0;
      min-height: calc(100vh - 200px);
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .shops-list {
      display: grid;
      gap: 1.5rem;
    }
    .shop-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .shop-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: bold;
    }
    .status-badge.verified {
      background: #10b981;
      color: white;
    }
    .status-badge.pending {
      background: #f59e0b;
      color: white;
    }
    .actions {
      margin-top: 1rem;
    }
    .verify-button, .unverify-button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
    }
    .verify-button {
      background: #10b981;
      color: white;
    }
    .unverify-button {
      background: #e74c3c;
      color: white;
    }
  `]
})
export class ShopVerificationComponent implements OnInit {
  shops = signal<any[]>([]);
  loading = signal<boolean>(true);

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadPendingShops();
  }

  loadPendingShops(): void {
    this.loading.set(true);
    this.adminService.getPendingShops().subscribe({
      next: (response: any) => {
        this.shops.set(response.items || []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading pending shops:', error);
        this.loading.set(false);
      }
    });
  }

  verifyShop(shopId: string, isVerified: boolean): void {
    this.adminService.verifyShop(shopId, isVerified).subscribe({
      next: () => {
        this.loadPendingShops();
      },
      error: (error) => {
        console.error('Error verifying shop:', error);
      }
    });
  }
}
