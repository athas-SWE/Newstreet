import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LocationPickerComponent } from '../../../shared/components/location-picker/location-picker.component';

@Component({
  selector: 'app-shop-owner-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LocationPickerComponent],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h1>Shop Owner Registration</h1>
        
        <!-- Step 1: Account Details -->
        @if (currentStep() === 1) {
          <div class="step-content">
            <h2>Step 1: Account Details</h2>
            <form (ngSubmit)="nextStep()" #accountForm="ngForm">
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="formData.email"
                  required
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  [(ngModel)]="formData.password"
                  required
                  minlength="6"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  [(ngModel)]="confirmPassword"
                  required
                  class="form-input"
                />
              </div>
              @if (error()) {
                <div class="error-message">{{ error() }}</div>
              }
              <button type="submit" [disabled]="loading()" class="submit-button">
                Next: Shop Details
              </button>
            </form>
          </div>
        }

        <!-- Step 2: Shop Details -->
        @if (currentStep() === 2) {
          <div class="step-content">
            <h2>Step 2: Shop Details</h2>
            <form (ngSubmit)="nextStep()" #shopForm="ngForm">
              <div class="form-group">
                <label for="shopName">Shop Name *</label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  [(ngModel)]="formData.shopName"
                  required
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="address">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  [(ngModel)]="formData.address"
                  required
                  class="form-input"
                  rows="3"
                ></textarea>
              </div>
              <div class="form-group">
                <label for="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  [(ngModel)]="formData.phone"
                  required
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="whatsApp">WhatsApp Number</label>
                <input
                  type="tel"
                  id="whatsApp"
                  name="whatsApp"
                  [(ngModel)]="formData.whatsApp"
                  class="form-input"
                />
              </div>
              @if (error()) {
                <div class="error-message">{{ error() }}</div>
              }
              <div class="form-actions">
                <button type="button" (click)="previousStep()" class="secondary-button">Back</button>
                <button type="submit" [disabled]="loading()" class="submit-button">
                  Next: Location (Optional)
                </button>
              </div>
            </form>
          </div>
        }

        <!-- Step 3: Location -->
        @if (currentStep() === 3) {
          <div class="step-content">
            <h2>Step 3: Select Shop Location (Optional)</h2>
            <p class="step-description">Click on the map to set your shop's location. You can skip this step and add it later.</p>
            <app-location-picker
              (locationSelected)="onLocationSelected($event)"
            ></app-location-picker>
            @if (error()) {
              <div class="error-message">{{ error() }}</div>
            }
            <div class="form-actions">
              <button type="button" (click)="previousStep()" class="secondary-button">Back</button>
              <button type="button" (click)="onSubmit()" [disabled]="loading()" class="submit-button">
                {{ loading() ? 'Registering...' : 'Complete Registration' }}
              </button>
            </div>
            <div class="skip-location">
              <button type="button" (click)="skipLocation()" [disabled]="loading()" class="skip-button">
                Skip Location Setup
              </button>
            </div>
          </div>
        }

        <p class="login-link">
          Already have an account? <a routerLink="/login">Login</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
      padding: 2rem;
    }
    .register-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 600px;
    }
    h1 {
      margin: 0 0 2rem;
      text-align: center;
      font-size: 2rem;
    }
    h2 {
      margin: 0 0 1.5rem;
      font-size: 1.5rem;
      color: #333;
    }
    .step-description {
      color: #666;
      margin-bottom: 1rem;
    }
    .step-content {
      margin-bottom: 1.5rem;
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
      resize: vertical;
      min-height: 80px;
    }
    .error-message {
      color: #e74c3c;
      margin-bottom: 1rem;
      padding: 0.5rem;
      background: #fee;
      border-radius: 4px;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: space-between;
    }
    .submit-button, .secondary-button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s;
      flex: 1;
    }
    .submit-button {
      background: #3498db;
      color: white;
    }
    .submit-button:hover:not(:disabled) {
      background: #2980b9;
    }
    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .secondary-button {
      background: #e0e0e0;
      color: #333;
    }
    .secondary-button:hover {
      background: #d0d0d0;
    }
    .login-link {
      text-align: center;
      margin-top: 1.5rem;
      color: #666;
    }
    .login-link a {
      color: #3498db;
      text-decoration: none;
    }
    .skip-location {
      margin-top: 1rem;
      text-align: center;
    }
    .skip-button {
      background: transparent;
      color: #666;
      border: none;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 0.9rem;
      text-decoration: underline;
      transition: color 0.3s;
    }
    .skip-button:hover:not(:disabled) {
      color: #3498db;
    }
    .skip-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ShopOwnerRegisterComponent {
  currentStep = signal<number>(1);
  loading = signal<boolean>(false);
  error = signal<string>('');
  confirmPassword = '';

  formData = {
    email: '',
    password: '',
    role: 'ShopOwner',
    shopName: '',
    address: '',
    phone: '',
    whatsApp: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  nextStep(): void {
    if (this.currentStep() === 1) {
      if (this.formData.password !== this.confirmPassword) {
        this.error.set('Passwords do not match');
        return;
      }
      if (this.formData.password.length < 6) {
        this.error.set('Password must be at least 6 characters');
        return;
      }
    }
    this.error.set('');
    this.currentStep.set(this.currentStep() + 1);
  }

  previousStep(): void {
    this.error.set('');
    this.currentStep.set(this.currentStep() - 1);
  }

  onLocationSelected(location: { lat: number; lng: number }): void {
    this.formData.latitude = location.lat;
    this.formData.longitude = location.lng;
  }

  skipLocation(): void {
    this.formData.latitude = undefined;
    this.formData.longitude = undefined;
    this.onSubmit();
  }

  onSubmit(): void {
    this.loading.set(true);
    this.error.set('');

    this.authService.register(this.formData as any)
      .then(() => {
        this.router.navigate(['/shop-owner/dashboard']);
      })
      .catch((err) => {
        this.error.set('Registration failed. Please try again.');
        this.loading.set(false);
      });
  }
}
