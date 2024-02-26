import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { User } from '@vyf/user-service';
import { Circle } from '@vyf/vote-circle-service';
import { BehaviorSubject, combineLatest, filter, map, Observable, switchMap, tap } from 'rxjs';
import { CandidateMember, VoterMember } from '../../../shared/models';
import { MemberAction } from '../../../shared/state/actions/member.action';
import { MemberSelectors } from '../../../shared/state/member.selectors';
import { CircleDetailSettingsDialogComponent, CircleDetailSettingsDialogComponentView } from '../circle-detail-settings-dialog/circle-detail-settings-dialog.component';
import { CirclesSelectors } from '../state/circles.selectors';

interface CircleDetailMembersComponentView {
    previewUsers: User[];
    membersCount: number;
}

@Component({
    selector: 'app-circle-detail-members',
    templateUrl: './circle-detail-members.component.html',
    styleUrl: './circle-detail-members.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailMembersComponent {
    public readonly view$: Observable<CircleDetailMembersComponentView>;
    public readonly suspenseTrigger$ = new BehaviorSubject<void>(void 0);

    private readonly store = inject(Store);
    private readonly dialog = inject(MatDialog);

    private readonly maxMembersCount = 3;

    constructor() {
        this.view$ = this.store.select(CirclesSelectors.slices.selectedCircle).pipe(
            tap(() => this.suspenseTrigger$.next(void 0)),
            filter(circle => isDefined(circle)),
            switchMap(circle => this.store.dispatch([
                new MemberAction.Circle.FilterVoterMembers(circle!.id),
                new MemberAction.Circle.FilterCandidateMembers(circle!.id)
            ])),
            switchMap(() => combineLatest([
                this.store.select(MemberSelectors.Member.slices.circleVoterMembers),
                this.store.select(MemberSelectors.Member.slices.circleCandidateMembers)
            ])),
            map(([voterMembers, candidateMembers]) => ({
                ...this.mapMembersToPreview(voterMembers, candidateMembers)
            }))
        );
    }

    public onShowMembers() {
        const viewData: CircleDetailSettingsDialogComponentView = {
            circle: this.store.selectSnapshot(CirclesSelectors.slices.selectedCircle) as Circle,
            selectedTabIndex: 2
        };

        this.dialog.open(CircleDetailSettingsDialogComponent, { width: '600px', data: viewData });
    }

    private mapMembersToPreview(
        voterMembers: VoterMember[],
        candidateMembers: CandidateMember[]
    ): Pick<CircleDetailMembersComponentView, 'previewUsers' | 'membersCount'> {
        if (!voterMembers.length && !candidateMembers.length) {
            return {
                previewUsers: [],
                membersCount: 0
            };
        }

        const members = voterMembers.length ? voterMembers : candidateMembers;

        const firstThreeMembers = members.slice(0, this.maxMembersCount);

        const firsThreeUsers = firstThreeMembers.map(member => member.user);
        const countOfMembersToVote = (members.length + candidateMembers.length) - this.maxMembersCount;
        return {
            previewUsers: firsThreeUsers,
            membersCount: countOfMembersToVote > 0 ? countOfMembersToVote : 0
        };
    }
}
