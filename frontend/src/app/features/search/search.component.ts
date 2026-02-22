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
      padding: 3rem 0;
      min-height: calc(100vh - 200px);
      background: var(--bg-secondary);
    }
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .search-title {
      font-size: 2.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }
    .search-query {
      color: var(--text-secondary);
      margin-bottom: 2rem;
      font-size: 1rem;
    }
    .results-info {
      margin-bottom: 2rem;
      color: var(--text-secondary);
      font-size: 0.9375rem;
      font-weight: 500;
      padding: 0.75rem 1.25rem;
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      display: inline-block;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .product-card {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-xl);
      overflow: hidden;
      transition: all 0.2s ease;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
    }
    .product-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-4px);
      border-color: var(--primary-color);
    }
    .product-image {
      width: 100%;
      height: 220px;
      object-fit: cover;
      background: var(--bg-tertiary);
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
      margin: 0 0 0.625rem;
      color: var(--text-primary);
      line-height: 1.4;
    }
    .product-description {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: 0 0 1rem;
      line-height: 1.5;
      flex: 1;
    }
    .product-price {
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--primary-color);
      margin: 0.75rem 0 0.5rem;
    }
    .product-shop {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: 0.375rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .product-stock {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: 0.375rem 0;
      font-weight: 500;
    }
    .no-results {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-secondary);
      font-size: 1.125rem;
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-color);
    }
    @media (max-width: 768px) {
      .search-container {
        padding: 2rem 0;
      }
      .products-grid {
        grid-template-columns: 1fr;
      }
      .search-title {
        font-size: 1.75rem;
      }
      .container {
        padding: 0 1rem;
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
