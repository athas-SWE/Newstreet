import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { Industry } from '../../../core/models/industry.model';

@Component({
  selector: 'app-industry-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="industry-management-container">
      <div class="container">
        <div class="header-section">
          <h1>Industry Management</h1>
          <button (click)="showAddForm.set(true)" class="add-button">+ Add Industry</button>
        </div>

        @if (showAddForm()) {
          <div class="form-card">
            <h2>{{ editingIndustry() ? 'Edit Industry' : 'Add New Industry' }}</h2>
            <form (ngSubmit)="saveIndustry()" class="industry-form">
              <div class="form-group">
                <label for="name">Industry Name *</label>
                <input type="text" id="name" [(ngModel)]="industryForm.name" name="name" required class="form-input" />
              </div>
              <div class="form-group">
                <label for="slug">Slug</label>
                <input type="text" id="slug" [(ngModel)]="industryForm.slug" name="slug" class="form-input" />
                <small class="form-hint">Leave empty to auto-generate from name</small>
              </div>
              <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" [(ngModel)]="industryForm.description" name="description" class="form-input" rows="3"></textarea>
              </div>
              <div class="form-group">
                <label for="iconUrl">Icon URL</label>
                <input type="url" id="iconUrl" [(ngModel)]="industryForm.iconUrl" name="iconUrl" class="form-input" />
                <small class="form-hint">URL to an icon image for this industry</small>
              </div>
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="industryForm.isActive" name="isActive" />
                  <span>Active</span>
                </label>
              </div>
              <div class="form-actions">
                <button type="submit" [disabled]="saving()" class="submit-button">
                  {{ saving() ? 'Saving...' : 'Save' }}
                </button>
                <button type="button" (click)="cancelEdit()" class="cancel-button">Cancel</button>
              </div>
            </form>
          </div>
        }

        @if (loading()) {
          <app-loading-spinner></app-loading-spinner>
        } @else {
          <div class="industries-list">
            @for (industry of industries(); track industry.id) {
              <div class="industry-card">
                <div class="industry-info">
                  <div class="industry-header">
                    @if (industry.iconUrl) {
                      <img [src]="industry.iconUrl" [alt]="industry.name" class="industry-icon" />
                    }
                    <div>
                      <h3>{{ industry.name }}</h3>
                      <p class="industry-slug">Slug: {{ industry.slug }}</p>
                      @if (industry.description) {
                        <p class="industry-description">{{ industry.description }}</p>
                      }
                    </div>
                  </div>
                  <div class="industry-meta">
                    <span [class]="'status-badge ' + (industry.isActive ? 'active' : 'inactive')">
                      {{ industry.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </div>
                <div class="industry-actions">
                  <button (click)="editIndustry(industry)" class="edit-button">Edit</button>
                  <button (click)="deleteIndustry(industry.id)" class="delete-button">Delete</button>
                </div>
              </div>
            }
            @if (industries().length === 0) {
              <div class="empty-state">
                <p>No industries found. Click "Add Industry" to create one.</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .industry-management-container {
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
    h1 {
      margin: 0;
      font-size: 2rem;
    }
    .add-button {
      padding: 0.75rem 1.5rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s;
    }
    .add-button:hover {
      background: #2980b9;
    }
    .form-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    h2 {
      margin: 0 0 1.5rem;
      font-size: 1.5rem;
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
    textarea.form-input {
      resize: vertical;
      min-height: 80px;
    }
    .form-hint {
      display: block;
      margin-top: 0.25rem;
      color: #666;
      font-size: 0.875rem;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
    .checkbox-label input[type="checkbox"] {
      width: auto;
      cursor: pointer;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }
    .submit-button, .cancel-button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s;
    }
    .submit-button {
      background: #3498db;
      color: white;
    }
    .submit-button:hover:not(:disabled) {
      background: #2980b9;
    }
    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .cancel-button {
      background: #e0e0e0;
      color: #333;
    }
    .cancel-button:hover {
      background: #d0d0d0;
    }
    .industries-list {
      display: grid;
      gap: 1.5rem;
    }
    .industry-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
    }
    .industry-info {
      flex: 1;
    }
    .industry-header {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }
    .industry-icon {
      width: 48px;
      height: 48px;
      object-fit: contain;
      border-radius: 8px;
      background: #f5f5f5;
      padding: 0.5rem;
    }
    h3 {
      margin: 0 0 0.25rem;
      font-size: 1.25rem;
    }
    .industry-slug {
      margin: 0 0 0.5rem;
      color: #666;
      font-size: 0.875rem;
    }
    .industry-description {
      margin: 0.5rem 0 0;
      color: #666;
      font-size: 0.875rem;
      line-height: 1.5;
    }
    .industry-meta {
      margin-top: 0.75rem;
    }
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .status-badge.active {
      background: #d4edda;
      color: #155724;
    }
    .status-badge.inactive {
      background: #f8d7da;
      color: #721c24;
    }
    .industry-actions {
      display: flex;
      gap: 0.75rem;
    }
    .edit-button, .delete-button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.3s;
    }
    .edit-button {
      background: #f0f0f0;
      color: #333;
    }
    .edit-button:hover {
      background: #e0e0e0;
    }
    .delete-button {
      background: #fee;
      color: #c33;
    }
    .delete-button:hover {
      background: #fdd;
    }
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #666;
    }
    @media (max-width: 768px) {
      .header-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      .industry-card {
        flex-direction: column;
      }
      .industry-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }
  `]
})
export class IndustryManagementComponent implements OnInit {
  industries = signal<Industry[]>([]);
  loading = signal<boolean>(true);
  saving = signal<boolean>(false);
  showAddForm = signal<boolean>(false);
  editingIndustry = signal<Industry | null>(null);

  industryForm = {
    name: '',
    slug: '',
    description: '',
    iconUrl: '',
    isActive: true
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadIndustries();
  }

  loadIndustries(): void {
    this.loading.set(true);
    this.adminService.getIndustries().subscribe({
      next: (response: any) => {
        this.industries.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading industries:', error);
        this.loading.set(false);
      }
    });
  }

  saveIndustry(): void {
    this.saving.set(true);
    const industryData = {
      name: this.industryForm.name,
      slug: this.industryForm.slug || undefined,
      description: this.industryForm.description || undefined,
      iconUrl: this.industryForm.iconUrl || undefined,
      isActive: this.industryForm.isActive
    };

    const operation = this.editingIndustry()
      ? this.adminService.updateIndustry(this.editingIndustry()!.id, industryData)
      : this.adminService.createIndustry(industryData);

    operation.subscribe({
      next: () => {
        this.loadIndustries();
        this.cancelEdit();
        this.saving.set(false);
      },
      error: (error) => {
        console.error('Error saving industry:', error);
        alert('Error saving industry. Please try again.');
        this.saving.set(false);
      }
    });
  }

  editIndustry(industry: Industry): void {
    this.editingIndustry.set(industry);
    this.industryForm = {
      name: industry.name,
      slug: industry.slug,
      description: industry.description || '',
      iconUrl: industry.iconUrl || '',
      isActive: industry.isActive
    };
    this.showAddForm.set(true);
  }

  deleteIndustry(id: string): void {
    if (!confirm('Are you sure you want to delete this industry?')) {
      return;
    }

    this.adminService.deleteIndustry(id).subscribe({
      next: () => {
        this.loadIndustries();
      },
      error: (error) => {
        console.error('Error deleting industry:', error);
        alert('Error deleting industry. Please try again.');
      }
    });
  }

  cancelEdit(): void {
    this.showAddForm.set(false);
    this.editingIndustry.set(null);
    this.industryForm = {
      name: '',
      slug: '',
      description: '',
      iconUrl: '',
      isActive: true
    };
  }
}
