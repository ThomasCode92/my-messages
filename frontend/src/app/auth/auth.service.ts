import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token: string;
  private _isAuthenticated = false;
  private _authStatusUpdated = new Subject<boolean>();
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

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
      .subscribe(response => {
        console.log(response);
      });
  }

  autoAuthUser() {
    const authData = this.getAuthData();

    if (!authData) return;

    const now = new Date();
    const expiresIn = authData.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.setAuthTimer(expiresIn / 1000);
      this._token = authData.token;
      this._isAuthenticated = true;
      this._authStatusUpdated.next(true);
    }
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };

    this.http
      .post<{ message: string; token: string; expiresIn: number }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe(responseData => {
        console.log(responseData.message);

        const token = responseData.token;
        this._token = token;

        if (token) {
          const expiresInDuration = responseData.expiresIn; // time in seconds

          this.setAuthTimer(expiresInDuration);

          const now = new Date();
          const expirationTime = now.getTime() + expiresInDuration * 1000;
          const expirationDate = new Date(expirationTime);

          console.log(expirationDate);

          this.saveAuthData(token, expirationDate);

          this._isAuthenticated = true;
          this._authStatusUpdated.next(true);
        }

        this.router.navigate(['/']);
      });
  }

  logout() {
    this._token = null;
    this._isAuthenticated = false;
    this._authStatusUpdated.next(false);

    clearTimeout(this.tokenTimer);
    this.clearAuthData();

    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');

    if (!token || !expiration) return;

    return { token, expirationDate: new Date(expiration) };
  }

  private clearAuthData() {
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
