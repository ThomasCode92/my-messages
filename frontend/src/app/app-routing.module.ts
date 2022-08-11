import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGaurd } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'create',
    component: PostCreateComponent,
    canActivate: [AuthGaurd],
  },
  {
    path: 'edit/:postId',
    component: PostCreateComponent,
    canActivate: [AuthGaurd],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGaurd],
})
export class AppRoutingModule {}
