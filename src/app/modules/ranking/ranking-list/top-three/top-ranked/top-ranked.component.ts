import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { Circle } from '@vyf/vote-circle-service';
import { Observable } from 'rxjs';
import { Placement } from '../../../models';
import { MemberAction } from '../../../state/actions/member.action';
import { MemberSelectors } from '../../../state/member.selectors';

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
        this.canVote$ = this.store.select(MemberSelectors.canVote);
    }

    public onVote(circleId: number, electedIdentId: string) {
        this.store.dispatch(new MemberAction.Vote(circleId, electedIdentId));
    }

}
