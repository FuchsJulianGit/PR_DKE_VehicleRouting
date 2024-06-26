import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TransportProvider } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TransportProviderService {

  private baseUrl = 'http://localhost:8082/transportProvider'; 

  constructor(private http: HttpClient) { }

  getAllTransportProviders(): Observable<TransportProvider[]> {
    return this.http.get<TransportProvider[]>(this.baseUrl);
  }

  // Return transportProviderById as there is no endpoint for getting the ID
  getTransportProviderById(id: number): Observable<TransportProvider> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<TransportProvider>(url);
  }


}
