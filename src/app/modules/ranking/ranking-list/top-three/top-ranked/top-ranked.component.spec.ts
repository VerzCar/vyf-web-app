import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopRankedComponent } from './top-ranked.component';

describe('TopRankedComponent', () => {
  let component: TopRankedComponent;
  let fixture: ComponentFixture<TopRankedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopRankedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopRankedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
