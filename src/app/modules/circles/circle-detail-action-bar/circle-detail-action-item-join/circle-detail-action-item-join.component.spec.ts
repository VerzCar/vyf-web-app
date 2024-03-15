import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleDetailActionItemJoinComponent } from './circle-detail-action-item-join.component';

describe('CircleDetailActionItemJoinComponent', () => {
  let component: CircleDetailActionItemJoinComponent;
  let fixture: ComponentFixture<CircleDetailActionItemJoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CircleDetailActionItemJoinComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleDetailActionItemJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
