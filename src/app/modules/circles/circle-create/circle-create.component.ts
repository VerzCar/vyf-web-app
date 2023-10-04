import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-circle-create',
  templateUrl: './circle-create.component.html',
  styleUrls: ['./circle-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleCreateComponent {}
