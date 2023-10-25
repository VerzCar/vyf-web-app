import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { RxFor } from '@rx-angular/template/for';
import { User } from '@vyf/user-service';
import { map, Observable, startWith } from 'rxjs';

interface UserAutocompleteComponentOption {
  user$: Observable<User>;
}

@Component({
  selector: 'vyf-user-autocomplete',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, RxFor],
  templateUrl: './user-autocomplete.component.html',
  styleUrls: ['./user-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAutocompleteComponent {
  public control = new FormControl<string>('');

  private _options: UserAutocompleteComponentOption[] = [];

  constructor() {
    this.filteredStates = this.control.valueChanges.pipe(
        startWith(''),
        map(state => (state ? this.filterInput(state) : this.options.slice(0, 100))),
    );
  }

  @Input()
  public set options(options: UserAutocompleteComponentOption[]) {
    this._options = options ?? [];
  }

  public get options() {
    return this._options;
  }

  private filterInput(value: string): State[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(state => state.name.toLowerCase().includes(filterValue));
  }
}
