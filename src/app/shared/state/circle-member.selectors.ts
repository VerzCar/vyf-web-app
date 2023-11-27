import { createPropertySelectors, createSelector, Selector } from '@ngxs/store';
import { Commitment } from '@vyf/vote-circle-service';
import { Member, MemberStateModel } from '../models';
import { CircleMemberState } from './circle-member.state';

export class CircleMemberSelectors {
    public static slices = createPropertySelectors<MemberStateModel>(CircleMemberState);

    public static canVote(identityId: string) {
        return createSelector([CircleMemberSelectors.slices.userMember], (member: Member | undefined): boolean => {
            if (identityId === member?.user.identityId) {
                return false;
            }

            return member?.voter.votedFor === null;
        });
    }

    /**
     * Selector that determines if the current circle voter has not committed to be in circle.
     * @returns {(selectedCircleVoter: (CircleVoter | undefined)) => boolean}
     */
    @Selector([CircleMemberSelectors.slices.userMember])
    public static hasOpenCommitment(member: Member | undefined): boolean {
        return member?.voter.commitment === Commitment.Open;
    }
}
