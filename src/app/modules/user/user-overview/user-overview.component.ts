import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserService } from '@vyf/user-service';
import { catchError, map } from 'rxjs';

@Component({
    selector: 'app-user-overview',
    templateUrl: './user-overview.component.html',
    styleUrls: ['./user-overview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOverviewComponent {
    private readonly userService = inject(UserService);
    public readonly allUsersFn$ = () => this.userService.users().pipe(
        map(res => res.data),
        catchError(() => [])
    );

    public readonly allFilteredUsersFn$ = (username: string) => this.userService.usersFiltered(username).pipe(
        map(res => res.data),
        catchError(() => [])
    );
}
