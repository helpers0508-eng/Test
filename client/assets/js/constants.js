// Client-side Constants
// Centralized constants for JavaScript files

const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  HELPER_DASHBOARD: '/helper/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',
  BOOKINGS: '/bookings',
  PROFILE: '/profile',
  VERIFY_OTP: '/verify-otp',
  BOOKING_CONFIRM: '/booking/confirm',
};

const ROLES = {
  USER: 'user',
  HELPER: 'helper',
  ADMIN: 'admin',
};

const STORAGE_KEYS = {
  USER: 'currentUser',
  TOKEN: 'sessionToken',
  THEME: 'theme',
};

// Export for use in other scripts
if (typeof globalThis !== 'undefined') {
  globalThis.APP_CONSTANTS = {
    ROUTES,
    ROLES,
    STORAGE_KEYS,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ROUTES, ROLES, STORAGE_KEYS };
}


