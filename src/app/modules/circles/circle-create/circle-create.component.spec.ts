import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleCreateComponent } from './circle-create.component';

describe('CircleCreateComponent', () => {
    let component: CircleCreateComponent;
    let fixture: ComponentFixture<CircleCreateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CircleCreateComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CircleCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
