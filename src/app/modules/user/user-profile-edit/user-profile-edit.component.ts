import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { Profile, User } from '@vyf/user-service';
import { BehaviorSubject, filter, map, Observable, tap } from 'rxjs';
import { UserAction } from '../user-state/actions/user.action';
import { UserSelectors } from '../user-state/user.selectors';

interface UserForm {
    whyVoteMe: FormControl<string>;
    bio: FormControl<string>;
}

@Component({
    selector: 'app-user-profile-edit',
    templateUrl: './user-profile-edit.component.html',
    styleUrls: ['./user-profile-edit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileEditComponent {
    public userProfileImageSrc$: Observable<string>;
    public done = new BehaviorSubject(false);
    public disabled$: Observable<boolean>;

    public readonly form = new FormGroup<UserForm>(<UserForm>{
        whyVoteMe: new FormControl('', Validators.maxLength(250)),
        bio: new FormControl('', Validators.maxLength(1500))
    });

    private readonly store = inject(Store);

    constructor() {
        this.userProfileImageSrc$ = this.store.select(UserSelectors.slices.user).pipe(
            filter(user => isDefined(user)),
            map(user => user as User),
            tap(user => {
                this.form.setValue({
                    whyVoteMe: user?.profile.whyVoteMe ?? '',
                    bio: user?.profile.bio ?? ''
                });
            }),
            map(user => user.profile.imageSrc)
        );

        this.disabled$ = this.form.statusChanges.pipe(
            map(() => this.form.pristine || this.form.status === 'INVALID')
        );
    }

    public onSubmit(): void {
        if (this.form.invalid) {
            return;
        }

        const profile: Partial<Profile> = this.form.getRawValue();
        const user: Partial<User> = {
            profile
        } as User;

        this.store.dispatch(new UserAction.UpdateUser(user)).subscribe(() => this.done.next(true));
    }

    public onUserProfileImageSelected(image: File): void {
        this.store.dispatch(new UserAction.UpdateProfileImage(image));
    }
}
