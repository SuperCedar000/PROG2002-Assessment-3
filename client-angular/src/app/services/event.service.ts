import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://127.0.0.1:3000/api/events'; // 你的 Node.js API 地址

  constructor(private http: HttpClient) {}

  // 获取所有活动
  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 根据 ID 获取单个活动
  getEventById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // 注册活动
  registerEvent(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
}
