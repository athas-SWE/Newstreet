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
      gap: 0.5rem;
      width: 100%;
      max-width: 600px;
    }
    .search-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.3s;
    }
    .search-input:focus {
      border-color: #3498db;
    }
    .search-button {
      padding: 0.75rem 1.5rem;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s;
    }
    .search-button:hover {
      background-color: #2980b9;
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
