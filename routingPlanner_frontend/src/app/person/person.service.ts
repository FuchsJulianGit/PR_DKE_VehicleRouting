import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Person } from '../Interfaces/route-point';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  //private baseUrl = 'http://localhost:8080/';
  private baseUrl = 'http://localhost:8082/';




  constructor(private http: HttpClient) { }

  getAllPerson(): Observable<Person[]> {
    return this.http.get<Person[]>(this.baseUrl + 'person');
  }
  
  save(person: Person): Observable<Person> {
    return this.http.post<Person>(this.baseUrl + 'addPerson', person);
  }

}
