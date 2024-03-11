import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { RxNotificationKind } from '@rx-angular/cdk/notifications';
import { isDefined } from '@vyf/base';
import { User } from '@vyf/user-service';
import { CircleCandidatesFilter, CircleStage } from '@vyf/vote-circle-service';
import { BehaviorSubject, catchError, filter, map, Observable, of, switchMap, tap } from 'rxjs';
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
    public readonly contextTrg$ = new BehaviorSubject<RxNotificationKind>(RxNotificationKind.Suspense);

    private readonly maxMembersCount = 3;

    private readonly dialog = inject(MatDialog);
    private readonly store = inject(Store);

    constructor() {
        this.view$ = this.store.select(RankingSelectors.slices.selectedCircle).pipe(
            tap(() => this.contextTrg$.next(RxNotificationKind.Suspense)),
            filter(circle => isDefined(circle)),
            switchMap(circle => {
                if (circle!.stage !== CircleStage.Cold) {
                    const candidatesFilter: Partial<CircleCandidatesFilter> = {
                        hasBeenVoted: false
                    };
                    return this.store.dispatch(new MemberAction.Ranking.InitMembers(circle!.id, candidatesFilter)).pipe(
                        switchMap(() => this.store.select(MemberSelectors.Member.slices.rankingCandidateNeedVoteMembers)),
                        catchError(() => [])
                    );
                }

                return of([]);
            }),
            map(members => ({
                ...this.mapMembersToPreview(members)
            })),
            tap(() => this.contextTrg$.next(RxNotificationKind.Next))
        );
    }

    public onShowMembers() {
        this.dialog.open(CandidateMemberListDialogComponent, { closeOnNavigation: true });
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
