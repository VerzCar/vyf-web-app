import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-circle-members',
  templateUrl: './circle-members.component.html',
  styleUrls: ['./circle-members.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleMembersComponent {}
