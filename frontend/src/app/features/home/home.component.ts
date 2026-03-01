import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShopService } from '../../core/services/shop.service';
import { IndustryService } from '../../core/services/industry.service';
import { ProductService } from '../../core/services/product.service';
import { TenantService } from '../../core/services/tenant.service';
import { Shop } from '../../core/models/shop.model';
import { Industry } from '../../core/models/industry.model';
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

          <!-- Industry Filter -->
          @if (industries().length > 0) {
            <div class="industry-filter">
              <button
                type="button"
                [class.active]="selectedIndustryId() === null"
                (click)="filterByIndustry(null)"
                class="industry-chip"
              >
                All Industries
              </button>
              @for (industry of industries(); track industry.id) {
                <button
                  type="button"
                  [class.active]="selectedIndustryId() === industry.id"
                  (click)="filterByIndustry(industry.id)"
                  class="industry-chip"
                >
                  @if (industry.iconUrl) {
                    <img [src]="industry.iconUrl" [alt]="industry.name" class="industry-icon" />
                  }
                  {{ industry.name }}
                </button>
              }
            </div>
          }

          @if (loading()) {
            <app-loading-spinner></app-loading-spinner>
          } @else {
            <!-- Shops by Industry -->
            @if (selectedIndustryId() === null) {
              <!-- Show all shops grouped by industry -->
              @for (group of shopsByIndustry(); track group.industryId) {
                <section [id]="'industry-' + group.industryId" class="industry-section">
                  <div class="industry-header">
                    @if (group.industry) {
                      <div class="industry-title-section">
                        @if (group.industry.iconUrl) {
                          <img [src]="group.industry.iconUrl" [alt]="group.industry.name" class="industry-header-icon" />
                        }
                        <h3 class="industry-title">{{ group.industry.name }}</h3>
                      </div>
                    } @else {
                      <h3 class="industry-title">Other Shops</h3>
                    }
                    <div class="divider"></div>
                    <span class="shop-count-small">{{ group.shops.length }} {{ group.shops.length === 1 ? 'shop' : 'shops' }}</span>
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
            } @else {
              <!-- Show filtered shops for selected industry -->
              <div class="shops-grid">
                @for (shop of shops(); track shop.id) {
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
              @if (shops().length === 0) {
                <div class="no-shops-message">
                  <p>No shops found in this industry.</p>
                </div>
              }
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
      padding: 6rem 0 5rem;
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
      opacity: 0.4;
      animation: patternMove 20s linear infinite;
    }
    @keyframes patternMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(60px, 60px); }
    }
    .hero-section::after {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      animation: float 15s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(-20px, -20px) scale(1.1); }
    }
    .hero-title {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 800;
      margin-bottom: 1.25rem;
      line-height: 1.1;
      letter-spacing: -0.03em;
      position: relative;
      z-index: 1;
      text-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    .city-name {
      text-transform: capitalize;
      display: inline-block;
      background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
    }
    .hero-subtitle {
      font-style: italic;
      font-weight: 400;
      opacity: 0.95;
      font-size: clamp(1.375rem, 2.5vw, 1.75rem);
      font-weight: 300;
      letter-spacing: 0.01em;
    }
    .hero-description {
      font-size: 1.125rem;
      margin-bottom: 3rem;
      opacity: 0.95;
      max-width: 650px;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      z-index: 1;
      line-height: 1.7;
      font-weight: 400;
    }
    .search-section {
      max-width: 750px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }
    .popular-searches {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: center;
      margin-top: 2rem;
    }
    .search-chip {
      padding: 0.625rem 1.25rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: var(--radius-full);
      color: white;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all var(--transition-base);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .search-chip:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
    }
    .search-chip:active {
      transform: translateY(-1px) scale(1);
    }
    .shops-section {
      padding: 5rem 0;
      background: var(--bg-secondary);
      position: relative;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 3rem;
      gap: 1.5rem;
    }
    .section-title {
      font-size: clamp(1.875rem, 4vw, 2.5rem);
      font-weight: 700;
      margin: 0 0 0.75rem;
      color: var(--text-primary);
      letter-spacing: -0.03em;
      line-height: 1.2;
    }
    .section-subtitle {
      color: var(--text-secondary);
      margin: 0;
      font-size: 1.0625rem;
      font-weight: 400;
      line-height: 1.5;
    }
    .shop-count {
      background: var(--bg-primary);
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-lg);
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-secondary);
      border: 1px solid var(--border-color);
      white-space: nowrap;
      box-shadow: var(--shadow-sm);
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: all var(--transition-base);
    }
    .shop-count:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }
    .industry-section {
      margin-bottom: 5rem;
    }
    .industry-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
      position: sticky;
      top: 80px;
      background: var(--bg-secondary);
      padding: 1.5rem 0;
      z-index: 10;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    .industry-title-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .industry-header-icon {
      width: 36px;
      height: 36px;
      object-fit: contain;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
    .industry-title {
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }
    .divider {
      flex: 1;
      height: 2px;
      background: linear-gradient(90deg, var(--border-color) 0%, transparent 100%);
      border-radius: var(--radius-full);
    }
    .shop-count-small {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 0.375rem 0.75rem;
      background: var(--bg-primary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
    }
    .shops-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.75rem;
    }
    .shop-card {
      text-decoration: none;
      color: inherit;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-xl);
      padding: 1.75rem;
      transition: all var(--transition-base);
      display: block;
      box-shadow: var(--shadow-sm);
      position: relative;
      overflow: hidden;
    }
    .shop-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
      transform: scaleX(0);
      transform-origin: left;
      transition: transform var(--transition-base);
    }
    .shop-card:hover {
      border-color: var(--primary-color);
      box-shadow: var(--shadow-xl);
      transform: translateY(-6px);
    }
    .shop-card:hover::before {
      transform: scaleX(1);
    }
    .shop-card-content {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
    }
    .shop-logo {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-xl);
      background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
      border: 2px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-base);
    }
    .shop-card:hover .shop-logo {
      border-color: var(--primary-color);
      box-shadow: var(--shadow-md);
      transform: scale(1.05);
    }
    .shop-logo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .shop-initial {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-color);
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .shop-info {
      flex: 1;
      min-width: 0;
    }
    .shop-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      color: var(--text-primary);
      line-height: 1.3;
    }
    .verified-badge {
      background: linear-gradient(135deg, var(--success-color) 0%, var(--success-hover) 100%);
      color: white;
      font-size: 0.6875rem;
      padding: 0.375rem 0.75rem;
      border-radius: var(--radius-full);
      font-weight: 600;
      white-space: nowrap;
      box-shadow: var(--shadow-sm);
      letter-spacing: 0.02em;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }
    .shop-address {
      display: flex;
      align-items: flex-start;
      gap: 0.625rem;
      color: var(--text-secondary);
      font-size: 0.9375rem;
      line-height: 1.6;
    }
    .address-icon {
      font-size: 1rem;
      flex-shrink: 0;
      margin-top: 0.125rem;
      opacity: 0.7;
    }
    .industry-filter {
      display: flex;
      flex-wrap: wrap;
      gap: 0.875rem;
      margin-bottom: 2.5rem;
      padding: 1.25rem;
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
    }
    .industry-chip {
      padding: 0.75rem 1.5rem;
      background: var(--bg-secondary);
      border: 1.5px solid var(--border-color);
      border-radius: var(--radius-lg);
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-base);
      display: flex;
      align-items: center;
      gap: 0.625rem;
      box-shadow: var(--shadow-xs);
    }
    .industry-chip:hover {
      background: var(--bg-tertiary);
      border-color: var(--primary-color);
      color: var(--primary-color);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    .industry-chip.active {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      border-color: var(--primary-color);
      color: white;
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }
    .industry-chip.active:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-lg);
    }
    .industry-icon {
      width: 18px;
      height: 18px;
      object-fit: contain;
      filter: brightness(0) saturate(100%);
      transition: filter var(--transition-base);
    }
    .industry-chip.active .industry-icon {
      filter: brightness(0) invert(1);
    }
    .shop-industry {
      margin-bottom: 0.5rem;
    }
    .industry-badge {
      display: inline-block;
      padding: 0.25rem 0.625rem;
      background: var(--bg-tertiary);
      color: var(--text-secondary);
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 500;
    }
    .no-shops-message {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-secondary);
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      border: 1px dashed var(--border-color);
    }
    .no-shops-message p {
      font-size: 1.125rem;
      margin: 0;
      font-weight: 500;
    }
    @media (max-width: 768px) {
      .hero-section {
        padding: 4rem 0 3rem;
      }
      .hero-title {
        margin-bottom: 1rem;
      }
      .hero-description {
        margin-bottom: 2rem;
        font-size: 1rem;
      }
      .shops-section {
        padding: 3rem 0;
      }
      .shops-grid {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }
      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1.25rem;
        margin-bottom: 2rem;
      }
      .section-title {
        font-size: 1.875rem;
      }
      .industry-title {
        font-size: 1.5rem;
      }
      .industry-header {
        padding: 1rem 0;
      }
      .container {
        padding: 0 1rem;
      }
      .shop-card {
        padding: 1.5rem;
      }
      .shop-logo {
        width: 64px;
        height: 64px;
      }
      .industry-filter {
        padding: 1rem;
        gap: 0.625rem;
      }
      .industry-chip {
        padding: 0.625rem 1.25rem;
        font-size: 0.8125rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  shops = signal<Shop[]>([]);
  allShops = signal<Shop[]>([]);
  shopCount = signal<number>(0);
  popularSearches = signal<string[]>([]);
  loading = signal<boolean>(true);
  industries = signal<Industry[]>([]);
  selectedIndustryId = signal<string | null>(null);
  cityName = this.tenantService.getCityNameSignal();

  shopsByIndustry = computed(() => {
    const grouped: { industryId: string; industry: Industry | null; shops: Shop[] }[] = [];
    const shopsMap = new Map<string, Shop[]>();
    const industryMap = new Map<string, Industry>();

    // Create industry map for quick lookup
    this.industries().forEach(industry => {
      industryMap.set(industry.id, industry);
    });

    // Group shops by industry
    this.shops().forEach(shop => {
      const industryId = shop.industryId || 'other';
      if (!shopsMap.has(industryId)) {
        shopsMap.set(industryId, []);
      }
      shopsMap.get(industryId)!.push(shop);
    });

    // Create groups with industry info
    shopsMap.forEach((shops, industryId) => {
      const industry = industryId === 'other' ? null : industryMap.get(industryId) || null;
      grouped.push({
        industryId,
        industry,
        shops: shops.sort((a, b) => a.name.localeCompare(b.name))
      });
    });

    // Sort groups: industries first (by name), then "other" at the end
    return grouped.sort((a, b) => {
      if (a.industryId === 'other') return 1;
      if (b.industryId === 'other') return -1;
      if (a.industry && b.industry) {
        return a.industry.name.localeCompare(b.industry.name);
      }
      return 0;
    });
  });

  constructor(
    private shopService: ShopService,
    private industryService: IndustryService,
    private productService: ProductService,
    private tenantService: TenantService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    // Load industries
    this.industryService.getIndustries().subscribe({
      next: (industries) => {
        this.industries.set(industries);
      },
      error: (error) => console.error('Error loading industries:', error)
    });

    // Load shops
    this.shopService.getShops().subscribe({
      next: (shops) => {
        this.allShops.set(shops);
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

  filterByIndustry(industryId: string | null): void {
    this.selectedIndustryId.set(industryId);
    
    if (industryId === null) {
      this.shops.set(this.allShops());
    } else {
      this.loading.set(true);
      this.shopService.getShopsByIndustry(industryId).subscribe({
        next: (shops) => {
          this.shops.set(shops);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading shops by industry:', error);
          this.loading.set(false);
        }
      });
    }
  }
}
