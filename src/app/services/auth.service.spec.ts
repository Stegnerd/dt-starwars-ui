import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('starts logged out when no token is stored', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('stores the token and marks the user logged in on successful login', () => {
    service.login('luke', 'yoda').subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'luke', password: 'yoda' });
    req.flush({ token: 'demo-token-123' });

    expect(service.isLoggedIn()).toBe(true);
    expect(localStorage.getItem('auth_token')).toBe('demo-token-123');
  });

  it('does not log in on failure', () => {
    service.login('luke', 'wrong').subscribe({ error: () => undefined });

    const req = httpMock.expectOne('/api/auth/login');
    req.flush({ error: 'invalid username or password' }, { status: 401, statusText: 'Unauthorized' });

    expect(service.isLoggedIn()).toBe(false);
  });

  it('clears the token on logout', () => {
    service.login('luke', 'yoda').subscribe();
    httpMock.expectOne('/api/auth/login').flush({ token: 'demo-token-123' });
    expect(service.isLoggedIn()).toBe(true);

    service.logout();

    expect(service.isLoggedIn()).toBe(false);
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});
