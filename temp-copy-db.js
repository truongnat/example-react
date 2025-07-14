const fs = require('fs');
const path = require('path');

// Copy database from nested folder to correct location
const sourcePath = path.join(__dirname, 'server-ts', 'server-ts', 'data', 'database.sqlite');
const destPath = path.join(__dirname, 'server-ts', 'data', 'database_backup.sqlite');

console.log('Source:', sourcePath);
console.log('Destination:', destPath);

if (fs.existsSync(sourcePath)) {
  try {
    fs.copyFileSync(sourcePath, destPath);
    console.log('✅ Database copied successfully');
  } catch (error) {
    console.error('❌ Error copying database:', error.message);
  }
} else {
  console.log('❌ Source database not found');
}
