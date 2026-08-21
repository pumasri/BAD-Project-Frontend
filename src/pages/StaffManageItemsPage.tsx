import { useState, useMemo, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { Item, ItemStatus } from '../types';
import { campusImage, formatStatus } from '../utils';

export function StaffManageItemsPage({ items }: { items: Item[] }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ItemStatus>('ALL');

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        [item.name, item.category, item.location, item.description]
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === 'ALL' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

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
            <h1>Manage Items</h1>
            <p>Review and manage all found items reported by staff.</p>
          </div>
        </div>

        <div className="staff-item-toolbar">
          <div className="staff-item-search">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search items..."
            />
          </div>

          <select
            className="staff-status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as 'ALL' | ItemStatus)
            }
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Available</option>
            <option value="MATCHED">Potential Match</option>
            <option value="CLAIM_IN_PROGRESS">Under Review</option>
            <option value="RESOLVED">Returned</option>
            <option value="DONATED">Donated</option>
            <option value="DISPOSED">Disposed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className="staff-item-count">
          {filteredItems.length}{' '}
          {filteredItems.length === 1 ? 'item' : 'items'} found
        </div>

        {filteredItems.length > 0 ? (
          <div className="staff-items-list">
            {filteredItems.map((item) => (
              <article key={item.id} className="staff-item-row">
                <div className="staff-item-thumbnail">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <span>{item.category}</span>
                  )}
                </div>

                <div className="staff-item-main">
                  <span className="item-category">{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>📍 {item.location}</p>
                  <small>Reported {item.date}</small>
                </div>

                <div className="staff-item-status">
                  <span
                    className={`status-badge status-${item.status.toLowerCase()}`}
                  >
                    {formatStatus(item.status)}
                  </span>
                </div>

                <button
                  type="button"
                  className="staff-manage-button"
                  onClick={() => navigate(`/staff/items/${item.id}`)}
                >
                  Manage
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="staff-empty-state">
            <h3>No items found</h3>
            <p>Try changing your search or status filter.</p>
          </div>
        )}
      </section>
    </main>
  );
}
