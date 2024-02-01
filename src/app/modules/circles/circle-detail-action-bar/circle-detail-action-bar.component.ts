import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Circle, Commitment } from '@vyf/vote-circle-service';
import { combineLatest, map, Observable } from 'rxjs';
import { CandidateMember } from '../../../shared/models';
import { MemberSelectors } from '../../../shared/state/member.selectors';
import { CirclesAction } from '../state/actions/circles.action';
import { CirclesSelectors } from '../state/circles.selectors';

export interface CircleDetailActionBarComponentView {
    circle: Circle;
    circleUserCandidateMember: CandidateMember | undefined;
    selectedCommitment: Commitment | undefined;
    isUserVoterMemberOfCircle: boolean;
    isUserCandidateMemberOfCircle: boolean;
}

@Component({
    selector: 'app-circle-detail-action-bar',
    templateUrl: './circle-detail-action-bar.component.html',
    styleUrl: './circle-detail-action-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailActionBarComponent {
    public readonly view$: Observable<CircleDetailActionBarComponentView>;

    private readonly store = inject(Store);

    constructor() {
        this.view$ = combineLatest([
            this.store.select(CirclesSelectors.slices.selectedCircle),
            this.store.select(MemberSelectors.Member.slices.circleUserCandidateMember),
            this.store.select(MemberSelectors.Member.slices.circleUserVoterMember).pipe(map(member => member?.voter.commitment)),
            this.store.select(MemberSelectors.CircleSelector.isUserVoterMemberOfCircle),
            this.store.select(MemberSelectors.CircleSelector.isUserCandidateMemberOfCircle)
        ]).pipe(
            map((
                [
                    circle,
                    circleUserCandidateMember,
                    commitment,
                    isUserVoterMemberOfCircle,
                    isUserCandidateMemberOfCircle
                ]
            ) => ({
                circle: circle as Circle,
                circleUserCandidateMember,
                selectedCommitment: commitment,
                isUserVoterMemberOfCircle,
                isUserCandidateMemberOfCircle
            }))
        );
    }

    public onLeaveAVoter(id: number) {
        this.store.dispatch(new CirclesAction.LeaveCircleAsVoter(id));
    }
}
