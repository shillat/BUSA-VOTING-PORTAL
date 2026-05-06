const DatabaseWrapper = require('./db-wrapper');
const path = require('path');

console.log('Testing database connection...');

const dbPath = path.resolve(__dirname, 'database.sqlite');
console.log('Database path:', dbPath);

const db = new DatabaseWrapper(dbPath, (err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  } else {
    console.log('Database connection successful!');
    
    // Test a simple query
    db.get("SELECT COUNT(*) as count FROM admin_users", [], (err, row) => {
      if (err) {
        console.error('Query failed:', err);
        process.exit(1);
      } else {
        console.log('Test query successful! Admin users count:', row.count);
        process.exit(0);
      }
    });
  }
});
