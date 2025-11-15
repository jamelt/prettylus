const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'));
const version = packageJson.version;
const vsixFile = `prettylus-${version}.vsix`;
const vsixPath = path.join(__dirname, '..', vsixFile);

if (!fs.existsSync(vsixPath)) {
  console.error(`Error: VSIX file not found: ${vsixFile}`);
  console.error('Please run "npm run package" first.');
  process.exit(1);
}

try {
  console.log(`Installing ${vsixFile}...`);
  execSync(`code --install-extension "${vsixPath}"`, { stdio: 'inherit' });
  console.log('Extension installed successfully!');
} catch (error) {
  console.error('Failed to install extension:', error.message);
  process.exit(1);
}

