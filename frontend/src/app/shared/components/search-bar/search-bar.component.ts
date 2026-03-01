import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-bar">
      <input
        type="text"
        [(ngModel)]="searchQuery"
        (keyup.enter)="onSearch()"
        placeholder="Search products..."
        class="search-input"
      />
      <button (click)="onSearch()" class="search-button"><span>Search</span></button>
    </div>
  `,
  styles: [`
    .search-bar {
      display: flex;
      gap: 0.75rem;
      width: 100%;
      max-width: 600px;
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
      padding: 0.625rem;
      border: 2px solid var(--border-color);
      transition: all var(--transition-base);
      position: relative;
    }
    .search-bar::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: var(--radius-xl);
      padding: 2px;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      transition: opacity var(--transition-base);
    }
    .search-bar:focus-within {
      box-shadow: var(--shadow-xl);
      border-color: var(--primary-color);
      transform: translateY(-2px);
    }
    .search-bar:focus-within::before {
      opacity: 1;
    }
    .search-input {
      flex: 1;
      padding: 1rem 1.5rem;
      border: none;
      background: transparent;
      font-size: 0.9375rem;
      outline: none;
      color: var(--text-primary);
      font-weight: 400;
    }
    .search-input::placeholder {
      color: var(--text-muted);
      font-weight: 400;
    }
    .search-button {
      padding: 1rem 2rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      font-size: 0.9375rem;
      font-weight: 600;
      white-space: nowrap;
      transition: all var(--transition-base);
      box-shadow: var(--shadow-sm);
      position: relative;
      overflow: hidden;
    }
    .search-button::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }
    .search-button:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    .search-button:hover::before {
      width: 300px;
      height: 300px;
    }
    .search-button:active {
      transform: translateY(0);
    }
    .search-button span {
      position: relative;
      z-index: 1;
    }
    @media (max-width: 640px) {
      .search-bar {
        flex-direction: column;
        padding: 0.75rem;
        gap: 0.625rem;
      }
      .search-input {
        padding: 0.875rem 1.25rem;
      }
      .search-button {
        width: 100%;
        padding: 0.875rem 1.75rem;
      }
    }
  `]
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();
  searchQuery = '';

  constructor(private router: Router) {}

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.search.emit(this.searchQuery.trim());
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery.trim() } });
    }
  }
}
