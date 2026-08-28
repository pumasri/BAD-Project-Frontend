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
  const item = items.find((currentItem) => currentItem.id === id);

  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [location, setLocation] = useState(item?.location || '');
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
      title,
      description,
      location,
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
            {item.images && item.images.length > 0 ? (
              <img src={`${(import.meta as any).env.VITE_API_URL || 'http://localhost:5050'}/uploads/${item.images[0].objectKey}`} alt={item.title} />
            ) : (
              <span>{item.category?.name}</span>
            )}
          </div>

          <div className="detail-content">
            <p className="eyebrow">STAFF ITEM MANAGEMENT</p>
            
            <div style={{ marginBottom: '24px' }}>
              <label className="field">
                <span>Item Name</span>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1.5rem', fontWeight: 'bold' }}
                />
              </label>
            </div>

            <div className="detail-info-list">
              <div>
                <span>Category</span>
                <strong style={{ display: 'block', padding: '12px 0' }}>{item?.category?.name}</strong>
              </div>
              <div>
                <span>Location</span>
                <input 
                  type="text" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}
                />
              </div>
              <div>
                <span>Reported</span>
                <strong style={{ display: 'block', padding: '12px 0' }}>
                  {new Date(item?.occurredAt as string).toLocaleDateString()}
                </strong>
              </div>
            </div>

            <div className="detail-description" style={{ marginBottom: '24px' }}>
              <label className="field">
                <span>Description</span>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows={4}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontFamily: 'inherit' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="field">
                <span>Item Status</span>
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as ItemStatus)
                  }
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}
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
            </div>

            <button
              type="button"
              className="claim-button"
              onClick={saveChanges}
              style={{ width: '100%' }}
            >
              Save Changes
            </button>

            {message && <p className="form-status" style={{ marginTop: '16px', color: '#2b7a78', fontWeight: 'bold' }}>{message}</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
