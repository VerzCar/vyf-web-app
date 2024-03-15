import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { User } from '@vyf/user-service';
import { filter, map, Observable } from 'rxjs';
import { UserSelectors } from '../state/user.selectors';

interface UserView {
    user: User;
}

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit {
    public view$: Observable<UserView> | undefined;

    private readonly store = inject(Store);

    public ngOnInit(): void {
        this.view$ = this.store.select(UserSelectors.slices.user).pipe(
            filter(user => user !== undefined),
            map(user => ({
                user: user as User
            }))
        );
    }
}
