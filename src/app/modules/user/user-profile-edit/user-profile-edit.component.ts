import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface UserForm {
  whyVoteMe: FormControl<string>;
  bio: FormControl<string>;
}

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileEditComponent {
  public readonly form = new FormGroup<UserForm>(<UserForm>{
	whyVoteMe: new FormControl('', Validators.maxLength(5)),
	bio: new FormControl('', Validators.maxLength(200))
  });

  public onSubmit(): void {
	console.log(this.form.getRawValue());
  }
}
