import { useMemo, useState, type CSSProperties, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Item } from '../types';
import { campusImage } from '../utils';

export function StudentFindItemPage({ items }: { items: Item[] }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) =>
      [
        item.name,
        item.category,
        item.location,
        item.description,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [items, search]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main
      className="page-shell student-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >
      <section className="home-card">
        <header className="home-header">
          <div className="home-title-area">
            <p className="eyebrow">STUDENT PORTAL</p>
            <h1>Find what you lost.</h1>
            <p className="home-description">
              Search and browse recently reported items around campus.
            </p>
          </div>

          <div className="home-auth-links">
            <button
              type="button"
              className="dashboard-logout"
              onClick={() => navigate('/student-home')}
            >
              Back to Dashboard
            </button>
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
            <button type="button" className="sort-button">
              Latest 7 days
            </button>
          </div>

          {filteredItems.length > 0 ? (
            <div className="items-grid">
              {filteredItems.map((item) => (
                <article key={item.id} className="item-card">
                  <div className="item-card-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : null}
                    <span>{item.category}</span>
                  </div>

                  <div className="item-card-content">
                    <p className="item-category">{item.category}</p>
                    <h3>{item.name}</h3>

                    <div className="item-info">
                      <span>📍 {item.location}</span>
                      <span>{item.date}</span>
                    </div>

                    <button
                      type="button"
                      className="view-item-button"
                      onClick={() => navigate(`/item/${item.id}`)}
                    >
                      View Details
                    </button>
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
