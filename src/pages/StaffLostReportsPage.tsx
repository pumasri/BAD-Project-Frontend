import { useState, useMemo, type CSSProperties, type FormEvent } from 'react';
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

  async function handleConfirmMatch(e: FormEvent) {
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
      <section className="dashboard-card staff-lost-page">
        <button
          type="button"
          className="detail-back-button"
          onClick={() => navigate('/staff-dashboard')}
        >
          ‹ Back
        </button>

        <div className="dashboard-header">
          <div>
            <h1>Student Lost Reports</h1>
            <p>Review student reports, contact the owner, and link likely found-item matches.</p>
          </div>
        </div>

        <div className="staff-item-toolbar">
          <div className="staff-item-search">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search lost reports by item name, category, location, or student..."
            />
          </div>
        </div>

        <div className="staff-item-count">
          {lostItems.length}{' '}
          {lostItems.length === 1 ? 'lost report' : 'lost reports'} active
        </div>

        {lostItems.length > 0 ? (
          <div className="staff-lost-grid">
            {lostItems.map((item) => (
              <article key={item.id} className="staff-lost-card">
                <div className="staff-lost-media">
                  <span className="staff-lost-type">LOST · {item.category?.name || 'Unknown'}</span>
                  {item.images && item.images.length > 0 ? (
                    <img src={`${((import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5050/api').replace('/api', '')}/uploads/${item.images[0].objectKey}`} alt={item.title} />
                  ) : (
                    <span className="staff-lost-placeholder">{item.category?.name || 'Item'}</span>
                  )}
                </div>

                <div className="staff-lost-content">
                  <div className="staff-lost-title-row">
                    <h3>{item.title}</h3>
                    <span className={`status-badge status-${item.status.toLowerCase()}`}>
                      {formatStatus(item.status)}
                    </span>
                  </div>
                  <p className="staff-lost-description">{item.description}</p>
                  <dl className="staff-lost-meta">
                    <div><dt>Reporter</dt><dd>{item.createdBy?.fullName || 'Unknown'}</dd></div>
                    <div><dt>Lost Date</dt><dd>{new Date(item.occurredAt).toLocaleDateString()}</dd></div>
                    <div><dt>Location</dt><dd>{item.location}</dd></div>
                    <div><dt>Email</dt><dd>{item.createdBy?.universityEmail || 'Not provided'}</dd></div>
                  </dl>

                  <label className="staff-lost-status-field">
                    <span>Report Status</span>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as ItemStatus)}
                    >
                      <option value="OPEN">Open (Missing)</option>
                      <option value="MATCHED">Matched</option>
                      <option value="RESOLVED">Resolved (Returned)</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </label>
                  <div className="staff-lost-actions">
                    <button
                      type="button"
                      className="staff-view-button"
                      onClick={() => handleEmailStudent(item)}
                    >
                      Contact Student
                    </button>

                    {item.status !== 'RESOLVED' && (
                      <button
                        type="button"
                        className="staff-view-button"
                        onClick={() => {
                          setMatchingItem(item);
                          setSelectedFoundId('');
                        }}
                      >
                        Link &amp; Match
                      </button>
                    )}
                  </div>
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
        <div className="staff-lost-modal-backdrop">
          <div className="staff-lost-modal">
            <h2>Link &amp; Match Lost Item</h2>
            <p>
              Select a matching turned-in <strong>FOUND</strong> item to link with <strong>{matchingItem.title}</strong>. This will set both items to <strong>MATCHED</strong>.
            </p>

            <form onSubmit={handleConfirmMatch}>
              <label className="field">
                <span>Select Matching Found Item</span>
                <select
                  required
                  value={selectedFoundId}
                  onChange={(e) => setSelectedFoundId(e.target.value)}
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
                <p className="staff-lost-modal-error">
                  No available FOUND items in the system to link with.
                </p>
              )}

              <div className="staff-lost-modal-actions">
                <button
                  type="button"
                  onClick={() => setMatchingItem(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isMatchingLoading || !selectedFoundId}
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
