import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CirclesCarouselComponent } from './circles-carousel.component';

describe('CirclesCarouselComponent', () => {
  let component: CirclesCarouselComponent;
  let fixture: ComponentFixture<CirclesCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CirclesCarouselComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CirclesCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
