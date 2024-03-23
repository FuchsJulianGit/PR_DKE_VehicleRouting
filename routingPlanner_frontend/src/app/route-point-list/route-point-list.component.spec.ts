import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoutePointListComponent } from './route-point-list.component';
import { RoutePointService } from './route-point-service.service';
import { of } from 'rxjs';

describe('RoutePointListComponent', () => {
  let component: RoutePointListComponent;
  let fixture: ComponentFixture<RoutePointListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoutePointListComponent],
      imports: [],
      providers: [RoutePointService]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoutePointListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
