import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleCreateDialogComponent } from './circle-create-dialog.component';

describe('CircleCreateDialogComponent', () => {
  let component: CircleCreateDialogComponent;
  let fixture: ComponentFixture<CircleCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleCreateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
