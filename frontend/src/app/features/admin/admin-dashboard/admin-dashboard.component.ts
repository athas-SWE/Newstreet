import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="admin-dashboard-container">
      <div class="container">
        <h1>Admin Dashboard</h1>
        @if (loading()) {
          <app-loading-spinner></app-loading-spinner>
        } @else {
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Total Shops</h3>
              <p class="stat-value">{{ statistics().totalShops || 0 }}</p>
            </div>
            <div class="stat-card">
              <h3>Verified Shops</h3>
              <p class="stat-value">{{ statistics().verifiedShops || 0 }}</p>
            </div>
            <div class="stat-card">
              <h3>Total Users</h3>
              <p class="stat-value">{{ statistics().totalUsers || 0 }}</p>
            </div>
            <div class="stat-card">
              <h3>Total Products</h3>
              <p class="stat-value">{{ statistics().totalProducts || 0 }}</p>
            </div>
          </div>
          <div class="quick-actions">
            <h2>Quick Actions</h2>
            <div class="action-buttons">
              <a routerLink="/admin/shops" class="action-button">Verify Shops</a>
              <a routerLink="/admin/users" class="action-button">Manage Users</a>
              <a routerLink="/admin/cities" class="action-button">Manage Cities</a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard-container {
      padding: 2rem 0;
      min-height: calc(100vh - 200px);
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }
    .stat-card h3 {
      margin: 0 0 1rem;
      color: #666;
      font-size: 1rem;
    }
    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: #3498db;
      margin: 0;
    }
    .quick-actions {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .action-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .action-button {
      padding: 0.75rem 1.5rem;
      background: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      transition: background 0.3s;
    }
    .action-button:hover {
      background: #2980b9;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  statistics = signal<any>({});
  loading = signal<boolean>(true);

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.adminService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics.set(stats);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.loading.set(false);
      }
    });
  }
}
