import { createPropertySelectors, createSelector, Selector } from '@ngxs/store';
import { Commitment } from '@vyf/vote-circle-service';
import { Member as MemberModel, MemberStateModel } from '../models';
import { MemberState } from './member.state';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MemberSelectors {

    export class Member {
        public static slices = createPropertySelectors<MemberStateModel>(MemberState);
    }

    export class CircleSelector {
        /**
         * Selector that determines if the current circle voter has not committed to be in circle.
         * @returns {(selectedCircleVoter: (CircleVoter | undefined)) => boolean}
         */
        @Selector([Member.slices.circleUserMember])
        public static hasOpenCommitment(member: MemberModel | undefined): boolean {
            return member?.voter.commitment === Commitment.Open;
        }
    }

    export class RankingSelector {
        public static canVote(identityId: string) {
            return createSelector([Member.slices.rankingUserMember], (member: MemberModel | undefined): boolean => {
                if (identityId === member?.user.identityId) {
                    return false;
                }

                return member?.voter.votedFor === null;
            });
        }
    }
}
