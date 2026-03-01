import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-spinner">
      <div class="spinner-container">
        <div class="spinner"></div>
        <div class="spinner-ring"></div>
      </div>
    </div>
  `,
  styles: [`
    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3rem 2rem;
      min-height: 200px;
    }
    .spinner-container {
      position: relative;
      width: 48px;
      height: 48px;
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--bg-tertiary);
      border-top: 4px solid var(--primary-color);
      border-right: 4px solid var(--accent-color);
      border-radius: 50%;
      animation: spin 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      position: absolute;
      top: 0;
      left: 0;
    }
    .spinner-ring {
      width: 48px;
      height: 48px;
      border: 4px solid transparent;
      border-top: 4px solid var(--accent-color);
      border-radius: 50%;
      animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite reverse;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0.6;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent {}
