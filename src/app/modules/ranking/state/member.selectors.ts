import { createPropertySelectors, createSelector } from '@ngxs/store';
import { Member, MemberStateModel } from '../models';
import { MemberState } from './member.state';

export class MemberSelectors {
    public static slices = createPropertySelectors<MemberStateModel>(MemberState);

    public static canVote(identityId: string) {
        return createSelector([MemberSelectors.slices.userMember], (member: Member | undefined): boolean => {
            if (identityId === member?.user.identityId) {
                return false;
            }

            return member?.voter.votedFor === null;
        });
    }
}
