import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { User } from '@vyf/user-service';
import { Circle } from '@vyf/vote-circle-service';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { CircleDetailSettingsDialogComponent, CircleDetailSettingsDialogComponentView } from '../circle-detail-settings-dialog/circle-detail-settings-dialog.component';
import { CirclesSelectors } from '../state/circles.selectors';

interface CircleDetailView {
    circle: Circle;
    owner: User;
    disabled: boolean;
}

@Component({
    selector: 'app-circle-detail',
    templateUrl: './circle-detail.component.html',
    styleUrls: ['./circle-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailComponent {
    public readonly placeholderImageSrc = 'assets/img/placeholder-image.jpg';

    public readonly view$: Observable<CircleDetailView>;

    private readonly store = inject(Store);
    private readonly dialog = inject(MatDialog);

    constructor() {
        this.view$ = combineLatest([
            this.store.select(CirclesSelectors.slices.selectedCircle),
            this.store.select(CirclesSelectors.slices.selectedCircleOwner),
            this.store.select(CirclesSelectors.canEditCircle)
        ]).pipe(
            filter((
                [
                    circle,
                    owner
                ]
            ) => isDefined(circle) && isDefined(owner)),
            map(([c, owner, canEditCircle]) => ({
                circle: c as Circle,
                owner: owner as User,
                disabled: !canEditCircle
            }))
        );
    }

    public onOpenSettings(view: CircleDetailView) {
        const viewData: CircleDetailSettingsDialogComponentView = {
            circle: view.circle
        };

        this.dialog.open(CircleDetailSettingsDialogComponent, { width: '600px', data: viewData });
    }
}
