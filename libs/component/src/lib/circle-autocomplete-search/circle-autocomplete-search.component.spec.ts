import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleAutocompleteSearchComponent } from './circle-autocomplete-search.component';

describe('CircleAutocompleteSearchComponent', () => {
  let component: CircleAutocompleteSearchComponent;
  let fixture: ComponentFixture<CircleAutocompleteSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleAutocompleteSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleAutocompleteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
