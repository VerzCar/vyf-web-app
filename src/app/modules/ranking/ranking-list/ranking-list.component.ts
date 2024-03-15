import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { RxNotificationKind } from '@rx-angular/cdk/notifications';
import { isDefined } from '@vyf/base';
import { Circle, CircleStage } from '@vyf/vote-circle-service';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { MemberSelectors } from '../../../shared/state/member.selectors';
import { CandidateMemberListDialogComponent } from '../candidate-member-list-dialog/candidate-member-list-dialog.component';
import { placementTracking } from '../helper/placement-tracking';
import { Placement } from '../models';
import { RankingAction } from '../state/actions/ranking.action';
import { RankingSelectors } from '../state/ranking.selectors';

interface RankingListComponentView {
    circle: Circle;
    topThreePlacements: Placement[];
    placements: Placement[];
    hasEmptyPlacements: boolean;
}

@Component({
    selector: 'app-ranking-list',
    templateUrl: './ranking-list.component.html',
    styleUrls: ['./ranking-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RankingListComponent {
    public readonly view$: Observable<RankingListComponentView>;
    public readonly contextTrg$ = new BehaviorSubject<RxNotificationKind>(RxNotificationKind.Suspense);
    public readonly isVoter$: Observable<boolean>;
    public readonly CircleStage = CircleStage;

    private readonly store = inject(Store);
    private readonly dialog = inject(MatDialog);

    constructor() {
        this.view$ = this.store.select(RankingSelectors.slices.selectedCircle).pipe(
            tap(() => this.contextTrg$.next(RxNotificationKind.Suspense)),
            filter(circle => isDefined(circle)),
            switchMap(circle => {
                    if (circle!.stage !== CircleStage.Cold) {
                        return this.rankingListSource$(circle as Circle);
                    }

                    return this.coldRankingListSource$(circle as Circle);
                }
            ),
            map(([circle, topThreePlacements, placements]: [Circle, Placement[], Placement[]]) => ({
                circle,
                topThreePlacements,
                placements,
                hasEmptyPlacements: !topThreePlacements.length && !placements.length
            })),
            tap(() => this.contextTrg$.next(RxNotificationKind.Next))
        );

        this.isVoter$ = this.store.select(MemberSelectors.RankingSelector.isVoter());
    }

    public onShowMembers() {
        this.dialog.open(CandidateMemberListDialogComponent);
    }

    public placementTrackingBy(index: number, placement: Placement) {
        return placementTracking(index, placement);
    }

    private rankingListSource$(circle: Circle): Observable<[Circle, Placement[], Placement[]]> {
        return this.store.dispatch(new RankingAction.FetchRankings(circle!.id)).pipe(
            switchMap(() =>
                combineLatest([
                    this.store.select(RankingSelectors.topThreePlacements),
                    this.store.select(RankingSelectors.placements)
                ])
            ),
            catchError(() => [[], []]),
            map(src => [circle, ...src] as [Circle, Placement[], Placement[]])
        );
    }

    private coldRankingListSource$(circle: Circle): Observable<[Circle, Placement[], Placement[]]> {
        return of([circle, [], []] as [Circle, Placement[], Placement[]]);
    }
}
