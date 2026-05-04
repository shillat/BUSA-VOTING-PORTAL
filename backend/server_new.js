const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// CORS - allow frontend on any port (dev & prod)
app.use(cors({
  origin: 'https://busa-voting-portal.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// JWT Secret
const JWT_SECRET = 'busa_voting_system_2026_secret_key';

// File upload setup
const uploadFolder = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
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
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

// Database setup with better-sqlite3
const dbPath = path.resolve(__dirname, 'database.sqlite');
let db;

try {
  db = new Database(dbPath);
  console.log('Connected to SQLite database.');

  // Schema update: ensure candidates table has faculty and slogan columns
  try {
    db.exec("ALTER TABLE candidates ADD COLUMN faculty TEXT");
  } catch (err) {
    // Ignore error if column already exists
  }
  try {
    db.exec("ALTER TABLE candidates ADD COLUMN slogan TEXT");
  } catch (err) {
    // Ignore error if column already exists
  }

  // Create additional tables if they don't exist
  db.exec(`CREATE TABLE IF NOT EXISTS guidelines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      category TEXT,
      is_published BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT
    )`);

  db.exec(`CREATE TABLE IF NOT EXISTS election_calendar (
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
} catch (err) {
  console.error('Database connection error:', err);
}

app.use('/uploads', express.static(uploadFolder));

// Helper to simulate sending email
const sendEmail = (email, subject, message) => {
  console.log(`\n--- MOCK EMAIL SENDER ---`);
  console.log(`To: ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  console.log(`-------------------------\n`);
};

// Security logging helper (synchronous with better-sqlite3)
const logSecurityEvent = (userType, userId, action, ipAddress, userAgent, details) => {
  if (!db) return;

  const logEntry = {
    user_type: userType,
    user_id: userId,
    action: action,
    ip_address: ipAddress,
    user_agent: userAgent,
    details: details
  };

  try {
    db.run(
      `INSERT INTO security_logs (user_type, user_id, action, ip_address, user_agent, details) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [logEntry.user_type, logEntry.user_id, logEntry.action, logEntry.ip_address, logEntry.user_agent, logEntry.details]
    );
  } catch (err) {
    console.error('Security log error:', err);
  }
};

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Voter Registration
app.post('/api/register', (req, res, next) => {
  // Catch Multer file size errors specifically if needed
  upload.single('evidence_file')(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds 2MB limit.' });
    } else if (err) {
      return res.status(500).json({ error: 'File upload error.' });
    }
    next();
  });
}, async (req, res) => {
  const { reg_no, on_campus } = req.body;
  const evidenceFile = req.file;

  if (!reg_no) {
    return res.status(400).json({ error: 'Registration number is required.' });
  }

  try {
    // 1. Check if already registered
    const existingReg = db.prepare("SELECT * FROM voter_registrations WHERE reg_no = ?").get([reg_no]);

    if (existingReg) {
      return res.status(400).json({ error: 'This registration number has already been registered.' });
    }

    // 2. Check student_master
    const student = db.prepare("SELECT * FROM students_master WHERE reg_no = ?").get([reg_no]);

    if (!student) {
      return res.status(404).json({ error: 'Registration number not found in student records.' });
    }

    // 3. Check if regular student and expected graduation year matches current session (auto-approve)
    const isRegular = student.type && student.type.toLowerCase().includes('regular');
    const expectedGradYear = parseInt(student.expected_grad_year || '0');
    const currentYear = new Date().getFullYear();
    const isCurrentSession = expectedGradYear === currentYear || expectedGradYear === currentYear + 1;

    if (isRegular && isCurrentSession) {
      // Auto-approve regular students for current session
      const voterId = 'VID-' + Math.floor(100000 + Math.random() * 900000);
      const voterIdHash = await bcrypt.hash(voterId, 10);

      const insertSql = "INSERT INTO voter_registrations (reg_no, voter_id, password_hash, status) VALUES (?, ?, ?, 'Approved')";
      const result = db.prepare(insertSql).run([reg_no, voterId, voterIdHash]);

      if (!result.lastID) {
        return res.status(500).json({ error: 'Database error saving registration.' });
      }

      sendEmail(student.email, "Voter Registration Approved", `Congratulations! You have been successfully registered as a voter. Your unique Voter ID is: ${voterId}`);
      return res.json({ success: true, message: "Registration successful. You are approved and your Voter ID has been sent to your email.", voter_id: voterId });
    }

    // 4. Handle in-service or off-campus students
    if (!isRegular || !isCurrentSession) {
      if (on_campus === 'true') {
        // In-service on-campus: auto-approve without evidence
        const voterId = 'VID-' + Math.floor(100000 + Math.random() * 900000);
        const voterIdHash = await bcrypt.hash(voterId, 10);

        const insertSql = "INSERT INTO voter_registrations (reg_no, voter_id, password_hash, status) VALUES (?, ?, ?, 'Approved')";
        const result = db.prepare(insertSql).run([reg_no, voterId, voterIdHash]);

        if (!result.lastID) {
          return res.status(500).json({ error: 'Database error saving registration.' });
        }

        sendEmail(student.email, "Voter Registration Approved", `Congratulations! Your registration has been approved by the Admin. Your unique Voter ID is: ${voterId}`);
        return res.json({ success: true, message: "Registration successful. You are approved and your Voter ID has been sent to your email.", voter_id: voterId });
      } else {
        // In-service off-campus: require evidence file
        if (!evidenceFile) {
          return res.status(400).json({ error: 'Bank slip evidence is required for off-campus in-service students.' });
        }

        const evidence_url = `/uploads/${evidenceFile.filename}`;
        const insertSql = "INSERT INTO voter_registrations (reg_no, password_hash, evidence_url, status) VALUES (?, ?, ?, 'Pending')";
        const result = db.prepare(insertSql).run([reg_no, "", evidence_url]);

        if (!result.lastID) {
          return res.status(500).json({ error: 'Database error saving registration.' });
        }

        sendEmail(student.email, "Voter Registration Pending", "Your registration is pending admin approval based on your submitted Bank Slip.");
        return res.json({ success: true, message: "Registration submitted and pending admin approval. Please check your email for updates." });
      }
    }

    // Regardless of expected_grad_year, providing the file puts them in Pending for admin approval.
    if (evidenceFile) {
      const evidence_url = `/uploads/${evidenceFile.filename}`;
      const insertSql = "INSERT INTO voter_registrations (reg_no, password_hash, evidence_url, status) VALUES (?, ?, ?, 'Pending')";
      const result = db.prepare(insertSql).run([reg_no, "", evidence_url]);

      if (!result.lastID) {
        return res.status(500).json({ error: 'Database error saving registration.' });
      }

      sendEmail(student.email, "Voter Registration Pending", "Your registration is pending admin approval based on your submitted Bank Slip.");
      return res.json({ success: true, message: "Registration submitted and pending admin approval. Please check your email for updates." });
    }

    return res.status(400).json({ error: 'Unable to process registration. Please contact admin.' });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Voter Login
app.post('/api/voter/login', async (req, res) => {
  const { reg_no, password } = req.body;

  if (!reg_no || !password) {
    return res.status(400).json({ error: 'Registration number and password are required' });
  }

  try {
    const query = `
      SELECT vr.*, s.name, s.email, s.department, s.type, s.campus 
      FROM voter_registrations vr 
      JOIN students_master s ON vr.reg_no = s.reg_no 
      WHERE vr.reg_no = ? AND vr.status = 'Approved'
    `;

    const voter = db.prepare(query).get([reg_no]);

    if (!voter) {
      return res.status(401).json({ error: 'Invalid credentials or registration not approved' });
    }

    // Check if password matches (either voter_id or password_hash)
    let passwordMatch = false;

    // First try voter_id (for auto-approved accounts)
    if (voter.voter_id === password) {
      passwordMatch = true;
    } else if (voter.password_hash) {
      // Try password_hash (for accounts with set passwords)
      passwordMatch = await bcrypt.compare(password, voter.password_hash);
    }

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        reg_no: voter.reg_no,
        type: 'voter',
        name: voter.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    logSecurityEvent('voter', voter.reg_no, 'LOGIN', req.ip, req.get('User-Agent'), 'Voter login successful');

    res.json({
      success: true,
      token,
      voter: {
        reg_no: voter.reg_no,
        name: voter.name,
        email: voter.email,
        department: voter.department,
        type: voter.type,
        campus: voter.campus
      }
    });

  } catch (error) {
    console.error('Voter login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Get pending registrations
app.get('/api/admin/verify', (req, res) => {
  const query = `
    SELECT v.id, v.reg_no, v.status, v.created_at, v.evidence_url, 
           s.name, s.email, s.department, s.type, s.expected_grad_year
    FROM voter_registrations v
    JOIN students_master s ON v.reg_no = s.reg_no
    WHERE v.status = 'Pending'
    ORDER BY v.created_at DESC
  `;

  try {
    const rows = db.prepare(query).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Admin: Approve registration
app.post('/api/admin/approve/:id', async (req, res) => {
  const { id } = req.params;

  const row = db.prepare("SELECT s.email FROM voter_registrations v JOIN students_master s ON v.reg_no = s.reg_no WHERE v.id = ?").get([id]);

  if (!row) {
    return res.status(404).json({ error: 'Record not found' });
  }

  const voterId = 'VID-' + Math.floor(100000 + Math.random() * 900000);
  const voterIdHash = await bcrypt.hash(voterId, 10);

  const result = db.prepare("UPDATE voter_registrations SET status = 'Approved', voter_id = ?, password_hash = ? WHERE id = ?").run([voterId, voterIdHash, id]);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Registration not found' });
  }

  sendEmail(row.email, "Voter Registration Approved", `Congratulations! Your registration has been approved by the Admin. Your unique Voter ID is: ${voterId}`);
  res.json({ success: true, message: "Registration approved, Voter ID generated and email sent" });
});

// Admin: Reject registration
app.post('/api/admin/reject/:id', (req, res) => {
  const { id } = req.params;
  const { reason = "Your bank slip was rejected." } = req.body;

  const row = db.prepare("SELECT s.email FROM voter_registrations v JOIN students_master s ON v.reg_no = s.reg_no WHERE v.id = ?").get([id]);

  if (!row) {
    return res.status(404).json({ error: 'Record not found' });
  }

  const result = db.prepare("UPDATE voter_registrations SET status = 'Rejected', rejection_reason = ? WHERE id = ?").run([reason, id]);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Registration not found' });
  }

  sendEmail(row.email, "Voter Registration Rejected", `Your registration was rejected. Reason: ${reason}`);
  res.json({ success: true, message: "Registration rejected and email sent" });
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { admin_id, password } = req.body;

  if (!admin_id || !password) {
    return res.status(400).json({ error: 'Admin ID and password are required' });
  }

  try {
    const admin = db.prepare("SELECT * FROM admin_users WHERE admin_id = ?").get([admin_id]);

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        admin_id: admin.admin_id,
        role: admin.role,
        name: admin.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    logSecurityEvent('admin', admin.admin_id, 'LOGIN', req.ip, req.get('User-Agent'), 'Admin login successful');

    res.json({
      success: true,
      token,
      admin: {
        admin_id: admin.admin_id,
        name: admin.name,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all elections
app.get('/api/elections', (req, res) => {
  try {
    const elections = db.prepare(`
      SELECT e.*, 
             (SELECT COUNT(*) FROM candidates WHERE election_id = e.id) as candidate_count,
             (SELECT COUNT(*) FROM votes WHERE election_id = e.id) as vote_count
      FROM elections e
      ORDER BY e.created_at DESC
    `).all();

    res.json(elections);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get active elections
app.get('/api/elections/active', (req, res) => {
  try {
    const elections = db.prepare(`
      SELECT e.*, 
             (SELECT COUNT(*) FROM candidates WHERE election_id = e.id) as candidate_count,
             (SELECT COUNT(*) FROM votes WHERE election_id = e.id) as vote_count
      FROM elections e
      WHERE e.status = 'Active'
      ORDER BY e.start_date ASC
    `).all();

    res.json(elections);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Update election status
app.put('/api/elections/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Upcoming', 'Active', 'Completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const result = db.prepare("UPDATE elections SET status = ? WHERE id = ?").run([status, id]);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Election not found' });
  }

  logSecurityEvent('admin', req.user.admin_id, 'ELECTION_STATUS_UPDATE', req.ip, req.get('User-Agent'), `Election ID: ${id}, Status: ${status}`);

  res.json({ success: true, message: 'Election status updated successfully' });
});

// Create election
app.post('/api/elections', authenticateToken, (req, res) => {
  const { title, description, start_date, end_date } = req.body;
  const adminId = req.user.admin_id;

  if (!title || !description || !start_date || !end_date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `
    INSERT INTO elections (title, description, start_date, end_date, status, created_by)
    VALUES (?, ?, ?, ?, 'Upcoming', (SELECT id FROM admin_users WHERE admin_id = ?))
  `;

  try {
    const result = db.prepare(query).run([title, description, start_date, end_date, adminId]);

    logSecurityEvent('admin', adminId, 'ELECTION_CREATED', req.ip, req.get('User-Agent'), `Election ID: ${result.lastID}`);

    res.json({
      success: true,
      message: 'Election created successfully',
      election_id: result.lastID
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BUSA Voting System Backend running on port ${PORT}`);
  console.log('API Endpoints available:');
  console.log('- Authentication: /api/admin/login, /api/voter/login');
  console.log('- Elections: /api/elections');
  console.log('- Candidates: /api/elections/:id/candidates');
  console.log('- Voting: /api/vote');
  console.log('- Results: /api/elections/:id/results');
  console.log('- Admin: /api/admin/*');
});
