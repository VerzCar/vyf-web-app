import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { Circle } from '@vyf/vote-circle-service';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { CandidateMember } from '../../../shared/models';
import { MemberAction } from '../../../shared/state/actions/member.action';
import { MemberSelectors } from '../../../shared/state/member.selectors';
import { RankingSelectors } from '../state/ranking.selectors';

interface MemberListRankingView {
    selectedCircle: Circle;
    members: CandidateMember[];
}

@Component({
    selector: 'app-candidate-member-list',
    templateUrl: './candidate-member-list.component.html',
    styleUrls: ['./candidate-member-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateMemberListComponent {
    public readonly view$: Observable<MemberListRankingView>;

    private readonly store = inject(Store);

    constructor() {
        this.view$ = combineLatest([
            this.store.select(RankingSelectors.slices.selectedCircle),
            this.store.select(MemberSelectors.Member.slices.rankingCandidateNeedVoteMembers)
        ]).pipe(
            filter(([selectedCircle]) => isDefined(selectedCircle)),
            map(([selectedCircle, members]) => ({
                selectedCircle: selectedCircle as Circle,
                members
            }))
        );
    }

    public canVote$(id: string): Observable<boolean> {
        return this.store.select(MemberSelectors.RankingSelector.canVote(id));
    }

    public onVote(electedId: string, circleId: number): void {
        this.store.dispatch(new MemberAction.Vote(circleId ?? 0, electedId));
    }
}
