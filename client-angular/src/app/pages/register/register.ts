import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegistrationService } from '../../services/registration.service';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule,
    RouterModule  // 添加这行以支持 routerLink
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterPage implements OnInit {
  selectedEvent: any = null;
  events: any[] = [];
  formData = {
    event_id: '',
    user_name: '',
    email: '',
    phone: '',
    tickets: 1
  };
  loading = false;
  message = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router, // 改为 public 以便在模板中使用
    private registrationService: RegistrationService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loadEvents();
    
    // 从路由参数获取事件ID
    this.route.params.subscribe(params => {
      const eventId = params['id'];
      if (eventId) {
        this.formData.event_id = eventId;
        this.loadEventDetails(eventId);
      }
    });
  }

  loadEvents() {
    this.eventService.getEvents().subscribe({
      next: (res: any) => {
        this.events = res.data || res;
      },
      error: (err: any) => {
        console.error('Failed to load events:', err);
      }
    });
  }

  loadEventDetails(eventId: string) {
    this.eventService.getEventById(parseInt(eventId)).subscribe({
      next: (res: any) => {
        this.selectedEvent = res.data || res;
      },
      error: (err: any) => {
        console.error('Failed to load event details:', err);
      }
    });
  }

  submitRegistration() {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.message = '';

    const registrationData = {
      ...this.formData,
      event_id: parseInt(this.formData.event_id)
    };

    console.log('提交注册数据:', registrationData);

    this.registrationService.createRegistration(registrationData).subscribe({
      next: (response: any) => {
        console.log('注册成功响应:', response);
        this.message = `🎉 Registration successful! Thank you ${this.formData.user_name}.`;
        this.formData.user_name = '';
        this.formData.email = '';
        this.formData.phone = '';
        this.formData.tickets = 1;
        this.loading = false;
        
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (error: any) => {
        console.error('注册失败:', error);
        this.message = `❌ Registration failed: ${error.error?.message || 'Please try again.'}`;
        this.loading = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.formData.event_id) {
      this.message = 'Please select an event.';
      return false;
    }
    if (!this.formData.user_name.trim()) {
      this.message = 'Please enter your name.';
      return false;
    }
    if (!this.formData.email.trim() || !this.isValidEmail(this.formData.email)) {
      this.message = 'Please enter a valid email address.';
      return false;
    }
    if (this.formData.tickets < 1) {
      this.message = 'Please enter at least 1 ticket.';
      return false;
    }
    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onEventChange(event: any) {
    const eventId = event.target.value;
    this.formData.event_id = eventId;
    if (eventId) {
      this.loadEventDetails(eventId);
    } else {
      this.selectedEvent = null;
    }
  }

  // 可选：添加导航方法作为备选
  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToEventDetail() {
    this.router.navigate(['/event-detail']);
  }

  navigateToSearch() {
    this.router.navigate(['/search']);
  }
}