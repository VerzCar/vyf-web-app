import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarCircleInvitationsComponent } from './toolbar-circle-invitations.component';

describe('ToolbarCircleInvitationsComponent', () => {
    let component: ToolbarCircleInvitationsComponent;
    let fixture: ComponentFixture<ToolbarCircleInvitationsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ToolbarCircleInvitationsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ToolbarCircleInvitationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
