import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidUntilComponent } from './valid-until.component';

describe('ValidUntilComponent', () => {
  let component: ValidUntilComponent;
  let fixture: ComponentFixture<ValidUntilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidUntilComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidUntilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
