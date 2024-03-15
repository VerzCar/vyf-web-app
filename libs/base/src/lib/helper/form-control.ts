import { AbstractControl, FormControlStatus } from '@angular/forms';
import { debounceTime, map, startWith } from 'rxjs';

export interface PipeOptions {
    debounceTime: number;
}

const defaultPipeOptions: PipeOptions = {
    debounceTime: 250
};

export const statusChangesToInvalid = (ctrl: AbstractControl, opts: PipeOptions = defaultPipeOptions) =>
    ctrl.statusChanges.pipe(
        debounceTime(opts.debounceTime),
        startWith(ctrl.status),
        map(() => ctrl.status === 'INVALID' || ctrl.pristine));

export const statusChangesToPending = (ctrl: AbstractControl, opts: PipeOptions = defaultPipeOptions) =>
    ctrl.statusChanges.pipe(
        debounceTime(opts.debounceTime),
        startWith(ctrl.status),
        map(() => ctrl.status === 'PENDING'));

export const statusChangesToInvalidOrPending = (ctrl: AbstractControl, opts: PipeOptions = defaultPipeOptions) =>
    ctrl.statusChanges.pipe(
        debounceTime(opts.debounceTime),
        startWith(ctrl.status),
        map(() => ctrl.status === 'INVALID' || ctrl.status === 'PENDING' || ctrl.pristine)
    );

export const statusChangesToDisabled = (ctrl: AbstractControl) =>
    ctrl.statusChanges.pipe(
        startWith(ctrl.status),
        map((v: FormControlStatus) => v === 'DISABLED'));

export const statusChangesToEnabled = (ctrl: AbstractControl) =>
    statusChangesToDisabled(ctrl).pipe(map(v => !v));

export const statusChangesToValid = (ctrl: AbstractControl) =>
    statusChangesToInvalid(ctrl).pipe(map(v => !v));

export const statusChangesToValidAndNotPending = (ctrl: AbstractControl) =>
    statusChangesToInvalidOrPending(ctrl).pipe(map(v => !v));

export const addErrorToControl = (errorToAdd: string, control: AbstractControl): void => {
    const errors = control.errors;
    control.setErrors({ [errorToAdd]: true, ...errors });
};

export const removeErrorFromControl = (errorToRemove: string, control: AbstractControl): void => {
    const errors = { ...control.errors };
    delete errors[errorToRemove];
    const emptyErrors = !Object.keys(errors).length;
    control.setErrors(emptyErrors ? null : errors);
};

export const addErrorToControls = (error: string, controls: AbstractControl[]) => controls.forEach((c) => addErrorToControl(error, c));

export const removeErrorFromControls = (error: string, controls: AbstractControl[]) => controls.forEach((c) => removeErrorFromControl(error, c));
