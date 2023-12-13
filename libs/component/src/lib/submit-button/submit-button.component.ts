import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import { BehaviorSubject, distinctUntilChanged, map, Observable, of, switchAll } from 'rxjs';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';

@Component({
    selector: 'vyf-submit-button',
    standalone: true,
    imports: [FeatherIconModule, MatButtonModule, RxIf, RxLet],
    templateUrl: './submit-button.component.html',
    styleUrls: ['./submit-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubmitButtonComponent {
    public disabled$!: Observable<boolean>;

    @Input() public isLoading = false;
    @Input() public label = '';

    private readonly _formIsValid$: Observable<boolean>;
    private readonly _formIsValidSubject = new BehaviorSubject<Observable<boolean>>(of(true));

    constructor() {
        this._formIsValid$ = this._formIsValidSubject.asObservable().pipe(switchAll(), distinctUntilChanged());
        this.disabled$ = this._formIsValid$.pipe(
            distinctUntilChanged(),
            map(isValid => !isValid)
        );
    }

    @Input({ required: true })
    public set formIsValid$(value: Observable<boolean>) {
        this._formIsValidSubject.next(value);
    }
}
