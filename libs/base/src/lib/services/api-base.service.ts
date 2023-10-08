import { inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry } from 'rxjs';
import { Identifier, ApiResponse } from '../models';
import { ApiGetOpts } from '../models/api-get-opts.model';
import { ApiBaseMockService } from './api-base-mock.service';

export const BASE_API_URL = new InjectionToken<string>('Base API Url', {
  providedIn: 'any',
  factory: () => window.location.origin,
});

@Injectable({
  providedIn: 'root'
})
export abstract class ApiBaseService extends ApiBaseMockService{
  protected retryCount = 0;

  protected readonly httpClient = inject(HttpClient);
  private readonly _baseUrl = inject(BASE_API_URL);

  protected abstract get endpointPath(): string;

  protected get<T>(opts?: ApiGetOpts): Observable<ApiResponse<T>> {
	let url = this.url;
	if (opts?.ressource) {
	  url = `${url}/${opts.ressource}`;
	}
	if (opts?.id) {
	  url = `${url}/${opts.id}`;
	}
	if (opts?.path) {
	  url = `${url}/${opts.path}`;
	}
	return this.httpClient.get<ApiResponse<T>>(
	  url).pipe(
	  retry(this.retryCount)
	);
  }

  protected create<Req, Res>(
	entity: Req,
	path?: string // additional endpoint path
  ): Observable<ApiResponse<Res>> {
	let url = this.url;
	if (path) {
	  url = `${url}/${path}`;
	}
	return this.httpClient.post<ApiResponse<Res>>(
	  url,
	  entity).pipe(
	  retry(this.retryCount)
	);
  }

  protected update<Req, Res>(
	entity: Partial<Req>,
	path?: string // additional endpoint path
  ): Observable<ApiResponse<Res>> {
	let url = this.url;
	if (path) {
	  url = `${url}/${path}`;
	}
	return this.httpClient.put<ApiResponse<Res>>(
	  url,
	  entity).pipe(
	  retry(this.retryCount)
	);
  }

  private get url(): string {
	return `${this._baseUrl}/${this.endpointPath}`;
  }
}
