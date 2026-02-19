import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShopService } from '../../../core/services/shop.service';
import { ProductService } from '../../../core/services/product.service';
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
              <p><strong>Name:</strong> {{ shop()!.name }}</p>
              <p><strong>Address:</strong> {{ shop()!.address }}</p>
              <p><strong>Phone:</strong> {{ shop()!.phone }}</p>
              <p><strong>Status:</strong> {{ shop()!.status }}</p>
              <p><strong>Verified:</strong> {{ shop()!.isVerified ? 'Yes' : 'No' }}</p>
              <a routerLink="/shop-owner/shop" class="edit-button">Edit Shop</a>
            </div>
            <div class="products-section">
              <div class="section-header">
                <h2>Products</h2>
                <a routerLink="/shop-owner/products" class="manage-button">Manage Products</a>
              </div>
              <p>Total Products: {{ products().length }}</p>
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
    private shopService: ShopService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Note: This would need shop owner API endpoint
    // For now, placeholder
    this.loading.set(false);
  }
}
