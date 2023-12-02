import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleMemberComponent } from './circle-member.component';

describe('CircleMemberComponent', () => {
    let component: CircleMemberComponent;
    let fixture: ComponentFixture<CircleMemberComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CircleMemberComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CircleMemberComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
