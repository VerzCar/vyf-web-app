import { tap } from 'rxjs';
import { AwsCognitoService } from '../services/aws-cognito.service';

export const initializeAppFactory = (awsService: AwsCognitoService) => {
    return () => awsService.getCurrentSession$().pipe(
        tap({
            next: session => console.log('logged in', session),
            error: err => console.log('not signed in', err)
        })
    );
};
