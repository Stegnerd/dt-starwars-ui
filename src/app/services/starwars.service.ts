import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ManufacturersResult, StarshipsListResult } from '../pages/starships/starship.model';

@Injectable({ providedIn: 'root' })
export class StarwarsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  listStarships(page: number, limit: number, manufacturer?: string): Observable<StarshipsListResult> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (manufacturer) {
      params = params.set('manufacturer', manufacturer);
    }
    return this.http.get<StarshipsListResult>(`${this.baseUrl}/starships`, { params });
  }

  listManufacturers(): Observable<ManufacturersResult> {
    return this.http.get<ManufacturersResult>(`${this.baseUrl}/starships/manufacturers`);
  }
}
