import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authStatusSubscription: Subscription;

  isAuth = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuth = this.authService.isAuthenticated;
    this.authStatusSubscription = this.authService.authStatusUpdated.subscribe(
      (isAuthenticated: boolean) => {
        this.isAuth = isAuthenticated;
      }
    );
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
