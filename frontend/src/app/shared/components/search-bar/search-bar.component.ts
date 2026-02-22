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
      <button (click)="onSearch()" class="search-button">Search</button>
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
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      transition: all 0.2s ease;
    }
    .search-bar:focus-within {
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-color);
    }
    .search-input {
      flex: 1;
      padding: 0.875rem 1.25rem;
      border: none;
      background: transparent;
      font-size: 0.9375rem;
      outline: none;
      color: var(--text-primary);
    }
    .search-input::placeholder {
      color: var(--text-muted);
    }
    .search-button {
      padding: 0.875rem 1.75rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      font-size: 0.9375rem;
      font-weight: 600;
      white-space: nowrap;
      transition: all 0.2s ease;
      box-shadow: var(--shadow-sm);
    }
    .search-button:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    .search-button:active {
      transform: translateY(0);
    }
    @media (max-width: 640px) {
      .search-bar {
        flex-direction: column;
        padding: 0.75rem;
      }
      .search-button {
        width: 100%;
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
