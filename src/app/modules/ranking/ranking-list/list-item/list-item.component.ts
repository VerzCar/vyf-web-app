import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { Circle } from '@vyf/vote-circle-service';
import { Observable } from 'rxjs';
import { Placement } from '../../models';
import { MemberAction } from '../../state/actions/member.action';
import { MemberSelectors } from '../../state/member.selectors';

@Component({
    selector: 'app-list-item',
    templateUrl: './list-item.component.html',
    styleUrls: ['./list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListItemComponent {
    @Input({ required: true }) public circle!: Circle;
    @Input({ required: true }) public placement!: Placement;
    @Input() public hasVotedFor = false;

    public readonly canVote$: Observable<boolean>;

    private readonly store = inject(Store);

    constructor() {
        this.canVote$ = this.store.select(MemberSelectors.canVote);
    }

    public onVote(circleId: number, electedIdentId: string) {
        this.store.dispatch(new MemberAction.Vote(circleId, electedIdentId));
    }

}
