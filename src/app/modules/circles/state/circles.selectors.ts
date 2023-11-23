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

    /**
     * Selector that determines if the current selected circle voter has not committed to be in circle.
     * @returns {(selectedCircleVoter: (CircleVoter | undefined)) => boolean}
     */
    @Selector([CirclesSelectors.slices.selectedCircleVoter])
    public static hasOpenCommitment(selectedCircleVoter: CircleVoter | undefined): boolean {
        return selectedCircleVoter?.userVoter.commitment === Commitment.Open;
    }
}
