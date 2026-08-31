import { CSSProperties, useState, useEffect } from 'react';
import { UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { campusImage, api } from '../utils';
import lostAndFoundLogo from '../assets/images/l-and-f-logo-transparent.png';

import type { StudentClaim, Item } from '../types';

const DASHBOARD_CARD_LIMIT = 12;

export function StudentHome({ onLogout, claims, items }: { onLogout: () => void, claims: StudentClaim[], items: Item[] }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Student');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Close dropdown if clicked outside (simple effect)
  useEffect(() => {
    const handleClick = () => setIsProfileOpen(false);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);
  useEffect(() => {
    api.get('/auth/me')
      .then(res => {
        if (res?.user) {
          setUserName(res.user.name || 'Student');
          setUserEmail(res.user.email || '');
          setUserId(res.user.id || null);
        }
      })
      .catch(console.error);
  }, []);

  const formatStatus = (status: string) => {
    if (!status) return '';
    switch(status) {
      case 'APPROVED': return 'Approved';
      case 'MORE_INFORMATION_REQUIRED': return 'More Information Required';
      case 'OPEN': return 'Open';
      case 'MATCHED': return 'Matched';
      case 'CLAIM_IN_PROGRESS': return 'Claim In Progress';
      case 'RESOLVED': return 'Resolved';
      case 'DONATED': return 'Donated';
      case 'DISPOSED': return 'Disposed';
      case 'ARCHIVED': return 'Archived';
      default:
        return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  };

  const myLostItems = items.filter(item => item.reportType === 'LOST' && item.createdBy?.id === userId);
  const recentFoundItems = items.filter(item => item.reportType === 'FOUND');

  return (
    <main
      className="page-shell student-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >
      <section className="student-dashboard">
        {/* Header */}
        <header className="student-header">
          <div className="student-header-copy">
            <div className="student-portal-brand" aria-label="AU Lost and Found">
              <span><img src={lostAndFoundLogo} alt="" /></span>
            </div>
          </div>

          <div className="student-profile-dropdown-container" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="student-profile-avatar-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              title="My Account"
            >
              <UserRound size={20} aria-hidden="true" />
              <span>My Account</span>
            </button>

            {isProfileOpen && (
              <div className="student-profile-dropdown">
                <div className="student-profile-info">
                  <p className="eyebrow">MY ACCOUNT</p>
                  <h2>{userName}</h2>
                  <p>{userEmail || 'uXXXXXXXX@au.edu'}</p>
                </div>
                
                <div className="student-profile-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      navigate('/student-profile');
                      setIsProfileOpen(false);
                    }}
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    className="dashboard-logout dropdown-logout"
                    onClick={onLogout}
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Quick Actions */}
        <section className="student-section">
          <div className="student-section-heading">
            <div>
              <p className="eyebrow">QUICK ACTIONS</p>
              <h2>Quick actions</h2>
            </div>
          </div>

          <div className="student-action-grid">
            <button
              type="button"
              className="student-action-card primary"
              onClick={() => navigate('/student-find-item')}
            >
              <div className="student-action-icon">⌕</div>

              <div>
                <strong>Find an Item</strong>
                <p>
                  Browse campus reports.
                </p>
              </div>

              <span className="action-arrow" aria-hidden="true">›</span>
            </button>

            <button
              type="button"
              className="student-action-card"
              onClick={() => navigate('/student-report-lost')}
            >
              <div className="student-action-icon">+</div>

              <div>
                <strong>Report Lost Item</strong>
                <p>
                  Add a lost item report.
                </p>
              </div>

              <span className="action-arrow" aria-hidden="true">›</span>
            </button>

            <button
              type="button"
              className="student-action-card"
              onClick={() => navigate('/student-claims')}
            >
              <div className="student-action-icon">✓</div>

              <div>
                <strong>My Claims</strong>
                <p>
                  View claim status.
                </p>
              </div>

              <span className="action-arrow" aria-hidden="true">›</span>
            </button>
          </div>
        </section>

        {/* Overview */}
        <section className="student-section">
          <div className="student-section-heading">
            <div>
              <p className="eyebrow">OVERVIEW</p>
              <h2>Your activity</h2>
            </div>
          </div>

          <div className="student-stat-grid">
            <div className="student-stat-card">
              <span className="student-stat-label">Active Claims</span>
              <strong>{claims.length}</strong>
              <p>Claims currently being reviewed</p>
            </div>

            <div className="student-stat-card">
              <span className="student-stat-label">Potential Matches</span>
              <strong>1</strong>
              <p>Items that may belong to you</p>
            </div>

            <div className="student-stat-card">
              <span className="student-stat-label">Returned Items</span>
              <strong>0</strong>
              <p>Items successfully returned</p>
            </div>
          </div>
        </section>

        {/* Claims */}
        <section className="student-section">
          <div className="student-section-heading">
            <div>
              <p className="eyebrow">MY CLAIMS</p>
              <h2>Recent Claims</h2>
            </div>

            <button
              type="button"
              className="student-section-link"
              onClick={() => navigate('/student-claims')}
            >
              View all ›
            </button>
          </div>

          <div className="student-card-grid">
            {claims.slice(0, DASHBOARD_CARD_LIMIT).map((claim) => (
              <article
                key={claim.id}
                className="student-lost-card student-claim-feature-card"
              >
                <div className="student-lost-card-image">
                  {claim.foundReport?.images && claim.foundReport.images.length > 0 ? (
                    <img
                      src={`${((import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5050/api').replace('/api', '')}/uploads/${claim.foundReport.images[0].objectKey}`}
                      alt={claim.foundReport.title}
                    />
                  ) : (
                    "?"
                  )}
                  <span className="student-card-category">
                    {claim.foundReport?.category?.name || 'Uncategorized'}
                  </span>
                  <span
                    className={
                      claim.status === "MORE_INFORMATION_REQUIRED"
                        ? 'status-badge status-match student-card-status'
                        : 'status-badge status-review student-card-status'
                    }
                  >
                    {formatStatus(claim.status)}
                  </span>
                </div>

                <div className="student-lost-card-content">
                  <strong>{claim.foundReport?.title || 'Unknown Item'}</strong>
                  <span>{claim.foundReport?.location || 'Location not specified'}</span>
                  <p>
                    Submitted {new Date(claim.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div className="student-lost-card-footer">
                  <button
                    type="button"
                    className="student-card-view-button"
                    onClick={() => navigate(`/student-claims/${claim.id}`)}
                  >
                    Detail ›
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* My Lost Items */}
        <section className="student-section">
          <div className="student-section-heading">
            <div>
              <p className="eyebrow">MY LOST ITEMS</p>
              <h2>My Lost Items</h2>
            </div>
            {myLostItems.length > DASHBOARD_CARD_LIMIT && (
              <button
                type="button"
                className="student-section-link"
                onClick={() => navigate('/student-report-lost')}
              >
                View all ›
              </button>
            )}
          </div>

          <div className="student-card-grid">
            {myLostItems.length > 0 ? (
              myLostItems.slice(0, DASHBOARD_CARD_LIMIT).map((item) => (
                <article key={item.id} className="student-lost-card">
                  <div className="student-lost-card-image">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={`${((import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5050/api').replace('/api', '')}/uploads/${item.images[0].objectKey}`}
                        alt={item.title}
                      />
                    ) : (
                      "?"
                    )}
                  </div>

                  <div className="student-lost-card-content">
                    <strong>{item.title}</strong>
                    <span>
                      {item.category?.name || 'Uncategorized'} &middot; {item.location}
                    </span>
                    <p>
                      Reported {new Date(item.occurredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="student-lost-card-footer">
                    <button
                      type="button"
                      className="student-card-view-button"
                      onClick={() => navigate(`/student/lost-reports/${item.id}/matches`)}
                    >
                      Detail ›
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p style={{ color: '#918477', fontStyle: 'italic', margin: '8px 0 0 0' }}>You haven't reported any lost items yet.</p>
            )}
          </div>
        </section>

        {/* Recently Reported */}
        <section className="student-section">
          <div className="student-section-heading">
            <div>
              <p className="eyebrow">RECENTLY REPORTED</p>
              <h2>Found around campus</h2>
            </div>

            <button
              type="button"
              className="student-section-link"
              onClick={() => navigate('/student-find-item')}
            >
              Browse all ›
            </button>
          </div>

          <div className="student-items-grid">
            {recentFoundItems.slice(0, DASHBOARD_CARD_LIMIT).map((item) => (
              <button
                type="button"
                key={item.id}
                className="student-mini-item"
                onClick={() => navigate(`/item/${item.id}`)}
              >
                <div className="student-mini-item-image">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={`${((import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5050/api').replace('/api', '')}/uploads/${item.images[0].objectKey}`}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : null}
                  <span>{item.category?.name || 'Uncategorized'}</span>
                </div>

                <div className="student-mini-item-content">
                  <strong>{item.title}</strong>
                  <p>📍 {item.location}</p>
                  <small>{new Date(item.occurredAt).toLocaleDateString()}</small>
                  <span className="student-mini-detail">Detail ›</span>
                </div>
              </button>
            ))}
          </div>
        </section>

      </section>
    </main>
  );
}
