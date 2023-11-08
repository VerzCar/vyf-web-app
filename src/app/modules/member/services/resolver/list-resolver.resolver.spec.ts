import { TestBed } from '@angular/core/testing';

import { ListResolverResolver } from './list-resolver.resolver';

describe('ListResolverResolver', () => {
  let resolver: ListResolverResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ListResolverResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
