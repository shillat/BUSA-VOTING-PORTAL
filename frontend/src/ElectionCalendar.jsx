import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { utils } from './api';
import LogoMark from './LogoMark';
import Footer from './Footer';

const ElectionCalendar = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('month');

  const handleBackToHome = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleNavClick = (direction) => {
    utils.showToast(`${direction === 'prev' ? '← Previous' : 'Next →'} month (demo - calendar would update)`, false);
  };

  const daysInApril = 30;
  const startOffset = 3; // April 1, 2027 is a Thursday

  const events = {
    5: { title: 'Debates', type: 'debate', fullTitle: 'CANDIDATE DEBATES', color: '#E67E22', desc: 'Live televised and streamed sessions where all registered candidates present their manifestos. Join us at Main Auditorium to hear from Abraham Okoch and Fubi Jovia as they present their visions for BUSA leadership.', time: '🕒 6:00 PM' },
    12: { title: 'Voting Opens', type: 'voting', fullTitle: 'GENERAL VOTING OPENS', color: '#27AE60', desc: 'The portal opens for all verified voters. Cast your secure ballot using your unique registration credentials. All positions are available: President, Faculty Representatives, and Regional MPs.', time: '🕒 08:00 AM' },
    15: { title: 'Results', type: 'results', fullTitle: 'FINAL RESULTS RELEASE', color: '#8E44AD', desc: 'Official certification and announcement of election winners following independent verification. Results will be published on all platforms and candidates will be notified.', time: '🕒 4:00 PM' }
  };

  const renderDays = () => {
    const cells = [];
    // Empty cells
    for (let i = 0; i < startOffset; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-day" style={{ minHeight: '110px', padding: '12px', borderRight: '1px solid #F0F4F9', borderBottom: '1px solid #F0F4F9', background: '#FAFCFE', opacity: '0.5' }}></div>);
    }
    // Actual days
    for (let day = 1; day <= daysInApril; day++) {
      const isToday = day === 12;
      const event = events[day];
      cells.push(
        <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`} style={{ minHeight: '110px', padding: '12px', borderRight: '1px solid #F0F4F9', borderBottom: '1px solid #F0F4F9', background: isToday ? '#F0F7FF' : 'white', position: 'relative' }}>
          <div className="day-number" style={{ fontWeight: isToday ? '800' : '600', fontSize: '14px', color: isToday ? '#002F6C' : '#8A9BB0', marginBottom: '8px' }}>{day}</div>
          {event && (
            <div 
              onClick={() => utils.showToast(`📅 ${event.fullTitle} - April ${day}`, true)}
              style={{ background: event.color, color: 'white', fontSize: '10px', padding: '4px 8px', borderRadius: '12px', marginTop: '6px', display: 'inline-block', fontWeight: '600', cursor: 'pointer' }}
            >
              {event.title}
            </div>
          )}
        </div>
      );
    }
    return cells;
  };

  return (
    <>
      <style>{`
        .calendar-container {
          width: 100%;
          max-width: 1280px;
          background: #FFFFFF;
          min-height: 100vh;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
        }

        /* Header Styles */
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 48px 20px 48px;
          border-bottom: 1px solid #EFF3F8;
        }

        .logo-area {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .portal-title {
          font-weight: 700;
          font-size: 18px;
          letter-spacing: -0.2px;
          color: #0B2B44;
          background: #F8FAFE;
          padding: 5px 18px;
          border-radius: 40px;
        }

        .back-link {
          font-size: 14px;
          font-weight: 500;
          color: #2A6F8F;
          text-decoration: none;
          border-bottom: 1px dashed #B9D4E3;
          padding-bottom: 2px;
        }

        /* Title Section */
        .calendar-title-section {
          padding: 32px 48px 16px 48px;
        }

        .calendar-title {
          font-size: clamp(24px, 5vw, 36px);
          font-weight: 800;
          color: black;
          margin: 0;
        }

        /* Navigation Section */
        .calendar-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 48px 0 48px;
          gap: 16px;
        }

        .month-year {
          font-size: clamp(18px, 4vw, 24px);
          font-weight: 700;
          color: #1A2C3E;
        }

        .nav-controls {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .view-buttons {
          display: flex;
          gap: 12px;
          background: #F5F8FC;
          padding: 4px;
          border-radius: 48px;
        }

        .view-btn {
          padding: 8px 16px;
          border: none;
          background: transparent;
          color: #6F8FAC;
          font-weight: 600;
          font-size: 14px;
          border-radius: 40px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-btn.active {
          background: #002F6C;
          color: white;
        }

        .nav-arrows {
          display: flex;
          gap: 8px;
        }

        .nav-arrow {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #E2E9F2;
          border-radius: 40px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-arrow:hover {
          background: #F8FAFE;
        }

        /* Calendar Grid */
        .calendar-grid-section {
          padding: 24px 48px 32px 48px;
        }

        .calendar-grid {
          background: #FFFFFF;
          border: 1px solid #EDF2F7;
          border-radius: 28px;
          overflow: hidden;
        }

        .weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          background: #F8FAFE;
          border-bottom: 1px solid #EDF2F7;
        }

        .weekday {
          padding: 16px 8px;
          text-align: center;
          font-weight: 700;
          font-size: clamp(11px, 2.5vw, 14px);
          color: black;
          text-transform: uppercase;
        }

        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          background: #FFFFFF;
        }

        .calendar-day {
          min-height: 80px;
          padding: 8px;
          border-right: 1px solid #F0F4F9;
          border-bottom: 1px solid #F0F4F9;
          position: relative;
        }

        .calendar-day.today {
          background: #F0F7FF;
        }

        .day-number {
          font-weight: 600;
          font-size: 12px;
          color: #8A9BB0;
          margin-bottom: 4px;
        }

        .calendar-day.today .day-number {
          font-weight: 800;
          color: #002F6C;
        }

        .event-badge {
          background: #E67E22;
          color: white;
          font-size: 9px;
          padding: 2px 6px;
          border-radius: 8px;
          margin-top: 4px;
          display: inline-block;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .event-badge:hover {
          transform: scale(1.05);
        }

        /* Events Section */
        .events-section {
          padding: 16px 48px 48px 48px;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .event-card {
          background: #FFFFFF;
          border: 1px solid #EDF2F7;
          border-radius: 24px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .event-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .event-header {
          padding: 16px 20px;
          color: white;
        }

        .event-date {
          font-size: clamp(20px, 4vw, 28px);
          font-weight: 800;
        }

        .event-year {
          font-size: 14px;
          opacity: 0.8;
          margin-top: 4px;
        }

        .event-content {
          padding: 20px 24px 24px 24px;
        }

        .event-title {
          font-size: clamp(16px, 3.5vw, 20px);
          font-weight: 800;
          color: #1A2C3E;
          margin-bottom: 12px;
        }

        .event-description {
          font-size: 14px;
          line-height: 1.55;
          color: black;
          margin-bottom: 16px;
        }

        .event-meta {
          font-size: 13px;
          color: black;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #F0F4F9;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .calendar-header {
            flex-direction: column;
            gap: 16px;
            padding: 20px 24px;
            text-align: center;
          }

          .calendar-title-section {
            padding: 24px 24px 12px 24px;
          }

          .calendar-nav {
            flex-direction: column;
            gap: 20px;
            padding: 12px 24px 0 24px;
          }

          .nav-controls {
            flex-direction: column;
            width: 100%;
          }

          .view-buttons {
            justify-content: center;
            width: 100%;
          }

          .nav-arrows {
            justify-content: center;
          }

          .calendar-grid-section {
            padding: 20px 24px 24px 24px;
          }

          .weekday {
            padding: 12px 4px;
            font-size: 10px;
          }

          .calendar-day {
            min-height: 60px;
            padding: 4px;
          }

          .day-number {
            font-size: 11px;
          }

          .event-badge {
            font-size: 8px;
            padding: 1px 4px;
          }

          .events-section {
            padding: 12px 24px 32px 24px;
          }

          .events-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .event-header {
            padding: 12px 16px;
          }

          .event-content {
            padding: 16px 20px 20px 20px;
          }
        }

        @media (max-width: 480px) {
          .calendar-header {
            padding: 16px 20px;
          }

          .portal-title {
            font-size: 14px;
            padding: 4px 12px;
          }

          .calendar-title-section {
            padding: 20px 20px 8px 20px;
          }

          .calendar-nav {
            padding: 8px 20px 0 20px;
          }

          .view-btn {
            padding: 6px 12px;
            font-size: 12px;
          }

          .nav-arrow {
            width: 36px;
            height: 36px;
          }

          .calendar-grid-section {
            padding: 16px 20px 20px 20px;
          }

          .weekday {
            padding: 8px 2px;
            font-size: 9px;
          }

          .calendar-day {
            min-height: 50px;
            padding: 2px;
          }

          .events-section {
            padding: 8px 20px 24px 20px;
          }
        }
      `}</style>

      <div className="calendar-container">
        {/* Header */}
        <header className="calendar-header">
          <div className="logo-area">
            <LogoMark />
            <div className="portal-title">BUSA ONLINE VOTING PORTAL</div>
          </div>
          <button
          onClick={handleBackToHome}
          style={{
            padding: '8px 16px',
            background: '#002F6C',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#0A4175';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#002F6C';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          ← Back to Home
        </button>
        </header>

        {/* Title */}
        <div className="calendar-title-section">
          <h1 className="calendar-title">ELECTION CALENDAR 2027</h1>
        </div>

        {/* Navigation */}
        <nav className="calendar-nav">
          <div className="month-year">April 2027</div>
          <div className="nav-controls">
            <div className="view-buttons">
              {['month', 'week', 'day'].map((v) => (
                <button 
                  key={v} 
                  className={`view-btn ${view === v ? 'active' : ''}`} 
                  onClick={() => setView(v)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
            <div className="nav-arrows">
              <button onClick={() => handleNavClick('prev')} className="nav-arrow">←</button>
              <button onClick={() => handleNavClick('next')} className="nav-arrow">→</button>
            </div>
          </div>
        </nav>

        {/* Calendar Grid */}
        <div className="calendar-grid-section">
          <div className="calendar-grid">
            <div className="weekdays">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <div key={d} className="weekday">{d}</div>
              ))}
            </div>
            <div className="calendar-days">
              {renderDays()}
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="events-section">
          <div className="events-grid">
            {Object.entries(events).map(([day, ev]) => (
              <div key={day} className="event-card" onClick={() => utils.showToast(`📅 ${ev.fullTitle}`, true)}>
                <div className="event-header" style={{ background: ev.color }}>
                  <div className="event-date">April {day.padStart(2, '0')}</div>
                  <div className="event-year">2027</div>
                </div>
                <div className="event-content">
                  <div className="event-title">{ev.fullTitle}</div>
                  <div className="event-description">{ev.desc}</div>
                  <div className="event-meta">{ev.time} | Venue/Online</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default ElectionCalendar;
