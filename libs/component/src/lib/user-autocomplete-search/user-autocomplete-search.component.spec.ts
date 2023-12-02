import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAutocompleteSearchComponent } from './user-autocomplete-search.component';

describe('UserAutocompleteSearchComponent', () => {
    let component: UserAutocompleteSearchComponent;
    let fixture: ComponentFixture<UserAutocompleteSearchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserAutocompleteSearchComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(UserAutocompleteSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
