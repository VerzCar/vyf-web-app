import { Injectable } from '@angular/core';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { Amplify, Auth } from 'aws-amplify';
import { from, Observable, of } from 'rxjs';
import awsconfig from '../../../aws-exports';

@Injectable({
    providedIn: 'root'
})
export class AwsCognitoService {
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
        return from(Auth.signOut());
    }

    public getCurrentSession(): Observable<CognitoUserSession> {
        return from(Auth.currentSession());
    }
}
