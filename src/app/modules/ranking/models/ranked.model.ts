import { User } from '@vyf/user-service';
import { Ranking } from '@vyf/vote-circle-service';

export interface Ranked {
    user: User;
    ranking: Ranking;
}
