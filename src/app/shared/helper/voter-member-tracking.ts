import { VoterMember } from '../models';

export const voterMemberTracking = (index: number, member: VoterMember): number => {
    const voter = member.voter;

    return Number(voter.votedFor);
};
