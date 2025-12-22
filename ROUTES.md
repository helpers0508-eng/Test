# Route Mapping Documentation

This document lists all available routes and their corresponding HTML files.

## Route Structure

All routes have been updated to use clean URLs instead of `/pages/*.html` format.

## Route Mappings

### Home
- `/` → `home-page-2.html`

### Authentication
- `/login` → `login-page-2.html`
- `/signup` → `sign-up-page-2.html`
- `/forgot-password` → `forgot-password-page.html`
- `/reset-password` → `reset-password-page.html`
- `/verify-email` → `email-verification-page.html`
- `/verify-otp` → `otp-verification-page.html`

### User Pages
- `/dashboard` → `user-dashboard-2.html`
- `/bookings` → `user-bookings-page.html`
- `/profile` → `user-profile-page.html`
- `/search` → `search-results-page-2.html`
- `/services` → `services-listing-page-2.html`
- `/book` → `booking-flow---service-selection-2.html`
- `/booking/confirm` → `booking-confirmation-page-2.html`
- `/notifications` → `notifications-page.html`
- `/settings` → `settings-page.html`

### Helper Pages
- `/helper/dashboard` → `helper-dashboard.html`
- `/helper/bookings` → `helper-bookings-page.html`
- `/helper/profile` → `helper-profile-page.html`
- `/helper/earnings` → `helper-earnings-page.html`
- `/helper/availability` → `helper-availability-page.html`
- `/helper/register` → `helper-registration-2.html`

### Admin Pages
- `/admin/login` → `admin-login-page.html`
- `/admin/dashboard` → `admin-dashboard.html`
- `/admin/users` → `admin-users-management.html`
- `/admin/helpers` → `admin-helpers-management.html`
- `/admin/bookings` → `admin-bookings-management.html`
- `/admin/services` → `admin-services-management.html`
- `/admin/payments` → `admin-payments-management.html`
- `/admin/reviews` → `admin-reviews-moderation.html`

### Static Pages
- `/about` → `about-us-page.html`
- `/contact` → `contact-us-page.html`
- `/faq` → `faq-page.html`
- `/careers` → `careers-page.html`
- `/blog` → `blog-page.html`
- `/help` → `help---support-page.html`
- `/terms` → `terms-of-service-page.html`
- `/privacy` → `privacy-policy-page.html`
- `/cookie-policy` → `cookie-policy.html`
- `/refund-policy` → `refund---cancellation-policy.html`
- `/community-guidelines` → `community-guidelines-page.html`
- `/sitemap` → `sitemap-page.html`
- `/press` → `press---media-page.html`

### Error Pages
- `/404` → `404-page.html`
- `/500` → `500-page.html`

## Implementation

Routes are handled by:
1. **Custom Server** (`server-custom.js`) - Serves HTML files from the `pages/` directory
2. **Next.js Rewrites** - Configured in `next.config.js` for API proxying
3. **Route Fixing Script** - `scripts/fix-routes.js` updates all HTML links

## Usage

### Development
```bash
npm run dev
```
Uses the custom server that serves HTML files with clean routes.

### Production
```bash
npm run build
npm start
```
Uses the custom server in production mode.

## Link Updates

All internal links in HTML files have been updated to use clean routes:
- Old: `/pages/login-page-2.html`
- New: `/login`

All JavaScript files have been updated:
- `assets/js/auth.js` - Updated redirect URLs
- `assets/js/booking.js` - Updated redirect URLs

## Adding New Routes

To add a new route:

1. Add the mapping to `server-custom.js`:
```javascript
const routeMap = {
  // ... existing routes
  '/new-route': 'new-page.html',
};
```

2. Update `next.config.js` rewrites (if needed):
```javascript
{ source: '/new-route', destination: '/pages/new-page.html' },
```

3. Run the route fixing script:
```bash
node scripts/fix-routes.js
```

This will update all HTML links to use the new route.


