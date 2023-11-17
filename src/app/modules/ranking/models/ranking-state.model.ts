import { Circle, Ranking } from '@vyf/vote-circle-service';

export interface RankingStateModel {
    selectedCircle: Circle | undefined;
    rankings: Ranking[] | undefined;
}
