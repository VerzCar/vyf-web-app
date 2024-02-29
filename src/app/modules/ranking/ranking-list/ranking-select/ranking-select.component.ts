import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { Circle, VoteCircleService } from '@vyf/vote-circle-service';
import { catchError, filter, map, Observable } from 'rxjs';
import { RankingAction } from '../../state/actions/ranking.action';
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
    public previewCircles$: Observable<Circle[]>;

    private readonly store = inject(Store);
    private readonly voteCircleService = inject(VoteCircleService);
    private readonly router = inject(Router);

    constructor() {
        this.view$ = this.store.select(RankingSelectors.slices.selectedCircle).pipe(
            filter(circle => isDefined(circle)),
            map(circle => ({
                circle: circle as Circle
            }))
        );

        this.previewCircles$ = this.voteCircleService.circles().pipe(
            map(res => res.data)
        );
    }

    public readonly allFilteredCirclesFn$ = (name: string) => this.voteCircleService.circlesFiltered(name).pipe(
        map(res => res.data),
        catchError(() => [])
    );

    public selectedCircle(circleId: number) {
        this.router.navigate(['/ranking', circleId]);
    }
}
