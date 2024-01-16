import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { User } from '@vyf/user-service';
import { Circle, Commitment } from '@vyf/vote-circle-service';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { VoterMember } from '../../../shared/models';
import { MemberSelectors } from '../../../shared/state/member.selectors';
import { CircleDetailSettingsDialogComponent, CircleDetailSettingsDialogComponentView } from '../circle-detail-settings-dialog/circle-detail-settings-dialog.component';
import { CirclesAction } from '../state/actions/circles.action';
import { CirclesSelectors } from '../state/circles.selectors';

interface CircleDetailView {
    circle: Circle;
    owner: User;
    previewUsers: User[];
    membersCount: number;
    disabled: boolean;
}

@Component({
    selector: 'app-circle-detail',
    templateUrl: './circle-detail.component.html',
    styleUrls: ['./circle-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailComponent {
    public readonly placeholderImageSrc = 'assets/img/placeholder-image.jpg';

    public hasOpenCommitment$: Observable<boolean>;
    public selectedCommitment$: Observable<Commitment | undefined>;
    public view$: Observable<CircleDetailView>;

    private readonly store = inject(Store);
    private readonly dialog = inject(MatDialog);

    private readonly maxMembersCount = 3;

    constructor() {
        this.view$ = combineLatest([
            this.store.select(CirclesSelectors.slices.selectedCircle),
            this.store.select(CirclesSelectors.slices.selectedCircleOwner),
            this.store.select(MemberSelectors.Member.slices.circleMembers)
        ]).pipe(
            filter((
                [
                    circle,
                    owner,
                    members
                ]
            ) => isDefined(circle) && isDefined(owner) && isDefined(members)),
            map(([c, owner, m]) => {
                const circle = c as Circle;
                const members = m as VoterMember[];

                return {
                    circle: circle as Circle,
                    owner: owner as User,
                    ...this.mapMembersToPreview(members ?? []),
                    disabled: !this.store.selectSnapshot(CirclesSelectors.canEditCircle)
                };
            })
        );

        this.hasOpenCommitment$ = this.store.select(MemberSelectors.CircleSelector.hasOpenCommitment);
        this.selectedCommitment$ = this.store.select(MemberSelectors.Member.slices.circleUserMember).pipe(
            map(member => member?.voter.commitment)
        );
    }

    public hasCommitted(circleId: number, commitment: Commitment) {
        this.store.dispatch(new CirclesAction.CommittedToCircle(circleId, commitment));
    }

    public onOpenSettings(view: CircleDetailView) {
        const viewData: CircleDetailSettingsDialogComponentView = {
            circle: view.circle,
            disabled: view.disabled,
            members: this.store.selectSnapshot(MemberSelectors.Member.slices.circleMembers) ?? [],
            membersCount: view.membersCount
        };

        this.dialog.open(CircleDetailSettingsDialogComponent, { width: '600px', data: viewData });
    }

    public onShowMembers(view: CircleDetailView) {
        const viewData: CircleDetailSettingsDialogComponentView = {
            circle: view.circle,
            disabled: view.disabled,
            members: this.store.selectSnapshot(MemberSelectors.Member.slices.circleMembers) ?? [],
            membersCount: view.membersCount,
            selectedTabIndex: 2
        };

        this.dialog.open(CircleDetailSettingsDialogComponent, { width: '600px', data: viewData });
    }

    private mapMembersToPreview(members: VoterMember[]): Pick<CircleDetailView, 'previewUsers' | 'membersCount'> {
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
