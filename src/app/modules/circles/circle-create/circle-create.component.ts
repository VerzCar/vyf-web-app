import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface CircleCreateForm {
  name: FormControl<string>;
  description: FormControl<string | null>;
  imgSrc: FormControl<string | null>;
  validUntil: FormControl<Date | null>;
  private: FormControl<boolean>;
  voters: FormControl<string[]>;
}

@Component({
  selector: 'app-circle-create',
  templateUrl: './circle-create.component.html',
  styleUrls: ['./circle-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleCreateComponent {
  public readonly form = new FormGroup<CircleCreateForm>({
	name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(40)] }),
	description: new FormControl(null, [Validators.maxLength(1200)]),
	imgSrc: new FormControl(null),
	validUntil: new FormControl(null),
	private: new FormControl(false, { nonNullable: true }),
	voters: new FormControl([], { nonNullable: true })
  });

  public onSubmit() {
	console.log('submitted', this.form.getRawValue());
  }
}
