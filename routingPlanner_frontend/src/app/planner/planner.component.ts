import { Component, OnInit, ElementRef } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { NgModel, NgForm, FormsModule } from '@angular/forms';
import { MapModule } from '../map/map.module';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { map } from 'leaflet';
import { publishFacade } from '@angular/compiler';
import { RoutePointService } from '../route-point-list/route-point-service.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { PersonService } from '../person/person.service';

import { RoutePoint, Person, Vehicle } from '../Interfaces/route-point'
import Openrouteservice from 'openrouteservice-js';
import { routes } from '../app.routes';
import { Observable, of } from 'rxjs';
let orsDirections = new Openrouteservice.Directions({ api_key: "XYZ"});


//Create Routes
/*interface Coordinate {
  x: number;
  y: number;
}*/

//NewCoordinates
interface Coordinates {
  id: number;
  longitude: number | 0;
  latitude: number | 0;
}

interface VehicleLocal {
  id: number;
  CompanyName: string;
  startCoordinate: Coordinates;
  endCoordinate: Coordinates;
  canTransportWheelchairs: boolean;
  VehicleDescription: 'Thunderbolt 5000';
  seatingPlaces: number;
}

/*interface PersonLocal {
  id: number;
  name: string;
  startCoordinate: Coordinates;
  endCoordinate: Coordinates;
  company: string;
  needsWheelchair: boolean;
}*/

//New PersonLocal
interface PersonLocal {
  id?: number;
  gender: string;
  titel: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  startAddress: Address;
  targetAddress: Address;
  startCoordinates: Coordinates;
  targetCoordinates: Coordinates;
  wheelchair: boolean;
  transportProvider?: TransportProvider;
}

interface Address {
  id: number;
  streetName: string;
  doorNumber: string;
  zipcode: string;
  city: string;
}

interface Route {
  vehicle_id: number;
  start_location: number[];
  end_location: number[];
  person: PersonLocal[];
}

interface TransportProvider {
  companyName: string;
  review: string;
  companyAddress: Address;
  companyCoordinates?: Coordinates;
}

interface RouteFormat {
  routeName: string,
  id: number, 
  sequenceNumber: number,
  coordinates: number[],
  mainRoute: boolean,
  vehicleId: number
};

interface Route_DB{
  id: number,
  Description: String,
  Sequenz: number,
  AtHome: boolean,
  Coordinates: number[],
  Vehicle: number
}
        
@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [MapModule, NgFor, NgIf, FormsModule, CommonModule],
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.scss',
  providers: [RoutePointService]
})


export class PlannerComponent {
  public vehicles: any[] = [
  /*  { Id: 1, CompanyName: 'Speedy Transport', VehicleDescription: 'Thunderbolt 5000', coordinates: { x: 47.6097, y: 13.0419 }, canTransportWheelchairs: true, seatingPlaces: 5 },
    { Id: 2, CompanyName: 'Starlight Rides', VehicleDescription: 'Celestial Cruiser', coordinates: { x: 48.2082, y: 16.3719 }, canTransportWheelchairs: false, seatingPlaces: 4 },
    { Id: 3, CompanyName: 'Starlight Rides', VehicleDescription: 'Flashmobile XL', coordinates: { x: 47.316917, y: 15.421834 }, canTransportWheelchairs: true, seatingPlaces: 6 },
    { Id: 4, CompanyName: 'Galactic Motors', VehicleDescription: 'AstroVan', coordinates: { x: 47.207603, y: 15.724283 }, canTransportWheelchairs: false, seatingPlaces: 8 },
    { Id: 5, CompanyName: 'Phoenix Transports', VehicleDescription: 'Firebird Express', coordinates: { x: 47.5316, y: 14.6625 }, canTransportWheelchairs: true, seatingPlaces: 5 },
    { Id: 6, CompanyName: 'Phoenix Transports', VehicleDescription: 'Firebird Easy', coordinates: { x: 47.3316, y: 14.4625 }, canTransportWheelchairs: false, seatingPlaces: 8 },
    { Id: 7, CompanyName: 'Speedy Transport', VehicleDescription: 'Thunderbolt 5000', coordinates: { x: 47.6097, y: 13.0419 }, canTransportWheelchairs: true, seatingPlaces: 5 },
    { Id: 8, CompanyName: 'Starlight Rides', VehicleDescription: 'Celestial Cruiser', coordinates: { x: 48.2082, y: 16.3719 }, canTransportWheelchairs: false, seatingPlaces: 4 },
    { Id: 9, CompanyName: 'ZoomZoom Logistics', VehicleDescription: 'Flashmobile XL', coordinates: { x: 47.316917, y: 15.421834 }, canTransportWheelchairs: true, seatingPlaces: 6 },
    { Id: 10, CompanyName: 'Galactic Motors', VehicleDescription: 'AstroVan', coordinates: { x: 47.207603, y: 15.724283 }, canTransportWheelchairs: false, seatingPlaces: 8 },
    { Id: 11, CompanyName: 'Phoenix Transports', VehicleDescription: 'Firebird Express', coordinates: { x: 47.5316, y: 14.6625 }, canTransportWheelchairs: true, seatingPlaces: 5 },
    { Id: 12, CompanyName: 'Phoenix Transports', VehicleDescription: 'Firebird Easy', coordinates: { x: 47.3316, y: 14.4625 }, canTransportWheelchairs: false, seatingPlaces: 8 }*/
  ];
  // Get this data from Database
  personDatabase: any[] = [
 /*  { id: 1, name: 'John Doe', startCoordinate: { x: 47.60950, y: 13.04160 }, endCoordinate: { x: 47.6098, y: 13.0422 }, company: 'Speedy Transport', needsWheelchair: true },
    { id: 2, name: 'Jane Smith', startCoordinate: { x: 47.60990, y: 13.04130 }, endCoordinate: { x: 47.6096, y: 13.0418 }, company: 'Speedy Transport', needsWheelchair: false },
    { id: 3, name: 'Alice Johnson', startCoordinate: { x: 47.60940, y: 13.04180 }, endCoordinate: { x: 47.6097, y: 13.0415 }, company: 'Speedy Transport', needsWheelchair: false  },
    { id: 4, name: 'Bob Brown', startCoordinate: { x: 48.20800, y: 16.37170 }, endCoordinate: { x: 48.2083, y: 16.3723 }, company: 'Starlight Rides', needsWheelchair: true },
    { id: 5, name: 'Eve White', startCoordinate: { x: 48.20850, y: 16.37140 }, endCoordinate: { x: 48.3082, y: 16.3719 }, company: 'Starlight Rides', needsWheelchair: false  },
    { id: 6, name: 'Bob Brown', startCoordinate: { x: 48.20800, y: 16.37170 }, endCoordinate: { x: 48.2583, y: 16.3720 }, company: 'Galactic Motors', needsWheelchair: false  },
    { id: 7, name: 'Eve White', startCoordinate: { x: 48.20850, y: 16.37140 }, endCoordinate: { x: 48.3062, y: 16.3709 }, company: 'Galactic Motors', needsWheelchair: false  },*/
  ]

  person: any[] = [
    /*{ id: 1, name: 'John Doe', startCoordinate: { x: 47.60950, y: 13.04160 }, endCoordinate: { x: 47.6098, y: 13.0422 }, company: 'Speedy Transport', needsWheelchair: true },
    { id: 2, name: 'Jane Smith', startCoordinate: { x: 47.60990, y: 13.04130 }, endCoordinate: { x: 47.6096, y: 13.0418 }, company: 'Speedy Transport', needsWheelchair: false },
    { id: 3, name: 'Alice Johnson', startCoordinate: { x: 47.60940, y: 13.04180 }, endCoordinate: { x: 47.6097, y: 13.0415 }, company: 'Speedy Transport', needsWheelchair: false  },
    { id: 4, name: 'Bob Brown', startCoordinate: { x: 48.20800, y: 16.37170 }, endCoordinate: { x: 48.2083, y: 16.3723 }, company: 'Starlight Rides', needsWheelchair: true },
    { id: 5, name: 'Eve White', startCoordinate: { x: 48.20850, y: 16.37140 }, endCoordinate: { x: 48.3082, y: 16.3719 }, company: 'Starlight Rides', needsWheelchair: false  },
    { id: 6, name: 'Bob Brown', startCoordinate: { x: 48.20800, y: 16.37170 }, endCoordinate: { x: 48.2583, y: 16.3720 }, company: 'Starlight Rides', needsWheelchair: false  },
    { id: 7, name: 'Eve White', startCoordinate: { x: 48.20850, y: 16.37140 }, endCoordinate: { x: 48.3062, y: 16.3709 }, company: 'Starlight Rides', needsWheelchair: false  },
    { id: 8, name: 'David Wilson', startCoordinate: { x: 47.3170, y: 15.4212 }, endCoordinate: { x: 47.3167, y: 15.4217 }, company: 'ZoomZoom Logistics' },
    { id: 9, name: 'Sophia Anderson', startCoordinate: { x: 47.3165, y: 15.4217 }, endCoordinate: { x: 47.3168, y: 15.4214 }, company: 'ZoomZoom Logistics' },
    { id: 10, name: 'James Clark', startCoordinate: { x: 47.2073, y: 15.7238 }, endCoordinate: { x: 47.2076, y: 15.7244 }, company: 'Galactic Motors' },
    { id: 11, name: 'Olivia Martinez', startCoordinate: { x: 47.2078, y: 15.7235 }, endCoordinate: { x: 47.2075, y: 15.7240 }, company: 'Galactic Motors' },
    { id: 12, name: 'William Lee', startCoordinate: { x: 47.2071, y: 15.7240 }, endCoordinate: { x: 47.2074, y: 15.7237 }, company: 'Galactic Motors' },
    { id: 13, name: 'Sophie Brown', startCoordinate: { x: 47.5313, y: 14.6623 }, endCoordinate: { x: 47.5316, y: 14.6629 }, company: 'Phoenix Transports' },
    { id: 14, name: 'Alexander Johnson', startCoordinate: { x: 47.5318, y: 14.6620 }, endCoordinate: { x: 47.5315, y: 14.6625 }, company: 'Phoenix Transports' },
    { id: 15, name: 'Charlotte Smith', startCoordinate: { x: 47.5311, y: 14.6625 }, endCoordinate: { x: 47.5314, y: 14.6622 }, company: 'Phoenix Transports' }*/
];

   /*   person: any[] = [
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
];*/

  selectedVehicle: any;
  person_selection: any;
  selectedRoute: any;
  //Filter
  selectedCompany: any;
  companies: any[] = [];
  filteredVehicles: any[] = [];  
  formattedRoutesArray: any[] = [];
  data!: Observable<any>;

  constructor(/*private vehicleService: vehicleService*/private elementRef: ElementRef, public routePointService: RoutePointService, private personService: PersonService, private vehicleService:  VehicleService) {
    //this.companies = 

    //console.dir(this.companies);
  }

   /*onVehicleSelected(vehicle: any) {
    this.selectedVehicle = vehicle; // Set the selected vehicle
  }*/


  

  
  selectCheckbox(vehicle: any, event: Event) {

    event.preventDefault();
    this.selectedVehicle = null;
    
    const id: string = 'vehicle-' + vehicle.id;

    //console.log(id);
    //const selectElement: HTMLInputElement = this.elementRef.nativeElement.querySelector('.' + id);
    const checkbox: HTMLInputElement = this.elementRef.nativeElement.querySelector('#checkbox-' + id);
    const vehicleLabels = document.querySelectorAll('.vehicle-label');
    const selectElement = document.querySelectorAll('.' + id);    
    const submitButton = document.querySelectorAll('.submit');    

   // document.getElementById('vehicle-personList-' + vehicle.id)?.classList.toggle('.hide');

    this.selectedCompany = vehicle.companyName;

    if (!checkbox.checked) {
        checkbox.checked = true;
        vehicleLabels.forEach(function (label) {label.parentElement?.classList.remove('selected'); 
        label.parentElement?.parentElement?.classList.add('shrunk');});
        selectElement[0].parentElement?.classList.add('selected');
        selectElement[0].parentElement?.parentElement?.classList.remove('shrunk');
        submitButton[0].classList.remove('hide');
        this.selectedVehicle = vehicle;



        this.getCompanyRoute();

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
       
        document.querySelectorAll('[class*="vehicle-personList"]').forEach(element => {
          element.innerHTML = '';
      });
      

      }
}

onCompanySelected(){
  
  const submitButton = document.querySelectorAll('.submit');    
  submitButton[0].classList.add('hide');

 // console.log(this.selectedVehicle);
 // console.log(this.selectedCompany);

  this.selectedVehicle = null;

  this.createVehicleList(this.selectedCompany);

}

getPersonByCompany(companyName: string) {
  return this.person.filter(person => person.company === companyName);
}

getMapCoordinates(): [any[], boolean] {
  const value = true;
  if (this.selectedVehicle == null) {
    // console.log("Nothing sekected!");
    // console.dir(this.vehicles);
  
     //Change WITH NEW VEHILCES!
    return [this.vehicles.map(vehicles => [vehicles.startCoordinate.x, vehicles.startCoordinate.y]), true];
  } else {
    // console.log("Soemthing sekected!");
    return [this.formattedRoutesArray, false];
  }

  return [[], true];
}

submitSelectedRoute(){

  //console.log(this.selectedRoute);
  var routeSubmit: RoutePoint[] = [];
/*
          routeName: routeObj.description,
          id: (step.type == "start" ||step.type == "end") ? routeObj.vehicle + 10000 : step.id, 
          sequenceNumber: count,
          coordinates: [step.location[1], step.location[0]],
          mainRoute: (this.selectedVehicle.id == routeObj.vehicle) ? true : false*/

  //let personList = document.getElementById("vehicle-personList-" + this.selectedVehicle.id)?.getElementsByClassName("person-checkbox");

  var personList:any = this.getPersonCheckboxValues("vehicle-personList-" + this.selectedVehicle.id);

  var count:number = 0;

  if(this.selectedRoute){
  for(var step of this.selectedRoute.steps){ 
    var isHome = false;
      console.log(personList);
    for(var peop of personList){

      if(Number(step.id) >= 10000){
        isHome = true;
        break;
      }
      if(Number(peop.id) == Number(step.id)){
        isHome = peop.checked;
        break;
      }

      if((Number(peop.id) + 1000) == Number(step.id)){
        isHome = peop.checked;
        break;
      }
    }






    /*if(coordinate_id == null){
      for(let vehicle of this.vehicles){
        console.log(vehicle);
        console.log(""+vehicle.coordinates.x + " == " + step.location[1] + " " + vehicle.coordinates.y + " == " + step.location[0]);
      if(vehicle.coordinates.x == step.location[1] && vehicle.coordinates.y == step.location[0]){
        coordinate_id = vehicle.coordinates.id;
        break;
      }
    }
  }*/

   // console.log(step);
   // console.log(this.selectedVehicle);
   // console.log(this.personDatabase);
   // console.log(this.selectedRoute);

    var newRouteVar: RoutePoint = {
      id: 0,
      description: this.selectedRoute.description,
      sequenz: count,
      atHome: isHome,
      coordinates: ("[" +step.location[1] + "," + step.location[0] + "]"),
      vehicle: this.selectedVehicle.id,
      coordinateId: this.returnCoordId(step.location[1], step.location[0])
    };
    count++;
    routeSubmit.push(newRouteVar);

    this.routePointService.save(newRouteVar).subscribe(
      (response) => {console.log('Route point added successfully:', response);},
      (error) => { console.error('Error adding route point:', error);}
    );

  }
  }
}

   
public returnCoordId(lat: any, long:any){
  let coordinate_id = null; //Default Value - Vehicles can currently not be assigned due to mocking
  for(let person of this.personDatabase){
   // console.log("Test");
    console.log("start  " +person.startCoordinate.latitude + " == " + lat + " " + person.startCoordinate.longitude + " == " + long);
    if((person.startCoordinate.latitude == lat) && (person.startCoordinate.longitude == long)){
      console.log("TREEFFERER" + person.startCoordinate.id);
      return person.startCoordinate.id;
      break;
    }

    console.log("end " +person.endCoordinate.latitude + " == " + lat + " " + person.endCoordinate.longitude + " == " + long);
    if((person.endCoordinate.latitude == lat) && (person.endCoordinate.longitude == long)){
      console.log("TREEFFERER" + person.endCoordinate.id);
    return person.endCoordinate.id;
    break;
  }}
  return null;
  }

getPersonCheckboxValues(personListId: string): { id: string; checked: boolean }[] {
  const personCheckboxValues: { id: string; checked: boolean }[] = [];
  const personList = document.getElementById(personListId);
  if (personList) {
      const checkboxes = personList.getElementsByClassName("person-checkbox");
      for (let i = 0; i < checkboxes.length; i++) {
          const checkbox = checkboxes[i] as HTMLInputElement;
          const id = checkbox.id.replace("checkbox-person-", "");
          personCheckboxValues.push({
              id: id,
              checked: checkbox.checked
          });
      }
  }

  return personCheckboxValues;
}


private isEqual(obj1: any, obj2: any): boolean {return JSON.stringify(obj1) === JSON.stringify(obj2);}


private waitForVehicles(): Promise<void> {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (this.vehicles && this.vehicles.length > 0) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

createVehicleList(companyName?: string){
  const findPersonById = (id: number) => this.personDatabase.find(person => person.id === id);
  let vehicleList = document.getElementById("vehicle-list");
  let filteredVehicles = this.vehicles;

  if (companyName) {
    // Filter vehicles by company name if provided
    filteredVehicles = this.vehicles.filter(vehicle => vehicle.CompanyName === companyName);
  }


  if(vehicleList != null){
  let vehicleListHTML = '<style>.container{display:flex;flex-wrap:wrap;background-color:aqua;height:100vh;width:100%;margin:0!important;}.sidebar{position:relative;top:0;left:0;width:30%;height:100%;background-color:#fff;overflow-y:auto;padding:0 2rem;box-sizing:border-box;user-select:none;}.sidebar .fixedHeader{position:fixed;z-index:5;width:inherit;padding-right:5rem;height:7.5rem;background-color:#fff;}.sidebar .fixedHeader select{margin-right:5rem;}.sidebar .fixedHeader h2{text-transform:uppercase;font-weight:bolder;font-stretch:expanded;padding:0;margin-left:2rem;width:100%!important;}.map-outter-container{position:relative;flex:1;height:100%;background-color:#eeff00;overflow-y:auto;padding:0px!important;box-sizing:border-box;}.map-frame{height:100vh!important;}.map-container{box-sizing:border-box;position:relative!important;width:100%;}.sidebar{min-width:200px;}.sidebar li,.sidebar ul{list-style-type:none!important;padding-left:0!important;}.sidebar>ul{margin-top:10rem;}.vehicle-radio{margin-right:10px;}.vehicle-info{display:flex;flex-direction:column;line-height:1.2;}.vehicle-title{font-size:2rem;font-weight:300;color:#333;}.company-name{font-size:1.2rem;font-weight:900;color:#999;padding-left:0.1rem;}.seating-places{font-size:12px;color:#888;}.wheelchair-icon,.seating-icon{margin-top:5px;display:flex;font-size:1.6rem;padding-right:0.3rem;opacity:0.5;}.wheelchair-icon img,.seating-icon img{width:1.6rem;opacity:0.5;}.seating{display:flex;}.vehicle-label-outter{display:flex;align-items:center;cursor:pointer;transition:background-color 0.6s ease;flex-wrap:wrap;border-bottom:#ececec solid;}.vehicle-highlight{display:flex;align-items:center;cursor:pointer;transition:background-color 0.6s ease;flex-wrap:wrap;width:100%;padding:1.6rem 0 1.6rem 0;}.vehicle-highlight:hover{background-color:#d3d3d3!important;}.vehicle-highlight.selected .vehicle-icon{background-color:#277fc9;}.vehicle-label{display:flex;align-items:center;padding:1rem 2rem 1rem 1rem;cursor:pointer;transition:background-color 0.6s ease;}.vehicle-radio{display:none}.vehicle-selector{width:50px;height:50px;display:inline-block;border-radius:10px;overflow:hidden;cursor:pointer;transition:background-color 0.3s ease;}.vehicle-selector:hover{background-color:#f0f0f0;}.vehicle-icon{width:100%;height:100%;min-height:3.6rem;min-width:3.6rem;padding:1.2rem;border-radius:1.6rem;border:solid 0.3rem #e9e9e9;background-color:#f1f1f1;display:flex;align-items:center;}.selected .vehicle-selector{background-color:#4a90e2;}.vehicle-icon img{width:100%;opacity:1;max-width:3.6rem;max-height:3.6rem;}.vehicle-details{flex:1;}.selected .vehicle-selector{background-color:#4a90e2;}.selected .vehicle-icon img{filter:invert(100);}.shrunk{height:0!important;padding:0;opacity:0;overflow:hidden;transition:height 0.6s ease,padding 0.6s ease,opacity 0.3s ease-in;border:none!important;}.vehicle-label-outter:not(.shrunk){transition:height 0.6s ease,padding 0.6s ease,opacity 0.3s ease-in;}.shrunk>img{opacity:0.2;}.person-icon{width:auto;height:100%;min-height:3.6rem;min-width:3.6rem;padding:2rem 1.2rem 1.2rem 1.2rem;border-radius:1.6rem;border:solid 0.3rem #e9e9e9;background-color:#f1f1f1;display:flex;align-items:center;}.person-label{display:flex;align-items:center;cursor:pointer;padding:1.2rem 0;padding:1rem 0rem 1rem 0rem;width:100%!important;}.vehicle-label-outter .person-label:hover{background-color:#d3d3d3;}.person-list{width:100%!important;background-color:#fff;margin-bottom:-1.6rem;}.person-checkbox{padding:0 1rem 0 1rem;margin:0 1.5rem 0 1.5rem;}.person-checkbox[type=checkbox]{-ms-transform:scale(1.5);-moz-transform:scale(1.5);-webkit-transform:scale(1.5);-o-transform:scale(1.5);transform:scale(1.5);}.person-checkbox:checked+.person-icon img{filter:invert(100%);}.person-icon img{width:3.6rem;height:3.6rem;opacity:1;}.person-details{flex:1;}.person-title{font-size:2rem;font-weight:300;color:#333;}.person-details{flex:1;display:flex;flex-direction:column;}.person-name{font-size:1.6rem;font-weight:bold;color:#333;}.person-company{font-weight:900;font-size:1.2rem;color:#999;}.person-coordinates{font-size:1.2rem;color:#999;}.custom-select{appearance:none;-webkit-appearance:none;-moz-appearance:none;padding:8px;font-size:16px;border:1px solid #ccc;border-radius:5px;background-color:#f8f8f8;cursor:pointer;}.custom-select:focus{outline:none;border-color:#007bff;}.custom-select option{padding:0.8rem;font-size:1.6rem;cursor:pointer;}.fixedHeader{display:flex;align-items:center;}.submit{position:absolute;bottom:5rem;right:7.5rem;z-index:20000;}.hide{display:none;}.submit .btn.btn-primary{background:none;border:none;color:inherit;font:inherit;padding:0;cursor:pointer;outline:none;font-size:2rem;font-weight:600;color:#333;display:inline-block;font-size:2em;padding:1em 2em;margin-top:10rem;margin-bottom:6rem;-webkit-appearance:none;appearance:none;background-color:#f1f1f1;color:#333333;border-radius:1rem;border:none;cursor:pointer;position:relative;transition:transform ease-in 0.1s,box-shadow ease-in 0.25s;box-shadow:0 2px 25px rgba(255,255,255,0.5);}.submit .btn.btn-primary:focus{outline:0;}.submit .btn.btn-primary:active{transform:scale(0.9);background-color:darken(#f1f1f1,5%);box-shadow:0 2px 25px rgba(120,120,120,0.2);}.submit .btn.btn-primary.animate:before,.submit .btn.btn-primary.animate:after{position:absolute;content:``;display:block;width:140%;height:100%;left:-20%;z-index:-1000;transition:all ease-in-out 0.5s;background-repeat:no-repeat;}.submit .btn.btn-primary:before{display:none;top:-75%;background-image:radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,transparent 20%,#f1f1f1 20%,transparent 30%),radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,transparent 10%,#f1f1f1 15%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%);background-size:10% 10%,20% 20%,15% 15%,20% 20%,18% 18%,10% 10%,15% 15%,10% 10%,18% 18%;}.submit .btn.btn-primary:after{display:none;bottom:-75%;background-image:radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,transparent 10%,#f1f1f1 15%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%);background-size:15% 15%,20% 20%,18% 18%,20% 20%,15% 15%,10% 10%,20% 20%;}.submit .btn.btn-primary.animate:active:before{background-position:0% 80%,0% 20%,10% 40%,20% 0%,30% 30%,22% 50%,50% 50%,65% 20%,90% 30%;}.submit .btn.btn-primary.animate:active:after{background-position:0% 90%,20% 90%,45% 70%,60% 110%,75% 80%,95% 70%,110% 10%;background-size:0% 0%,0% 0%,0% 0%,0% 0%,0% 0%,0% 0%,0% 0%;}.submit .btn.btn-primary.animate:before{display:block;animation:topBubbles ease-in-out 0.75s forwards;}.submit .btn.btn-primary.animate:after{display:block;animation:bottomBubbles ease-in-out 0.75s forwards;}@keyframes topBubbles{0%{background-position:5% 90%,10% 90%,10% 90%,15% 90%,25% 90%,25% 90%,40% 90%,55% 90%,70% 90%;}50%{background-position:0% 80%,0% 20%,10% 40%,20% 0%,30% 30%,22% 50%,50% 50%,65% 20%,90% 30%;}100%{background-position:0% 70%,0% 10%,10% 30%,20% -10%,30% 20%,22% 40%,50% 40%,65% 10%,90% 20%;background-size:0% 0%,0% 0%,0% 0%,0% 0%,0% 0%,0% 0%;}}@keyframes bottomBubbles{0%{background-position:10% -10%,30% 10%,55% -10%,70% -10%,85% -10%,70% -10%,70% 0%;}50%{background-position:0% 80%,20% 80%,45% 60%,60% 100%,75% 70%,95% 60%,105% 0%;}100%{background-position:0% 90%,20% 90%,45% 70%,60% 110%,75% 80%,95% 70%,110% 10%;background-size:0% 0%,0% 0%,0% 0%,0% 0%,0% 0%,0% 0%;}}</style>';
 // console.log(this.vehicles);

  for(let vehicleObj of filteredVehicles){

    vehicleListHTML +=  
    `<li><label class="vehicle-label-outter" >
              
    <div class="vehicle-highlight" id="vehicle-highlight-`+ vehicleObj.id + `" (click)="selectCheckbox(vehicle, $event)">
      <input type="radio" name="vehicle" class="vehicle-radio" [value]="vehicle" id="checkbox-vehicle-` + vehicleObj.id + `">
      <label class="vehicle-label vehicle-` + vehicleObj.id+ `" [class.selected]="selectedVehicle === vehicle" >
        <div class="vehicle-icon">
            <img src="assets/van-shuttle-solid.svg" alt="Vehicle Icon">
        </div>
      </label>
      <div class="vehicle-info">
        <div class="vehicle-title">` + vehicleObj.VehicleDescription +`</div>
        <div class="company-name">` + vehicleObj.CompanyName +`</div>
        
        <div class="seating">
            <div class="seating-icon" *ngIf="vehicle.seatingPlaces">
                <div class="seatNR">` + vehicleObj.seatingPlaces +`</div>
                <img src="../../assets/person-seat.svg" alt="Seat Accessible">
            </div>`
            
            if (vehicleObj.canTransportWheelchairs) {
              vehicleListHTML += `
                      <div class="wheelchair-icon">
                          <div class="seatNR">1</div>
                          <img src="../../assets/wheelchair-solid.svg" alt="Wheelchair Accessible">
                      </div>
          `;
          }
          
          vehicleListHTML += 
          ` </div>
      </div>
    </div>
    
    <div class="person-list" *ngIf="selectedVehicle">
    <!--<h3>${vehicleObj.CompanyName} Employees:</h3>-->
    <ul id="vehicle-personList-${vehicleObj.id}" class="vehicle-personList">
        
    </ul>
</div>

</label>
</li>
    
    `

    }
    vehicleList!.innerHTML = vehicleListHTML;

    for (let vehicleObj of filteredVehicles) {
      const highlight = document.getElementById(`vehicle-highlight-`+ vehicleObj.id);
      //console.log(highlight);
      if (highlight) {
        //console.log(highlight);
          highlight.addEventListener('click', (event) => {
              this.selectCheckbox(vehicleObj, event);
          });
      }
  }
  }
  }

  populateSelectBox(){

    this.vehicles.forEach(vehicle => {
      if(!this.companies.includes(vehicle.CompanyName)){
      this.companies.push(vehicle.CompanyName);
      }
    });

    let selectOptionsHtml = ' <option></option>';
    for (let company of this.companies) {selectOptionsHtml += `<option value="${company}">${company}</option>`; }
   // console.dir(this.companies);
   // console.dir(this.vehicles);
    const selectBox = document.getElementById('custom-select-box');
    selectBox!.innerHTML = selectOptionsHtml;
  }

async getFilteredVehicles(): Promise<VehicleLocal[]>  {

  //console.log(this.personDatabase);

  await this.waitForVehicles();

  //console.log(this.personDatabase);
  //console.log(this.vehicles);

  this.person = this.personDatabase;

  this.getMapCoordinates();

  this.populateSelectBox();

  this.createVehicleList();

  if (this.selectedCompany) {
    return this.vehicles.filter(vehicle => vehicle.CompanyName === this.selectedCompany);
  } else {
    return this.vehicles;
  }
}

async getCompanyRoute(){
    // Submit route
if(this.selectedVehicle == undefined){
for(let vehicle of this.vehicles){
  if(vehicle.id == this.extractSelectedVehicleId()){
    this.selectedVehicle = vehicle;
  }
}
}

if(this.selectedVehicle.id != undefined)
  {
 // console.log(this.selectedVehicle.id);
    let response = await this.calculateRoute();
  //  console.log(response);

    let displayRoute;

    //console.log(response.routes);
    //console.dir(response);
    

    if(response != null){
    for (const route of response.routes) {
      if (route.vehicle == this.selectedVehicle.id) {
       // console.log(displayRoute);
        displayRoute = route;
          break;
      }
    }
  }else{
    response ={
      code: 0,
      routes: [],
      summary: {
          cost: 0,
          routes: 0,
          unassigned: 0,
          delivery: [],
          amount: []
      },
      unassigned: []
  };
  }
 
    this.selectedRoute = displayRoute;

    this.createPersonList(displayRoute, this.selectedVehicle.id);
    
    /// Here
/*  public routesData = [
    { routeName: "Route 1", id:1, sequenceNumber: 1, coordinates: [47.6097, 13.0419] },
     */

   // this.formattedRoutesArray = this.formatData(displayRoute);
    this.formattedRoutesArray = this.formatMultiRouteData(response);

   // this.getMapCoordinates(this.formatData(displayRoute, this.vehicles), true);

    }
  }

  formatMultiRouteData(optimizationOutput: any): RouteFormat[]{
    var routesArray: RouteFormat[] = [];
    //console.log(optimizationOutput);
    for(var routee of optimizationOutput.routes){
      //console.log(routee);
      routesArray = [...routesArray, ... (this.formatData(routee))];
    }

    //console.log(routesArray);
    this.createDriverPlan(routesArray);

    return routesArray;
  }

  createDriverPlan(routesArray: RouteFormat[]){
    /** Part 1 **/
   // console.log(this.personDatabase);
   // console.log(this.selectedVehicle.companyName);

    let first = true;
    routesArray.forEach(routePoint => {

      if(routePoint.mainRoute){

      const { id } = routePoint;

    //  console.log(routePoint.id);

      if (routePoint.id > 10000) {
        if(first){

        }
        const vehicle = this.vehicles.find(vehicle => vehicle.id === routePoint.id - 10000);
        if (vehicle && first) {
          //console.log("Start Address for Vehicle with ID: " + 
            /*vehicle.startAddress.streetName + " " +
            vehicle.startAddress.doorNumber + ", " +
            vehicle.startAddress.zipcode + " " +
            vehicle.startAddress.city + " "+
           vehicle.startCoordinate); */ 
        }
        
        if (vehicle && !first) {
           /*console.log("End Address for Vehicle with ID: " + 
           vehicle.targetAddress.streetName + " " +
            vehicle.targetAddress.doorNumber + ", " +
            vehicle.targetAddress.zipcode + " " +
            vehicle.targetAddress.city + " " +
             vehicle.endCoordinate
            );*/
        } 
      }

      if (routePoint.id < 1000) {
        const person = this.personDatabase.find(person => person.id === id);
        if (person) {
        /*  console.log(" Start Address for person with ID: " + 
            person.targetAddress.streetName + " " +
            person.targetAddress.doorNumber + ", " +
            person.targetAddress.zipcode + " " +
            person.targetAddress.city + " "); */
        }
      }

      if (routePoint.id > 1000 && id < 10000) {
        const person = this.personDatabase.find(person => person.id === routePoint.id - 1000);
        if (person) {
          /*console.log("Target Address for person with ID: " + 
            person.targetAddress.streetName + " " +
            person.targetAddress.doorNumber + ", " +
            person.targetAddress.zipcode + " " +
            person.targetAddress.city + " ");*/
        }
      }
    }

    })
  /** Part 1 **/

  }

  

  formatData(routeObj: any): RouteFormat[]{

    //console.log(routeObj);

    const routesArray: RouteFormat[] = [];
    let count:number = 0;
    for (const step of routeObj.steps) {
        let addRoute: RouteFormat = {
          routeName: routeObj.description,
          id: (step.type == "start" ||step.type == "end") ? routeObj.vehicle + 10000 : step.id, 
          sequenceNumber: count,
          coordinates: [step.location[1], step.location[0]],
          mainRoute: (this.selectedVehicle.id == routeObj.vehicle) ? true : false,
          vehicleId: routeObj.vehicle
        }
        count++;
        routesArray.push(addRoute);
    }
    return routesArray;
  }



  createPersonList(route: any, vehicleId: number){

    //console.log("Person List is called");

    const findPersonById = (id: number) => this.personDatabase.find(person => person.id === id);
    let personList = document.getElementById("vehicle-personList-" + vehicleId);
   // console.log(vehicleId);
   // console.log(personList);

    if(personList != null){

    let personListHTML = '<style>.person-icon { width: auto; height: 100%; min-height: 3.6rem; min-width: 3.6rem; padding: 2rem 1.2rem 1.2rem 1.2rem; border-radius: 1.6rem; border: solid 0.3rem #E9e9e9; background-color: #F1F1F1; display: flex; align-items: center;margin: 0 2rem 0 2rem; }    .person-label { display: flex; align-items: center; cursor: pointer; padding: 1.2rem 0; padding: 1rem 0rem 1rem 0rem; width: 100% !important; } .vehicle-label-outter .person-label:hover{ background-color: #D3D3D3; }.person-list{ width: 100% !important; background-color: #ffffff; margin-bottom: -1.6rem; }.person-checkbox { padding: 0 1rem 0 1rem; margin: 0 1.5rem 0 1.5rem; }.person-checkbox[type=checkbox] { -ms-transform: scale(1.5); -moz-transform: scale(1.5); -webkit-transform: scale(1.5); -o-transform: scale(1.5); transform: scale(1.5); }.person-checkbox:checked + .person-icon img { filter: invert(100%); }.person-icon img { width: 3.6rem; height: 3.6rem; opacity: 1; }.person-details { flex: 1; }.person-title { font-size: 2rem; font-weight: 300; color: #333; }.person-details { flex: 1; display: flex; flex-direction: column; }.person-name { font-size: 1.6rem; font-weight: bold; color: #333; }.person-company{ font-weight: 900; font-size: 1.2rem; color: #999; }.person-coordinates { font-size: 1.2rem; color: #999; }</style>';


    //console.log(route);
    //console.log(route ? "True" : "False");


    if(!route){
      personListHTML +=  `
      <li>
          <label class="person-label"><div class="person-icon">
                  <img src="../../assets/user-solid.svg" alt="Person Icon">
              </div>
              <div class="person-details">
                  <span class="person-name"> Nothing here!</span>
              </div>
          </label>
      </li>`;
    }
    else {
    for(let step of route.steps){
      
      if(step?.id < 1000){

        let person = findPersonById(step?.id);
      //  console.log(person);


        personListHTML +=  `
        <li>
            <label class="person-label">
                <div class="person-icon">
                    <img src="../../assets/user-solid.svg" alt="Person Icon">
                </div>
                <div class="person-details">
                    <span class="person-name">` + person.firstName + " " + person.lastName + `</span>
                   <!--  <span class="person-coordinates">`+ (person.transportProvider || "No company assigned") + `</span> -->
                     <span class="person-company">`+ person.startAddress.streetName + " " + person.startAddress.doorNumber + " " + person.targetAddress.city + `</span>
                     <span class="person-coordinates">`+ person.startCoordinate.longitude + `, `+ person.startCoordinate.latitude + `</span>
                </div>
                <div class="checkbox">
                    <input type="checkbox" name="person" class="person-checkbox" [value]="person_selection" id="checkbox-person-`+ person.id + `" checked>
                </div>
            </label>
        </li>`;

      }

      if(step?.id > 1000 && step?.id < 10000 ){

        let person = findPersonById(step?.id - 1000);

        //console.log(person);
        personListHTML +=  `
        <li>
            <label class="person-label">
                <div class="person-icon">
                    <img src="../../assets/right-from-bracket-solid.svg" alt="Person Icon">
                </div>
                <div class="person-details">
                    <span class="person-name">` + person.firstName + " " + person.lastName + `</span>
                      <span class="person-company">`+ person.targetAddress.streetName + " " + person.targetAddress.doorNumber + " " + person.targetAddress.city + `</span>
                     <span class="person-coordinates">`+ person.endCoordinate.longitude + `, `+ person.endCoordinate.latitude + `</span>
                </div>
                <div class="checkbox">
                    <input type="checkbox" name="person" class="person-checkbox" [value]="person_selection" id="checkbox-person-`+ (person.id + 1000) + `" checked>
                </div>
            </label>
        </li>`;
      }

    }
  }
    personList.innerHTML = personListHTML;

   // document.getElementById('personList').innerHTML = personListHTML;

    // Attach event listeners programmatically using arrow function to maintain 'this' context
    document.querySelectorAll('.person-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('click', (event) => {
        const target = event.target as HTMLInputElement;
        handleCheckboxClick(target);
      });
    });


    }
  }

  


createRoutes(vehicles: VehicleLocal[], person: PersonLocal[]): Route[] {
  const routes: Route[] = [];

  // Group person by company
  const personByCompany: {[key: string]: PersonLocal[]} = {};
  person.forEach(person => {
    const companyName = person.transportProvider?.companyName || '';
      if (!personByCompany[companyName]) {
          personByCompany[companyName] = [];
      }
      personByCompany[companyName].push(person);
  });
  //console.log("WORKS??");
  //console.log(personByCompany);

  // Assign person to vehicles
  vehicles.forEach(vehicle => {
      const assignedPerson: PersonLocal[] = [];
      const personForCompany = personByCompany[vehicle.CompanyName] || [];
      personForCompany.forEach(person => {
          // Check if the vehicle can transport wheelchairs or if the person doesn't require one
          if (vehicle.canTransportWheelchairs || !person.wheelchair) {
              assignedPerson.push(person);
          }
      });

      // Create route for the vehicle
      const route: Route = {
          vehicle_id: vehicle.id,
          start_location: [vehicle.startCoordinate.longitude, vehicle.startCoordinate.latitude],
          end_location: [vehicle.endCoordinate.longitude, vehicle.endCoordinate.latitude],
          person: assignedPerson
      };
      routes.push(route);
  });

 // console.dir(routes);

/*

    const newRoutePoint: RoutePoint = {
      id: 0,
      seq: parseInt(this.seq, 10),
      startPoint: parseInt(this.startPoint, 10),
      person: parseInt(this.person, 10)
    };
    this.routePointService.save(newRoutePoint).subscribe(
      (response) => {
        console.log('Route point added successfully:', response);
        // You can add further logic here, such as resetting the form or displaying a success message
      },
      (error) => {
        console.error('Error adding route point:', error);
        // Handle error scenario, such as displaying an error message to the user
      }
    );*/


  return routes;
}

extractSelectedVehicleId(): string | null {
  const elements = document.querySelectorAll('.vehicle-label.selected');
  let vehicleNumber: string | null = null;

  elements.forEach((element) => {
      const classes = element.classList;
      classes.forEach((className) => {
          const match = className.match(/vehicle-(\d+)/);
          if (match && match[1]) {
              vehicleNumber = match[1];
          }
      });
  });

  return vehicleNumber;
}


async calculateRoute(){

  let Optimization = new Openrouteservice.Optimization({api_key: "5b3ce3597851110001cf6248d4673641728346c68523ae8c4c8158aa"});

  
  //const selectedPerson = this.person.filter(person => person.company === this.selectedVehicle.CompanyName);
  let selectedPerson = this.person;
  //Switch comments to select based on companyssss
  //console.log(selectedPerson);



selectedPerson = selectedPerson.filter(e => {
    const startLatitude = e.startCoordinate.latitude;
    const endLatitude = e.endCoordinate.latitude;
    const startLongitude = e.startCoordinate.longitude;
    const endLongitude = e.endCoordinate.longitude;
    const id = e.id;

    let isValid = (startLatitude >= 45 && startLatitude <= 50) &&
    (endLatitude >= 45 && endLatitude <= 50) &&
    (startLongitude >= 9 && startLongitude <= 18) &&
    (endLongitude >= 9 && endLongitude <= 18);

    if (!isValid) {
      console.error('Invalid person coordinates detected: OUT OF BOUNDS', {
        startLatitude,
        endLatitude,
        startLongitude,
        endLongitude,
        personId: e.id
      });
    }else{

      isValid = id < 1000;

    if (!isValid) {
      console.error('Invalid person id detected: Please remove some persons', {
        startLatitude,
        endLatitude,
        startLongitude,
        endLongitude,
        personId: e.id
      });
    }
  }

    return isValid;
  });

  //console.log(selectedPerson);



  const shipmentsForOptimization = selectedPerson.map(person => ({
    amount: [1], 
    skills: [(person.wheelchair ? 2 : 1)],
    pickup: {
        id: person.id, 
        name: "TEST",
        service: 300,
        location: [person.startCoordinate.longitude, person.startCoordinate.latitude] 
    },
    delivery: {
        id: person.id+1000,
        name: "TEST", 
        service: 300, 
        location: [person.endCoordinate.longitude, person.endCoordinate.latitude]
    }
  }));
  
  //const selectedVehicles = this.vehicles.filter(vehicle => vehicle.CompanyName === this.selectedVehicle.CompanyName);
  let selectedVehicles = this.vehicles;
  //console.log(selectedVehicles);

  selectedVehicles = selectedVehicles.filter(e => {
    const startLatitude = e.startCoordinate.x != null ? e.startCoordinate.x : 0;
    const endLatitude = e.endCoordinate.x != null ? e.endCoordinate.x : 0;
    const startLongitude = e.startCoordinate.y != null ? e.startCoordinate.y : 0;
    const endLongitude = e.endCoordinate.y != null ? e.endCoordinate.y : 0;

    const isValid = (startLatitude >= 45 && startLatitude <= 50) &&
                    (endLatitude >= 45 && endLatitude <= 50) &&
                    (startLongitude >= 9 && startLongitude <= 18) &&
                    (endLongitude >= 9 && endLongitude <= 18);

    if (!isValid) {
      console.error('Invalid vehicle coordinates detected: OUT OF BOUNDS', {
        startLatitude,
        endLatitude,
        startLongitude,
        endLongitude,
        personId: e.id
      });
    }

    return isValid;
  });


// return [this.vehicles.map(vehicles => [vehicles.coordinates.longitude, vehicles.coordinates.latitude]), true];

//console.log(selectedVehicles);

  const vehiclesForOptimization = selectedVehicles.map(vehicle => ({
    id: vehicle.id,
    description: vehicle.VehicleDescription + " " + vehicle.CompanyName + " " + vehicle.id + " " + Math.floor((Math.random() * 9999999999) + 1),
    profile: 'driving-car',
    start: [vehicle.startCoordinate.y, vehicle.startCoordinate.x],
    end: [vehicle.endCoordinate.y, vehicle.endCoordinate.x],
    capacity: [vehicle.seatingPlaces],
    max_tasks: 10,
    skills: (vehicle.canTransportWheelchairs ? [1, 2] : [1]),
  }));

  console.log("%cVehicles for optimization: ", "color: lightblue");
  console.log(vehiclesForOptimization);

  console.log("%cShipments for optimization: ", "color: lightblue");
  console.log(shipmentsForOptimization);

try {
    const response = await Optimization.optimize({
    shipments: shipmentsForOptimization,
    vehicles: vehiclesForOptimization,
  });

  console.log("%cOptimization Output: ", "color: lightblue");
  console.dir(response);
  return response;

  }catch (error) {
    console.error("Error occurred while calculating route:", error);

    //console.log("vehicle-personList-" + this.selectedVehicle.id);
    let personList = document.getElementById("vehicle-personList-" + this.selectedVehicle.id);
    
    let personListHTML =  `
    <li>
        <label class="person-label"><div class="person-icon">
                <img src="../../assets/user-solid.svg" alt="Person Icon">
            </div>
            <div class="person-details">
                <span class="person-name"> Nothing here!</span>
            </div>
        </label>
    </li>`;
    personList!.innerHTML = personListHTML;
    return null;
  }
  return null;
}

/*
  console.log("Selected Vehicle");
  console.log(this.selectedVehicle);
  console.log("Selected Route");
 console.log(foundRoute);

}*/

vehicles$!: Observable<Vehicle[]>;

  ngOnInit(): void {
  //{ id: 4, name: 'Bob Brown', startCoordinate: { x: 48.20800, y: 16.37170 }, endCoordinate: { x: 48.2083, y: 16.3723 }, company: 'Starlight Rides', needsWheelchair: true }
  /*  this.personService.getAllPerson().subscribe(
      (data: any[]) => { 
        this.personDatabase = data.map(person => ({
          id: person.id,
          name: person.name,
          startCoordinate: {
            x: parseFloat(person.startCoordinate.substring(1, person.startCoordinate.indexOf(','))),
            y: parseFloat(person.startCoordinate.substring(person.startCoordinate.indexOf(',') + 1, person.startCoordinate.length - 1))      
          },
          endCoordinate: { 
            x: parseFloat(person.endCoordinate.substring(1, person.endCoordinate.indexOf(','))),
            y: parseFloat(person.endCoordinate.substring(person.endCoordinate.indexOf(',') + 1, person.endCoordinate.length - 1))      
           },
          company: person.company,
          needsWheelchair: person.wheelchair !== undefined ? person.wheelchair : false
        }));
      },
      (error) => { console.error('Error fetching person data:', error);});*/

      this.personService.getAllPerson().subscribe(
        (data: any[]) => { 
            this.personDatabase = data.map(person => ({
             
              id: person.id,
              gender: person.gender,
              titel: person.titel,
              firstName: person.firstName,
              lastName: person.lastName,
              birthday: new Date(person.birthday),
              startAddress: {
                id: person.startAddress.id,
                streetName: person.startAddress.streetName,
                doorNumber: person.startAddress.doorNumber,
                zipcode: person.startAddress.zipcode,
                city: person.startAddress.city
              },
              targetAddress: {
                id: person.targetAddress.id,
                streetName: person.targetAddress.streetName,
                doorNumber: person.targetAddress.doorNumber,
                zipcode: person.targetAddress.zipcode,
                city: person.targetAddress.city
              },
              startCoordinate: {
                id: person.startCoordinates.id,
                longitude: parseFloat(person.startCoordinates.longitude),
                latitude: parseFloat(person.startCoordinates.latitude),
              },
              endCoordinate: {
                id: person.targetCoordinates.id,
                longitude: parseFloat(person.targetCoordinates.longitude),
                latitude: parseFloat(person.targetCoordinates.latitude),
              },
              wheelchair: person.wheelchair !== undefined ? person.wheelchair : false,
              transportProvider: person.transportProvider ? {
                companyName: person.transportProvider.companyName,
                review: person.transportProvider.review,
                companyAddress: {
                  id: person.transportProvider.companyAddress.id,
                  streetName: person.transportProvider.companyAddress.streetName,
                  doorNumber: person.transportProvider.companyAddress.doorNumber,
                  zipcode: person.transportProvider.companyAddress.zipcode,
                  city: person.transportProvider.companyAddress.city
                },
                companyCoordinates: person.transportProvider.companyCoordinates ? {
                  id: person.transportProvider.companyCoordinates.id,
                  longitude: parseFloat(person.transportProvider.companyCoordinates.longitude),
                  latitude: parseFloat(person.transportProvider.companyCoordinates.latitude),
                } : undefined
              } : undefined
            }));
            this.person = this.personDatabase;
          },
        (error) => { console.error('Error fetching person data:', error);});

      this.person = this.personDatabase;

      
      

  
      /*
      this.personService.getAllPerson().subscribe(
        (data: any[]) => { 
          this.personDatabase = data; 
        },
        (error) => { console.error('Error fetching person data:', error);});
        this.person = this.personDatabase;
    */

    this.vehicleService.getAllVehicles().subscribe(
        (data: any[]) => { 
          
          this.vehicles = data.map(vehicle => ({
            id: vehicle.id,
            CompanyName: vehicle.companyName,

            
            startCoordinate: { 
              x: parseFloat(vehicle.startCoordinate.substring(1, vehicle.startCoordinate.indexOf(','))),
              y: parseFloat(vehicle.startCoordinate.substring(vehicle.startCoordinate.indexOf(',') + 1, vehicle.startCoordinate.length - 1))      
             },
             endCoordinate: { 
              x: parseFloat(vehicle.endCoordinate.substring(1, vehicle.endCoordinate.indexOf(','))),
              y: parseFloat(vehicle.endCoordinate.substring(vehicle.endCoordinate.indexOf(',') + 1, vehicle.endCoordinate.length - 1))      
             },
            canTransportWheelchairs: (vehicle.canTransportWheelchairs == 1) ? true : false,
            VehicleDescription: vehicle.vehicleDescription,
            seatingPlaces: vehicle.seatingPlaces
          }));
         },
      (error) => { console.error('Error fetching person data:', error);});

      this.vehicleService

      this.getFilteredVehicles();

  }
/*
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

}


function handleCheckboxClick(checkbox: HTMLInputElement) {
  let targetCheckbox;
  let personId = extractPersonId(checkbox.id);;

  if (personId < 1000) {

    var target = (document.getElementById('checkbox-person-' + (personId + 1000)) as HTMLInputElement);
   // console.log("YEARESSERESR" + target + " " + personId + " " + (document.getElementById('checkbox-person-' +  + (personId + 1000)) as HTMLInputElement));

    target.checked = false;
  } 
}

function extractPersonId(checkboxId: string): number {
  const regex = /checkbox-person-(\d+)/;
  const match = checkboxId.match(regex);
  return match ? parseInt(match[1], 10) : 0;
}