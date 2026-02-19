import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShopService } from '../../core/services/shop.service';
import { ProductService } from '../../core/services/product.service';
import { TenantService } from '../../core/services/tenant.service';
import { Shop } from '../../core/models/shop.model';
import { PopularProductsResponse } from '../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, SearchBarComponent],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container">
          <h1 class="hero-title">
            Everything in <span class="city-name">{{ cityName() }}</span>,
            <br />
            <span class="hero-subtitle">at your fingertips.</span>
          </h1>
          <p class="hero-description">
            Search products across local shops. Compare prices, check stock, and discover better deals nearby.
          </p>
          <div class="search-section">
            <app-search-bar></app-search-bar>
            <div class="popular-searches">
              @for (search of popularSearches(); track search) {
                <a [routerLink]="['/search']" [queryParams]="{q: search}" class="search-chip">{{ search }}</a>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- Shops Section -->
      <section class="shops-section">
        <div class="container">
          <div class="section-header">
            <div>
              <h2 class="section-title">Local Shops</h2>
              <p class="section-subtitle">Discover sellers in {{ cityName() }}</p>
            </div>
            <div class="shop-count">
              {{ shopCount() }} TOTAL
            </div>
          </div>

          @if (loading()) {
            <app-loading-spinner></app-loading-spinner>
          } @else {
            <!-- Alphabet Navigation -->
            <div class="alphabet-nav">
              @for (letter of alphabet(); track letter) {
                <a [href]="'#section-' + letter" class="alphabet-link">{{ letter }}</a>
              }
            </div>

            <!-- Shops by Letter -->
            @for (group of shopsByLetter(); track group.letter) {
              <section [id]="'section-' + group.letter" class="letter-section">
                <div class="letter-header">
                  <span class="letter">{{ group.letter }}</span>
                  <div class="divider"></div>
                  <span class="shop-count-small">{{ group.shops.length }} shops</span>
                </div>
                <div class="shops-grid">
                  @for (shop of group.shops; track shop.id) {
                    <a [routerLink]="['/shops', shop.slug]" class="shop-card">
                      <div class="shop-card-content">
                        <div class="shop-logo">
                          @if (shop.logoUrl) {
                            <img [src]="shop.logoUrl" [alt]="shop.name" />
                          } @else {
                            <span class="shop-initial">{{ shop.name.charAt(0).toUpperCase() }}</span>
                          }
                        </div>
                        <div class="shop-info">
                          <h3 class="shop-name">
                            {{ shop.name }}
                            @if (shop.isVerified) {
                              <span class="verified-badge">✓ Verified</span>
                            }
                          </h3>
                          <div class="shop-address">
                            <span class="address-icon">📍</span>
                            <span>{{ shop.address }}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  }
                </div>
              </section>
            }
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: calc(100vh - 200px);
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 0;
      text-align: center;
    }
    .hero-title {
      font-size: 3rem;
      font-weight: 900;
      margin-bottom: 1rem;
      line-height: 1.2;
    }
    .city-name {
      text-transform: capitalize;
    }
    .hero-subtitle {
      font-style: italic;
      font-weight: 400;
      opacity: 0.9;
    }
    .hero-description {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    .search-section {
      max-width: 600px;
      margin: 0 auto;
    }
    .popular-searches {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
      margin-top: 1rem;
    }
    .search-chip {
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 20px;
      color: white;
      text-decoration: none;
      font-size: 0.85rem;
      transition: all 0.3s;
    }
    .search-chip:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
    .shops-section {
      padding: 3rem 0;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: end;
      margin-bottom: 2rem;
    }
    .section-title {
      font-size: 2rem;
      font-weight: bold;
      margin: 0 0 0.5rem;
    }
    .section-subtitle {
      color: #666;
      margin: 0;
    }
    .shop-count {
      background: #f0f0f0;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: bold;
      color: #666;
    }
    .alphabet-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2rem;
      padding: 1rem;
      background: #f9f9f9;
      border-radius: 8px;
    }
    .alphabet-link {
      text-decoration: none;
      color: #666;
      font-weight: bold;
      padding: 0.25rem 0.5rem;
      transition: color 0.3s;
    }
    .alphabet-link:hover {
      color: #3498db;
    }
    .letter-section {
      margin-bottom: 3rem;
    }
    .letter-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      position: sticky;
      top: 80px;
      background: white;
      padding: 1rem 0;
      z-index: 10;
    }
    .letter {
      font-size: 2.5rem;
      font-weight: 900;
      color: #333;
    }
    .divider {
      flex: 1;
      height: 1px;
      background: #e0e0e0;
    }
    .shop-count-small {
      font-size: 0.7rem;
      font-weight: bold;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .shops-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .shop-card {
      text-decoration: none;
      color: inherit;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 16px;
      padding: 1.5rem;
      transition: all 0.3s;
      display: block;
    }
    .shop-card:hover {
      border-color: #3498db;
      box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
      transform: translateY(-2px);
    }
    .shop-card-content {
      display: flex;
      gap: 1rem;
      align-items: start;
    }
    .shop-logo {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
    }
    .shop-logo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .shop-initial {
      font-size: 1.5rem;
      font-weight: bold;
      color: #666;
    }
    .shop-info {
      flex: 1;
    }
    .shop-name {
      font-size: 1.1rem;
      font-weight: bold;
      margin: 0 0 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .verified-badge {
      background: #10b981;
      color: white;
      font-size: 0.7rem;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-weight: bold;
    }
    .shop-address {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }
    .address-icon {
      font-size: 0.8rem;
    }
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }
      .shops-grid {
        grid-template-columns: 1fr;
      }
      .section-header {
        flex-direction: column;
        align-items: start;
        gap: 1rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  shops = signal<Shop[]>([]);
  shopCount = signal<number>(0);
  popularSearches = signal<string[]>([]);
  loading = signal<boolean>(true);
  cityName = this.tenantService.getCityNameSignal();

  alphabet = signal<string[]>('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));

  shopsByLetter = computed(() => {
    const grouped: { letter: string; shops: Shop[] }[] = [];
    const shopsMap = new Map<string, Shop[]>();

    this.shops().forEach(shop => {
      const firstLetter = shop.name.charAt(0).toUpperCase();
      if (!shopsMap.has(firstLetter)) {
        shopsMap.set(firstLetter, []);
      }
      shopsMap.get(firstLetter)!.push(shop);
    });

    this.alphabet().forEach(letter => {
      const shops = shopsMap.get(letter) || [];
      if (shops.length > 0) {
        grouped.push({ letter, shops });
      }
    });

    return grouped;
  });

  constructor(
    private shopService: ShopService,
    private productService: ProductService,
    private tenantService: TenantService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    // Load shops
    this.shopService.getShops().subscribe({
      next: (shops) => {
        this.shops.set(shops);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading shops:', error);
        this.loading.set(false);
      }
    });

    // Load shop count
    this.shopService.getShopCount().subscribe({
      next: (count) => this.shopCount.set(count),
      error: (error) => console.error('Error loading shop count:', error)
    });

    // Load popular products
    this.productService.getPopularProducts().subscribe({
      next: (response: PopularProductsResponse) => {
        this.popularSearches.set(response.popularSearches);
      },
      error: (error) => console.error('Error loading popular products:', error)
    });
  }
}
