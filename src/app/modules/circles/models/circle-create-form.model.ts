import { FormControl } from '@angular/forms';

export interface CircleCreateForm {
    name: FormControl<string>;
    description: FormControl<string | null>;
    validUntil: FormControl<Date | null>;
    private: FormControl<boolean>;
    voters: FormControl<string[]>;
}
