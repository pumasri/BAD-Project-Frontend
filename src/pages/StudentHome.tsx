import { CSSProperties, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { campusImage, api } from '../utils';



import type { StudentClaim, Item } from '../types';

export function StudentHome({ onLogout, claims, items }: { onLogout: () => void, claims: StudentClaim[], items: Item[] }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Student');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

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
          <div>
            <p className="eyebrow">STUDENT PORTAL</p>
            <h1>Welcome back, {userName.split(' ')[0]}</h1>
            <p className="student-header-description">
              Find lost items, report something you lost, and manage your
              claims.
            </p>
          </div>

          <button
            type="button"
            className="dashboard-logout"
            onClick={onLogout}
          >
            Log out
          </button>
        </header>

        {/* Quick Actions */}
        <section className="student-section">
          <div className="student-section-heading">
            <div>
              <p className="eyebrow">QUICK ACTIONS</p>
              <h2>What would you like to do?</h2>
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
                  Browse recently reported lost and found items around
                  campus.
                </p>
              </div>

              <span className="action-arrow">→</span>
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
                  Tell us what you lost so we can help find a possible
                  match.
                </p>
              </div>

              <span className="action-arrow">→</span>
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
                  Check the status of your submitted ownership claims.
                </p>
              </div>

              <span className="action-arrow">→</span>
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
              <h2>Recent claims</h2>
            </div>

            <button
              type="button"
              className="student-section-link"
              onClick={() => navigate('/student-claims')}
            >
              View all →
            </button>
          </div>

          <div className="student-claims-list">
            {claims.map((claim) => (
              <button
                type="button"
                key={claim.id}
                className="student-claim-card"
                onClick={() => navigate(`/student-claims/${claim.id}`)}
              >
                <div className="student-claim-icon" style={{ borderRadius: '50%', overflow: 'hidden' }}>
                  {claim.foundReport?.images && claim.foundReport.images.length > 0 ? (
                    <img
                      src={`${((import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5050/api').replace('/api', '')}/uploads/${claim.foundReport.images[0].objectKey}`}
                      alt={claim.foundReport.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    "◈"
                  )}
                </div>

                <div className="student-claim-content">
                  <span>{claim.foundReport?.category?.name}</span>
                  <strong>{claim.foundReport?.title}</strong>
                  <p>Submitted {new Date(claim.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="student-claim-status">
                  <span
                    className={
                      claim.status === "MORE_INFORMATION_REQUIRED"
                        ? 'status-badge status-match'
                        : 'status-badge status-review'
                    }
                  >
                    {claim.status}
                  </span>

                  <span className="action-arrow">→</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* My Lost Reports */}
        <section className="student-section">
          <div className="student-section-heading">
            <div>
              <p className="eyebrow">MY LOST REPORTS</p>
              <h2>Items I reported lost</h2>
            </div>
          </div>

          <div className="student-claims-list">
            {items.filter(item => item.reportType === 'LOST' && item.createdBy?.id === userId).length > 0 ? (
              items.filter(item => item.reportType === 'LOST' && item.createdBy?.id === userId).map((item) => (
                <div key={item.id} className="student-claim-card" style={{ cursor: 'default', background: 'rgba(255, 255, 255, 0.5)' }}>
                  <div className="student-claim-icon" style={{ borderRadius: '12px', overflow: 'hidden', background: 'rgba(217, 48, 37, 0.1)', color: '#d93025' }}>
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={`${((import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5050/api').replace('/api', '')}/uploads/${item.images[0].objectKey}`}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      "?"
                    )}
                  </div>

                  <div className="student-claim-content" style={{ flex: 1 }}>
                    <span>{item.category?.name}</span>
                    <strong style={{ display: 'block', margin: '4px 0', fontSize: '1.1rem' }}>{item.title}</strong>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>📍 {item.location} | Reported {new Date(item.occurredAt).toLocaleDateString()}</p>
                  </div>

                  <div className="student-claim-status">
                    <span className="status-badge status-review">
                      {item.status}
                    </span>
                  </div>
                </div>
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
              Browse all →
            </button>
          </div>

          <div className="student-items-grid">
            {items.filter(item => item.reportType === 'FOUND').slice(0, 3).map((item) => (
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
                  ) : (
                    <span>{item.category?.name}</span>
                  )}
                </div>

                <div className="student-mini-item-content">
                  <span>{item.category?.name}</span>
                  <strong>{item.title}</strong>
                  <p>📍 {item.location}</p>
                  <small>{new Date(item.occurredAt).toLocaleDateString()}</small>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Profile */}
        <section className="student-profile-card">
          <div className="student-profile-avatar">{userName[0]?.toUpperCase() || 'S'}</div>

          <div className="student-profile-info">
            <p className="eyebrow">MY ACCOUNT</p>
            <h2>{userName}</h2>
            <p>{userEmail || 'uXXXXXXXX@au.edu'}</p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate('/student-profile')}
          >
            View Profile
          </button>
        </section>
      </section>
    </main>
  );
}
