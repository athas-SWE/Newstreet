import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="container">
        <h1>Profile</h1>
        @if (authService.user(); as user) {
          <div class="profile-card">
            <div class="profile-info">
              <p><strong>Email:</strong> {{ user.email }}</p>
              <p><strong>Role:</strong> {{ user.role }}</p>
              @if (user.shopId) {
                <p><strong>Shop ID:</strong> {{ user.shopId }}</p>
              }
            </div>
            <button (click)="logout()" class="logout-button">Logout</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem 0;
      min-height: calc(100vh - 200px);
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    h1 {
      margin-bottom: 2rem;
    }
    .profile-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .profile-info p {
      margin: 1rem 0;
      font-size: 1.1rem;
    }
    .logout-button {
      margin-top: 2rem;
      padding: 0.75rem 1.5rem;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
    }
    .logout-button:hover {
      background: #c0392b;
    }
  `]
})
export class ProfileComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
