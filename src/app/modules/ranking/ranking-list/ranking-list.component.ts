import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { Circle, CircleStage } from '@vyf/vote-circle-service';
import { BehaviorSubject, combineLatest, filter, map, Observable, switchMap, tap } from 'rxjs';
import { CandidateMemberListDialogComponent } from '../candidate-member-list-dialog/candidate-member-list-dialog.component';
import { placementTracking } from '../helper/placement-tracking';
import { Placement } from '../models';
import { RankingAction } from '../state/actions/ranking.action';
import { RankingSelectors } from '../state/ranking.selectors';

interface RankingListComponentView {
    circle: Circle;
    topThreePlacements: Placement[];
    placements: Placement[];
    emptyPlacements: boolean;
}

@Component({
    selector: 'app-ranking-list',
    templateUrl: './ranking-list.component.html',
    styleUrls: ['./ranking-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RankingListComponent {
    public readonly view$: Observable<RankingListComponentView>;
    public readonly suspenseTrigger$ = new BehaviorSubject<void>(void 0);
    public readonly CircleStage = CircleStage;

    private readonly store = inject(Store);
    private readonly dialog = inject(MatDialog);

    constructor() {
        this.view$ = this.store.select(RankingSelectors.slices.selectedCircle).pipe(
            tap(() => this.suspenseTrigger$.next(void 0)),
            filter(circle => isDefined(circle)),
            tap(circle => this.store.dispatch(new RankingAction.FetchRankings(circle!.id))),
            switchMap(circle => combineLatest([
                this.store.select(RankingSelectors.topThreePlacements),
                this.store.select(RankingSelectors.placements)
            ]).pipe(
                map(src => [circle, ...src] as [Circle, Placement[], Placement[]])
            )),
            map(([circle, topThreePlacements, placements]: [Circle, Placement[], Placement[]]) => ({
                circle,
                topThreePlacements,
                placements,
                emptyPlacements: !topThreePlacements.length && !placements.length
            }))
        );
    }

    public onShowMembers() {
        this.dialog.open(CandidateMemberListDialogComponent);
    }

    public placementTrackingBy(index: number, placement: Placement) {
        return placementTracking(index, placement);
    }
}
