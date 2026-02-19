import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private token = signal<string | null>(null);

  public readonly user = this.currentUser.asReadonly();
  public readonly isAuthenticated = computed(() => this.currentUser() !== null);
  public readonly isAdmin = computed(() => this.currentUser()?.role === 'Admin');
  public readonly isShopOwner = computed(() => this.currentUser()?.role === 'ShopOwner');

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      this.token.set(token);
      this.currentUser.set(JSON.parse(userStr));
    }
  }

  login(credentials: LoginRequest): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      this.apiService.post<AuthResponse>('auth/login', credentials).subscribe({
        next: (response) => {
          this.setAuth(response);
          resolve(response);
        },
        error: (error) => reject(error)
      });
    });
  }

  register(data: RegisterRequest): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      this.apiService.post<AuthResponse>('auth/register', data).subscribe({
        next: (response) => {
          this.setAuth(response);
          resolve(response);
        },
        error: (error) => reject(error)
      });
    });
  }

  private setAuth(response: AuthResponse): void {
    this.token.set(response.token);
    const user: User = {
      id: '', // Will be set from token if needed
      email: response.email,
      role: response.role,
      shopId: response.shopId
    };
    this.currentUser.set(user);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return this.token();
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.role === role;
  }
}
