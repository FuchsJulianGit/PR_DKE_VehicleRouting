import { TestBed } from '@angular/core/testing';
import { RouteService } from './route.service';

describe('RouteService', () => {
  let service: RouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouteService]
    });
    service = TestBed.inject(RouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
