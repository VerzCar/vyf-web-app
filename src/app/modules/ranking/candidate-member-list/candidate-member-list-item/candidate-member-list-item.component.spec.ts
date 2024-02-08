import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateMemberListItemComponent } from './candidate-member-list-item.component';

describe('CandidateMemberListItemComponent', () => {
    let component: CandidateMemberListItemComponent;
    let fixture: ComponentFixture<CandidateMemberListItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CandidateMemberListItemComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CandidateMemberListItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
