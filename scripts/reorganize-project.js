const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Reorganizing project into client/ and server/ folders...\n');

const rootDir = process.cwd();

// Create directories
const dirs = ['client', 'server'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created ${dir}/ directory`);
  }
});

// Frontend files/directories to move
const frontendItems = [
  'app',
  'pages',
  'public',
  'assets',
  'frontend',
  'index.html',
  'next.config.js',
  'tsconfig.json',
  'postcss.config.js',
  'tailwind.config.js',
  'middleware.ts',
  'next-env.d.ts',
];

// Backend files/directories to move
const backendItems = [
  'server.js',
  'server-custom.js',
  'routes',
  'middleware',
  'models',
  'scripts',
  'utils',
];

// Function to move directory or file
function moveItem(source, dest) {
  try {
    const sourcePath = path.join(rootDir, source);
    const destPath = path.join(rootDir, dest);
    
    if (fs.existsSync(sourcePath)) {
      // Create destination directory if needed
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      // Use robocopy on Windows or cp on Unix
      if (process.platform === 'win32') {
        if (fs.statSync(sourcePath).isDirectory()) {
          execSync(`xcopy /E /I /Y "${sourcePath}" "${destPath}"`, { stdio: 'ignore' });
          // Remove source after copy
          execSync(`rmdir /S /Q "${sourcePath}"`, { stdio: 'ignore' });
        } else {
          fs.copyFileSync(sourcePath, destPath);
          fs.unlinkSync(sourcePath);
        }
      } else {
        execSync(`cp -r "${sourcePath}" "${destPath}"`, { stdio: 'ignore' });
        execSync(`rm -rf "${sourcePath}"`, { stdio: 'ignore' });
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error moving ${source}:`, error.message);
    return false;
  }
}

// Move frontend items
console.log('\n📦 Moving frontend files to client/...');
frontendItems.forEach(item => {
  if (moveItem(item, `client/${item}`)) {
    console.log(`  ✓ Moved ${item} → client/${item}`);
  }
});

// Move backend items
console.log('\n📦 Moving backend files to server/...');
backendItems.forEach(item => {
  if (moveItem(item, `server/${item}`)) {
    console.log(`  ✓ Moved ${item} → server/${item}`);
  }
});

console.log('\n✅ File reorganization complete!');
console.log('\n⚠️  Next steps:');
console.log('  1. Update paths in server files');
console.log('  2. Create separate package.json files');
console.log('  3. Update imports and references');


