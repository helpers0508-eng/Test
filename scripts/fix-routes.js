const fs = require('fs');
const path = require('path');

// Route mapping: HTML file to clean route
const routeMapping = {
  'home-page-2.html': '/',
  'login-page-2.html': '/login',
  'login.html': '/login',
  'sign-up-page-2.html': '/signup',
  'signup.html': '/signup',
  'forgot-password-page.html': '/forgot-password',
  'reset-password-page.html': '/reset-password',
  'email-verification-page.html': '/verify-email',
  'otp-verification-page.html': '/verify-otp',
  'user-dashboard-2.html': '/dashboard',
  'user-bookings-page.html': '/bookings',
  'user-profile-page.html': '/profile',
  'search-results-page-2.html': '/search',
  'service-details-page-2.html': '/service',
  'services-listing-page-2.html': '/services',
  'booking-flow---service-selection-2.html': '/book',
  'booking-confirmation-page-2.html': '/booking/confirm',
  'notifications-page.html': '/notifications',
  'settings-page.html': '/settings',
  'helper-dashboard.html': '/helper/dashboard',
  'helper-bookings-page.html': '/helper/bookings',
  'helper-profile-page.html': '/helper/profile',
  'helper-earnings-page.html': '/helper/earnings',
  'helper-availability-page.html': '/helper/availability',
  'helper-registration-2.html': '/helper/register',
  'admin-login-page.html': '/admin/login',
  'admin-dashboard.html': '/admin/dashboard',
  'admin-users-management.html': '/admin/users',
  'admin-helpers-management.html': '/admin/helpers',
  'admin-bookings-management.html': '/admin/bookings',
  'admin-services-management.html': '/admin/services',
  'admin-payments-management.html': '/admin/payments',
  'admin-reviews-moderation.html': '/admin/reviews',
  'about-us-page.html': '/about',
  'contact-us-page.html': '/contact',
  'faq-page.html': '/faq',
  'careers-page.html': '/careers',
  'blog-page.html': '/blog',
  'help---support-page.html': '/help',
  'terms-of-service-page.html': '/terms',
  'privacy-policy-page.html': '/privacy',
  'cookie-policy.html': '/cookie-policy',
  'refund---cancellation-policy.html': '/refund-policy',
  'community-guidelines-page.html': '/community-guidelines',
  'sitemap-page.html': '/sitemap',
  'press---media-page.html': '/press',
  '404-page.html': '/404',
  '500-page.html': '/500',
};

// Function to get route from HTML file path
function getRouteFromHtml(htmlPath) {
  const filename = path.basename(htmlPath);
  return routeMapping[filename] || null;
}

// Function to update links in HTML content
function updateLinks(content, currentFile) {
  let updated = content;
  
  // Update /pages/*.html links to clean routes
  Object.entries(routeMapping).forEach(([htmlFile, route]) => {
    const patterns = [
      new RegExp(`href="/pages/${htmlFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'gi'),
      new RegExp(`href="/pages/${htmlFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'gi'),
      new RegExp(`href="\\.\\./pages/${htmlFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'gi'),
      new RegExp(`href="${htmlFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'gi'),
    ];
    
    patterns.forEach(pattern => {
      updated = updated.replace(pattern, `href="${route}"`);
    });
  });
  
  // Update asset paths
  updated = updated.replace(/href="\.\.\/assets\//g, 'href="/assets/');
  updated = updated.replace(/src="\.\.\/assets\//g, 'src="/assets/');
  updated = updated.replace(/href="assets\//g, 'href="/assets/');
  updated = updated.replace(/src="assets\//g, 'src="/assets/');
  
  // Update button links (convert buttons to anchor tags where appropriate)
  updated = updated.replace(
    /<button([^>]*class="[^"]*"[^>]*)>\s*<span[^>]*>Log In<\/span>\s*<\/button>/gi,
    '<a$1 href="/login"><span>Log In</span></a>'
  );
  updated = updated.replace(
    /<button([^>]*class="[^"]*"[^>]*)>\s*<span[^>]*>Sign Up<\/span>\s*<\/button>/gi,
    '<a$1 href="/signup"><span>Sign Up</span></a>'
  );
  
  return updated;
}

// Process all HTML files in pages directory
function processPages() {
  const pagesDir = path.join(__dirname, '..', 'pages');
  const files = fs.readdirSync(pagesDir);
  
  let updatedCount = 0;
  
  files.forEach(file => {
    if (file.endsWith('.html')) {
      const filePath = path.join(pagesDir, file);
      let content = fs.readFileSync(filePath, 'utf-8');
      const originalContent = content;
      
      content = updateLinks(content, file);
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✓ Updated routes in ${file}`);
        updatedCount++;
      }
    }
  });
  
  console.log(`\n✅ Updated ${updatedCount} files`);
}

// Process index.html if it exists
function processIndex() {
  const indexPath = path.join(__dirname, '..', 'index.html');
  if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf-8');
    const originalContent = content;
    
    content = updateLinks(content, 'index.html');
    
    if (content !== originalContent) {
      fs.writeFileSync(indexPath, content, 'utf-8');
      console.log('✓ Updated routes in index.html');
    }
  }
}

// Run the script
console.log('🔄 Fixing routes in HTML files...\n');
processIndex();
processPages();
console.log('\n✨ Route fixing complete!');


