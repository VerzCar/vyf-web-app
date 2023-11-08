import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberListCircleComponent } from './member-list-circle.component';

describe('MemberListCircleComponent', () => {
  let component: MemberListCircleComponent;
  let fixture: ComponentFixture<MemberListCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MemberListCircleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberListCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
