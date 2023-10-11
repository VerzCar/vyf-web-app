import { VoterRequest } from './voter-request.model';

export interface CircleUpdateRequest {
  readonly id: number;
  readonly name?: string;
  readonly voters?: VoterRequest[];
  readonly description?: string;
  readonly imageSrc?: string;
  readonly private?: boolean;
  readonly delete?: boolean;
  readonly validUntil?: Date;
}
