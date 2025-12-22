const fs = require('fs');
const path = require('path');

console.log('🔍 Generating Validation Report...\n');

const report = {
  uiIssues: [],
  brokenLinks: [],
  consoleErrors: [],
  unusedFiles: [],
  missingComponents: [],
  envVarExposure: [],
  responsiveness: [],
  darkMode: [],
};

// Check for broken links
function checkBrokenLinks() {
  const pagesDir = path.join(__dirname, '..', 'pages');
  if (!fs.existsSync(pagesDir)) return;
  
  const files = fs.readdirSync(pagesDir);
  files.forEach(file => {
    if (file.endsWith('.html')) {
      const content = fs.readFileSync(path.join(pagesDir, file), 'utf-8');
      const brokenLinks = content.match(/href="#[^"]*"/g);
      if (brokenLinks && brokenLinks.length > 0) {
        report.brokenLinks.push({
          file,
          count: brokenLinks.length,
          links: brokenLinks.slice(0, 5), // First 5 examples
        });
      }
    }
  });
}

// Check for console statements
function checkConsoleStatements() {
  const checkDir = (dir) => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    files.forEach(file => {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        checkDir(filePath);
      } else if (file.name.endsWith('.js') || file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const consoleMatches = content.match(/console\.(log|error|warn)/g);
        if (consoleMatches) {
          report.consoleErrors.push({
            file: path.relative(path.join(__dirname, '..'), filePath),
            count: consoleMatches.length,
            statements: consoleMatches.slice(0, 3),
          });
        }
      }
    });
  };
  
  checkDir(path.join(__dirname, '..', 'app'));
  checkDir(path.join(__dirname, '..', 'assets', 'js'));
}

// Check for environment variable exposure
function checkEnvVarExposure() {
  const checkDir = (dir) => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    files.forEach(file => {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        checkDir(filePath);
      } else if (file.name.endsWith('.js') || file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        // Check for process.env without NEXT_PUBLIC_ prefix
        const envMatches = content.match(/process\.env\.(?!NEXT_PUBLIC_)[A-Z_]+/g);
        if (envMatches) {
          report.envVarExposure.push({
            file: path.relative(path.join(__dirname, '..'), filePath),
            matches: envMatches,
          });
        }
      }
    });
  };
  
  checkDir(path.join(__dirname, '..', 'app'));
  checkDir(path.join(__dirname, '..', 'assets', 'js'));
}

// Check responsiveness
function checkResponsiveness() {
  const pagesDir = path.join(__dirname, '..', 'pages');
  if (!fs.existsSync(pagesDir)) return;
  
  const sampleFiles = ['home-page-2.html', 'login-page-2.html', 'user-dashboard-2.html'];
  sampleFiles.forEach(file => {
    const filePath = path.join(pagesDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const hasResponsiveClasses = 
        content.includes('sm:') || 
        content.includes('md:') || 
        content.includes('lg:') ||
        content.includes('xl:') ||
        content.includes('@container') ||
        content.includes('viewport');
      
      if (!hasResponsiveClasses) {
        report.responsiveness.push({
          file,
          issue: 'Missing responsive classes',
        });
      }
    }
  });
}

// Check dark mode
function checkDarkMode() {
  const pagesDir = path.join(__dirname, '..', 'pages');
  if (!fs.existsSync(pagesDir)) return;
  
  const sampleFiles = ['home-page-2.html', 'login-page-2.html'];
  sampleFiles.forEach(file => {
    const filePath = path.join(pagesDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const hasDarkMode = content.includes('dark:') || content.includes('dark-mode');
      
      if (!hasDarkMode) {
        report.darkMode.push({
          file,
          issue: 'Missing dark mode classes',
        });
      }
    }
  });
}

// Run all checks
checkBrokenLinks();
checkConsoleStatements();
checkEnvVarExposure();
checkResponsiveness();
checkDarkMode();

// Generate report
console.log('📊 VALIDATION REPORT\n');
console.log('='.repeat(50));

console.log(`\n🔗 Broken Links: ${report.brokenLinks.length}`);
if (report.brokenLinks.length > 0) {
  report.brokenLinks.slice(0, 5).forEach(item => {
    console.log(`  - ${item.file}: ${item.count} broken link(s)`);
  });
}

console.log(`\n⚠️  Console Statements: ${report.consoleErrors.length}`);
if (report.consoleErrors.length > 0) {
  report.consoleErrors.slice(0, 5).forEach(item => {
    console.log(`  - ${item.file}: ${item.count} console statement(s)`);
  });
}

console.log(`\n🔒 Environment Variable Exposure: ${report.envVarExposure.length}`);
if (report.envVarExposure.length > 0) {
  report.envVarExposure.forEach(item => {
    console.log(`  - ${item.file}: ${item.matches.join(', ')}`);
  });
}

console.log(`\n📱 Responsiveness Issues: ${report.responsiveness.length}`);
if (report.responsiveness.length > 0) {
  report.responsiveness.forEach(item => {
    console.log(`  - ${item.file}: ${item.issue}`);
  });
}

console.log(`\n🌙 Dark Mode Issues: ${report.darkMode.length}`);
if (report.darkMode.length > 0) {
  report.darkMode.forEach(item => {
    console.log(`  - ${item.file}: ${item.issue}`);
  });
}

console.log('\n' + '='.repeat(50));
console.log('\n✅ Validation complete!');

// Save report to file
const reportPath = path.join(__dirname, '..', 'validation-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\n📄 Full report saved to: validation-report.json`);


