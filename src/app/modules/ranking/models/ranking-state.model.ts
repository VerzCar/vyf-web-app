import { Circle } from '@vyf/vote-circle-service';
import { Placement } from './placement.model';

export interface RankingStateModel {
    selectedCircle: Circle | undefined;
    placements: Placement[] | undefined;
}
