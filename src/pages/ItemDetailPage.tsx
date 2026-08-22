import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Item } from '../types';
import { campusImage } from '../utils';

export function ItemDetailPage({ items }: { items: Item[] }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const item = items.find((candidate) => candidate.id === Number(id));

  if (!item) {
    return (
      <main className="page-shell">
        <section className="detail-card">
          <h1>Item not found</h1>
          <button type="button" className="detail-back-button" onClick={() => navigate('/')}>
            ← Back to Lost &amp; Found
          </button>
        </section>
      </main>
    );
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
          onClick={() => navigate('/')}
        >
          ← Back to Lost &amp; Found
        </button>

        <div className="detail-layout">
          <div className="detail-image">
            {item.image ? (
              <img src={item.image} alt={item.name} />
            ) : null}
            <span>{item.category}</span>
          </div>

          <div className="detail-content">
            <p className="eyebrow">FOUND ITEM</p>
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

            <button
              type="button"
              className="claim-button"
              onClick={() => setShowLoginMessage(true)}
            >
              Claim This Item
            </button>

            {showLoginMessage && (
              <div className="claim-login-message">
                <strong>Login required</strong>
                <p>
                  Please log in as a student to submit an ownership claim.
                </p>
                <button
                  type="button"
                  className="claim-login-button"
                  onClick={() => navigate('/login')}
                >
                  Student Login
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
