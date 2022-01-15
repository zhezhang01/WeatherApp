import { TestBed } from '@angular/core/testing';

import { FavserviceService } from './favservice.service';

describe('FavserviceService', () => {
  let service: FavserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
