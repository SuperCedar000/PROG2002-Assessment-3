import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  createRegistration(registrationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrations`, registrationData);
  }

  getEventRegistrations(eventId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/events/${eventId}`);
  }
}