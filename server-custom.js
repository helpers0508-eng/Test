const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { readFile, stat } = require('fs').promises;
const { join, extname } = require('path');
const { _promisify } = require('util');
import process from "node:process";

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// MIME types for static files
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

// Function to serve static files
async function _serveStaticFile(filePath, res) {
  try {
    const stats = await stat(filePath);
    if (!stats.isFile()) {
      return false;
    }

    const ext = extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const content = await readFile(filePath);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', content.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.end(content);
    return true;
  } catch (_error) {
    return false;
  }
}

// Route mapping
const routeMap = {
  '/': 'home-page-2.html',
  '/login': 'login-page-2.html',
  '/signup': 'sign-up-page-2.html',
  '/forgot-password': 'forgot-password-page.html',
  '/reset-password': 'reset-password-page.html',
  '/verify-email': 'email-verification-page.html',
  '/verify-otp': 'otp-verification-page.html',
  '/dashboard': 'user-dashboard-2.html',
  '/bookings': 'user-bookings-page.html',
  '/profile': 'user-profile-page.html',
  '/search': 'search-results-page-2.html',
  '/services': 'services-listing-page-2.html',
  '/book': 'booking-flow---service-selection-2.html',
  '/booking/confirm': 'booking-confirmation-page-2.html',
  '/notifications': 'notifications-page.html',
  '/settings': 'settings-page.html',
  '/helper/dashboard': 'helper-dashboard.html',
  '/helper/bookings': 'helper-bookings-page.html',
  '/helper/profile': 'helper-profile-page.html',
  '/helper/earnings': 'helper-earnings-page.html',
  '/helper/availability': 'helper-availability-page.html',
  '/helper/register': 'helper-registration-2.html',
  '/admin/login': 'admin-login-page.html',
  '/admin/dashboard': 'admin-dashboard.html',
  '/admin/users': 'admin-users-management.html',
  '/admin/helpers': 'admin-helpers-management.html',
  '/admin/bookings': 'admin-bookings-management.html',
  '/admin/services': 'admin-services-management.html',
  '/admin/payments': 'admin-payments-management.html',
  '/admin/reviews': 'admin-reviews-moderation.html',
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
};

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // Let Next.js handle static files from public directory (including /assets/)
      // Next.js automatically serves files from public/ directory
      if (pathname.startsWith('/_next/') || 
          pathname.startsWith('/assets/') || 
          pathname.startsWith('/favicon.ico') ||
          pathname.startsWith('/logo.') ||
          pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/)) {
        await handle(req, res, parsedUrl);
        return;
      }

      // Check if this route should serve an HTML file
      const htmlFile = routeMap[pathname];

      if (htmlFile) {
        try {
          const filePath = join(process.cwd(), 'pages', htmlFile);
          let htmlContent = await readFile(filePath, 'utf-8');

          // Fix asset paths (already fixed, but ensure they're correct)
          htmlContent = htmlContent
            .replace(/href="\/pages\//g, 'href="/')
            .replace(/src="\/pages\//g, 'src="/')
            .replace(/href="assets\//g, 'href="/assets/')
            .replace(/src="assets\//g, 'src="/assets/')
            .replace(/href="\.\.\/assets\//g, 'href="/assets/')
            .replace(/src="\.\.\/assets\//g, 'src="/assets/');

          res.setHeader('Content-Type', 'text/html');
          res.setHeader('Cache-Control', 'no-cache');
          res.end(htmlContent);
          return;
        } catch (error) {
          console.error('Error serving HTML file:', error);
          // Fall through to Next.js handler
        }
      }

      // Let Next.js handle other routes (API, etc.)
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Serving static assets from /assets/`);
  });
});

