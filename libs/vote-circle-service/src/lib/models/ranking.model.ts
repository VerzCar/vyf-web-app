export interface Ranking {
    id: number;
    identityId: string;
    number: number;
    votes: number;
    placement: Placement;
    createdAt: Date;
    updatedAt: Date;
}

export enum Placement {
    Neutral = 'NEUTRAL',
    Ascending = 'ASCENDING',
    Descending = 'DESCENDING'
}
