import { useNavigate } from 'react-router-dom';
import type { StudentClaim } from '../types';

export function StaffClaimsPage({ claims }: { claims: StudentClaim[] }) {
  const navigate = useNavigate();

  return (
    <main className="page-shell">
      <section className="dashboard-card">
        <div className="dashboard-header">
          <div>
            <h1>Student Claims</h1>
            <p>Review ownership claims submitted by students.</p>
          </div>

          <button
            type="button"
            className="dashboard-logout"
            onClick={() => navigate('/staff-dashboard')}
          >
            ‹ Back
          </button>
        </div>

        <div className="staff-item-toolbar">
          <div className="staff-item-search">
            <input type="text" placeholder="Search claims..." />
          </div>
          <select className="staff-status-filter">
            <option value="ALL">All Statuses</option>
            <option value="Under Review">Under Review</option>
            <option value="Potential Match">Potential Match</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <p className="staff-item-count">Showing {claims.length} claim(s)</p>

        {claims.length > 0 ? (
          <div className="staff-items-list">
            {claims.map((claim) => (
              <div key={claim.id} className="staff-item-row">
                <div className="staff-item-thumbnail">
                  <span>{claim.foundReport?.category?.name || "Unknown"}</span>
                </div>

                <div className="staff-item-main">
                  <h3>{claim.foundReport?.title || 'Unknown Item'}</h3>
                  <p>Category: {claim.foundReport?.category?.name || 'Unknown Category'}</p>
                  <small>Submitted: {new Date(claim.createdAt).toLocaleDateString()}</small>
                </div>

                <div className="staff-item-status">
                  <span
                    className={
                      claim.status === 'APPROVED'
                        ? 'status-badge status-resolved'
                        : claim.status === 'REJECTED'
                        ? 'status-badge status-open'
                        : 'status-badge status-matched'
                    }
                  >
                    {claim.status}
                  </span>
                </div>

                <button
                  type="button"
                  className="staff-manage-button"
                  onClick={() => navigate(`/staff/claims/${claim.id}`)}
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="staff-empty-state">
            <h3>No claims</h3>
            <p>There are currently no active claims from students.</p>
          </div>
        )}
      </section>
    </main>
  );
}
