import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RoutePoint, Person, Vehicle } from '../interfaces/interfaces'

@Injectable({
  providedIn: 'root'
})
export class RoutePointService {

  private baseurl = 'http://localhost:8080/'; 

  constructor(private http: HttpClient) { }

  getAllRoutePoints(): Observable<RoutePoint[]> {
    return this.http.get<RoutePoint[]>(this.baseurl + 'RoutePoints');
  }
  
  save(route_point: any): Observable<RoutePoint> {
    return this.http.post<any>(this.baseurl + 'addRoutePoint', route_point);
  }

  public findAll(): Observable<RoutePoint[]>{
    return this.http.get<RoutePoint[]>(this.baseurl + 'RoutePoints');
  }

}

