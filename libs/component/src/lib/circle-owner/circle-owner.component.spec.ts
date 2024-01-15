import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleOwnerComponent } from './circle-owner.component';

describe('CircleMemberComponent', () => {
    let component: CircleOwnerComponent;
    let fixture: ComponentFixture<CircleOwnerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CircleOwnerComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CircleOwnerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
