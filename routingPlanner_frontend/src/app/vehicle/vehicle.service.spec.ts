import { TestBed } from '@angular/core/testing';
import { VehicleService } from './vehicle.service'; // Assuming the service file is named vehicle.service.ts

describe('VehicleService', () => {
  let service: VehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VehicleService]
    });
    service = TestBed.inject(VehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
