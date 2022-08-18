import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthGaurd } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: PostListComponent },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then(module => module.AuthModule),
  },
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
