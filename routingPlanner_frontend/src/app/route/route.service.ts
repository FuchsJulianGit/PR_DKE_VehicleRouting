import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Route } from '../Interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private baseUrl = 'http://localhost:8080/Route'; 

  constructor(private http: HttpClient) { }

  getAllRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>(this.baseUrl);
  }

  save(route: Route): Observable<Route> {
    console.log(route);
    return this.http.post<Route>(this.baseUrl, route);
  }

}
