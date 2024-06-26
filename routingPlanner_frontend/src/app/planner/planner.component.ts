import { Component, OnInit, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MapModule } from '../map/map.module';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { RoutePointService } from '../route-point-list/route-point-service.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { PersonService } from '../person/person.service';
import { RouteService } from '../route/route.service';
import { CoordinatesService } from '../coordinates/coordinates.service';
import { TransportProviderService } from '../transport-provider/transport-provider.service';

import { RoutePoint, Route, Person, Vehicle } from '../interfaces/interfaces'
import Openrouteservice from 'openrouteservice-js';
import { Observable, of } from 'rxjs';

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

interface RouteMapPoint {
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
 
@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [MapModule, NgFor, NgIf, FormsModule, CommonModule],
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.scss',
  providers: [RoutePointService]
})


export class PlannerComponent {
  public vehicles: any[] = [ ];
 
  personDatabase: any[] = [  ]
  public transportProviders: any[] = [];
  transportProvidersDatabase: any[] = [];
  coordinates: any[] = []
  person: any[] = [];
  selectedVehicle: any;
  person_selection: any;
  selectedRoute: any;
  selectedCompany: any;
  companies: any[] = [];
  filteredVehicles: any[] = [];  
  formattedRoutesArray: any[] = [];
  data!: Observable<any>;

  constructor(private elementRef: ElementRef, public routePointService: RoutePointService, private personService: PersonService, private vehicleService:  VehicleService, private routeService:  RouteService, private transportProviderService: TransportProviderService, private coordinatesService: CoordinatesService) {
  }

  
  
  selectCheckbox(vehicle: any, event: Event) {
    // Prevent the default event action
    event.preventDefault();
    // Reset the selected vehicle
    this.selectedVehicle = null;

    // Construct the vehicle ID
    const id: string = 'vehicle-' + vehicle.id;

    // Query the checkbox element related to the vehicle
    const checkbox: HTMLInputElement = this.elementRef.nativeElement.querySelector('#checkbox-' + id);
    // Query all vehicle labels and elements related to the selected vehicle ID
    const vehicleLabels = document.querySelectorAll('.vehicle-label');
    const selectElement = document.querySelectorAll('.' + id);    
    const submitButton = document.querySelectorAll('.submit');    

    // Set the selected company name
    this.selectedCompany = vehicle.companyName;

    if (!checkbox.checked) {
        // If the checkbox is not checked, check it and update the UI accordingly
        checkbox.checked = true;
        vehicleLabels.forEach(function (label) {
            label.parentElement?.classList.remove('selected'); 
            label.parentElement?.parentElement?.classList.add('shrunk');
        });
        selectElement[0].parentElement?.classList.add('selected');
        selectElement[0].parentElement?.parentElement?.classList.remove('shrunk');
        submitButton[0].classList.remove('hide');
        this.selectedVehicle = vehicle;

        // Call the function to get the company route
        this.getCompanyRoute();

    } else {
        // If the checkbox is already checked, uncheck it and update the UI accordingly
        selectElement[0].classList.remove('selected');
        checkbox.checked = false;
        this.selectedVehicle = null;
        submitButton[0].classList.add('hide');
        vehicleLabels.forEach(function (label) { 
            label.parentElement?.parentElement?.classList.remove('shrunk');
        });

        // Clear the inner HTML of all elements with class containing "vehicle-personList"
        document.querySelectorAll('[class*="vehicle-personList"]').forEach(element => {
            element.innerHTML = '';
        });
    }
}

onCompanySelected() {
  // Fetch and filter vehicles based on the selected company
  this.getFilteredVehicles();

  // Hide the submit button
  const submitButton = document.querySelectorAll('.submit');    
  submitButton[0].classList.add('hide');

  // Fetch vehicles filtered by company ID
  this.getFilteredVehiclesById(this.selectedCompany);

  // Create a list of vehicles for the selected company
  this.createVehicleList(this.selectedCompany);
}

getPersonByCompany(companyName: string) {
  // Filter persons based on the company name
  return this.person.filter(person => person.company === companyName);
}

getMapCoordinates(): [any[], boolean] {
  const value = true;
  if (this.selectedVehicle == null) {
      // Return coordinates of all vehicles if no vehicle is selected
      return [this.vehicles.map(vehicle => [vehicle.startCoordinate.latitude, vehicle.startCoordinate.longitude]), true];
  } else {
      // Return the formatted routes array if a vehicle is selected
      return [this.formattedRoutesArray, false];
  }
  return [[], true];
}

submitSelectedRoute() {
  var routeSubmit: RoutePoint[] = [];
  var personList: any = this.getPersonCheckboxValues("vehicle-personList-" + this.selectedVehicle.id);
  var count: number = 0;

  if (this.selectedRoute) {
      // Create a new route object
      var newRoute: Route = {
          id: 0,
          routeName: this.selectedRoute.description,
          vehicleId: this.selectedVehicle.id
      }

      // Save the new route using route service
      this.routeService.save(newRoute).subscribe(
          (response) => {
              console.log('Route point added successfully:', response);

              // Iterate through the selected route steps
              for (var step of this.selectedRoute.steps) {
                  var isHome = false;
                  for (var peop of personList) {
                      if (Number(step.id) >= 10000) {
                          isHome = true;
                          break;
                      }
                      if (Number(peop.id) == Number(step.id)) {
                          isHome = peop.checked;
                          break;
                      }
                      if ((Number(peop.id) + 1000) == Number(step.id)) {
                          isHome = peop.checked;
                          break;
                      }
                  }

                  // Create a new route point object
                  var RouteVar: RoutePoint = {
                      id: 0,
                      description: "" + response.id,
                      sequenz: count,
                      atHome: isHome,
                      vehicleId: this.selectedVehicle.id,
                      coordinateId: this.returnCoordId(step.location[1], step.location[0])
                  };
                  count++;

                  // Save the new route point using route point service
                  this.routePointService.save(RouteVar).subscribe(
                      (response) => { console.log('Route point added successfully:', response); },
                      (error) => { console.error('Error adding route point:', error); }
                  );
              }
          },
          (error) => { console.error('Error adding route:', error); }
      );
  }
}


public returnCoordId(lat: any, long: any) {
  // Default value - Vehicles can currently not be assigned due to mocking
  let coordinate_id = null;

  // Iterate through the person database to find matching coordinates
  for (let person of this.personDatabase) {
      // Check if the latitude and longitude match the start coordinate
      if ((person.startCoordinate.latitude == lat) && (person.startCoordinate.longitude == long)) {
          return person.startCoordinate.id;
      }

      // Check if the latitude and longitude match the end coordinate
      if ((person.endCoordinate.latitude == lat) && (person.endCoordinate.longitude == long)) {
          return person.endCoordinate.id;
      }
  }
  
  // Return null if no matching coordinates are found
  return null;
}

getPersonCheckboxValues(personListId: string): { id: string; checked: boolean }[] {
  const personCheckboxValues: { id: string; checked: boolean }[] = [];
  const personList = document.getElementById(personListId);
  
  if (personList) {
      const checkboxes = personList.getElementsByClassName("person-checkbox");

      // Iterate through all checkboxes to get their id and checked status
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

private isEqual(obj1: any, obj2: any): boolean {
  // Compare two objects for equality by converting them to JSON strings
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}


// Waits for vehicles to be loaded and resolves the promise once they are available
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

// Creates a list of vehicles, optionally filtering by company ID
createVehicleList(companyId?: number){
  let companyName = null;
  if(companyId != null){
    let companyName = this.returnSelectedCompany(companyId)?.companyName
  }

  const findPersonById = (id: number) => this.personDatabase.find(person => person.id === id);
  let vehicleList = document.getElementById("vehicle-list");
  let filteredVehicles = this.vehicles;

  if (companyName) {
     // Filter vehicles by company name if provided
    filteredVehicles = this.vehicles.filter(vehicle => vehicle.CompanyName == companyName);
    console.log(filteredVehicles);
  }

  if(vehicleList != null){
    //In case vehicleList is found, fill it with HTML Components
  let vehicleListHTML = '<style>.container{display:flex;flex-wrap:wrap;background-color:aqua;height:100vh;width:100%;margin:0!important;}.sidebar{position:relative;top:0;left:0;width:30%;height:100%;background-color:#fff;overflow-y:auto;padding:0 2rem;box-sizing:border-box;user-select:none;}.sidebar .fixedHeader{position:fixed;z-index:5;width:inherit;padding-right:5rem;height:7.5rem;background-color:#fff;}.sidebar .fixedHeader select{margin-right:5rem;}.sidebar .fixedHeader h2{text-transform:uppercase;font-weight:bolder;font-stretch:expanded;padding:0;margin-left:2rem;width:100%!important;}.map-outter-container{position:relative;flex:1;height:100%;background-color:#eeff00;overflow-y:auto;padding:0px!important;box-sizing:border-box;}.map-frame{height:100vh!important;}.map-container{box-sizing:border-box;position:relative!important;width:100%;}.sidebar{min-width:200px;}.sidebar li,.sidebar ul{list-style-type:none!important;padding-left:0!important;}.sidebar>ul{margin-top:10rem;}.vehicle-radio{margin-right:10px;}.vehicle-info{display:flex;flex-direction:column;line-height:1.2;}.vehicle-title{font-size:2rem;font-weight:300;color:#333;}.company-name{font-size:1.2rem;font-weight:900;color:#999;padding-left:0.1rem;}.seating-places{font-size:12px;color:#888;}.wheelchair-icon,.seating-icon{margin-top:5px;display:flex;font-size:1.6rem;padding-right:0.3rem;opacity:0.5;}.wheelchair-icon img,.seating-icon img{width:1.6rem;opacity:0.5;}.seating{display:flex;}.vehicle-label-outter{display:flex;align-items:center;cursor:pointer;transition:background-color 0.6s ease;flex-wrap:wrap;border-bottom:#ececec solid;}.vehicle-highlight{display:flex;align-items:center;cursor:pointer;transition:background-color 0.6s ease;flex-wrap:wrap;width:100%;padding:1.6rem 0 1.6rem 0;}.vehicle-highlight:hover{background-color:#d3d3d3!important;}.vehicle-highlight.selected .vehicle-icon{background-color:#277fc9;}.vehicle-label{display:flex;align-items:center;padding:1rem 2rem 1rem 1rem;cursor:pointer;transition:background-color 0.6s ease;}.vehicle-radio{display:none}.vehicle-selector{width:50px;height:50px;display:inline-block;border-radius:10px;overflow:hidden;cursor:pointer;transition:background-color 0.3s ease;}.vehicle-selector:hover{background-color:#f0f0f0;}.vehicle-icon{width:100%;height:100%;min-height:3.6rem;min-width:3.6rem;padding:1.2rem;border-radius:1.6rem;border:solid 0.3rem #e9e9e9;background-color:#f1f1f1;display:flex;align-items:center;}.selected .vehicle-selector{background-color:#4a90e2;}.vehicle-icon img{width:100%;opacity:1;max-width:3.6rem;max-height:3.6rem;}.vehicle-details{flex:1;}.selected .vehicle-selector{background-color:#4a90e2;}.selected .vehicle-icon img{filter:invert(100);}.shrunk{height:0!important;padding:0;opacity:0;overflow:hidden;transition:height 0.6s ease,padding 0.6s ease,opacity 0.3s ease-in;border:none!important;}.vehicle-label-outter:not(.shrunk){transition:height 0.6s ease,padding 0.6s ease,opacity 0.3s ease-in;}.shrunk>img{opacity:0.2;}.person-icon{width:auto;height:100%;min-height:3.6rem;min-width:3.6rem;padding:2rem 1.2rem 1.2rem 1.2rem;border-radius:1.6rem;border:solid 0.3rem #e9e9e9;background-color:#f1f1f1;display:flex;align-items:center;}.person-label{display:flex;align-items:center;cursor:pointer;padding:1.2rem 0;padding:1rem 0rem 1rem 0rem;width:100%!important;}.vehicle-label-outter .person-label:hover{background-color:#d3d3d3;}.person-list{width:100%!important;background-color:#fff;margin-bottom:-1.6rem;}.person-checkbox{padding:0 1rem 0 1rem;margin:0 1.5rem 0 1.5rem;}.person-checkbox[type=checkbox]{-ms-transform:scale(1.5);-moz-transform:scale(1.5);-webkit-transform:scale(1.5);-o-transform:scale(1.5);transform:scale(1.5);}.person-checkbox:checked+.person-icon img{filter:invert(100%);}.person-icon img{width:3.6rem;height:3.6rem;opacity:1;}.person-details{flex:1;}.person-title{font-size:2rem;font-weight:300;color:#333;}.person-details{flex:1;display:flex;flex-direction:column;}.person-name{font-size:1.6rem;font-weight:bold;color:#333;}.person-company{font-weight:900;font-size:1.2rem;color:#999;}.person-coordinates{font-size:1.2rem;color:#999;}.custom-select{appearance:none;-webkit-appearance:none;-moz-appearance:none;padding:8px;font-size:16px;border:1px solid #ccc;border-radius:5px;background-color:#f8f8f8;cursor:pointer;}.custom-select:focus{outline:none;border-color:#007bff;}.custom-select option{padding:0.8rem;font-size:1.6rem;cursor:pointer;}.fixedHeader{display:flex;align-items:center;}.submit{position:absolute;bottom:5rem;right:7.5rem;z-index:20000;}.hide{display:none;}.submit .btn.btn-primary{background:none;border:none;color:inherit;font:inherit;padding:0;cursor:pointer;outline:none;font-size:2rem;font-weight:600;color:#333;display:inline-block;font-size:2em;padding:1em 2em;margin-top:10rem;margin-bottom:6rem;-webkit-appearance:none;appearance:none;background-color:#f1f1f1;color:#333333;border-radius:1rem;border:none;cursor:pointer;position:relative;transition:transform ease-in 0.1s,box-shadow ease-in 0.25s;box-shadow:0 2px 25px rgba(255,255,255,0.5);}.submit .btn.btn-primary:focus{outline:0;}.submit .btn.btn-primary:active{transform:scale(0.9);background-color:darken(#f1f1f1,5%);box-shadow:0 2px 25px rgba(120,120,120,0.2);}.submit .btn.btn-primary.animate:before,.submit .btn.btn-primary.animate:after{position:absolute;content:``;display:block;width:140%;height:100%;left:-20%;z-index:-1000;transition:all ease-in-out 0.5s;background-repeat:no-repeat;}.submit .btn.btn-primary:before{display:none;top:-75%;background-image:radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,transparent 20%,#f1f1f1 20%,transparent 30%),radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,transparent 10%,#f1f1f1 15%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%);background-size:10% 10%,20% 20%,15% 15%,20% 20%,18% 18%,10% 10%,15% 15%,10% 10%,18% 18%;}.submit .btn.btn-primary:after{display:none;bottom:-75%;background-image:radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,transparent 10%,#f1f1f1 15%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%),radial-gradient(circle,#f1f1f1 20%,transparent 20%);background-size:15% 15%,20% 20%,18% 18%,20% 20%,15% 15%,10% 10%,20% 20%;}.submit .btn.btn-primary.animate:active:before{background-position:0% 80%,0% 20%,10% 40%,20% 0%,30% 30%,22% 50%,50% 50%,65% 20%,90% 30%;}.submit .btn.btn-primary.animate:active:after{background-position:0% 90%,20% 90%,45% 70%,60% 110%,75% 80%,95% 70%,110% 10%;background-size:0% 0%,0% 0%,0% 0%,0% 0%,0% 0%,0% 0%,0% 0%;}.submit .btn.btn-primary.animate:before{display:block;animation:topBubbles ease-in-out 0.75s forwards;}.submit .btn.btn-primary.animate:after{display:block;animation:bottomBubbles ease-in-out 0.75s forwards;}@keyframes topBubbles{0%{background-position:5% 90%,10% 90%,10% 90%,15% 90%,25% 90%,25% 90%,40% 90%,55% 90%,70% 90%;}50%{background-position:0% 80%,0% 20%,10% 40%,20% 0%,30% 30%,22% 50%,50% 50%,65% 20%,90% 30%;}100%{background-position:0% 70%,0% 10%,10% 30%,20% -10%,30% 20%,22% 40%,50% 40%,65% 10%,90% 20%;background-size:0% 0%,0% 0%,0% 0%,0% 0%,0% 0%,0% 0%;}}@keyframes bottomBubbles{0%{background-position:10% -10%,30% 10%,55% -10%,70% -10%,85% -10%,70% -10%,70% 0%;}50%{background-position:0% 80%,20% 80%,45% 60%,60% 100%,75% 70%,95% 60%,105% 0%;}100%{background-position:0% 90%,20% 90%,45% 70%,60% 110%,75% 80%,95% 70%,110% 10%;background-size:0% 0%,0% 0%,0% 0%,0% 0%,0% 0%,0% 0%;}}</style>';
  for(let vehicleObj of filteredVehicles){
    vehicleListHTML +=  
    `<li><label class="vehicle-label-outter">    
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
          ` </div></div></div><div class="person-list" *ngIf="selectedVehicle">
            <!--<h3>${vehicleObj.CompanyName} Employees:</h3>-->
            <ul id="vehicle-personList-${vehicleObj.id}" class="vehicle-personList">  
            </ul></div></label></li>`
    }


    vehicleList!.innerHTML = vehicleListHTML;

    // Highlight the selected vehicle in the select box
    for (let vehicleObj of filteredVehicles) {
      const highlight = document.getElementById(`vehicle-highlight-`+ vehicleObj.id);
      if (highlight) {
          highlight.addEventListener('click', (event) => {
              this.selectCheckbox(vehicleObj, event);
          });
      }
  }
  }
  }

  populateSelectBox() {
    // Fetch all transport providers
    this.transportProviderService.getAllTransportProviders().subscribe(
        (data: any[]) => {
            // Update local database with fetched data
            this.transportProvidersDatabase = data.map(transportProvider => ({
                id: transportProvider.id,
                companyName: transportProvider.companyName,
            }));
            this.transportProviders = this.transportProvidersDatabase;

            // Update the select box with the new transport providers
            this.updateSelectBox();
        },
        (error) => {
            console.error('Error fetching transport provider data:', error);
        }
    );
}

// Updates the select box with the current list of transport providers
updateSelectBox() {
  // Initialize the HTML string for the select options
  let selectOptionsHtml = '<option></option>';
  for (let transportProvider of this.transportProviders) {
      // Append each transport provider as an option
      selectOptionsHtml += `<option value="${transportProvider.id}">${transportProvider.companyName}</option>`;
  }

  // Get the select box element by its ID
  const selectBox = document.getElementById('custom-select-box');
  if (selectBox) {
      // Set the inner HTML of the select box to the generated options
      selectBox.innerHTML = selectOptionsHtml;
  } else {
      console.error('Select box element not found.');
  }
}


// This function simply awaits Vehicle Data
async getFilteredVehicles(): Promise<VehicleLocal[]>  {
  await this.waitForVehicles();
  //Update the available Person list
  this.person = this.personDatabase;
  //Print the results to the map
  this.getMapCoordinates();

  if(this.selectedCompany == null){
    //If no company was selected, the entire system can be updated with recent data
    this.populateSelectBox();
    this.createVehicleList();
  }

    return this.vehicles;
}

async getFilteredVehiclesById(id: number): Promise<VehicleLocal[]>  {
  this.vehicles = []; //Reset Vehicle List to await new one
  try {
    // Wait for vehicles to be fetched
    await this.getVehiclesById(id);
  } catch (error) {
    console.error('Error during getVehiclesById:', error);
    return [];
  }

  this.person = this.personDatabase;
  this.getMapCoordinates();
  this.createVehicleList();
  return this.vehicles;
}

returnSelectedCompany(id: number): TransportProvider | null {
  return this.transportProviders.find(company => company.id == this.selectedCompany);
}

async getCompanyRoute() {
  // Assign selected vehicle if not already assigned
  if (!this.selectedVehicle) {
    this.selectedVehicle = this.vehicles.find(vehicle => vehicle.id === this.extractSelectedVehicleId());
  }

  //There is a selected vehicle, for which calculation is possible
  if (this.selectedVehicle && this.selectedVehicle.id !== undefined) {
    try {
      //Await the caluclation of the routePoints
      let response = await this.calculateRoute();
      let displayRoute = null;
      if (response && response.routes) {
        for (const route of response.routes) {
          if (route.vehicle === this.selectedVehicle.id) {
            displayRoute = route;
            break;
          }
        }
      } else {
        //In case no route was found, an empty route is returned
        response = {
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

      this.formattedRoutesArray = this.formatMultiRouteData(response);
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  }
}

formatMultiRouteData(optimizationOutput: any): RouteFormat[]{
  var routesArray: RouteFormat[] = [];
   // Iterate over each route in optimizationOutput.routes
  for(var routee of optimizationOutput.routes){
      // Call formatData for each route and concatenate the resulting arrays
      routesArray = [...routesArray, ... (this.formatData(routee))];
    }
    // Assuming createDriverPlan modifies or uses routesArray internally
    //this.createDriverPlan(routesArray);
    return routesArray;
}


  

formatData(routeObj: any): RouteFormat[]{
  const routesArray: RouteFormat[] = [];
  let count:number = 0;
  // Iterate through each step in routeObj.steps
  for (const step of routeObj.steps) {
      // Determine the ID based on step type (start/end or regular step)
      let addRoute: RouteFormat = {
        routeName: routeObj.description,
        id: (step.type == "start" ||step.type == "end") ? routeObj.vehicle + 10000 : step.id, // Assign vehicle ID adjusted by 10000 for start/end steps
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
    const findPersonById = (id: number) => this.personDatabase.find(person => person.id === id);
    let personList = document.getElementById("vehicle-personList-" + vehicleId);
    if(personList != null){
    let personListHTML = '<style>.person-icon { width: auto; height: 100%; min-height: 3.6rem; min-width: 3.6rem; padding: 2rem 1.2rem 1.2rem 1.2rem; border-radius: 1.6rem; border: solid 0.3rem #E9e9e9; background-color: #F1F1F1; display: flex; align-items: center;margin: 0 2rem 0 2rem; }    .person-label { display: flex; align-items: center; cursor: pointer; padding: 1.2rem 0; padding: 1rem 0rem 1rem 0rem; width: 100% !important; } .vehicle-label-outter .person-label:hover{ background-color: #D3D3D3; }.person-list{ width: 100% !important; background-color: #ffffff; margin-bottom: -1.6rem; }.person-checkbox { padding: 0 1rem 0 1rem; margin: 0 1.5rem 0 1.5rem; }.person-checkbox[type=checkbox] { -ms-transform: scale(1.5); -moz-transform: scale(1.5); -webkit-transform: scale(1.5); -o-transform: scale(1.5); transform: scale(1.5); }.person-checkbox:checked + .person-icon img { filter: invert(100%); }.person-icon img { width: 3.6rem; height: 3.6rem; opacity: 1; }.person-details { flex: 1; }.person-title { font-size: 2rem; font-weight: 300; color: #333; }.person-details { flex: 1; display: flex; flex-direction: column; }.person-name { font-size: 1.6rem; font-weight: bold; color: #333; }.person-company{ font-weight: 900; font-size: 1.2rem; color: #999; }.person-coordinates { font-size: 1.2rem; color: #999; }</style>';

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

      //Categorize steps by ID 

      if(step?.id < 1000){
        let person = findPersonById(step?.id);

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
                     <span class="person-coordinates">`+person.startCoordinate.latitude + `, `+  person.startCoordinate.longitude + `</span>
                </div>
                <div class="checkbox">
                    <input type="checkbox" name="person" class="person-checkbox" [value]="person_selection" id="checkbox-person-`+ person.id + `" checked>
                </div>
            </label>
        </li>`;

      }

      if(step?.id > 1000 && step?.id < 10000 ){
        let person = findPersonById(step?.id - 1000);
        personListHTML +=  `
        <li>
            <label class="person-label">
                <div class="person-icon">
                    <img src="../../assets/right-from-bracket-solid.svg" alt="Person Icon">
                </div>
                <div class="person-details">
                    <span class="person-name">` + person.firstName + " " + person.lastName + `</span>
                      <span class="person-company">`+ person.targetAddress.streetName + " " + person.targetAddress.doorNumber + " " + person.targetAddress.city + `</span>
                     <span class="person-coordinates">`+ person.startCoordinate.latitude + `, `+  person.startCoordinate.longitude + `</span>
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
    document.querySelectorAll('.person-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('click', (event) => {
        const target = event.target as HTMLInputElement;
        handleCheckboxClick(target);
      });
    });
    }
  }

  
  getVehiclesById(id: number): Promise<void> {
    //Needs to be comined with an async await
    //Returns vehicles based on corporate id - Be carefull Transportprovider and vehicletp id is not the same
    return new Promise((resolve, reject) => {
      this.vehicleService.getVehiclesByTransportProviderId(id).subscribe(
        (data: any[]) => {
          this.vehicles = data.map(vehicle => ({
            id: vehicle.id,
            CompanyName: vehicle.companyName,
            startCoordinate: {
              id: vehicle.startCoordinate.id,
              longitude: parseFloat(findCoordinates(vehicle.startCoordinate.id, this.coordinates).longitude),
              latitude: parseFloat(findCoordinates(vehicle.startCoordinate.id, this.coordinates).latitude),
            },
            endCoordinate: {
              id: vehicle.endCoordinate.id,
              longitude: parseFloat(findCoordinates(vehicle.endCoordinate.id, this.coordinates).longitude),
              latitude: parseFloat(findCoordinates(vehicle.endCoordinate.id, this.coordinates).latitude),
            },
            canTransportWheelchairs: vehicle.canTransportWheelchairs === 1,
            VehicleDescription: vehicle.vehicleDescription || "No Description",
            seatingPlaces: vehicle.seatingPlaces,
          }));
          resolve();  // Resolve the promise when done
        },
        (error) => {
          console.error('Error fetching vehicle data:', error);
          reject(error);  // Reject the promise on error
        }
      );
    });
  }
  

createRoutes(vehicles: VehicleLocal[], person: PersonLocal[]): RouteMapPoint[] {
  const routes: RouteMapPoint[] = [];

  // Group person by company
  const personByCompany: {[key: string]: PersonLocal[]} = {};
  person.forEach(person => {
    const companyName = person.transportProvider?.companyName || '';
      if (!personByCompany[companyName]) {
          personByCompany[companyName] = [];
      }
      personByCompany[companyName].push(person);
  });

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

      // Create routePoint for the vehicle
      const route: RouteMapPoint = {
          vehicle_id: vehicle.id,
          start_location: [vehicle.startCoordinate.longitude, vehicle.startCoordinate.latitude],
          end_location: [vehicle.endCoordinate.longitude, vehicle.endCoordinate.latitude],
          person: assignedPerson
      };
      routes.push(route);
  });

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
  //Leave API Code here fore easier reuse
  let Optimization = new Openrouteservice.Optimization({api_key: "5b3ce3597851110001cf6248d4673641728346c68523ae8c4c8158aa"});
  let selectedPerson = this.person;

  //Mitigate lacking person validation
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

  const shipmentsForOptimization = selectedPerson.map(person => ({
    amount: [1], 
    skills: [(person.wheelchair ? 2 : 1)],
    pickup: {
        id: person.id, 
        name: "",
        service: 300,
        location: [person.startCoordinate.longitude, person.startCoordinate.latitude] 
    },
    delivery: {
        id: person.id+1000,
        name: "", 
        service: 300, 
        location: [person.endCoordinate.longitude, person.endCoordinate.latitude]
    }
  }));
  
  let selectedVehicles = this.vehicles;

    //Mitigate lacking vehicle validation
  selectedVehicles = selectedVehicles.filter(e => {
    const startLatitude = e.startCoordinate.latitude != null ? e.startCoordinate.latitude : 0;
    const endLatitude = e.endCoordinate.latitude != null ? e.endCoordinate.latitude : 0;
    const startLongitude = e.startCoordinate.longitude != null ? e.startCoordinate.longitude : 0;
    const endLongitude = e.endCoordinate.longitude != null ? e.endCoordinate.longitude : 0;

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

  const vehiclesForOptimization = selectedVehicles.map(vehicle => ({
    id: vehicle.id,
    description: vehicle.VehicleDescription + " " + vehicle.CompanyName + " " + vehicle.id + " " + Math.floor((Math.random() * 9999999999) + 1),
    profile: 'driving-car',
    start: [vehicle.startCoordinate.longitude, vehicle.startCoordinate.latitude],
    end: [vehicle.endCoordinate.longitude, vehicle.endCoordinate.latitude],
    capacity: [vehicle.seatingPlaces],
    max_tasks: 10,
    skills: (vehicle.canTransportWheelchairs ? [1, 2] : [1]),
  }));

  //Display the output data in the console, 

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

    //Default Icon in case no people were found for the selected vehicle

    console.error("Error occurred while calculating route:", error);
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

vehicles$!: Observable<Vehicle[]>;

ngOnInit(): void {
  //Populate People Database  
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

  // Populate Coordinate Database
  this.coordinatesService.getAllCoordinates().subscribe(
    (data: any[]) => {
      this.coordinates = data.map(coordinate => ({
        id: coordinate.id,
        longitude: parseFloat(coordinate.longitude),
        latitude: parseFloat(coordinate.latitude)
      }));



      this.vehicleService.getAllVehicles().subscribe(
        (data: any[]) => { 
         // console.log(data);    
         // console.log(parseFloat(findCoordinates(1102, this.coordinates).longitude));
      
          this.vehicles = data.map(vehicle => ({
            id: vehicle.id,
            CompanyName: vehicle.companyName,
            
            startCoordinate: { 
              id: vehicle.startCoordinate.id,
              longitude: parseFloat(findCoordinates(vehicle.startCoordinate.id, this.coordinates).longitude), /*parseFloat(vehicle.startCoordinates.longitude)*/
              latitude:  parseFloat(findCoordinates(vehicle.startCoordinate.id, this.coordinates).latitude) /*parseFloat(vehicle.startCoordinates.latitude)*/, 
            },
             endCoordinate: { 
              id: vehicle.endCoordinate.id,
              longitude: parseFloat(findCoordinates(vehicle.endCoordinate.id, this.coordinates).longitude), /*parseFloat(vehicle.startCoordinates.longitude)*/
              latitude:  parseFloat(findCoordinates(vehicle.endCoordinate.id, this.coordinates).latitude) /*parseFloat(vehicle.startCoordinates.latitude)*/, 
         
            },
            canTransportWheelchairs: (vehicle.canTransportWheelchairs == 1) ? true : false,
            VehicleDescription: vehicle.vehicleDescription ? vehicle.vehicleDescription : "No Description",
            seatingPlaces: vehicle.seatingPlaces
          }));
        },
      (error) => { console.error('Error fetching vehicle data:', error);}
    );

    },
    (error) => { console.error('Error fetching coordinates data:', error); }
  );

  this.getFilteredVehicles();
}

}

function findCoordinates(id: number, coordinates: any[]){
  const foundCoordinate = coordinates.find(coord => coord.id === id);
  if (foundCoordinate) {
    return {
      id: foundCoordinate.id,
      longitude: foundCoordinate.longitude,
      latitude: foundCoordinate.latitude
    };
  } else {

    // Due to unsynchronized backend and lacking error validation for coordinate upload, generate random coordinates values in case of error to display values nevertheless
    let longitude = (Math.random() * (15 - 13) + 13).toFixed(4).toString();
    let latitude = (Math.random() * (48.5 - 47) + 47).toFixed(4).toString();
    console.error("Random Coordinates: Coordinate ID is not assigned");

    return {
      // Database Coordinates are not synced!
      id: id,
      longitude:longitude,
      latitude: latitude
    };
  }
}

// Unselect destination in case a person is unselected
function handleCheckboxClick(checkbox: HTMLInputElement) {
  let personId = extractPersonId(checkbox.id);
  if (personId < 1000) {
    var target = (document.getElementById('checkbox-person-' + (personId + 1000)) as HTMLInputElement);
    target.checked = false;
  } 
}

function extractPersonId(checkboxId: string): number {
  const regex = /checkbox-person-(\d+)/;
  const match = checkboxId.match(regex);
  return match ? parseInt(match[1], 10) : 0;
}