import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CirclesInterestComponent } from './circles-interest.component';

describe('CirclesInterestComponent', () => {
    let component: CirclesInterestComponent;
    let fixture: ComponentFixture<CirclesInterestComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CirclesInterestComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CirclesInterestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
