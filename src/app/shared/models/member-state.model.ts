import { CandidateMember } from './candidate-member.model';
import { VoterMember } from './voter-member.model';

export interface MemberStateModel {
    circleVoterMembers: VoterMember[];
    circleUserVoterMember: VoterMember | undefined;
    circleCandidateMembers: CandidateMember[];
    circleUserCandidateMember: CandidateMember | undefined;
    rankingVoterMembers: VoterMember[];
    rankingUserVoterMember: VoterMember | undefined;
    rankingCandidateNeedVoteMembers: CandidateMember[];
    preFetchedCircleMembers: PreFetch;
    preFetchedRankingMembers: PreFetch;
}

export interface PreFetch {
    circleId: number;
    fetched: boolean;
}
