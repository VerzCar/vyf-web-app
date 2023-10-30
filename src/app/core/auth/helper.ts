import { map } from 'rxjs';
import { AwsCognitoService } from '../services/aws-cognito.service';

export const authJwtTokenFactory = (awsService: AwsCognitoService) => {
    return awsService.getCurrentSession().pipe(map(session => session.getAccessToken().getJwtToken()));
};
