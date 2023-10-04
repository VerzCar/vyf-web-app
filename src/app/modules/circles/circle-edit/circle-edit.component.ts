import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-circle-edit',
  templateUrl: './circle-edit.component.html',
  styleUrls: ['./circle-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleEditComponent {}
