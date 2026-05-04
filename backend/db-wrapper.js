// Database wrapper to maintain sqlite3 API compatibility while using better-sqlite3
const Database = require('better-sqlite3');

class DatabaseWrapper {
  constructor(dbPath, callback) {
    try {
      this.db = new Database(dbPath);
      
      // Create additional tables if they don't exist
      try {
        this.db.exec("ALTER TABLE candidates ADD COLUMN faculty TEXT");
      } catch (err) {
        // Ignore error if column already exists
      }
      try {
        this.db.exec("ALTER TABLE candidates ADD COLUMN slogan TEXT");
      } catch (err) {
        // Ignore error if column already exists
      }
      
      // Create additional tables if they don't exist
      this.db.exec(`CREATE TABLE IF NOT EXISTS guidelines (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          content TEXT,
          category TEXT,
          is_published BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_by TEXT
        )`);
        
      this.db.exec(`CREATE TABLE IF NOT EXISTS election_calendar (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          description TEXT,
          event_date DATETIME,
          event_type TEXT,
          location TEXT,
          is_published BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_by TEXT
        )`);
      
      console.log('Connected to SQLite database.');
      if (callback) callback(null);
    } catch (err) {
      console.error('Database connection error:', err);
      if (callback) callback(err);
    }
  }

  // Wrapper for run method
  run(sql, params, callback) {
    try {
      const stmt = this.db.prepare(sql);
      const result = stmt.run(params);
      if (callback) callback(null, result);
      return result;
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  }

  // Wrapper for get method
  get(sql, params, callback) {
    try {
      const stmt = this.db.prepare(sql);
      const result = stmt.get(params);
      if (callback) callback(null, result);
      return result;
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  }

  // Wrapper for all method
  all(sql, params, callback) {
    try {
      const stmt = this.db.prepare(sql);
      const result = stmt.all(params);
      if (callback) callback(null, result);
      return result;
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  }

  // Wrapper for exec method
  exec(sql, callback) {
    try {
      const result = this.db.exec(sql);
      if (callback) callback(null, result);
      return result;
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  }

  // Close method
  close(callback) {
    try {
      this.db.close();
      if (callback) callback(null);
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  }
}

module.exports = DatabaseWrapper;
