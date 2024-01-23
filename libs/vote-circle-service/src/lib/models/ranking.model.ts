export interface Ranking {
    id: number;
    eventId: string;
    identityId: string;
    number: number;
    votes: number;
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
