import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Circle } from '@vyf/vote-circle-service';
import { filter, map, Observable } from 'rxjs';
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

    constructor() {
        this.view$ = this.store.select(CirclesSelectors.slices.myCircles).pipe(
            filter((circles) => circles !== undefined),
            map(circles => ({
                circles: circles as Circle[]
            }))
        );
    }
}
