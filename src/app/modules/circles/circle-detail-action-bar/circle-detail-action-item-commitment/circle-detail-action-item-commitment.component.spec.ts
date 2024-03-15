import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleDetailActionItemCommitmentComponent } from './circle-detail-action-item-commitment.component';

describe('CircleDetailActionItemCommitmentComponent', () => {
    let component: CircleDetailActionItemCommitmentComponent;
    let fixture: ComponentFixture<CircleDetailActionItemCommitmentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CircleDetailActionItemCommitmentComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(
            CircleDetailActionItemCommitmentComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
