import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { ApiResponse } from '../models';
import { ApiGetOpts } from '../models/api-get-opts.model';

export const BASE_API_URL = new InjectionToken<string>('Base API Url', {
    providedIn: 'any',
    factory: () => window.location.origin
});

@Injectable({
    providedIn: 'root'
})
export abstract class ApiBaseService {
    protected retryCount = 0;
    protected defaultHeaders = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8'
    });

    protected readonly httpClient = inject(HttpClient);
    //private readonly _baseUrl = inject(BASE_API_URL);

    protected abstract get baseUrl(): string;
    protected abstract get endpointPath(): string;

    protected get<T>(
        opts?: ApiGetOpts,
        params?: HttpParams
    ): Observable<ApiResponse<T>> {
        let url = this.url;
        url = this.adaptApiGetOptions(url, opts);
        return this.httpClient.get<ApiResponse<T>>(
            url,
            { headers: this.defaultHeaders, params }).pipe(
            retry(this.retryCount)
        );
    }

    protected getAll<T>(
        opts?: ApiGetOpts,
        params?: HttpParams
    ): Observable<ApiResponse<T[]>> {
        let url = this.url;
        url = this.adaptApiGetOptions(url, opts);
        return this.httpClient.get<ApiResponse<T[]>>(
            url,
            { headers: this.defaultHeaders, params }).pipe(
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
            entity,
            { headers: this.defaultHeaders }).pipe(
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
            entity,
            { headers: this.defaultHeaders }).pipe(
            retry(this.retryCount)
        );
    }

    protected delete<Res>(
        path?: string // additional endpoint path
    ): Observable<ApiResponse<Res>> {
        let url = this.url;
        if (path) {
            url = `${url}/${path}`;
        }
        return this.httpClient.delete<ApiResponse<Res>>(
            url,
            { headers: this.defaultHeaders }).pipe(
            retry(this.retryCount)
        );
    }

    protected upload<Res>(
        file: File,
        fileName: string,
        path?: string // additional endpoint path
    ): Observable<ApiResponse<Res>> {
        let url = this.url;
        if (path) {
            url = `${url}/${path}`;
        }

        const formData = new FormData();
        formData.append(fileName, file);

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');

        return this.httpClient.put<ApiResponse<Res>>(
            url,
            formData,
            { headers }).pipe(
            retry(this.retryCount)
        );
    }

    private get url(): string {
        return `${this.baseUrl}/${this.endpointPath}`;
    }

    private adaptApiGetOptions(url: string, opts?: ApiGetOpts): string {
        if (opts?.paths) {
            for (const path of opts.paths) {
                url = `${url}/${path}`;
            }
        }
        return url;
    }
}
