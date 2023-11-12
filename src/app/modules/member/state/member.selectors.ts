import { createPickSelector, createPropertySelectors, createSelector, Selector } from '@ngxs/store';
import { Member, MemberStateModel } from '../models';
import { MemberState } from './member.state';

export class MemberSelectors {
    public static slices = createPropertySelectors<MemberStateModel>(MemberState);

    public static fullMemberState = createSelector([MemberState], (state: MemberStateModel) => state);

    public static circleMembers = createPickSelector(MemberSelectors.fullMemberState, [
        'selectedCircle',
        'members'
    ]);

    @Selector([MemberSelectors.slices.userMember])
    public static canVote(member: Member | undefined): boolean {
        if (!member) {
            return false;
        }

        return member.voter.votedFor === null;
    }
}
