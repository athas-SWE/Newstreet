import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-city-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="city-management-container">
      <div class="container">
        <div class="header-section">
          <h1>City Management</h1>
          <button (click)="showAddForm.set(true)" class="add-button">+ Add City</button>
        </div>

        @if (showAddForm()) {
          <div class="form-card">
            <h2>{{ editingCity() ? 'Edit City' : 'Add New City' }}</h2>
            <form (ngSubmit)="saveCity()" class="city-form">
              <div class="form-group">
                <label for="name">City Name</label>
                <input type="text" id="name" [(ngModel)]="cityForm.name" name="name" required class="form-input" />
              </div>
              <div class="form-group">
                <label for="slug">Slug</label>
                <input type="text" id="slug" [(ngModel)]="cityForm.slug" name="slug" required class="form-input" />
              </div>
              <div class="form-actions">
                <button type="submit" class="submit-button">Save</button>
                <button type="button" (click)="cancelEdit()" class="cancel-button">Cancel</button>
              </div>
            </form>
          </div>
        }

        @if (loading()) {
          <app-loading-spinner></app-loading-spinner>
        } @else {
          <div class="cities-list">
            @for (city of cities(); track city.id) {
              <div class="city-card">
                <div class="city-info">
                  <h3>{{ city.name }}</h3>
                  <p>Slug: {{ city.slug }}</p>
                </div>
                <div class="city-actions">
                  <button (click)="editCity(city)" class="edit-button">Edit</button>
                  <button (click)="deleteCity(city.id)" class="delete-button">Delete</button>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .city-management-container {
      padding: 2rem 0;
      min-height: calc(100vh - 200px);
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .add-button {
      padding: 0.75rem 1.5rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    .form-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
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
    .form-actions {
      display: flex;
      gap: 1rem;
    }
    .submit-button, .cancel-button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    .submit-button {
      background: #3498db;
      color: white;
    }
    .cancel-button {
      background: #e0e0e0;
    }
    .cities-list {
      display: grid;
      gap: 1rem;
    }
    .city-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .city-actions {
      display: flex;
      gap: 0.5rem;
    }
    .edit-button, .delete-button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .edit-button {
      background: #3498db;
      color: white;
    }
    .delete-button {
      background: #e74c3c;
      color: white;
    }
  `]
})
export class CityManagementComponent implements OnInit {
  cities = signal<any[]>([]);
  loading = signal<boolean>(true);
  showAddForm = signal<boolean>(false);
  editingCity = signal<any | null>(null);

  cityForm = {
    name: '',
    slug: ''
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadCities();
  }

  loadCities(): void {
    this.loading.set(true);
    this.adminService.getCities().subscribe({
      next: (cities) => {
        this.cities.set(cities);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading cities:', error);
        this.loading.set(false);
      }
    });
  }

  saveCity(): void {
    if (this.editingCity()) {
      this.adminService.updateCity(this.editingCity()!.id, this.cityForm).subscribe({
        next: () => {
          this.loadCities();
          this.cancelEdit();
        },
        error: (error) => console.error('Error updating city:', error)
      });
    } else {
      this.adminService.createCity(this.cityForm).subscribe({
        next: () => {
          this.loadCities();
          this.cancelEdit();
        },
        error: (error) => console.error('Error creating city:', error)
      });
    }
  }

  editCity(city: any): void {
    this.editingCity.set(city);
    this.cityForm = { name: city.name, slug: city.slug };
    this.showAddForm.set(true);
  }

  deleteCity(cityId: string): void {
    if (confirm('Are you sure you want to delete this city?')) {
      this.adminService.deleteCity(cityId).subscribe({
        next: () => this.loadCities(),
        error: (error) => console.error('Error deleting city:', error)
      });
    }
  }

  cancelEdit(): void {
    this.showAddForm.set(false);
    this.editingCity.set(null);
    this.cityForm = { name: '', slug: '' };
  }
}
