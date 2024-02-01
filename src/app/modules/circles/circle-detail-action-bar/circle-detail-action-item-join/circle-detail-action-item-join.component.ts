import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { CirclesAction } from '../../state/actions/circles.action';

@Component({
    selector: 'app-circle-detail-action-item-join',
    templateUrl: './circle-detail-action-item-join.component.html',
    styleUrl: './circle-detail-action-item-join.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailActionItemJoinComponent {
    @Input({ required: true }) public circleId!: number;
    @Input({ required: true }) public subject!: 'voter' | 'candidate';
    private readonly store = inject(Store);

    public onJoinCircle() {
        if (this.subject === 'voter') {
            this.store.dispatch(new CirclesAction.JoinCircleAsVoter(this.circleId));
            return;
        }

        this.store.dispatch(new CirclesAction.JoinCircleAsCandidate(this.circleId));
    }
}
