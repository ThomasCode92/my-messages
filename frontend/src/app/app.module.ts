import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { PostsModule } from './posts/posts.module';

import { AppComponent } from './app.component';
import { ErrorComponent } from './error/error.component';
import { HeaderComponent } from './header/header.component';

import { AuthInterceptor } from './auth/auth.interceptor';
import { ErrorInterceptor } from './error.interceptor';

@NgModule({
  declarations: [AppComponent, ErrorComponent, HeaderComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    AppRoutingModule,
    PostsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent],
})
export class AppModule {}
