import { User } from '@vyf/user-service';
import { Voter } from '@vyf/vote-circle-service';

export interface Member {
    user: User;
    voter: Voter;
}
