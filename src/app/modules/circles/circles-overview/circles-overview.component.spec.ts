import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CirclesOverviewComponent } from './circles-overview.component';

describe('CirclesOverviewComponent', () => {
  let component: CirclesOverviewComponent;
  let fixture: ComponentFixture<CirclesOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CirclesOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CirclesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
