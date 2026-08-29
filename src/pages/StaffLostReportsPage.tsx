import { useState, useMemo, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { Item, ItemStatus } from '../types';
import { campusImage, api, formatStatus } from '../utils';

export function StaffLostReportsPage({ items, onUpdate }: { items: Item[]; onUpdate: () => void }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [matchingItem, setMatchingItem] = useState<Item | null>(null);
  const [selectedFoundId, setSelectedFoundId] = useState<string>('');
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);

  const lostItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    const reports = items.filter((item) => item.reportType === 'LOST');

    if (!query) {
      return reports;
    }

    return reports.filter((item) =>
      [
        item.title,
        item.category?.name,
        item.location,
        item.description,
        item.createdBy?.fullName,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [items, search]);

  const availableFoundItems = useMemo(() => {
    return items.filter((item) => item.reportType === 'FOUND' && (item.status === 'OPEN' || item.status === 'CLAIM_IN_PROGRESS'));
  }, [items]);

  async function handleStatusChange(itemId: string, newStatus: ItemStatus) {
    try {
      await api.patch(`/items/${itemId}`, { status: newStatus });
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    }
  }

  async function handleConfirmMatch(e: React.FormEvent) {
    e.preventDefault();
    if (!matchingItem || !selectedFoundId) return;

    setIsMatchingLoading(true);
    try {
      await api.post(`/items/${matchingItem.id}/match`, { foundReportId: selectedFoundId });
      setMatchingItem(null);
      setSelectedFoundId('');
      onUpdate();
    } catch (error) {
      console.error('Error linking match:', error);
      alert('Failed to link match.');
    } finally {
      setIsMatchingLoading(false);
    }
  }

  function handleEmailStudent(item: Item) {
    const studentName = item.createdBy?.fullName || 'Student';
    const studentEmail = item.createdBy?.universityEmail;
    if (!studentEmail) return;

    const subject = encodeURIComponent(`[Lost & Found] Update regarding your lost ${item.title}`);
    const body = encodeURIComponent(
      `Hello ${studentName.split(' ')[0]},\n\n` +
      `We received your lost report for "${item.title}".\n\n` +
      `Please let us know if you have any additional details, or visit the office to check if any matching items have been turned in.\n\n` +
      `Best regards,\n` +
      `Campus Lost & Found Office`
    );

    window.location.href = `mailto:${studentEmail}?subject=${subject}&body=${body}`;
  }

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
        <button
          type="button"
          className="detail-back-button"
          onClick={() => navigate('/staff-dashboard')}
        >
          ← Back to Staff Dashboard
        </button>

        <div className="dashboard-header">
          <div>
            <p className="eyebrow">STAFF PORTAL</p>
            <h1>Student Lost Reports</h1>
            <p>Browse items reported lost by students, change statuses, contact reporters, or match them with found items.</p>
          </div>
        </div>

        <div className="staff-item-toolbar">
          <div className="staff-item-search" style={{ width: '100%' }}>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search lost reports by item name, category, location, or student..."
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div className="staff-item-count">
          {lostItems.length}{' '}
          {lostItems.length === 1 ? 'lost report' : 'lost reports'} active
        </div>

        {lostItems.length > 0 ? (
          <div className="staff-items-list">
            {lostItems.map((item) => (
              <article key={item.id} className="staff-item-row" style={{ alignItems: 'flex-start' }}>
                <div className="staff-item-thumbnail">
                  {item.images && item.images.length > 0 ? (
                    <img src={`${((import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5050/api').replace('/api', '')}/uploads/${item.images[0].objectKey}`} alt={item.title} />
                  ) : (
                    <span>{item.category?.name}</span>
                  )}
                </div>

                <div className="staff-item-main" style={{ flex: 1 }}>
                  <span className="item-category" style={{ background: 'rgba(217, 48, 37, 0.1)', color: '#d93025' }}>LOST • {item.category?.name}</span>
                  <h3 style={{ margin: '8px 0 4px 0' }}>{item.title}</h3>
                  <p style={{ margin: '4px 0', color: '#594a3a' }}><strong>Description:</strong> {item.description}</p>
                  <p style={{ margin: '4px 0' }}>📍 {item.location} | Lost Date: {new Date(item.occurredAt).toLocaleDateString()}</p>
                  <small style={{ color: '#7a6a53', display: 'block', marginTop: '8px' }}>
                    👤 Reported by: <strong>{item.createdBy?.fullName}</strong> ({item.createdBy?.universityEmail})
                  </small>

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="staff-view-button"
                      onClick={() => handleEmailStudent(item)}
                      style={{ background: '#594a3a', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem' }}
                    >
                      ✉ Contact Student
                    </button>

                    {item.status !== 'RESOLVED' && (
                      <button
                        type="button"
                        className="staff-view-button"
                        onClick={() => {
                          setMatchingItem(item);
                          setSelectedFoundId('');
                        }}
                        style={{ background: '#a35d3f', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem' }}
                      >
                        🔗 Link &amp; Match
                      </button>
                    )}

                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as ItemStatus)}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.15)', background: 'white', fontSize: '0.85rem' }}
                    >
                      <option value="OPEN">Open (Missing)</option>
                      <option value="MATCHED">Matched</option>
                      <option value="RESOLVED">Resolved (Returned)</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="staff-item-status">
                  <span className={`status-badge status-${item.status.toLowerCase()}`}>
                    {formatStatus(item.status)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="staff-empty-state">
            <h3>No lost reports found</h3>
            <p>There are no student lost reports matching your search.</p>
          </div>
        )}
      </section>

      {/* Match Linking Modal Overlay */}
      {matchingItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#fcfbf9', padding: '32px', borderRadius: '24px', maxWidth: '500px', width: '100%', border: '1px solid rgba(93, 82, 64, 0.15)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#594a3a', marginBottom: '8px' }}>Link &amp; Match Lost Item</h2>
            <p style={{ color: '#918477', fontSize: '0.9rem', marginBottom: '24px' }}>
              Select a matching turned-in <strong>FOUND</strong> item to link with <strong>{matchingItem.title}</strong>. This will set both items to <strong>MATCHED</strong>.
            </p>

            <form onSubmit={handleConfirmMatch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label className="field">
                <span>Select Matching Found Item</span>
                <select
                  required
                  value={selectedFoundId}
                  onChange={(e) => setSelectedFoundId(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)' }}
                >
                  <option value="">-- Choose Found Item --</option>
                  {availableFoundItems.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.title} (Location: {f.location} | Date: {new Date(f.occurredAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </label>

              {availableFoundItems.length === 0 && (
                <p style={{ color: '#d93025', fontSize: '0.85rem', margin: 0 }}>
                  No available FOUND items in the system to link with.
                </p>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setMatchingItem(null)}
                  style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isMatchingLoading || !selectedFoundId}
                  style={{ flex: 1, padding: '12px', background: '#a35d3f', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {isMatchingLoading ? 'Linking...' : 'Confirm Match'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
