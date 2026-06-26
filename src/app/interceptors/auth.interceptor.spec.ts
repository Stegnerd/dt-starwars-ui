import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  function setup(getToken: () => string | null) {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { getToken } }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('attaches the bearer token to /api/starships requests when a token exists', () => {
    setup(() => 'demo-token-123');

    http.get('/api/starships').subscribe();

    const req = httpMock.expectOne('/api/starships');
    expect(req.request.headers.get('Authorization')).toBe('Bearer demo-token-123');
  });

  it('does not attach a header when there is no token', () => {
    setup(() => null);

    http.get('/api/starships').subscribe();

    const req = httpMock.expectOne('/api/starships');
    expect(req.request.headers.has('Authorization')).toBe(false);
  });

  it('does not attach a header to requests outside /api/starships even when a token exists', () => {
    setup(() => 'demo-token-123');

    http.post('/api/auth/login', { username: 'luke', password: 'yoda' }).subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
  });
});
