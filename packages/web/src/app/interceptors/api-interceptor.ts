import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
@Injectable({ providedIn: 'root' })
export class APIHttpInterceptor implements HttpInterceptor {
  constructor(private auth: AngularFireAuth) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.auth.idToken.pipe(
      take(1),
      switchMap((idToken) => {
        let clone = req.clone();
        if (idToken) {
          clone = clone.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + idToken),
          });
        }
        return next.handle(clone);
      })
    );
  }
}

export const APIHttpInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: APIHttpInterceptor,
  multi: true,
};
