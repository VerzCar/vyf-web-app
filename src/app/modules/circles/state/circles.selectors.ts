import { createPropertySelectors, Selector } from '@ngxs/store';
import { User } from '@vyf/user-service';
import { Circle, CircleStage } from '@vyf/vote-circle-service';
import { UserSelectors } from '../../../shared/state/user.selectors';
import { CirclesStateModel } from '../models';
import { CirclesState } from './circles.state';

export class CirclesSelectors {
    public static slices = createPropertySelectors<CirclesStateModel>(CirclesState);

    @Selector([UserSelectors.slices.user, CirclesSelectors.slices.selectedCircle])
    public static canEditCircle(user: User | undefined, circle: Circle | undefined): boolean {
        return user?.identityId === circle?.createdFrom &&
            circle?.active === true &&
            circle?.stage !== CircleStage.Closed;
    }
}
