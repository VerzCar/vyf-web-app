import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { ImageUploadComponent } from '@vyf/component';
import { Circle } from '@vyf/vote-circle-service';
import { filter, map, Observable, shareReplay } from 'rxjs';
import { CirclesAction } from '../../state/actions/circles.action';
import { CirclesSelectors } from '../../state/circles.selectors';

@Component({
    selector: 'app-circle-detail-settings-image',
    standalone: true,
    imports: [
        ImageUploadComponent
    ],
    templateUrl: './circle-detail-settings-image.component.html',
    styleUrl: './circle-detail-settings-image.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailSettingsImageComponent {
    public readonly circleImageSrc$: Observable<string>;

    private readonly store = inject(Store);

    constructor() {
        this.circleImageSrc$ = this.store.select(CirclesSelectors.slices.selectedCircle).pipe(
            filter(circle => isDefined(circle)),
            map(circle => circle as Circle),
            map(circle => circle.imageSrc),
            shareReplay()
        );
    }

    public onCircleImageSelected(image: File): void {
        this.store.dispatch(new CirclesAction.UpdateCircleImage(image));
    }
}
