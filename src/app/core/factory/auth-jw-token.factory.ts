import { map } from 'rxjs';
import { AwsCognitoService } from '../services/aws-cognito.service';

export const authJwtTokenFactory = (awsService: AwsCognitoService) => awsService.authSession$.pipe(
    map(session => session.tokens?.accessToken.toString())
);
