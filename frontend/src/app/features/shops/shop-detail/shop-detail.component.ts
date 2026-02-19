import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../../../core/services/shop.service';
import { Shop } from '../../../core/models/shop.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-shop-detail',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="shop-detail-container">
      <div class="container">
        <button (click)="goBack()" class="back-button">← Back</button>
        
        @if (loading()) {
          <app-loading-spinner></app-loading-spinner>
        } @else if (shop()) {
          <div class="shop-detail">
            <div class="shop-header">
              <div class="shop-logo-large">
                @if (shop()!.logoUrl) {
                  <img [src]="shop()!.logoUrl" [alt]="shop()!.name" />
                } @else {
                  <span class="shop-initial-large">{{ shop()!.name.charAt(0).toUpperCase() }}</span>
                }
              </div>
              <div class="shop-header-info">
                <h1 class="shop-title">
                  {{ shop()!.name }}
                  @if (shop()!.isVerified) {
                    <span class="verified-badge">✓ Verified</span>
                  }
                </h1>
                <div class="shop-meta">
                  <div class="meta-item">
                    <span class="meta-icon">📍</span>
                    <span>{{ shop()!.address }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-icon">📞</span>
                    <span>{{ shop()!.phone }}</span>
                  </div>
                  @if (shop()!.whatsApp) {
                    <div class="meta-item">
                      <span class="meta-icon">💬</span>
                      <a [href]="'https://wa.me/' + shop()!.whatsApp" target="_blank">{{ shop()!.whatsApp }}</a>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        } @else {
          <p>Shop not found</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .shop-detail-container {
      padding: 2rem 0;
      min-height: calc(100vh - 200px);
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .back-button {
      background: none;
      border: 1px solid #e0e0e0;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      margin-bottom: 2rem;
      transition: all 0.3s;
    }
    .back-button:hover {
      background: #f0f0f0;
    }
    .shop-detail {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .shop-header {
      display: flex;
      gap: 2rem;
      align-items: start;
    }
    .shop-logo-large {
      width: 120px;
      height: 120px;
      border-radius: 16px;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }
    .shop-logo-large img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .shop-initial-large {
      font-size: 3rem;
      font-weight: bold;
      color: #666;
    }
    .shop-header-info {
      flex: 1;
    }
    .shop-title {
      font-size: 2rem;
      font-weight: bold;
      margin: 0 0 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .verified-badge {
      background: #10b981;
      color: white;
      font-size: 0.8rem;
      padding: 0.5rem 1rem;
      border-radius: 12px;
      font-weight: bold;
    }
    .shop-meta {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
    }
    .meta-icon {
      font-size: 1.2rem;
    }
    @media (max-width: 768px) {
      .shop-header {
        flex-direction: column;
      }
    }
  `]
})
export class ShopDetailComponent implements OnInit {
  shop = signal<Shop | null>(null);
  loading = signal<boolean>(true);

  constructor(
    private route: ActivatedRoute,
    private shopService: ShopService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadShop(slug);
    }
  }

  loadShop(slug: string): void {
    this.loading.set(true);
    this.shopService.getShopBySlug(slug).subscribe({
      next: (shop) => {
        this.shop.set(shop);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading shop:', error);
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}
