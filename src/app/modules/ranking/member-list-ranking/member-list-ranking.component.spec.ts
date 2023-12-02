import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberListRankingComponent } from './member-list-ranking.component';

describe('MemberListRankingComponent', () => {
    let component: MemberListRankingComponent;
    let fixture: ComponentFixture<MemberListRankingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MemberListRankingComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(MemberListRankingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
