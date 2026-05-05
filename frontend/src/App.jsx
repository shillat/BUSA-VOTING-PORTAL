import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom';
import Registration from './Registration';
import AdminVerify from './AdminVerify';
import Login from './Login';
import IntroPreloader from './IntroPreloader';
import ValidationSuccessful from './ValidationSuccessful';
import ValidationFailed from './ValidationFailed';
import VoterDashboard from './VoterDashboard';
import AdminDashboard from './AdminDashboard';
import DigitalBallot from './DigitalBallot';
import ReviewSelection from './ReviewSelection';
import VoterDatabase from './VoterDatabase';
import SecurityLog from './SecurityLog';
import ManageAnnouncements from './ManageAnnouncements';
import ManageElections from './ManageElections';
import ManageCandidates from './ManageCandidates';
import ManageGuidelines from './ManageGuidelines';
import ManageElectionCalendar from './ManageElectionCalendar';
import AllCandidates from './AllCandidates';
import ElectionCalendar from './ElectionCalendar';
import ElectionOverview from './ElectionOverview';
import LiveTally from './LiveTally';
import Rating from './Rating';
import ProtectedRoute from './ProtectedRoute';
import PublicAnnouncements from './PublicAnnouncements';
import PublicGuidelines from './PublicGuidelines';
import Navbar from './Navbar';
import Footer from './Footer';
import CandidateProfile from './CandidateProfile';
import { electionAPI, announcementAPI, guidelineAPI, voterAPI, candidateAPI, utils } from './api';
import heroImage1 from './assets/heroImage1.png';
import heroImage3 from './assets/heroImage3.png';
import './App.css';

// Home component - simple landing page
const Home = () => {
  const navigate = useNavigate();
  const [regNumber, setRegNumber] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [stats, setStats] = useState({ total_votes: 0, total_voters: 0 });
  const [activeElections, setActiveElections] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [featuredCandidates, setFeaturedCandidates] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [guidelines, setGuidelines] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Hero images array - add more images as: heroImage3.png, heroImage4.png, etc.
  const heroImages = [
    heroImage1,
    heroImage3,
  ];

  useEffect(() => {
    // Only set up carousel if there are multiple images
    if (heroImages.length > 1) {
      const imageInterval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(imageInterval);
    }
  }, [heroImages.length]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setDataLoading(true);
        const [tally, elections, allCandidates, publishedGuidelines, liveAnnouncements] = await Promise.all([
          electionAPI.getGlobalTally(),
          electionAPI.getActive(),
          candidateAPI.getAll(),
          guidelineAPI.getAll(true),
          announcementAPI.getAll()
        ]);
        setStats(tally);
        setActiveElections(elections);
        setFeaturedCandidates(allCandidates.slice(0, 4));
        setGuidelines(publishedGuidelines.slice(0, 3));
        setAnnouncements(liveAnnouncements.slice(0, 2));
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    if (!regNumber.trim()) {
      utils.showToast('Please enter a Registration Number', true);
      return;
    }

    try {
      setStatusLoading(true);
      const data = await voterAPI.checkStatus(regNumber);

      if (data.status === 'Approved') {
        navigate('/validation-successful', {
          state: {
            voterId: data.voter_id || 'V-PENDING',
            regNo: regNumber,
            name: data.name,
            campus: data.campus
          }
        });
      } else if (data.status === 'Pending') {
        navigate('/validation-failed', { state: { error: "Your registration is still PENDING admin approval. Please check back later." } });
      } else if (data.status === 'Rejected') {
        navigate('/validation-failed', { state: { error: `Your registration was REJECTED. Reason: ${data.rejection_reason || 'Incomplete information'}` } });
      }
    } catch (err) {
      navigate('/validation-failed', { state: { error: err.message || "No registration record found for this Registration Number." } });
    } finally {
      setStatusLoading(false);
    }
  };

  const participationRate = stats.total_voters > 0
    ? Math.min(100, Math.round((stats.total_votes / stats.total_voters) * 100))
    : 0;

  return (
    <div className="container">
      <Navbar />

      <div className="grid">
        <div className="card hero" style={{
          backgroundImage: `url(${heroImages[currentImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          transition: 'background-image 1s ease-in-out',
          position: 'relative',
          minHeight: '300px'
        }}>
          <div style={{ position: 'relative', zIndex: 1, padding: '20px 16px' }}>
            <p className="small">BUGEMA University Elections 2027</p>
            <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: '800', lineHeight: '1.2', marginBottom: '12px' }}>Your Voice Shapes<br />Our Shared<br />Future.</h1>
            <p style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', lineHeight: '1.4' }}>A secure, transparent, and accessible voting platform designed for the student community. Exercise your right with confidence.</p>
            <Link to="/register" className="btn">Register to Vote</Link>
          </div>
        </div>

        <div>
          <div className="card">
            <h3>Verification</h3>
            <p className="small">ENTER YOUR REG. NUMBER</p>
            <input
              placeholder="24/XXX/BU/X/XXXX"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
            />
            <button
              onClick={handleCheckStatus}
              className="btn"
              style={{ width: '100%', marginTop: '10px' }}
              disabled={statusLoading}
            >
              {statusLoading ? 'Checking...' : 'Check Status'}
            </button>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Live Tally <span className="live-badge">LIVE</span></h3>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#002F6C' }}>{participationRate}%</span>
            </div>
            <p className="small">Total Ballots Cast</p>
            <h2 style={{ marginBottom: '12px' }}>{stats.total_votes.toLocaleString()}</h2>
            <div style={{ background: '#E2E9F2', borderRadius: '10px', height: '8px', overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{
                background: 'linear-gradient(90deg, #002F6C 0%, #1A4A7A 100%)',
                width: `${participationRate}%`,
                height: '100%',
                borderRadius: '10px',
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              }}></div>
            </div>
            <Link to="/tally" className="btn">View Full Tally</Link>
          </div>
        </div>
      </div>

      <div className="section-title">
        <h2>Election Overview</h2>
        <span className="tag">Active Sessions ({activeElections.length})</span>
      </div>

      <div className="cards-3">
        {!dataLoading && activeElections.length === 0 ? (
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <span className="tag" style={{ background: '#FEE2E2', color: '#B91C1C' }}>NO SESSIONS</span>
            <h3>No Active Elections</h3>
            <p className="small">There are currently no active voting sessions. Announcements will be posted when polling begins.</p>
          </div>
        ) : (
          activeElections.map((election, idx) => (
            <div key={idx} className="card">
              <span className="tag">VOTING OPEN</span>
              <h3>{election.title}</h3>
              <p className="small">{election.description || 'General election for student union representation.'}</p>
              <p className="small">Ends on: {new Date(election.end_date).toLocaleDateString()}</p>
            </div>
          ))
        )}

        <div className="card">
          <h3>Key Dates</h3>
          <p className="small"><strong>Verify</strong> - 24h before voting</p>
          <p className="small"><strong>Registration</strong> - Open Now</p>
          <p className="small"><strong>Polling</strong> - See Guidelines</p>
          <Link to="/calendar" className="btn">View Calendar</Link>
        </div>
      </div>

      <div className="announcements">
        <div className="card">
          <h3>Guidelines</h3>
          {guidelines.length === 0 ? (
            <p className="small">No published guidelines available yet. Check the guidelines page for the latest rules and regulations.</p>
          ) : (
            guidelines.map((guideline) => (
              <div key={guideline.id} style={{ marginBottom: '12px' }}>
                <p className="small" style={{ fontWeight: '700', marginBottom: '4px' }}>{guideline.title}</p>
                <p className="small">{guideline.content.substring(0, 80)}{guideline.content.length > 80 ? '...' : ''}</p>
              </div>
            ))
          )}
          <Link to="/guidelines" className="btn">View Guidelines</Link>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3>Announcements</h3>
            <Link to="/announcements" className="small" style={{ cursor: 'pointer', fontWeight: 600, color: '#002F6C', textDecoration: 'none' }}>View All →</Link>
          </div>

          {announcements.length === 0 ? (
            <p className="small" style={{ marginTop: '15px' }}>No announcements have been posted yet. Please check back shortly.</p>
          ) : announcements.map((announcement) => (
            <div key={announcement.id} style={{ marginTop: '18px' }}>
              <p className="small" style={{ marginBottom: '6px' }}><strong>{announcement.title}</strong></p>
              <p className="small">{announcement.content.substring(0, 100)}{announcement.content.length > 100 ? '...' : ''}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="candidates">
        <h2>CANDIDATES</h2>
        <p className="small">Meet the candidates and their respective posts.</p>

        <div className="candidate-grid">
          {!dataLoading && featuredCandidates.length === 0 ? (
            <div className="card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px' }}>
              <p className="small">No candidates have been registered for active elections yet.</p>
            </div>
          ) : (
            featuredCandidates.map((cand, idx) => (
              <div key={idx} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {cand.photo_url ? (
                  <img
                    src={`https://busa-voting-portal.onrender.com${cand.photo_url}`}
                    alt={cand.name}
                    style={{ width: '100%', height: '320px', objectFit: 'cover', objectPosition: 'center top' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '320px', background: '#002F6C', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: '800' }}>
                    {cand.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                )}
                <div style={{ padding: '16px', textAlign: 'left' }}>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: 'black', margin: '0 0 6px 0' }}>
                    <span style={{ fontWeight: '600' }}>NAME:</span> {cand.name}
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: 'black', margin: '0 0 12px 0' }}>
                    <span style={{ fontWeight: '600' }}>POST:</span> {cand.position || 'Candidate'}
                  </p>
                  <Link to={`/candidates/${cand.id}`} className="btn" style={{ padding: '5px', fontSize: '12px', width: '95%', textAlign: 'center' }}>View Full Profile</Link>
                </div>
              </div>
            ))
          )}
        </div>
        <Link to="/candidates" className="btn" style={{ marginTop: '40px', padding: '16px 40px' }}>See All Candidates</Link>
      </div>

      <Footer />
    </div>
  );
};

function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {showPreloader && <IntroPreloader onComplete={handlePreloaderComplete} />}
      <Router>
        <div className="app-container" style={{
          opacity: showPreloader ? 0 : 1,
          transition: 'opacity 0.8s ease-in-out',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/validation-successful" element={<ValidationSuccessful />} />
            <Route path="/validation-failed" element={<ValidationFailed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<Login />} />

            {/* Voter Protected Routes */}
            <Route path="/voter/dashboard" element={
              <ProtectedRoute requiredRole="voter">
                <VoterDashboard />
              </ProtectedRoute>
            } />
            <Route path="/voter/ballot" element={
              <ProtectedRoute requiredRole="voter">
                <DigitalBallot />
              </ProtectedRoute>
            } />
            <Route path="/review-selection" element={
              <ProtectedRoute requiredRole="voter">
                <ReviewSelection />
              </ProtectedRoute>
            } />
            <Route path="/rating" element={
              <ProtectedRoute requiredRole="voter">
                <Rating />
              </ProtectedRoute>
            } />

            {/* Admin Protected Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/database" element={
              <ProtectedRoute requiredRole="admin">
                <VoterDatabase />
              </ProtectedRoute>
            } />
            <Route path="/admin/security" element={
              <ProtectedRoute requiredRole="admin">
                <SecurityLog />
              </ProtectedRoute>
            } />
            <Route path="/admin/announcements" element={
              <ProtectedRoute requiredRole="admin">
                <ManageAnnouncements />
              </ProtectedRoute>
            } />
            <Route path="/admin/elections" element={
              <ProtectedRoute requiredRole="admin">
                <ManageElections />
              </ProtectedRoute>
            } />
            <Route path="/admin/candidates" element={
              <ProtectedRoute requiredRole="admin">
                <ManageCandidates />
              </ProtectedRoute>
            } />
            <Route path="/admin/guidelines" element={
              <ProtectedRoute requiredRole="admin">
                <ManageGuidelines />
              </ProtectedRoute>
            } />
            <Route path="/admin/calendar" element={
              <ProtectedRoute requiredRole="admin">
                <ManageElectionCalendar />
              </ProtectedRoute>
            } />
            <Route path="/admin/verify" element={
              <ProtectedRoute requiredRole="admin">
                <AdminVerify />
              </ProtectedRoute>
            } />

            {/* Public Informational Routes */}
            <Route path="/candidates/:id" element={<CandidateProfile />} />
            <Route path="/candidates" element={<AllCandidates />} />
            <Route path="/calendar" element={<ElectionCalendar />} />
            <Route path="/overview" element={<ElectionOverview />} />
            <Route path="/tally" element={<LiveTally />} />
            <Route path="/announcements" element={<PublicAnnouncements />} />
            <Route path="/guidelines" element={<PublicGuidelines />} />
          </Routes>
        </div>

        {/* Back to Top Button */}
        <button
          className={`back-to-top ${isVisible ? 'visible' : ''}`}
          onClick={scrollToTop}
          aria-label="Back to Top"
        >
          ↑
        </button>
      </Router>
    </>
  );
}

export default App;
