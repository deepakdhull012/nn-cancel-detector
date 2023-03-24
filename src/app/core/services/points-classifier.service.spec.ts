import { TestBed } from '@angular/core/testing';

import { PointsClassifierService } from './points-classifier.service';

describe('PointsClassifierService', () => {
  let service: PointsClassifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointsClassifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
