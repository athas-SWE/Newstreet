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
      background: var(--text-primary);
      color: white;
      padding: 3rem 0 1.5rem;
      margin-top: 4rem;
      border-top: 1px solid var(--border-color);
    }
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2.5rem;
      gap: 2rem;
    }
    .footer-logo h2 {
      margin: 0 0 0.75rem;
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .footer-logo p {
      margin: 0;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9375rem;
      line-height: 1.6;
    }
    .footer-links {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }
    .footer-link {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 0.9375rem;
      font-weight: 500;
      transition: all 0.2s ease;
      padding: 0.25rem 0;
    }
    .footer-link:hover {
      color: white;
      transform: translateX(2px);
    }
    .footer-bottom {
      text-align: center;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.875rem;
    }
    @media (max-width: 768px) {
      .footer {
        padding: 2rem 0 1rem;
      }
      .footer-content {
        flex-direction: column;
        gap: 2rem;
      }
      .footer-links {
        flex-direction: column;
        gap: 1rem;
      }
      .container {
        padding: 0 1rem;
      }
    }
  `]
})
export class FooterComponent {}
