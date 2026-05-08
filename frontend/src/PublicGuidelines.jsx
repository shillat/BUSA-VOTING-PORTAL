import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { utils } from './api';

const PublicGuidelines = () => {
  const [loading, setLoading] = useState(false);

  // Placeholder guidelines data
  const guidelines = [
    {
      id: 1,
      title: "Voting Eligibility Requirements",
      content: "To be eligible to vote in BUSA elections, students must:\n\n1. Be currently enrolled at the university\n2. Be registered for the current academic session\n3. Have a valid student registration number\n\nVoting is conducted online through the official BUSA Voting Portal using your Registration Number and Voter ID. All registered students will receive their voting credentials via email before the election period begins.",
      category: "Voting Process",
      is_published: 1,
      created_at: "2026-05-01T09:00:00Z"
    },
    {
      id: 2,
      title: "Code of Conduct for Candidates",
      content: "All candidates participating in BUSA elections must adhere to the following code of conduct:\n\nCampaign Guidelines:\n• Campaign materials must be approved by the Electoral Commission\n• No defamatory statements against opponents\n• Respect university property and regulations\n• No bribery or offering inducements to voters\n• Maintain professional decorum at all times\n\nDuring Debates:\n• Arrive on time and dress appropriately\n• Address issues, not personalities\n• Respect speaking time limits\n• Allow others to speak without interruption\n\nViolations may result in disqualification. Report violations to the Electoral Commission within 24 hours.",
      category: "Candidate Guidelines",
      is_published: 1,
      created_at: "2026-05-02T14:30:00Z"
    },
    {
      id: 3,
      title: "Election Security and Fair Play",
      content: "BUSA is committed to ensuring free, fair, and secure elections. Security measures include:\n\nTechnical Security:\n• Encrypted voting platform\n• Secure voter authentication\n• Real-time monitoring of voting patterns\n• Protection against multiple voting\n• Audit trail for all votes\n\nFair Play Principles:\n• Equal opportunity for all candidates\n• Transparent vote counting process\n• Independent monitoring by Electoral Commission\n• Immediate investigation of any irregularities\n• Right to appeal within 48 hours\n\nStudents should report any suspicious activities to security@busa.edu or call the Election Hotline: 0800-BUSA-VOTE",
      category: "Security",
      is_published: 1,
      created_at: "2026-05-03T11:15:00Z"
    },
    {
      id: 4,
      title: "Student Rights and Responsibilities",
      content: "As participants in BUSA elections, students have both rights and responsibilities:\n\nYour Rights:\n• Right to vote freely without coercion\n• Right to access all candidate information\n• Right to ask candidates questions\n• Right to observe counting process\n• Right to report irregularities\n• Right to appeal election outcomes\n\nYour Responsibilities:\n• Vote only once per position\n• Verify your voter registration status\n• Protect your voting credentials\n• Respect others' voting choices\n• Report any election malpractice\n• Participate peacefully in the electoral process\n\nRemember: Your vote is your voice. Use it wisely and responsibly for the future of BUSA.",
      category: "Student Information",
      is_published: 1,
      created_at: "2026-05-04T16:45:00Z"
    }
  ];

  const groupedByCategory = guidelines.reduce((grouped, guideline) => {
    const category = guideline.category || 'General';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(guideline);
    return grouped;
  }, {});

  return (
    <div className="container" style={{ minHeight: '100vh' }}>
      <Navbar />

      <div style={{ padding: '40px 0', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'black', marginBottom: '16px' }}>Election Guidelines & Regulations</h1>
          <p style={{ color: 'black', fontSize: '18px' }}>Official guidance for voters, candidates, and the electoral process at Bugema University.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '20px', color: 'black' }}>Loading published guidelines...</p>
          </div>
        ) : guidelines.length === 0 ? (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '48px', textAlign: 'center', border: '1px solid #E9EDF2' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: 'black' }}>No published guidelines available</h2>
            <p style={{ color: 'black', fontSize: '16px', marginTop: '12px' }}>Please check back later for the latest election rules and instructions.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {Object.entries(groupedByCategory).map(([category, items]) => (
              <div key={category} className="card" style={{ padding: '32px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'black', margin: 0 }}>{category}</h2>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#002F6C' }}>{items.length} item{items.length > 1 ? 's' : ''}</span>
                </div>
                <div style={{ display: 'grid', gap: '18px' }}>
                  {items.map((item) => (
                    <div key={item.id} style={{ padding: '20px', borderRadius: '20px', background: '#F7FAFF', border: '1px solid #E9EDF2' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                        <div>
                          <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'black', margin: '0 0 8px 0' }}>{item.title}</h3>
                          <p style={{ fontSize: '14px', color: '#5C7085', margin: 0 }}>Published on {new Date(item.created_at).toLocaleDateString()}</p>
                        </div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 14px', borderRadius: '999px', background: '#E9F7EF', color: '#166534', fontSize: '12px', fontWeight: '700' }}>
                          Published
                        </span>
                      </div>
                      <p style={{ marginTop: '18px', color: 'black', lineHeight: '1.8', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '44px', background: '#F8FAFE', borderRadius: '24px', padding: '34px', textAlign: 'center', border: '1px solid #E9EDF2' }}>
          <h3 style={{ marginBottom: '18px', fontSize: '24px', fontWeight: '800', color: 'black' }}>Need further help?</h3>
          <p style={{ color: 'black', fontSize: '16px', marginBottom: '24px' }}>If you have questions about the election process, reach out to the BUSA Electoral Board.</p>
          <a href="tel:+256780752003" className="btn" style={{ textDecoration: 'none' }}>Contact Electoral Board</a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PublicGuidelines;
