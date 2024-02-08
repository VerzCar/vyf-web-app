import { Ranking } from './ranking.model';
import { EventOperation } from './event-operation.model';

export interface RankingChangeEvent {
    operation: EventOperation;
    ranking: Ranking;
}
