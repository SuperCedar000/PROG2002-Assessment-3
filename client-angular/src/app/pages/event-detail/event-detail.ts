import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.css']
})
export class EventDetailPage implements OnInit {
  events: any[] = [];
  expandedId: number | null = null;
  loading = false;
  errorMessage = '';
  selectedEvent: any = null;
  showEventDetail = false;
  allRegistrations: any[] = []; // 新增：所有注册记录

  constructor(
    private http: HttpClient, 
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loadEvents();
    this.loadAllRegistrations(); // 新增：加载所有注册记录
  }

  loadEvents() {
    this.loading = true;
    this.http.get<any>('http://localhost:3000/api/events').subscribe({
      next: (response) => {
        this.events = response.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ 获取活动失败:', err);
        this.errorMessage = '无法加载活动，请稍后再试。';
        this.loading = false;
      }
    });
  }

  // 新增：加载所有注册记录
  loadAllRegistrations() {
    this.http.get<any>('http://localhost:3000/api/registrations').subscribe({
      next: (response) => {
        this.allRegistrations = response.data || [];
        console.log('📊 所有注册记录:', this.allRegistrations);
      },
      error: (err) => {
        console.error('❌ 获取注册记录失败:', err);
      }
    });
  }

  toggleEventDetails(id: number) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  isExpanded(id: number): boolean {
    return this.expandedId === id;
  }

  registerForEvent(eventId: number) {
    const selectedEvent = this.events.find(e => e.id === eventId);
    if (!selectedEvent) return;

    this.router.navigate(['/register'], {
      queryParams: {
        id: selectedEvent.id,
        name: selectedEvent.name,
        organisation: selectedEvent.organisation_name,
        price: selectedEvent.ticket_price
      }
    });
  }

  viewEventDetails(eventId: number) {
    this.loading = true;
    this.eventService.getEventById(eventId).subscribe({
      next: (res: any) => {
        this.selectedEvent = res.data || res;
        this.showEventDetail = true;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ 获取活动详情失败:', err);
        this.errorMessage = '无法加载活动详情，请稍后再试。';
        this.loading = false;
      }
    });
  }

  backToEventList() {
    this.showEventDetail = false;
    this.selectedEvent = null;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // 新增：获取特定活动的注册记录
  getEventRegistrations(eventId: number): any[] {
    return this.allRegistrations.filter(reg => reg.event_id === eventId);
  }

  // 新增：获取活动名称
  getEventName(eventId: number): string {
    const event = this.events.find(e => e.id === eventId);
    return event ? event.name : `Event #${eventId}`;
  }
}