import { CSSProperties, FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Item, Role } from '../types';
import { campusImage } from '../utils';

export function HomePage({ items, role, onLogout }: { items: Item[]; role?: Role | null; onLogout?: () => void }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const [dateFilter, setDateFilter] = useState('7');

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    
    const now = Date.now();
    let timeFiltered = items.filter((item) => item.reportType === 'FOUND');
    
    if (dateFilter === '7') {
      timeFiltered = timeFiltered.filter(item => now - new Date(item.occurredAt).getTime() <= 7 * 24 * 60 * 60 * 1000);
    } else if (dateFilter === '30') {
      timeFiltered = timeFiltered.filter(item => now - new Date(item.occurredAt).getTime() <= 30 * 24 * 60 * 60 * 1000);
    }

    if (!query) {
      return timeFiltered;
    }

    return timeFiltered.filter((item) =>
      [
        item.title,
        item.category?.name || '',
        item.location,
        item.description,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [items, search, dateFilter]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main
      className="page-shell home-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >
      <section className="home-card">
        <header className="home-header">
          <div className="home-title-area">
            <p className="eyebrow">CAMPUS LOST &amp; FOUND</p>
            <h1>Find what you lost.</h1>
            <p className="home-description">
              Browse recently reported items around campus. You can view item details without logging in.
            </p>
          </div>

          <div className="home-auth-links">
            {role ? (
              <>
                <button
                  type="button"
                  className="header-link"
                  onClick={() => navigate(role === 'student' ? '/student-home' : role === 'staff' ? '/staff-dashboard' : '/admin-dashboard')}
                >
                  Go to Dashboard
                </button>
                <button
                  type="button"
                  className="header-link"
                  onClick={() => {
                    if (onLogout) onLogout();
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="header-link"
                  onClick={() => navigate('/student-login')}
                >
                  Student Login
                </button>
                <button
                  type="button"
                  className="header-link"
                  onClick={() => navigate('/staff-login')}
                >
                  Staff Login
                </button>
              </>
            )}
          </div>
        </header>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by item, category, or location..."
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        <section className="items-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">RECENTLY REPORTED</p>
              <h2>Lost Items</h2>
            </div>
            <select 
              className="sort-button" 
              style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', cursor: 'pointer' }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="7">Latest 7 days</option>
              <option value="30">Latest 30 days</option>
              <option value="ALL">All items</option>
            </select>
          </div>

          {filteredItems.length > 0 ? (
            <div className="items-grid">
              {filteredItems.map((item) => (
                <article 
                  key={item.id} 
                  className="item-card" 
                  onClick={() => navigate(`/item/${item.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="item-card-image">
                    {item.images && item.images.length > 0 ? (
                      <img src={`${(import.meta as any).env.VITE_API_URL || 'http://localhost:5050'}/uploads/${item.images[0].objectKey}`} alt={item.title} />
                    ) : (
                      <span>{item.category?.name}</span>
                    )}
                  </div>

                  <div className="item-card-content">
                    <h3 style={{ marginBottom: '4px' }}>{item.title}</h3>
                    <p className="item-category" style={{ margin: '0 0 12px 0', color: '#918477', fontSize: '0.9rem' }}>
                      {item.category?.name || 'Uncategorized'} &middot; {item.location}
                    </p>

                    <div className="item-info" style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.05)', color: '#594a3a', fontSize: '0.9rem', fontWeight: 500 }}>
                      <span>{item.reportType === 'FOUND' ? 'Found' : 'Lost'} &middot; {new Date(item.occurredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-items">
              <h3>No items found</h3>
              <p>Try searching for another item, category, or location.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
