// Route mapping configuration
// Maps clean Next.js routes to HTML files in the pages directory

export const routeMap: Record<string, string> = {
  // Home
  '/': 'home-page-2.html',
  
  // Authentication
  '/login': 'login-page-2.html',
  '/signup': 'sign-up-page-2.html',
  '/forgot-password': 'forgot-password-page.html',
  '/reset-password': 'reset-password-page.html',
  '/verify-email': 'email-verification-page.html',
  '/verify-otp': 'otp-verification-page.html',
  
  // User Pages
  '/dashboard': 'user-dashboard-2.html',
  '/bookings': 'user-bookings-page.html',
  '/profile': 'user-profile-page.html',
  '/search': 'search-results-page-2.html',
  '/service/[id]': 'service-details-page-2.html',
  '/services': 'services-listing-page-2.html',
  '/book': 'booking-flow---service-selection-2.html',
  '/booking/confirm': 'booking-confirmation-page-2.html',
  '/notifications': 'notifications-page.html',
  '/settings': 'settings-page.html',
  
  // Helper Pages
  '/helper/dashboard': 'helper-dashboard.html',
  '/helper/bookings': 'helper-bookings-page.html',
  '/helper/profile': 'helper-profile-page.html',
  '/helper/earnings': 'helper-earnings-page.html',
  '/helper/availability': 'helper-availability-page.html',
  '/helper/register': 'helper-registration-2.html',
  
  // Admin Pages
  '/admin/login': 'admin-login-page.html',
  '/admin/dashboard': 'admin-dashboard.html',
  '/admin/users': 'admin-users-management.html',
  '/admin/helpers': 'admin-helpers-management.html',
  '/admin/bookings': 'admin-bookings-management.html',
  '/admin/services': 'admin-services-management.html',
  '/admin/payments': 'admin-payments-management.html',
  '/admin/reviews': 'admin-reviews-moderation.html',
  
  // Static Pages
  '/about': 'about-us-page.html',
  '/contact': 'contact-us-page.html',
  '/faq': 'faq-page.html',
  '/careers': 'careers-page.html',
  '/blog': 'blog-page.html',
  '/help': 'help---support-page.html',
  '/terms': 'terms-of-service-page.html',
  '/privacy': 'privacy-policy-page.html',
  '/cookie-policy': 'cookie-policy.html',
  '/refund-policy': 'refund---cancellation-policy.html',
  '/community-guidelines': 'community-guidelines-page.html',
  '/sitemap': 'sitemap-page.html',
  '/press': 'press---media-page.html',
  
  // Error Pages
  '/404': '404-page.html',
  '/500': '500-page.html',
};

// Reverse mapping: HTML file to route
export const htmlToRoute: Record<string, string> = Object.fromEntries(
  Object.entries(routeMap).map(([route, html]) => [html, route])
);

// Get route from HTML filename
export function getRouteFromHtml(htmlFile: string): string {
  // Remove .html extension and path
  const filename = htmlFile.replace(/^.*\//, '').replace(/\.html$/, '');
  const fullPath = htmlFile.includes('/') ? htmlFile : `pages/${htmlFile}`;
  
  // Check reverse mapping first
  if (htmlToRoute[fullPath]) {
    return htmlToRoute[fullPath];
  }
  
  // Try to find by filename
  for (const [route, html] of Object.entries(routeMap)) {
    if (html === htmlFile || html === fullPath) {
      return route;
    }
  }
  
  // Fallback: convert filename to route
  return '/' + filename
    .replace(/-page-2$/, '')
    .replace(/-page$/, '')
    .replace(/---/g, '/')
    .replace(/-/g, '/');
}

// Get HTML file from route
export function getHtmlFromRoute(route: string): string | null {
  return routeMap[route] || null;
}


