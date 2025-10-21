// home.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  events: any[] = [];  // 存放从 API 获取的事件数据
  isLoading: boolean = true;
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.isLoading = true;
    this.error = '';
    
    // 使用管理端 API (端口 3001)
    this.http.get('http://localhost:3001/api/events').subscribe({
      next: (result: any) => {
        if (result.success) {
          this.events = result.data || [];
        } else {
          this.error = result.message || 'Failed to fetch events';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to fetch events:', error);
        this.error = 'Failed to load events data, please check server connection';
        this.events = [];
        this.isLoading = false;
      }
    });
  }
}