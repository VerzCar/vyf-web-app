import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Circle, CirclePaginated, VoteCircleService } from '@vyf/vote-circle-service';
import { catchError, filter, map, Observable } from 'rxjs';
import { CircleCreateDialogComponent } from '../circle-create-dialog/circle-create-dialog.component';
import { CirclesSelectors } from '../state/circles.selectors';

interface CirclesOverviewView {
    circles: Circle[];
    canCreate: boolean;
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
    public readonly maxOwnCircles = 10;

    private readonly store = inject(Store);
    private readonly voteCircleService = inject(VoteCircleService);
    private readonly dialog = inject(MatDialog);

    constructor() {
        this.view$ = this.store.select(CirclesSelectors.slices.myCircles).pipe(
            filter((circles) => circles !== undefined),
            map(circles => ({
                circles: circles as Circle[],
                canCreate: circles.length < this.maxOwnCircles
            }))
        );
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
}
