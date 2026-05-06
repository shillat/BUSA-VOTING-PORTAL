import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoMark from './LogoMark';
import QRCode from 'qrcode';

const ValidationSuccessful = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [voterData, setVoterData] = useState({
    voterId: 'V-XXXX-XXXX',
    name: 'Verified Student',
    regNo: 'N/A',
    campus: 'Main Campus'
  });
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handlePrintId = () => {
    const printWindow = window.open('', '_blank');
    const cardHtml = document.querySelector('.print-area').innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Voter ID Card - ${voterData.name}</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            background: white;
            font-family: 'Inter', sans-serif;
          }
          * {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          .credential-card {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border: 2px solid #E8EDF4;
            border-radius: 32px;
            overflow: hidden;
            page-break-inside: avoid;
          }
          .card-header {
            background: linear-gradient(135deg, #002F6C 0%, #0A4175 100%);
            padding: 24px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .card-logo {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .card-logo-text {
            color: white;
            font-weight: 700;
            font-size: 20px;
            letter-spacing: 1px;
          }
          .card-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 6px 16px;
            border-radius: 40px;
            font-size: 12px;
            font-weight: 600;
            color: white;
            text-transform: uppercase;
          }
          .card-body {
            padding: 36px 40px;
            display: flex;
            gap: 48px;
          }
          .info-column {
            flex: 1.2;
          }
          .credential-title {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: black;
            margin-bottom: 24px;
          }
          .info-row {
            margin-bottom: 28px;
          }
          .info-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: black;
            margin-bottom: 6px;
          }
          .info-value {
            font-size: 18px;
            font-weight: 600;
            color: #1A2C3E;
          }
          .token-value {
            font-family: monospace;
            font-size: 24px;
            font-weight: 800;
            color: #002F6C;
            letter-spacing: 1px;
          }
          .status-active {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #E8F5E9;
            padding: 6px 16px;
            border-radius: 40px;
            font-weight: 700;
            font-size: 14px;
            color: #2E7D32;
          }
          .status-dot {
            width: 8px;
            height: 8px;
            background: #2E7D32;
            border-radius: 50%;
          }
          .qrcode-column {
            flex: 0.8;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #F9FBFE;
            border-radius: 24px;
            padding: 24px;
            border: 1px solid #EDF2F7;
          }
          .qrcode-box {
            width: 160px;
            height: 160px;
            background: white;
            border: 2px solid #E0E8F0;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
          }
          .qrcode-box img {
            width: 130px;
            height: 130px;
          }
          .qr-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: black;
            text-align: center;
          }
          @media print {
            body { margin: 0; padding: 10px; }
            .credential-card { margin: 0; }
          }
        </style>
      </head>
      <body>
        ${cardHtml}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  useEffect(() => {
    if (location.state) {
      setVoterData(prev => ({
        ...prev,
        ...location.state,
        voterId: location.state.voterId || 'V-XXXX-XXXX'
      }));
    }
  }, [location]);

  useEffect(() => {
    // Generate QR code with login credentials
    if (voterData.voterId && voterData.regNo && voterData.regNo !== 'N/A') {
      const qrData = JSON.stringify({
        regNo: voterData.regNo,
        voterId: voterData.voterId,
        type: 'voter_login'
      });
      
      QRCode.toDataURL(qrData, {
        width: 160,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(url => {
        setQrCodeUrl(url);
      }).catch(err => {
        console.error('Error generating QR code:', err);
      });
    }
  }, [voterData]);

  return (
    <>
      <style>{`
        @media print {
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          body > *:not(.print-area),
          .print-area > *:not(.credential-card),
          .credential-card > *:not(.card-body),
          .card-body > *:not(.info-column):not(.qrcode-column),
          .no-print {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
          }
          
          .print-area {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            padding: 20px !important;
            margin: 0 !important;
            background: white !important;
            display: block !important;
            visibility: visible !important;
          }
          
          .credential-card {
            width: 100% !important;
            max-width: 800px !important;
            margin: 0 auto !important;
            display: block !important;
            visibility: visible !important;
            background: white !important;
            border: 2px solid #E8EDF4 !important;
            page-break-inside: avoid !important;
          }
          
          .card-header,
          .card-body,
          .info-column,
          .qrcode-column,
          .info-row,
          .qrcode-box,
          .divider {
            display: block !important;
            visibility: visible !important;
            background: inherit !important;
          }
          
          .card-footer,
          .card-body > .divider:last-of-type,
          .card-body > .card-footer {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
          }
          
          .card-body {
            display: flex !important;
            gap: 20px !important;
            padding: 20px !important;
          }
          
          .info-column {
            flex: 1 !important;
          }
          
          .qrcode-column {
            flex: 0.8 !important;
          }
        }
        
        /* Mobile Responsiveness */
        @media (max-width: 1024px) {
          .main-content {
            padding: 40px 60px 60px !important;
          }
          
          .credential-card {
            width: 90% !important;
          }
        }
        
        @media (max-width: 768px) {
          /* Header */
          .top-header {
            padding: 20px 24px !important;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .logo-area {
            justify-content: center;
          }
          
          .portal-title {
            font-size: 16px !important;
            padding: 6px 16px !important;
          }
          
          .back-link {
            align-self: center;
            font-size: 14px !important;
          }
          
          /* Main Content */
          .main-content {
            padding: 32px 24px 40px !important;
            min-height: auto;
          }
          
          /* Success Badge */
          .success-badge {
            padding: 10px 24px !important;
            margin-bottom: 28px !important;
            border-radius: 50px !important;
          }
          
          .success-icon {
            font-size: 20px !important;
          }
          
          .success-text {
            font-size: 16px !important;
          }
          
          /* Title */
          h1 {
            font-size: 32px !important;
            margin-bottom: 12px !important;
            line-height: 1.2 !important;
          }
          
          .main-title p {
            font-size: 16px !important;
            line-height: 1.6 !important;
            padding: 0 20px;
            margin-bottom: 32px !important;
          }
          
          /* Credential Card */
          .credential-card {
            width: 100% !important;
            max-width: 500px !important;
            border-radius: 24px !important;
            margin: 0 auto 32px !important;
            box-shadow: 0 10px 25px -8px rgba(0, 0, 0, 0.1) !important;
          }
          
          .card-header {
            padding: 20px 24px !important;
            flex-direction: column;
            gap: 16px;
            text-align: center;
            border-radius: 24px 24px 0 0 !important;
          }
          
          .card-logo {
            justify-content: center;
          }
          
          .card-logo-text {
            font-size: 18px !important;
          }
          
          .card-badge {
            font-size: 11px !important;
            padding: 6px 16px !important;
            align-self: center;
          }
          
          /* Card Body */
          .card-body {
            padding: 28px 24px 24px !important;
            flex-direction: column !important;
            gap: 32px !important;
          }
          
          .info-column {
            flex: 1 !important;
            text-align: center;
          }
          
          .credential-title {
            font-size: 12px !important;
            margin-bottom: 24px !important;
            text-align: center;
          }
          
          .info-row {
            margin-bottom: 20px !important;
            text-align: left;
          }
          
          .info-label {
            font-size: 10px !important;
            margin-bottom: 6px !important;
            text-align: left;
          }
          
          .info-value {
            font-size: 16px !important;
            margin-bottom: 0 !important;
            text-align: left;
          }
          
          .token-value {
            font-size: 18px !important;
            word-break: break-all;
          }
          
          .status-active {
            font-size: 12px !important;
            padding: 6px 16px !important;
            justify-content: center;
            margin: 16px 0 !important;
            display: inline-flex !important;
          }
          
          /* QR Code */
          .qrcode-column {
            flex: 1 !important;
            padding: 24px 20px !important;
            text-align: center;
            align-self: center;
          }
          
          .qrcode-box {
            width: 150px !important;
            height: 150px !important;
            margin: 0 auto 16px !important;
            border-radius: 16px !important;
          }
          
          .qrcode-box img,
          .qr-pattern {
            width: 120px !important;
            height: 120px !important;
            border-radius: 8px !important;
          }
          
          .qr-label {
            font-size: 11px !important;
            text-align: center;
          }
          
          /* Divider */
          .divider {
            margin: 0 24px 20px 24px !important;
          }
          
          /* Card Footer */
          .card-footer {
            padding: 0 24px 28px 24px !important;
            flex-direction: column !important;
            gap: 20px !important;
            text-align: center;
          }
          
          .security-note {
            font-size: 12px !important;
            padding: 12px 20px !important;
            text-align: center;
            justify-content: center;
            border-radius: 50px !important;
            width: fit-content;
            margin: 0 auto;
          }
          
          .action-buttons {
            flex-direction: column !important;
            gap: 16px !important;
            width: 100%;
          }
          
          .btn-primary,
          .btn-secondary {
            width: 100%;
            padding: 14px 28px !important;
            font-size: 15px !important;
            text-align: center;
            border-radius: 50px !important;
          }
          
          /* Footer */
          .footer-links {
            display: none !important;
          }
        }
        
        @media (max-width: 480px) {
          /* Header */
          .top-header {
            padding: 16px 20px !important;
            gap: 12px;
          }
          
          .portal-title {
            font-size: 14px !important;
            padding: 4px 12px !important;
          }
          
          .back-link {
            font-size: 13px !important;
          }
          
          /* Main Content */
          .main-content {
            padding: 24px 20px 32px !important;
          }
          
          /* Success Badge */
          .success-badge {
            padding: 8px 20px !important;
            margin-bottom: 20px !important;
          }
          
          .success-icon {
            font-size: 18px !important;
          }
          
          .success-text {
            font-size: 14px !important;
          }
          
          /* Title */
          h1 {
            font-size: 26px !important;
            margin-bottom: 10px !important;
          }
          
          .main-title p {
            font-size: 14px !important;
            padding: 0 12px;
            margin-bottom: 24px !important;
          }
          
          /* Credential Card */
          .credential-card {
            border-radius: 20px !important;
            margin-bottom: 24px !important;
          }
          
          .card-header {
            padding: 16px 20px !important;
            gap: 12px;
            border-radius: 20px 20px 0 0 !important;
          }
          
          .card-logo-text {
            font-size: 16px !important;
          }
          
          .card-badge {
            font-size: 10px !important;
            padding: 4px 12px !important;
          }
          
          /* Card Body */
          .card-body {
            padding: 24px 20px 20px !important;
            gap: 24px !important;
          }
          
          .credential-title {
            font-size: 11px !important;
            margin-bottom: 20px !important;
          }
          
          .info-row {
            margin-bottom: 16px !important;
          }
          
          .info-label {
            font-size: 9px !important;
            margin-bottom: 4px !important;
          }
          
          .info-value {
            font-size: 14px !important;
          }
          
          .token-value {
            font-size: 16px !important;
          }
          
          .status-active {
            font-size: 11px !important;
            padding: 4px 12px !important;
            margin: 12px 0 !important;
          }
          
          /* QR Code */
          .qrcode-column {
            padding: 20px 16px !important;
          }
          
          .qrcode-box {
            width: 120px !important;
            height: 120px !important;
            margin-bottom: 12px !important;
            border-radius: 12px !important;
          }
          
          .qrcode-box img,
          .qr-pattern {
            width: 90px !important;
            height: 90px !important;
            border-radius: 6px !important;
          }
          
          .qr-label {
            font-size: 10px !important;
          }
          
          /* Divider */
          .divider {
            margin: 0 20px 16px 20px !important;
          }
          
          /* Card Footer */
          .card-footer {
            padding: 0 20px 20px 20px !important;
            gap: 16px !important;
          }
          
          .security-note {
            font-size: 11px !important;
            padding: 10px 16px !important;
          }
          
          .btn-primary,
          .btn-secondary {
            padding: 12px 24px !important;
            font-size: 14px !important;
          }
        }
        
        @media (max-width: 360px) {
          .top-header {
            padding: 12px 16px !important;
          }
          
          .portal-title {
            font-size: 12px !important;
            padding: 3px 10px !important;
          }
          
          .main-content {
            padding: 20px 16px 24px !important;
          }
          
          h1 {
            font-size: 22px !important;
          }
          
          .card-body {
            padding: 20px 16px 16px !important;
          }
          
          .qrcode-box {
            width: 100px !important;
            height: 100px !important;
          }
          
          .qrcode-box img,
          .qr-pattern {
            width: 75px !important;
            height: 75px !important;
          }
          
          .btn-primary,
          .btn-secondary {
            padding: 10px 20px !important;
            font-size: 13px !important;
          }
        }
      `}</style>
      <div className="portal-container" style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="top-header no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 48px 20px 48px', borderBottom: '1px solid #EFF3F8' }}>
        <div className="logo-area" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LogoMark size={48} radius={14} />
          <div className="portal-title" style={{ fontWeight: '700', fontSize: '20px', letterSpacing: '-0.3px', color: '#0B2B44', background: '#F8FAFE', padding: '6px 20px', borderRadius: '40px' }}>BUSA ONLINE VOTING PORTAL</div>
        </div>
        <button className="back-link" onClick={() => navigate('/')} style={{ background: 'none', border: 'none', fontSize: '15px', fontWeight: '500', color: '#2A6F8F', borderBottom: '1px dashed #B9D4E3', paddingBottom: '2px', cursor: 'pointer' }}>← Back to Home</button>
      </div>

      {/* Main Content */}
      <div className="main-content no-print" style={{ padding: '48px 80px 64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Success Badge */}
        <div className="success-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: '#E8F5E9', padding: '10px 28px', borderRadius: '60px', marginBottom: '32px' }}>
          <span className="success-icon" style={{ fontSize: '24px' }}>✓</span>
          <span className="success-text" style={{ fontWeight: '700', fontSize: '18px', color: '#2E7D32' }}>Validation Successful</span>
        </div>

        {/* Main Title */}
        <div className="main-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '800', color: 'black', marginBottom: '12px' }}>{voterData.name}</h1>
          <p style={{ fontSize: '18px', color: 'black' }}>Your identity has been verified. You are now ready to participate in the upcoming elections.</p>
        </div>

        {/* Print Area - Voter ID Card */}
        <div className="print-area">
          <div className="credential-card" style={{ background: '#FFFFFF', border: '2px solid #E8EDF4', borderRadius: '32px', boxShadow: '0 20px 35px -12px rgba(0, 0, 0, 0.08)', width: '780px', maxWidth: '100%', marginBottom: '40px', overflow: 'hidden', margin: '0 auto' }}>
          {/* Card Header */}
          <div className="card-header" style={{ background: 'linear-gradient(135deg, #002F6C 0%, #0A4175 100%)', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <LogoMark size={48} radius={12} />
              <div className="card-logo-text" style={{ color: 'white', fontWeight: '700', fontSize: '20px', letterSpacing: '1px' }}>BUSA</div>
            </div>
            <div className="card-badge" style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '6px 16px', borderRadius: '40px', fontSize: '12px', fontWeight: '600', color: 'white', textTransform: 'uppercase' }}>Official Credential</div>
          </div>

          {/* Card Body */}
          <div className="card-body" style={{ padding: '36px 40px', display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            {/* Left Column - Voter Information */}
            <div className="info-column" style={{ flex: '1.2' }}>
              <div className="credential-title" style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'black', marginBottom: '24px' }}>Authenticated Voter</div>

              <div className="info-row" style={{ marginBottom: '28px' }}>
                <div className="info-label" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'black', marginBottom: '6px' }}>Voter ID</div>
                <div className="info-value token-value" style={{ fontFamily: 'monospace', fontSize: '24px', fontWeight: '800', color: '#002F6C', letterSpacing: '1px' }}>{voterData.voterId}</div>
              </div>

              <div className="info-row" style={{ marginBottom: '28px' }}>
                <div className="info-label" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'black', marginBottom: '6px' }}>Registration Number</div>
                <div className="info-value" style={{ fontSize: '18px', fontWeight: '600', color: '#1A2C3E' }}>{voterData.regNo}</div>
              </div>

              <div className="info-row" style={{ marginBottom: '28px' }}>
                <div className="info-label" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'black', marginBottom: '6px' }}>Campus</div>
                <div className="info-value" style={{ fontSize: '18px', fontWeight: '600', color: '#1A2C3E' }}>{voterData.campus}</div>
              </div>

              <div className="info-row" style={{ marginBottom: '28px' }}>
                <div className="info-label" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'black', marginBottom: '6px' }}>Status</div>
                <div className="status-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#E8F5E9', padding: '6px 16px', borderRadius: '40px', fontWeight: '700', fontSize: '14px', color: '#2E7D32' }}>
                  <span className="status-dot" style={{ width: '8px', height: '8px', background: '#2E7D32', borderRadius: '50%' }}></span>
                  ACTIVE
                </div>
              </div>

              <div className="info-row" style={{ marginBottom: '28px' }}>
                <div className="info-label" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'black', marginBottom: '6px' }}>Verified Date</div>
                <div className="info-value date-value" style={{ fontSize: '18px', fontWeight: '600', color: '#1A2C3E' }}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
            </div>

            {/* Right Column - QR Code */}
            <div className="qrcode-column" style={{ flex: '0.8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F9FBFE', borderRadius: '24px', padding: '24px', border: '1px solid #EDF2F7' }}>
              <div className="qrcode-box" style={{ width: '160px', height: '160px', background: '#FFFFFF', border: '2px solid #E0E8F0', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', position: 'relative' }}>
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="Voter QR Code" style={{ width: '130px', height: '130px' }} />
                ) : (
                  <div className="qr-pattern" style={{ width: '130px', height: '130px', background: 'repeating-linear-gradient(90deg, #000 0px, #000 2px, #fff 2px, #fff 6px), repeating-linear-gradient(0deg, #000 0px, #000 2px, #fff 2px, #fff 6px)', backgroundBlendMode: 'multiply', position: 'relative' }}></div>
                )}
              </div>
              <div className="qr-label" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'black', textAlign: 'center' }}>Scan to Login</div>
            </div>
          </div>

          <div className="divider" style={{ height: '1px', background: '#EEF3F8', margin: '0 40px 24px 40px' }}></div>

          {/* Card Footer */}
          <div className="card-footer no-print" style={{ padding: '0 40px 36px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div className="security-note" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#D32F2F', background: '#FFEBEE', padding: '10px 18px', borderRadius: '40px' }}>
              <span className="security-icon">🔒</span>
              <span>Keep your Voter ID secure and do not share it.</span>
            </div>
            <div className="action-buttons" style={{ display: 'flex', gap: '20px' }}>
              <button className="btn-primary" onClick={() => navigate('/login')} style={{ background: '#002F6C', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '48px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}>Proceed to Login</button>
              <button className="btn-secondary" onClick={handlePrintId} style={{ background: 'transparent', color: '#1A2C3E', border: '2px solid #DCE3EC', padding: '12px 28px', borderRadius: '48px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}>PRINT Voter ID</button>
            </div>
          </div>
          </div>
        </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="footer-links no-print">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>BUSA</h4>
            <a href="#">About Union</a>
            <a href="#">Election Guidelines</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="footer-col">
            <h4>Help & Support</h4>
            <a href="#">FAQs</a>
            <a href="#">Live Chat</a>
            <a href="#">Support Ticket</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
          <div className="footer-col">
            <h4>Quick</h4>
            <a href="#">FAQ</a>
            <a href="#">Voter Guide</a>
            <a href="#">Announcements</a>
          </div>
        </div>
        <div className="copyright">
          © 2026 BUSA ONLINE VOTING PORTAL. All rights reserved.
        </div>
      </div>
    </>
  );
};

export default ValidationSuccessful;
