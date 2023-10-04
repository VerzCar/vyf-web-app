import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleMembersComponent } from './circle-members.component';

describe('CircleMembersComponent', () => {
  let component: CircleMembersComponent;
  let fixture: ComponentFixture<CircleMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CircleMembersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
