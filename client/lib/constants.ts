// Application Constants
// Centralized constants for routes, roles, services, and configuration

// Route Constants
export const ROUTES = {
  // Public Routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  SERVICES: '/services',
  BLOG: '/blog',
  CAREERS: '/careers',
  HELP: '/help',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  COOKIE_POLICY: '/cookie-policy',
  REFUND_POLICY: '/refund-policy',
  COMMUNITY_GUIDELINES: '/community-guidelines',
  SITEMAP: '/sitemap',
  PRESS: '/press',
  
  // Authentication
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  VERIFY_OTP: '/verify-otp',
  
  // User Routes
  DASHBOARD: '/dashboard',
  BOOKINGS: '/bookings',
  PROFILE: '/profile',
  SEARCH: '/search',
  BOOK: '/book',
  BOOKING_CONFIRM: '/booking/confirm',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  
  // Helper Routes
  HELPER_DASHBOARD: '/helper/dashboard',
  HELPER_BOOKINGS: '/helper/bookings',
  HELPER_PROFILE: '/helper/profile',
  HELPER_EARNINGS: '/helper/earnings',
  HELPER_AVAILABILITY: '/helper/availability',
  HELPER_REGISTER: '/helper/register',
  
  // Admin Routes
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_HELPERS: '/admin/helpers',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_SERVICES: '/admin/services',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_REVIEWS: '/admin/reviews',
  
  // Error Pages
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500',
} as const;

// User Roles
export const ROLES = {
  USER: 'user',
  HELPER: 'helper',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// Role Hierarchy
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [ROLES.USER]: 1,
  [ROLES.HELPER]: 2,
  [ROLES.ADMIN]: 3,
};

// Service Categories
export const SERVICE_CATEGORIES = {
  CLEANING: 'cleaning',
  PLUMBING: 'plumbing',
  BEAUTY: 'beauty',
  ELECTRICAL: 'electrical',
  HANDYMAN: 'handyman',
  TUTORING: 'tutoring',
} as const;

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    VERIFY_EMAIL: '/api/auth/verify-email',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    ME: '/api/auth/me',
  },
  USERS: {
    BASE: '/api/users',
    PROFILE: (id: string | number) => `/api/users/${id}`,
  },
  SERVICES: {
    BASE: '/api/services',
    DETAIL: (id: string | number) => `/api/services/${id}`,
  },
  BOOKINGS: {
    BASE: '/api/bookings',
    DETAIL: (id: string | number) => `/api/bookings/${id}`,
  },
  ADMIN: {
    BASE: '/api/admin',
    USERS: '/api/admin/users',
    HELPERS: '/api/admin/helpers',
    BOOKINGS: '/api/admin/bookings',
    SERVICES: '/api/admin/services',
  },
} as const;

// Theme
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  USER: 'currentUser',
  TOKEN: 'sessionToken',
} as const;

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
} as const;

// UI Constants
export const UI = {
  TOAST_DURATION: 3000,
  MODAL_Z_INDEX: 50,
  TOAST_Z_INDEX: 50,
} as const;


