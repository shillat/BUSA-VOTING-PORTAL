const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
let dbPath = path.resolve(__dirname, 'database.sqlite');

// Ensure directory exists for Render
if (process.env.RENDER_DISK_PATH) {
  dbPath = path.join(process.env.RENDER_DISK_PATH, 'database.sqlite');
}

const db = new sqlite3.Database(dbPath);

// Placeholder guidelines
const guidelines = [
  {
    title: "Voting Eligibility Requirements",
    content: "To be eligible to vote in BUSA elections, students must:\n\n1. Be currently enrolled at BUSA\n2. Have paid all university fees for the current semester\n3. Be registered for the current academic session\n4. Have a valid student registration number\n5. Not have any disciplinary cases pending\n\nRegular students are automatically eligible upon semester registration. In-Service students must provide evidence of current session payment or attend on-campus verification.\n\nVoting is conducted online through the official BUSA Voting Portal using your Registration Number and Voter ID.",
    category: "Voting Process",
    is_published: 1
  },
  {
    title: "Code of Conduct for Candidates",
    content: "All candidates participating in BUSA elections must adhere to the following code of conduct:\n\nCampaign Guidelines:\n• Campaign materials must be approved by the Electoral Commission\n• No defamatory statements against opponents\n• Respect university property and regulations\n• No bribery or offering inducements to voters\n• Maintain professional decorum at all times\n\nDuring Debates:\n• Arrive on time and dress appropriately\n• Address issues, not personalities\n• Respect speaking time limits\n• Allow others to speak without interruption\n\nViolations may result in disqualification. Report violations to the Electoral Commission within 24 hours.",
    category: "Candidate Guidelines",
    is_published: 1
  },
  {
    title: "Election Security and Fair Play",
    content: "BUSA is committed to ensuring free, fair, and secure elections. Security measures include:\n\nTechnical Security:\n• Encrypted voting platform\n• Secure voter authentication\n• Real-time monitoring of voting patterns\n• Protection against multiple voting\n• Audit trail for all votes\n\nFair Play Principles:\n• Equal opportunity for all candidates\n• Transparent vote counting process\n• Independent monitoring by Electoral Commission\n• Immediate investigation of any irregularities\n• Right to appeal within 48 hours\n\nStudents should report any suspicious activities to security@busa.edu or call the Election Hotline: 0800-BUSA-VOTE",
    category: "Security",
    is_published: 1
  },
  {
    title: "Student Rights and Responsibilities",
    content: "As participants in BUSA elections, students have both rights and responsibilities:\n\nYour Rights:\n• Right to vote freely without coercion\n• Right to access all candidate information\n• Right to ask candidates questions\n• Right to observe counting process\n• Right to report irregularities\n• Right to appeal election outcomes\n\nYour Responsibilities:\n• Vote only once per position\n• Verify your voter registration status\n• Protect your voting credentials\n• Respect others' voting choices\n• Report any election malpractice\n• Participate peacefully in the electoral process\n\nRemember: Your vote is your voice. Use it wisely and responsibly for the future of BUSA.",
    category: "Student Information",
    is_published: 1
  }
];

async function addGuidelines() {
  console.log('Adding placeholder guidelines...');
  
  try {
    for (const guideline of guidelines) {
      await new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO guidelines (title, content, category, is_published, created_by) VALUES (?, ?, ?, ?, ?)",
          [guideline.title, guideline.content, guideline.category, guideline.is_published, 'admin'],
          function(err) {
            if (err) {
              console.error(`Error adding guideline "${guideline.title}":`, err.message);
              reject(err);
            } else {
              console.log(`✅ Added guideline: ${guideline.title}`);
              resolve();
            }
          }
        );
      });
    }

    console.log('\n🎉 All placeholder guidelines have been added successfully!');
    console.log('\nGuidelines added:');
    console.log('• Voting Process - Voting Eligibility Requirements');
    console.log('• Candidate Guidelines - Code of Conduct for Candidates');
    console.log('• Security - Election Security and Fair Play');
    console.log('• Student Information - Student Rights and Responsibilities');
    
  } catch (error) {
    console.error('Error adding guidelines:', error);
  } finally {
    db.close();
  }
}

// Run the script
addGuidelines();
