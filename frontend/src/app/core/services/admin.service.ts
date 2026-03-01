import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private apiService: ApiService) {}

  getDashboard(): Observable<any> {
    return this.apiService.get<any>('admin/dashboard');
  }

  getStatistics(): Observable<any> {
    return this.apiService.get<any>('admin/statistics');
  }

  getShops(citySlug?: string, status?: string, isVerified?: boolean, page: number = 1, pageSize: number = 20): Observable<any> {
    let url = `admin/shops?page=${page}&pageSize=${pageSize}`;
    if (citySlug) url += `&citySlug=${citySlug}`;
    if (status) url += `&status=${status}`;
    if (isVerified !== undefined) url += `&isVerified=${isVerified}`;
    return this.apiService.get<any>(url);
  }

  getPendingShops(page: number = 1, pageSize: number = 20): Observable<any> {
    return this.apiService.get<any>(`admin/shops/pending?page=${page}&pageSize=${pageSize}`);
  }

  verifyShop(shopId: string, isVerified: boolean): Observable<void> {
    return this.apiService.put<void>(`admin/shops/${shopId}/verify`, { isVerified });
  }

  getUsers(role?: string, page: number = 1, pageSize: number = 20): Observable<any> {
    const roleParam = role ? `&role=${role}` : '';
    return this.apiService.get<any>(`admin/users?page=${page}&pageSize=${pageSize}${roleParam}`);
  }

  updateUser(userId: string, role: string): Observable<void> {
    return this.apiService.put<void>(`admin/users/${userId}`, { role });
  }

  deleteUser(userId: string): Observable<void> {
    return this.apiService.delete<void>(`admin/users/${userId}`);
  }

  getCities(): Observable<any> {
    return this.apiService.get<any>('admin/cities');
  }

  createCity(city: any): Observable<any> {
    return this.apiService.post<any>('admin/cities', city);
  }

  updateCity(cityId: string, city: any): Observable<any> {
    return this.apiService.put<any>(`admin/cities/${cityId}`, city);
  }

  deleteCity(cityId: string): Observable<void> {
    return this.apiService.delete<void>(`admin/cities/${cityId}`);
  }

  getTenants(): Observable<any> {
    return this.apiService.get<any>('admin/tenants');
  }

  createTenant(tenant: any): Observable<any> {
    return this.apiService.post<any>('admin/tenants', tenant);
  }

  updateTenant(tenantId: string, tenant: any): Observable<any> {
    return this.apiService.put<any>(`admin/tenants/${tenantId}`, tenant);
  }

  deleteTenant(tenantId: string): Observable<void> {
    return this.apiService.delete<void>(`admin/tenants/${tenantId}`);
  }

  // Industries
  getIndustries(): Observable<any> {
    return this.apiService.get<any>('industries');
  }

  createIndustry(industry: any): Observable<any> {
    return this.apiService.post<any>('industries', industry);
  }

  updateIndustry(industryId: string, industry: any): Observable<any> {
    return this.apiService.put<any>(`industries/${industryId}`, industry);
  }

  deleteIndustry(industryId: string): Observable<void> {
    return this.apiService.delete<void>(`industries/${industryId}`);
  }
}
