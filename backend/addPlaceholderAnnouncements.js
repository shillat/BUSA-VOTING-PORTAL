const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
let dbPath = path.resolve(__dirname, 'database.sqlite');

// Ensure directory exists for Render
if (process.env.RENDER_DISK_PATH) {
  dbPath = path.join(process.env.RENDER_DISK_PATH, 'database.sqlite');
}

const db = new sqlite3.Database(dbPath);

// Placeholder announcements
const announcements = [
  {
    title: "🗳️ 2026 BUSA Elections Officially Launched",
    content: "The 2026 BUSA Student Leadership Elections have officially begun! Voting is now open for all eligible students. Cast your vote for President, Faculty Representatives, and Regional MPs. Make your voice heard and shape the future of our student community. Voting closes on December 31, 2026 at 11:59 PM.",
    type: "Election Notice",
    target_audience: "all"
  },
  {
    title: "📋 Voter Registration Deadline Extended",
    content: "Good news! The voter registration deadline has been extended by one week due to popular demand. Students who haven't registered yet have until November 30, 2026 to complete their registration. Don't miss this opportunity to participate in the democratic process. Visit the registration portal now!",
    type: "Important Notice",
    target_audience: "all"
  },
  {
    title: "🎯 Meet the Candidates: Presidential Debate Tonight",
    content: "Join us tonight at 7:00 PM in the Main Auditorium for the Presidential Candidates Debate. Abraham Okoch and Fubi Jovia will present their visions and answer questions from the student body. This is your chance to make an informed decision. Refreshments will be served. All students are welcome!",
    type: "Event",
    target_audience: "all"
  },
  {
    title: "🏆 New Student Support Programs Announced",
    content: "The current BUSA administration is pleased to announce new support programs including: 1) Emergency Student Fund for those facing financial difficulties, 2) Academic Excellence Scholarships for top-performing students, 3) Mental Health and Counseling Services expansion, and 4) Career Development Workshops. Applications open next week. Stay tuned for more details!",
    type: "General Information",
    target_audience: "all"
  }
];

async function addAnnouncements() {
  console.log('Adding placeholder announcements...');
  
  try {
    for (const announcement of announcements) {
      await new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO announcements (title, content, type, target_audience, created_by) VALUES (?, ?, ?, ?, ?)",
          [announcement.title, announcement.content, announcement.type, announcement.target_audience, 'admin'],
          function(err) {
            if (err) {
              console.error(`Error adding announcement "${announcement.title}":`, err.message);
              reject(err);
            } else {
              console.log(`✅ Added announcement: ${announcement.title}`);
              resolve();
            }
          }
        );
      });
    }

    console.log('\n🎉 All placeholder announcements have been added successfully!');
    console.log('\nAnnouncements added:');
    console.log('• Election Notice - 2026 BUSA Elections Launch');
    console.log('• Important Notice - Voter Registration Extension');
    console.log('• Event - Presidential Debate Tonight');
    console.log('• General Information - New Student Support Programs');
    
  } catch (error) {
    console.error('Error adding announcements:', error);
  } finally {
    db.close();
  }
}

// Run the script
addAnnouncements();
