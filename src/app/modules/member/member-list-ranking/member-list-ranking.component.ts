import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { CircleMember } from '../models';
import { MemberAction } from '../state/actions/member.action';
import { MemberSelectors } from '../state/member.selectors';

interface MemberListRankingView extends CircleMember {
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
        this.view$ = this.store.select(MemberSelectors.circleMembers).pipe(
            map(circleMembers => ({
                ...circleMembers,
                canVote$: this.store.select(MemberSelectors.canVote)
            }))
        );
    }

    public onVoted(electedId: string, circleId: number | undefined) {
        this.store.dispatch(new MemberAction.Vote(circleId ?? 0, electedId));
    }
}
