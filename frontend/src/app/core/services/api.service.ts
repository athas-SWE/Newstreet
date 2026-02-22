import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TenantService } from './tenant.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private tenantService: TenantService
  ) {}

  private getHeaders(): HttpHeaders {
    // Authorization header is handled by authInterceptor
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json'
    };

    // Add city subdomain header if available (for development when no subdomain in URL)
    const subdomain = this.tenantService.getSubdomain();
    if (subdomain) {
      // Ensure subdomain is lowercase to match database
      const lowerSubdomain = subdomain.toLowerCase();
      headers['X-City-Subdomain'] = lowerSubdomain;
      console.log('[ApiService] Sending X-City-Subdomain header:', lowerSubdomain);
    } else {
      console.warn('[ApiService] No subdomain available from TenantService');
    }

    return new HttpHeaders(headers);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}
