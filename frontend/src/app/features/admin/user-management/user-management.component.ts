import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  template: `
    <div class="user-management-container">
      <div class="container">
        <h1>User Management</h1>
        @if (loading()) {
          <app-loading-spinner></app-loading-spinner>
        } @else {
          <div class="users-table">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (user of users(); track user.id) {
                  <tr>
                    <td>{{ user.email }}</td>
                    <td>
                      <select (change)="changeRole(user.id, $event)" [value]="user.role">
                        <option value="Customer">Customer</option>
                        <option value="ShopOwner">Shop Owner</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button (click)="deleteUser(user.id)" class="delete-button">Delete</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .user-management-container {
      padding: 2rem 0;
      min-height: calc(100vh - 200px);
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .users-table {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    th {
      font-weight: bold;
      background: #f9f9f9;
    }
    select {
      padding: 0.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }
    .delete-button {
      padding: 0.5rem 1rem;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .delete-button:hover {
      background: #c0392b;
    }
  `]
})
export class UserManagementComponent implements OnInit {
  users = signal<any[]>([]);
  loading = signal<boolean>(true);

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.adminService.getUsers().subscribe({
      next: (response: any) => {
        this.users.set(response.items || []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading.set(false);
      }
    });
  }

  changeRole(userId: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newRole = target.value;
    this.adminService.updateUserRole(userId, newRole).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error updating user role:', error);
      }
    });
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }
}
