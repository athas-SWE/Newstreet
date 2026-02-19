import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private cityName = signal<string>('');
  private subdomain = signal<string>('');

  constructor() {
    this.detectSubdomain();
  }

  private detectSubdomain(): void {
    const host = window.location.hostname;
    const parts = host.split('.');
    if (parts.length >= 3) {
      this.subdomain.set(parts[0].toLowerCase());
      // Capitalize first letter for display
      this.cityName.set(parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase());
    }
  }

  getSubdomain(): string {
    return this.subdomain();
  }

  getCityName(): string {
    return this.cityName();
  }

  getCityNameSignal() {
    return this.cityName.asReadonly();
  }
}
