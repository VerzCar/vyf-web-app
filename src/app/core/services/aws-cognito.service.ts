import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthSession } from '@aws-amplify/core/dist/esm/singleton/Auth/types';
import { Store } from '@ngxs/store';
import { Amplify } from 'aws-amplify';
import { AuthUser, fetchAuthSession, getCurrentUser, signOut  } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { from, Observable, Subject, tap } from 'rxjs';
import awsconfig from '../../../aws-exports';
import { CirclesState } from '../../modules/circles/state/circles.state';
import { RankingState } from '../../modules/ranking/state/ranking.state';
import { UserState } from '../../shared/state/user.state';
import { UserStorageService } from './user-storage.service';

interface AuthHubChange {
    payload: {
        event: 'signedIn' | 'signedOut' | 'tokenRefresh' | 'signInWithRedirect' | 'signInWithRedirect_failure'
    };
}

@Injectable({
    providedIn: 'root'
})
export class AwsCognitoService {
    private readonly signedIn$: Observable<void>;
    private readonly signedInSubject = new Subject<void>();

    private readonly store = inject(Store);
    private readonly userStorageService = inject(UserStorageService);

    constructor() {
        Amplify.configure(awsconfig);
        Hub.listen('auth', this.authChanges.bind(this));

        this.signedIn$ = this.signedInSubject.asObservable();

        this.signedIn$.pipe(
            tap(() => location.reload()),
            takeUntilDestroyed()
        ).subscribe();
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
                this.userStorageService.clear();
                this.store.reset(UserState);
                this.store.reset(CirclesState);
                this.store.reset(RankingState);
            })
        );
    }

    private authChanges(data: AuthHubChange) {
        switch (data.payload.event) {
            case 'signedIn':
                this.signedInSubject.next();
                console.log('user have been signedIn successfully.');
                break;
            case 'signedOut':
                this.userStorageService.clear();
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
