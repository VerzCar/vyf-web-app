import { createPropertySelectors, createSelector, Selector } from '@ngxs/store';
import { User, UserPaginated } from '@vyf/user-service';
import { Circle, CircleStage } from '@vyf/vote-circle-service';
import { RankingSelectors } from '../../modules/ranking/state/ranking.selectors';
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

        @Selector([
            Member.slices.circleVoterMembers
        ])
        public static voterUsers(
            members: VoterMember[]
        ): UserPaginated[] {
            return members.map(member => member.user);
        }

        @Selector([
            Member.slices.circleCandidateMembers
        ])
        public static candidateUsers(
            members: CandidateMember[]
        ): UserPaginated[] {
            return members.map(member => member.user);
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
            return createSelector([
                RankingSelectors.slices.selectedCircle,
                Member.slices.rankingUserVoterMember
            ], (circle: Circle | undefined, member: VoterMember | undefined): boolean => {
                if (!member || !circle) {
                    return false;
                }

                if (circle.stage !== CircleStage.Hot) {
                    return false;
                }

                if (member.voter.votedFor !== null) {
                    return false;
                }

                return identityId !== member.user.identityId;
            });
        }

        /**
         * Determines if the user is a voter, if not it cannot revoke a vote at all.
         * And if he has already placed a vote.
         * And the placed vote id the same as the given identityId.
         * @param {string} identityId
         * @returns {(member: (VoterMember | undefined)) => boolean} - A function that takes a voter member object and returns a boolean value indicating whether the user can revoke a vote.
         */
        public static canRevokeVote(identityId: string) {
            return createSelector([
                RankingSelectors.slices.selectedCircle,
                Member.slices.rankingUserVoterMember
            ], (circle: Circle | undefined, member: VoterMember | undefined): boolean => {
                if (!member || !circle) {
                    return false;
                }

                if (circle.stage !== CircleStage.Hot) {
                    return false;
                }

                if (member.voter.votedFor === null) {
                    return false;
                }

                return member.voter.votedFor === identityId;
            });
        }

        /**
         * Determines if the ranking user as voter has voted for the given identityId.
         * @param {string} identityId
         * @returns {(member: (VoterMember | undefined)) => boolean} true if has voted for the given id, otherwise false.
         */
        public static hasVotedFor(identityId: string) {
            return createSelector([Member.slices.rankingUserVoterMember], (member: VoterMember | undefined): boolean => {
                if (!member) {
                    return false;
                }

                return member.voter.votedFor === identityId;
            });
        }

        /**
         * Determines if the current user is a member as voter for the circle ranking list.
         * @returns {(member: (VoterMember | undefined)) => boolean} true if the user is a voter, otherwise false.
         */
        public static isVoter() {
            return createSelector([Member.slices.rankingUserVoterMember], (member: VoterMember | undefined): boolean => {
                if (!member) {
                    return false;
                }

                return true;
            });
        }
    }
}
