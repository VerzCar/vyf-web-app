import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Circle } from '@vyf/vote-circle-service';

@Component({
    selector: 'app-circles-carousel',
    templateUrl: './circles-carousel.component.html',
    styleUrls: ['./circles-carousel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CirclesCarouselComponent {
    @Input({ required: true }) public circles!: Circle[];
    @Output() public createNewCircle = new EventEmitter<void>();

    public onCreateNew() {
        this.createNewCircle.emit();
    }
}
