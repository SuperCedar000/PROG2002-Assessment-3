import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {

  organisations = [
    {
      name: "Welcome to Our Common Home",
      description: "Here, every kindness is not in vain, every helping hand is meaningful.",
      contact: "contaxx@redcross.com.au"
    },
    {
      name: "Our Mission: Ignite Hope, Pass on Dignity, Reshape the Future.",
      description: "We are committed to providing sustainable support for the most vulnerable groups.",
      contact: "inxxo@cancomr.org.au"
    },
    {
      name: "Because of You, We Believe Change is Happening.",
      description: "Every donation, forward, volunteer service, and even a sincere share creates ripples that push the world toward goodness.",
      contact: "enquirs@wwf.com.au"
    }
  ];

  stats = [
    { icon: '💰', number: '10.9 billion USD', label: 'Funding Amount' },
    { icon: '🏢', number: '300 Enterprises', label: 'Cooperative Institutions' },
    { icon: '📊', number: '200 Projects', label: 'Funded Projects' }
  ];

  events: any[] = [];
  upcomingEvents: any[] = [];
  pastEvents: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (res: any) => {
        const data = res.data ? res.data : res;
        this.events = data;
        this.splitEvents();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Failed to load events:', err);
        this.errorMessage = 'Unable to load events.';
        this.loading = false;
      }
    });
  }

  splitEvents(): void {
    const now = new Date();
    this.upcomingEvents = this.events.filter(e => new Date(e.event_date) >= now);
    this.pastEvents = this.events.filter(e => new Date(e.event_date) < now);
  }

  getEventStatus(event: any): string {
    const now = new Date();
    const date = new Date(event.event_date);
    if (!event.is_active) return 'paused';
    if (date >= now) return 'upcoming';
    return 'past';
  }

  getStatusText(event: any): string {
    const s = this.getEventStatus(event);
    if (s === 'upcoming') return 'Upcoming';
    if (s === 'past') return 'Ended';
    if (s === 'paused') return 'Suspended';
    return 'Unknown';
  }

  viewEventDetails(id: number): void {
    window.location.href = `/event/${id}`;
  }
}
