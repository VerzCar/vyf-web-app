import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { RxFor } from '@rx-angular/template/for';
import { UserListItemComponent } from '@vyf/component';
import { Observable } from 'rxjs';
import { CandidateMember, VoterMember } from '../../../../shared/models';
import { MemberSelectors } from '../../../../shared/state/member.selectors';

@Component({
    selector: 'app-circle-detail-settings-members',
    standalone: true,
    imports: [
        UserListItemComponent,
        RxFor
    ],
    templateUrl: './circle-detail-settings-members.component.html',
    styleUrl: './circle-detail-settings-members.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailSettingsMembersComponent {
    public readonly voterMembers$: Observable<VoterMember[]>;
    public readonly candidateMembers$: Observable<CandidateMember[]>;

    private readonly store = inject(Store);

    constructor() {
        this.voterMembers$ = this.store.select(MemberSelectors.Member.slices.circleVoterMembers);
        this.candidateMembers$ = this.store.select(MemberSelectors.Member.slices.circleCandidateMembers);
    }
}
