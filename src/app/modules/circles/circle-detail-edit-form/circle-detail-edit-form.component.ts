import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngxs/store';
import { Circle, CircleUpdateRequest } from '@vyf/vote-circle-service';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import { createCircleForm } from '../services/factory/forms.factory';
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
        DatePipe
    ],
    templateUrl: './circle-detail-edit-form.component.html',
    styleUrl: './circle-detail-edit-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailEditFormComponent implements OnInit {
    @Input({ required: true }) public circle!: Circle;
    public readonly form = createCircleForm();
    public canEditCircle = false;

    private readonly store = inject(Store);

    constructor() {
        this.subscribeToNameChanges();
        this.subscribeToDescriptionChanges();
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
                    id: this.circle.id,
                    name: name.trimEnd()
                };
                return this.store.dispatch(new CirclesAction.UpdateCircle(circleUpdateRequest));
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
                    id: this.circle.id,
                    description: description?.trimEnd() || ''
                };
                return this.store.dispatch(new CirclesAction.UpdateCircle(circleUpdateRequest));
            }),
            takeUntilDestroyed()
        ).subscribe();
    }
}
