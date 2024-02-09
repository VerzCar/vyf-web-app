import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Circle } from '@vyf/vote-circle-service';
import { placementTracking } from '../../helper/placement-tracking';
import { Placement } from '../../models';
import { TopThreePlacement } from './top-ranked/top-ranked.component';

@Component({
    selector: 'app-top-three',
    templateUrl: './top-three.component.html',
    styleUrls: ['./top-three.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopThreeComponent {
    @Input({ required: true }) public circle!: Circle;
    @Input({ required: true }) public topThreePlacements!: Placement[];

    public readonly TopThreePlacement = TopThreePlacement;

    public placementTrackingBy(index: number, placement: Placement) {
        return placementTracking(index, placement);
    }
}
