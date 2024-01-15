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
    private readonly store = inject(Store);

    public onJoinCircle() {
        this.store.dispatch(new CirclesAction.JoinCircle(this.circleId));
    }
}
