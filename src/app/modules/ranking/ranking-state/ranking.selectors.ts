import { createPropertySelectors } from '@ngxs/store';
import { RankingStateModel } from '../models';
import { RankingState } from './ranking.state';

export class RankingSelectors {
    static slices = createPropertySelectors<RankingStateModel>(RankingState);
}
