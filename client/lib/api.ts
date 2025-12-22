import process from "node:process";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  register: (data: { email: string; password: string; name: string; phone?: string; address?: string; role?: string }) =>
    apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyEmail: (data: { email: string; otp: string }) =>
    apiRequest('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiRequest('/api/auth/logout', {
      method: 'POST',
    }),

  getMe: () =>
    apiRequest('/api/auth/me'),

  forgotPassword: (data: { email: string }) =>
    apiRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resetPassword: (data: { token: string; password: string }) =>
    apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Services APIs
export const servicesAPI = {
  getAll: (params?: { category?: string; search?: string }) => {
    const query = params ? new URLSearchParams(params).toString() : '';
    return apiRequest(`/api/services${query ? `?${query}` : ''}`);
  },

  getById: (id: string) =>
    apiRequest(`/api/services/${id}`),

  getCategories: () =>
    apiRequest('/api/services/meta/categories'),

  create: (data: Record<string, unknown>) =>
    apiRequest('/api/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Record<string, unknown>) =>
    apiRequest(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/api/services/${id}`, {
      method: 'DELETE',
    }),
};

// Bookings APIs
export const bookingsAPI = {
  getAll: (params?: { status?: string; page?: number; limit?: number }) => {
    const query = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    return apiRequest(`/api/bookings${query ? `?${query}` : ''}`);
  },

  getById: (id: string) =>
    apiRequest(`/api/bookings/${id}`),

  create: (data: {
    serviceId: string;
    date: string;
    time: string;
    address: string;
    notes?: string;
  }) =>
    apiRequest('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Record<string, unknown>) =>
    apiRequest(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  cancel: (id: string, reason?: string) =>
    apiRequest(`/api/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  addReview: (id: string, data: { rating: number; comment?: string }) =>
    apiRequest(`/api/bookings/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAvailableSlots: (serviceId: string, date: string) =>
    apiRequest(`/api/bookings/slots/${serviceId}/${date}`),
};

// Reviews APIs
export const reviewsAPI = {
  getForUser: (userId: string) =>
    apiRequest(`/api/reviews/user/${userId}`),

  create: (data: { bookingId: string; rating: number; comment?: string }) =>
    apiRequest('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (reviewId: string, data: { rating?: number; comment?: string }) =>
    apiRequest(`/api/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (reviewId: string) =>
    apiRequest(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    }),
};

// Availability APIs
export const availabilityAPI = {
  getForHelper: (helperId: string, date?: string) =>
    apiRequest(`/api/availability/helper/${helperId}${date ? `?date=${date}` : ''}`),

  create: (data: { date: string; startTime: string; endTime: string }) =>
    apiRequest('/api/availability', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (slotId: string, data: { startTime?: string; endTime?: string; isAvailable?: boolean }) =>
    apiRequest(`/api/availability/${slotId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (slotId: string) =>
    apiRequest(`/api/availability/${slotId}`, {
      method: 'DELETE',
    }),

  getAvailable: (serviceId: string, date: string) =>
    apiRequest(`/api/availability/available/${serviceId}/${date}`),
};

// Users APIs
export const usersAPI = {
  getProfile: (userId: string) =>
    apiRequest(`/api/users/${userId}`),

  updateProfile: (userId: string, data: Record<string, unknown>) =>
    apiRequest(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  changePassword: (userId: string, data: { currentPassword: string; newPassword: string }) =>
    apiRequest(`/api/users/${userId}/change-password`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Admin APIs
export const adminAPI = {
  getStats: () =>
    apiRequest('/api/admin/stats'),

  getUsers: (params?: { page?: number; limit?: number; search?: string }) => {
    const query = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    return apiRequest(`/api/admin/users${query ? `?${query}` : ''}`);
  },

  updateUserStatus: (userId: string, data: { isActive: boolean }) =>
    apiRequest(`/api/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getBookings: (params?: { status?: string; page?: number; limit?: number }) => {
    const query = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    return apiRequest(`/api/admin/bookings${query ? `?${query}` : ''}`);
  },

  assignHelper: (bookingId: string, data: { helperId: string }) =>
    apiRequest(`/api/admin/bookings/${bookingId}/assign-helper`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getRevenueReport: (params?: { startDate?: string; endDate?: string }) => {
    const query = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    return apiRequest(`/api/admin/reports/revenue${query ? `?${query}` : ''}`);
  },

  getPayments: () =>
    apiRequest('/api/payments/admin/all'),
};

export default {
  auth: authAPI,
  services: servicesAPI,
  bookings: bookingsAPI,
  reviews: reviewsAPI,
  availability: availabilityAPI,
  users: usersAPI,
  admin: adminAPI,
};