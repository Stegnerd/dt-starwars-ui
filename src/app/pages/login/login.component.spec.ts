import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  function setup(authService: Partial<AuthService>) {
    const router = { navigateByUrl: jest.fn() };

    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });

    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    return { fixture, router };
  }

  it('does not call login when the form is invalid', () => {
    const login = jest.fn();
    const { fixture } = setup({ login });

    fixture.componentInstance.onSubmit();

    expect(login).not.toHaveBeenCalled();
  });

  it('shows loading while the login call is in flight, then navigates to /starships on success', () => {
    const subject = new Subject<{ token: string }>();
    const login = jest.fn().mockReturnValue(subject.asObservable());
    const { fixture, router } = setup({ login });

    fixture.componentInstance.form.setValue({ username: 'luke', password: 'yoda' });
    fixture.componentInstance.onSubmit();

    expect(login).toHaveBeenCalledWith('luke', 'yoda');
    expect(fixture.componentInstance.loading()).toBe(true);

    subject.next({ token: 'demo-token-123' });
    subject.complete();

    expect(fixture.componentInstance.loading()).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/starships');
  });

  it('sets an error message and stops loading when login fails', () => {
    const login = jest.fn().mockReturnValue(throwError(() => new Error('unauthorized')));
    const { fixture, router } = setup({ login });

    fixture.componentInstance.form.setValue({ username: 'luke', password: 'wrong' });
    fixture.componentInstance.onSubmit();

    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.componentInstance.error()).toBe('Invalid username or password.');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
