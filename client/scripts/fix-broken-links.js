const fs = require('fs');
const path = require('path');

// Route mapping for common broken links
const routeMapping = {
  'Home': '/',
  'home': '/',
  'Services': '/services',
  'services': '/services',
  'Bookings': '/bookings',
  'bookings': '/bookings',
  'Profile': '/profile',
  'profile': '/profile',
  'Help': '/help',
  'help': '/help',
  'Dashboard': '/dashboard',
  'dashboard': '/dashboard',
};

function fixBrokenLinks(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Fix href="#" with text content
    content = content.replace(/href="#([^"]*)">([^<]+)<\/a>/g, (match, _href, text) => {
      const trimmed = text.trim();
      if (routeMapping[trimmed]) {
        return `href="${routeMapping[trimmed]}">${text}</a>`;
      }
      return match;
    });

    // Fix empty href="#"
    content = content.replace(/href="#"/g, 'href="/"');

    // Fix common navigation patterns
    const patterns = [
      { 
        pattern: /<a[^>]*href="#">([^<]*Home[^<]*)<\/a>/gi, 
        replacement: '<a href="/">$1</a>' 
      },
      { 
        pattern: /<a[^>]*href="#">([^<]*Services[^<]*)<\/a>/gi, 
        replacement: '<a href="/services">$1</a>' 
      },
      { 
        pattern: /<a[^>]*href="#">([^<]*Bookings[^<]*)<\/a>/gi, 
        replacement: '<a href="/bookings">$1</a>' 
      },
      { 
        pattern: /<a[^>]*href="#">([^<]*Profile[^<]*)<\/a>/gi, 
        replacement: '<a href="/profile">$1</a>' 
      },
      { 
        pattern: /<a[^>]*href="#">([^<]*Help[^<]*)<\/a>/gi, 
        replacement: '<a href="/help">$1</a>' 
      },
    ];

    patterns.forEach(({ pattern, replacement }) => {
      content = content.replace(pattern, replacement);
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✓ Fixed links in ${path.basename(filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Process all HTML files
function fixAllLinks() {
  const pagesDir = path.join(__dirname, '..', 'pages');
  if (!fs.existsSync(pagesDir)) {
    console.log('Pages directory not found');
    return;
  }

  const files = fs.readdirSync(pagesDir);
  let fixedCount = 0;
  
  files.forEach(file => {
    if (file.endsWith('.html')) {
      const filePath = path.join(pagesDir, file);
      if (fixBrokenLinks(filePath)) {
        fixedCount++;
      }
    }
  });

  console.log(`\n✅ Fixed broken links in ${fixedCount} files`);
}

console.log('🔄 Fixing broken links...\n');
fixAllLinks();
console.log('\n✨ Link fixing complete!');
