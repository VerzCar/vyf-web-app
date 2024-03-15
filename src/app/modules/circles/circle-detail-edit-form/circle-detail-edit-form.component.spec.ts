import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleDetailEditFormComponent } from './circle-detail-edit-form.component';

describe('CircleDetailEditFormComponent', () => {
  let component: CircleDetailEditFormComponent;
  let fixture: ComponentFixture<CircleDetailEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleDetailEditFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleDetailEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
