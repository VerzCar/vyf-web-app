import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { User, UserPaginated } from '@vyf/user-service';
import { FeatherModule } from 'angular-feather';
import { BehaviorSubject, combineLatest, debounceTime, finalize, map, Observable, shareReplay, startWith, Subject, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { ShortNamePipe } from '../pipes/short-name.pipe';
import { UserListItemComponent } from '../user-list-item/user-list-item.component';

interface UserAutocompleteOption extends UserPaginated {
    disabled: boolean;
}

@Component({
    selector: 'vyf-user-autocomplete',
    standalone: true,
    imports: [CommonModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, RxFor, MatProgressSpinnerModule, RxIf, NgOptimizedImage, ShortNamePipe, MatButtonModule, FeatherModule, MatIconModule, UserListItemComponent],
    templateUrl: './user-autocomplete.component.html',
    styleUrls: ['./user-autocomplete.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAutocompleteComponent {
    @Input({ required: true }) public filteredFetchOptionsFn!: (searchTerm: string) => Observable<UserPaginated[]>;
    @Input({ required: true }) public fetchOptionsFn!: () => Observable<UserPaginated[]>;
    @Output() public selectedUsers = new EventEmitter<string[]>();

    public control = new FormControl<string>('');
    public selectedUsers$: Observable<UserAutocompleteOption[]>;
    public filteredUsers$: Observable<UserAutocompleteOption[]>;
    public isLoading = false;

    public readonly selectedUsersSubject = new BehaviorSubject<UserAutocompleteOption[]>([]);

    constructor() {
        this.selectedUsers$ = this.selectedUsersSubject.asObservable();

        this.filteredUsers$ = combineLatest([
            this.control.valueChanges.pipe(startWith('')),
            this.selectedUsers$
        ]).pipe(
            debounceTime(300),
            tap(() => this.isLoading = true),
            switchMap(([username, selectedUsers]) =>
                username ? this.filteredUserOptions$(username, selectedUsers) : this.allUserOptions$(selectedUsers)
            )
        );
    }

    public displayFn(user: UserPaginated): string {
        return user.username;
    }

    public onOptionSelected(user: UserAutocompleteOption) {
        if (user.disabled) {
            return;
        }

        this.selectedUsers$.pipe(
            take(1),
            tap(() => {
                const users = this.selectedUsersSubject.getValue();
                users.push(user);
                this.selectedUsersSubject.next(users);
                this.selectedUsers.emit(users.map(user => user.identityId));
            }),
            finalize(() => this.control.reset(''))
        ).subscribe();
    }

    public removeSelectedUser(index: number): void {
        this.selectedUsers$.pipe(
            take(1),
            tap(() => {
                const users = this.selectedUsersSubject.getValue();
                users.splice(index, 1);
                this.selectedUsersSubject.next(users);
            })
        ).subscribe();
    }

    private filteredUserOptions$(
        username: string,
        selectedUsers: UserAutocompleteOption[]
    ): Observable<UserAutocompleteOption[]> {
        return this.filteredFetchOptionsFn(username).pipe(
            map(filteredUsers => this.createUserOptions(filteredUsers, selectedUsers)),
            finalize(() => this.isLoading = false)
        );
    }

    private allUserOptions$(selectedUsers: UserAutocompleteOption[]): Observable<UserAutocompleteOption[]> {
        return this.fetchOptionsFn().pipe(
            map(filteredUsers => this.createUserOptions(filteredUsers, selectedUsers)),
            finalize(() => this.isLoading = false)
        );
    }

    private createUserOptions(filteredUsers: UserPaginated[], selectedUsers: UserPaginated[]): UserAutocompleteOption[] {
        return filteredUsers.map(user => {
            let disabled = false;
            const lookupUsers = [...selectedUsers];
            const foundIndexInSelectedUsers = lookupUsers.findIndex(selectedUser => selectedUser.identityId === user.identityId);
            if (foundIndexInSelectedUsers > -1) {
                lookupUsers.splice(foundIndexInSelectedUsers, 1);
                disabled = true;
            }
            const userOption: UserAutocompleteOption = {
                ...user,
                disabled
            };
            return userOption;
        });
    }
}
