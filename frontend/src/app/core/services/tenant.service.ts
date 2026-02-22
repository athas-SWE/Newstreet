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
    let detectedSubdomain = '';
    
    if (parts.length >= 3) {
      detectedSubdomain = parts[0].toLowerCase();
      console.log('[TenantService] Detected subdomain from URL:', detectedSubdomain);
    } else {
      // In development, use default subdomain if none detected
      // This allows localhost to work without subdomain configuration
      // Use lowercase to match database subdomain
      detectedSubdomain = 'colombo'; // Default city for development (must match database subdomain)
      console.log('[TenantService] No subdomain in URL, using default:', detectedSubdomain);
    }

    if (detectedSubdomain) {
      this.subdomain.set(detectedSubdomain);
      // Capitalize first letter for display
      this.cityName.set(detectedSubdomain.charAt(0).toUpperCase() + detectedSubdomain.slice(1).toLowerCase());
      console.log('[TenantService] Subdomain set to:', detectedSubdomain, 'City name:', this.cityName());
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
