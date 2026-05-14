const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { URL } = require('url');
const nodemailer = require('nodemailer');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const app = express();

const configuredOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultOrigins = new Set([
  'https://busa-voting-portal.vercel.app',
  'https://busa-voting-portal-cwwgearkj-shillah-naigagas-projects.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

configuredOrigins.forEach((origin) => defaultOrigins.add(origin));

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (defaultOrigins.has(origin)) return true;

  try {
    const parsed = new URL(origin);
    return parsed.hostname.endsWith('.vercel.app');
  } catch (error) {
    return false;
  }
};

// CORS - allow local dev, production domain, and Vercel preview deployments
app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Secret
const JWT_SECRET = 'busa_voting_system_2026_secret_key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Security logging middleware
const logSecurityEvent = (userType, userId, action, ipAddress, userAgent, details = '') => {
  const logEntry = {
    user_type: userType,
    user_id: userId,
    action: action,
    ip_address: ipAddress,
    user_agent: userAgent,
    details: details
  };

  db.run(
    `INSERT INTO security_logs (user_type, user_id, action, ip_address, user_agent, details) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [logEntry.user_type, logEntry.user_id, logEntry.action, logEntry.ip_address, logEntry.user_agent, logEntry.details]
  );
};

// Set up file uploads
const uploadFolder = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const regNumSafe = (req.body.reg_no || 'unknown').replace(/\//g, '-');
    cb(null, regNumSafe + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

let dbPath = path.resolve(__dirname, 'database.sqlite');

// Ensure directory exists for Render
if (process.env.RENDER_DISK_PATH) {
  dbPath = path.join(process.env.RENDER_DISK_PATH, 'database.sqlite');
  try {
    if (!fs.existsSync(process.env.RENDER_DISK_PATH)) {
      fs.mkdirSync(process.env.RENDER_DISK_PATH, { recursive: true });
      console.log('Created directory:', process.env.RENDER_DISK_PATH);
    }
  } catch (error) {
    console.error('Failed to create directory:', error);
    // Fallback to local path
    dbPath = path.resolve(__dirname, 'database.sqlite');
  }
}

console.log('Database path:', dbPath);
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database.');
    
    // Initialize database schema
    db.serialize(() => {
      // Create tables if they don't exist
      db.run(`CREATE TABLE IF NOT EXISTS students_master (
        reg_no TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        type TEXT,
        is_registered_sem BOOLEAN,
        expected_grad_year INTEGER,
        campus TEXT,
        department TEXT
      )`);
      
      db.run(`CREATE TABLE IF NOT EXISTS voter_registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reg_no TEXT UNIQUE,
        voter_id TEXT,
        password_hash TEXT,
        evidence_url TEXT,
        status TEXT,
        rejection_reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      
      db.run(`CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id TEXT UNIQUE,
        password_hash TEXT,
        name TEXT,
        email TEXT,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      
      db.run(`CREATE TABLE IF NOT EXISTS elections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        start_date DATETIME,
        end_date DATETIME,
        status TEXT DEFAULT 'upcoming',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER
      )`);
      
      db.run(`CREATE TABLE IF NOT EXISTS candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        election_id INTEGER,
        name TEXT,
        position TEXT,
        manifesto TEXT,
        faculty TEXT,
        slogan TEXT,
        photo_url TEXT,
        votes_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      
      db.run(`CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        election_id INTEGER,
        voter_reg_no TEXT,
        candidate_id INTEGER,
        voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ip_address TEXT,
        UNIQUE(election_id, voter_reg_no)
      )`);
      
      db.run(`CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        type TEXT,
        target_audience TEXT DEFAULT 'all',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT
      )`);
      
      db.run(`CREATE TABLE IF NOT EXISTS guidelines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        category TEXT,
        is_published BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT
      )`);
      
      db.run(`CREATE TABLE IF NOT EXISTS security_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_type TEXT,
        user_id TEXT,
        action TEXT,
        ip_address TEXT,
        user_agent TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        details TEXT
      )`);
      
      db.run(`CREATE TABLE IF NOT EXISTS voter_ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        voter_reg_no TEXT,
        rating INTEGER,
        feedback TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (voter_reg_no) REFERENCES voter_registrations(reg_no)
      )`);
      
      db.run(`CREATE TABLE IF NOT EXISTS voter_reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        voter_reg_no TEXT,
        election_id INTEGER,
        candidate_id INTEGER,
        review_text TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (voter_reg_no) REFERENCES voter_registrations(reg_no),
        FOREIGN KEY (election_id) REFERENCES elections(id),
        FOREIGN KEY (candidate_id) REFERENCES candidates(id)
      )`);
      
      // Add columns if they don't exist
      db.run("ALTER TABLE candidates ADD COLUMN faculty TEXT", (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          // Ignore error if column already exists
        }
      });
      db.run("ALTER TABLE candidates ADD COLUMN slogan TEXT", (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          // Ignore error if column already exists
        }
      });
      
      // Seed admin user if not exists
      const adminPassword = bcrypt.hashSync('admin123', 10);
      db.run("INSERT OR IGNORE INTO admin_users (admin_id, password_hash, name, email, role) VALUES (?, ?, ?, ?, ?)", 
        ['admin', adminPassword, 'System Administrator', 'admin@busa.edu', 'super_admin']);
      
      // Seed student data if not exists
      const studentStmt = db.prepare("INSERT OR IGNORE INTO students_master VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      studentStmt.run("24/BSE/BU/R/0008", "Atukwatse Blessing", "atukwatseblessing@gmail.com", "Regular", true, 2027, "main", "CI");
      studentStmt.run("24/BTH/BU/H/0003", "Naigaga Shillah", "shillahnaigaga5@gmail.com", "In-Service", false, 2027, "main", "CI");
      studentStmt.run("24/BTH/BU/H/0015", "Bwabye Kenneth", "kenethbwabye25@gmail.com", "In-Service", true, 2025, "main", "RS");
      studentStmt.run("19/BTH/BU/H/0012", "Nakamya Diana", "diana@gmail.com", "In-Service", false, 2022, "main", "RS");
      studentStmt.run("21/EDS/BU/R/0003", "Kamya Lawrence", "lawrencekamya@gmail.com", "Regular", true, 2026, "main", "EDS");
      studentStmt.run("21/EDS/BU/H/0003", "Katongore Lawrence", "lawrence@gmail.com", "In-Service", true, 2026, "main", "EDS");
      studentStmt.run("22/EDA/BU/H/0004", "Nakalyoowa Brenda", "brenda@gmail.com", "In-Service", true, 2027, "main", "EDA");
      studentStmt.run("21/BTH/BU/H/0003", "Frank Musambi", "frank@gmail.com", "In-Service", false, 2027, "main", "RS");
      studentStmt.finalize();
      
      console.log('Database schema initialized successfully!');
    });
  }
});

app.use('/uploads', express.static(uploadFolder));

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'busa.voting.system@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Helper to send real email
const sendEmail = async (email, subject, message) => {
  // Check if email configuration is properly set up
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-gmail-app-password') {
    console.error('\n🚨 EMAIL CONFIGURATION ERROR:');
    console.error('EMAIL_USER or EMAIL_PASS not properly configured in .env file');
    console.error('Please see EMAIL_SETUP_GUIDE.md for instructions');
    console.log(`\n--- EMAIL FALLBACK (Mock) ---`);
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log(`-------------------------\n`);
    return false;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: message
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${email}:`, info.messageId);
    return true;
  } catch (error) {
    console.error('\n🚨 EMAIL SENDING ERROR:');
    console.error('Failed to send email to:', email);
    console.error('Error details:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('Authentication failed - check EMAIL_USER and EMAIL_PASS in .env');
      console.error('Make sure you are using a Gmail App Password, not your regular password');
    } else if (error.code === 'ECONNECTION') {
      console.error('Connection failed - check internet connection and firewall settings');
    }
    
    console.log(`\n--- EMAIL FALLBACK (Mock) ---`);
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log(`-------------------------\n`);
    return false;
  }
};

app.post('/api/register', (req, res, next) => {
  // Catch Multer file size errors specifically if needed
  upload.single('evidence_file')(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds 10MB limit.' });
    } else if (err) {
      return res.status(500).json({ error: 'File upload error.' });
    }
    next();
  });
}, async (req, res) => {
  const { reg_no, on_campus } = req.body;
  const isOnCampus = on_campus === 'true'; // string from formData
  const ipAddress = req.ip;
  const userAgent = req.get('User-Agent');

  if (!reg_no) {
    logSecurityEvent('voter', 'unknown', 'REGISTRATION_FAILED', ipAddress, userAgent, 'Missing registration number');
    return res.status(400).json({ error: 'Registration Number is required.' });
  }

  try {
    // 1. Check if already registered
    const existingReg = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM voter_registrations WHERE reg_no = ?", [reg_no], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingReg) {
      logSecurityEvent('voter', reg_no, 'REGISTRATION_FAILED', ipAddress, userAgent, 'Registration already exists');
      return res.status(400).json({ error: 'Registration already exists for this number.' });
    }

    // 2. Check student_master
    const student = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM students_master WHERE reg_no = ?", [reg_no], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!student) {
      logSecurityEvent('voter', reg_no, 'REGISTRATION_FAILED', ipAddress, userAgent, 'Student not found in master records');
      return res.status(404).json({ error: 'Student not found in master records.' });
    }

    // Password has been removed for voters
    const password_hash = "";

    if (student.type === 'Regular') {
      // Path A: Regulars
      if (!student.is_registered_sem) {
        const rejectionMsg = "Registration failed: You must be registered for the current semester.";
        logSecurityEvent('voter', reg_no, 'REGISTRATION_FAILED', ipAddress, userAgent, 'Regular student not registered for current semester');
        sendEmail(student.email, "Registration Rejected", rejectionMsg);
        return res.status(400).json({ error: rejectionMsg });
      }

      // Approve immediately and generate Voter ID
      const voterId = 'VID-' + Math.floor(100000 + Math.random() * 900000);
      const voterIdHash = await bcrypt.hash(voterId, 10);

      const insertSql = "INSERT INTO voter_registrations (reg_no, voter_id, password_hash, status) VALUES (?, ?, ?, 'Approved')";
      db.run(insertSql, [reg_no, voterId, voterIdHash], function (err) {
        if (err) return res.status(500).json({ error: 'Database error saving registration.' });

        logSecurityEvent('voter', reg_no, 'REGISTRATION_APPROVED', ipAddress, userAgent, `Regular student approved with Voter ID: ${voterId}`);
        sendEmail(student.email, "Voter Registration Approved", `Congratulations! You have been successfully registered as a voter. Your unique Voter ID is: ${voterId}`);
        return res.json({ success: true, message: "Registration successful. You are approved and your Voter ID has been sent to your email.", voter_id: voterId });
      });

    } else if (student.type === 'In-Service') {
      // In-Service students must also be registered for the current semester
      if (!student.is_registered_sem) {
        const rejectionMsg = "Registration failed: You must be registered for the current semester to be eligible to vote.";
        logSecurityEvent('voter', reg_no, 'REGISTRATION_FAILED', ipAddress, userAgent, 'In-Service student not registered for current semester');
        sendEmail(student.email, "Registration Rejected", rejectionMsg);
        return res.status(400).json({ error: rejectionMsg });
      }

      const voterId = 'VID-' + Math.floor(100000 + Math.random() * 900000);
      const voterIdHash = await bcrypt.hash(voterId, 10);

      const insertSql = "INSERT INTO voter_registrations (reg_no, voter_id, password_hash, status) VALUES (?, ?, ?, 'Approved')";
      db.run(insertSql, [reg_no, voterId, voterIdHash], function (err) {
        if (err) return res.status(500).json({ error: 'Database error saving registration.' });
        logSecurityEvent('voter', reg_no, 'REGISTRATION_APPROVED', ipAddress, userAgent, `In-Service student approved with Voter ID: ${voterId}`);
        sendEmail(student.email, "Voter Registration Approved", `Congratulations! You have been successfully registered as a voter. Your unique Voter ID is: ${voterId}`);
        return res.json({ success: true, message: "Registration successful. You are approved and your Voter ID has been sent to your email.", voter_id: voterId });
      });

    } else {
      logSecurityEvent('voter', reg_no, 'REGISTRATION_FAILED', ipAddress, userAgent, 'Unknown student type in records');
      return res.status(400).json({ error: "Unknown student type in records." });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Check voter status
app.get('/api/voter/status/:reg_no', (req, res) => {
  const { reg_no } = req.params;

  const query = `
    SELECT vr.*, s.name, s.type, s.campus, s.department 
    FROM voter_registrations vr 
    JOIN students_master s ON vr.reg_no = s.reg_no
    WHERE vr.reg_no = ?
  `;

  db.get(query, [reg_no], (err, voter) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (!voter) {
      logSecurityEvent('voter', reg_no, 'STATUS_CHECK_FAILED', req.ip, req.get('User-Agent'), 'No registration record found');
      return res.status(404).json({ error: 'No registration record found for this Registration Number.' });
    }

    logSecurityEvent('voter', reg_no, 'STATUS_CHECKED', req.ip, req.get('User-Agent'), `Status: ${voter.status}`);
    res.json(voter);
  });
});

// Admin Approval Interface
app.get('/api/admin/verify', (req, res) => {
  const query = `
    SELECT v.id, v.reg_no, v.evidence_url, v.status, v.created_at, s.name, s.type, s.expected_grad_year, s.email 
    FROM voter_registrations v 
    JOIN students_master s ON v.reg_no = s.reg_no
    WHERE v.status = 'Pending'
    ORDER BY v.created_at DESC
  `;
  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

app.post('/api/admin/approve/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.get("SELECT s.email, s.name FROM voter_registrations v JOIN students_master s ON v.reg_no = s.reg_no WHERE v.id = ?", [id], async (err, row) => {
    if (!row) return res.status(404).json({ error: 'Record not found' });

    const voterId = 'VID-' + Math.floor(100000 + Math.random() * 900000);
    const voterIdHash = await bcrypt.hash(voterId, 10);

    db.run("UPDATE voter_registrations SET status = 'Approved', voter_id = ?, password_hash = ? WHERE id = ?", [voterId, voterIdHash, id], async function (err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      
      const emailSent = await sendEmail(row.email, "Voter Registration Approved", 
        `Dear ${row.name},\n\nCongratulations! Your voter registration has been approved by the Admin.\n\nYour unique Voter ID is: ${voterId}\n\nYou can now login to the voting portal using:\n- Registration Number: Your student registration number\n- Voter ID: ${voterId}\n\nBest regards,\nBUSA Voting System Administration`);
      
      const message = emailSent 
        ? "Registration approved, Voter ID generated and email sent successfully"
        : "Registration approved and Voter ID generated (email delivery failed - check server logs)";
      
      res.json({ success: true, message, voter_id: voterId, email_sent: emailSent });
    });
  });
});

app.post('/api/admin/reject/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { reason = "Your registration has been rejected." } = req.body;

  db.get("SELECT s.email, s.name FROM voter_registrations v JOIN students_master s ON v.reg_no = s.reg_no WHERE v.id = ?", [id], async (err, row) => {
    if (!row) return res.status(404).json({ error: 'Record not found' });

    db.run("UPDATE voter_registrations SET status = 'Rejected', rejection_reason = ? WHERE id = ?", [reason, id], async function (err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      
      const emailSent = await sendEmail(row.email, "Voter Registration Rejected", 
        `Dear ${row.name},\n\nYour voter registration has been rejected by the Admin.\n\nRejection Reason: ${reason}\n\nIf you believe this is an error, please contact the BUSA administration.\n\nBest regards,\nBUSA Voting System Administration`);
      
      const message = emailSent 
        ? "Registration rejected and email sent successfully"
        : "Registration rejected (email delivery failed - check server logs)";
      
      res.json({ success: true, message, email_sent: emailSent });
    });
  });
});

// AUTHENTICATION ENDPOINTS

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { admin_id, password } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.get('User-Agent');

  if (!admin_id || !password) {
    return res.status(400).json({ error: 'Admin ID and password are required' });
  }

  db.get("SELECT * FROM admin_users WHERE admin_id = ?", [admin_id], (err, admin) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (!admin) {
      logSecurityEvent('admin', admin_id, 'LOGIN_FAILED', ipAddress, userAgent, 'Admin ID not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    bcrypt.compare(password, admin.password_hash, (err, isValid) => {
      if (err) return res.status(500).json({ error: 'Authentication error' });

      if (!isValid) {
        logSecurityEvent('admin', admin_id, 'LOGIN_FAILED', ipAddress, userAgent, 'Invalid password');
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { admin_id: admin.admin_id, role: admin.role, name: admin.name },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      logSecurityEvent('admin', admin_id, 'LOGIN_SUCCESS', ipAddress, userAgent);
      res.json({
        success: true,
        token,
        admin: {
          admin_id: admin.admin_id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      });
    });
  });
});

// Voter Login
app.post('/api/voter/login', (req, res) => {
  const { reg_no, voter_id } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.get('User-Agent');

  if (!reg_no || !voter_id) {
    return res.status(400).json({ error: 'Registration number and Voter ID are required' });
  }

  const query = `
    SELECT vr.*, s.name, s.email, s.type, s.campus, s.department 
    FROM voter_registrations vr 
    JOIN students_master s ON vr.reg_no = s.reg_no 
    WHERE vr.reg_no = ? AND vr.status = 'Approved'
  `;

  db.get(query, [reg_no], (err, voter) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (!voter) {
      logSecurityEvent('voter', reg_no, 'LOGIN_FAILED', ipAddress, userAgent, 'Voter not found or not approved');
      return res.status(401).json({ error: 'Invalid credentials or account not approved' });
    }

    bcrypt.compare(voter_id, voter.password_hash, (err, isValid) => {
      if (err) return res.status(500).json({ error: 'Authentication error' });

      if (!isValid) {
        logSecurityEvent('voter', reg_no, 'LOGIN_FAILED', ipAddress, userAgent, 'Invalid Voter ID');
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { reg_no: voter.reg_no, name: voter.name, type: 'voter' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      logSecurityEvent('voter', reg_no, 'LOGIN_SUCCESS', ipAddress, userAgent);
      res.json({
        success: true,
        token,
        voter: {
          reg_no: voter.reg_no,
          voter_id: voter.voter_id,
          name: voter.name,
          email: voter.email,
          student_type: voter.type,
          campus: voter.campus,
          department: voter.department
        }
      });
    });
  });
});

// QR Code Login
app.post('/api/voter/qr-login', (req, res) => {
  const { qrData } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.get('User-Agent');

  if (!qrData) {
    return res.status(400).json({ error: 'QR data is required' });
  }

  try {
    const parsedData = JSON.parse(qrData);
    
    if (!parsedData.regNo || !parsedData.voterId || parsedData.type !== 'voter_login') {
      return res.status(400).json({ error: 'Invalid QR code format' });
    }

    const query = `
      SELECT vr.*, s.name, s.email, s.type, s.campus, s.department 
      FROM voter_registrations vr 
      JOIN students_master s ON vr.reg_no = s.reg_no 
      WHERE vr.reg_no = ? AND vr.voter_id = ? AND vr.status = 'Approved'
    `;

    db.get(query, [parsedData.regNo, parsedData.voterId], (err, voter) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      if (!voter) {
        logSecurityEvent('voter', parsedData.regNo, 'QR_LOGIN_FAILED', ipAddress, userAgent, 'Voter not found or not approved');
        return res.status(401).json({ error: 'Invalid QR code or account not approved' });
      }

      const token = jwt.sign(
        { reg_no: voter.reg_no, name: voter.name, type: 'voter' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      logSecurityEvent('voter', voter.reg_no, 'QR_LOGIN_SUCCESS', ipAddress, userAgent);
      res.json({
        success: true,
        token,
        voter: {
          reg_no: voter.reg_no,
          voter_id: voter.voter_id,
          name: voter.name,
          email: voter.email,
          student_type: voter.type,
          campus: voter.campus,
          department: voter.department
        }
      });
    });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid QR code data format' });
  }
});


// ELECTION MANAGEMENT ENDPOINTS

// Create Election
app.post('/api/elections', authenticateToken, (req, res) => {
  const { title, description, start_date, end_date } = req.body;
  const adminId = req.user.admin_id;

  if (!title || !start_date || !end_date) {
    return res.status(400).json({ error: 'Title, start date, and end date are required' });
  }

  const query = `
    INSERT INTO elections (title, description, start_date, end_date, created_by) 
    VALUES (?, ?, ?, ?, (SELECT id FROM admin_users WHERE admin_id = ?))
  `;

  db.run(query, [title, description, start_date, end_date, adminId], function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });

    logSecurityEvent('admin', adminId, 'ELECTION_CREATED', req.ip, req.get('User-Agent'), `Election ID: ${this.lastID}`);
    res.json({
      success: true,
      message: 'Election created successfully',
      election_id: this.lastID
    });
  });
});

// Get All Elections
app.get('/api/elections', (req, res) => {
  const query = `
    SELECT e.*, a.name as created_by_name 
    FROM elections e 
    LEFT JOIN admin_users a ON e.created_by = a.id 
    ORDER BY e.created_at DESC
  `;

  db.all(query, (err, elections) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(elections);
  });
});

// Get Active Elections
app.get('/api/elections/active', (req, res) => {
  const query = `
    SELECT e.*, a.name as created_by_name 
    FROM elections e 
    LEFT JOIN admin_users a ON e.created_by = a.id 
    WHERE e.status = 'active' 
    ORDER BY e.start_date ASC
  `;

  db.all(query, (err, elections) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(elections);
  });
});

// Update Election Status
app.put('/api/elections/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const adminId = req.user.admin_id;

  if (!['upcoming', 'active', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const updateSql = status === 'active'
    ? "UPDATE elections SET status = ?, start_date = CURRENT_TIMESTAMP, end_date = CASE WHEN datetime(end_date) <= datetime('now') THEN datetime('now', '+1 day') ELSE end_date END WHERE id = ?"
    : "UPDATE elections SET status = ? WHERE id = ?";

  db.run(updateSql, [status, id], function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Election not found' });
    }

    logSecurityEvent('admin', adminId, 'ELECTION_STATUS_UPDATED', req.ip, req.get('User-Agent'), `Election ID: ${id}, Status: ${status}`);
    res.json({ success: true, message: 'Election status updated' });
  });
});

// Delete Election (Admin)
app.delete('/api/elections/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const adminId = req.user.admin_id;

  // Cascade: delete votes → candidates → election
  db.run("DELETE FROM votes WHERE election_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error deleting votes' });
    db.run("DELETE FROM candidates WHERE election_id = ?", [id], (err) => {
      if (err) return res.status(500).json({ error: 'Database error deleting candidates' });
      db.run("DELETE FROM elections WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: 'Database error deleting election' });
        if (this.changes === 0) return res.status(404).json({ error: 'Election not found' });
        logSecurityEvent('admin', adminId, 'ELECTION_DELETED', req.ip, req.get('User-Agent'), `Election ID: ${id}`);
        res.json({ success: true, message: 'Election deleted successfully' });
      });
    });
  });
});

// CANDIDATE MANAGEMENT ENDPOINTS

// Add Candidate
app.post('/api/elections/:id/candidates', authenticateToken, upload.single('photo'), (req, res) => {
  const { id } = req.params;
  const { name, position, manifesto, faculty, slogan } = req.body;
  const adminId = req.user.admin_id;
  const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !position) {
    return res.status(400).json({ error: 'Name and position are required' });
  }

  db.run(
    "INSERT INTO candidates (election_id, name, position, manifesto, faculty, slogan, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, name, position, manifesto, faculty, slogan, photo_url],
    function (err) {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      logSecurityEvent('admin', adminId, 'CANDIDATE_ADDED', req.ip, req.get('User-Agent'), `Candidate ID: ${this.lastID}`);
      res.json({
        success: true,
        message: 'Candidate added successfully',
        candidate_id: this.lastID
      });
    }
  );
});

// Get All Candidates (Admin)
app.get('/api/candidates', (req, res) => {
  const query = `
    SELECT c.*, COALESCE(e.title, 'Unknown Election') as election_title 
    FROM candidates c 
    LEFT JOIN elections e ON c.election_id = e.id 
    ORDER BY election_title, c.name
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching candidates:', err);
      return res.status(500).json({ error: 'Database error fetching candidates' });
    }
    res.json(rows || []);
  });
});

// Get Candidates for Election
app.get('/api/elections/:id/candidates', (req, res) => {
  const { id } = req.params;

  db.all("SELECT * FROM candidates WHERE election_id = ? ORDER BY position, name", [id], (err, candidates) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(candidates);
  });
});

// Update Candidate
app.put('/api/candidates/:id', authenticateToken, upload.single('photo'), (req, res) => {
  const { id } = req.params;
  const { name, position, manifesto, faculty, slogan } = req.body;
  const adminId = req.user.admin_id;

  let query = "UPDATE candidates SET name = ?, position = ?, manifesto = ?, faculty = ?, slogan = ?";
  let params = [name, position, manifesto, faculty, slogan];

  if (req.file) {
    query += ", photo_url = ?";
    params.push(`/uploads/${req.file.filename}`);
  }

  query += " WHERE id = ?";
  params.push(id);

  db.run(query, params, function (err) {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    logSecurityEvent('admin', adminId, 'CANDIDATE_UPDATED', req.ip, req.get('User-Agent'), `Candidate ID: ${id}`);
    res.json({ success: true, message: 'Candidate updated' });
  });
});

// Delete Candidate
app.delete('/api/candidates/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const adminId = req.user.admin_id;

  db.run("DELETE FROM candidates WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    logSecurityEvent('admin', adminId, 'CANDIDATE_DELETED', req.ip, req.get('User-Agent'), `Candidate ID: ${id}`);
    res.json({ success: true, message: 'Candidate deleted' });
  });
});

// Get Single Candidate
app.get('/api/candidates/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT c.*, COALESCE(e.title, 'Unknown Election') as election_title 
    FROM candidates c 
    LEFT JOIN elections e ON c.election_id = e.id 
    WHERE c.id = ?
  `;

  db.get(query, [id], (err, candidate) => {
    if (err) {
      console.error('Error fetching candidate:', err);
      return res.status(500).json({ error: 'Database error fetching candidate' });
    }

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json(candidate);
  });
});

// VOTING ENDPOINTS

// Cast Vote
app.post('/api/vote', authenticateToken, (req, res) => {
  const { election_id, candidate_id } = req.body;
  const voterRegNo = req.user.reg_no;
  const ipAddress = req.ip;

  if (!election_id || !candidate_id) {
    return res.status(400).json({ error: 'Election ID and candidate ID are required' });
  }

  // Check if election is active
  db.get(
    "SELECT * FROM elections WHERE id = ? AND status = 'active'",
    [election_id],
    (err, election) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      if (!election) {
        return res.status(400).json({ error: 'Election is not active or not found' });
      }

      // Check if voter has already voted
      db.get(
        "SELECT * FROM votes WHERE election_id = ? AND voter_reg_no = ?",
        [election_id, voterRegNo],
        (err, existingVote) => {
          if (err) return res.status(500).json({ error: 'Database error' });

          if (existingVote) {
            logSecurityEvent('voter', voterRegNo, 'VOTE_ATTEMPT_DUPLICATE', ipAddress, req.get('User-Agent'), `Election ID: ${election_id}`);
            return res.status(400).json({ error: 'You have already voted in this election' });
          }

          // Cast the vote
          db.run(
            "INSERT INTO votes (election_id, voter_reg_no, candidate_id, ip_address) VALUES (?, ?, ?, ?)",
            [election_id, voterRegNo, candidate_id, ipAddress],
            function (err) {
              if (err) return res.status(500).json({ error: 'Database error' });

              // Update candidate vote count
              db.run(
                "UPDATE candidates SET votes_count = votes_count + 1 WHERE id = ?",
                [candidate_id],
                (err) => {
                  if (err) return res.status(500).json({ error: 'Database error' });

                  logSecurityEvent('voter', voterRegNo, 'VOTE_CAST', ipAddress, req.get('User-Agent'), `Election ID: ${election_id}, Candidate ID: ${candidate_id}`);
                  res.json({ success: true, message: 'Vote cast successfully' });
                }
              );
            }
          );
        }
      );
    }
  );
});

// Get Election Results
app.get('/api/elections/:id/results', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT c.*, COUNT(v.id) as vote_count
    FROM candidates c
    LEFT JOIN votes v ON c.id = v.candidate_id
    WHERE c.election_id = ?
    GROUP BY c.id
    ORDER BY vote_count DESC
  `;

  db.all(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Get Live Tally
app.get('/api/elections/:id/live-tally', (req, res) => {
  const { id } = req.params;

  // Get election info
  db.get("SELECT * FROM elections WHERE id = ?", [id], (err, election) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    // Get results
    const resultsQuery = `
      SELECT c.*, COUNT(v.id) as vote_count,
        ROUND((COUNT(v.id) * 100.0 / (SELECT COUNT(*) FROM votes WHERE election_id = ?)), 2) as percentage
      FROM candidates c
      LEFT JOIN votes v ON c.id = v.candidate_id
      WHERE c.election_id = ?
      GROUP BY c.id
      ORDER BY vote_count DESC
    `;

    db.all(resultsQuery, [id, id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      // Get total votes
      db.get("SELECT COUNT(*) as total_votes FROM votes WHERE election_id = ?", [id], (err, totalResult) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        res.json({
          election,
          results,
          total_votes: totalResult.total_votes
        });
      });
    });
  });
});

// Get Global Tally Stats
app.get('/api/global-tally', (req, res) => {
  db.get("SELECT COUNT(*) as total_votes FROM votes", (err, voteRow) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    db.get("SELECT COUNT(*) as total_eligible_voters FROM students_master", (err, eligibleRow) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      db.get("SELECT COUNT(DISTINCT voter_reg_no) as voters_turned_up FROM votes", (err, turnoutRow) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        db.get("SELECT COUNT(*) as registered_voters FROM voter_registrations WHERE status = 'Approved'", (err, registeredRow) => {
          if (err) return res.status(500).json({ error: 'Database error' });

          res.json({
            total_votes: voteRow.total_votes || 0,
            voters_turned_up: turnoutRow.voters_turned_up || 0,
            registered_voters: registeredRow.registered_voters || 0,
            total_eligible_voters: eligibleRow.total_eligible_voters || 0,
            total_voters: eligibleRow.total_eligible_voters || 0
          });
        });
      });
    });
  });
});

// VOTER DATABASE ENDPOINTS

// Get All Voters
app.get('/api/admin/voters', authenticateToken, (req, res) => {
  const query = `
    SELECT vr.*, s.name, s.email, s.type, s.campus, s.department 
    FROM voter_registrations vr 
    JOIN students_master s ON vr.reg_no = s.reg_no 
    ORDER BY vr.created_at DESC
  `;

  db.all(query, (err, voters) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(voters);
  });
});

// Get Voter Statistics
app.get('/api/admin/voter-stats', authenticateToken, (req, res) => {
  const queries = {
    total: "SELECT COUNT(*) as count FROM voter_registrations WHERE status = 'Approved'",
    pending: "SELECT COUNT(*) as count FROM voter_registrations WHERE status = 'Pending'",
    rejected: "SELECT COUNT(*) as count FROM voter_registrations WHERE status = 'Rejected'",
    by_type: "SELECT s.type, COUNT(*) as count FROM voter_registrations vr JOIN students_master s ON vr.reg_no = s.reg_no WHERE vr.status = 'Approved' GROUP BY s.type",
    by_campus: "SELECT s.campus, COUNT(*) as count FROM voter_registrations vr JOIN students_master s ON vr.reg_no = s.reg_no WHERE vr.status = 'Approved' GROUP BY s.campus"
  };

  const stats = {};
  let completed = 0;
  const totalQueries = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, query]) => {
    if (key === 'by_type' || key === 'by_campus') {
      db.all(query, (err, rows) => {
        if (!err) stats[key] = rows;
        if (++completed === totalQueries) res.json(stats);
      });
    } else {
      db.get(query, (err, row) => {
        if (!err) stats[key] = row.count;
        if (++completed === totalQueries) res.json(stats);
      });
    }
  });
});

// SECURITY LOGS ENDPOINTS

// Get Security Logs
app.get('/api/admin/security-logs', authenticateToken, (req, res) => {
  const { limit = 100, offset = 0, user_type, action } = req.query;

  let query = "SELECT * FROM security_logs WHERE 1=1";
  const params = [];

  if (user_type) {
    query += " AND user_type = ?";
    params.push(user_type);
  }

  if (action) {
    query += " AND action = ?";
    params.push(action);
  }

  query += " ORDER BY timestamp DESC LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, logs) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(logs);
  });
});

// Get Voter Personal Logs
app.get('/api/voter/security-logs', authenticateToken, (req, res) => {
  const voterRegNo = req.user.reg_no;
  if (!voterRegNo || req.user.type !== 'voter') return res.status(403).json({ error: 'Access denied' });

  db.all(
    "SELECT * FROM security_logs WHERE user_id = ? AND user_type = 'voter' ORDER BY timestamp DESC LIMIT 10",
    [voterRegNo],
    (err, logs) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(logs);
    }
  );
});

// ANNOUNCEMENTS ENDPOINTS

// Create Announcement
app.post('/api/admin/announcements', authenticateToken, (req, res) => {
  const { title, message, content, type = 'Announcement', target_audience = 'all' } = req.body;
  const adminId = req.user.admin_id;
  const body = message || content; // accept either field name

  if (!title || !body) {
    return res.status(400).json({ error: 'Title and message are required' });
  }

  db.run(
    "INSERT INTO announcements (title, content, type, target_audience, created_by) VALUES (?, ?, ?, ?, ?)",
    [title, body, type, target_audience, adminId],
    function (err) {
      if (err) {
        console.error('Announcement DB error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      logSecurityEvent('admin', adminId, 'ANNOUNCEMENT_CREATED', req.ip, req.get('User-Agent'), `Title: ${title}, Type: ${type}`);
      res.json({ success: true, message: 'Announcement created successfully', id: this.lastID });
    }
  );
});

// Get Announcements
app.get('/api/announcements', (req, res) => {
  const { type } = req.query;
  let query = "SELECT * FROM announcements";
  const params = [];

  if (type) {
    query += " WHERE type = ?";
    params.push(type);
  }

  query += " ORDER BY created_at DESC";

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Delete Announcement
app.delete('/api/admin/announcements/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const adminId = req.user.admin_id;

  db.run("DELETE FROM announcements WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    logSecurityEvent('admin', adminId, 'ANNOUNCEMENT_DELETED', req.ip, req.get('User-Agent'), `ID: ${id}`);
    res.json({ success: true, message: 'Announcement deleted' });
  });
});

// GUIDELINES ENDPOINTS

// Create Guideline
app.post('/api/admin/guidelines', authenticateToken, (req, res) => {
  const { title, content, category = 'General', is_published = false } = req.body;
  const adminId = req.user.admin_id;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  db.run(
    "INSERT INTO guidelines (title, content, category, is_published, created_by) VALUES (?, ?, ?, ?, ?)",
    [title, content, category, is_published ? 1 : 0, adminId],
    function (err) {
      if (err) {
        console.error('Guideline DB error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      logSecurityEvent('admin', adminId, 'GUIDELINE_CREATED', req.ip, req.get('User-Agent'), `Title: ${title}, Category: ${category}`);
      res.json({ success: true, message: 'Guideline created successfully', id: this.lastID });
    }
  );
});

// Get Guidelines
app.get('/api/guidelines', (req, res) => {
  const { published } = req.query;
  let query = "SELECT * FROM guidelines";
  const params = [];

  if (published === 'true') {
    query += " WHERE is_published = 1";
  } else if (published === 'false') {
    query += " WHERE is_published = 0";
  }

  query += " ORDER BY created_at DESC";

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows || []);
  });
});

// Update Guideline
app.put('/api/admin/guidelines/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, content, category, is_published } = req.body;
  const adminId = req.user.admin_id;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  db.run(
    "UPDATE guidelines SET title = ?, content = ?, category = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [title, content, category, is_published ? 1 : 0, id],
    function (err) {
      if (err) {
        console.error('Guideline update error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Guideline not found' });
      }

      logSecurityEvent('admin', adminId, 'GUIDELINE_UPDATED', req.ip, req.get('User-Agent'), `ID: ${id}`);
      res.json({ success: true, message: 'Guideline updated successfully' });
    }
  );
});

// Delete Guideline
app.delete('/api/admin/guidelines/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const adminId = req.user.admin_id;

  db.run("DELETE FROM guidelines WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Guideline not found' });
    }

    logSecurityEvent('admin', adminId, 'GUIDELINE_DELETED', req.ip, req.get('User-Agent'), `ID: ${id}`);
    res.json({ success: true, message: 'Guideline deleted' });
  });
});

// ELECTION CALENDAR ENDPOINTS

// Create Calendar Event
app.post('/api/admin/calendar', authenticateToken, (req, res) => {
  const { title, description, event_date, event_type, location } = req.body;
  const adminId = req.user.admin_id;

  if (!title || !event_date || !event_type) {
    return res.status(400).json({ error: 'Title, date, and type are required' });
  }

  db.run(
    "INSERT INTO election_calendar (title, description, event_date, event_type, location, created_by) VALUES (?, ?, ?, ?, ?, ?)",
    [title, description, event_date, event_type, location, adminId],
    function (err) {
      if (err) {
        console.error('Calendar event DB error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      logSecurityEvent('admin', adminId, 'CALENDAR_EVENT_CREATED', req.ip, req.get('User-Agent'), `Title: ${title}, Type: ${event_type}`);
      res.json({ success: true, message: 'Calendar event created successfully', id: this.lastID });
    }
  );
});

// Get Calendar Events
app.get('/api/calendar', (req, res) => {
  const { published } = req.query;
  let query = "SELECT * FROM election_calendar";
  const params = [];

  if (published === 'true') {
    query += " WHERE is_published = 1";
  } else if (published === 'false') {
    query += " WHERE is_published = 0";
  }

  query += " ORDER BY event_date ASC";

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows || []);
  });
});

// Update Calendar Event
app.put('/api/admin/calendar/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description, event_date, event_type, location, is_published } = req.body;
  const adminId = req.user.admin_id;

  if (!title || !event_date || !event_type) {
    return res.status(400).json({ error: 'Title, date, and type are required' });
  }

  db.run(
    "UPDATE election_calendar SET title = ?, description = ?, event_date = ?, event_type = ?, location = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [title, description, event_date, event_type, location, is_published ? 1 : 0, id],
    function (err) {
      if (err) {
        console.error('Calendar update error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Calendar event not found' });
      }

      logSecurityEvent('admin', adminId, 'CALENDAR_EVENT_UPDATED', req.ip, req.get('User-Agent'), `ID: ${id}`);
      res.json({ success: true, message: 'Calendar event updated successfully' });
    }
  );
});

// Delete Calendar Event
app.delete('/api/admin/calendar/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const adminId = req.user.admin_id;

  db.run("DELETE FROM election_calendar WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Calendar event not found' });
    }

    logSecurityEvent('admin', adminId, 'CALENDAR_EVENT_DELETED', req.ip, req.get('User-Agent'), `ID: ${id}`);
    res.json({ success: true, message: 'Calendar event deleted' });
  });
});

// RATINGS AND REVIEWS ENDPOINTS

// Submit Rating
app.post('/api/ratings', authenticateToken, (req, res) => {
  const { rating, feedback } = req.body;
  const voterRegNo = req.user.reg_no;

  if (!rating || rating < 1 || rating > 5) {
    logSecurityEvent('voter', voterRegNo, 'RATING_SUBMISSION_FAILED', req.ip, req.get('User-Agent'), `Invalid rating: ${rating}`);
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  // Check if already rated
  db.get("SELECT id FROM voter_ratings WHERE voter_reg_no = ?", [voterRegNo], (err, existing) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (existing) {
      logSecurityEvent('voter', voterRegNo, 'RATING_SUBMISSION_FAILED', req.ip, req.get('User-Agent'), 'Duplicate rating submission attempted');
      return res.status(400).json({ error: 'You have already submitted a rating' });
    }

    db.run(
      "INSERT INTO voter_ratings (voter_reg_no, rating, feedback) VALUES (?, ?, ?)",
      [voterRegNo, rating, feedback || ''],
      function (err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        logSecurityEvent('voter', voterRegNo, 'RATING_SUBMITTED', req.ip, req.get('User-Agent'), `Rating: ${rating}, Feedback: ${feedback || 'None'}`);
        res.json({ success: true, message: 'Rating submitted successfully' });
      }
    );
  });
});

// Submit Review
app.post('/api/reviews', authenticateToken, (req, res) => {
  const { election_id, candidate_id, review_text } = req.body;
  const voterRegNo = req.user.reg_no;

  if (!election_id || !candidate_id || !review_text) {
    logSecurityEvent('voter', voterRegNo, 'REVIEW_SUBMISSION_FAILED', req.ip, req.get('User-Agent'), 'Missing required fields for review');
    return res.status(400).json({ error: 'Election ID, candidate ID, and review text are required' });
  }

  db.run(
    "INSERT INTO voter_reviews (voter_reg_no, election_id, candidate_id, review_text) VALUES (?, ?, ?, ?)",
    [voterRegNo, election_id, candidate_id, review_text],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      logSecurityEvent('voter', voterRegNo, 'REVIEW_SUBMITTED', req.ip, req.get('User-Agent'), `Election: ${election_id}, Candidate: ${candidate_id}, Review: ${review_text.substring(0, 100)}...`);
      res.json({ success: true, message: 'Review submitted successfully' });
    }
  );
});

// Get Ratings for Admin
app.get('/api/admin/ratings', authenticateToken, (req, res) => {
  const query = `
    SELECT vr.*, s.name as student_name, s.email 
    FROM voter_ratings vr 
    JOIN voter_registrations vreg ON vr.voter_reg_no = vreg.reg_no
    JOIN students_master s ON vreg.reg_no = s.reg_no
    ORDER BY vr.created_at DESC
  `;

  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows || []);
  });
});

// Get Reviews for Admin
app.get('/api/admin/reviews', authenticateToken, (req, res) => {
  const query = `
    SELECT vr.*, s.name as student_name, e.title as election_title, c.name as candidate_name
    FROM voter_reviews vr
    JOIN voter_registrations vreg ON vr.voter_reg_no = vreg.reg_no
    JOIN students_master s ON vreg.reg_no = s.reg_no
    LEFT JOIN elections e ON vr.election_id = e.id
    LEFT JOIN candidates c ON vr.candidate_id = c.id
    ORDER BY vr.created_at DESC
  `;

  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows || []);
  });
});

// Get Ratings Stats for Admin Dashboard
app.get('/api/admin/ratings-stats', authenticateToken, (req, res) => {
  const query = `
    SELECT 
      COUNT(*) as total_ratings,
      AVG(rating) as average_rating,
      COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_ratings,
      COUNT(CASE WHEN rating <= 2 THEN 1 END) as negative_ratings
    FROM voter_ratings
  `;

  db.get(query, (err, stats) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(stats || { total_ratings: 0, average_rating: 0, positive_ratings: 0, negative_ratings: 0 });
  });
});

// Get Recent Reviews for Admin Dashboard
app.get('/api/admin/recent-reviews', authenticateToken, (req, res) => {
  const query = `
    SELECT * FROM (
      SELECT 
        vr.id,
        vr.voter_reg_no,
        vr.review_text as feedback,
        vr.created_at,
        s.name as student_name,
        c.name as candidate_name,
        'review' as type
      FROM voter_reviews vr
      JOIN voter_registrations vreg ON vr.voter_reg_no = vreg.reg_no
      JOIN students_master s ON vreg.reg_no = s.reg_no
      LEFT JOIN candidates c ON vr.candidate_id = c.id
      
      UNION ALL
      
      SELECT 
        vrt.id,
        vrt.voter_reg_no,
        vrt.feedback,
        vrt.created_at,
        s.name as student_name,
        NULL as candidate_name,
        'rating' as type
      FROM voter_ratings vrt
      JOIN voter_registrations vreg ON vrt.voter_reg_no = vreg.reg_no
      JOIN students_master s ON vreg.reg_no = s.reg_no
    ) 
    ORDER BY created_at DESC
    LIMIT 5
  `;

  db.all(query, (err, rows) => {
    if (err) {
      console.error('Database error in recent-reviews:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json(rows || []);
  });
});

// VOTER LIST PDF ENDPOINT

// Get Voters List for PDF
app.get('/api/admin/voters-list', authenticateToken, (req, res) => {
  const query = `
    SELECT 
      v.voter_reg_no,
      s.name as student_name,
      v.voted_at,
      e.title as election_title
    FROM votes v
    JOIN voter_registrations vr ON v.voter_reg_no = vr.reg_no
    JOIN students_master s ON v.voter_reg_no = s.reg_no
    LEFT JOIN elections e ON v.election_id = e.id
    ORDER BY v.voted_at DESC
  `;

  db.all(query, (err, voters) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(voters || []);
  });
});

// Generate PDF of Voters List
app.get('/api/admin/voters-pdf', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT
        v.voter_reg_no,
        s.name as student_name,
        MAX(v.voted_at) as last_voted_at
      FROM votes v
      JOIN voter_registrations vr ON v.voter_reg_no = vr.reg_no
      JOIN students_master s ON v.voter_reg_no = s.reg_no
      WHERE vr.status = 'Approved'
      GROUP BY v.voter_reg_no, s.name
      ORDER BY v.voted_at DESC
    `;

    db.all(query, async (err, voters) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      // Create PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // A4 size
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Title
      page.drawText('BUSA VOTING PORTAL - VOTERS LIST', {
        x: 50,
        y: 800,
        size: 18,
        font: boldFont,
        color: rgb(0, 0.2, 0.4)
      });

      // Date
      page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
        x: 50,
        y: 770,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5)
      });

      // Table headers
      let yPosition = 730;
      page.drawText('REGISTRATION NUMBER', {
        x: 50,
        y: yPosition,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0)
      });
      page.drawText('STUDENT NAME', {
        x: 200,
        y: yPosition,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0)
      });
      page.drawText('VOTING TIME', {
        x: 400,
        y: yPosition,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0)
      });

      // Line under headers
      page.drawLine({
        start: { x: 50, y: yPosition - 5 },
        end: { x: 550, y: yPosition - 5 },
        thickness: 1,
        color: rgb(0, 0, 0)
      });

      // Voter data
      yPosition -= 25;
      voters.forEach((voter, index) => {
        if (yPosition < 50) {
          // Add new page if needed
          const newPage = pdfDoc.addPage([595, 842]);
          yPosition = 800;
        }

        page.drawText(voter.voter_reg_no || '', {
          x: 50,
          y: yPosition,
          size: 10,
          font: font,
          color: rgb(0, 0, 0)
        });
        
        page.drawText(voter.student_name || '', {
          x: 200,
          y: yPosition,
          size: 10,
          font: font,
          color: rgb(0, 0, 0)
        });
        
        const voteTime = voter.last_voted_at ? 
          new Date(voter.last_voted_at).toLocaleString() : 'N/A';
        page.drawText(voteTime, {
          x: 400,
          y: yPosition,
          size: 10,
          font: font,
          color: rgb(0, 0, 0)
        });

        yPosition -= 20;
      });

      // Footer
      const totalPages = pdfDoc.getPageCount();
      for (let i = 0; i < totalPages; i++) {
        const currentPage = pdfDoc.getPages()[i];
        currentPage.drawText(`Page ${i + 1} of ${totalPages}`, {
          x: 550,
          y: 20,
          size: 8,
          font: font,
          color: rgb(0.5, 0.5, 0.5)
        });
      }

      // Generate PDF bytes
      const pdfBytes = await pdfDoc.save();

      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="voters-list-${new Date().toISOString().split('T')[0]}.pdf"`);
      res.send(Buffer.from(pdfBytes));
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// STUDENT MANAGEMENT ENDPOINTS (Admin Only)

// Get all students
app.get('/api/students', authenticateToken, (req, res) => {
  const query = `
    SELECT reg_no, name, email, type, is_registered_sem, expected_grad_year, campus, department 
    FROM students_master 
    ORDER BY name ASC
  `;
  
  db.all(query, (err, students) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(students);
  });
});

// Add new student
app.post('/api/students', authenticateToken, (req, res) => {
  const { reg_no, name, email, type, is_registered_sem, expected_grad_year, year_of_study, campus, department } = req.body;
  const adminId = req.user.admin_id;
  const gradYear = expected_grad_year || year_of_study;

  if (!reg_no || !name || !email || !type || !gradYear || !campus) {
    return res.status(400).json({ error: 'Required fields: reg_no, name, email, type, expected_grad_year, campus' });
  }

  const query = `
    INSERT INTO students_master (reg_no, name, email, type, is_registered_sem, expected_grad_year, campus, department) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [reg_no, name, email, type, is_registered_sem ? 1 : 0, gradYear, campus, department], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Student with this registration number already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }

    logSecurityEvent('admin', adminId, 'STUDENT_ADDED', req.ip, req.get('User-Agent'), `Reg No: ${reg_no}, Name: ${name}`);
    res.json({
      success: true,
      message: 'Student added successfully',
      student_id: this.lastID
    });
  });
});

// Update student
app.put('/api/students/:reg_no', authenticateToken, (req, res) => {
  const { reg_no } = req.params;
  const { name, email, type, is_registered_sem, expected_grad_year, year_of_study, campus, department } = req.body;
  const adminId = req.user.admin_id;
  const gradYear = expected_grad_year || year_of_study;

  if (!name || !email || !type || !gradYear || !campus) {
    return res.status(400).json({ error: 'Required fields: name, email, type, expected_grad_year, campus' });
  }

  const query = `
    UPDATE students_master 
    SET name = ?, email = ?, type = ?, is_registered_sem = ?, expected_grad_year = ?, campus = ?, department = ?
    WHERE reg_no = ?
  `;

  db.run(query, [name, email, type, is_registered_sem ? 1 : 0, gradYear, campus, department, reg_no], function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    logSecurityEvent('admin', adminId, 'STUDENT_UPDATED', req.ip, req.get('User-Agent'), `Reg No: ${reg_no}, Name: ${name}`);
    res.json({
      success: true,
      message: 'Student updated successfully'
    });
  });
});

// Bulk import student master list. This is the official admin-managed list used by voter validation.
app.post('/api/students/bulk', authenticateToken, (req, res) => {
  const { students } = req.body;
  const adminId = req.user.admin_id;

  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ error: 'Provide a non-empty students array' });
  }

  const normalized = students.map((student) => ({
    reg_no: String(student.reg_no || '').trim(),
    name: String(student.name || '').trim(),
    email: String(student.email || '').trim(),
    type: String(student.type || 'Regular').trim(),
    is_registered_sem: student.is_registered_sem === true || student.is_registered_sem === 1 || String(student.is_registered_sem).toLowerCase() === 'true' || String(student.is_registered_sem).toLowerCase() === 'yes',
    expected_grad_year: student.expected_grad_year || student.year_of_study,
    campus: String(student.campus || 'main').trim(),
    department: String(student.department || '').trim()
  }));

  const invalidRows = normalized
    .map((student, index) => ({ ...student, row: index + 1 }))
    .filter((student) => !student.reg_no || !student.name || !student.email || !student.type || !student.expected_grad_year || !student.campus);

  if (invalidRows.length > 0) {
    return res.status(400).json({
      error: `Import failed. ${invalidRows.length} row(s) are missing required fields.`,
      invalid_rows: invalidRows.slice(0, 10)
    });
  }

  const query = `
    INSERT INTO students_master (reg_no, name, email, type, is_registered_sem, expected_grad_year, campus, department)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(reg_no) DO UPDATE SET
      name = excluded.name,
      email = excluded.email,
      type = excluded.type,
      is_registered_sem = excluded.is_registered_sem,
      expected_grad_year = excluded.expected_grad_year,
      campus = excluded.campus,
      department = excluded.department
  `;

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    const stmt = db.prepare(query);
    let failed = null;

    normalized.forEach((student, index) => {
      if (failed) return;
      stmt.run([
        student.reg_no,
        student.name,
        student.email,
        student.type,
        student.is_registered_sem ? 1 : 0,
        student.expected_grad_year,
        student.campus,
        student.department
      ], (err) => {
        if (err && !failed) failed = { row: index + 1, message: err.message };
      });
    });

    stmt.finalize((err) => {
      if (err && !failed) failed = { message: err.message };

      if (failed) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Bulk import failed', details: failed });
      }

      db.run('COMMIT', (commitErr) => {
        if (commitErr) return res.status(500).json({ error: 'Bulk import failed' });

        logSecurityEvent('admin', adminId, 'STUDENTS_BULK_IMPORTED', req.ip, req.get('User-Agent'), `Rows imported: ${normalized.length}`);
        res.json({
          success: true,
          message: `${normalized.length} student record(s) imported successfully`,
          imported: normalized.length
        });
      });
    });
  });
});

// Delete student
app.delete('/api/students/:reg_no', authenticateToken, (req, res) => {
  const { reg_no } = req.params;
  const adminId = req.user.admin_id;

  // Check if student has any voter registrations first
  db.get("SELECT COUNT(*) as count FROM voter_registrations WHERE reg_no = ?", [reg_no], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (result.count > 0) {
      return res.status(400).json({ error: 'Cannot delete student: has existing voter registrations' });
    }

    // Delete the student
    db.run("DELETE FROM students_master WHERE reg_no = ?", [reg_no], function (err) {
      if (err) return res.status(500).json({ error: 'Database error' });

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      logSecurityEvent('admin', adminId, 'STUDENT_DELETED', req.ip, req.get('User-Agent'), `Reg No: ${reg_no}`);
      res.json({
        success: true,
        message: 'Student deleted successfully'
      });
    });
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`BUSA Voting System Backend running on port ${PORT}`);
});
