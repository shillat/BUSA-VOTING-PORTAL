const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database path
let dbPath = path.resolve(__dirname, 'database.sqlite');

// Ensure directory exists for Render
if (process.env.RENDER_DISK_PATH) {
  dbPath = path.join(process.env.RENDER_DISK_PATH, 'database.sqlite');
}

const db = new sqlite3.Database(dbPath);

// Copy images from frontend assets to uploads folder
const assetsDir = path.join(__dirname, '..', 'frontend', 'src', 'assets');
const uploadsDir = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Candidate data with corresponding images
const candidates = [
  // Presidential Candidates
  {
    name: "ABRAHAM OKOCH",
    position: "President",
    manifesto: "Committed to transforming student governance through innovation, transparency, and inclusive leadership. I will champion digital transformation, academic excellence, and student welfare.",
    faculty: "General",
    slogan: "Leadership That Delivers",
    image_file: "ABRAHAM OKOCH.png"
  },
  {
    name: "FUBI JOVIA",
    position: "President", 
    manifesto: "Dedicated to empowering every student voice and creating opportunities for growth. My focus is on quality education, student support services, and building stronger campus communities.",
    faculty: "General",
    slogan: "Together We Rise",
    image_file: "FUBI JOVIA.png"
  },
  
  // MPs for Faculty of Science and Technology
  {
    name: "LUZZE LINUS",
    position: "MP - Faculty of Science and Technology",
    manifesto: "Advocating for cutting-edge research facilities, modern laboratories, and industry partnerships. I will ensure Science and Technology students have the resources to excel.",
    faculty: "Science and Technology",
    slogan: "Innovation Through Science",
    image_file: "LUZZE LINUS.jpg"
  },
  {
    name: "NAKAMYA BELINDA",
    position: "MP - Faculty of Science and Technology",
    manifesto: "Passionate about bridging the gap between academia and industry. I will work towards practical skills development, internship opportunities, and technology transfer programs.",
    faculty: "Science and Technology", 
    slogan: "Science For Progress",
    image_file: "NAKAMYA BELINDA.png"
  },
  
  // MPs for Eastern Region
  {
    name: "OKELLO PETER",
    position: "MP - Eastern Region",
    manifesto: "Representing Eastern Region students with dedication and integrity. I will focus on regional development initiatives, scholarship programs, and cultural exchange opportunities.",
    faculty: "Regional Representation",
    slogan: "Eastern Unity, Eastern Pride",
    image_file: "OKELLO PETER.png"
  },
  {
    name: "SHILLAH NAIGAGA",
    position: "MP - Eastern Region",
    manifesto: "Championing the interests of Eastern Region students through advocacy, mentorship, and community building. Together we can create a brighter future for our region.",
    faculty: "Regional Representation",
    slogan: "Service With Excellence",
    image_file: "SHILLAH NAIGAGA.jpg"
  }
];

async function addCandidates() {
  console.log('Adding placeholder candidates...');
  
  try {
    // First, check if there's an active election or create one
    const election = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM elections WHERE status = 'active' ORDER BY id DESC LIMIT 1", (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    let electionId;
    if (election) {
      electionId = election.id;
      console.log(`Using existing active election: ${election.title} (ID: ${electionId})`);
    } else {
      // Create a new election if none exists
      electionId = await new Promise((resolve, reject) => {
        const now = new Date();
        const startDate = now.toISOString();
        const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now
        
        db.run(
          "INSERT INTO elections (title, description, start_date, end_date, status, created_by) VALUES (?, ?, ?, ?, ?, ?)",
          [
            "BUSA Student Leadership Elections 2026",
            "Annual elections for student leadership positions including President, Faculty Representatives, and Regional MPs.",
            startDate,
            endDate,
            "active",
            1 // Admin user ID
          ],
          function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      });
      console.log(`Created new election with ID: ${electionId}`);
    }

    // Copy images and add candidates
    for (const candidate of candidates) {
      // Copy image from assets to uploads
      const sourcePath = path.join(assetsDir, candidate.image_file);
      const targetPath = path.join(uploadsDir, candidate.image_file);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Copied image: ${candidate.image_file}`);
      } else {
        console.log(`Warning: Image file not found: ${candidate.image_file}`);
      }

      // Add candidate to database
      await new Promise((resolve, reject) => {
        const photoUrl = `/uploads/${candidate.image_file}`;
        
        db.run(
          "INSERT INTO candidates (election_id, name, position, manifesto, faculty, slogan, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [electionId, candidate.name, candidate.position, candidate.manifesto, candidate.faculty, candidate.slogan, photoUrl],
          function(err) {
            if (err) {
              console.error(`Error adding candidate ${candidate.name}:`, err.message);
              reject(err);
            } else {
              console.log(`✅ Added candidate: ${candidate.name} - ${candidate.position}`);
              resolve();
            }
          }
        );
      });
    }

    console.log('\n🎉 All placeholder candidates have been added successfully!');
    console.log('\nCandidates added:');
    console.log('• 2 Presidential Candidates');
    console.log('• 2 MPs - Faculty of Science and Technology');
    console.log('• 2 MPs - Eastern Region');
    
  } catch (error) {
    console.error('Error adding candidates:', error);
  } finally {
    db.close();
  }
}

// Run the script
addCandidates();
