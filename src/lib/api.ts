/**
 * API Configuration
 * Change this to your deployed backend URL
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get stored auth token
 */
const getToken = (): string | null => {
  const session = localStorage.getItem('eduguide_session') || sessionStorage.getItem('eduguide_session');
  if (session) {
    try {
      const data = JSON.parse(session);
      return data.token;
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * API Response Type
 */
interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * HTTP Request Helper
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Request failed',
        errors: data.errors,
      };
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
    };
  }
}

/**
 * Auth API
 */
export const authApi = {
  signup: (data: { name: string; email: string; password: string; role?: string }) =>
    request<{ user: unknown; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  login: (data: { email: string; password: string }) =>
    request<{ user: unknown; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  getProfile: () =>
    request<{ user: unknown; counsellorProfile?: unknown }>('/auth/me'),
    
  updateProfile: (data: { name?: string }) =>
    request<{ user: unknown }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<null>('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

/**
 * Users API
 */
export const usersApi = {
  getMe: () => request<{ user: unknown }>('/users/me'),
};

/**
 * Counsellors API
 */
export const counsellorsApi = {
  getAll: (params?: { page?: number; limit?: number; specialization?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.specialization) searchParams.set('specialization', params.specialization);
    
    return request<unknown[]>(`/counsellors?${searchParams.toString()}`);
  },
  
  getById: (id: string) =>
    request<{ counsellor: unknown }>(`/counsellors/${id}`),
    
  getMyProfile: () =>
    request<{ counsellor: unknown }>('/counsellors/me'),
    
  updateProfile: (data: {
    qualification?: string;
    specialization?: string[];
    experience?: number;
    bio?: string;
    hourlyRate?: number;
    availabilitySlots?: Array<{ day: string; startTime: string; endTime: string }>;
  }) =>
    request<{ counsellor: unknown }>('/counsellors/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  getMyBookings: (params?: { page?: number; limit?: number; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    
    return request<unknown[]>(`/counsellors/bookings?${searchParams.toString()}`);
  },
};

/**
 * Bookings API
 */
export const bookingsApi = {
  create: (data: {
    counsellorId: string;
    bookingDate: string;
    timeSlot: string;
    notes?: string;
  }) =>
    request<{ booking: unknown }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  getMyBookings: (params?: { page?: number; limit?: number; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    
    return request<unknown[]>(`/bookings/my?${searchParams.toString()}`);
  },
  
  getById: (id: string) =>
    request<{ booking: unknown }>(`/bookings/${id}`),
    
  cancel: (id: string, cancelReason?: string) =>
    request<{ booking: unknown }>(`/bookings/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ cancelReason }),
    }),
    
  updateStatus: (id: string, status: string) =>
    request<{ booking: unknown }>(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

/**
 * Admin API
 */
export const adminApi = {
  getStats: () =>
    request<{
      users: { total: number };
      counsellors: { total: number; approved: number; pending: number };
      bookings: { total: number; pending: number; completed: number };
    }>('/admin/stats'),
    
  getUsers: (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.role) searchParams.set('role', params.role);
    
    return request<unknown[]>(`/admin/users?${searchParams.toString()}`);
  },
  
  updateUserStatus: (id: string, isActive: boolean) =>
    request<{ user: unknown }>(`/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    }),
    
  getCounsellors: (params?: { page?: number; limit?: number; approved?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.approved !== undefined) searchParams.set('approved', params.approved.toString());
    
    return request<unknown[]>(`/admin/counsellors?${searchParams.toString()}`);
  },
  
  approveCounsellor: (id: string, approved: boolean) =>
    request<{ counsellor: unknown }>(`/admin/counsellors/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ approved }),
    }),
    
  getAllBookings: (params?: { page?: number; limit?: number; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    
    return request<unknown[]>(`/admin/bookings?${searchParams.toString()}`);
  },
};

/**
 * Health Check
 */
export const healthCheck = () => request<{ message: string }>('/health');

export default {
  auth: authApi,
  users: usersApi,
  counsellors: counsellorsApi,
  bookings: bookingsApi,
  admin: adminApi,
  healthCheck,
};
