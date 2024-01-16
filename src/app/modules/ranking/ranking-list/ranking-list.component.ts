import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { User } from '@vyf/user-service';
import { Circle } from '@vyf/vote-circle-service';
import { combineLatest, map, Observable } from 'rxjs';
import { VoterMember } from '../../../shared/models';
import { MemberSelectors } from '../../../shared/state/member.selectors';
import { MemberListRankingDialogComponent } from '../member-list-ranking-dialog/member-list-ranking-dialog.component';
import { Placement } from '../models';
import { RankingSelectors } from '../state/ranking.selectors';

interface RankingListComponentView {
    circle: Circle;
    topThreePlacements: Placement[];
    placements: Placement[];
    previewUsers: User[];
    countOfMembersToVote: number;
    userMember: VoterMember;
}

@Component({
    selector: 'app-ranking-list',
    templateUrl: './ranking-list.component.html',
    styleUrls: ['./ranking-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RankingListComponent {
    public readonly view$: Observable<RankingListComponentView>;

    private readonly store = inject(Store);
    private readonly dialog = inject(MatDialog);

    constructor() {
        this.view$ = combineLatest([
            this.store.select(RankingSelectors.slices.selectedCircle),
            this.store.select(RankingSelectors.topThreePlacements),
            this.store.select(RankingSelectors.placements),
            this.store.select(MemberSelectors.Member.slices.rankingMembers),
            this.store.select(MemberSelectors.Member.slices.rankingUserMember)
        ]).pipe(
            map(([circle, topThreePlacements, placements, members, userMember]) => ({
                circle: circle as Circle,
                topThreePlacements: topThreePlacements ?? [],
                placements: placements ?? [],
                ...this.mapMembersToPreview(members ?? []),
                userMember: userMember as VoterMember
            }))
        );
    }

    public onShowMembers() {
        this.dialog.open(MemberListRankingDialogComponent);
    }

    private mapMembersToPreview(members: VoterMember[]) {
        if (!members.length) {
            return {
                previewUsers: [],
                countOfMembersToVote: 0
            };
        }

        const firstThreeMembers = members.slice(0, 3);

        const firsThreeUsers = firstThreeMembers.map(member => member.user);
        const countOfMembersToVote = members.length - 3;
        return {
            previewUsers: firsThreeUsers,
            countOfMembersToVote: countOfMembersToVote > 0 ? countOfMembersToVote : 0
        };
    }
}
