import { VoterRequest } from './voter-request.model';

export interface CircleCreateRequest {
    readonly name: string;
    readonly voters: VoterRequest[];
    readonly description?: string;
    readonly imageSrc?: string;
    readonly private?: boolean;
    readonly validUntil?: Date;
}
