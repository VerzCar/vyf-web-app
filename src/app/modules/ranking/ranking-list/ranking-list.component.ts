import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Circle, Ranking, VoteCircleService } from '@vyf/vote-circle-service';
import { map, Observable } from 'rxjs';
import { RankingSelectors } from '../ranking-state/ranking.selectors';

@Component({
    selector: 'app-ranking-list',
    templateUrl: './ranking-list.component.html',
    styleUrls: ['./ranking-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RankingListComponent {
    private readonly store = inject(Store);
    private readonly vcService = inject(VoteCircleService);

    public selectedCircle$: Observable<Circle>;
    public rankings$: Observable<Ranking[]>;

    constructor() {
        this.selectedCircle$ = this.store.select(RankingSelectors.slices.selectedCircle).pipe(
            map(circle => circle as Circle)
        );

        this.rankings$ = this.vcService.rankingsEvents(1);

        this.rankings$.subscribe(ranks => console.log(ranks));
    }
}
