import { EventOperation } from './event-operation.model';
import { Voter } from './voter.model';

export interface CircleVoterChangeEvent {
    operation: EventOperation;
    voter: Voter;
}
