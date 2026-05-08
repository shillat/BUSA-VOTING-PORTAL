import React, { useState, useEffect } from 'react';
import './IntroPreloader.css';

const IntroPreloader = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger exit animation
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 4200);

    // Call onComplete after exit animation finishes
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5000);

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
        {/* Ballot */}
        <div className="ballot">
          <div className="ballot-lines"></div>
          <svg className="ballot-check" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        </div>

        {/* Box */}
        <div className="box-container">
          <div className="box-top-opening"></div>
          <div className="box-front">
            <div className="box-logo">BUSA</div>
          </div>
          <div className="box-top-lip"></div>
        </div>

        {/* Success Glow */}
        <div className="success-glow">
          <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
        </div>
      </div>
    </div>
  );
};

export default IntroPreloader;
