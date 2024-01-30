import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { AwsCognitoService } from '../services/aws-cognito.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private readonly awsCognitoService = inject(AwsCognitoService);

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return this.awsCognitoService.authSession$.pipe(
            switchMap(session => {
                const newRequest = request.clone({
                    headers: request.headers.append('Authorization', `Bearer ${session.tokens?.accessToken.toString()}`)
                });
                return next.handle(newRequest);
            }));
    }
}
