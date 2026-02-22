import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ShopService } from '../../../core/services/shop.service';
import { ProductService } from '../../../core/services/product.service';
import { Shop } from '../../../core/models/shop.model';
import { Product } from '../../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-shop-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
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

            <!-- Products Section -->
            <div class="products-section">
              <h2 class="products-title">Products</h2>
              @if (loadingProducts()) {
                <app-loading-spinner></app-loading-spinner>
              } @else if (products().length > 0) {
                <div class="products-grid">
                  @for (product of products(); track product.id) {
                    <a [routerLink]="['/products', product.id]" class="product-card">
                      @if (product.imageUrl1) {
                        <img [src]="product.imageUrl1" [alt]="product.name" class="product-image" />
                      } @else if (product.imageUrl2) {
                        <img [src]="product.imageUrl2" [alt]="product.name" class="product-image" />
                      } @else {
                        <div class="product-image-placeholder">
                          <span class="product-initial">{{ product.name.charAt(0).toUpperCase() }}</span>
                        </div>
                      }
                      <div class="product-info">
                        <h3 class="product-name">{{ product.name }}</h3>
                        @if (product.description) {
                          <p class="product-description">{{ product.description }}</p>
                        }
                        <div class="product-footer">
                          @if (product.price) {
                            <p class="product-price">Rs. {{ product.price | number:'1.2-2' }}</p>
                          }
                          @if (product.stock !== undefined && product.stock !== null) {
                            <p class="product-stock" [class.in-stock]="product.stock > 0" [class.out-of-stock]="product.stock === 0">
                              {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
                            </p>
                          }
                        </div>
                      </div>
                    </a>
                  }
                </div>
              } @else {
                <p class="no-products">No products available in this shop</p>
              }
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
    .products-section {
      margin-top: 3rem;
      padding-top: 3rem;
      border-top: 2px solid #f0f0f0;
    }
    .products-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 2rem;
      color: var(--text-primary, #1a1a1a);
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .product-card {
      background: var(--bg-primary, #ffffff);
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }
    .product-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
      border-color: var(--primary-color, #3b82f6);
    }
    .product-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      background: var(--bg-tertiary, #f5f5f5);
    }
    .product-image-placeholder {
      width: 100%;
      height: 200px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .product-initial {
      font-size: 3rem;
      font-weight: 700;
      color: white;
    }
    .product-info {
      padding: 1.25rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .product-name {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      color: var(--text-primary, #1a1a1a);
      line-height: 1.4;
    }
    .product-description {
      color: var(--text-secondary, #666);
      font-size: 0.875rem;
      margin: 0 0 1rem;
      line-height: 1.5;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }
    .product-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-color, #3b82f6);
      margin: 0;
    }
    .product-stock {
      font-size: 0.875rem;
      font-weight: 500;
      margin: 0;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
    }
    .product-stock.in-stock {
      color: #10b981;
      background: #d1fae5;
    }
    .product-stock.out-of-stock {
      color: #ef4444;
      background: #fee2e2;
    }
    .no-products {
      text-align: center;
      padding: 3rem 2rem;
      color: var(--text-secondary, #666);
      font-size: 1.125rem;
      background: var(--bg-secondary, #f9fafb);
      border-radius: 12px;
      border: 1px dashed var(--border-color, #e0e0e0);
    }
    @media (max-width: 768px) {
      .shop-header {
        flex-direction: column;
      }
      .products-grid {
        grid-template-columns: 1fr;
      }
      .products-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class ShopDetailComponent implements OnInit {
  shop = signal<Shop | null>(null);
  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  loadingProducts = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private shopService: ShopService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadShop(slug);
      this.loadProducts(slug);
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

  loadProducts(slug: string): void {
    this.loadingProducts.set(true);
    this.productService.getProductsByShopSlug(slug).subscribe({
      next: (products) => {
        this.products.set(products);
        this.loadingProducts.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loadingProducts.set(false);
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}
