import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { finalize, Observable, take, tap } from 'rxjs';
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

    public userProfileImageSrc: string | null = null;
    public isUserProfileImageLoading = false;

    public readonly form = new FormGroup<UserForm>(<UserForm>{
        whyVoteMe: new FormControl('', Validators.maxLength(250)),
        bio: new FormControl('', Validators.maxLength(1500))
    });

    private readonly store = inject(Store);

    constructor() {
        this.store.select(UserSelectors.slices.user).pipe(
            tap(user => {
                this.userProfileImageSrc = user?.profile.imageSrc.length ? user?.profile.imageSrc : null;
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

    public onUserProfileImageSelected(image: File): void {
        this.isUserProfileImageLoading = true;
        this.store.dispatch(new UserAction.UpdateProfileImage(image)).pipe(
            take(1),
            finalize(() => this.isUserProfileImageLoading = false)
        ).subscribe();
    }
}
