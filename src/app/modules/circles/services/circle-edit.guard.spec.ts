import { TestBed } from '@angular/core/testing';

import { CircleEditGuard } from './circle-edit.guard';

describe('CircleEditGuard', () => {
  let guard: CircleEditGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CircleEditGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
