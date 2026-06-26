import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { StarshipsListResult } from '../pages/starships/starship.model';
import { StarwarsService } from './starwars.service';

describe('StarwarsService', () => {
  let service: StarwarsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(StarwarsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('requests the given page and limit', () => {
    const mockResult: StarshipsListResult = {
      starships: [],
      page: 2,
      limit: 10,
      total_records: 0,
      total_pages: 0
    };

    service.listStarships(2, 10).subscribe((result) => {
      expect(result).toEqual(mockResult);
    });

    const req = httpMock.expectOne(
      (r) => r.url === `${environment.apiBaseUrl}/starships` && r.params.get('page') === '2' && r.params.get('limit') === '10'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResult);
  });

  it('requests manufacturers', () => {
    const mockResult = { manufacturers: ['Incom', 'Kuat Drive Yards'] };

    service.listManufacturers().subscribe((result) => {
      expect(result).toEqual(mockResult);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/starships/manufacturers`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResult);
  });

  it('includes the manufacturer filter when provided', () => {
    const mockResult: StarshipsListResult = {
      starships: [],
      page: 1,
      limit: 10,
      total_records: 0,
      total_pages: 0
    };

    service.listStarships(1, 10, 'Incom').subscribe((result) => {
      expect(result).toEqual(mockResult);
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === `${environment.apiBaseUrl}/starships` &&
        r.params.get('page') === '1' &&
        r.params.get('limit') === '10' &&
        r.params.get('manufacturer') === 'Incom'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResult);
  });

  it('propagates errors from the API', () => {
    let receivedError: unknown;

    service.listStarships(1, 10).subscribe({
      error: (err) => (receivedError = err)
    });

    const req = httpMock.expectOne((r) => r.url === `${environment.apiBaseUrl}/starships`);
    req.flush('error', { status: 502, statusText: 'Bad Gateway' });

    expect(receivedError).toBeTruthy();
  });
});
