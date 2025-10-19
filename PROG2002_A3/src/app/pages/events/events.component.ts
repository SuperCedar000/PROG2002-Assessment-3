import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  error: string = '';
  expandedEventId: number | null = null;

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;
    this.error = '';
    
    this.eventService.getEvents().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.events = response.data;
        } else {
          this.error = response.message || 'Failed to load events';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load events: ' + error.message;
        this.loading = false;
        console.error('Error loading events:', error);
      }
    });
  }

  toggleEventDetails(eventId: number) {
    this.expandedEventId = this.expandedEventId === eventId ? null : eventId;
  }

  registerForEvent(eventId: number) {
    this.router.navigate(['/register', eventId]);
  }

  calculateProgress(current: number, goal: number): number {
    if (!goal || goal === 0) return 0;
    return Math.min(100, Math.round((current / goal) * 100));
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}