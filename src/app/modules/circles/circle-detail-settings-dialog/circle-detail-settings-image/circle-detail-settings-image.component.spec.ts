import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleDetailSettingsImageComponent } from './circle-detail-settings-image.component';

describe('CircleDetailSettingsImageComponent', () => {
  let component: CircleDetailSettingsImageComponent;
  let fixture: ComponentFixture<CircleDetailSettingsImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleDetailSettingsImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleDetailSettingsImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
