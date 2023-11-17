import { inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Types } from 'ably';
import * as Ably from 'ably';
import { from, Observable, of, Subject, switchMap } from 'rxjs';

export const AUTH_JWT_TOKEN_FACTORY = new InjectionToken<Observable<string>>('JWT Token request factory', {
    providedIn: 'any',
    factory: () => of('')
});

export type AblyMessage = Types.Message;

@Injectable({
    providedIn: 'root'
})
export class AblyService implements OnDestroy {

    private readonly _client: Ably.Types.RealtimePromise;

    private readonly _authJwtTokenReqFactory = inject(AUTH_JWT_TOKEN_FACTORY);

    constructor() {
        this._client = new Ably.Realtime.Promise({
            authUrl: 'v1/api/vote-circle/token/ably',
            autoConnect: false
        });

        this.authorize$().pipe(
            takeUntilDestroyed()
        ).subscribe();
    }

    public ngOnDestroy(): void {
        this._client.close();
    }

    public connect$(): Observable<Types.ConnectionStateChange> {
        this._client.connect();
        return from(this._client.connection.once('connected'));
    }

    public close$(): Observable<Types.ConnectionStateChange> {
        this._client.close();
        return from(this._client.connection.once('closed'));
    }

    public stats(): Types.ConnectionState {
        return this._client.connection.state;
    }

    public channel(name: string): Types.RealtimeChannelPromise {
        return this._client.channels.get(name);
    }

    public subscribeToChannel(channel: Types.RealtimeChannelPromise, event: string, messageSubject: Subject<Types.Message>) {
        return from(channel.subscribe(event, (msg) => messageSubject.next(msg)))
    }

    private authorize$(): Observable<Types.TokenDetails> {
        return this._authJwtTokenReqFactory.pipe(
            switchMap(token => this.authorizeFromToken$(token))
        );
    }

    private authorizeFromToken$(token: string): Observable<Types.TokenDetails> {
        return from(this._client.auth.authorize(undefined, {
            authUrl: 'v1/api/vote-circle/token/ably',
            authMethod: 'GET',
            authHeaders: {
                'Authorization': `Bearer ${token}`
            }
        }));
    }
}
