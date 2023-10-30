import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL } from '../services/api-base.service';

@Injectable({
    providedIn: 'root'
})
export class SseService<T> {

    private readonly _baseUrl = inject(BASE_API_URL);

    public events(endpointPath: string): Observable<T> {
        const url = this.url(endpointPath);
        const eventSource = this.createEventSource(url);

        return new Observable(observer => {
            eventSource.onmessage = event => {
                const messageData: T = JSON.parse(event.data);
                observer.next(messageData);
            };

            eventSource.onerror = error => {
                observer.error(error);
            };
        });
    }

    private createEventSource(url: string): EventSource {
        return new EventSource(url);
    }

    private url(endpointPath: string): string {
        return `${this._baseUrl}/${endpointPath}`;
    }
}
