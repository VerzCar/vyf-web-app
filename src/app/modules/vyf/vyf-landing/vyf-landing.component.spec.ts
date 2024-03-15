import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VyfLandingComponent } from './vyf-landing.component';

describe('VyfLandingComponent', () => {
    let component: VyfLandingComponent;
    let fixture: ComponentFixture<VyfLandingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VyfLandingComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(VyfLandingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
