import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RoutePoint } from '../RoutePoint/route-point'

@Injectable({
  providedIn: 'root'
})
export class RoutePointService {

  private baseurl = 'http://localhost:8080/'; 

  constructor(private http: HttpClient) { }

  getAllRoutePoints(): Observable<RoutePoint[]> {
    return this.http.get<RoutePoint[]>(this.baseurl + 'RoutePoints');
  }
  
  /*
  public save(route_point: RoutePoint){
    return this.http.post<RoutePoint>(this.baseurl + 'RoutePoints', route_point);
  }
*/
  public findAll(): Observable<RoutePoint[]>{
    return this.http.get<RoutePoint[]>(this.baseurl + 'RoutePoints');
  }

}

