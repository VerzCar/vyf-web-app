import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { User } from '@vyf/user-service';
import { CircleCandidatesFilter } from '@vyf/vote-circle-service';
import { BehaviorSubject, combineLatest, filter, map, Observable, switchMap, tap } from 'rxjs';
import { CandidateMember } from '../../../../shared/models';
import { MemberAction } from '../../../../shared/state/actions/member.action';
import { MemberSelectors } from '../../../../shared/state/member.selectors';
import { CandidateMemberListDialogComponent } from '../../candidate-member-list-dialog/candidate-member-list-dialog.component';
import { RankingSelectors } from '../../state/ranking.selectors';

interface MembersNeedVoteComponentView {
    previewUsers: User[];
    membersCount: number;
}

@Component({
    selector: 'app-members-need-vote',
    templateUrl: './members-need-vote.component.html',
    styleUrl: './members-need-vote.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembersNeedVoteComponent {
    public readonly view$: Observable<MembersNeedVoteComponentView>;
    public readonly suspenseTrigger$ = new BehaviorSubject<void>(void 0);

    private readonly maxMembersCount = 3;

    private readonly dialog = inject(MatDialog);
    private readonly store = inject(Store);

    constructor() {
        this.view$ = this.store.select(RankingSelectors.slices.selectedCircle).pipe(
            tap(() => this.suspenseTrigger$.next(void 0)),
            filter(circle => isDefined(circle)),
            tap(circle => {
                const candidatesFilter: Partial<CircleCandidatesFilter> = {
                    hasBeenVoted: false
                };
                this.store.dispatch(new MemberAction.Ranking.FilterCandidateNeedVoteMembers(circle!.id, candidatesFilter));
            }),
            switchMap(() => combineLatest([
                this.store.select(MemberSelectors.Member.slices.rankingCandidateNeedVoteMembers)
            ])),
            map(([members]) => ({
                ...this.mapMembersToPreview(members)
            }))
        )
    }

    public onShowMembers() {
        this.dialog.open(CandidateMemberListDialogComponent);
    }

    private mapMembersToPreview(
        members: CandidateMember[]
    ): Pick<MembersNeedVoteComponentView, 'previewUsers' | 'membersCount'> {
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
