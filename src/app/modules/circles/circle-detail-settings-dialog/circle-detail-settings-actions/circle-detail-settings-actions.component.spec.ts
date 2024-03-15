import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleDetailSettingsActionsComponent } from './circle-detail-settings-actions.component';

describe('CircleDetailSettingsActionsComponent', () => {
  let component: CircleDetailSettingsActionsComponent;
  let fixture: ComponentFixture<CircleDetailSettingsActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleDetailSettingsActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleDetailSettingsActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
