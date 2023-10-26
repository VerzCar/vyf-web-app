import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { User, UserPaginated } from '@vyf/user-service';
import { BehaviorSubject, debounceTime, finalize, map, Observable, startWith, Subject, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { ShortNamePipe } from '../pipes/short-name.pipe';

interface UserAutocompleteOption extends UserPaginated {
    disabled: boolean;
}

@Component({
    selector: 'vyf-user-autocomplete',
    standalone: true,
    imports: [CommonModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, RxFor, MatProgressSpinnerModule, RxIf, NgOptimizedImage, ShortNamePipe, MatButtonModule],
    templateUrl: './user-autocomplete.component.html',
    styleUrls: ['./user-autocomplete.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAutocompleteComponent {
    @Input({ required: true }) public filteredFetchOptionsFn!: (searchTerm: string) => Observable<UserPaginated[]>;
    @Input({ required: true }) public fetchOptionsFn!: () => Observable<UserPaginated[]>;

    public control = new FormControl<string>('');
    public selectedUsers$: Observable<UserAutocompleteOption[]>;
    public filteredUsers$: Observable<UserAutocompleteOption[]>;
    public isLoading = false;

    public readonly selectedUsersSubject = new BehaviorSubject<UserAutocompleteOption[]>([]);

    constructor() {
        this.filteredUsers$ = this.control.valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            tap(() => this.isLoading = true),
            switchMap(username => username ? this.filteredUserOptions$(username) : this.allUserOptions$())
        );

        this.selectedUsers$ = this.selectedUsersSubject.asObservable();
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

    private filteredUserOptions$(username: string): Observable<UserAutocompleteOption[]> {
        return this.filteredFetchOptionsFn(username).pipe(
            withLatestFrom(this.selectedUsers$),
            map(([filteredUsers, selectedUsers]) => this.createUserOptions(filteredUsers, selectedUsers)),
            finalize(() => this.isLoading = false)
        );
    }

    private allUserOptions$(): Observable<UserAutocompleteOption[]> {
        return this.fetchOptionsFn().pipe(
            withLatestFrom(this.selectedUsers$),
            map(([filteredUsers, selectedUsers]) => this.createUserOptions(filteredUsers, selectedUsers)),
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
