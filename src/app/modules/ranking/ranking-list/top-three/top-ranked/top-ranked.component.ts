import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { Circle } from '@vyf/vote-circle-service';
import { Observable, of } from 'rxjs';
import { Placement } from '../../../models/placement.model';
import { RankingAction } from '../../../state/actions/ranking.action';

export enum TopThreePlacement {
    First,
    Second,
    Third
}

@Component({
    selector: 'app-top-ranked',
    templateUrl: './top-ranked.component.html',
    styleUrls: ['./top-ranked.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopRankedComponent {
    @Input({ required: true }) public circle!: Circle;
    @Input({ required: true }) public placement!: Placement;
    @Input({ required: true }) public topPlacement!: TopThreePlacement;

    public readonly TopThreePlacement = TopThreePlacement;
    public readonly canVote$: Observable<boolean>;

    private readonly store = inject(Store);

    constructor() {
        this.canVote$ = of(true); //this.store.select(RankingSelectors.canVote);
    }

    public onVote(circleId: number, electedIdentId: string) {
        this.store.dispatch(new RankingAction.Vote(circleId, electedIdentId));
    }

}
