import { Commitment } from './commitment.model';

export interface Voter {
  id: number;
  voter: string;
  commitment: Commitment;
  createdAt: Date;
  updatedAt: Date;
}
