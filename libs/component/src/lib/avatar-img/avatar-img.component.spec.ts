import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarImgComponent } from './avatar-img.component';

describe('AvatarImgComponent', () => {
    let component: AvatarImgComponent;
    let fixture: ComponentFixture<AvatarImgComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AvatarImgComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AvatarImgComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
