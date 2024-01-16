import { CandidateMember } from './candidate-member.model';
import { VoterMember } from './voter-member.model';

export interface MemberStateModel {
    circleVoterMembers: VoterMember[];
    circleUserVoterMember: VoterMember | undefined;
    circleCandidateMembers: CandidateMember[];
    circleUserCandidateMember: CandidateMember | undefined;
    rankingVoterMembers: VoterMember[];
    rankingUserVoterMember: VoterMember | undefined;
    rankingCandidateMembers: CandidateMember[];
    rankingUserCandidateMember: CandidateMember | undefined;
}
