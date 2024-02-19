import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Store } from '@ngxs/store';
import { Circle } from '@vyf/vote-circle-service';
import { Observable } from 'rxjs';
import { MemberAction } from '../../../../shared/state/actions/member.action';
import { MemberSelectors } from '../../../../shared/state/member.selectors';
import { Placement } from '../../models';
import { RankingComponent } from '../../ranking/ranking.component';

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
    public canRevokeVote$: Observable<boolean> | undefined;

    private readonly store = inject(Store);
    private readonly bottomSheet = inject(MatBottomSheet);

    public ngOnInit(): void {
        [hasVotedFor]="view.userCandidateMember?.voter?.votedFor === placement.ranking.identityId"
        this.canVote$ = this.store.select(MemberSelectors.RankingSelector.canVote(this.placement.user.identityId));
        this.canRevokeVote$ = this.store.select(MemberSelectors.RankingSelector.canRevokeVote(this.placement.user.identityId));
    }

    public onVote(circleId: number, electedIdentId: string) {
        this.store.dispatch(new MemberAction.Ranking.Vote(circleId, electedIdentId));
    }

    public onRevokeVote(circleId: number) {
        this.store.dispatch(new MemberAction.Ranking.RevokeVote(circleId));
    }

    public onShowItem(placement: Placement) {
        const data = { placement };
        this.bottomSheet.open(RankingComponent, { data, closeOnNavigation: true });
    }
}
