import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleDetailActionBarComponent } from './circle-detail-action-bar.component';

describe('CircleDetailActionBarComponent', () => {
  let component: CircleDetailActionBarComponent;
  let fixture: ComponentFixture<CircleDetailActionBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CircleDetailActionBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleDetailActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
