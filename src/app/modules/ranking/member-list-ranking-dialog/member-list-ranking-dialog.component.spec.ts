import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberListRankingDialogComponent } from './member-list-ranking-dialog.component';

describe('MemberListRankingDialogComponent', () => {
    let component: MemberListRankingDialogComponent;
    let fixture: ComponentFixture<MemberListRankingDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MemberListRankingDialogComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(MemberListRankingDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
