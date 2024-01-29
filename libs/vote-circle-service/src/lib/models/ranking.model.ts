export interface Ranking {
    id: number;
    candidateId: number;
    identityId: string;
    number: number;
    votes: number;
    indexedOrder: number;
    placement: Placement;
    circleId: number;
    createdAt: Date;
    updatedAt: Date;
}

export enum Placement {
    Neutral = 'NEUTRAL',
    Ascending = 'ASCENDING',
    Descending = 'DESCENDING'
}
