import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Circle, CirclePaginated, VoteCircleService } from '@vyf/vote-circle-service';
import { catchError, combineLatest, filter, map, Observable } from 'rxjs';
import { InfoSelectors } from '../../../shared/state/info.selectors';
import { CircleCreateDialogComponent } from '../circle-create-dialog/circle-create-dialog.component';
import { CirclesAction } from '../state/actions/circles.action';
import { CirclesSelectors } from '../state/circles.selectors';

interface CirclesOverviewView {
    circles: Circle[];
    canCreate: boolean;
    maxAllowedCircles: number;
}

@Component({
    selector: 'app-circles-overview',
    templateUrl: './circles-overview.component.html',
    styleUrls: ['./circles-overview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CirclesOverviewComponent {
    public circleSearchResult: CirclePaginated[] = [];
    public readonly view$: Observable<CirclesOverviewView>;

    public readonly circles$: Observable<CirclePaginated[]>;

    private readonly store = inject(Store);
    private readonly voteCircleService = inject(VoteCircleService);
    private readonly dialog = inject(MatDialog);

    constructor() {
        this.view$ = combineLatest([
            this.store.select(CirclesSelectors.slices.myCircles),
            this.store.select(CirclesSelectors.slices.option)
        ]).pipe(
            filter(([circles]) => circles !== undefined),
            map(([circles, option]) => ({
                circles: circles as Circle[],
                canCreate: circles.length < option.maxCircles,
                maxAllowedCircles: option.maxCircles
            }))
        );

        this.circles$ = this.store.select(InfoSelectors.slices.circlesOpenCommitment);
    }

    public readonly allFilteredCirclesFn$ = (name: string) => this.voteCircleService.circlesFiltered(name).pipe(
        map(res => res.data),
        catchError(() => [])
    );

    public onOpenCreateCircle() {
        this.dialog.open(
            CircleCreateDialogComponent, {
                width: '600px',
                disableClose: true
            });
    }

    public searchedResult(circles: CirclePaginated[]) {
        this.circleSearchResult = circles;
    }

    public onCommitment() {
       // this.store.dispatch(new CirclesAction.CommittedToCircle(this.circleId, Commitment.Committed));
    }

    public onRejection() {
       // this.store.dispatch(new CirclesAction.CommittedToCircle(this.circleId, Commitment.Rejected));
    }
}
