import { inject, Injectable, InjectionToken } from '@angular/core';
import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { Observable, of, Subject, switchMap } from 'rxjs';

class RetriableError extends Error {}

class FatalError extends Error {}

export const AUTH_JWT_TOKEN_FACTORY = new InjectionToken<Observable<string>>('JWT Token request factory', {
    providedIn: 'any',
    factory: () => of('')
});

@Injectable({
    providedIn: 'root'
})
export class SseService {

    private readonly _authJwtTokenReqFactory = inject(AUTH_JWT_TOKEN_FACTORY);

    public events$<T>(url: string): Observable<T> {
        return this._authJwtTokenReqFactory.pipe(
            switchMap(token => {
                return this.fetchSseEvent<T>(url, token).asObservable();
            })
        );
    }

    private fetchSseEvent<T>(url: string, token: string): Subject<T> {
        const subject = new Subject<T>();

        const fetchSource = async () => {
            await fetchEventSource(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                async onopen(response) {
                    if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
                        return; // everything's good
                    } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                        // client-side errors are usually non-retriable:
                        subject.error(new FatalError());
                        throw new FatalError();
                    } else {
                        subject.error(new RetriableError());
                        throw new RetriableError();
                    }
                },
                onmessage(msg) {
                    // if the server emits an error message, throw an exception
                    // so it gets handled by the onerror callback below:
                    if (msg.event === 'FatalError') {
                        subject.error(new FatalError(msg.data));
                        throw new FatalError(msg.data);
                    }

                    const messageData: T = JSON.parse(msg.data);
                    subject.next(messageData);
                },
                onclose() {
                    // if the server closes the connection unexpectedly, retry:
                    subject.error(new RetriableError());
                    throw new RetriableError();
                },
                onerror(err) {
                    if (err instanceof FatalError) {
                        subject.error(new FatalError());
                        throw err; // rethrow to stop the operation
                    } else {
                        // do nothing to automatically retry. You can also
                        // return a specific retry interval here.
                    }
                }
            });
            subject.complete();
        };

        fetchSource();

        return subject;
    }
}
