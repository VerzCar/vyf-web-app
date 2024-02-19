import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { Circle } from '@vyf/vote-circle-service';
import { filter, map, Observable } from 'rxjs';
import { RankingSelectors } from '../../state/ranking.selectors';

interface RankingSelectComponentView {
    circle: Circle;
}


@Component({
    selector: 'app-ranking-select',
    templateUrl: './ranking-select.component.html',
    styleUrl: './ranking-select.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RankingSelectComponent {
    public readonly view$: Observable<RankingSelectComponentView>;

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
