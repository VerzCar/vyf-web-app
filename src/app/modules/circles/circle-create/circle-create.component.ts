import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserService } from '@vyf/user-service';
import { catchError, map, tap } from 'rxjs';
import { CirclesAction } from '../circles-state/actions/circles.action';
import { createCircleFormToRequest } from '../mapper/create-circle-form-to-request';
import { createCircleCreateForm } from '../services/factory/forms.factory';

@Component({
    selector: 'app-circle-create',
    templateUrl: './circle-create.component.html',
    styleUrls: ['./circle-create.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleCreateComponent {
    public readonly form = createCircleCreateForm();
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
        console.log(formRawValue);
        this.store.dispatch(new CirclesAction.CreateCircle(createCircleFormToRequest(formRawValue)))
            .pipe(
                tap(() => this.router.navigate(['/circles']))
            ).subscribe();
    }

    public onUsersSelected(userIdentidyIds: string[]) {
        this.form.controls.voters.patchValue(userIdentidyIds);
    }
}
