import { Component, OnInit, ElementRef } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { NgModel, NgForm, FormsModule } from '@angular/forms';
import { MapModule } from '../map/map.module';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { map } from 'leaflet';
import { publishFacade } from '@angular/compiler';
//import { vehicleService } from '../services/vehicle.service';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [MapModule, NgFor, NgIf, FormsModule],
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.scss'
})
export class PlannerComponent {
  vehicles: any[] = [
    { Id: 1, CompanyName: 'Speedy Transport', VehicleDescription: 'Thunderbolt 5000', coordinates: { x: 47.6097, y: 13.0419 }, canTransportWheelchairs: true, seatingPlaces: 5 },
    { Id: 2, CompanyName: 'Starlight Rides', VehicleDescription: 'Celestial Cruiser', coordinates: { x: 48.2082, y: 16.3719 }, canTransportWheelchairs: false, seatingPlaces: 4 },
    { Id: 3, CompanyName: 'ZoomZoom Logistics', VehicleDescription: 'Flashmobile XL', coordinates: { x: 47.316917, y: 15.421834 }, canTransportWheelchairs: true, seatingPlaces: 6 },
    { Id: 4, CompanyName: 'Galactic Motors', VehicleDescription: 'AstroVan', coordinates: { x: 47.207603, y: 15.724283 }, canTransportWheelchairs: false, seatingPlaces: 8 },
    { Id: 5, CompanyName: 'Phoenix Transports', VehicleDescription: 'Firebird Express', coordinates: { x: 47.5316, y: 14.6625 }, canTransportWheelchairs: true, seatingPlaces: 5 },
    { Id: 6, CompanyName: 'Phoenix Transports', VehicleDescription: 'Firebird Easy', coordinates: { x: 47.3316, y: 14.4625 }, canTransportWheelchairs: false, seatingPlaces: 8 },
    { Id: 7, CompanyName: 'Speedy Transport', VehicleDescription: 'Thunderbolt 5000', coordinates: { x: 47.6097, y: 13.0419 }, canTransportWheelchairs: true, seatingPlaces: 5 },
    { Id: 8, CompanyName: 'Starlight Rides', VehicleDescription: 'Celestial Cruiser', coordinates: { x: 48.2082, y: 16.3719 }, canTransportWheelchairs: false, seatingPlaces: 4 },
    { Id: 9, CompanyName: 'ZoomZoom Logistics', VehicleDescription: 'Flashmobile XL', coordinates: { x: 47.316917, y: 15.421834 }, canTransportWheelchairs: true, seatingPlaces: 6 },
    { Id: 10, CompanyName: 'Galactic Motors', VehicleDescription: 'AstroVan', coordinates: { x: 47.207603, y: 15.724283 }, canTransportWheelchairs: false, seatingPlaces: 8 },
    { Id: 11, CompanyName: 'Phoenix Transports', VehicleDescription: 'Firebird Express', coordinates: { x: 47.5316, y: 14.6625 }, canTransportWheelchairs: true, seatingPlaces: 5 },
    { Id: 12, CompanyName: 'Phoenix Transports', VehicleDescription: 'Firebird Easy', coordinates: { x: 47.3316, y: 14.4625 }, canTransportWheelchairs: false, seatingPlaces: 8 }

  ];

  
  people: any[] = [
    { id: 1, name: 'John Doe', startCoordinate: { x: 47.6095, y: 13.0416 }, endCoordinate: { x: 47.6098, y: 13.0422 }, company: 'Speedy Transport' },
    { id: 2, name: 'Jane Smith', startCoordinate: { x: 47.6099, y: 13.0413 }, endCoordinate: { x: 47.6096, y: 13.0418 }, company: 'Speedy Transport' },
    { id: 3, name: 'Alice Johnson', startCoordinate: { x: 47.6094, y: 13.0418 }, endCoordinate: { x: 47.6097, y: 13.0415 }, company: 'Speedy Transport' },
    { id: 4, name: 'Bob Brown', startCoordinate: { x: 48.2080, y: 16.3717 }, endCoordinate: { x: 48.2083, y: 16.3723 }, company: 'Starlight Rides' },
    { id: 5, name: 'Eve White', startCoordinate: { x: 48.2085, y: 16.3714 }, endCoordinate: { x: 48.2082, y: 16.3719 }, company: 'Starlight Rides' },
    { id: 6, name: 'Michael Johnson', startCoordinate: { x: 48.2082, y: 16.3720 }, endCoordinate: { x: 48.2085, y: 16.3717 }, company: 'Starlight Rides' },
    { id: 7, name: 'Emily Taylor', startCoordinate: { x: 47.3166, y: 15.4215 }, endCoordinate: { x: 47.3169, y: 15.4221 }, company: 'ZoomZoom Logistics' },
    { id: 8, name: 'David Wilson', startCoordinate: { x: 47.3170, y: 15.4212 }, endCoordinate: { x: 47.3167, y: 15.4217 }, company: 'ZoomZoom Logistics' },
    { id: 9, name: 'Sophia Anderson', startCoordinate: { x: 47.3165, y: 15.4217 }, endCoordinate: { x: 47.3168, y: 15.4214 }, company: 'ZoomZoom Logistics' },
    { id: 10, name: 'James Clark', startCoordinate: { x: 47.2073, y: 15.7238 }, endCoordinate: { x: 47.2076, y: 15.7244 }, company: 'Galactic Motors' },
    { id: 11, name: 'Olivia Martinez', startCoordinate: { x: 47.2078, y: 15.7235 }, endCoordinate: { x: 47.2075, y: 15.7240 }, company: 'Galactic Motors' },
    { id: 12, name: 'William Lee', startCoordinate: { x: 47.2071, y: 15.7240 }, endCoordinate: { x: 47.2074, y: 15.7237 }, company: 'Galactic Motors' },
    { id: 13, name: 'Sophie Brown', startCoordinate: { x: 47.5313, y: 14.6623 }, endCoordinate: { x: 47.5316, y: 14.6629 }, company: 'Phoenix Transports' },
    { id: 14, name: 'Alexander Johnson', startCoordinate: { x: 47.5318, y: 14.6620 }, endCoordinate: { x: 47.5315, y: 14.6625 }, company: 'Phoenix Transports' },
    { id: 15, name: 'Charlotte Smith', startCoordinate: { x: 47.5311, y: 14.6625 }, endCoordinate: { x: 47.5314, y: 14.6622 }, company: 'Phoenix Transports' }
];



  selectedVehicle: any;
  person_selection: any;

  //Filter
  selectedCompany: any;
  companies: any[] = [];
  filteredVehicles: any[] = [];


  constructor(/*private vehicleService: vehicleService*/private elementRef: ElementRef) {

    //this.companies = 
    this.vehicles.forEach(vehicle => {
      if(!this.companies.includes(vehicle.CompanyName)){
      this.companies.push(vehicle.CompanyName);
      }
    });

    console.dir(this.companies);

  }

   /*onVehicleSelected(vehicle: any) {
    this.selectedVehicle = vehicle; // Set the selected vehicle
  }*/


  
  selectCheckbox(vehicle: any, event: Event) {
    event.preventDefault();
    this.selectedVehicle = null;
    
    const id: string = 'vehicle-' + vehicle.Id;

    //console.log(id);
    //const selectElement: HTMLInputElement = this.elementRef.nativeElement.querySelector('.' + id);
    const checkbox: HTMLInputElement = this.elementRef.nativeElement.querySelector('#checkbox-' + id);
    const vehicleLabels = document.querySelectorAll('.vehicle-label');
    const selectElement = document.querySelectorAll('.' + id);    
    const submitButton = document.querySelectorAll('.submit');    

    if (!checkbox.checked) {
        checkbox.checked = true;
        vehicleLabels.forEach(function (label) {label.parentElement?.classList.remove('selected'); label.parentElement?.parentElement?.classList.add('shrunk');});
        selectElement[0].parentElement?.classList.add('selected');
        selectElement[0].parentElement?.parentElement?.classList.remove('shrunk');
        submitButton[0].classList.remove('hide');
        this.selectedVehicle = vehicle;

        /*vehicleLabels.forEach(function (label) {
          if(!label.parentElement?.classList.contains('selected')){
            //console.log(label);
          }
        });*/
    }else{
        selectElement[0].classList.remove('selected');
        checkbox.checked = false;
        this.selectedVehicle = null;
        submitButton[0].classList.add('hide');
        vehicleLabels.forEach(function (label) { label.parentElement?.parentElement?.classList.remove('shrunk');});
    }
}

onCompanySelected(){
  this.selectedVehicle = null;
}

getPeopleByCompany(companyName: string) {
  return this.people.filter(person => person.company === companyName);
}


getMapCoordinates(): [any[], boolean] {
 
  const value = true;
  if (this.selectedVehicle == null) {
    //console.log("Nothing sekected!");
    return [this.people.map(person => [person.startCoordinate.x, person.startCoordinate.y]), true];
  } else {
    return [this.vehicles.map(vehicle => [vehicle.coordinates.x, vehicle.coordinates.y]), false];
  }

  return [[], true];
}

private isEqual(obj1: any, obj2: any): boolean {return JSON.stringify(obj1) === JSON.stringify(obj2);}

getFilteredVehicles(): any[] {
  if (!this.selectedCompany) {
      return this.vehicles;
  } else {
      return this.vehicles.filter(vehicle => vehicle.CompanyName === this.selectedCompany);
  }
}

submitSelectedRoute(){
    // Submit route
}


}
  /*
  ngOnInit(): void {
    this.loadvehicles();
  }

  loadvehicles() {
    this.vehicleService.getvehicles().subscribe((data: any[]) => {
      this.vehicles = data;
    });
  }


  onvehicleSelected(vehicle: any) {
    // Assuming you have a method in your service to fetch location data based on vehicle ID
    this.vehicleService.getvehicleLocation(vehicle.id).subscribe((locations: any[]) => {
      this.vehicleLocations = locations;
    });
  }*/

