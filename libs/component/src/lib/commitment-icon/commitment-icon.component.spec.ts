import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommitmentIconComponent } from './commitment-icon.component';

describe('CommitmentIconComponent', () => {
  let component: CommitmentIconComponent;
  let fixture: ComponentFixture<CommitmentIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitmentIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommitmentIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
