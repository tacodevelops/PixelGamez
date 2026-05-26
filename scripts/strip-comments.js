const fs = require('fs');
const path = require('path');
const stripComments = require('strip-comments');

const targetDirs = ['app', 'components', 'lib'];
const rootFiles = ['server.ts'];

function processFile(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && !filePath.endsWith('.js') && !filePath.endsWith('.jsx')) {
    return;
  }
  
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    const stripped = stripComments(code);
    
    // Only write if changed to avoid unnecessary disk writes
    if (code !== stripped) {
      fs.writeFileSync(filePath, stripped, 'utf8');
      console.log(`Stripped comments from: ${filePath}`);
    }
  } catch (err) {
    console.error(`Failed to process ${filePath}:`, err);
  }
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else {
      processFile(fullPath);
    }
  }
}

console.log('Starting comment stripping process...');

targetDirs.forEach(dir => processDirectory(path.join(__dirname, '..', dir)));
rootFiles.forEach(file => processFile(path.join(__dirname, '..', file)));

console.log('Finished stripping comments.');
