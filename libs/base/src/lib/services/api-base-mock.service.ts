import { Injectable, InjectionToken } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { ApiResponse, ResponseStatus } from '../models';

export const BASE_API_USE_MOCK = new InjectionToken<boolean>('Use Mock data in Base Mock Api', {
  providedIn: 'any',
  factory: () => false,
});

@Injectable({
  providedIn: 'root'
})
export abstract class ApiBaseMockService {
  private readonly defaultResponse: Omit<ApiResponse<unknown>, 'data'> = {
	status: ResponseStatus.Success,
	msg: ''
  };

  private readonly delay = 1000;

  protected getMock<T>(
	data: T
  ): Observable<ApiResponse<T>> {
	return of({
	  ...this.defaultResponse,
	  data
	}).pipe(
	  delay(this.delay)
	);
  }

  protected createMock<T>(
	data: T
  ): Observable<ApiResponse<T>> {
	return of({
	  ...this.defaultResponse,
	  data
	}).pipe(
	  delay(this.delay)
	);
  }

  protected updateMock<T>(
	data: T
  ): Observable<ApiResponse<T>> {
	return of({
	  ...this.defaultResponse,
	  data
	}).pipe(
	  delay(this.delay)
	);
  }
}
