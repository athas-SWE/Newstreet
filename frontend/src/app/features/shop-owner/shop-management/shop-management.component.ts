import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ImageUploadService } from '../../../core/services/image-upload.service';
import { Shop } from '../../../core/models/shop.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { LocationPickerComponent } from '../../../shared/components/location-picker/location-picker.component';

@Component({
  selector: 'app-shop-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, LocationPickerComponent],
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
              <label>Shop Logo</label>
              <div class="logo-upload-section">
                <label for="logoFile" class="logo-upload-label">
                  @if (shopData.logoUrl) {
                    <div class="logo-preview">
                      <img [src]="shopData.logoUrl" alt="Shop Logo" />
                      <button type="button" (click)="removeLogo()" class="remove-logo-btn">×</button>
                    </div>
                  } @else {
                    <div class="upload-placeholder">
                      <span>🏪</span>
                      <span>Upload Shop Logo</span>
                    </div>
                  }
                </label>
                <input type="file" id="logoFile" accept="image/*" (change)="onLogoSelected($event)" style="display: none;" />
                @if (uploadingLogo()) {
                  <div class="upload-progress">Uploading...</div>
                }
              </div>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" [(ngModel)]="shopData.isDeliveryAvailable" name="delivery" />
                Delivery Available
              </label>
            </div>
            <div class="form-group">
              <label>Shop Location (Optional)</label>
              <p class="location-description">Click on the map to set or update your shop's location</p>
              <app-location-picker
                [initialLatitude]="shopData.latitude"
                [initialLongitude]="shopData.longitude"
                (locationSelected)="onLocationSelected($event)"
              ></app-location-picker>
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
    .location-description {
      color: #666;
      font-size: 0.9rem;
      margin: 0 0 0.5rem;
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
    .logo-upload-section {
      margin-top: 0.5rem;
    }
    .logo-upload-label {
      display: block;
      cursor: pointer;
      border: 2px dashed #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      transition: border-color 0.3s;
    }
    .logo-upload-label:hover {
      border-color: #3498db;
    }
    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: #999;
      padding: 2rem 1rem;
    }
    .upload-placeholder span:first-child {
      font-size: 2rem;
    }
    .logo-preview {
      position: relative;
      width: 100%;
      max-width: 300px;
      margin: 0 auto;
      height: 200px;
    }
    .logo-preview img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 6px;
    }
    .remove-logo-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: rgba(231, 76, 60, 0.9);
      color: white;
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .remove-logo-btn:hover {
      background: rgba(231, 76, 60, 1);
    }
    .upload-progress {
      margin-top: 0.5rem;
      color: #3498db;
      font-size: 0.9rem;
      text-align: center;
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
  uploadingLogo = signal<boolean>(false);

  constructor(
    private apiService: ApiService,
    private imageUploadService: ImageUploadService,
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

  onLocationSelected(location: { lat: number; lng: number }): void {
    this.shopData.latitude = location.lat;
    this.shopData.longitude = location.lng;
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

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      this.uploadingLogo.set(true);
      this.imageUploadService.uploadShopImage(file).subscribe({
        next: (response) => {
          this.shopData.logoUrl = response.imageUrl;
          this.uploadingLogo.set(false);
        },
        error: (error) => {
          console.error('Error uploading logo:', error);
          alert('Failed to upload logo. Please try again.');
          this.uploadingLogo.set(false);
        }
      });
    }
  }

  removeLogo(): void {
    this.shopData.logoUrl = '';
  }
}
