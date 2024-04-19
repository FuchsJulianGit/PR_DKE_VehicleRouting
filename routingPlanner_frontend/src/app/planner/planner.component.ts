import { Component, OnInit, ElementRef } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { NgModel, NgForm, FormsModule } from '@angular/forms';
import { MapModule } from '../map/map.module';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { map } from 'leaflet';
import { publishFacade } from '@angular/compiler';
//import { vehicleService } from '../services/vehicle.service';

import Openrouteservice from 'openrouteservice-js';
import { routes } from '../app.routes';
let orsDirections = new Openrouteservice.Directions({ api_key: "XYZ"});


//Create Routes
interface Coordinate {
  x: number;
  y: number;
}

interface Vehicle {
  Id: number;
  CompanyName: string;
  coordinates: Coordinate;
  canTransportWheelchairs: boolean;
  VehicleDescription: 'Thunderbolt 5000';
  seatingPlaces: number;
}

interface Person {
  id: number;
  name: string;
  startCoordinate: Coordinate;
  endCoordinate: Coordinate;
  company: string;
  needsWheelchair: boolean;
}

interface Route {
  vehicle_id: number;
  start_location: number[];
  end_location: number[];
  people: Person[];
}

interface RouteFormat {
  routeName: string;
  id: number, 
  sequenceNumber: number,
  coordinates: number[],
  mainRoute: boolean
};





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
   /* { Id: 2, CompanyName: 'Starlight Rides', VehicleDescription: 'Celestial Cruiser', coordinates: { x: 48.2082, y: 16.3719 }, canTransportWheelchairs: false, seatingPlaces: 4 },*/
    { Id: 3, CompanyName: 'Starlight Rides', VehicleDescription: 'Flashmobile XL', coordinates: { x: 47.316917, y: 15.421834 }, canTransportWheelchairs: true, seatingPlaces: 6 },
    /*{ Id: 4, CompanyName: 'Galactic Motors', VehicleDescription: 'AstroVan', coordinates: { x: 47.207603, y: 15.724283 }, canTransportWheelchairs: false, seatingPlaces: 8 },
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
  peopleDatabase: any[] = [
    { id: 1, name: 'John Doe', startCoordinate: { x: 47.60950, y: 13.04160 }, endCoordinate: { x: 47.6098, y: 13.0422 }, company: 'Speedy Transport', needsWheelchair: true },
    { id: 2, name: 'Jane Smith', startCoordinate: { x: 47.60990, y: 13.04130 }, endCoordinate: { x: 47.6096, y: 13.0418 }, company: 'Speedy Transport', needsWheelchair: false },
    { id: 3, name: 'Alice Johnson', startCoordinate: { x: 47.60940, y: 13.04180 }, endCoordinate: { x: 47.6097, y: 13.0415 }, company: 'Speedy Transport', needsWheelchair: false  },
    { id: 4, name: 'Bob Brown', startCoordinate: { x: 48.20800, y: 16.37170 }, endCoordinate: { x: 48.2083, y: 16.3723 }, company: 'Starlight Rides', needsWheelchair: true },
    { id: 5, name: 'Eve White', startCoordinate: { x: 48.20850, y: 16.37140 }, endCoordinate: { x: 48.3082, y: 16.3719 }, company: 'Starlight Rides', needsWheelchair: false  },
    { id: 6, name: 'Bob Brown', startCoordinate: { x: 48.20800, y: 16.37170 }, endCoordinate: { x: 48.2583, y: 16.3720 }, company: 'Starlight Rides', needsWheelchair: false  },
    { id: 7, name: 'Eve White', startCoordinate: { x: 48.20850, y: 16.37140 }, endCoordinate: { x: 48.3062, y: 16.3709 }, company: 'Starlight Rides', needsWheelchair: false  },
  ]

  people: any[] = [
    { id: 1, name: 'John Doe', startCoordinate: { x: 47.60950, y: 13.04160 }, endCoordinate: { x: 47.6098, y: 13.0422 }, company: 'Speedy Transport', needsWheelchair: true },
    { id: 2, name: 'Jane Smith', startCoordinate: { x: 47.60990, y: 13.04130 }, endCoordinate: { x: 47.6096, y: 13.0418 }, company: 'Speedy Transport', needsWheelchair: false },
    { id: 3, name: 'Alice Johnson', startCoordinate: { x: 47.60940, y: 13.04180 }, endCoordinate: { x: 47.6097, y: 13.0415 }, company: 'Speedy Transport', needsWheelchair: false  },
    { id: 4, name: 'Bob Brown', startCoordinate: { x: 48.20800, y: 16.37170 }, endCoordinate: { x: 48.2083, y: 16.3723 }, company: 'Starlight Rides', needsWheelchair: true },
    { id: 5, name: 'Eve White', startCoordinate: { x: 48.20850, y: 16.37140 }, endCoordinate: { x: 48.3082, y: 16.3719 }, company: 'Starlight Rides', needsWheelchair: false  },
    { id: 6, name: 'Bob Brown', startCoordinate: { x: 48.20800, y: 16.37170 }, endCoordinate: { x: 48.2583, y: 16.3720 }, company: 'Starlight Rides', needsWheelchair: false  },
    { id: 7, name: 'Eve White', startCoordinate: { x: 48.20850, y: 16.37140 }, endCoordinate: { x: 48.3062, y: 16.3709 }, company: 'Starlight Rides', needsWheelchair: false  },
  ]

  
  /* people: any[] = [
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


  constructor(/*private vehicleService: vehicleService*/private elementRef: ElementRef) {

    //this.companies = 
    this.vehicles.forEach(vehicle => {
      if(!this.companies.includes(vehicle.CompanyName)){
      this.companies.push(vehicle.CompanyName);
      }
    });

    //console.dir(this.companies);

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

    this.selectedCompany = vehicle.companyName;

    if (!checkbox.checked) {
        checkbox.checked = true;
        vehicleLabels.forEach(function (label) {label.parentElement?.classList.remove('selected'); label.parentElement?.parentElement?.classList.add('shrunk');});
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
    return [this.formattedRoutesArray, false];
  }

  return [[], true];
}

submitSelectedRoute(){
  //this.selectedRoute 
}


private isEqual(obj1: any, obj2: any): boolean {return JSON.stringify(obj1) === JSON.stringify(obj2);}

getFilteredVehicles(): any[] {
  if (!this.selectedCompany) {
      return this.vehicles;
  } else {
      return this.vehicles.filter(vehicle => vehicle.CompanyName === this.selectedCompany);
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

if(this.selectedVehicle.Id != undefined)
  {
 // console.log(this.selectedVehicle.Id);
    const response = await this.calculateRoute();
  //  console.log(response);

    let displayRoute;
    for (const route of response.routes) {
      if (route.vehicle == this.selectedVehicle.Id) {
       // console.log(displayRoute);
        displayRoute = route;
          break;
      }
    }

    this.selectedRoute = displayRoute;

    this.createPeopleList(displayRoute, this.selectedVehicle.Id);
    
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
    console.log(optimizationOutput);
    for(var routee of optimizationOutput.routes){
      console.log(routee);
      routesArray = [...routesArray, ... (this.formatData(routee))];
    }

    console.log(routesArray);
    return routesArray;
  }

  

  formatData(routeObj: any): RouteFormat[]{

    console.log(routeObj);

    const routesArray: RouteFormat[] = [];
    let count:number = 0;
    for (const step of routeObj.steps) {
        let addRoute: RouteFormat = {
          routeName: routeObj.description,
          id: (step.type == "start" ||step.type == "end") ? routeObj.vehicle + 10000 : step.id, 
          sequenceNumber: count,
          coordinates: [step.location[1], step.location[0]],
          mainRoute: (this.selectedVehicle.Id == routeObj.vehicle) ? true : false
        }
        count++;
        routesArray.push(addRoute);
    }
    return routesArray;
  }

  createPeopleList(route: any, vehicleId: number){
    const findPersonById = (id: number) => this.peopleDatabase.find(person => person.id === id);
    let peopleList = document.getElementById("vehicle-peopleList-" + vehicleId);
   // console.log(vehicleId);
   // console.log(peopleList);

    if(peopleList != null){

    let peopleListHTML = '<style>.person-icon { width: auto; height: 100%; min-height: 3.6rem; min-width: 3.6rem; padding: 2rem 1.2rem 1.2rem 1.2rem; border-radius: 1.6rem; border: solid 0.3rem #E9e9e9; background-color: #F1F1F1; display: flex; align-items: center;margin: 0 2rem 0 2rem; }    .person-label { display: flex; align-items: center; cursor: pointer; padding: 1.2rem 0; padding: 1rem 0rem 1rem 0rem; width: 100% !important; } .vehicle-label-outter .person-label:hover{ background-color: #D3D3D3; }.people-list{ width: 100% !important; background-color: #ffffff; margin-bottom: -1.6rem; }.person-checkbox { padding: 0 1rem 0 1rem; margin: 0 1.5rem 0 1.5rem; }.person-checkbox[type=checkbox] { -ms-transform: scale(1.5); -moz-transform: scale(1.5); -webkit-transform: scale(1.5); -o-transform: scale(1.5); transform: scale(1.5); }.person-checkbox:checked + .person-icon img { filter: invert(100%); }.person-icon img { width: 3.6rem; height: 3.6rem; opacity: 1; }.person-details { flex: 1; }.person-title { font-size: 2rem; font-weight: 300; color: #333; }.person-details { flex: 1; display: flex; flex-direction: column; }.person-name { font-size: 1.6rem; font-weight: bold; color: #333; }.person-company{ font-weight: 900; font-size: 1.2rem; color: #999; }.person-coordinates { font-size: 1.2rem; color: #999; }</style>';

    for(let step of route.steps){
      
      if(step?.id < 1000){

        let person = findPersonById(step?.id);
      //  console.log(person);


        peopleListHTML +=  `
        <li>
            <label class="person-label">
                <div class="person-icon">
                    <img src="../../assets/user-solid.svg" alt="Person Icon">
                </div>
                <div class="person-details">
                    <span class="person-name">` + person.name + `</span>
                    <span class="person-company">`+ person.company + `</span>
                    <span class="person-coordinates">`+ person.startCoordinate.x + `, `+ person.startCoordinate.y + `</span>
                </div>
                <div class="checkbox">
                    <input type="checkbox" name="person" class="person-checkbox" [value]="person_selection" id="checkbox-people-`+ person.id + `" checked>
                </div>
            </label>
        </li>`;

      }
    }

    peopleList.innerHTML = peopleListHTML;
    }
  }


createRoutes(vehicles: Vehicle[], people: Person[]): Route[] {
  const routes: Route[] = [];

  // Group people by company
  const peopleByCompany: {[key: string]: Person[]} = {};
  people.forEach(person => {
      if (!peopleByCompany[person.company]) {
          peopleByCompany[person.company] = [];
      }
      peopleByCompany[person.company].push(person);
  });

  // Assign people to vehicles
  vehicles.forEach(vehicle => {
      const assignedPeople: Person[] = [];
      const peopleForCompany = peopleByCompany[vehicle.CompanyName] || [];
      peopleForCompany.forEach(person => {
          // Check if the vehicle can transport wheelchairs or if the person doesn't require one
          if (vehicle.canTransportWheelchairs || !person.needsWheelchair) {
              assignedPeople.push(person);
          }
      });

      // Create route for the vehicle
      const route: Route = {
          vehicle_id: vehicle.Id,
          start_location: [vehicle.coordinates.x, vehicle.coordinates.y],
          end_location: [vehicle.coordinates.x, vehicle.coordinates.y],
          people: assignedPeople
      };
      routes.push(route);
  });

 // console.dir(routes);

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

  const shipmentsForOptimization = this.people.map(person => ({
    amount: [1], 
    skills: [(person.needsWheelchair ? 2 : 1)],
    pickup: {
        id: person.id, 
        service: 300,
        location: [person.startCoordinate.y, person.startCoordinate.x] 
    },
    delivery: {
        id: person.id+1000, 
        service: 300, 
        location: [person.endCoordinate.y, person.endCoordinate.x]
    }
  }));

  const vehiclesForOptimization = this.vehicles.map(vehicle => ({
    id: vehicle.Id,
    description: vehicle.VehicleDescription + " " + vehicle.CompanyName + " " + vehicle.Id + " " + Math.floor((Math.random() * 9999999999) + 1),
    profile: 'driving-car',
    start: [vehicle.coordinates.y, vehicle.coordinates.x],
    end: [vehicle.coordinates.y, vehicle.coordinates.x],
    capacity: [vehicle.seatingPlaces],
    skills: (vehicle.canTransportWheelchairs ? [1, 2] : [1]),
  }));

try {
    const response = await Optimization.optimize({
    shipments: shipmentsForOptimization,
    vehicles: vehiclesForOptimization,
  });

 // console.log("response: ", response);
  return response;

  }catch (error) {
    console.error("Error occurred while calculating route:", error);
  }
  return null;
}

/*
  console.log("Selected Vehicle");
  console.log(this.selectedVehicle);
  console.log("Selected Route");
 console.log(foundRoute);

}*/

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

}