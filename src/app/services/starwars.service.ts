import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { StarshipsListResult } from '../pages/starships/starship.model';

@Injectable({ providedIn: 'root' })
export class StarwarsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  listStarships(page: number, limit: number): Observable<StarshipsListResult> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<StarshipsListResult>(`${this.baseUrl}/starships`, { params });
  }
}
