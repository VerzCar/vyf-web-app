import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { Circle } from '@vyf/vote-circle-service';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { CandidateMember } from '../../../shared/models';
import { MemberSelectors } from '../../../shared/state/member.selectors';
import { candidateMemberTracking } from '../../../shared/helper/candidate-member-tracking';
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

    public candidateMemberTrackingBy(index: number, member: CandidateMember): number {
        return candidateMemberTracking(index, member);
    }
}
