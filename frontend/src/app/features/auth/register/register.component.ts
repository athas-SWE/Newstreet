import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h1>Register</h1>
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
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
              [(ngModel)]="password"
              required
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
          <div class="form-group">
            <label for="role">Role</label>
            <select id="role" name="role" [(ngModel)]="role" class="form-input">
              <option value="Customer">Customer</option>
              <option value="ShopOwner">Shop Owner</option>
            </select>
          </div>
          @if (error()) {
            <div class="error-message">{{ error() }}</div>
          }
          <button type="submit" [disabled]="loading()" class="submit-button">
            {{ loading() ? 'Registering...' : 'Register' }}
          </button>
        </form>
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
      max-width: 400px;
    }
    h1 {
      margin: 0 0 2rem;
      text-align: center;
      font-size: 2rem;
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
    .error-message {
      color: #e74c3c;
      margin-bottom: 1rem;
      padding: 0.5rem;
      background: #fee;
      border-radius: 4px;
    }
    .submit-button {
      width: 100%;
      padding: 0.75rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s;
    }
    .submit-button:hover:not(:disabled) {
      background: #2980b9;
    }
    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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
  `]
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  role = 'Customer';
  loading = signal<boolean>(false);
  error = signal<string>('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.error.set('Please fill in all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.register({ email: this.email, password: this.password, role: this.role })
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.error.set('Registration failed. Email may already exist.');
        this.loading.set(false);
      });
  }
}
