import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, Category, Registration, ApiResponse } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<ApiResponse<Event[]>> {
    return this.http.get<ApiResponse<Event[]>>(`${this.apiUrl}/events`);
  }

  getEventById(id: number): Observable<ApiResponse<Event>> {
    return this.http.get<ApiResponse<Event>>(`${this.apiUrl}/events/${id}`);
  }

  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories`);
  }

  searchEvents(keyword?: string, category?: string): Observable<ApiResponse<Event[]>> {
    let url = `${this.apiUrl}/events/search`;
    const params = [];
    
    if (keyword) params.push(`keyword=${encodeURIComponent(keyword)}`);
    if (category) params.push(`category=${category}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return this.http.get<ApiResponse<Event[]>>(url);
  }

  createRegistration(registration: Registration): Observable<ApiResponse<Registration>> {
    return this.http.post<ApiResponse<Registration>>(`${this.apiUrl}/registrations`, registration);
  }

  getEventRegistrations(eventId: number): Observable<ApiResponse<Registration[]>> {
    return this.http.get<ApiResponse<Registration[]>>(`${this.apiUrl}/events/${eventId}/registrations`);
  }

  createEvent(event: Event): Observable<ApiResponse<Event>> {
    return this.http.post<ApiResponse<Event>>(`${this.apiUrl}/events`, event);
  }

  updateEvent(eventId: number, event: Event): Observable<ApiResponse<Event>> {
    return this.http.put<ApiResponse<Event>>(`${this.apiUrl}/events/${eventId}`, event);
  }

  deleteEvent(eventId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/events/${eventId}`);
  }
}