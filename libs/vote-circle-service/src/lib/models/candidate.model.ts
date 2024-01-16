import { Commitment } from './commitment.model';

export interface Candidate {
    id: number;
    candidate: string;
    commitment: Commitment;
    votedFrom: string | null;
    createdAt: Date;
    updatedAt: Date;
}
