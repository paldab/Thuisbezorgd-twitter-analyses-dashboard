import { TestBed } from '@angular/core/testing';

import { AggNumsService } from './agg-nums.service';

describe('AggNumsService', () => {
  let service: AggNumsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AggNumsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
