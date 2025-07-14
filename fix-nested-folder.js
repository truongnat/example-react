const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing nested server-ts folder issue...');

const nestedFolderPath = path.join(__dirname, 'server-ts', 'server-ts');
const correctDataPath = path.join(__dirname, 'server-ts', 'data');
const correctUploadsPath = path.join(__dirname, 'server-ts', 'uploads');

// Check if nested folder exists
if (fs.existsSync(nestedFolderPath)) {
  console.log('📁 Found nested server-ts folder');
  
  // Check if there's a database in the nested folder
  const nestedDbPath = path.join(nestedFolderPath, 'data', 'database.sqlite');
  const correctDbPath = path.join(correctDataPath, 'database.sqlite');
  
  if (fs.existsSync(nestedDbPath)) {
    console.log('💾 Found database in nested folder');
    
    // Check if correct database already exists
    if (fs.existsSync(correctDbPath)) {
      console.log('⚠️  Database already exists in correct location');
      console.log('   Creating backup of nested database...');
      
      const backupPath = path.join(correctDataPath, 'database_nested_backup.sqlite');
      try {
        fs.copyFileSync(nestedDbPath, backupPath);
        console.log('✅ Backup created:', backupPath);
      } catch (error) {
        console.error('❌ Failed to create backup:', error.message);
        return;
      }
    } else {
      console.log('📋 Moving database to correct location...');
      try {
        // Ensure correct data directory exists
        if (!fs.existsSync(correctDataPath)) {
          fs.mkdirSync(correctDataPath, { recursive: true });
        }
        
        fs.copyFileSync(nestedDbPath, correctDbPath);
        console.log('✅ Database moved to correct location');
      } catch (error) {
        console.error('❌ Failed to move database:', error.message);
        return;
      }
    }
  }
  
  // Remove nested folder
  try {
    console.log('🗑️  Removing nested folder...');
    fs.rmSync(nestedFolderPath, { recursive: true, force: true });
    console.log('✅ Nested folder removed successfully');
  } catch (error) {
    console.error('❌ Failed to remove nested folder:', error.message);
    console.log('💡 You may need to close any applications using files in this folder');
    return;
  }
  
  console.log('');
  console.log('🎉 Fixed nested folder issue!');
  console.log('');
  console.log('📋 Summary:');
  console.log('   - Removed: server-ts/server-ts/');
  console.log('   - Database preserved in: server-ts/data/');
  console.log('   - Uploads folder: server-ts/uploads/');
  
} else {
  console.log('✅ No nested folder found - everything looks good!');
}

console.log('');
console.log('💡 To prevent this issue in the future:');
console.log('   - Always run scripts from the correct working directory');
console.log('   - Consider using absolute paths instead of relative paths');
