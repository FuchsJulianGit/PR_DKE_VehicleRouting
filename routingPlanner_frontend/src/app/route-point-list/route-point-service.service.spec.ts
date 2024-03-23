import { TestBed } from '@angular/core/testing';
import { RoutePointService } from './route-point-service.service';

describe('RoutePointServiceService', () => {
  let service: RoutePointService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoutePointService]
    });
    service = TestBed.inject(RoutePointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
