import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngxs/store';
import { RxIf } from '@rx-angular/template/if';
import { DateTime, statusChangesToValidAndNotPending } from '@vyf/base';
import { SubmitButtonComponent, UserAutocompleteSelectComponent } from '@vyf/component';
import { UserService } from '@vyf/user-service';
import { catchError, map, Observable, of, startWith, tap } from 'rxjs';
import { FeatherIconModule } from '../../feather-icon/feather-icon.module';
import { createCircleFormToRequest } from '../mapper/create-circle-form-to-request';
import { createCircleForm } from '../services/factory/forms.factory';
import { CirclesAction } from '../state/actions/circles.action';

@Component({
    selector: 'app-circle-create-dialog',
    standalone: true,
    imports: [
        MatButtonModule,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        TextFieldModule,
        UserAutocompleteSelectComponent,
        SubmitButtonComponent,
        RxIf,
        FeatherIconModule
    ],
    templateUrl: './circle-create-dialog.component.html',
    styleUrl: './circle-create-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleCreateDialogComponent {
    public isLoading = false;

    public readonly form = createCircleForm();
    public readonly minValidUntilDate = DateTime.Day.next();
    public readonly maxValidUntilDate = new Date(DateTime.Day.today().setFullYear(DateTime.Day.today().getFullYear() + 5));
    public readonly minValidFromDate = DateTime.Day.today();
    public readonly maxValidFromDate = this.maxValidUntilDate;
    public readonly formIsValid$: Observable<boolean>;

    private readonly dialogRef: MatDialogRef<CircleCreateDialogComponent, null> = inject(MatDialogRef<CircleCreateDialogComponent, null>);
    private readonly store = inject(Store);
    private readonly userService = inject(UserService);

    constructor() {
        this.formIsValid$ = statusChangesToValidAndNotPending(this.form);

        this.form.controls.private.valueChanges.pipe(
            startWith(this.form.controls.private.value),
            tap(isPrivate => {
                if (isPrivate) {
                    this.form.controls.voters.addValidators([Validators.required, Validators.minLength(1)]);
                    this.form.controls.candidates.addValidators([Validators.required, Validators.minLength(1)]);
                } else {
                    this.form.controls.voters.removeValidators([Validators.required, Validators.minLength(1)]);
                    this.form.controls.candidates.removeValidators([Validators.required, Validators.minLength(1)]);
                }

                this.form.controls.voters.updateValueAndValidity();
                this.form.controls.candidates.updateValueAndValidity();
            }),
            takeUntilDestroyed()
        ).subscribe();
    }

    public readonly allUsersFn$ = () => this.userService.users().pipe(
        map(res => res.data),
        catchError(() => [])
    );

    public readonly allFilteredUsersFn$ = (username: string) => this.userService.usersFiltered(username).pipe(
        map(res => res.data),
        catchError(() => [])
    );

    public onSubmit() {
        const formRawValue = this.form.getRawValue();

        this.isLoading = true;
        this.form.disable();

        this.store.dispatch(new CirclesAction.CreateCircle(createCircleFormToRequest(formRawValue)))
            .pipe(
                tap(() => this.dialogRef.close(null)),
                catchError(() => {
                    this.isLoading = false;
                    this.form.enable();
                    return of(null);
                })
            ).subscribe();
    }

    public close() {
        this.dialogRef.close(null);
    }

    public onCandidatesSelected(userIdentidyIds: string[]) {
        this.form.controls.candidates.patchValue(userIdentidyIds);
        this.form.controls.candidates.updateValueAndValidity();
    }

    public onVotersSelected(userIdentidyIds: string[]) {
        this.form.controls.voters.patchValue(userIdentidyIds);
        this.form.controls.voters.updateValueAndValidity();
    }
}
