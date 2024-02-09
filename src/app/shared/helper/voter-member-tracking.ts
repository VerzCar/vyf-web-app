import { VoterMember } from '../models';

export const voterMemberTracking = (index: number, member: VoterMember): number => {
    const voter = member.voter;

    return index +
        Number(voter.votedFor);
};
