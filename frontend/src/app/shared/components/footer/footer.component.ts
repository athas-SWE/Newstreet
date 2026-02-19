import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">
            <h2>StreetMain</h2>
            <p>Empowering local commerce with modern technology.</p>
          </div>
          <div class="footer-links">
            <a routerLink="/about" class="footer-link">About</a>
            <a routerLink="/privacy" class="footer-link">Privacy</a>
            <a routerLink="/terms" class="footer-link">Terms</a>
            <a routerLink="/contact" class="footer-link">Contact</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 StreetMain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #2c3e50;
      color: white;
      padding: 2rem 0 1rem;
      margin-top: 4rem;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 2rem;
    }
    .footer-logo h2 {
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
    }
    .footer-logo p {
      margin: 0;
      color: #bdc3c7;
      font-size: 0.9rem;
    }
    .footer-links {
      display: flex;
      gap: 2rem;
    }
    .footer-link {
      color: #bdc3c7;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.3s;
    }
    .footer-link:hover {
      color: white;
    }
    .footer-bottom {
      text-align: center;
      padding-top: 1rem;
      border-top: 1px solid #34495e;
      color: #95a5a6;
      font-size: 0.85rem;
    }
    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        gap: 1.5rem;
      }
      .footer-links {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class FooterComponent {}
