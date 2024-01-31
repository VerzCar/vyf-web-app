import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { Commitment } from '@vyf/vote-circle-service';
import { CirclesAction } from '../../state/actions/circles.action';

@Component({
    selector: 'app-circle-detail-action-item-commitment',
    templateUrl: './circle-detail-action-item-commitment.component.html',
    styleUrl: './circle-detail-action-item-commitment.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailActionItemCommitmentComponent {
    @Input({ required: true }) public circleId!: number;
    @Input({ required: true }) public commitment!: Commitment;

    public readonly Commitment = Commitment;

    private readonly store = inject(Store);

    public onCommitment() {
        this.store.dispatch(new CirclesAction.CommittedToCircle(this.circleId, Commitment.Committed));
    }

    public onRejection() {
        this.store.dispatch(new CirclesAction.CommittedToCircle(this.circleId, Commitment.Rejected));
    }

    public onLeaveAsCandidate() {
        this.store.dispatch(new CirclesAction.CommittedToCircle(this.circleId, Commitment.Rejected));
    }
}
