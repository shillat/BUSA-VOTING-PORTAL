const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  /*
  // Drop existing tables to refresh schema
  db.run("DROP TABLE IF EXISTS votes");
  db.run("DROP TABLE IF EXISTS candidates");
  db.run("DROP TABLE IF EXISTS elections");
  db.run("DROP TABLE IF EXISTS announcements");
  db.run("DROP TABLE IF EXISTS security_logs");
  db.run("DROP TABLE IF EXISTS admin_users");
  db.run("DROP TABLE IF EXISTS voter_registrations");
  db.run("DROP TABLE IF EXISTS students_master");
  */

  // Students master table
  db.run(`
    CREATE TABLE IF NOT EXISTS students_master (
      reg_no TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      type TEXT, -- 'Regular' or 'In-Service'
      is_registered_sem BOOLEAN,
      expected_grad_year INTEGER,
      campus TEXT,
      department TEXT
    )
  `);

  // Voter registrations table
  db.run(`
    CREATE TABLE IF NOT EXISTS voter_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reg_no TEXT UNIQUE,
      voter_id TEXT, -- Plain voter ID for status check
      password_hash TEXT,
      evidence_url TEXT,
      status TEXT, -- 'Pending', 'Approved', 'Rejected'
      rejection_reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reg_no) REFERENCES students_master(reg_no)
    )
  `);

  // Admin users table
  db.run(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id TEXT UNIQUE,
      password_hash TEXT,
      name TEXT,
      email TEXT,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Elections table
  db.run(`
    CREATE TABLE IF NOT EXISTS elections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      start_date DATETIME,
      end_date DATETIME,
      status TEXT DEFAULT 'upcoming', -- 'upcoming', 'active', 'completed', 'cancelled'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER,
      FOREIGN KEY (created_by) REFERENCES admin_users(id)
    )
  `);

  // Candidates table
  db.run(`
    CREATE TABLE IF NOT EXISTS candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      election_id INTEGER,
      name TEXT,
      position TEXT,
      manifesto TEXT,
      faculty TEXT,
      slogan TEXT,
      photo_url TEXT,
      votes_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (election_id) REFERENCES elections(id)
    )
  `);

  // Votes table
  db.run(`
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      election_id INTEGER,
      voter_reg_no TEXT,
      candidate_id INTEGER,
      voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      FOREIGN KEY (election_id) REFERENCES elections(id),
      FOREIGN KEY (candidate_id) REFERENCES candidates(id),
      FOREIGN KEY (voter_reg_no) REFERENCES voter_registrations(reg_no),
      UNIQUE(election_id, voter_reg_no) -- One vote per election per voter
    )
  `);

  // Announcements table
  db.run(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      type TEXT, -- 'Announcement', 'Guideline', 'Urgent'
      target_audience TEXT DEFAULT 'all',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT
    )
  `);

  // Guidelines table
  db.run(`
    CREATE TABLE IF NOT EXISTS guidelines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      category TEXT, -- 'Voter', 'Candidate', 'General'
      is_published BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT
    )
  `);

  // Election Calendar table
  db.run(`
    CREATE TABLE IF NOT EXISTS election_calendar (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      event_date DATETIME,
      event_type TEXT, -- 'Registration', 'Voting', 'Tally', 'Results'
      location TEXT,
      is_published BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT
    )
  `);

  // Security logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS security_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_type TEXT, -- 'admin', 'voter'
      user_id TEXT,
      action TEXT,
      ip_address TEXT,
      user_agent TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      details TEXT
    )
  `);

  // Seed data
  const studentStmt = db.prepare("INSERT OR IGNORE INTO students_master VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  studentStmt.run("24/BSE/BU/R/0008", "Atukwatse Blessing", "atukwatseblessing@gmail.com", "Regular", true, 2027, "main", "CI");
  studentStmt.run("24/BSE/BU/R/0003", "Naigaga Shillah", "shillahnaigaga5@gmail.com", "Regular", false, 2027, "main", "CI");
  studentStmt.run("22/BTH/BU/H/0012", "Kakande Charlse", "charlsek@gmail.com", "In-Service", true, 2025, "main", "RS");
  studentStmt.run("19/BTH/BU/H/0012", "Nakamya Diana", "diana@gmail.com", "In-Service", false, 2022, "main", "RS");
  studentStmt.run("21/EDS/BU/R/0003", "Kamya Lawrence", "lawrencekamya@gmail.com", "Regular", true, 2026, "EDS");
  studentStmt.run("21/EDS/BU/H/0003", "Katongore Lawrence", "lawrence@gmail.com", "In-Service", true, 2026, "virtual", "EDS");
  studentStmt.finalize();

  // Seed admin user
  const adminStmt = db.prepare("INSERT OR IGNORE INTO admin_users (admin_id, password_hash, name, email, role) VALUES (?, ?, ?, ?, ?)");
  const adminPassword = bcrypt.hashSync('admin123', 10);
  adminStmt.run('admin', adminPassword, 'System Administrator', 'admin@busa.edu', 'super_admin');
  adminStmt.finalize();

  console.log("Database initialized with comprehensive schema for voting system!");
});

db.close();
