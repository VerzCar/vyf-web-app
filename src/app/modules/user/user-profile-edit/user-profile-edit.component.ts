import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileEditComponent {}
