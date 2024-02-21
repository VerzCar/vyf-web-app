import { log } from '@angular-devkit/build-angular/src/builders/ssr-dev-server';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { User } from '@vyf/user-service';
import { Circle } from '@vyf/vote-circle-service';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { MemberSelectors } from '../../../shared/state/member.selectors';
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
            this.store.select(MemberSelectors.Member.slices.circleVoterMembers),
            this.store.select(MemberSelectors.Member.slices.circleCandidateMembers)
        ]).pipe(
            filter((
                [
                    circle,
                    owner,
                    circleVoterMembers,
                    circleCandidateMembers
                ]
            ) => isDefined(circle) && isDefined(owner) && isDefined(circleVoterMembers) && isDefined(circleCandidateMembers)),
            map(([c, owner, voterMembers, candidateMembers]) => {
                return {
                    circle: c as Circle,
                    owner: owner as User,
                    disabled: !this.store.selectSnapshot(CirclesSelectors.canEditCircle)
                };
            })
        );
    }

    public onOpenSettings(view: CircleDetailView) {
        const viewData: CircleDetailSettingsDialogComponentView = {
            circle: view.circle
        };

        this.dialog.open(CircleDetailSettingsDialogComponent, { width: '600px', data: viewData });
    }
}
