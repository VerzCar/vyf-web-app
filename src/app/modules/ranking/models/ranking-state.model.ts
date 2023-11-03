import { Circle, Ranking } from '@vyf/vote-circle-service';

export interface RankingStateModel {
    selectedCircle: Circle | undefined;
    topThreeRankings: Ranking[] | undefined;
    rankings: Ranking[] | undefined;
}
