import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserService } from '@vyf/user-service';
import { catchError, map, take, tap } from 'rxjs';
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

    public readonly userIds = [
        '293a69b4-ffc7-481a-91cb-012765a4fd16',
        '68a1a453-2f58-4ce1-8908-49a30fe6c211',
        'd4e7c3d9-8910-4ed8-a060-31f773acf1c0'
    ];

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
                take(1),
                tap(() => this.router.navigate(['/circles']))
            ).subscribe();
    }
}
