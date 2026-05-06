// Database wrapper to maintain sqlite3 API compatibility while using better-sqlite3
const Database = require('better-sqlite3');

class DatabaseWrapper {
  constructor(dbPath, callback) {
    try {
      this.db = new Database(dbPath);
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
