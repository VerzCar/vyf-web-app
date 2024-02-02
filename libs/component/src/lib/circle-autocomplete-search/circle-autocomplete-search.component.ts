import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RxIf } from '@rx-angular/template/if';
import { CirclePaginated } from '@vyf/vote-circle-service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';

@Component({
    selector: 'vyf-circle-autocomplete-search',
    standalone: true,
    imports: [FeatherIconModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, RxIf, ReactiveFormsModule],
    templateUrl: './circle-autocomplete-search.component.html',
    styleUrl: './circle-autocomplete-search.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleAutocompleteSearchComponent {
    @Input({ required: true }) public filteredFetchOptionsFn!: (searchTerm: string) => Observable<CirclePaginated[]>;
    @Output() public foundCircles = new EventEmitter<CirclePaginated[]>();

    public readonly control = new FormControl<string>('');
    public readonly isLoading = new BehaviorSubject<boolean>(false);

    constructor() {
        this.control.valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => this.isLoading.next(true)),
            switchMap(name =>
                name?.length ? this.mapFilteredCircles$(name) : of([])
            ),
            tap(circles => this.foundCircles.emit(circles as CirclePaginated[])),
            tap(() => this.isLoading.next(false)),
            takeUntilDestroyed()
        ).subscribe();
    }

    public onInputKeyEnter(event: Event) {
        event.preventDefault();
    }

    private mapFilteredCircles$(
        username: string
    ): Observable<CirclePaginated[]> {
        return this.filteredFetchOptionsFn(username);
    }
}
