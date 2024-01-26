import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateMemberListComponent } from './candidate-member-list.component';

describe('MemberListRankingComponent', () => {
    let component: CandidateMemberListComponent;
    let fixture: ComponentFixture<CandidateMemberListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CandidateMemberListComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CandidateMemberListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
