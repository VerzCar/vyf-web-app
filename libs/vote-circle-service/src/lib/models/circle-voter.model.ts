import { Voter } from './voter.model';

export interface CircleVoter {
    voters: Voter[];
    userVoter: Voter | null;
}
