const fs = require('fs');
const path = require('path');

// Logo SVG pattern to replace - more comprehensive patterns
const logoSvgPatterns = [
  // Pattern 1: size-6 with text-primary
  /<div class="size-6 text-primary">\s*<svg[^>]*>[\s\S]*?<\/svg>\s*<\/div>/g,
  // Pattern 2: size-8 with text-primary
  /<div class="size-8 text-primary">\s*<svg[^>]*>[\s\S]*?<\/svg>\s*<\/div>/g,
  // Pattern 3: text-primary size-8
  /<div class="text-primary size-8">\s*<svg[^>]*>[\s\S]*?<\/svg>\s*<\/div>/g,
  // Pattern 4: text-primary with any other classes
  /<div class="text-primary[^"]*">\s*<svg[^>]*>[\s\S]*?<\/svg>\s*<\/div>/g,
  // Pattern 5: Any div containing SVG with viewBox="0 0 48 48" (the logo SVG)
  /<div[^>]*class="[^"]*"[^>]*>\s*<svg[^>]*viewBox="0 0 48 48"[^>]*>[\s\S]*?<\/svg>\s*<\/div>/g,
  // Pattern 6: SVG with class="h-full w-full" inside a div
  /<div[^>]*>\s*<svg[^>]*class="[^"]*h-full[^"]*w-full[^"]*"[^>]*viewBox="0 0 48 48"[^>]*>[\s\S]*?<\/svg>\s*<\/div>/g,
];

// Replacement logo HTML
const logoReplacement = '<img src="/logo.jpeg" alt="Helpers Logo" class="h-6 w-auto object-contain">';
const logoReplacement2 = '<img src="/logo.jpeg" alt="Helpers Logo" class="h-8 w-auto object-contain">';

function updateLogoInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Replace different logo patterns
    logoSvgPatterns.forEach((pattern, index) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, (match) => {
          // Determine size based on class or default to h-8
          if (match.includes('size-6') || match.includes('h-6')) {
            return logoReplacement;
          } else {
            return logoReplacement2;
          }
        });
      }
    });

    const updated = content !== originalContent;

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✓ Updated logo in ${path.basename(filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Process all HTML files in pages directory
function updateAllLogos() {
  const pagesDir = path.join(__dirname, '..', 'pages');
  const files = fs.readdirSync(pagesDir);
  
  let updatedCount = 0;
  
  files.forEach(file => {
    if (file.endsWith('.html')) {
      const filePath = path.join(pagesDir, file);
      if (updateLogoInFile(filePath)) {
        updatedCount++;
      }
    }
  });

  // Also update index.html if it exists
  const indexPath = path.join(__dirname, '..', 'index.html');
  if (fs.existsSync(indexPath)) {
    if (updateLogoInFile(indexPath)) {
      updatedCount++;
    }
  }

  console.log(`\n✅ Updated logo in ${updatedCount} files`);
}

console.log('🔄 Updating logo across all pages...\n');
updateAllLogos();
console.log('\n✨ Logo update complete!');

