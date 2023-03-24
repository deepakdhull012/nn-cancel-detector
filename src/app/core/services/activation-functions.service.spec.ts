import { TestBed } from '@angular/core/testing';

import { ActivationFunctionsService } from './activation-functions.service';

describe('ActivationFunctionsService', () => {
  let service: ActivationFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivationFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
