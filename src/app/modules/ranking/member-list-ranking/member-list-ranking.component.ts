import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Circle } from '@vyf/vote-circle-service';
import { combineLatest, map, Observable } from 'rxjs';
import { Member } from '../../../shared/models';
import { MemberAction } from '../../../shared/state/actions/member.action';
import { MemberSelectors } from '../../../shared/state/member.selectors';
import { RankingSelectors } from '../state/ranking.selectors';

interface MemberListRankingView {
    selectedCircle: Circle;
    members: Member[]
    canVote$: Observable<boolean>;
}

@Component({
    selector: 'app-member-list-ranking',
    templateUrl: './member-list-ranking.component.html',
    styleUrls: ['./member-list-ranking.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberListRankingComponent {
    private readonly store = inject(Store);

    public view$: Observable<MemberListRankingView>;

    constructor() {
        this.view$ =combineLatest([
            this.store.select(RankingSelectors.slices.selectedCircle),
            this.store.select(MemberSelectors.slices.members)
        ]).pipe(
            map(([selectedCircle, members]) => ({
                selectedCircle: selectedCircle as Circle,
                members: members as Member[],
                canVote$: this.store.select(MemberSelectors.canVote(''))
            }))
        );
    }

    public onVoted(electedId: string, circleId: number | undefined) {
        this.store.dispatch(new MemberAction.Vote(circleId ?? 0, electedId));
    }
}
