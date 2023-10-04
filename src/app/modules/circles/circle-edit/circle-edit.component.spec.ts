import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleEditComponent } from './circle-edit.component';

describe('CircleEditComponent', () => {
  let component: CircleEditComponent;
  let fixture: ComponentFixture<CircleEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CircleEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
