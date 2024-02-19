import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { Circle } from '@vyf/vote-circle-service';
import { filter, map, Observable } from 'rxjs';
import { RankingSelectors } from '../../state/ranking.selectors';

interface ValidUntilComponentView {
    circle: Circle;
}

@Component({
    selector: 'app-valid-until',
    templateUrl: './valid-until.component.html',
    styleUrl: './valid-until.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidUntilComponent {
    public readonly view$: Observable<ValidUntilComponentView>;

    private readonly store = inject(Store);

    constructor() {
        this.view$ = this.store.select(RankingSelectors.slices.selectedCircle).pipe(
            filter(circle => isDefined(circle)),
            map(circle => ({
                circle: circle as Circle
            }))
        );
    }
}
