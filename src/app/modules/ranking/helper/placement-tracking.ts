import { Placement } from '../models';

export const placementTracking = (index: number, placement: Placement): number => {
    const ranking = placement.ranking;

    return ranking.number +
        ranking.votes +
        ranking.indexedOrder;
};
