import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-member-list-circle',
  templateUrl: './member-list-circle.component.html',
  styleUrls: ['./member-list-circle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberListCircleComponent {}
