import { Candidate } from './candidate.model';
import { EventOperation } from './event-operation.model';

export interface CircleCandidateChangeEvent {
    operation: EventOperation;
    candidate: Candidate;
}
