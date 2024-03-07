import { VoterRequest } from './voter-request.model';

export interface CircleUpdateRequest {
    readonly id: number;
    readonly name?: string;
    readonly voters?: VoterRequest[];
    readonly description?: string;
    readonly imageSrc?: string;
    readonly delete?: boolean;
    readonly validFrom?: Date | null;
    readonly validUntil?: Date | null;
}
