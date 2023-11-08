import { createPickSelector, createPropertySelectors, createSelector, Selector } from '@ngxs/store';
import { User } from '@vyf/user-service';
import { Circle } from '@vyf/vote-circle-service';
import { UserSelectors } from '../../user/user-state/user.selectors';
import { MemberStateModel } from '../models';
import { MemberState } from './member.state';

export class MemberSelectors {
    public static slices = createPropertySelectors<MemberStateModel>(MemberState);

    public static fullMemberState = createSelector([MemberState], (state: MemberStateModel) => state);

    public static circleMembers = createPickSelector(MemberSelectors.fullMemberState, [
        'selectedCircle',
        'members'
    ]);

    @Selector([MemberSelectors.slices.selectedCircle, UserSelectors.slices.user])
    public static canVote(selectedCircle: Circle | undefined, user: User | undefined): boolean {
        if (!selectedCircle && !user) {
            return false;
        }

        const userIdentityId = user!.identityId;
        const userVoter = selectedCircle!.voters.find(voter => voter.voter === userIdentityId);

        if (!userVoter) {
            return false;
        }

        return userVoter.votedFor === null;
    }
}
