import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { User, UserPaginated, UserService } from '@vyf/user-service';
import { catchError, map, Observable } from 'rxjs';

interface Item {
    paginatedUser: UserPaginated;
    user$: Observable<User>;
}

interface UserOverviewView {
    items: Item[];
}

@Component({
    selector: 'app-user-overview',
    templateUrl: './user-overview.component.html',
    styleUrls: ['./user-overview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOverviewComponent {
    private readonly userService = inject(UserService);

    public view$: Observable<UserOverviewView>;
    public readonly allUsersFn$ = () => this.userService.users().pipe(
        map(res => res.data),
        catchError(() => [])
    );

    public readonly allFilteredUsersFn$ = (username: string) => this.userService.usersFiltered(username).pipe(
        map(res => res.data),
        catchError(() => [])
    );

    constructor() {
        this.view$ = this.userService.users().pipe(
            map(res => res.data),
            map(users => {
                const items: Item[] = users.map(user => ({
                    paginatedUser: user,
                    user$: this.user$(user.identityId)
                }));

                return {
                    items
                };
            })
        );
    }

    private user$(identityId: string): Observable<User> {
        return this.userService.x(identityId).pipe(
            map(res => res.data)
        );
    }
}
