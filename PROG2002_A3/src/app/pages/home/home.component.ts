import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  events: Event[] = [];
  loading = false;

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;
    this.eventService.getEvents().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.events = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.loading = false;
      }
    });
  }

  isUpcoming(event: Event): boolean {
    const now = new Date();
    const eventDate = new Date(event.event_date);
    return eventDate >= now && event.is_active;
  }

  getUpcomingEvents(): Event[] {
    const now = new Date();
    return this.events.filter(event => 
      new Date(event.event_date) >= now && event.is_active
    );
  }

  getPastEvents(): Event[] {
    const now = new Date();
    return this.events.filter(event => 
      new Date(event.event_date) < now && event.is_active
    );
  }

  getPausedEvents(): Event[] {
    return this.events.filter(event => !event.is_active);
  }

  viewEventDetails(eventId: number) {
    this.router.navigate(['/events']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US');
  }
}