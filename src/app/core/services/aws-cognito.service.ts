import { inject, Injectable } from '@angular/core';
import { AuthSession } from '@aws-amplify/core/dist/esm/singleton/Auth/types';
import { Store } from '@ngxs/store';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { from, Observable, tap } from 'rxjs';
import awsconfig from '../../../aws-exports';
import { CirclesState } from '../../modules/circles/state/circles.state';
import { RankingState } from '../../modules/ranking/state/ranking.state';
import { UserState } from '../../modules/user/state/user.state';

@Injectable({
    providedIn: 'root'
})
export class AwsCognitoService {
    private readonly store = inject(Store);

    constructor() {
        Amplify.configure(awsconfig);
    }

    public get authSession$(): Observable<AuthSession> {
        return from(fetchAuthSession());
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


}
