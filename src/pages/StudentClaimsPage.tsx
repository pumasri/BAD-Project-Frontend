import { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import type { StudentClaim } from '../types';
import { campusImage } from '../utils';

export function StudentClaimsPage({ claims }: { claims: StudentClaim[] }) {
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
      <section className="dashboard-card">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">STUDENT PORTAL</p>
            <h1>My Claims</h1>
            <p>Track the status of your reported lost items.</p>
          </div>
          <button
            type="button"
            className="dashboard-logout"
            onClick={() => navigate('/student-home')}
          >
            Back to Home
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button className="sort-button" style={{ background: '#a35d3f', color: 'white', borderColor: '#a35d3f' }}>All</button>
          <button className="sort-button">Pending</button>
          <button className="sort-button">Matched</button>
          <button className="sort-button">Resolved</button>
        </div>

        {claims.length > 0 ? (
          <div className="student-claims-list">
            {claims.map((claim) => (
              <button
                type="button"
                key={claim.id}
                className="student-claim-card"
                onClick={() => navigate(`/student-claims/${claim.id}`)}
                style={{ width: '100%', textAlign: 'left', background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(93, 82, 64, 0.1)', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}
              >
                <div style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', overflow: 'hidden', background: 'rgba(163, 93, 63, 0.1)', color: '#a35d3f', fontWeight: 'bold' }}>
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
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.85rem', color: '#a35d3f', fontWeight: 'bold', textTransform: 'uppercase' }}>{claim.foundReport?.category?.name || 'Unknown Category'}</span>
                  <strong style={{ display: 'block', fontSize: '1.2rem', color: '#594a3a', margin: '4px 0' }}>{claim.foundReport?.title || 'Unknown Item'}</strong>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#918477' }}>Submitted {new Date(claim.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span className={`status-badge ${claim.status === 'APPROVED' ? 'status-resolved' : claim.status === 'REJECTED' ? 'status-open' : 'status-matched'}`}>
                    {claim.status}
                  </span>
                  <span style={{ color: '#a35d3f', fontSize: '0.9rem', fontWeight: 'bold' }}>View →</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-items" style={{ padding: '40px 20px' }}>
            <h3>No claims found</h3>
            <p>You haven't reported any lost items yet.</p>
          </div>
        )}
      </section>
    </main>
  );
}
