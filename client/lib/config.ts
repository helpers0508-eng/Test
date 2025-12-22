// Client-side configuration
// Only safe, public configuration values should be here
// Never include secrets, API keys, or sensitive data

// API Configuration
export const API_CONFIG = {
  // API URL - should be set via NEXT_PUBLIC_API_URL environment variable
  BASE_URL: typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
    : 'http://localhost:3001',
  
  // API endpoints are defined in constants.ts
  TIMEOUT: 30000, // 30 seconds
} as const;

// Feature Flags (client-side only)
export const FEATURES = {
  DARK_MODE: true,
  NOTIFICATIONS: true,
  BOOKING: true,
  PAYMENTS: false, // Disabled until Stripe is configured
} as const;

// UI Configuration
export const UI_CONFIG = {
  TOAST_DURATION: 3000,
  MODAL_ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  PAGINATION_ITEMS_PER_PAGE: 12,
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
  PHONE_INVALID: 'Please enter a valid phone number',
} as const;


