import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry } from 'rxjs';
import { Identifier } from '../../models';

export const BASE_API_URL = new InjectionToken<string>('Base API Url', {
  providedIn: 'any',
  factory: () => window.location.origin,
});

@Injectable({
  providedIn: 'root'
})
export abstract class ApiBaseService<T> {
  protected retryCount = 0;

  protected readonly httpClient = inject(HttpClient);
  private readonly _baseUrl = inject(BASE_API_URL);

  protected abstract get endpointPath(): string;

  protected get(id?: Identifier): Observable<T> {
	let url = this.url;
	if (id) {
	  url = `${url}/${id}`;
	}
	return this.httpClient.get<T>(
	  url).pipe(
	  retry(this.retryCount)
	);
  }

  protected create(entity: T): Observable<T> {
	return this.httpClient.post<T>(
	  this.url,
	  entity).pipe(
	  retry(this.retryCount)
	);
  }

  protected update(entity: Partial<T>): Observable<T> {
	return this.httpClient.put<T>(
	  this.url,
	  entity).pipe(
	  retry(this.retryCount)
	);
  }

  private get url(): string {
	console.log(`${this._baseUrl}/${this.endpointPath}`);
	return `${this._baseUrl}/${this.endpointPath}`;
  }
}
