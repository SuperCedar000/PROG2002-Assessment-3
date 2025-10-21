import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { SearchPage } from './pages/search/search';
import { EventDetailPage } from './pages/event-detail/event-detail';
import { RegisterPage } from './pages/register/register';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },  // 添加 home 路径
  { path: 'event/:id', component: EventDetailPage },  // 添加带参数的路由
  { path: 'register/:id', component: RegisterPage },  // 添加带参数的路由
  { path: 'search', component: SearchPage },  // 添加 search 路径
  { path: 'event-detail', component: EventDetailPage },  // 保留原有路径
  { path: 'register', component: RegisterPage },  // 保留原有路径
];