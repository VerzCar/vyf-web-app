import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { addErrorToControls, DateTime, isDefined, removeErrorFromControls } from '@vyf/base';
import { CircleCreateForm } from '../../models';

export const validFromBeforeValidUntilValidator = (): ValidatorFn => (circle: AbstractControl): ValidationErrors | null => {
    const validFrom = (circle as FormGroup<CircleCreateForm>).controls.validFrom.value;
    const validUntil = (circle as FormGroup<CircleCreateForm>).controls.validUntil.value;

    if (!isDefined(validUntil) || !isDefined(validFrom)) {
        removeErrorFromControls(
            'validFromAfterValidUntil',
            [
                (circle as FormGroup<CircleCreateForm>).controls.validFrom,
                (circle as FormGroup<CircleCreateForm>).controls.validUntil
            ]);
        return null;
    }

    const validFromDate = new Date(validFrom);
    const validUntilDate = new Date(validUntil);

    if (DateTime.Day.isAfter(validUntilDate, validFromDate)) {
        removeErrorFromControls(
            'validFromAfterValidUntil',
            [
                (circle as FormGroup<CircleCreateForm>).controls.validFrom,
                (circle as FormGroup<CircleCreateForm>).controls.validUntil
            ]);
        return null;
    }

    addErrorToControls(
        'validFromAfterValidUntil',
        [
            (circle as FormGroup<CircleCreateForm>).controls.validFrom,
            (circle as FormGroup<CircleCreateForm>).controls.validUntil
        ]);

    return { 'validFromAfterValidUntil': true };
};
