import { Placement } from '../models';

export const placementTracking = (index: number, placement: Placement): number => {
    const ranking = placement.ranking;

    return index +
        ranking.number +
        ranking.votes +
        ranking.indexedOrder;
};
