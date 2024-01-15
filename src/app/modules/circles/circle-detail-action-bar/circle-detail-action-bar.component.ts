import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Circle, Commitment } from '@vyf/vote-circle-service';
import { combineLatest, map, Observable } from 'rxjs';
import { MemberSelectors } from '../../../shared/state/member.selectors';
import { CirclesAction } from '../state/actions/circles.action';
import { CirclesSelectors } from '../state/circles.selectors';

export interface CircleDetailActionBarComponentView {
    circle: Circle;
    hasOpenCommitment: boolean;
    selectedCommitment: Commitment | undefined;
    isUserMemberOfCircle: boolean;
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
            this.store.select(MemberSelectors.CircleSelector.hasOpenCommitment),
            this.store.select(MemberSelectors.Member.slices.circleUserMember).pipe(map(member => member?.voter.commitment)),
            this.store.select(MemberSelectors.CircleSelector.isUserMemberOfCircle)
        ]).pipe(
            map((
                [
                    circle,
                    hasOpenCommitment,
                    commitment,
                    isUserMemberOfCircle
                ]
            ) => ({
                circle: circle as Circle,
                hasOpenCommitment,
                selectedCommitment: commitment,
                isUserMemberOfCircle
            }))
        );
    }

    public hasCommitted(circleId: number, commitment: Commitment) {
        this.store.dispatch(new CirclesAction.CommittedToCircle(circleId, commitment));
    }
}
