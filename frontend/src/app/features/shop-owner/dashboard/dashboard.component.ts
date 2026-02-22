import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Shop } from '../../../core/models/shop.model';
import { Product } from '../../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-shop-owner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="dashboard-container">
      <div class="container">
        <h1>Shop Owner Dashboard</h1>
        @if (loading()) {
          <app-loading-spinner></app-loading-spinner>
        } @else if (shop()) {
          <div class="dashboard-content">
            <div class="shop-info-card">
              <h2>My Shop</h2>
              <div class="shop-details">
                <div class="detail-row">
                  <span class="label">Shop Name:</span>
                  <span class="value">{{ shop()!.name }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Address:</span>
                  <span class="value">{{ shop()!.address }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Phone:</span>
                  <span class="value">{{ shop()!.phone }}</span>
                </div>
                @if (shop()!.whatsApp) {
                  <div class="detail-row">
                    <span class="label">WhatsApp:</span>
                    <span class="value">{{ shop()!.whatsApp }}</span>
                  </div>
                }
                <div class="detail-row">
                  <span class="label">Status:</span>
                  <span [class]="'status-badge status-' + shop()!.status.toLowerCase()">
                    {{ shop()!.status }}
                  </span>
                </div>
                <div class="detail-row">
                  <span class="label">Verified:</span>
                  <span [class]="'verified-badge ' + (shop()!.isVerified ? 'verified' : 'pending')">
                    {{ shop()!.isVerified ? '✓ Verified' : 'Pending' }}
                  </span>
                </div>
                <div class="detail-row">
                  <span class="label">Delivery:</span>
                  <span class="value">{{ shop()!.isDeliveryAvailable ? 'Available' : 'Not Available' }}</span>
                </div>
              </div>
              <a routerLink="/shop-owner/shop" class="edit-button">Edit Shop Details</a>
            </div>
            <div class="products-section">
              <div class="section-header">
                <h2>Products ({{ products().length }})</h2>
                <a routerLink="/shop-owner/products" class="manage-button">Manage Products</a>
              </div>
              @if (products().length > 0) {
                <div class="products-grid">
                  @for (product of products(); track product.id) {
                    <div class="product-card">
                      @if (product.imageUrl1) {
                        <img [src]="product.imageUrl1" [alt]="product.name" class="product-image" />
                      } @else if (product.imageUrl2) {
                        <img [src]="product.imageUrl2" [alt]="product.name" class="product-image" />
                      } @else {
                        <div class="product-image-placeholder">No Image</div>
                      }
                      <div class="product-info">
                        <h3>{{ product.name }}</h3>
                        @if (product.description) {
                          <p class="product-description">{{ product.description }}</p>
                        }
                        <div class="product-details">
                          @if (product.price) {
                            <p class="product-price">Rs. {{ product.price | number:'1.2-2' }}</p>
                          }
                          @if (product.stock !== undefined) {
                            <p class="product-stock">Stock: {{ product.stock }}</p>
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <p class="no-products">No products yet. <a routerLink="/shop-owner/products">Add your first product</a></p>
              }
            </div>
          </div>
        } @else {
          <p>No shop found. Please create a shop.</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem 0;
      min-height: calc(100vh - 200px);
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    h1 {
      margin-bottom: 2rem;
    }
    .dashboard-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    .shop-info-card, .products-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .shop-details {
      margin-bottom: 1.5rem;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .label {
      font-weight: 500;
      color: #666;
    }
    .value {
      color: #333;
      text-align: right;
    }
    .status-badge, .verified-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    .status-badge.status-active {
      background: #10b981;
      color: white;
    }
    .status-badge.status-pending {
      background: #f59e0b;
      color: white;
    }
    .status-badge.status-inactive {
      background: #6b7280;
      color: white;
    }
    .verified-badge.verified {
      background: #10b981;
      color: white;
    }
    .verified-badge.pending {
      background: #f59e0b;
      color: white;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }
    .product-card {
      background: #f9f9f9;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    .product-image {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }
    .product-image-placeholder {
      width: 100%;
      height: 150px;
      background: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
    }
    .product-info {
      padding: 1rem;
    }
    .product-info h3 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
      color: #333;
    }
    .product-description {
      font-size: 0.85rem;
      color: #666;
      margin: 0 0 0.75rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .product-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .product-price {
      font-weight: bold;
      color: #3498db;
      margin: 0;
      font-size: 1rem;
    }
    .product-stock {
      font-size: 0.85rem;
      color: #666;
      margin: 0;
    }
    .no-products {
      text-align: center;
      color: #666;
      padding: 2rem;
    }
    .no-products a {
      color: #3498db;
      text-decoration: none;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .edit-button, .manage-button {
      padding: 0.5rem 1rem;
      background: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-size: 0.9rem;
    }
    .edit-button:hover, .manage-button:hover {
      background: #2980b9;
    }
    @media (max-width: 768px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  shop = signal<Shop | null>(null);
  products = signal<Product[]>([]);
  loading = signal<boolean>(true);

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadShopAndProducts();
  }

  loadShopAndProducts(): void {
    this.loading.set(true);
    
    // Load shop details
    this.apiService.get<Shop>('shopowner/shop').subscribe({
      next: (shop) => {
        this.shop.set(shop);
        // After shop is loaded, load products
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error loading shop:', error);
        this.loading.set(false);
      }
    });
  }

  loadProducts(): void {
    this.apiService.get<Product[]>('shopowner/products').subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products.set([]);
        this.loading.set(false);
      }
    });
  }
}
