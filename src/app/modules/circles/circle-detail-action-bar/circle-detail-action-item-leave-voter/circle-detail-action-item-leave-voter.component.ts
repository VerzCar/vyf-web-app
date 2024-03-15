import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { CirclesAction } from '../../state/actions/circles.action';

@Component({
    selector: 'app-circle-detail-action-item-leave-voter',
    templateUrl: './circle-detail-action-item-leave-voter.component.html',
    styleUrl: './circle-detail-action-item-leave-voter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailActionItemLeaveVoterComponent {
    @Input({ required: true }) public circleId!: number;

    private readonly store = inject(Store);

    public onLeaveAsVoter() {
        this.store.dispatch(new CirclesAction.LeaveCircleAsVoter(this.circleId));
    }
}
