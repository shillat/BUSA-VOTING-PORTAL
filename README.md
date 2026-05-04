# BUSA Online Voting Portal

A comprehensive online voting system for Bugema University Students Association (BUSA) elections built with JavaScript.

## System Overview

This voting system provides a complete solution for managing university elections with:
- Voter registration and validation
- Admin dashboard for election management
- Real-time voting and results
- Security logging and audit trails
- Mobile-responsive frontend

## Architecture

### Frontend (React + HTML/CSS/JS)
- **Location**: `frontend/`
- **Technologies**: React, Vite, CSS, JavaScript
- **Pages**: 22 HTML pages covering all voting system functionality
- **API Integration**: `frontend/src/api.js` for backend communication

### Backend (Node.js + Express + SQLite)
- **Location**: `backend/`
- **Technologies**: Node.js, Express, SQLite3, JWT, Multer
- **Database**: SQLite with comprehensive schema
- **Features**: RESTful APIs, authentication, file uploads, security logging

## Database Schema

The system uses SQLite with the following tables:

- **students_master**: Student information and eligibility
- **voter_registrations**: Voter registration status and credentials
- **admin_users**: Administrator accounts and roles
- **elections**: Election management and scheduling
- **candidates**: Candidate information and positions
- **votes**: Voting records and audit trail
- **security_logs**: Security event logging

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/voter/login` - Voter login

### Voter Registration
- `POST /api/register` - Register new voter
- `GET /api/admin/verify` - Get pending registrations (admin)
- `POST /api/admin/approve/:id` - Approve registration (admin)
- `POST /api/admin/reject/:id` - Reject registration (admin)

### Election Management
- `POST /api/elections` - Create election (admin)
- `GET /api/elections` - Get all elections
- `GET /api/elections/active` - Get active elections
- `PUT /api/elections/:id/status` - Update election status (admin)

### Candidate Management
- `POST /api/elections/:id/candidates` - Add candidate (admin)
- `GET /api/elections/:id/candidates` - Get election candidates
- `PUT /api/candidates/:id` - Update candidate (admin)
- `DELETE /api/candidates/:id` - Delete candidate (admin)

### Voting
- `POST /api/vote` - Cast vote (authenticated)
- `GET /api/elections/:id/results` - Get election results
- `GET /api/elections/:id/live-tally` - Get live results

### Admin Functions
- `GET /api/admin/voters` - Get all voters (admin)
- `GET /api/admin/voter-stats` - Get voter statistics (admin)
- `GET /api/admin/security-logs` - Get security logs (admin)
- `POST /api/admin/announcements` - Create announcement (admin)

### Public
- `GET /api/announcements` - Get public announcements

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Initialize database:
```bash
npm run setup-db
```

4. Start the backend server:
```bash
npm start
# or for development:
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Default Credentials

### Admin Account
- **Admin ID**: `admin`
- **Password**: `admin123`

### Test Student Accounts
The database is pre-populated with test student accounts:
- **Regular Student**: `22/U/1234` (Alice Regular)
- **In-Service Campus**: `21/IN/9012` (Charlie InService Campus)
- **In-Service Remote**: `24/IN/1111` (Eve InService Remote)

Default password for all test accounts: `password123`

## Features

### Voter Registration
- Automatic approval for regular students registered for current semester
- Manual approval for in-service students with evidence upload
- Email notifications (mock implementation)
- Registration number validation

### Election Management
- Create and schedule elections
- Manage candidate positions and information
- Real-time election status updates
- Comprehensive election analytics

### Voting System
- Secure authenticated voting
- One-vote-per-election enforcement
- Real-time results and live tally
- IP address logging for audit trails

### Security Features
- JWT-based authentication
- Security event logging
- IP address tracking
- Audit trail for all actions
- Role-based access control

### Admin Dashboard
- Voter registration management
- Election creation and management
- Candidate management
- Security log monitoring
- Voter statistics and analytics

## Frontend Integration

The `frontend/src/api.js` file provides a comprehensive API client for frontend integration:

```javascript
import { authAPI, electionAPI, votingAPI } from './api.js';

// Admin login
await authAPI.adminLogin('admin', 'admin123');

// Get active elections
const elections = await electionAPI.getActive();

// Cast vote
await votingAPI.castVote(electionId, candidateId);
```

## Security Considerations

- All sensitive operations require authentication
- Passwords are hashed using bcrypt
- JWT tokens expire after 24 hours
- All voting actions are logged
- File uploads are limited to 2MB
- SQL injection protection through parameterized queries

## Development Notes

### Database Schema Updates
To update the database schema:
1. Modify `backend/setupDb.js`
2. Run `npm run setup-db` to reinitialize the database

### Adding New API Endpoints
1. Add the route in `backend/server.js`
2. Implement the business logic
3. Add corresponding methods in `frontend/src/api.js`
4. Update authentication if needed

### Frontend Pages
The system includes 22 HTML pages for complete functionality:
- Voter registration and login
- Admin dashboard and management
- Election creation and management
- Voting interface and results
- Security and audit pages

## Production Deployment

For production deployment:

1. **Environment Variables**:
   - Set `JWT_SECRET` to a secure random string
   - Configure database path appropriately
   - Set up proper CORS origins

2. **Database**:
   - Consider migrating to PostgreSQL or MySQL for production
   - Set up regular backups
   - Configure connection pooling

3. **Security**:
   - Enable HTTPS
   - Set up rate limiting
   - Configure proper file upload handling
   - Set up monitoring and alerting

## Support

For issues and support:
- Check the API documentation in the code
- Review the frontend integration examples
- Test with the provided demo accounts
- Check security logs for troubleshooting

## License

© 2026 BUSA ONLINE VOTING PORTAL. All rights reserved.
