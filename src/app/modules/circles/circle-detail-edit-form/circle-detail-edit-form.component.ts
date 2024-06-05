import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngxs/store';
import { DateTime } from '@vyf/base';
import { Circle, CircleUpdateRequest } from '@vyf/vote-circle-service';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import { updateCircleForm } from '../services/factory/forms.factory';
import { CirclesAction } from '../state/actions/circles.action';
import { CirclesSelectors } from '../state/circles.selectors';

@Component({
    selector: 'app-circle-detail-edit-form',
    standalone: true,
    imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        NgOptimizedImage,
        DatePipe,
        MatDatepicker,
        MatDatepickerModule
    ],
    templateUrl: './circle-detail-edit-form.component.html',
    styleUrl: './circle-detail-edit-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailEditFormComponent implements OnInit {
    @Input({ required: true }) public circle!: Circle;
    public readonly form = updateCircleForm();
    public readonly minValidUntilDate = DateTime.Day.next();
    public readonly maxValidUntilDate = new Date(DateTime.Day.today().setFullYear(DateTime.Day.today().getFullYear() + 5));
    public readonly minValidFromDate = DateTime.Day.today();
    public readonly maxValidFromDate = this.maxValidUntilDate;
    public canEditCircle = false;

    private readonly store = inject(Store);

    constructor() {
        this.subscribeToNameChanges();
        this.subscribeToDescriptionChanges();
        this.subscribeToValidFromChanges();
        this.subscribeToValidUntilChanges();
    }

    public ngOnInit(): void {
        this.form.patchValue(this.circle, { emitEvent: false });
        this.canEditCircle = this.store.selectSnapshot(CirclesSelectors.canEditCircle);
    }

    private subscribeToNameChanges() {
        this.form.controls.name.valueChanges.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            filter(() => this.form.controls.name.valid),
            tap(name => {
                const circleUpdateRequest: CircleUpdateRequest = {
                    name: name.trimEnd(),
                    validUntil: this.form.controls.validUntil.value
                };
                return this.store.dispatch(new CirclesAction.UpdateCircle(this.circle.id, circleUpdateRequest));
            }),
            takeUntilDestroyed()
        ).subscribe();
    }

    private subscribeToDescriptionChanges() {
        this.form.controls.description.valueChanges.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            filter(() => this.form.controls.description.valid),
            tap(description => {
                const circleUpdateRequest: CircleUpdateRequest = {
                    description: description?.trimEnd() || '',
                    validUntil: this.form.controls.validUntil.value
                };
                return this.store.dispatch(new CirclesAction.UpdateCircle(this.circle.id, circleUpdateRequest));
            }),
            takeUntilDestroyed()
        ).subscribe();
    }

    // TODO: improve range date selector
    private subscribeToValidFromChanges() {
        this.form.controls.validFrom.valueChanges.pipe(
            debounceTime(600),
            distinctUntilChanged(),
            filter(() => this.form.valid),
            tap(date => {
                const circleUpdateRequest: CircleUpdateRequest = {
                    validFrom: date,
                    validUntil: this.form.controls.validUntil.value
                };
                return this.store.dispatch(new CirclesAction.UpdateCircle(this.circle.id, circleUpdateRequest));
            }),
            takeUntilDestroyed()
        ).subscribe();
    }

// TODO: improve range date selector
    private subscribeToValidUntilChanges() {
        this.form.controls.validUntil.valueChanges.pipe(
            debounceTime(600),
            distinctUntilChanged(),
            filter(() => this.form.valid),
            tap(date => {
                const circleUpdateRequest: CircleUpdateRequest = {
                    validUntil: date
                };
                return this.store.dispatch(new CirclesAction.UpdateCircle(this.circle.id, circleUpdateRequest));
            }),
            takeUntilDestroyed()
        ).subscribe();
    }
}
