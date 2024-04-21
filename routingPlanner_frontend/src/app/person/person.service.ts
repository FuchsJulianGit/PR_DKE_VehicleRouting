import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Person } from '../Interfaces/route-point';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private baseUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  getAllPeople(): Observable<Person[]> {
    return this.http.get<Person[]>(this.baseUrl + 'people');
  }
  
  save(people: Person): Observable<Person> {
    return this.http.post<Person>(this.baseUrl + 'addPerson', people);
  }

}
