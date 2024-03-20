import { inject, Injectable } from '@angular/core';
import { AuthSession } from '@aws-amplify/core/dist/esm/singleton/Auth/types';
import { Store } from '@ngxs/store';
import { Amplify } from 'aws-amplify';
import { AuthUser, fetchAuthSession, getCurrentUser, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { from, Observable, tap } from 'rxjs';
import awsconfig from '../../../aws-exports';
import { CirclesState } from '../../modules/circles/state/circles.state';
import { RankingState } from '../../modules/ranking/state/ranking.state';
import { UserState } from '../../modules/user/state/user.state';

interface AuthHubChange {
    payload: {
        event: 'signedIn' | 'signedOut' | 'tokenRefresh' | 'signInWithRedirect' | 'signInWithRedirect_failure'
    }
}

@Injectable({
    providedIn: 'root'
})
export class AwsCognitoService {
    private readonly store = inject(Store);

    constructor() {
        Amplify.configure(awsconfig);
        Hub.listen('auth', this.authChanges.bind(this));
    }

    public get authSession$(): Observable<AuthSession> {
        return from(fetchAuthSession());
    }

    public getCurrentSession$(): Observable<AuthUser> {
        return from(getCurrentUser());
    }

    public signOut(): Observable<void> {
        return from(signOut()).pipe(
            tap(() => {
                this.store.reset(UserState);
                this.store.reset(CirclesState);
                this.store.reset(RankingState);
            })
        );
    }

    private authChanges(data: AuthHubChange) {
        switch (data.payload.event) {
            case 'signedIn':
                console.log('user have been signedIn successfully.');
                break;
            case 'signedOut':
                console.log('user have been signedOut successfully.');
                break;
            case 'signInWithRedirect':
                console.log('signInWithRedirect API has successfully been resolved.');
                break;
            case 'signInWithRedirect_failure':
                console.log('failure while trying to resolve signInWithRedirect API.');
                break;
        }
    }

}
