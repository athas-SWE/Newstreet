import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-admin-shop-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="shop-management-container">
      <div class="container">
        <div class="header-section">
          <h1>Shop Management</h1>
          <a routerLink="/admin/shops/pending" class="pending-link">
            View Pending Shops
          </a>
        </div>

        <!-- Filters -->
        <div class="filters-section">
          <div class="filter-group">
            <label for="status">Status</label>
            <select id="status" [(ngModel)]="filters.status" (change)="loadShops()" class="filter-input">
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="verified">Verification</label>
            <select id="verified" [(ngModel)]="filters.isVerified" (change)="loadShops()" class="filter-input">
              <option [value]="undefined">All</option>
              <option [value]="true">Verified</option>
              <option [value]="false">Not Verified</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="search">Search</label>
            <input
              type="text"
              id="search"
              [(ngModel)]="searchQuery"
              (keyup.enter)="loadShops()"
              placeholder="Search by shop name..."
              class="filter-input"
            />
          </div>
          <button (click)="loadShops()" class="filter-button">Apply Filters</button>
        </div>

        @if (loading()) {
          <app-loading-spinner></app-loading-spinner>
        } @else {
          <div class="shops-table-container">
            <div class="table-header">
              <p>Total Shops: {{ totalCount() }}</p>
              <div class="pagination-info">
                Showing {{ ((currentPage() - 1) * pageSize()) + 1 }} - 
                {{ Math.min(currentPage() * pageSize(), totalCount()) }} of {{ totalCount() }}
              </div>
            </div>
            <table class="shops-table">
              <thead>
                <tr>
                  <th>Shop Name</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Verified</th>
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (shop of shops(); track shop.id) {
                  <tr>
                    <td>
                      <strong>{{ shop.name }}</strong>
                    </td>
                    <td>{{ shop.address }}</td>
                    <td>{{ shop.phone }}</td>
                    <td>
                      <span [class]="'status-badge status-' + shop.status">
                        {{ shop.status }}
                      </span>
                    </td>
                    <td>
                      <span [class]="'verified-badge ' + (shop.isVerified ? 'verified' : 'pending')">
                        {{ shop.isVerified ? '✓ Verified' : 'Pending' }}
                      </span>
                    </td>
                    <td>{{ shop.citySlug || 'N/A' }}</td>
                    <td>
                      <div class="action-buttons">
                        <button
                          (click)="toggleVerification(shop.id, !shop.isVerified)"
                          [class]="shop.isVerified ? 'btn-unverify' : 'btn-verify'"
                          class="action-btn"
                        >
                          {{ shop.isVerified ? 'Unverify' : 'Verify' }}
                        </button>
                        <button
                          (click)="viewShopDetails(shop.id)"
                          class="action-btn btn-view"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                }
                @if (shops().length === 0) {
                  <tr>
                    <td colspan="7" class="no-data">No shops found</td>
                  </tr>
                }
              </tbody>
            </table>
            <div class="pagination">
              <button
                (click)="previousPage()"
                [disabled]="currentPage() === 1"
                class="pagination-btn"
              >
                Previous
              </button>
              <span class="page-info">
                Page {{ currentPage() }} of {{ totalPages() }}
              </span>
              <button
                (click)="nextPage()"
                [disabled]="currentPage() >= totalPages()"
                class="pagination-btn"
              >
                Next
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .shop-management-container {
      padding: 2rem 0;
      min-height: calc(100vh - 200px);
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .pending-link {
      padding: 0.75rem 1.5rem;
      background: #f59e0b;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-size: 0.9rem;
      transition: background 0.3s;
    }
    .pending-link:hover {
      background: #d97706;
    }
    .filters-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      align-items: end;
    }
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
      min-width: 150px;
    }
    .filter-group label {
      font-size: 0.9rem;
      font-weight: 500;
      color: #666;
    }
    .filter-input {
      padding: 0.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.9rem;
    }
    .filter-button {
      padding: 0.5rem 1.5rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      height: fit-content;
    }
    .filter-button:hover {
      background: #2980b9;
    }
    .shops-table-container {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow-x: auto;
    }
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }
    .pagination-info {
      color: #666;
      font-size: 0.9rem;
    }
    .shops-table {
      width: 100%;
      border-collapse: collapse;
    }
    .shops-table th {
      text-align: left;
      padding: 1rem;
      background: #f9f9f9;
      font-weight: 600;
      border-bottom: 2px solid #e0e0e0;
    }
    .shops-table td {
      padding: 1rem;
      border-bottom: 1px solid #f0f0f0;
    }
    .shops-table tr:hover {
      background: #f9f9f9;
    }
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: bold;
      text-transform: capitalize;
    }
    .status-active {
      background: #10b981;
      color: white;
    }
    .status-inactive {
      background: #6b7280;
      color: white;
    }
    .status-pending {
      background: #f59e0b;
      color: white;
    }
    .status-suspended {
      background: #e74c3c;
      color: white;
    }
    .verified-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: bold;
    }
    .verified-badge.verified {
      background: #10b981;
      color: white;
    }
    .verified-badge.pending {
      background: #f59e0b;
      color: white;
    }
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    .action-btn {
      padding: 0.4rem 0.8rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.3s;
    }
    .btn-verify {
      background: #10b981;
      color: white;
    }
    .btn-verify:hover {
      background: #059669;
    }
    .btn-unverify {
      background: #e74c3c;
      color: white;
    }
    .btn-unverify:hover {
      background: #c0392b;
    }
    .btn-view {
      background: #3498db;
      color: white;
    }
    .btn-view:hover {
      background: #2980b9;
    }
    .no-data {
      text-align: center;
      padding: 2rem;
      color: #999;
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e0e0e0;
    }
    .pagination-btn {
      padding: 0.5rem 1rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
    }
    .pagination-btn:hover:not(:disabled) {
      background: #2980b9;
    }
    .pagination-btn:disabled {
      background: #e0e0e0;
      color: #999;
      cursor: not-allowed;
    }
    .page-info {
      color: #666;
      font-size: 0.9rem;
    }
    @media (max-width: 768px) {
      .shops-table {
        font-size: 0.85rem;
      }
      .shops-table th,
      .shops-table td {
        padding: 0.5rem;
      }
      .filters-section {
        flex-direction: column;
      }
      .filter-group {
        width: 100%;
      }
    }
  `]
})
export class AdminShopManagementComponent implements OnInit {
  shops = signal<any[]>([]);
  loading = signal<boolean>(true);
  currentPage = signal<number>(1);
  pageSize = signal<number>(20);
  totalCount = signal<number>(0);
  searchQuery = '';
  
  filters = {
    status: '',
    isVerified: undefined as boolean | undefined
  };

  Math = Math;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadShops();
  }

  loadShops(): void {
    this.loading.set(true);
    this.adminService.getShops(
      undefined, // citySlug
      this.filters.status || undefined,
      this.filters.isVerified,
      this.currentPage(),
      this.pageSize()
    ).subscribe({
      next: (response: any) => {
        let shops = response.items || [];
        
        // Apply search filter if provided
        if (this.searchQuery.trim()) {
          const query = this.searchQuery.toLowerCase();
          shops = shops.filter((shop: any) => 
            shop.name?.toLowerCase().includes(query) ||
            shop.address?.toLowerCase().includes(query) ||
            shop.phone?.includes(query)
          );
        }
        
        this.shops.set(shops);
        this.totalCount.set(response.total || shops.length);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading shops:', error);
        this.loading.set(false);
      }
    });
  }

  toggleVerification(shopId: string, isVerified: boolean): void {
    this.adminService.verifyShop(shopId, isVerified).subscribe({
      next: () => {
        this.loadShops();
      },
      error: (error) => {
        console.error('Error verifying shop:', error);
        alert('Failed to update shop verification status');
      }
    });
  }

  viewShopDetails(shopId: string): void {
    // Navigate to shop detail page or open modal
    console.log('View shop details:', shopId);
    // You can implement a detail view or modal here
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadShops();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadShops();
    }
  }

  totalPages(): number {
    return Math.ceil(this.totalCount() / this.pageSize());
  }
}
