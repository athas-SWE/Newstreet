import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Shop } from '../../../core/models/shop.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-shop-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="shop-management-container">
      <div class="container">
        <h1>Shop Management</h1>
        @if (loading()) {
          <app-loading-spinner></app-loading-spinner>
        } @else {
          <form (ngSubmit)="onSubmit()" class="shop-form">
            <div class="form-group">
              <label for="name">Shop Name</label>
              <input type="text" id="name" [(ngModel)]="shopData.name" name="name" required class="form-input" />
            </div>
            <div class="form-group">
              <label for="address">Address</label>
              <textarea id="address" [(ngModel)]="shopData.address" name="address" required class="form-input"></textarea>
            </div>
            <div class="form-group">
              <label for="phone">Phone</label>
              <input type="tel" id="phone" [(ngModel)]="shopData.phone" name="phone" required class="form-input" />
            </div>
            <div class="form-group">
              <label for="whatsapp">WhatsApp</label>
              <input type="tel" id="whatsapp" [(ngModel)]="shopData.whatsApp" name="whatsapp" class="form-input" />
            </div>
            <div class="form-group">
              <label for="logoUrl">Logo URL</label>
              <input type="url" id="logoUrl" [(ngModel)]="shopData.logoUrl" name="logoUrl" class="form-input" />
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" [(ngModel)]="shopData.isDeliveryAvailable" name="delivery" />
                Delivery Available
              </label>
            </div>
            @if (error()) {
              <div class="error-message">{{ error() }}</div>
            }
            <button type="submit" [disabled]="saving()" class="submit-button">
              {{ saving() ? 'Saving...' : 'Save Changes' }}
            </button>
          </form>
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
      max-width: 800px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .shop-form {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    .form-input:focus {
      outline: none;
      border-color: #3498db;
    }
    textarea.form-input {
      min-height: 100px;
      resize: vertical;
    }
    .error-message {
      color: #e74c3c;
      margin-bottom: 1rem;
      padding: 0.5rem;
      background: #fee;
      border-radius: 4px;
    }
    .submit-button {
      padding: 0.75rem 2rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
    }
    .submit-button:hover:not(:disabled) {
      background: #2980b9;
    }
    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class ShopManagementComponent implements OnInit {
  shopData: Partial<Shop> = {
    name: '',
    address: '',
    phone: '',
    whatsApp: '',
    logoUrl: '',
    isDeliveryAvailable: false
  };
  loading = signal<boolean>(true);
  saving = signal<boolean>(false);
  error = signal<string>('');

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadShop();
  }

  loadShop(): void {
    this.loading.set(true);
    this.apiService.get<Shop>('shopowner/shop').subscribe({
      next: (shop) => {
        this.shopData = shop;
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading shop:', error);
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    this.saving.set(true);
    this.error.set('');

    this.apiService.put<Shop>('shopowner/shop', this.shopData).subscribe({
      next: () => {
        this.router.navigate(['/shop-owner/dashboard']);
      },
      error: (error) => {
        this.error.set('Failed to update shop');
        this.saving.set(false);
      }
    });
  }
}
