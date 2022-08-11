import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token: string;
  private _authStatusUpdated = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  get token() {
    return this._token;
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
      .post<{ message: string; token: string }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe(responseData => {
        console.log(responseData.message);

        this._token = responseData.token;
        this._authStatusUpdated.next(true);
      });
  }
}
