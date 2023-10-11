import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateTime } from '@vyf/base';
import { CircleCreateForm } from '../../models';
import { dateAfter } from '../validators/date-after.validator';

export const createCircleCreateForm = (): FormGroup<CircleCreateForm> => {
    return new FormGroup<CircleCreateForm>({
        name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(40)] }),
        description: new FormControl(null, [Validators.maxLength(1200)]),
        imgSrc: new FormControl(null),
        validUntil: new FormControl(null, [dateAfter(DateTime.Day.today())]),
        private: new FormControl(false, { nonNullable: true }),
        voters: new FormControl([], { nonNullable: true })
    });
};
