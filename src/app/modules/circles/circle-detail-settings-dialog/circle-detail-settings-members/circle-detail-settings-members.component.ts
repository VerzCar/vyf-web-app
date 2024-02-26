import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { RxFor } from '@rx-angular/template/for';
import { RxPush } from '@rx-angular/template/push';
import { UserAutocompleteSelectComponent, UserListItemComponent } from '@vyf/component';
import { UserPaginated, UserService } from '@vyf/user-service';
import { catchError, map, Observable } from 'rxjs';
import { candidateMemberTracking } from '../../../../shared/helper/candidate-member-tracking';
import { voterMemberTracking } from '../../../../shared/helper/voter-member-tracking';
import { CandidateMember, VoterMember } from '../../../../shared/models';
import { MemberSelectors } from '../../../../shared/state/member.selectors';
import { CirclesAction } from '../../state/actions/circles.action';
import { CirclesSelectors } from '../../state/circles.selectors';

@Component({
    selector: 'app-circle-detail-settings-members',
    standalone: true,
    imports: [
        UserListItemComponent,
        RxFor,
        UserAutocompleteSelectComponent,
        RxPush
    ],
    templateUrl: './circle-detail-settings-members.component.html',
    styleUrl: './circle-detail-settings-members.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailSettingsMembersComponent {
    public readonly voterMembers$: Observable<VoterMember[]>;
    public readonly candidateMembers$: Observable<CandidateMember[]>;
    public readonly voterUsers$: Observable<UserPaginated[]>;
    public readonly candidateUsers$: Observable<UserPaginated[]>;
    public readonly canEditCircle$: Observable<boolean>;

    private readonly store = inject(Store);
    private readonly userService = inject(UserService);

    constructor() {
        this.voterMembers$ = this.store.select(MemberSelectors.Member.slices.circleVoterMembers);
        this.candidateMembers$ = this.store.select(MemberSelectors.Member.slices.circleCandidateMembers);
        this.voterUsers$ = this.store.select(MemberSelectors.CircleSelector.voterUsers);
        this.candidateUsers$ = this.store.select(MemberSelectors.CircleSelector.candidateUsers);
        this.canEditCircle$ = this.store.select(CirclesSelectors.canEditCircle);
    }

    public readonly allUsersFn$ = () => this.userService.users().pipe(
        map(res => res.data),
        catchError(() => [])
    );

    public readonly allFilteredUsersFn$ = (username: string) => this.userService.usersFiltered(username).pipe(
        map(res => res.data),
        catchError(() => [])
    );

    public onCandidatesSelected(userIdentityId: string) {
        const circle = this.store.selectSnapshot(CirclesSelectors.slices.selectedCircle);
        this.store.dispatch(new CirclesAction.AddCandidate(circle?.id ?? 0, userIdentityId));
    }

    public onCandidateDeselection(userIdentityId: string) {
        console.log('remove candidate');
    }

    public onVotersSelected(userIdentityIds: string[]) {
        console.log('add voter');
    }

    public onVoterDeselection(userIdentityId: string) {
        console.log('remove voter');
    }

    public candidateMemberTrackingBy(index: number, member: CandidateMember): number {
        return candidateMemberTracking(index, member);
    }

    public voterMemberTrackingBy(index: number, member: VoterMember): number {
        return voterMemberTracking(index, member);
    }
}
