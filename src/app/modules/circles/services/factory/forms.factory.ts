import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateTime } from '@vyf/base';
import { CircleCreateForm } from '../../models';
import { CircleUpdateForm } from '../../models/circle-update-form.model';
import { dateAfter } from '../validators/date-after.validator';
import { validFromBeforeValidUntilValidator } from '../validators/valid-from-before-valid-until.validator';

export const createCircleForm = (): FormGroup<CircleCreateForm> => new FormGroup<CircleCreateForm>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(40)] }),
    description: new FormControl(null, [Validators.maxLength(1200)]),
    validFrom: new FormControl(null, [dateAfter(DateTime.Day.today())]),
    validUntil: new FormControl(null, [dateAfter(DateTime.Day.today())]),
    private: new FormControl(false, { nonNullable: true }),
    voters: new FormControl([], { nonNullable: true }),
    candidates: new FormControl([], { nonNullable: true })
}, [validFromBeforeValidUntilValidator()]);

export const updateCircleForm = (): FormGroup<CircleUpdateForm> => new FormGroup<CircleUpdateForm>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(40)] }),
    description: new FormControl(null, [Validators.maxLength(1200)]),
    validFrom: new FormControl(null),
    validUntil: new FormControl(null),
    private: new FormControl(false, { nonNullable: true })
}, []);
