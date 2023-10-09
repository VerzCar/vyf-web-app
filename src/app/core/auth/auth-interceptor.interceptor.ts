import {inject, Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable, switchMap} from 'rxjs';
import {AwsCognitoService} from '../services/aws-cognito.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly awsCognitoService = inject(AwsCognitoService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
	return this.awsCognitoService.getCurrentSession().pipe(
	  switchMap(session => {
		request = request.clone({
		  setHeaders: {
			'Content-Type': 'application/json; charset=utf-8',
			'Accept': 'application/json',
			'Authorization': `Bearer ${session.getAccessToken().getJwtToken()}`,
		  },
		});
		console.log(request);
		return next.handle(request);
	  }));
  }
}
