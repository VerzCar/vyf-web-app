import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-circles-carousel',
  templateUrl: './circles-carousel.component.html',
  styleUrls: ['./circles-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclesCarouselComponent {}
