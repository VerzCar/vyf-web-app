import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { AvatarImgSize } from '@vyf/component';
import { CirclePaginated, Commitment } from '@vyf/vote-circle-service';
import { Observable } from 'rxjs';
import { Route } from '../../../../routes';
import { InfoSelectors } from '../../../../shared/state/info.selectors';
import { CirclesAction } from '../../../circles/state/actions/circles.action';

@Component({
    selector: 'app-toolbar-circle-invitations',
    templateUrl: './toolbar-circle-invitations.component.html',
    styleUrl: './toolbar-circle-invitations.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarCircleInvitationsComponent {
    public readonly circles$: Observable<CirclePaginated[]>;

    private readonly store = inject(Store);

    constructor() {
        this.circles$ = this.store.select(InfoSelectors.slices.circlesOpenCommitment);
    }

    public onCommitment(circle: CirclePaginated) {
        this.store.dispatch(new CirclesAction.CommittedToCircle(circle.id, Commitment.Committed));
    }

    public onRejection(circle: CirclePaginated) {
        this.store.dispatch(new CirclesAction.CommittedToCircle(circle.id, Commitment.Rejected));
    }

    protected readonly route = Route;
    protected readonly AvatarImgSize = AvatarImgSize;
}
