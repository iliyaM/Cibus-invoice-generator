// mock.interceptor.ts
import {Inject, Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {delay, Observable, of, throwError} from 'rxjs';
import {HttpService} from './http.service';

@Injectable()
export class MockInterceptor implements HttpInterceptor {

  constructor(private http: HttpService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/saveUserAndInvoiceDetails') || req.url.includes('/sendPDfToBe')) {
      if (this.http.requestShouldSucceed()) {
        return of(new HttpResponse({status: 200, body: {message: 'OK ✅'}}))
          .pipe(delay(500));
      } else {
        return throwError(() =>
          new HttpErrorResponse({
            status: 500,
            statusText: 'Server error',
            error: {message: 'Something went wrong'}
          })
        ).pipe(delay(500));
      }
    }
    return next.handle(req);
  }
}
