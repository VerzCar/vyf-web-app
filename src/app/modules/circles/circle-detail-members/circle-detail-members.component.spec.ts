import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleDetailMembersComponent } from './circle-detail-members.component';

describe('CircleDetailMembersComponent', () => {
  let component: CircleDetailMembersComponent;
  let fixture: ComponentFixture<CircleDetailMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CircleDetailMembersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleDetailMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
