const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
let dbPath = path.resolve(__dirname, 'database.sqlite');

// Ensure directory exists for Render
if (process.env.RENDER_DISK_PATH) {
  dbPath = path.join(process.env.RENDER_DISK_PATH, 'database.sqlite');
}

const db = new sqlite3.Database(dbPath);

async function createActiveElection() {
  console.log('Creating comprehensive active election...');
  
  try {
    // First, set any existing elections to 'completed' status
    await new Promise((resolve, reject) => {
      db.run("UPDATE elections SET status = 'completed' WHERE status = 'active'", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('Set previous elections to completed status');

    // Create new active election
    const now = new Date();
    const startDate = now.toISOString();
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now
    
    const electionData = {
      title: "BUSA Student Leadership Elections 2026",
      description: `Welcome to the 2026 BUSA Student Leadership Elections! This is your opportunity to choose the leaders who will represent your interests and shape the future of our student community.

ELECTION DETAILS:
• Voting Period: ${now.toLocaleDateString()} - ${new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
• Positions Available: President, Faculty Representatives, Regional MPs
• Voting Method: Online through BUSA Voting Portal
• Eligibility: All registered and fee-paying students

POSITIONS CONTESTED:
1. PRESIDENT (2 Candidates)
   - Overall leadership of BUSA
   - Representation at university level
   - Student welfare oversight

2. FACULTY REPRESENTATIVES (Various Positions)
   - Faculty of Science and Technology (2 Candidates)
   - Other faculties as applicable

3. REGIONAL MPS (Various Positions)
   - Eastern Region (2 Candidates)
   - Other regions as applicable

VOTING INSTRUCTIONS:
1. Ensure you are registered to vote
2. Login with your Registration Number and Voter ID
3. Review candidate profiles and manifestos
4. Cast your vote for each position
5. Receive confirmation of your vote

Your vote is your voice - participate actively and choose wisely!`,
      start_date: startDate,
      end_date: endDate,
      status: 'active'
    };

    const electionId = await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO elections (title, description, start_date, end_date, status, created_by) VALUES (?, ?, ?, ?, ?, ?)",
        [electionData.title, electionData.description, electionData.start_date, electionData.end_date, electionData.status, 1],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    console.log(`✅ Created new active election: ${electionData.title} (ID: ${electionId})`);
    console.log(`📅 Voting Period: ${now.toLocaleDateString()} - ${new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
    
    // Update existing candidates to be part of this new election if they exist
    await new Promise((resolve, reject) => {
      db.run("UPDATE candidates SET election_id = ? WHERE election_id != ?", [electionId, electionId], function(err) {
        if (err) reject(err);
        else {
          console.log(`🔄 Updated ${this.changes} existing candidates to new election`);
          resolve();
        }
      });
    });

    console.log('\n🎉 Active election created successfully!');
    console.log('\nElection Features:');
    console.log('• Comprehensive description with voting instructions');
    console.log('• 30-day voting period');
    console.log('• All positions clearly defined');
    console.log('• Step-by-step voting guide');
    console.log('• Professional presentation for visitors');
    
  } catch (error) {
    console.error('Error creating active election:', error);
  } finally {
    db.close();
  }
}

// Run the script
createActiveElection();
