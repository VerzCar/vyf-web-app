import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Circle } from '@vyf/vote-circle-service';
import { filter, map, Observable } from 'rxjs';
import { CircleCreateDialogComponent } from '../circle-create-dialog/circle-create-dialog.component';
import { CirclesSelectors } from '../state/circles.selectors';

interface CirclesOverviewView {
    circles: Circle[];
}

@Component({
    selector: 'app-circles-overview',
    templateUrl: './circles-overview.component.html',
    styleUrls: ['./circles-overview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CirclesOverviewComponent {
    public readonly view$: Observable<CirclesOverviewView>;

    private readonly store = inject(Store);
    private readonly dialog = inject(MatDialog);

    constructor() {
        this.view$ = this.store.select(CirclesSelectors.slices.myCircles).pipe(
            filter((circles) => circles !== undefined),
            map(circles => ({
                circles: circles as Circle[]
            }))
        );
    }

    public onCreateCircle() {
        this.dialog.open(CircleCreateDialogComponent, { width: '600px' });
    }
}
