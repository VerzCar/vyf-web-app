import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
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
export class ListItemComponent implements OnInit {
    @Input({ required: true }) public circle!: Circle;
    @Input({ required: true }) public placement!: Placement;
    @Input() public hasVotedFor = false;

    public canVote$: Observable<boolean> | undefined;

    private readonly store = inject(Store);

    public ngOnInit(): void {
        this.canVote$ = this.store.select(MemberSelectors.canVote(this.placement.user.identityId));
    }


    public onVote(circleId: number, electedIdentId: string) {
        this.store.dispatch(new MemberAction.Vote(circleId, electedIdentId));
    }
}
