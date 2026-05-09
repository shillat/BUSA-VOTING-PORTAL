import React, { useState, useEffect } from 'react';
import './IntroPreloader.css';

const IntroPreloader = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger exit animation
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 5500);

    // Call onComplete after exit animation finishes
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 6300);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Generate staggered animation delays for text
  const renderStaggeredText = (text, delayOffset) => {
    return text.split(' ').map((word, index) => (
      <span
        key={index}
        className="word-anim"
        style={{ animationDelay: `${delayOffset + index * 0.1}s` }}
      >
        {word}{' '}
      </span>
    ));
  };

  return (
    <div className={`intro-container ${isExiting ? 'exit' : ''}`}>
      <div className="text-stage">
        <h1 className="title">
          {renderStaggeredText('Welcome to BUSA', 0.8)}
        </h1>
        <p className="subtitle">
          {renderStaggeredText('Your voice shapes our future', 1.2)}
        </p>
      </div>

      <div className="animation-stage">
        {/* Phone */}
        <div className="phone">
          <div className="phone-screen">
            <div className="phone-header">BUSA Voting</div>
            <div className="voting-card">
              <div className="card-header">Voter Card</div>
              <div className="card-info">
                <div className="card-name">STUDENT VOTER</div>
                <div className="card-id">VoterID: 2026-BUSA-001</div>
              </div>
            </div>
            <div className="voted-status">
              <svg className="voted-check" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <span>VOTED</span>
            </div>
          </div>
          <div className="phone-button"></div>
        </div>
      </div>
    </div>
  );
};

export default IntroPreloader;
