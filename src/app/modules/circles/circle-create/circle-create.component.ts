import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { DateTime } from '@vyf/base';
import { UserService } from '@vyf/user-service';
import { catchError, map, tap } from 'rxjs';
import { createCircleFormToRequest } from '../mapper/create-circle-form-to-request';
import { createCircleCreateForm } from '../services/factory/forms.factory';
import { CirclesAction } from '../state/actions/circles.action';

@Component({
    selector: 'app-circle-create',
    templateUrl: './circle-create.component.html',
    styleUrls: ['./circle-create.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleCreateComponent {
    public readonly form = createCircleCreateForm();
    public readonly minDate = DateTime.Day.next();
    public readonly maxDate = new Date(DateTime.Day.today().setFullYear(DateTime.Day.today().getFullYear() + 5));
    private readonly userService = inject(UserService);

    public readonly allUsersFn$ = () => this.userService.users().pipe(
        map(res => res.data),
        catchError(() => [])
    );

    public readonly allFilteredUsersFn$ = (username: string) => this.userService.usersFiltered(username).pipe(
        map(res => res.data),
        catchError(() => [])
    );

    private readonly store = inject(Store);
    private readonly router = inject(Router);

    public onSubmit() {
        const formRawValue = this.form.getRawValue();

        this.store.dispatch(new CirclesAction.CreateCircle(createCircleFormToRequest(formRawValue)))
            .pipe(
                tap(() => this.router.navigate(['/circles']))
            ).subscribe();
    }

    public onUsersSelected(userIdentidyIds: string[]) {
        this.form.controls.voters.patchValue(userIdentidyIds);
    }
}
