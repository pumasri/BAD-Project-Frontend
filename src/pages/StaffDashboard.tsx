import { CSSProperties } from 'react';
import { ClipboardCheck, FileQuestion, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Item } from '../types';
import { campusImage, uploadUrl } from '../utils';
import { StaffTopNav } from '../components/StaffTopNav';

export function StaffDashboard({
  items,
}: {
  items: Item[];
}) {
  const navigate = useNavigate();
  const recentItems = items.filter((item) => item.reportType === 'FOUND').slice(0, 3);
  const foundItems = items.filter((item) => item.reportType === 'FOUND');
  const lostReports = items.filter((item) => item.reportType === 'LOST');
  const activeFoundItems = foundItems.filter((item) => item.status !== 'RESOLVED').length;
  
  return (
    <main
      className="page-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >
      <section className="dashboard-card staff-dashboard-card">
        <StaffTopNav />
        <div className="dashboard-header staff-dashboard-header">
          <div>
            <h1>Staff Dashboard</h1>
            <p>
              Review new reports, confirm matches, and keep item recovery moving.
            </p>
          </div>

        </div>

        <div className="staff-metric-grid">
          <div className="staff-metric-card">
            <Inbox aria-hidden="true" />
            <span>Active Found</span>
            <strong>{activeFoundItems}</strong>
          </div>
          <div className="staff-metric-card">
            <FileQuestion aria-hidden="true" />
            <span>Lost Reports</span>
            <strong>{lostReports.length}</strong>
          </div>
          <div className="staff-metric-card">
            <ClipboardCheck aria-hidden="true" />
            <span>Total Found</span>
            <strong>{foundItems.length}</strong>
          </div>
        </div>

        <div className="staff-recent-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">RECENT REPORTS</p>
              <h2>Recently Reported Items</h2>
            </div>
          </div>

          {recentItems.length > 0 ? (
            <div className="staff-recent-list">
              {recentItems.map((item) => (
                <div key={item.id} className="staff-recent-item">
                  <div className="staff-recent-image">
                    {item.images?.[0] ? (
                      <img src={uploadUrl(item.images[0].objectKey)} alt={item.title} />
                    ) : (
                      <Inbox size={38} strokeWidth={1.5} aria-hidden="true" />
                    )}
                    <span>{item.category?.name || 'Uncategorized'}</span>
                  </div>

                  <div className="staff-recent-info">
                    <h3>{item.title}</h3>
                    <p>📍 {item.location}</p>
                    <small>{new Date(item.occurredAt).toLocaleDateString()}</small>
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
