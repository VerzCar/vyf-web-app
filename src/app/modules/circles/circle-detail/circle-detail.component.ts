import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Circle } from '@vyf/vote-circle-service';
import { combineLatest, filter, map, Observable, tap } from 'rxjs';
import { UserSelectors } from '../../user/user-state/user.selectors';
import { CirclesSelectors } from '../circles-state/circles.selectors';

interface CircleDetailView {
    circle: Circle;
    disabled: boolean;
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
            filter((circle) => circle !== undefined),
            map((circle) => ({
                circle: circle!,
                disabled: !this.store.selectSnapshot(CirclesSelectors.canEditCircle())
            }))
        );
    }

}
