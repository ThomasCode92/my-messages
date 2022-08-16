import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _userId: string;
  private _token: string;
  private _isAuthenticated = false;
  private _authStatusUpdated = new Subject<boolean>();
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  get userId() {
    return this._userId;
  }

  get token() {
    return this._token;
  }

  get isAuthenticated() {
    return this._isAuthenticated;
  }

  get authStatusUpdated() {
    return this._authStatusUpdated.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };

    this.http
      .post<{ message: string; user: any }>(
        'http://localhost:3000/api/user/signup',
        authData
      )
      .subscribe({
        next: response => {
          console.log(response.message);
          this.router.navigate(['/login']);
        },
        error: error => {
          this._authStatusUpdated.next(false);
        },
      });
  }

  autoAuthUser() {
    const authData = this.getAuthData();

    if (!authData) return;

    const now = new Date();
    const expiresIn = authData.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.setAuthTimer(expiresIn / 1000);

      this._userId = authData.userId;
      this._token = authData.token;
      this._isAuthenticated = true;
      this._authStatusUpdated.next(true);
    }
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };

    this.http
      .post<{
        message: string;
        userId: string;
        token: string;
        expiresIn: number;
      }>('http://localhost:3000/api/user/login', authData)
      .subscribe({
        next: responseData => {
          console.log(responseData.message);

          const userId = responseData.userId;
          const token = responseData.token;

          this._token = token;

          if (userId && token) {
            const expiresInDuration = responseData.expiresIn; // time in seconds

            this.setAuthTimer(expiresInDuration);

            const now = new Date();
            const expirationTime = now.getTime() + expiresInDuration * 1000;
            const expirationDate = new Date(expirationTime);

            this.saveAuthData(userId, token, expirationDate);

            this._userId = userId;
            this._isAuthenticated = true;
            this._authStatusUpdated.next(true);

            this.router.navigate(['/']);
          }
        },
        error: error => {
          this._authStatusUpdated.next(false);
        },
      });
  }

  logout() {
    this._userId = null;
    this._token = null;
    this._isAuthenticated = false;
    this._authStatusUpdated.next(false);

    clearTimeout(this.tokenTimer);
    this.clearAuthData();

    this.router.navigate(['/']);
  }

  private saveAuthData(userId: string, token: string, expirationDate: Date) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private getAuthData() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');

    if (!userId || !token || !expiration) return;

    return { userId, token, expirationDate: new Date(expiration) };
  }

  private clearAuthData() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private setAuthTimer(duration: number) {
    console.log('Auth timer set, duration: ' + duration);

    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
