import { Commitment } from './commitment.model';

export interface CircleVotersFilter {
    commitment: Commitment[0] | Commitment[1] | Commitment[2];
    hasBeenVoted: boolean;
    shouldContainUser: boolean;
}
