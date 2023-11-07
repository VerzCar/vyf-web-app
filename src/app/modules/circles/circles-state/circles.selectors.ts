import { createPropertySelectors, createSelector } from '@ngxs/store';
import { UserStateModel } from '../../user/models/user-state.model';
import { UserState } from '../../user/user-state/user.state';
import { CirclesStateModel } from '../models';
import { CirclesState } from './circles.state';

export class CirclesSelectors {
    static slices = createPropertySelectors<CirclesStateModel>(CirclesState);

    static canEditCircle() {
        return createSelector([UserState, CirclesState], (userState: UserStateModel, circleState: CirclesStateModel): boolean => {
            return userState.user?.identityId === circleState.selectedCircle?.createdFrom;
        });
    }

    static canViewCircle() {
        return createSelector([UserState, CirclesState], (userState: UserStateModel, circleState: CirclesStateModel): boolean => {
            return userState.user?.identityId === circleState.selectedCircle?.createdFrom;
        });
    }
}
