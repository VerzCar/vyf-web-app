import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RxIf } from '@rx-angular/template/if';
import { UserPaginated } from '@vyf/user-service';
import { FeatherModule } from 'angular-feather';
import { debounceTime, finalize, Observable, startWith, switchMap, tap } from 'rxjs';

@Component({
    selector: 'vyf-user-autocomplete-search',
    standalone: true,
    imports: [
        FeatherModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        RxIf,
        MatProgressSpinnerModule
    ],
    templateUrl: './user-autocomplete-search.component.html',
    styleUrl: './user-autocomplete-search.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAutocompleteSearchComponent {
    @Input({ required: true }) public filteredFetchOptionsFn!: (searchTerm: string) => Observable<UserPaginated[]>;
    @Input({ required: true }) public fetchOptionsFn!: () => Observable<UserPaginated[]>;
    @Output() public foundUsers = new EventEmitter<UserPaginated[]>();

    public control = new FormControl<string>('');

    public isLoading = false;

    constructor() {
        this.control.valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            tap(() => this.isLoading = true),
            switchMap(username =>
                username ? this.mapFilteredUsers$(username) : this.mapAllUsers$()
            ),
            tap(users => this.foundUsers.emit(users)),
            takeUntilDestroyed()
        ).subscribe();
    }

    public onInputKeyEnter(event: Event) {
        event.preventDefault();
    }

    private mapFilteredUsers$(
        username: string
    ): Observable<UserPaginated[]> {
        return this.filteredFetchOptionsFn(username).pipe(
            finalize(() => this.isLoading = false)
        );
    }

    private mapAllUsers$(): Observable<UserPaginated[]> {
        return this.fetchOptionsFn().pipe(
            finalize(() => this.isLoading = false)
        );
    }
}
