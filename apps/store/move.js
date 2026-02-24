const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'app');
const localeDir = path.join(baseDir, '[locale]');

// Create [locale] directory if it doesn't exist
if (!fs.existsSync(localeDir)) {
  fs.mkdirSync(localeDir, { recursive: true });
}

// Read contents of app/
const items = fs.readdirSync(baseDir);

for (const item of items) {
  // Skip the [locale] directory and anything we don't want to move
  if (item === '[locale]' || item === 'favicon.ico' || item === 'api' || item === 'assets') {
    continue;
  }
  
  const src = path.join(baseDir, item);
  const dest = path.join(localeDir, item);
  
  try {
    fs.renameSync(src, dest);
    console.log(`Moved ${item} to [locale]`);
  } catch (error) {
    console.error(`Failed to move ${item}:`, error);
  }
}

// Create messages directory and files if they don't exist
const messagesDir = path.join(__dirname, 'messages');
if (!fs.existsSync(messagesDir)) {
  fs.mkdirSync(messagesDir, { recursive: true });
}

if (!fs.existsSync(path.join(messagesDir, 'en.json'))) {
  fs.writeFileSync(path.join(messagesDir, 'en.json'), JSON.stringify({}, null, 2));
}

if (!fs.existsSync(path.join(messagesDir, 'id.json'))) {
  fs.writeFileSync(path.join(messagesDir, 'id.json'), JSON.stringify({}, null, 2));
}

console.log('Restructure complete.');
