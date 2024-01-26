import { createPropertySelectors, createSelector, Selector } from '@ngxs/store';
import { User } from '@vyf/user-service';
import { Commitment } from '@vyf/vote-circle-service';
import { UserSelectors } from '../../modules/user/state/user.selectors';
import { CandidateMember, MemberStateModel, VoterMember } from '../models';
import { MemberState } from './member.state';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MemberSelectors {

    export class Member {
        public static slices = createPropertySelectors<MemberStateModel>(MemberState);
    }

    export class CircleSelector {
        /**
         * Selector that determines if the current circle candidate has not committed to be in circle.
         * @returns true if the current circle candidate has not committed to be in circle.
         */
        @Selector([Member.slices.circleUserCandidateMember])
        public static hasOpenCommitment(member: CandidateMember | undefined): boolean {
            return member?.candidate.commitment === Commitment.Open;
        }

        /**
         * Checks if a user is a voter member of a circle.
         *
         * @param {User|undefined} user - The user object.
         * @param {VoterMember[]} members - An array of voter members.
         * @param {VoterMember|undefined} member - The voter member object.
         * @returns {boolean} - Returns true if the user is a voter member of the circle, false otherwise.
         */
        @Selector([
            UserSelectors.slices.user,
            Member.slices.circleVoterMembers,
            Member.slices.circleUserVoterMember
        ])
        public static isUserVoterMemberOfCircle(
            user: User | undefined,
            members: VoterMember[],
            member: VoterMember | undefined
        ): boolean {
            if (!user) {
                return false;
            }

            if (member && member.user.identityId === user.identityId) {
                return true;
            }

            return members && members.some(member => member.user.identityId === user.identityId);
        }

        /**
         * Checks if a given user is a candidate member of a circle.
         *
         * @param {User | undefined} user - The user to check.
         * @param {CandidateMember[]} members - The list of candidate members.
         * @param {CandidateMember | undefined} member - The specific candidate member to check (optional).
         * @returns {boolean} - Returns true if the user is a candidate member, false otherwise.
         */
        @Selector([
            UserSelectors.slices.user,
            Member.slices.circleCandidateMembers,
            Member.slices.circleUserCandidateMember
        ])
        public static isUserCandidateMemberOfCircle(
            user: User | undefined,
            members: CandidateMember[],
            member: CandidateMember | undefined
        ): boolean {
            if (!user) {
                return false;
            }

            if (member && member.user.identityId === user.identityId) {
                return true;
            }

            return members && members.some(member => member.user.identityId === user.identityId);
        }
    }

    export class RankingSelector {

        /**
         * Determines if the user is a voter, if not it cannot vote at all.
         * if the user is a voter and has already voted, it cannot vote.
         * If the user is a voter and the given identityId is not the same as himself,
         * he can vote.
         * @param {string} identityId - The identity ID of the user.
         * @returns {(member: (VoterMember | undefined)) => boolean} - A function that takes a voter member object and returns a boolean value indicating whether the user can vote.
         */
        public static canVote(identityId: string) {
            return createSelector([Member.slices.rankingUserVoterMember], (member: VoterMember | undefined): boolean => {
                if (!member) {
                    return false;
                }

                if (member.voter.votedFor !== null) {
                    return false;
                }

                return identityId !== member.user.identityId;
            });
        }
    }
}
