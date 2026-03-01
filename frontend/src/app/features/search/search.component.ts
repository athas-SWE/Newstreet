import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product, SearchResponse } from '../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="search-container">
      <div class="container">
        <h1 class="search-title">Search Results</h1>
        @if (query()) {
          <p class="search-query">Searching for: "{{ query() }}"</p>
        }

        @if (loading()) {
          <app-loading-spinner></app-loading-spinner>
        } @else if (products().length > 0) {
          <div class="results-info">
            <p>Found {{ totalCount() }} results</p>
          </div>
          <div class="products-grid">
            @for (product of products(); track product.id) {
              <div class="product-card">
                @if (product.imageUrl1) {
                  <img [src]="product.imageUrl1" [alt]="product.name" class="product-image" />
                } @else if (product.imageUrl2) {
                  <img [src]="product.imageUrl2" [alt]="product.name" class="product-image" />
                }
                <div class="product-info">
                  <h3 class="product-name">{{ product.name }}</h3>
                  @if (product.description) {
                    <p class="product-description">{{ product.description }}</p>
                  }
                  @if (product.price) {
                    <p class="product-price">Rs. {{ product.price }}</p>
                  }
                  @if (product.shopName) {
                    <p class="product-shop">Shop: {{ product.shopName }}</p>
                  }
                  @if (product.stock !== undefined) {
                    <p class="product-stock">Stock: {{ product.stock }}</p>
                  }
                </div>
              </div>
            }
          </div>
        } @else {
          <p class="no-results">No products found</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      padding: 4rem 0;
      min-height: calc(100vh - 200px);
      background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
    }
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .search-title {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 800;
      margin-bottom: 0.75rem;
      color: var(--text-primary);
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .search-query {
      color: var(--text-secondary);
      margin-bottom: 2.5rem;
      font-size: 1.125rem;
      font-weight: 500;
      padding: 0.75rem 1.5rem;
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      display: inline-block;
      box-shadow: var(--shadow-sm);
    }
    .search-query::before {
      content: '🔍';
      margin-right: 0.5rem;
    }
    .results-info {
      margin-bottom: 2.5rem;
      color: var(--text-primary);
      font-size: 1rem;
      font-weight: 600;
      padding: 1rem 1.75rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      color: white;
      border-radius: var(--radius-xl);
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: var(--shadow-md);
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
    }
    .product-card {
      background: var(--bg-primary);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-2xl);
      overflow: hidden;
      transition: all var(--transition-base);
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .product-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
      transform: scaleX(0);
      transform-origin: left;
      transition: transform var(--transition-base);
    }
    .product-card:hover {
      box-shadow: var(--shadow-xl);
      transform: translateY(-6px);
      border-color: var(--primary-color);
    }
    .product-card:hover::before {
      transform: scaleX(1);
    }
    .product-image {
      width: 100%;
      height: 240px;
      object-fit: cover;
      background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
      transition: transform var(--transition-slow);
    }
    .product-card:hover .product-image {
      transform: scale(1.05);
    }
    .product-info {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .product-name {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      color: var(--text-primary);
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .product-description {
      color: var(--text-secondary);
      font-size: 0.9375rem;
      margin: 0;
      line-height: 1.6;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .product-price {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary-color);
      margin: 0.5rem 0;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .product-shop {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      padding: 0.5rem 0.875rem;
      background: var(--bg-tertiary);
      border-radius: var(--radius-md);
      width: fit-content;
    }
    .product-stock {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: 0;
      font-weight: 600;
      padding: 0.375rem 0.75rem;
      background: var(--bg-tertiary);
      border-radius: var(--radius-md);
      width: fit-content;
    }
    .no-results {
      text-align: center;
      padding: 5rem 2rem;
      color: var(--text-secondary);
      font-size: 1.25rem;
      background: var(--bg-primary);
      border-radius: var(--radius-2xl);
      border: 2px dashed var(--border-color);
      box-shadow: var(--shadow-sm);
    }
    @media (max-width: 768px) {
      .search-container {
        padding: 2.5rem 0;
      }
      .products-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      .search-title {
        font-size: 1.875rem;
      }
      .container {
        padding: 0 1rem;
      }
      .product-card {
        border-radius: var(--radius-xl);
      }
    }
  `]
})
export class SearchComponent implements OnInit {
  products = signal<Product[]>([]);
  totalCount = signal<number>(0);
  query = signal<string>('');
  loading = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const q = params['q'];
      if (q) {
        this.query.set(q);
        this.search(q);
      }
    });
  }

  search(query: string): void {
    if (!query.trim()) return;

    this.loading.set(true);
    this.productService.searchProducts(query).subscribe({
      next: (response: SearchResponse) => {
        this.products.set(response.products);
        this.totalCount.set(response.totalCount);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error searching products:', error);
        this.loading.set(false);
      }
    });
  }
}
