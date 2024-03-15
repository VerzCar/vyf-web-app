import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Circle } from '@vyf/vote-circle-service';
import { placementTracking } from '../../helper/placement-tracking';
import { Placement } from '../../models';
import { RankingComponent, RankingComponentView } from '../../ranking/ranking.component';
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

    private readonly bottomSheet = inject(MatBottomSheet);

    public placementTrackingBy(index: number, placement: Placement) {
        return placementTracking(index, placement);
    }

    public onShowItem(placement: Placement, circle: Circle) {
        const data: RankingComponentView = { placement, circleId: circle.id };
        this.bottomSheet.open(RankingComponent, { data, closeOnNavigation: true });
    }
}
