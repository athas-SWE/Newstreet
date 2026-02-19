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
                @if (product.imageUrl) {
                  <img [src]="product.imageUrl" [alt]="product.name" class="product-image" />
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
      padding: 2rem 0;
      min-height: calc(100vh - 200px);
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .search-title {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    .search-query {
      color: #666;
      margin-bottom: 2rem;
    }
    .results-info {
      margin-bottom: 1.5rem;
      color: #666;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .product-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s;
    }
    .product-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }
    .product-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .product-info {
      padding: 1rem;
    }
    .product-name {
      font-size: 1.1rem;
      font-weight: bold;
      margin: 0 0 0.5rem;
    }
    .product-description {
      color: #666;
      font-size: 0.9rem;
      margin: 0 0 0.5rem;
    }
    .product-price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #3498db;
      margin: 0.5rem 0;
    }
    .product-shop {
      color: #666;
      font-size: 0.85rem;
      margin: 0.25rem 0;
    }
    .product-stock {
      color: #666;
      font-size: 0.85rem;
      margin: 0.25rem 0;
    }
    .no-results {
      text-align: center;
      padding: 3rem;
      color: #666;
      font-size: 1.1rem;
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
