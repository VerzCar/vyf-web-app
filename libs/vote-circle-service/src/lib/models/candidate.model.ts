import { Commitment } from './commitment.model';

export interface Candidate {
    id: number;
    candidate: string;
    commitment: Commitment;
    createdAt: Date;
    updatedAt: Date;
}
