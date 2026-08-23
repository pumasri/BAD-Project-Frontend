import { useState, CSSProperties } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Item, ItemStatus } from '../types';
import { campusImage } from '../utils';

export function StaffItemDetailPage({
  items,
  onUpdateItem,
}: {
  items: Item[];
  onUpdateItem: (item: Item) => void;
}) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const item = items.find((currentItem) => currentItem.id === Number(id));

  const [status, setStatus] = useState<ItemStatus>(item?.status || 'OPEN');
  const [message, setMessage] = useState('');

  if (!item) {
    navigate('/staff/items');
    return null;
  }

  function saveChanges() {
    if (!item) return;

    onUpdateItem({
      ...item,
      status,
    });

    setMessage('Item updated successfully.');
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
      <section className="detail-card">
        <button
          type="button"
          className="detail-back-button"
          onClick={() => navigate('/staff/items')}
        >
          ← Back to Manage Items
        </button>

        <div className="detail-layout">
          <div className="detail-image">
            {item.image ? (
              <img src={item.image} alt={item.name} />
            ) : null}
            <span>{item.category}</span>
          </div>

          <div className="detail-content">
            <p className="eyebrow">STAFF ITEM MANAGEMENT</p>
            <h1>{item.name}</h1>

            <div className="detail-info-list">
              <div>
                <span>Category</span>
                <strong>{item.category}</strong>
              </div>
              <div>
                <span>Location</span>
                <strong>{item.location}</strong>
              </div>
              <div>
                <span>Reported</span>
                <strong>{item.date}</strong>
              </div>
            </div>

            <div className="detail-description">
              <h3>Description</h3>
              <p>{item.description}</p>
            </div>

            <label className="field">
              <span>Item Status</span>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as ItemStatus)
                }
              >
                <option value="OPEN">Open</option>
                <option value="MATCHED">Matched</option>
                <option value="CLAIM_IN_PROGRESS">Claim In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="DONATED">Donated</option>
                <option value="DISPOSED">Disposed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </label>

            <button
              type="button"
              className="claim-button"
              onClick={saveChanges}
            >
              Save Changes
            </button>

            {message && <p className="form-status">{message}</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
