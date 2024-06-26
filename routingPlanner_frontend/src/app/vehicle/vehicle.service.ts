import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Vehicle } from '../Interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

 //private baseUrl = 'http://localhost:8080/vehicles'; 
  private baseUrl = 'http://localhost:8081/vehiclesByTransportProviderId';

  constructor(private http: HttpClient) { }

  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.baseUrl + '/1');
  }

  getVehiclesByTransportProviderId(transportProviderId: number): Observable<Vehicle[]> {

    console.log("Selected Id: " + transportProviderId);

    const url = this.baseUrl + "/" + transportProviderId;
    return this.http.get<Vehicle[]>(url);
  }

  save(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.baseUrl, vehicle);
  }

}
