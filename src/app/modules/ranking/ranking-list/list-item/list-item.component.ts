import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { Circle } from '@vyf/vote-circle-service';
import { Observable, of } from 'rxjs';
import { Placement } from '../../models/placement.model';
import { RankingAction } from '../../state/actions/ranking.action';

@Component({
    selector: 'app-list-item',
    templateUrl: './list-item.component.html',
    styleUrls: ['./list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListItemComponent {
    @Input({ required: true }) public circle!: Circle;
    @Input({ required: true }) public placement!: Placement;

    public readonly canVote$: Observable<boolean>;

    private readonly store = inject(Store);

    constructor() {
        this.canVote$ = of(true); //this.store.select(RankingSelectors.canVote);
    }

    public onVote(circleId: number, electedIdentId: string) {
        this.store.dispatch(new RankingAction.Vote(circleId, electedIdentId));
    }

}
