import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { UserPaginated } from '@vyf/user-service';
import { FeatherModule } from 'angular-feather';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, finalize, map, Observable, startWith, switchMap, tap } from 'rxjs';
import { AvatarImgComponent, AvatarImgSize } from '../avatar-img/avatar-img.component';
import { ShortNamePipe } from '../pipes/short-name.pipe';
import { UserListItemComponent } from '../user-list-item/user-list-item.component';

interface UserAutocompleteSelectOption extends UserPaginated {
    disabled: boolean;
    noMatch: boolean;
}

@Component({
    selector: 'vyf-user-autocomplete-select',
    standalone: true,
    imports: [
        MatInputModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        RxFor,
        MatProgressSpinnerModule,
        RxIf,
        NgOptimizedImage,
        ShortNamePipe,
        MatButtonModule,
        FeatherModule,
        MatIconModule,
        UserListItemComponent,
        NgClass,
        AvatarImgComponent
    ],
    templateUrl: './user-autocomplete-select.component.html',
    styleUrls: ['./user-autocomplete-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAutocompleteSelectComponent {
    @Input({ required: true })
    public filteredFetchOptionsFn!: (searchTerm: string) => Observable<UserPaginated[]>;
    @Input({ required: true })
    public fetchOptionsFn!: () => Observable<UserPaginated[]>;
    @Input()
    public preSelectedUsers: UserPaginated[] = [];
    @Input()
    public showSelectionInField = true;
    @Input()
    public removable = false;
    @Input()
    public placeholder = 'Search user';
    @Output()
    public selectedUsers = new EventEmitter<string[]>();
    @Output()
    public deselectedUser = new EventEmitter<string>();

    @ViewChild('userInput') private readonly userInput!: ElementRef<HTMLInputElement>;

    public readonly control = new FormControl<string>('');
    public readonly selectedUserOptions$: Observable<UserAutocompleteSelectOption[]>;
    public readonly filteredUserOptions$: Observable<UserAutocompleteSelectOption[]>;
    public readonly isLoading = new BehaviorSubject<boolean>(false);

    public readonly selectedUserOptionsSubject = new BehaviorSubject<UserAutocompleteSelectOption[]>([]);
    public readonly AvatarImgSize = AvatarImgSize;

    constructor() {
        this.selectedUserOptions$ = this.selectedUserOptionsSubject.asObservable();

        this.filteredUserOptions$ = combineLatest([
            this.control.valueChanges.pipe(
                startWith(''),
                debounceTime(300),
                distinctUntilChanged()
            ),
            this.selectedUserOptions$
        ]).pipe(
            tap(() => this.isLoading.next(true)),
            switchMap(([username, selectedUsers]) =>
                username ? this.mapFilteredUserOptions$(username, selectedUsers) : this.mapAllUserOptions$(selectedUsers)
            )
        );
    }

    public displayFn(user: UserPaginated): string {
        return user.username;
    }

    public onOptionSelected(option: UserAutocompleteSelectOption) {
        if (option.disabled) {
            this.userInput.nativeElement.value = '';
            this.control.reset('');
            return;
        }

        const options = this.selectedUserOptionsSubject.getValue();
        options.push(option);

        this.selectedUserOptionsSubject.next(options);

        this.selectedUsers.emit(options.map(option => option.identityId));

        this.userInput.nativeElement.value = '';
        this.control.reset('');
    }

    public onInputKeyEnter(event: Event) {
        event.preventDefault();
    }

    public removeUser(user: UserAutocompleteSelectOption): void {
        this.deselectedUser.emit(user.identityId);
    }

    public removeSelectedInFieldUser(index: number): void {
        const users = this.selectedUserOptionsSubject.getValue();

        users.splice(index, 1);

        this.selectedUserOptionsSubject.next(users);
        this.selectedUsers.emit(users.map(user => user.identityId));
    }

    private mapFilteredUserOptions$(
        username: string,
        selectedUsers: UserAutocompleteSelectOption[]
    ): Observable<UserAutocompleteSelectOption[]> {
        return this.filteredFetchOptionsFn(username).pipe(
            map(filteredUsers => this.createUserOptions(filteredUsers, selectedUsers)),
            finalize(() => this.isLoading.next(false))
        );
    }

    private mapAllUserOptions$(selectedUsers: UserAutocompleteSelectOption[]): Observable<UserAutocompleteSelectOption[]> {
        return this.fetchOptionsFn().pipe(
            map(filteredUsers => this.createUserOptions(filteredUsers, selectedUsers)),
            finalize(() => this.isLoading.next(false))
        );
    }

    private createUserOptions(filteredUsers: UserPaginated[], selectedUsers: UserPaginated[]): UserAutocompleteSelectOption[] {
        if (!filteredUsers.length) {
            return [{
                identityId: '',
                disabled: true,
                noMatch: true
            } as UserAutocompleteSelectOption];
        }

        const lookupUsers = [...selectedUsers, ...this.preSelectedUsers];
        return filteredUsers.map(user => {
            let disabled = false;
            const foundIndexInSelectedUsers = lookupUsers.findIndex(selectedUser => selectedUser.identityId === user.identityId);

            if (foundIndexInSelectedUsers > -1) {
                lookupUsers.splice(foundIndexInSelectedUsers, 1);
                disabled = true;
            }

            const userOption: UserAutocompleteSelectOption = {
                ...user,
                disabled,
                noMatch: false
            };

            return userOption;
        });
    }
}
