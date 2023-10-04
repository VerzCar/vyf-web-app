import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleDetailComponent } from './circle-detail.component';

describe('CircleDetailComponent', () => {
  let component: CircleDetailComponent;
  let fixture: ComponentFixture<CircleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CircleDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
