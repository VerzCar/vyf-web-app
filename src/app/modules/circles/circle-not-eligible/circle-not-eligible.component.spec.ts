import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleNotEligibleComponent } from './circle-not-eligible.component';

describe('CircleNotEligibleComponent', () => {
  let component: CircleNotEligibleComponent;
  let fixture: ComponentFixture<CircleNotEligibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CircleNotEligibleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleNotEligibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
