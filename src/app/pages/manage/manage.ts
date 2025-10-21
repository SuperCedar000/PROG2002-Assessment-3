// manage.ts - 完整修复版
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './manage.html',
  styleUrls: ['./manage.css']
})
export class Manage implements OnInit {
  
  events: any[] = [];
  categories: any[] = [];
  isEditing: boolean = false;
  currentEvent: any = {};
  isLoading: boolean = true;
  error: string = '';
  success: string = '';

  // 管理端专用 API 地址 - 使用端口 3001
  private managementApi = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadEvents();
    this.loadCategories();
  }

  // 加载所有事件 - 使用管理端 API
  loadEvents() {
    this.isLoading = true;
    this.http.get(`${this.managementApi}/events`).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.events = result.data || [];
        } else {
          this.error = result.message || '获取事件失败';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('获取事件失败:', error);
        this.error = '获取事件数据失败，请检查管理端服务器连接';
        this.isLoading = false;
      }
    });
  }

  // 加载分类 - 使用管理端 API
  loadCategories() {
    this.http.get(`${this.managementApi}/categories`).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.categories = result.data || [];
        }
      },
      error: (error) => {
        console.error('获取分类失败:', error);
        this.error = '获取分类失败，请检查管理端服务器连接';
      }
    });
  }

  // 初始化新事件表单
  initNewEvent() {
    this.isEditing = true;
    this.currentEvent = {
      name: '',
      description: '',
      event_date: '',
      event_time: '12:00',
      location: '',
      category_id: '',
      organisation_id: 1,
      goal_amount: 0,
      current_amount: 0,
      ticket_price: 0,
      image_url: '',
      is_active: true
    };
    this.error = '';
    this.success = '';
  }

  // 编辑事件
  editEvent(event: any) {
    this.isEditing = true;
    this.currentEvent = { ...event };
    this.error = '';
    this.success = '';
  }

  // 保存事件（创建或更新）- 使用管理端 API
  saveEvent() {
    // 表单验证
    if (!this.validateForm()) {
      return;
    }

    // 🔧 修复日期格式 - 确保是 YYYY-MM-DD 格式
    const formattedDate = this.currentEvent.event_date.split('T')[0];

    // 准备数据
    const eventData = {
      ...this.currentEvent,
      event_date: formattedDate, // 使用修复后的日期
      goal_amount: Number(this.currentEvent.goal_amount) || 0,
      current_amount: Number(this.currentEvent.current_amount) || 0,
      ticket_price: Number(this.currentEvent.ticket_price) || 0,
      category_id: Number(this.currentEvent.category_id),
      organisation_id: 1
    };

    console.log('📤 发送到管理端的数据:', eventData);

    if (this.currentEvent.id) {
      // 更新事件
      this.http.put(`${this.managementApi}/events/${this.currentEvent.id}`, eventData)
        .subscribe({
          next: (result: any) => {
            this.handleSaveResponse(result, '事件更新成功');
          },
          error: (error) => {
            console.error('❌ 更新错误详情:', error);
            this.handleSaveError(error, '更新');
          }
        });
    } else {
      // 创建事件
      this.http.post(`${this.managementApi}/events`, eventData)
        .subscribe({
          next: (result: any) => {
            this.handleSaveResponse(result, '事件创建成功');
          },
          error: (error) => {
            console.error('❌ 创建错误详情:', error);
            console.error('错误状态:', error.status);
            console.error('错误信息:', error.message);
            this.handleSaveError(error, '创建');
          }
        });
    }
  }

  // 处理保存响应
  private handleSaveResponse(result: any, successMessage: string) {
    if (result.success) {
      this.success = successMessage;
      this.isEditing = false;
      this.currentEvent = {};
      this.loadEvents(); // 重新加载事件列表
    } else {
      this.error = result.message || '操作失败';
    }
  }

  // 处理保存错误
  private handleSaveError(error: any, operation: string) {
    console.error(`${operation}事件失败:`, error);
    this.error = `${operation}事件失败：${error.error?.message || error.message}`;
  }

  // 删除事件 - 使用管理端 API
  deleteEvent(eventId: number, eventName: string) {
    if (confirm(`确定要删除事件 "${eventName}" 吗？此操作不可撤销。`)) {
      this.http.delete(`${this.managementApi}/events/${eventId}`)
        .subscribe({
          next: (result: any) => {
            if (result.success) {
              this.success = '事件删除成功';
              this.loadEvents(); // 重新加载事件列表
            } else {
              this.error = result.message || '删除失败';
            }
          },
          error: (error) => {
            console.error('删除事件失败:', error);
            this.error = '删除事件失败：' + (error.error?.message || error.message);
          }
        });
    }
  }

  // 取消编辑
  cancelEdit() {
    this.isEditing = false;
    this.currentEvent = {};
    this.error = '';
    this.success = '';
  }

  // 表单验证
  private validateForm(): boolean {
    if (!this.currentEvent.name?.trim()) {
      this.error = '事件名称不能为空';
      return false;
    }
    if (!this.currentEvent.event_date) {
      this.error = '事件日期不能为空';
      return false;
    }
    if (!this.currentEvent.location?.trim()) {
      this.error = '事件地点不能为空';
      return false;
    }
    if (!this.currentEvent.category_id) {
      this.error = '请选择事件分类';
      return false;
    }
    return true;
  }

  // 格式化日期显示
  formatDate(dateString: string): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-CN');
  }

  // 获取状态显示文本
  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  // 格式化金额显示
  formatAmount(amount: number): string {
    return amount ? `$${amount}` : '-';
  }

  // 测试管理端连接
  testManagementConnection() {
    this.http.get(`${this.managementApi}/events`).subscribe({
      next: (result: any) => {
        console.log('✅ 管理端连接测试成功:', result);
        this.success = '管理端服务器连接正常！';
      },
      error: (error) => {
        console.error('❌ 管理端连接测试失败:', error);
        this.error = '管理端服务器连接失败，请确保服务器运行在端口 3001';
      }
    });
  }
}