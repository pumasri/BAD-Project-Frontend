import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { campusImage } from '../utils';



import type { StudentClaim } from '../types';

const mockRecentItems = [
  {
    id: 1,
    name: 'Black Wallet',
    category: 'Wallet',
    location: 'AU Library',
    date: 'August 18, 2026',
  },
  {
    id: 2,
    name: 'AirPods Case',
    category: 'Electronics',
    location: 'Cafeteria',
    date: 'August 17, 2026',
  },
  {
    id: 3,
    name: 'Student ID Card',
    category: 'ID Card',
    location: 'ABAC Building',
    date: 'August 16, 2026',
  },
];

export function StudentHome({ onLogout, claims }: { onLogout: () => void, claims: StudentClaim[] }) {
  const navigate = useNavigate();

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
            <h1>Welcome back, Khaimuk</h1>
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
                <div className="student-claim-icon">◈</div>

                <div className="student-claim-content">
                  <span>{claim.category}</span>
                  <strong>{claim.item}</strong>
                  <p>Submitted {claim.date}</p>
                </div>

                <div className="student-claim-status">
                  <span
                    className={
                      claim.status === 'Potential Match'
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
            {mockRecentItems.map((item) => (
              <button
                type="button"
                key={item.id}
                className="student-mini-item"
                onClick={() => navigate(`/item/${item.id}`)}
              >
                <div className="student-mini-item-image">
                  <span>{item.category}</span>
                </div>

                <div className="student-mini-item-content">
                  <span>{item.category}</span>
                  <strong>{item.name}</strong>
                  <p>📍 {item.location}</p>
                  <small>{item.date}</small>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Profile */}
        <section className="student-profile-card">
          <div className="student-profile-avatar">K</div>

          <div className="student-profile-info">
            <p className="eyebrow">MY ACCOUNT</p>
            <h2>Khaimuk Pumasri</h2>
            <p>uXXXXXXXX@au.edu</p>
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
