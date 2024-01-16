import { Candidate } from './candidate.model';

export interface CircleCandidate {
    candidates: Candidate[];
    userCandidate: Candidate | null;
}
