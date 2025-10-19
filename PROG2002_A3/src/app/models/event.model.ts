// 修复：确保所有接口都正确导出
export interface Event {
  id: number;
  name: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  category_id: number;
  category_name: string;
  organisation_id: number;
  organisation_name: string;
  goal_amount: number;
  current_amount: number;
  ticket_price: number;
  is_active: boolean;
  image_url: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
}

export interface Organisation {
  id: number;
  name: string;
  description: string;
  contact_email: string;
  phone: string;
  website: string;
  created_at: string;
}

export interface Registration {
  id: number;
  event_id: number;
  user_name: string;
  user_email: string;
  ticket_count: number;
  registration_date: string;
}

// 修复：添加 ApiResponse 接口
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}