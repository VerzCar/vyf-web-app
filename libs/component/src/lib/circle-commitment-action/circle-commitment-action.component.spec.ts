import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleCommitmentActionComponent } from './circle-commitment-action.component';

describe('CircleCommitmentActionComponent', () => {
  let component: CircleCommitmentActionComponent;
  let fixture: ComponentFixture<CircleCommitmentActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleCommitmentActionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleCommitmentActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
