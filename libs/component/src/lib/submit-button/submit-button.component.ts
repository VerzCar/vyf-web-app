import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RxIf } from '@rx-angular/template/if';
import { RxPush } from '@rx-angular/template/push';
import { BehaviorSubject, distinctUntilChanged, map, Observable, of, switchAll, tap } from 'rxjs';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';

@Component({
    selector: 'vyf-submit-button',
    standalone: true,
    imports: [CommonModule, FeatherIconModule, MatButtonModule, RxIf, RxPush],
    templateUrl: './submit-button.component.html',
    styleUrls: ['./submit-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubmitButtonComponent {
    public disabled$!: Observable<boolean>;
    public submittedSuccessfully$: Observable<boolean>;

    private _formIsValid$: Observable<boolean>;
    private readonly _formIsValidSubject = new BehaviorSubject<Observable<boolean>>(of(true));
    private readonly _successSubject = new BehaviorSubject<Observable<boolean>>(of(false));

    private readonly cd = inject(ChangeDetectorRef);

    protected constructor() {
        this._formIsValid$ = this._formIsValidSubject.asObservable().pipe(switchAll(), distinctUntilChanged());
        this.submittedSuccessfully$ = this._successSubject.asObservable().pipe(switchAll(), distinctUntilChanged());
        this.disabled$ = this._formIsValid$.pipe(
            map(isValid => !isValid),
            tap(() => this.cd.markForCheck()),
            distinctUntilChanged()
        );
    }

    @Input({ required: true })
    public set formIsValid$(value: Observable<boolean>) {
        this._formIsValidSubject.next(value);
    }

    @Input({ required: true })
    public set submitSuccess$(value: Observable<boolean>) {
        this._successSubject.next(value);
    }
}
