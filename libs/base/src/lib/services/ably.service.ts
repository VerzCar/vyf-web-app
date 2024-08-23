import { inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as Ably from 'ably';

import { from, map, Observable, of, Subject, switchMap } from 'rxjs';

export const AUTH_JWT_TOKEN_FACTORY = new InjectionToken<Observable<string>>('JWT Token request factory', {
    providedIn: 'any',
    factory: () => of('')
});

export const ABLY_TOKEN_URL_FACTORY = new InjectionToken<string>('Ably Token url factory', {
    providedIn: 'any',
    factory: () => window.location.origin
});

export type AblyMessage = Ably.Message;

@Injectable({
    providedIn: 'root'
})
export class AblyService implements OnDestroy {

    private readonly _client: Ably.RealtimeClient;

    private readonly _authJwtTokenReqFactory = inject(AUTH_JWT_TOKEN_FACTORY);
    private readonly _ablyTokenUrl = inject(ABLY_TOKEN_URL_FACTORY);

    private readonly defaultClientOptions: Ably.ClientOptions = {
        authUrl: this._ablyTokenUrl,
        authMethod: 'GET',
        autoConnect: false
    };

    constructor() {
        this._client = new Ably.Realtime(this.defaultClientOptions);
        this.authorize$().pipe(
            takeUntilDestroyed()
        ).subscribe();
    }

    public ngOnDestroy(): void {
        this._client.close();
    }

    public close$(): Observable<Ably.ConnectionStateChange> {
        this._client.close();
        return from(this._client.connection.once('closed'));
    }

    public stats(): Ably.ConnectionState {
        return this._client.connection.state;
    }

    public channel(name: string): Ably.RealtimeChannel {
        return this._client.channels.get(name);
    }

    public subscribeToChannel(channel: Ably.RealtimeChannel, event: string, messageSubject: Subject<Ably.Message>) {
        return from(channel.subscribe(event, (msg) => messageSubject.next(msg)));
    }

    public unsubscribeFromChannel(channel: Ably.RealtimeChannel) {
        channel.unsubscribe();
    }

    public authorize$(): Observable<Ably.TokenDetails> {
        return this._authJwtTokenReqFactory.pipe(
            switchMap(token => {
                if (this.stats() === 'connected') {
                    this.close$().pipe(
                        map(() => token)
                    );
                }

                return of(token);
            }),
            switchMap(token => this.authorizeFromToken$(token))
        );
    }

    private authorizeFromToken$(token: string): Observable<Ably.TokenDetails> {
        return from(this._client.auth.authorize(undefined, {
            ...this.defaultClientOptions,
            authHeaders: {
                'Authorization': `Bearer ${token}`
            }
        }));
    }
}
