import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Item } from '../types';
import { campusImage } from '../utils';
import { LogoutButton } from '../components/LogoutButton';

export function StaffDashboard({
  items,
  onLogout,
}: {
  items: Item[];
  onLogout: () => void | Promise<void>;
}) {
  const navigate = useNavigate();
  const recentItems = items.filter((item) => item.reportType === 'FOUND').slice(0, 3);

  return (
    <main
      className="page-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >
      <section className="dashboard-card">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">STAFF PORTAL</p>
            <h1>Staff Dashboard</h1>
            <p>
              Manage found items and help return them to their owners.
            </p>
          </div>

          <div className="dashboard-header-actions">
            <button
              type="button"
              className="dashboard-logout"
              onClick={() => navigate('/staff-profile')}
            >
              Profile
            </button>
            <LogoutButton onLogout={onLogout} />
          </div>
        </div>

        <div className="dashboard-grid">
          <button
            type="button"
            className="dashboard-action-card"
            onClick={() => navigate('/staff/report-item')}
          >
            <span className="dashboard-icon">+</span>
            <strong>Report Found Item</strong>
            <p>
              Add a newly found item to the Lost &amp; Found system.
            </p>
          </button>

          <button
            type="button"
            className="dashboard-action-card"
            onClick={() => navigate('/staff/items')}
          >
            <span className="dashboard-icon">◷</span>
            <strong>Manage Items</strong>
            <p>Review and manage reported found items.</p>
          </button>

          <button
            type="button"
            className="dashboard-action-card"
            onClick={() => navigate('/staff/claims')}
          >
            <span className="dashboard-icon">✓</span>
            <strong>Claims</strong>
            <p>Review student ownership claims.</p>
          </button>

          <button
            type="button"
            className="dashboard-action-card"
            onClick={() => navigate('/staff/lost-reports')}
          >
            <span className="dashboard-icon">?</span>
            <strong>Lost Reports</strong>
            <p>Review items reported lost by students.</p>
          </button>

        </div>

        <div className="staff-recent-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">STAFF ACTIVITY</p>
              <h2>Recently Reported Items</h2>
            </div>
          </div>

          {recentItems.length > 0 ? (
            <div className="staff-recent-list">
              {recentItems.map((item) => (
                <div key={item.id} className="staff-recent-item">
                  <div className="staff-recent-image">
                    {item.images && item.images.length > 0 ? (
                      <img src={`${((import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5050/api').replace('/api', '')}/uploads/${item.images[0].objectKey}`} alt={item.title} />
                    ) : (
                      <span>{item.category?.name}</span>
                    )}
                  </div>

                  <div className="staff-recent-info">
                    <span className="item-category">
                      {item.category?.name}
                    </span>
                    <h3>{item.title}</h3>
                    <p>📍 {item.location}</p>
                  </div>

                  <button
                    type="button"
                    className="staff-view-button"
                    onClick={() => navigate(`/staff/items/${item.id}`)}
                  >
                    Manage
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="staff-empty-state">
              <p>No items have been reported yet.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
