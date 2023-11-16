import { inject, Injectable, InjectionToken } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Types } from 'ably';
import * as Ably from 'ably';
import { bindCallback, bindNodeCallback, from, fromEvent, Observable, of, switchMap } from 'rxjs';

export const AUTH_JWT_TOKEN_FACTORY = new InjectionToken<Observable<string>>('JWT Token request factory', {
    providedIn: 'any',
    factory: () => of('')
});

@Injectable({
    providedIn: 'root'
})
export class AblyService {

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

    public subscribeToChannel(channel: Types.RealtimeChannelPromise) {
        const messageCallback = (msg: Types.Message) => new Promise((resolve) => resolve(msg));
        let message$= from(messageCallback);

        return from(channel.subscribe('', messageCallback)).pipe(
            switchMap(() => message$())
        )
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
