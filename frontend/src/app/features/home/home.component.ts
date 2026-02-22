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
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .hero-section {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      color: white;
      padding: 5rem 0 4rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      opacity: 0.3;
    }
    .hero-title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 800;
      margin-bottom: 1rem;
      line-height: 1.1;
      letter-spacing: -0.02em;
      position: relative;
      z-index: 1;
    }
    .city-name {
      text-transform: capitalize;
      display: inline-block;
    }
    .hero-subtitle {
      font-style: italic;
      font-weight: 400;
      opacity: 0.95;
      font-size: clamp(1.25rem, 2vw, 1.5rem);
    }
    .hero-description {
      font-size: 1.125rem;
      margin-bottom: 2.5rem;
      opacity: 0.9;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      z-index: 1;
    }
    .search-section {
      max-width: 700px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }
    .popular-searches {
      display: flex;
      flex-wrap: wrap;
      gap: 0.625rem;
      justify-content: center;
      margin-top: 1.5rem;
    }
    .search-chip {
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 2rem;
      color: white;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    .search-chip:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .shops-section {
      padding: 4rem 0;
      background: var(--bg-secondary);
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2.5rem;
      gap: 1.5rem;
    }
    .section-title {
      font-size: 2.25rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }
    .section-subtitle {
      color: var(--text-secondary);
      margin: 0;
      font-size: 1rem;
    }
    .shop-count {
      background: var(--bg-primary);
      padding: 0.625rem 1.25rem;
      border-radius: var(--radius-lg);
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-secondary);
      border: 1px solid var(--border-color);
      white-space: nowrap;
    }
    .alphabet-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2.5rem;
      padding: 1.25rem;
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
    }
    .alphabet-link {
      text-decoration: none;
      color: var(--text-secondary);
      font-weight: 600;
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
      font-size: 0.875rem;
    }
    .alphabet-link:hover {
      color: var(--primary-color);
      background: var(--bg-tertiary);
      transform: translateY(-1px);
    }
    .letter-section {
      margin-bottom: 4rem;
    }
    .letter-header {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      margin-bottom: 1.75rem;
      position: sticky;
      top: 80px;
      background: var(--bg-secondary);
      padding: 1.25rem 0;
      z-index: 10;
    }
    .letter {
      font-size: 3rem;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: -0.03em;
      line-height: 1;
    }
    .divider {
      flex: 1;
      height: 2px;
      background: linear-gradient(90deg, var(--border-color) 0%, transparent 100%);
    }
    .shop-count-small {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .shops-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .shop-card {
      text-decoration: none;
      color: inherit;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      transition: all 0.2s ease;
      display: block;
      box-shadow: var(--shadow-sm);
    }
    .shop-card:hover {
      border-color: var(--primary-color);
      box-shadow: var(--shadow-lg);
      transform: translateY(-4px);
    }
    .shop-card-content {
      display: flex;
      gap: 1.25rem;
      align-items: flex-start;
    }
    .shop-logo {
      width: 72px;
      height: 72px;
      border-radius: var(--radius-lg);
      background: var(--bg-tertiary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
      border: 1px solid var(--border-color);
    }
    .shop-logo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .shop-initial {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-secondary);
    }
    .shop-info {
      flex: 1;
      min-width: 0;
    }
    .shop-name {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 0.625rem;
      display: flex;
      align-items: center;
      gap: 0.625rem;
      flex-wrap: wrap;
      color: var(--text-primary);
    }
    .verified-badge {
      background: linear-gradient(135deg, var(--success-color) 0%, #059669 100%);
      color: white;
      font-size: 0.6875rem;
      padding: 0.25rem 0.625rem;
      border-radius: 1rem;
      font-weight: 600;
      white-space: nowrap;
      box-shadow: var(--shadow-sm);
    }
    .shop-address {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
    }
    .address-icon {
      font-size: 0.875rem;
      flex-shrink: 0;
    }
    @media (max-width: 768px) {
      .hero-section {
        padding: 3rem 0 2.5rem;
      }
      .shops-section {
        padding: 2.5rem 0;
      }
      .shops-grid {
        grid-template-columns: 1fr;
      }
      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      .section-title {
        font-size: 1.75rem;
      }
      .letter {
        font-size: 2.25rem;
      }
      .container {
        padding: 0 1rem;
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
