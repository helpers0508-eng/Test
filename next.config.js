/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001',
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
    unoptimized: process.env.NODE_ENV === 'production' ? false : false,
  },
  rewrites() {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const rewrites = [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      // Route HTML pages
      { source: '/', destination: '/pages/home-page-2.html' },
      { source: '/login', destination: '/pages/login-page-2.html' },
      { source: '/signup', destination: '/pages/sign-up-page-2.html' },
      { source: '/forgot-password', destination: '/pages/forgot-password-page.html' },
      { source: '/reset-password', destination: '/pages/reset-password-page.html' },
      { source: '/verify-email', destination: '/pages/email-verification-page.html' },
      { source: '/verify-otp', destination: '/pages/otp-verification-page.html' },
      { source: '/dashboard', destination: '/pages/user-dashboard-2.html' },
      { source: '/bookings', destination: '/pages/user-bookings-page.html' },
      { source: '/profile', destination: '/pages/user-profile-page.html' },
      { source: '/search', destination: '/pages/search-results-page-2.html' },
      { source: '/services', destination: '/pages/services-listing-page-2.html' },
      { source: '/book', destination: '/pages/booking-flow---service-selection-2.html' },
      { source: '/booking/confirm', destination: '/pages/booking-confirmation-page-2.html' },
      { source: '/notifications', destination: '/pages/notifications-page.html' },
      { source: '/settings', destination: '/pages/settings-page.html' },
      { source: '/helper/dashboard', destination: '/pages/helper-dashboard.html' },
      { source: '/helper/bookings', destination: '/pages/helper-bookings-page.html' },
      { source: '/helper/profile', destination: '/pages/helper-profile-page.html' },
      { source: '/helper/earnings', destination: '/pages/helper-earnings-page.html' },
      { source: '/helper/availability', destination: '/pages/helper-availability-page.html' },
      { source: '/helper/register', destination: '/pages/helper-registration-2.html' },
      { source: '/admin/login', destination: '/pages/admin-login-page.html' },
      { source: '/admin/dashboard', destination: '/pages/admin-dashboard.html' },
      { source: '/admin/users', destination: '/pages/admin-users-management.html' },
      { source: '/admin/helpers', destination: '/pages/admin-helpers-management.html' },
      { source: '/admin/bookings', destination: '/pages/admin-bookings-management.html' },
      { source: '/admin/services', destination: '/pages/admin-services-management.html' },
      { source: '/admin/payments', destination: '/pages/admin-payments-management.html' },
      { source: '/admin/reviews', destination: '/pages/admin-reviews-moderation.html' },
      { source: '/about', destination: '/pages/about-us-page.html' },
      { source: '/contact', destination: '/pages/contact-us-page.html' },
      { source: '/faq', destination: '/pages/faq-page.html' },
      { source: '/careers', destination: '/pages/careers-page.html' },
      { source: '/blog', destination: '/pages/blog-page.html' },
      { source: '/help', destination: '/pages/help---support-page.html' },
      { source: '/terms', destination: '/pages/terms-of-service-page.html' },
      { source: '/privacy', destination: '/pages/privacy-policy-page.html' },
      { source: '/cookie-policy', destination: '/pages/cookie-policy.html' },
      { source: '/refund-policy', destination: '/pages/refund---cancellation-policy.html' },
      { source: '/community-guidelines', destination: '/pages/community-guidelines-page.html' },
      { source: '/sitemap', destination: '/pages/sitemap-page.html' },
      { source: '/press', destination: '/pages/press---media-page.html' },
    ];
    return rewrites;
  },
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig