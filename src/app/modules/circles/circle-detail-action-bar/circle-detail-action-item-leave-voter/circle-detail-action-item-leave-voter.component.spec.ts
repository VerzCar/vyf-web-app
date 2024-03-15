import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleDetailActionItemLeaveVoterComponent } from './circle-detail-action-item-leave-voter.component';

describe('CircleDetailActionItemLeaveVoterComponent', () => {
    let component: CircleDetailActionItemLeaveVoterComponent;
    let fixture: ComponentFixture<CircleDetailActionItemLeaveVoterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CircleDetailActionItemLeaveVoterComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(
            CircleDetailActionItemLeaveVoterComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
