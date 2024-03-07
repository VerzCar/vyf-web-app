import { CandidateRequest } from './candidate-request.model';
import { VoterRequest } from './voter-request.model';

export interface CircleCreateRequest {
    readonly name: string;
    readonly description?: string;
    readonly imageSrc?: string;
    readonly voters: VoterRequest[];
    readonly candidates: CandidateRequest[];
    readonly private?: boolean;
    readonly validFrom?: Date;
    readonly validUntil?: Date;
}
