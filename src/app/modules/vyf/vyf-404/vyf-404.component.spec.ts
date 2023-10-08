import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vyf404Component } from './vyf-404.component';

describe('Vyf404Component', () => {
  let component: Vyf404Component;
  let fixture: ComponentFixture<Vyf404Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Vyf404Component],
    }).compileComponents();

    fixture = TestBed.createComponent(Vyf404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
