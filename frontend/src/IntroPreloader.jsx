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
        {/* Human Hand Animation */}
        <div className="human-hand">
          <div className="arm">
            <div className="sleeve"></div>
            <div className="palm">
              <div className="finger thumb"></div>
              <div className="finger index"></div>
              <div className="finger middle"></div>
              <div className="finger ring"></div>
              <div className="finger pinky"></div>
            </div>
          </div>
        </div>

        {/* Voting Box */}
        <div className="voting-box">
          <div className="box-id">
            <div className="box-slot"></div>
          </div>
          <div className="box-body">
            <div className="box-paper">
              <div className="paper-lines"></div>
              <div className="paper-check">✓</div>
            </div>
          </div>
        </div>

        {/* Success Elements */}
        <div className="success-elements">
          <div className="check-circle">
            <div className="check-mark">✓</div>
          </div>
          <div className="dots">
            <div className="dot dot-1"></div>
            <div className="dot dot-2"></div>
            <div className="dot dot-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPreloader;
