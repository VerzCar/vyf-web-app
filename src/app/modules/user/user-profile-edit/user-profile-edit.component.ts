import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { isDefined, statusChangesToValidAndNotPending } from '@vyf/base';
import { Profile, User } from '@vyf/user-service';
import { BehaviorSubject, filter, map, Observable, shareReplay, tap } from 'rxjs';
import { UserAction } from '../state/actions/user.action';
import { UserSelectors } from '../state/user.selectors';

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
    public success$: Observable<boolean>;
    public formIsValid$: Observable<boolean>;

    public readonly form = new FormGroup<UserForm>(<UserForm>{
        whyVoteMe: new FormControl('', Validators.maxLength(250)),
        bio: new FormControl('', Validators.maxLength(1500))
    });
    private readonly successSubject = new BehaviorSubject(false);

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
            map(user => user.profile.imageSrc),
            shareReplay()
        );

        this.formIsValid$ = statusChangesToValidAndNotPending(this.form);
        this.success$ = this.successSubject.asObservable();

        this.formIsValid$.pipe(
            tap(isValid => {
                if (isValid) {
                    this.successSubject.next(false);
                }
            }),
            takeUntilDestroyed()
        ).subscribe();
    }

    public onSubmit(): void {
        if (this.form.invalid) {
            return;
        }

        const profile: Partial<Profile> = this.form.getRawValue();
        const user: Partial<User> = {
            profile
        } as User;

        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.form.updateValueAndValidity();
        this.successSubject.next(false);

        this.store.dispatch(new UserAction.UpdateUser(user)).pipe(
            tap({
                next: () => this.successSubject.next(true),
                error: () => {
                    this.form.markAsDirty();
                    this.form.markAsTouched();
                    this.form.updateValueAndValidity();
                    this.successSubject.next(false);
                }
            })
        ).subscribe();
    }

    public onUserProfileImageSelected(image: File): void {
        this.store.dispatch(new UserAction.UpdateProfileImage(image));
    }
}
