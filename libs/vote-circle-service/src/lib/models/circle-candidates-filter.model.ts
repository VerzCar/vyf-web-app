import { Commitment } from './commitment.model';

export interface CircleCandidatesFilter {
    commitment: Commitment[0] | Commitment[1] | Commitment[2];
    hasBeenVoted: boolean;
}
