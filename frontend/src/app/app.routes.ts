import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'shops/:slug',
        loadComponent: () => import('./features/shops/shop-detail/shop-detail.component').then(m => m.ShopDetailComponent)
      },
      {
        path: 'search',
        loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./features/auth/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'shop-owner',
        canActivate: [roleGuard(['ShopOwner', 'Admin'])],
        children: [
          {
            path: 'dashboard',
            loadComponent: () => import('./features/shop-owner/dashboard/dashboard.component').then(m => m.DashboardComponent)
          },
          {
            path: 'shop',
            loadComponent: () => import('./features/shop-owner/shop-management/shop-management.component').then(m => m.ShopManagementComponent)
          },
          {
            path: 'products',
            loadComponent: () => import('./features/shop-owner/product-management/product-management.component').then(m => m.ProductManagementComponent)
          }
        ]
      },
      {
        path: 'admin',
        canActivate: [roleGuard(['Admin'])],
        children: [
          {
            path: 'dashboard',
            loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
          },
          {
            path: 'shops',
            loadComponent: () => import('./features/admin/shop-verification/shop-verification.component').then(m => m.ShopVerificationComponent)
          },
          {
            path: 'users',
            loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
          },
          {
            path: 'cities',
            loadComponent: () => import('./features/admin/city-management/city-management.component').then(m => m.CityManagementComponent)
          }
        ]
      }
    ]
  }
];
