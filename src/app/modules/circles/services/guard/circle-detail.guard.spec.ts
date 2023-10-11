import { TestBed } from '@angular/core/testing';

import { CircleDetailGuard } from './circle-detail.guard';

describe('CircleDetailGuard', () => {
  let guard: CircleDetailGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CircleDetailGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
