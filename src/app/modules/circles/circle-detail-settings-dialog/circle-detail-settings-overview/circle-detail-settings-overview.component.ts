import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { RxLet } from '@rx-angular/template/let';
import { Circle } from '@vyf/vote-circle-service';
import { map, Observable } from 'rxjs';
import { CircleDetailEditFormComponent } from '../../circle-detail-edit-form/circle-detail-edit-form.component';
import { CirclesSelectors } from '../../state/circles.selectors';

export interface CircleDetailSettingsOverviewComponentView {
    circle: Circle;
}

@Component({
    selector: 'app-circle-detail-settings-overview',
    standalone: true,
    imports: [
        RxLet,
        CircleDetailEditFormComponent,
        DatePipe
    ],
    templateUrl: './circle-detail-settings-overview.component.html',
    styleUrl: './circle-detail-settings-overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailSettingsOverviewComponent {
    public readonly view$: Observable<CircleDetailSettingsOverviewComponentView>;
    private readonly store = inject(Store);

    constructor() {
        this.view$ = this.store.select(CirclesSelectors.slices.selectedCircle).pipe(
            map(circle => ({
                circle: circle as Circle
            }))
        );
    }

}
