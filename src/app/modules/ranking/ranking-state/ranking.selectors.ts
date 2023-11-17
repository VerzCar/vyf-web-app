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

        for (const [index, ranking] of rankings.entries()) {
            if (index >= 2) {
                break;
            }

            switch (ranking.number) {
                case 1: {
                    topThreeRankings[0] = ranking;
                    break;
                }
                case 2: {
                    topThreeRankings[1] = ranking;
                    break;
                }
                case 3: {
                    topThreeRankings[2] = ranking;
                    break;
                }
            }
        }

        return topThreeRankings;
    }
}
