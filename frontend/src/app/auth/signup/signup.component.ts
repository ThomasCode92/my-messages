import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
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

  onSignup(form: NgForm) {
    if (form.invalid) return;

    const { email, password } = form.value;

    this.isLoading = true;
    this.authService.createUser(email, password);
  }
}
