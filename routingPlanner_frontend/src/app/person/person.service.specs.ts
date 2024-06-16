import { TestBed } from '@angular/core/testing';
import { PersonService } from './person.service'; // Assuming the service file is named person.service.ts

describe('PersonService', () => {
  let service: PersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersonService]
    });
    service = TestBed.inject(PersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
