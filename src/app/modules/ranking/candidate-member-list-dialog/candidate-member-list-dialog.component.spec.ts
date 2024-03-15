import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateMemberListDialogComponent } from './candidate-member-list-dialog.component';

describe('MemberListRankingDialogComponent', () => {
    let component: CandidateMemberListDialogComponent;
    let fixture: ComponentFixture<CandidateMemberListDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CandidateMemberListDialogComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CandidateMemberListDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
