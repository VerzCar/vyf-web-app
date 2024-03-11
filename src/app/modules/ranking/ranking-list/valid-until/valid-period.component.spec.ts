import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidPeriodComponent } from './valid-period.component';

describe('ValidUntilComponent', () => {
  let component: ValidPeriodComponent;
  let fixture: ComponentFixture<ValidPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidPeriodComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
