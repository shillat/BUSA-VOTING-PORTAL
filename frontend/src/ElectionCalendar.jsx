import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { utils } from './api';
import LogoMark from './LogoMark';

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
    5: { title: 'Debates', type: 'debate', fullTitle: 'CANDIDATE DEBATES', color: '#E67E22', desc: 'Live televised and streamed sessions where all registered candidates present their manifestos.', time: '🕒 6:00 PM' },
    12: { title: 'Voting Opens', type: 'voting', fullTitle: 'GENERAL VOTING OPENS', color: '#27AE60', desc: 'The portal opens for all verified voters. Cast your secure ballot using your unique registration credentials.', time: '🕒 08:00 AM' },
    15: { title: 'Results', type: 'results', fullTitle: 'FINAL RESULTS RELEASE', color: '#8E44AD', desc: 'Official certification and announcement of election winners following independent verification.', time: '🕒 4:00 PM' }
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
    <div className="portal-container" style={{ width: '100%', maxWidth: '1280px', background: '#FFFFFF', minHeight: '100vh', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 48px 20px 48px', borderBottom: '1px solid #EFF3F8' }}>
        <div className="logo-area" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LogoMark />
          <div className="portal-title" style={{ fontWeight: '700', fontSize: '18px', letterSpacing: '-0.2px', color: '#0B2B44', background: '#F8FAFE', padding: '5px 18px', borderRadius: '40px' }}>BUSA ONLINE VOTING PORTAL</div>
        </div>
        <a href="#" onClick={handleBackToHome} style={{ fontSize: '14px', fontWeight: '500', color: '#2A6F8F', textDecoration: 'none', borderBottom: '1px dashed #B9D4E3', paddingBottom: '2px' }}>← Back to Home</a>
      </div>

      <div style={{ padding: '32px 48px 16px 48px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'black', margin: 0 }}>ELECTION CALENDAR 2027</h1>
      </div>

      <div className="calendar-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px 0 48px' }}>
        <div className="month-year" style={{ fontSize: '24px', fontWeight: '700', color: '#1A2C3E' }}>April 2027</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="view-buttons" style={{ display: 'flex', gap: '12px', background: '#F5F8FC', padding: '4px', borderRadius: '48px' }}>
            {['month', 'week', 'day'].map((v) => (
              <button 
                key={v} 
                className={`view-btn ${view === v ? 'active' : ''}`} 
                onClick={() => setView(v)}
                style={{ padding: '8px 20px', border: 'none', background: view === v ? '#002F6C' : 'transparent', color: view === v ? 'white' : '#6F8FAC', fontWeight: '600', fontSize: '14px', borderRadius: '40px', cursor: 'pointer' }}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => handleNavClick('prev')} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E9F2', borderRadius: '40px', background: 'white', cursor: 'pointer' }}>←</button>
            <button onClick={() => handleNavClick('next')} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E9F2', borderRadius: '40px', background: 'white', cursor: 'pointer' }}>→</button>
          </div>
        </div>
      </div>

      <div className="calendar-container" style={{ padding: '24px 48px 32px 48px' }}>
        <div className="calendar-grid" style={{ background: '#FFFFFF', border: '1px solid #EDF2F7', borderRadius: '28px', overflow: 'hidden' }}>
          <div className="weekdays" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#F8FAFE', borderBottom: '1px solid #EDF2F7' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '700', fontSize: '14px', color: 'black', textTransform: 'uppercase' }}>{d}</div>
            ))}
          </div>
          <div className="calendar-days" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#FFFFFF' }}>
            {renderDays()}
          </div>
        </div>
      </div>

      <div className="events-section" style={{ padding: '16px 48px 48px 48px' }}>
        <div className="events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px' }}>
          {Object.entries(events).map(([day, ev]) => (
            <div key={day} className="event-card" onClick={() => utils.showToast(`📅 ${ev.fullTitle}`, true)} style={{ background: '#FFFFFF', border: '1px solid #EDF2F7', borderRadius: '24px', overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ background: ev.color, padding: '16px 20px', color: 'white' }}>
                <div style={{ fontSize: '28px', fontWeight: '800' }}>April {day.padStart(2, '0')}</div>
                <div style={{ fontSize: '14px', opacity: '0.8', marginTop: '4px' }}>2027</div>
              </div>
              <div className="event-content" style={{ padding: '20px 24px 24px 24px' }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#1A2C3E', marginBottom: '12px' }}>{ev.fullTitle}</div>
                <div style={{ fontSize: '14px', lineHeight: '1.55', color: 'black', marginBottom: '16px' }}>{ev.desc}</div>
                <div style={{ fontSize: '13px', color: 'black', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F0F4F9' }}>{ev.time} | Venue/Online</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="footer" style={{ background: '#FCFDFF', borderTop: '1px solid #ECF3F9', padding: '32px 48px 28px', width: '100%', marginTop: 'auto' }}>
        <div className="footer-grid" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px', maxWidth: '1100px', margin: '0 auto' }}>
          <div className="footer-col">
            <h4 style={{ fontWeight: '700', fontSize: '14px', color: 'black', marginBottom: '14px' }}>BUSA</h4>
            <a href="#" style={{ display: 'block', fontSize: '12px', color: '#48708E', textDecoration: 'none', marginBottom: '10px' }}>About Union</a>
            <a href="#" style={{ display: 'block', fontSize: '12px', color: '#48708E', textDecoration: 'none', marginBottom: '10px' }}>Election Guidelines</a>
          </div>
          <div className="footer-col">
            <h4 style={{ fontWeight: '700', fontSize: '14px', color: 'black', marginBottom: '14px' }}>Legal</h4>
            <a href="#" style={{ display: 'block', fontSize: '12px', color: '#48708E', textDecoration: 'none', marginBottom: '10px' }}>PRIVACY POLICY</a>
            <a href="#" style={{ display: 'block', fontSize: '12px', color: '#48708E', textDecoration: 'none', marginBottom: '10px' }}>TERMS OF SERVICE</a>
          </div>
        </div>
        <div className="copyright" style={{ textAlign: 'center', fontSize: '11px', color: '#7C95AF', marginTop: '28px', paddingTop: '16px', borderTop: '1px solid #E9F0F6' }}>
          © 2026 BUSA ONLINE VOTING PORTAL. ALL RIGHTS RESERVED
        </div>
      </div>
    </div>
  );
};

export default ElectionCalendar;
