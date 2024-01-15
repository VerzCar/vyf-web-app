import { createPropertySelectors, createSelector, Selector } from '@ngxs/store';
import { User } from '@vyf/user-service';
import { Commitment } from '@vyf/vote-circle-service';
import { UserSelectors } from '../../modules/user/state/user.selectors';
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

        /**
         * Determines if the user is a member of the circle members.
         * @param user
         * @param {Member[] | undefined} members
         * @param {Member | undefined} member
         * @returns {boolean}
         */
        @Selector([
            UserSelectors.slices.user,
            Member.slices.circleMembers,
            Member.slices.circleUserMember
        ])
        public static isUserMemberOfCircle(
            user: User | undefined,
            members: MemberModel[] | undefined,
            member: MemberModel | undefined
        ): boolean {
            if (!user) {
                return false;
            }

            if (member && member.user.identityId === user.identityId) {
                return true;
            }

            if (members && members.some(member => member.user.identityId === user.identityId)) {
                return true;
            }

            return false;
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
