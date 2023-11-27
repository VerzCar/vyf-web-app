import { createPropertySelectors, createSelector, Selector } from '@ngxs/store';
import { User } from '@vyf/user-service';
import { Circle, CircleVoter, Commitment } from '@vyf/vote-circle-service';
import { UserSelectors } from '../../user/state/user.selectors';
import { CirclesStateModel } from '../models';
import { CirclesState } from './circles.state';

export class CirclesSelectors {
    static slices = createPropertySelectors<CirclesStateModel>(CirclesState);

    @Selector([UserSelectors.slices.user, CirclesSelectors.slices.selectedCircle])
    public static canEditCircle(user: User | undefined, selectedCircle: Circle | undefined): boolean {
        return user?.identityId === selectedCircle?.createdFrom;
    }
}
