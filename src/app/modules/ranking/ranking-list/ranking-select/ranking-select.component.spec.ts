import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RankingSelectComponent } from './ranking-select.component';

describe('RankingSelectComponent', () => {
  let component: RankingSelectComponent;
  let fixture: ComponentFixture<RankingSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RankingSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RankingSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
