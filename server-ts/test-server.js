// Simple test to check if the compiled server works
console.log('Testing server startup...');

try {
  require('./dist/main.js');
} catch (error) {
  console.error('Error starting server:', error);
  console.error('Stack trace:', error.stack);
}
