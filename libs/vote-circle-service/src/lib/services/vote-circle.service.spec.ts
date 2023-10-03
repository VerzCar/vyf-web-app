import { TestBed } from '@angular/core/testing';

import { VoteCircleService } from './vote-circle.service';

describe('VoteCircleService', () => {
  let service: VoteCircleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoteCircleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
