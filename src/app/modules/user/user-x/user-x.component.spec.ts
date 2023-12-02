import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserXComponent } from './user-x.component';

describe('UserXComponent', () => {
    let component: UserXComponent;
    let fixture: ComponentFixture<UserXComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserXComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(UserXComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
