import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { User } from '@vyf/user-service';
import { Circle } from '@vyf/vote-circle-service';
import { combineLatest, map, Observable } from 'rxjs';
import { CandidateMember, VoterMember } from '../../../shared/models';
import { MemberSelectors } from '../../../shared/state/member.selectors';
import { CandidateMemberListDialogComponent } from '../candidate-member-list-dialog/candidate-member-list-dialog.component';
import { placementTracking } from '../helper/placement-tracking';
import { Placement } from '../models';
import { RankingComponent } from '../ranking/ranking.component';
import { RankingSelectors } from '../state/ranking.selectors';

interface RankingListComponentView {
    circle: Circle;
    topThreePlacements: Placement[];
    placements: Placement[];
    previewUsers: User[];
    membersCount: number;
    userCandidateMember?: VoterMember;
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
    private readonly bottomSheet = inject(MatBottomSheet);

    constructor() {
        this.view$ = combineLatest([
            this.store.select(RankingSelectors.slices.selectedCircle),
            this.store.select(RankingSelectors.topThreePlacements),
            this.store.select(RankingSelectors.placements),
            this.store.select(MemberSelectors.Member.slices.rankingCandidateNeedVoteMembers),
            this.store.select(MemberSelectors.Member.slices.rankingUserVoterMember)
        ]).pipe(
            map(([circle, topThreePlacements, placements, members, userCandidateMember]) => ({
                circle: circle as Circle,
                topThreePlacements: topThreePlacements,
                placements: placements,
                ...this.mapMembersToPreview(members),
                userCandidateMember
            }))
        );
    }

    public onShowMembers() {
        this.dialog.open(CandidateMemberListDialogComponent);
    }

    public onShowItem(placement: Placement) {
        const data = { placement };
        this.bottomSheet.open(RankingComponent, { data, closeOnNavigation: true });
    }

    public placementTrackingBy(index: number, placement: Placement) {
        return placementTracking(index, placement);
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
