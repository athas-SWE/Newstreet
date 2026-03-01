import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Industry, CreateIndustryRequest, UpdateIndustryRequest } from '../models/industry.model';

@Injectable({
  providedIn: 'root'
})
export class IndustryService {
  constructor(private apiService: ApiService) {}

  getIndustries(): Observable<Industry[]> {
    return this.apiService.get<Industry[]>('industries');
  }

  getIndustryById(id: string): Observable<Industry> {
    return this.apiService.get<Industry>(`industries/${id}`);
  }

  getIndustryBySlug(slug: string): Observable<Industry> {
    return this.apiService.get<Industry>(`industries/slug/${slug}`);
  }

  createIndustry(industry: CreateIndustryRequest): Observable<Industry> {
    return this.apiService.post<Industry>('industries', industry);
  }

  updateIndustry(id: string, industry: UpdateIndustryRequest): Observable<Industry> {
    return this.apiService.put<Industry>(`industries/${id}`, industry);
  }

  deleteIndustry(id: string): Observable<void> {
    return this.apiService.delete<void>(`industries/${id}`);
  }
}
