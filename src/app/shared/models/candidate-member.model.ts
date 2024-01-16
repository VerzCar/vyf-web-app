import { User } from '@vyf/user-service';
import { Candidate } from '@vyf/vote-circle-service';

export interface CandidateMember {
    user: User;
    candidate: Candidate;
}
