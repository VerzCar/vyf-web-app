import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleDetailSettingsMembersComponent } from './circle-detail-settings-members.component';

describe('CircleDetailSettingsMembersComponent', () => {
  let component: CircleDetailSettingsMembersComponent;
  let fixture: ComponentFixture<CircleDetailSettingsMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleDetailSettingsMembersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleDetailSettingsMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
