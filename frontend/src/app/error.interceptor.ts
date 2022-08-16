import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { catchError, Observable, throwError } from 'rxjs';

import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);

        let errorMessage = 'An unknown error occurred!';

        if (errorResponse.error.message) {
          errorMessage = errorResponse.error.message;
        }

        this.dialog.open(ErrorComponent, { data: { message: errorMessage } });
        
        return throwError(() => errorResponse);
      })
    );
  }
}
