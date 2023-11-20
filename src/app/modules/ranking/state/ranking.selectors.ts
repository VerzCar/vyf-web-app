import { createPropertySelectors, Selector } from '@ngxs/store';
import { Ranking } from '@vyf/vote-circle-service';
import { RankingStateModel } from '../models';
import { RankingState } from './ranking.state';

export class RankingSelectors {
    public static slices = createPropertySelectors<RankingStateModel>(RankingState);

    @Selector([RankingSelectors.slices.rankings])
    public static topThreeRankings(rankings: Ranking[] | undefined): Ranking[] {
        const topThreeRankings: Ranking[] = [];
        if (!rankings) {
            return topThreeRankings;
        }

        // determines if they are any top ranked that the next one ranked has a lower ranked number
        if(rankings[0].number === 1 && rankings[1].number !== 1) {
            topThreeRankings.push(rankings[0])
        }

        if(rankings[1].number === 2 && rankings[2].number !== 2) {
            topThreeRankings.push(rankings[1])
        }

        if(rankings[2].number === 3 && rankings[3].number !== 3) {
            topThreeRankings.push(rankings[2])
        }

        return topThreeRankings;
    }

    @Selector([RankingSelectors.slices.rankings, RankingSelectors.topThreeRankings])
    public static rankings(rankings: Ranking[] | undefined, topThreeRankings: Ranking[]): Ranking[] {
        if (!rankings) {
            return [];
        }

        const topThreeRankingsLength = topThreeRankings?.length ?? 0;
        return rankings.slice(topThreeRankingsLength, rankings.length);
    }
}
