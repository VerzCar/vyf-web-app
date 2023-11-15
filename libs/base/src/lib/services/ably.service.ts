import { Injectable } from '@angular/core';
import * as Ably from 'ably';

@Injectable({
    providedIn: 'root'
})
export class AblyService {

    // Create the client
    private readonly ably = new Ably.Realtime.Promise({
        authUrl: 'https://ably.com/ably-auth/token/docs'
    });

    constructor() {
    }
}
