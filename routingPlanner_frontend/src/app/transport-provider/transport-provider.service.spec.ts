import { TestBed } from '@angular/core/testing';
import { TransportProviderService } from './transport-provider.service'; 

describe('TransportProviderService', () => {
  let service: TransportProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransportProviderService]
    });
    service = TestBed.inject(TransportProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
