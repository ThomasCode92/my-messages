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

  login(email: string, password: string) {
    const authData: AuthData = { email, password };

    this.http
      .post<{ message: string; token: string; expiresIn: number }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe(responseData => {
        console.log(responseData.message);

        this._token = responseData.token;

        if (this._token) {
          const expiresInDuration = responseData.expiresIn; // time in seconds

          this.tokenTimer = setTimeout(() => {
            this.logout();
          }, expiresInDuration * 1000);

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

    this.router.navigate(['/']);
  }
}
