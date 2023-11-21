import { User } from '@vyf/user-service';
import { Ranking } from '@vyf/vote-circle-service';

export interface Placement {
    user: User;
    ranking: Ranking;
}
