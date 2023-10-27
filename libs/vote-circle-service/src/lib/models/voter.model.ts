import { Commitment } from './commitment.model';

export interface Voter {
    id: number;
    voter: string;
    commitment: Commitment;
    votedFor: string | null;
    votedFrom: string | null;
    createdAt: Date;
    updatedAt: Date;
}
