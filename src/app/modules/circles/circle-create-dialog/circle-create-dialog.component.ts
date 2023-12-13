import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngxs/store';
import { DateTime, statusChangesToValidAndNotPending } from '@vyf/base';
import { SubmitButtonComponent, UserAutocompleteSelectComponent } from '@vyf/component';
import { catchError, Observable, of, tap } from 'rxjs';
import { createCircleFormToRequest } from '../mapper/create-circle-form-to-request';
import { createCircleCreateForm } from '../services/factory/forms.factory';
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
        SubmitButtonComponent
    ],
    templateUrl: './circle-create-dialog.component.html',
    styleUrl: './circle-create-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleCreateDialogComponent {
    public readonly form = createCircleCreateForm();
    public readonly minDate = DateTime.Day.next();
    public readonly maxDate = new Date(DateTime.Day.today().setFullYear(DateTime.Day.today().getFullYear() + 5));
    public readonly formIsValid$: Observable<boolean>;

    public isLoading = false;

    private readonly dialogRef: MatDialogRef<CircleCreateDialogComponent, null> = inject(MatDialogRef<CircleCreateDialogComponent, null>);
    private readonly store = inject(Store);

    constructor() {
        this.formIsValid$ = statusChangesToValidAndNotPending(this.form);
        //dateAfter(DateTime.Day.today())
    }

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
}
