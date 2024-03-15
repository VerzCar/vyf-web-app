import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Circle } from '@vyf/vote-circle-service';

@Component({
    selector: 'app-circle-card',
    templateUrl: './circle-card.component.html',
    styleUrls: ['./circle-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleCardComponent {
    @Input({ required: true }) public circle!: Circle;

    public readonly placeholderImageSrc = 'assets/img/placeholder-image.jpg';
}
