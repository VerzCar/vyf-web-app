import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { CircleMemberComponentOption } from '@vyf/component';
import { User } from '@vyf/user-service';
import { Circle, Commitment } from '@vyf/vote-circle-service';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { Member } from '../../../shared/models';
import { MemberSelectors } from '../../../shared/state/member.selectors';
import { CircleDetailSettingsDialogComponent, CircleDetailSettingsDialogComponentView } from '../circle-detail-settings-dialog/circle-detail-settings-dialog.component';
import { CirclesAction } from '../state/actions/circles.action';
import { CirclesSelectors } from '../state/circles.selectors';

interface CircleDetailView {
    circle: Circle;
    owner: Member;
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

    public readonly circleMemberComponentOption: Partial<CircleMemberComponentOption> = {
        show: {
            username: true,
            commitment: false
        }
    };

    public hasOpenCommitment$: Observable<boolean>;
    public selectedCommitment$: Observable<Commitment | undefined>;
    public view$: Observable<CircleDetailView>;

    private readonly store = inject(Store);
    private readonly dialog = inject(MatDialog);

    private readonly maxMembersCount = 3;

    constructor() {
        this.view$ = combineLatest([
            this.store.select(CirclesSelectors.slices.selectedCircle),
            this.store.select(MemberSelectors.Member.slices.circleMembers)
        ]).pipe(
            filter(([circle, members]) => isDefined(circle) && isDefined(members)),
            map(([c, m]) => {
                const circle = c as Circle;
                const members = m as Member[];
                const owner = this.owner(circle.createdFrom, members);

                return {
                    circle: circle as Circle,
                    owner,
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
            membersCount: view.membersCount,
            owner: view.owner
        };

        this.dialog.open(CircleDetailSettingsDialogComponent, { width: '600px', data: viewData });
    }

    public onShowMembers(view: CircleDetailView) {
        const viewData: CircleDetailSettingsDialogComponentView = {
            circle: view.circle,
            disabled: view.disabled,
            members: this.store.selectSnapshot(MemberSelectors.Member.slices.circleMembers) ?? [],
            membersCount: view.membersCount,
            owner: view.owner,
            selectedTabIndex: 2
        };

        this.dialog.open(CircleDetailSettingsDialogComponent, { width: '600px', data: viewData });
    }

    private owner(createdFrom: string, members: Member[]): Member {
        const circleOwnerVoter = members.find(member => member.voter.voter === createdFrom);

        if (!circleOwnerVoter) {
            throw Error('createFrom does not exist in circle voters');
        }

        return circleOwnerVoter;
    }

    private mapMembersToPreview(members: Member[]): Pick<CircleDetailView, 'previewUsers' | 'membersCount'> {
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
