import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAutocompleteSelectComponent } from './user-autocomplete-select.component';

describe('UserAutocompleteComponent', () => {
  let component: UserAutocompleteSelectComponent;
  let fixture: ComponentFixture<UserAutocompleteSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAutocompleteSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAutocompleteSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
