import { FormControl } from '@angular/forms';

export interface CircleUpdateForm {
    name: FormControl<string>;
    description: FormControl<string | null>;
    validFrom: FormControl<Date | null>;
    validUntil: FormControl<Date | null>;
    private: FormControl<boolean>;
}
