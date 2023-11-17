import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Circle, Ranking } from '@vyf/vote-circle-service';
import { combineLatest, map, Observable} from 'rxjs';
import { RankingSelectors } from '../ranking-state/ranking.selectors';

interface RankingListComponentView {
    circle: Circle;
    topThreeRankings: Ranking[];
    rankings: Ranking[];
}

@Component({
    selector: 'app-ranking-list',
    templateUrl: './ranking-list.component.html',
    styleUrls: ['./ranking-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RankingListComponent {
    private readonly store = inject(Store);

    public view$: Observable<RankingListComponentView>;

    constructor() {
        this.view$ = combineLatest([
            this.store.select(RankingSelectors.slices.selectedCircle),
            this.store.select(RankingSelectors.slices.topThreeRankings),
            this.store.select(RankingSelectors.slices.rankings)
        ]).pipe(
            map(([circle, topThreeRankings, rankings]) => ({
                circle: circle as Circle,
                topThreeRankings: topThreeRankings ?? [],
                rankings: rankings ?? []
            }))
        );
    }
}
