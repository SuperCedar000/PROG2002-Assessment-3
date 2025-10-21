import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter, RouterOutlet, Routes } from '@angular/router';
import { Home } from './app/pages/home/home';
import { Manage } from './app/pages/manage/manage';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'manage', component: Manage },
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes)  // 直接在这里注入路由
  ]
});
