import { User } from '@vyf/user-service';
import { Voter } from '@vyf/vote-circle-service';

export interface VoterMember {
    user: User;
    voter: Voter;
}
