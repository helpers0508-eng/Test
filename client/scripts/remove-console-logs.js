const fs = require('fs');
const path = require('path');

function removeConsoleLogs(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Remove console.log statements (keep console.error for debugging)
    // Replace with conditional logging for production
    content = content.replace(
      /console\.log\([^)]*\);?/g,
      (match) => {
        // Keep in development, remove in production
        return `if (process.env.NODE_ENV === 'development') { ${match} }`;
      }
    );

    // For console.error, wrap in development check
    content = content.replace(
      /console\.error\(([^)]*)\);?/g,
      (_match, args) => {
        return `if (process.env.NODE_ENV === 'development') { console.error(${args}); }`;
      }
    );

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✓ Updated console statements in ${path.basename(filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let updatedCount = 0;

  files.forEach(file => {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      processDirectory(filePath);
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      if (removeConsoleLogs(filePath)) {
        updatedCount++;
      }
    }
  });

  return updatedCount;
}

console.log('🔄 Removing console.log statements from production code...\n');

const appDir = path.join(__dirname, '..', 'app');
const updated = processDirectory(appDir);

console.log(`\n✅ Updated ${updated} files`);
console.log('⚠️  Note: console.error statements are wrapped in development checks');


