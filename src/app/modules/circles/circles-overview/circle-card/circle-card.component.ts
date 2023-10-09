import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-circle-card',
  templateUrl: './circle-card.component.html',
  styleUrls: ['./circle-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleCardComponent {}
