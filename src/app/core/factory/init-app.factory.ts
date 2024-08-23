import { catchError, from, of, switchMap } from 'rxjs';
import { AwsCognitoService } from '../services/aws-cognito.service';
import { UserStorageService } from '../services/user-storage.service';

export const initializeAppFactory = (awsService: AwsCognitoService, userStorageService: UserStorageService) => {
    return () => awsService.getCurrentSession$().pipe(
        switchMap(() => {
            return from(userStorageService.initUser());
        }),
        catchError(err => {
            return of();
        })
    );
};
