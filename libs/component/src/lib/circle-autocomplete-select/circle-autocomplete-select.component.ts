import { NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { AvatarImgComponent, UserListItemComponent } from '@vyf/component';
import { Circle, CirclePaginated } from '@vyf/vote-circle-service';
import { FeatherModule } from 'angular-feather';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, finalize, map, Observable, of, startWith, switchMap, tap } from 'rxjs';

interface CircleAutocompleteSelectOption extends CirclePaginated {
    disabled: boolean;
    noMatch: boolean;
}

@Component({
    selector: 'vyf-circle-autocomplete-select',
    standalone: true,
    imports: [
        AvatarImgComponent,
        FeatherModule,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatButton,
        MatFormField,
        MatInput,
        MatOption,
        MatPrefix,
        MatProgressSpinner,
        ReactiveFormsModule,
        RxFor,
        RxIf,
        UserListItemComponent,
        NgClass
    ],
    templateUrl: './circle-autocomplete-select.component.html',
    styleUrl: './circle-autocomplete-select.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleAutocompleteSelectComponent implements OnInit {
    @Input({ required: true }) public filteredFetchOptionsFn!: (searchTerm: string) => Observable<CirclePaginated[]>;
    @Input({ transform: (value: Circle | CirclePaginated): CirclePaginated => value as CirclePaginated }) public preSelectedCircle?: CirclePaginated;
    @Output()
    public selectedCircleId = new EventEmitter<number>();

    @ViewChild('circleInput')
    private readonly circleInput!: ElementRef<HTMLInputElement>;

    @ViewChild(MatAutocomplete)
    private readonly matAutocomplete!: MatAutocomplete;

    public readonly control = new FormControl<string>('');
    public readonly isLoading = new BehaviorSubject<boolean>(false);
    public readonly selectedCircleOptions$: Observable<CircleAutocompleteSelectOption[]>;
    public readonly filteredCircleOptions$: Observable<CircleAutocompleteSelectOption[]>;
    public readonly selectedCircleOptionsSubject = new BehaviorSubject<CircleAutocompleteSelectOption[]>([]);

    constructor() {
        this.selectedCircleOptions$ = this.selectedCircleOptionsSubject.asObservable();

        this.filteredCircleOptions$ = combineLatest([
            this.control.valueChanges.pipe(
                startWith(''),
                debounceTime(300),
                distinctUntilChanged()
            ),
            this.selectedCircleOptions$
        ]).pipe(
            tap(() => this.isLoading.next(true)),
            switchMap(([name, selectedCircles]) =>
                name?.length ? this.mapFilteredCircleOptions$(name, selectedCircles) : of([])
            ),
            tap(() => this.isLoading.next(false))
        );
    }

    public ngOnInit(): void {
        if (this.preSelectedCircle) {
            const options = this.createCircleOptions([this.preSelectedCircle], [this.preSelectedCircle]);
            this.control.patchValue(this.preSelectedCircle.name);
            this.selectedCircleOptionsSubject.next(options);
        }
    }

    public displayFn(circle: CirclePaginated): string {
        return circle.name;
    }

    public onOptionSelected(option: CircleAutocompleteSelectOption) {
        if (option.disabled) {
            this.circleInput.nativeElement.value = '';
            this.control.reset('');
            return;
        }

        const options = this.selectedCircleOptionsSubject.getValue();
        options.push(option);

        this.selectedCircleOptionsSubject.next(options);

        this.selectedCircleId.emit(option.id);

        this.circleInput.nativeElement.value = '';
        this.control.reset('');
    }

    public onInputKeyEnter(event: Event) {
        event.preventDefault();
    }

    private mapFilteredCircleOptions$(
        name: string,
        selectedCircles: CircleAutocompleteSelectOption[]
    ): Observable<CircleAutocompleteSelectOption[]> {
        return this.filteredFetchOptionsFn(name).pipe(
            map(filteredCircles => this.createCircleOptions(filteredCircles, selectedCircles)),
            finalize(() => this.isLoading.next(false))
        );
    }

    private createCircleOptions(filteredCircles: CirclePaginated[], selectedCircles: CirclePaginated[]): CircleAutocompleteSelectOption[] {
        if (!filteredCircles.length) {
            return [{
                id: 0,
                disabled: true,
                noMatch: true
            } as CircleAutocompleteSelectOption];
        }

        const lookupCircles = [...selectedCircles];
        return filteredCircles.map(circle => {
            let disabled = false;
            const foundIndexInSelectedCircles = lookupCircles.findIndex(selectedCircle => selectedCircle.id === circle.id);

            if (foundIndexInSelectedCircles > -1) {
                lookupCircles.splice(foundIndexInSelectedCircles, 1);
                disabled = true;
            }

            const circleOption: CircleAutocompleteSelectOption = {
                ...circle,
                disabled,
                noMatch: false
            };

            return circleOption;
        });
    }

}
