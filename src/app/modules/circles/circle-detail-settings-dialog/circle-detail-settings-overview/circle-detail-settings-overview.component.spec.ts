import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleDetailSettingsOverviewComponent } from './circle-detail-settings-overview.component';

describe('CircleDetailSettingsOverviewComponent', () => {
  let component: CircleDetailSettingsOverviewComponent;
  let fixture: ComponentFixture<CircleDetailSettingsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleDetailSettingsOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleDetailSettingsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
