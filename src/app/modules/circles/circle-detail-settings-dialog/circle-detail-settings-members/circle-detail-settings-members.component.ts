import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Store } from '@ngxs/store';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import { UserAutocompleteSelectComponent, UserListItemComponent } from '@vyf/component';
import { UserPaginated, UserService } from '@vyf/user-service';
import { UserOption } from '@vyf/vote-circle-service';
import { FeatherModule } from 'angular-feather';
import { catchError, combineLatest, map, Observable } from 'rxjs';
import { candidateMemberTracking } from '../../../../shared/helper/candidate-member-tracking';
import { voterMemberTracking } from '../../../../shared/helper/voter-member-tracking';
import { CandidateMember, VoterMember } from '../../../../shared/models';
import { MemberSelectors } from '../../../../shared/state/member.selectors';
import { CirclesAction } from '../../state/actions/circles.action';
import { CirclesSelectors } from '../../state/circles.selectors';

interface CircleDetailSettings {
    currentCount: number;
    maxAllowed: number;
}

@Component({
    selector: 'app-circle-detail-settings-members',
    standalone: true,
    imports: [
        UserListItemComponent,
        RxFor,
        UserAutocompleteSelectComponent,
        RxPush,
        FeatherModule,
        MatButton,
        RxIf,
        RxLet
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
    public readonly canAddCandidate$: Observable<boolean>;
    public readonly canAddVoter$: Observable<boolean>;
    public readonly settingsCandidate$: Observable<CircleDetailSettings>;
    public readonly settingsVoter$: Observable<CircleDetailSettings>;

    private readonly store = inject(Store);
    private readonly userService = inject(UserService);

    constructor() {
        this.voterMembers$ = this.store.select(MemberSelectors.Member.slices.circleVoterMembers);
        this.candidateMembers$ = this.store.select(MemberSelectors.Member.slices.circleCandidateMembers);
        this.voterUsers$ = this.store.select(MemberSelectors.CircleSelector.voterUsers);
        this.candidateUsers$ = this.store.select(MemberSelectors.CircleSelector.candidateUsers);
        this.canEditCircle$ = this.store.select(CirclesSelectors.canEditCircle);
        this.canAddCandidate$ = combineLatest([
            this.store.select(CirclesSelectors.slices.selectedCircle),
            this.store.select(CirclesSelectors.slices.option),
            this.store.select(CirclesSelectors.canEditCircle),
            this.store.select(MemberSelectors.Member.slices.circleCandidateMembers)
        ]).pipe(
            map(([circle, option, canEdit, candidates]) => {
                if (!canEdit) {
                    return false;
                }

                if (circle?.private) {
                    return candidates.length < option.privateOption.maxCandidates;
                }

                return candidates.length < option.maxCandidates;
            })
        );
        this.canAddVoter$ = combineLatest([
            this.store.select(CirclesSelectors.slices.selectedCircle),
            this.store.select(CirclesSelectors.slices.option),
            this.store.select(CirclesSelectors.canEditCircle),
            this.store.select(MemberSelectors.Member.slices.circleVoterMembers)
        ]).pipe(
            map(([circle, option, canEdit, voters]) => {
                if (!canEdit) {
                    return false;
                }

                if (circle?.private) {
                    return voters.length < option.privateOption.maxVoters;
                }

                return voters.length < option.maxVoters;
            })
        );

        this.settingsCandidate$ = combineLatest([
            this.store.select(CirclesSelectors.slices.selectedCircle),
            this.store.select(CirclesSelectors.slices.option),
            this.store.select(MemberSelectors.Member.slices.circleCandidateMembers)
        ]).pipe(
            map(([circle, option, candidates]) => {
                if (circle?.private) {
                    return {
                        currentCount: candidates.length,
                        maxAllowed: option.privateOption.maxCandidates
                    };
                }

                return {
                    currentCount: candidates.length,
                    maxAllowed: option.maxCandidates
                };
            })
        );

        this.settingsVoter$ = combineLatest([
            this.store.select(CirclesSelectors.slices.selectedCircle),
            this.store.select(CirclesSelectors.slices.option),
            this.store.select(MemberSelectors.Member.slices.circleVoterMembers)
        ]).pipe(
            map(([circle, option, voters]) => {
                if (circle?.private) {
                    return {
                        currentCount: voters.length,
                        maxAllowed: option.privateOption.maxVoters
                    };
                }

                return {
                    currentCount: voters.length,
                    maxAllowed: option.maxVoters
                };
            })
        );
    }

    public readonly allUsersFn$ = () => this.userService.users().pipe(
        map(res => res.data),
        catchError(() => [])
    );

    public readonly allFilteredUsersFn$ = (username: string) => this.userService.usersFiltered(username).pipe(
        map(res => res.data),
        catchError(() => [])
    );

    public onCandidateSelected(userIdentityId: string) {
        const circle = this.store.selectSnapshot(CirclesSelectors.slices.selectedCircle);
        this.store.dispatch(new CirclesAction.AddCandidate(circle?.id ?? 0, userIdentityId));
    }

    public onCandidateDeselection(userIdentityId: string) {
        console.log('remove candidate');
    }

    public onVoterSelected(userIdentityId: string) {
        const circle = this.store.selectSnapshot(CirclesSelectors.slices.selectedCircle);
        this.store.dispatch(new CirclesAction.AddVoter(circle?.id ?? 0, userIdentityId));
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
