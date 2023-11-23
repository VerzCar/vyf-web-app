import { createPropertySelectors, Selector } from '@ngxs/store';
import { RankingStateModel } from '../models';
import { Placement } from '../models';
import { RankingState } from './ranking.state';

export class RankingSelectors {
    public static slices = createPropertySelectors<RankingStateModel>(RankingState);

    @Selector([RankingSelectors.slices.placements])
    public static topThreePlacements(placements: Placement[] | undefined): Placement[] {
        const topThreePlacements: Placement[] = [];

        if (!placements) {
            return topThreePlacements;
        }

        // determines if they are any top ranked that the next one ranked has a lower ranked number
        if(placements.at(0)?.ranking.number === 1 && placements.at(1)?.ranking.number !== 1) {
            topThreePlacements.push(placements[0])
        }

        if(placements.at(1)?.ranking.number === 2 && placements.at(2)?.ranking.number !== 2) {
            topThreePlacements.push(placements[1])
        }

        if(placements.at(2)?.ranking.number === 3 && placements.at(3)?.ranking.number !== 3) {
            topThreePlacements.push(placements[2])
        }

        return topThreePlacements;
    }

    @Selector([RankingSelectors.slices.placements, RankingSelectors.topThreePlacements])
    public static placements(placements: Placement[] | undefined, topThreePlacements: Placement[]): Placement[] {
        if (!placements) {
            return [];
        }

        if(!topThreePlacements.length) {
            return placements;
        }

        return placements.slice(topThreePlacements.length, placements.length);
    }
}
