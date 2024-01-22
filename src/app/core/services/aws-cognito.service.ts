import { inject, Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { Amplify, Auth } from 'aws-amplify';
import { from, Observable, of, tap } from 'rxjs';
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

    // public signUp(user: IUser): Promise<any> {
    // return Auth.signUp({
    //   username: user.email,
    //   password: user.password,
    // });
    // }
    //
    // public confirmSignUp(user: IUser): Promise<any> {
    // return Auth.confirmSignUp(user.email, user.code);
    // }
    //
    // public signIn(user: IUser): Promise<any> {
    // return Auth.signIn(user.email, user.password)
    // 		   .then(() => {
    // 			 this.authenticationSubject.next(true);
    // 		   });
    // }

    public signOut(): Observable<unknown> {
        return from(Auth.signOut()).pipe(
            tap(() => {
                console.log('entered');
                this.store.reset(UserState);
                this.store.reset(CirclesState);
                this.store.reset(RankingState);
            })
        );
    }

    public getCurrentSession(): Observable<CognitoUserSession> {
        return from(Auth.currentSession());
    }
}
