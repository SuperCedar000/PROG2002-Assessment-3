import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="main-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <span class="brand-icon">🎗️</span>
          <span class="brand-text">Charity Events Platform</span>
        </div>
        <div class="nav-links">
          <a routerLink="/" class="nav-link">Home</a>
          <a routerLink="/manage" class="nav-link">Management</a>
        </div>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.css']
})
export class App {
  title = 'charity-events';
}