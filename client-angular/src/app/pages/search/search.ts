import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class SearchPage {
  keyword: string = '';
  category: string = '';
  categories: any[] = [];
  events: any[] = [];
  resultsTitle: string = 'Please enter search criteria';

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCategories();
    this.loadAllEvents();
  }

  loadCategories() {
    this.http.get<any>(`${this.apiUrl}/categories`).subscribe({
      next: res => {
        this.categories = res.data || [];
      },
      error: err => {
        console.error('❌ Failed to load categories:', err);
      }
    });
  }

  performSearch() {
    const params: any = {};
    if (this.keyword) params.keyword = this.keyword;
    if (this.category) params.category = this.category;

    this.http.get<any>(`${this.apiUrl}/events/search`, { params }).subscribe({
      next: res => {
        this.events = res.data || [];
        this.resultsTitle =
          this.events.length > 0
            ? `Search Results for "${this.keyword || 'All'}"`
            : 'No matching results found';
      },
      error: err => {
        console.error('❌ Search failed:', err);
      }
    });
  }

  clearSearch() {
    this.keyword = '';
    this.category = '';
    this.resultsTitle = 'Please enter search criteria';
    this.loadAllEvents();
  }

  loadAllEvents() {
    this.http.get<any>(`${this.apiUrl}/events`).subscribe({
      next: res => {
        this.events = res.data || [];
      },
      error: err => {
        console.error('❌ Failed to load events:', err);
      }
    });
  }

  viewEventDetails(id: number) {
    alert(`Clicked event ID: ${id}`);
  }
}
