import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Coordinates, Vehicle } from '../Interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})

export class CoordinatesService {

  private baseUrl = 'http://localhost:8082/coordinates';

  constructor(private http: HttpClient) { }

  getAllCoordinates(): Observable<Coordinates[]> {
    return this.http.get<Coordinates[]>(this.baseUrl);
  }

  getCoordinatesById(id: number): Observable<Coordinates | undefined> {
    return this.getAllCoordinates().pipe(
      map(coordinates => coordinates.find(coordinate => coordinate.id === id))
    );
  }

  save(coordinates: Coordinates): Observable<Coordinates> {
    return this.http.post<Coordinates>(this.baseUrl, coordinates);
  }
}
