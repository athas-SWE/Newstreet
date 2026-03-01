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
      background: linear-gradient(180deg, var(--text-primary) 0%, #0a0f1a 100%);
      color: white;
      padding: 4rem 0 2rem;
      margin-top: 5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
    }
    .footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    }
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
      position: relative;
      z-index: 1;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 3rem;
      gap: 3rem;
    }
    .footer-logo h2 {
      margin: 0 0 1rem;
      font-size: 1.75rem;
      font-weight: 800;
      background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.02em;
    }
    .footer-logo p {
      margin: 0;
      color: rgba(255, 255, 255, 0.75);
      font-size: 0.9375rem;
      line-height: 1.7;
      max-width: 300px;
    }
    .footer-links {
      display: flex;
      gap: 2.5rem;
      flex-wrap: wrap;
    }
    .footer-link {
      color: rgba(255, 255, 255, 0.75);
      text-decoration: none;
      font-size: 0.9375rem;
      font-weight: 500;
      transition: all var(--transition-base);
      padding: 0.375rem 0;
      position: relative;
    }
    .footer-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #60a5fa, #3b82f6);
      transition: width var(--transition-base);
      border-radius: var(--radius-full);
    }
    .footer-link:hover {
      color: white;
      transform: translateX(4px);
    }
    .footer-link:hover::after {
      width: 100%;
    }
    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.65);
      font-size: 0.875rem;
      letter-spacing: 0.02em;
    }
    @media (max-width: 768px) {
      .footer {
        padding: 3rem 0 1.5rem;
        margin-top: 3rem;
      }
      .footer-content {
        flex-direction: column;
        gap: 2.5rem;
        margin-bottom: 2rem;
      }
      .footer-links {
        flex-direction: column;
        gap: 1.25rem;
      }
      .container {
        padding: 0 1rem;
      }
      .footer-logo p {
        max-width: 100%;
      }
    }
  `]
})
export class FooterComponent {}
