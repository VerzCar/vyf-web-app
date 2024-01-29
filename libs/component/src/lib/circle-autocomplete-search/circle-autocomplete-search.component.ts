import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RxIf } from '@rx-angular/template/if';
import { Circle, CirclePaginated } from '@vyf/vote-circle-service';
import { BehaviorSubject, debounceTime, finalize, Observable, startWith, switchMap, tap } from 'rxjs';
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
    @Input({ required: true }) public fetchOptionsFn!: () => Observable<Circle[]>;
    @Output() public foundCircles = new EventEmitter<CirclePaginated[]>();

    public control = new FormControl<string>('');
    public isLoading = new BehaviorSubject<boolean>(false);

    constructor() {
        this.control.valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            tap(() => this.isLoading.next(true)),
            switchMap(name =>
                name ? this.mapFilteredCircles$(name) : this.mapAllCircles$()
            ),
            tap(circles => this.foundCircles.emit(circles as CirclePaginated[])),
            takeUntilDestroyed()
        ).subscribe();
    }

    public onInputKeyEnter(event: Event) {
        event.preventDefault();
    }

    private mapFilteredCircles$(
        username: string
    ): Observable<CirclePaginated[]> {
        return this.filteredFetchOptionsFn(username).pipe(
            finalize(() => this.isLoading.next(false))
        );
    }

    private mapAllCircles$(): Observable<Circle[]> {
        return this.fetchOptionsFn().pipe(
            finalize(() => this.isLoading.next(false))
        );
    }
}
