import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Circle } from '@vyf/vote-circle-service';
import { filter, map, Observable, tap } from 'rxjs';
import { CirclesSelectors } from '../circles-state/circles.selectors';

interface CircleDetailView {
    circle: Circle;
}

@Component({
    selector: 'app-circle-detail',
    templateUrl: './circle-detail.component.html',
    styleUrls: ['./circle-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailComponent {
    private readonly store = inject(Store);

    public view$: Observable<CircleDetailView>;

    constructor() {
        this.view$ = this.store.select(CirclesSelectors.slices.selectedCircle).pipe(
            filter(circle => circle !== undefined),
            map(circle => ({
                circle: circle as Circle
            }))
        );
    }

}
