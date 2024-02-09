import { CandidateMember } from '../models';

export const candidateMemberTracking = (index: number, member: CandidateMember): number => {
    const candidate = member.candidate;

    return index +
        Number(candidate.commitment);
};
