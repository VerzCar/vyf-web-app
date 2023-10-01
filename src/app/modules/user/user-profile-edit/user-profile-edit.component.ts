import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs';
import { UserSelectors } from '../user-state/user.selectors';

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
  private readonly store = inject(Store);

  public readonly form = new FormGroup<UserForm>(<UserForm>{
	whyVoteMe: new FormControl('', Validators.maxLength(250)),
	bio: new FormControl('', Validators.maxLength(1500))
  });

  constructor() {
	this.store.select(UserSelectors.slices.user).pipe(
	  tap(user => {
		this.form.setValue({
		  whyVoteMe: user?.profile.whyVoteMe ?? '',
		  bio: user?.profile.bio ?? ''
		});
	  }),
	  takeUntilDestroyed()
	).subscribe();
  }

  public onSubmit(): void {
	console.log(this.form.getRawValue());
  }
}
