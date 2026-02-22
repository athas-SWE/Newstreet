import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ImageUploadResponse {
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    // Don't set Content-Type for FormData - let browser set it with boundary
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders();
    if (token) {
      return headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  uploadProductImage(file: File): Observable<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<ImageUploadResponse>(
      `${this.apiUrl}/imageupload/product`,
      formData,
      { headers: this.getHeaders() }
    );
  }

  uploadShopImage(file: File): Observable<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<ImageUploadResponse>(
      `${this.apiUrl}/imageupload/shop`,
      formData,
      { headers: this.getHeaders() }
    );
  }
}
