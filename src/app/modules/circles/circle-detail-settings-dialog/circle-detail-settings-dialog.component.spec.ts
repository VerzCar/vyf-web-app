import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleDetailSettingsDialogComponent } from './circle-detail-settings-dialog.component';

describe('CircleDetailSettingsDialogComponent', () => {
  let component: CircleDetailSettingsDialogComponent;
  let fixture: ComponentFixture<CircleDetailSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleDetailSettingsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleDetailSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
