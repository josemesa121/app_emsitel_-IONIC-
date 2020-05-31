import { TestBed } from '@angular/core/testing';

import { EmsivozServiceService } from './emsivoz-service.service';

describe('EmsivozServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmsivozServiceService = TestBed.get(EmsivozServiceService);
    expect(service).toBeTruthy();
  });
});
