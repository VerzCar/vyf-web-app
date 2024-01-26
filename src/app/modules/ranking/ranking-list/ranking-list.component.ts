import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { User } from '@vyf/user-service';
import { Circle } from '@vyf/vote-circle-service';
import { combineLatest, map, Observable } from 'rxjs';
import { CandidateMember } from '../../../shared/models';
import { MemberSelectors } from '../../../shared/state/member.selectors';
import { CandidateMemberListDialogComponent } from '../candidate-member-list-dialog/candidate-member-list-dialog.component';
import { Placement } from '../models';
import { RankingSelectors } from '../state/ranking.selectors';

interface RankingListComponentView {
    circle: Circle;
    topThreePlacements: Placement[];
    placements: Placement[];
    previewUsers: User[];
    membersCount: number;
    userMember: CandidateMember;
}

@Component({
    selector: 'app-ranking-list',
    templateUrl: './ranking-list.component.html',
    styleUrls: ['./ranking-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RankingListComponent {
    public readonly view$: Observable<RankingListComponentView>;

    private readonly maxMembersCount = 3;

    private readonly store = inject(Store);
    private readonly dialog = inject(MatDialog);

    constructor() {
        this.view$ = combineLatest([
            this.store.select(RankingSelectors.slices.selectedCircle),
            this.store.select(RankingSelectors.topThreePlacements),
            this.store.select(RankingSelectors.placements),
            this.store.select(MemberSelectors.Member.slices.rankingCandidateMembers),
            this.store.select(MemberSelectors.Member.slices.rankingUserCandidateMember)
        ]).pipe(
            map(([circle, topThreePlacements, placements, members, userMember]) => ({
                circle: circle as Circle,
                topThreePlacements: topThreePlacements,
                placements: placements,
                ...this.mapMembersToPreview(members),
                userMember: userMember as CandidateMember
            }))
        );
    }

    public onShowMembers() {
        this.dialog.open(CandidateMemberListDialogComponent);
    }

    private mapMembersToPreview(
        members: CandidateMember[]
    ): Pick<RankingListComponentView, 'previewUsers' | 'membersCount'> {
        if (!members.length) {
            return {
                previewUsers: [],
                membersCount: 0
            };
        }

        const firstThreeMembers = members.slice(0, this.maxMembersCount);

        const firsThreeUsers = firstThreeMembers.map(member => member.user);
        const countOfMembersToVote = members.length - this.maxMembersCount;
        return {
            previewUsers: firsThreeUsers,
            membersCount: countOfMembersToVote > 0 ? countOfMembersToVote : 0
        };
    }
}
