import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleAutocompleteSelectComponent } from './circle-autocomplete-select.component';

describe('CircleAutocompleteSelectComponent', () => {
    let component: CircleAutocompleteSelectComponent;
    let fixture: ComponentFixture<CircleAutocompleteSelectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CircleAutocompleteSelectComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CircleAutocompleteSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
