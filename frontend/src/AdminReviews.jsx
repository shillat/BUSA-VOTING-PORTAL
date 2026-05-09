import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Download, MessageSquareText, RefreshCw, Star, UserCheck } from 'lucide-react';
import AdminTopNavbar from './AdminTopNavbar';
import Footer from './Footer';
import { adminAPI, electionAPI, utils } from './api';

const emptyTally = {
  total_votes: 0,
  voters_turned_up: 0,
  registered_voters: 0,
  total_eligible_voters: 0,
  total_voters: 0
};

const csvEscape = (value) => {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
};

const AdminReviews = () => {
  const navigate = useNavigate();
  const [tallyStats, setTallyStats] = useState(emptyTally);
  const [ratingsStats, setRatingsStats] = useState({ total_ratings: 0, average_rating: 0, positive_ratings: 0, negative_ratings: 0 });
  const [ratings, setRatings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeResults, setActiveResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const [globalTally, ratingSummary, allRatings, allReviews, elections] = await Promise.all([
        electionAPI.getGlobalTally(),
        adminAPI.getRatingsStats(),
        adminAPI.getRatings(),
        adminAPI.getReviews(),
        electionAPI.getActive()
      ]);

      const electionTallies = await Promise.all(
        elections.map((election) => electionAPI.getLiveTally(election.id))
      );

      setTallyStats({
        total_votes: globalTally.total_votes || 0,
        voters_turned_up: globalTally.voters_turned_up || 0,
        registered_voters: globalTally.registered_voters || 0,
        total_eligible_voters: globalTally.total_eligible_voters || globalTally.total_voters || 0,
        total_voters: globalTally.total_voters || globalTally.total_eligible_voters || 0
      });
      setRatingsStats(ratingSummary || {});
      setRatings(allRatings || []);
      setReviews(allReviews || []);
      setActiveResults(electionTallies || []);
    } catch (error) {
      utils.showToast(error.message || 'Failed to load reviews report', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const eligibleVoters = tallyStats.total_eligible_voters || tallyStats.total_voters || 0;
  const turnoutRate = eligibleVoters > 0 ? Math.round((tallyStats.voters_turned_up / eligibleVoters) * 100) : 0;
  const registrationRate = eligibleVoters > 0 ? Math.round((tallyStats.registered_voters / eligibleVoters) * 100) : 0;
  const averageRating = Number(ratingsStats.average_rating || 0).toFixed(1);

  const ratingByRegNo = useMemo(() => {
    const map = new Map();
    ratings.forEach((rating) => {
      map.set(rating.voter_reg_no, rating);
    });
    return map;
  }, [ratings]);

  const voterFeedbackRows = useMemo(() => {
    const reviewRows = reviews.map((review) => ({
      regNo: review.voter_reg_no,
      name: review.student_name,
      email: '',
      rating: ratingByRegNo.get(review.voter_reg_no)?.rating || '',
      feedback: ratingByRegNo.get(review.voter_reg_no)?.feedback || '',
      review: review.review_text,
      election: review.election_title || '',
      candidate: review.candidate_name || '',
      createdAt: review.created_at
    }));

    const reviewRegNos = new Set(reviewRows.map((row) => row.regNo));
    const ratingOnlyRows = ratings
      .filter((rating) => !reviewRegNos.has(rating.voter_reg_no))
      .map((rating) => ({
        regNo: rating.voter_reg_no,
        name: rating.student_name,
        email: rating.email,
        rating: rating.rating,
        feedback: rating.feedback,
        review: '',
        election: '',
        candidate: '',
        createdAt: rating.created_at
      }));

    return [...reviewRows, ...ratingOnlyRows].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [ratings, reviews, ratingByRegNo]);

  const downloadReport = () => {
    const lines = [
      ['BUSA Reviews Report'],
      [`Generated`, new Date().toLocaleString()],
      [],
      ['Live Tally Statistics'],
      ['Total ballots cast', tallyStats.total_votes],
      ['Unique voters turned up', tallyStats.voters_turned_up],
      ['Eligible voters', eligibleVoters],
      ['Turnout rate', `${turnoutRate}%`],
      ['Voter IDs issued', tallyStats.registered_voters],
      ['Registration rate', `${registrationRate}%`],
      [],
      ['Ratings Summary'],
      ['Total ratings', ratingsStats.total_ratings || 0],
      ['Average rating', averageRating],
      ['Positive ratings', ratingsStats.positive_ratings || 0],
      ['Negative ratings', ratingsStats.negative_ratings || 0],
      [],
      ['Election Results'],
      ['Election', 'Candidate', 'Position', 'Votes', 'Percentage'],
      ...activeResults.flatMap((item) => (item.results || []).map((candidate) => [
        item.election?.title || '',
        candidate.name || '',
        candidate.position || '',
        candidate.vote_count || 0,
        `${Number(candidate.percentage || 0)}%`
      ])),
      [],
      ['Voter Feedback And Ratings'],
      ['Reg No', 'Student Name', 'Email', 'Rating', 'Rating Feedback', 'Written Review', 'Election', 'Candidate', 'Submitted At'],
      ...voterFeedbackRows.map((row) => [
        row.regNo,
        row.name,
        row.email,
        row.rating,
        row.feedback,
        row.review,
        row.election,
        row.candidate,
        row.createdAt
      ])
    ];

    const csv = lines.map((line) => line.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `busa-reviews-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="portal-container admin-reviews-page">
      <style>{`
        .admin-reviews-page {
          width: 100%;
          max-width: 1280px;
          min-height: 100vh;
          margin: 0 auto;
          background: #F5F8FB;
          font-family: 'Inter', sans-serif;
        }

        .reviews-shell {
          padding: 28px 40px 40px;
        }

        .reviews-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 22px;
        }

        .reviews-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #0B5C79;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .reviews-header h1 {
          margin: 0;
          color: #102033;
          font-size: 30px;
          font-weight: 850;
        }

        .reviews-header p {
          margin: 8px 0 0;
          color: #516173;
          max-width: 720px;
          line-height: 1.55;
          font-size: 14px;
        }

        .reviews-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .reviews-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid #D8E2EC;
          background: #FFFFFF;
          color: #102033;
          min-height: 42px;
          padding: 0 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
        }

        .reviews-btn-primary {
          background: #003B73;
          border-color: #003B73;
          color: #FFFFFF;
        }

        .reviews-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 18px;
        }

        .reviews-stat,
        .reviews-card {
          background: #FFFFFF;
          border: 1px solid #DFE8F1;
          border-radius: 8px;
        }

        .reviews-stat {
          padding: 16px;
        }

        .reviews-stat span {
          color: #607086;
          font-size: 12px;
          font-weight: 750;
        }

        .reviews-stat strong {
          display: block;
          margin-top: 7px;
          color: #12263A;
          font-size: 28px;
          line-height: 1;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: 18px;
          margin-bottom: 18px;
        }

        .reviews-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          border-bottom: 1px solid #E6EDF4;
        }

        .reviews-card-header h2 {
          margin: 0;
          color: #102033;
          font-size: 16px;
          font-weight: 800;
        }

        .reviews-card-body {
          padding: 16px 18px;
        }

        .reviews-table-wrap {
          overflow: auto;
        }

        .reviews-table {
          width: 100%;
          min-width: 760px;
          border-collapse: collapse;
        }

        .reviews-table th {
          background: #F7FAFD;
          color: #4B5F73;
          font-size: 11px;
          font-weight: 850;
          text-align: left;
          text-transform: uppercase;
          padding: 12px 14px;
          border-bottom: 1px solid #DFE8F1;
        }

        .reviews-table td {
          padding: 14px;
          border-bottom: 1px solid #EDF2F7;
          color: #203244;
          font-size: 13px;
          vertical-align: top;
        }

        .review-muted {
          color: #66788A;
          font-size: 12px;
        }

        .rating-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 9px;
          border-radius: 999px;
          background: #FFF4D6;
          color: #8A5A00;
          font-weight: 800;
          white-space: nowrap;
        }

        .candidate-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          padding: 12px 0;
          border-bottom: 1px solid #EDF2F7;
        }

        .candidate-row:last-child {
          border-bottom: none;
        }

        @media (max-width: 920px) {
          .reviews-shell {
            padding: 20px 16px 28px;
          }

          .reviews-header {
            flex-direction: column;
          }

          .reviews-actions {
            justify-content: flex-start;
          }

          .reviews-stats-grid,
          .reviews-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <AdminTopNavbar badgeText="Reviews" />

      <main className="reviews-shell">
        <section className="reviews-header">
          <div>
            <div className="reviews-kicker">
              <MessageSquareText size={16} />
              Reviews report
            </div>
            <h1>Reviews</h1>
            <p>
              A record-keeping page for live tally statistics, election results, voter ratings, and written feedback from the voting portal.
            </p>
          </div>
          <div className="reviews-actions">
            <button className="reviews-btn" onClick={() => navigate('/admin/dashboard')}>Dashboard</button>
            <button className="reviews-btn" onClick={fetchReport} disabled={loading}>
              <RefreshCw size={16} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button className="reviews-btn reviews-btn-primary" onClick={downloadReport}>
              <Download size={16} />
              Download Report
            </button>
          </div>
        </section>

        <section className="reviews-stats-grid">
          <div className="reviews-stat"><span>Ballots Cast</span><strong>{tallyStats.total_votes.toLocaleString()}</strong></div>
          <div className="reviews-stat"><span>Voter Turnout</span><strong>{turnoutRate}%</strong></div>
          <div className="reviews-stat"><span>Eligible Voters</span><strong>{eligibleVoters.toLocaleString()}</strong></div>
          <div className="reviews-stat"><span>Average Rating</span><strong>{averageRating}</strong></div>
        </section>

        <section className="reviews-grid">
          <div className="reviews-card">
            <div className="reviews-card-header">
              <h2>Live Tally Snapshot</h2>
              <BarChart3 size={18} color="#003B73" />
            </div>
            <div className="reviews-card-body">
              <div className="candidate-row">
                <span>Total unique voters who turned up</span>
                <strong>{tallyStats.voters_turned_up.toLocaleString()}</strong>
              </div>
              <div className="candidate-row">
                <span>Approved voter IDs issued</span>
                <strong>{tallyStats.registered_voters.toLocaleString()}</strong>
              </div>
              <div className="candidate-row">
                <span>Registration rate</span>
                <strong>{registrationRate}%</strong>
              </div>
              <div className="candidate-row">
                <span>Total rating submissions</span>
                <strong>{ratingsStats.total_ratings || 0}</strong>
              </div>
              <div className="candidate-row">
                <span>Positive ratings</span>
                <strong>{ratingsStats.positive_ratings || 0}</strong>
              </div>
              <div className="candidate-row">
                <span>Negative ratings</span>
                <strong>{ratingsStats.negative_ratings || 0}</strong>
              </div>
            </div>
          </div>

          <div className="reviews-card">
            <div className="reviews-card-header">
              <h2>Election Results Summary</h2>
              <UserCheck size={18} color="#003B73" />
            </div>
            <div className="reviews-card-body">
              {activeResults.length === 0 ? (
                <div className="review-muted">No active election results available yet.</div>
              ) : (
                activeResults.map((item) => (
                  <div key={item.election?.id || item.election?.title} style={{ marginBottom: '16px' }}>
                    <strong style={{ display: 'block', marginBottom: '8px', color: '#102033' }}>{item.election?.title || 'Election'}</strong>
                    {(item.results || []).map((candidate) => (
                      <div className="candidate-row" key={candidate.id || candidate.candidate_id || candidate.name}>
                        <span>{candidate.name} <span className="review-muted">({candidate.position})</span></span>
                        <strong>{candidate.vote_count || 0} votes</strong>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="reviews-card">
          <div className="reviews-card-header">
            <h2>Feedback And Ratings From Voters</h2>
            <Star size={18} color="#B7791F" />
          </div>
          <div className="reviews-table-wrap">
            <table className="reviews-table">
              <thead>
                <tr>
                  <th>Voter</th>
                  <th>Rating</th>
                  <th>Rating Feedback</th>
                  <th>Written Review</th>
                  <th>Context</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {voterFeedbackRows.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>No ratings or reviews submitted yet.</td>
                  </tr>
                ) : (
                  voterFeedbackRows.map((row, index) => (
                    <tr key={`${row.regNo}-${row.createdAt}-${index}`}>
                      <td>
                        <strong>{row.name || 'Unknown voter'}</strong>
                        <div className="review-muted">{row.regNo}</div>
                        {row.email && <div className="review-muted">{row.email}</div>}
                      </td>
                      <td>{row.rating ? <span className="rating-pill"><Star size={13} /> {row.rating}</span> : '-'}</td>
                      <td>{row.feedback || '-'}</td>
                      <td>{row.review || '-'}</td>
                      <td>
                        {row.election || row.candidate ? (
                          <>
                            <strong>{row.election || 'Election'}</strong>
                            <div className="review-muted">{row.candidate}</div>
                          </>
                        ) : '-'}
                      </td>
                      <td>{row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AdminReviews;
