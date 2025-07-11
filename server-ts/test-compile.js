console.log('Testing compilation...');

// Test import
try {
  const { SearchUsersUseCase } = require('./dist/application/use-cases/user/SearchUsersUseCase');
  console.log('SearchUsersUseCase imported successfully');
} catch (error) {
  console.error('Error importing SearchUsersUseCase:', error.message);
}

console.log('Test completed');
