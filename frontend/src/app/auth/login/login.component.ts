import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private authStatusUpdatedSub: Subscription;
  
  isLoading = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusUpdatedSub = this.authService.authStatusUpdated.subscribe(
      (authStatus: boolean) => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.authStatusUpdatedSub.unsubscribe();
  }

  onLogin(form: NgForm) {
    if (form.invalid) return;

    const { email, password } = form.value;

    this.isLoading = true;
    this.authService.login(email, password);
  }
}
