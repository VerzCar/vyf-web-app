import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateTime } from '@vyf/base';

export const dateAfter = (startDate: Date): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
    if (DateTime.Day.isSameOrAfter(control.value, startDate)) {
        return null;
    }
    return { dateIsNotAfterGivenDate: true };
};

