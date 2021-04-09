import { TestBed } from '@angular/core/testing';

import { WordcloudService } from './wordcloud.service';

describe('WordcloudService', () => {
  let service: WordcloudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordcloudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
