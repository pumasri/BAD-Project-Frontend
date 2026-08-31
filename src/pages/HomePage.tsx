import { useMemo, useState, type FormEvent } from 'react';
import {
  BadgeCheck, ChevronRight, ClipboardList,
  Menu, PackageSearch, RotateCcw, Search, X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import lostAndFoundLogo from '../assets/images/l-and-f-logo-transparent.png';
import { PublicItemCard } from '../components/PublicItemCard';
import type { Item } from '../types';
import { campusImage, formatStatus } from '../utils';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const itemTimestamp = (item: Item) => new Date(item.reportedAt || item.occurredAt).getTime();

export function HomePage({ items }: { items: Item[] }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [dateRange, setDateRange] = useState('7');
  const [status, setStatus] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const publicItems = useMemo(
    () => items.filter((item) => item.reportType === 'FOUND' && item.isPublic !== false),
    [items],
  );
  const categories = useMemo(
    () => [...new Set(publicItems.map((item) => item.category?.name).filter(Boolean))].sort(),
    [publicItems],
  );
  const locations = useMemo(
    () => [...new Set(publicItems.map((item) => item.location).filter(Boolean))].sort(),
    [publicItems],
  );
  const statuses = useMemo(
    () => [...new Set(publicItems.map((item) => item.status))],
    [publicItems],
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    const days = Number(dateRange);

    return publicItems
      .filter((item) => {
        const searchableText = [item.title, item.category?.name, item.location, item.description]
          .filter(Boolean).join(' ').toLowerCase();
        const withinDateRange = !days || Date.now() - itemTimestamp(item) <= days * DAY_IN_MS;

        return (!query || searchableText.includes(query))
          && (!category || item.category?.name === category)
          && (!location || item.location === location)
          && (!status || item.status === status)
          && withinDateRange;
      })
      .sort((first, second) => itemTimestamp(second) - itemTimestamp(first));
  }, [category, dateRange, location, publicItems, search, status]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    document.querySelector('#recent-items')?.scrollIntoView({ behavior: 'smooth' });
  }

  function navigateFromMenu(path: string) {
    setMenuOpen(false);
    navigate(path);
  }

  return (
    <main className="public-home">
      <header className="public-nav-wrap">
        <nav className="public-nav" aria-label="Main navigation">
          <button className="public-brand" type="button" onClick={() => navigate('/')}>
            <span className="public-brand-mark"><img src={lostAndFoundLogo} alt="" /></span>
            <span>AU Lost &amp; Found</span>
          </button>

          <button type="button" className="public-menu-toggle"
            onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen}
            aria-controls="public-navigation-links"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div id="public-navigation-links" className={`public-nav-links${menuOpen ? ' is-open' : ''}`}>
            <button type="button" onClick={() => navigateFromMenu('/browse-items')}>Browse Items</button>
            <button type="button" onClick={() => navigateFromMenu('/student-report-lost')}>Report Lost</button>
            <button type="button" onClick={() => navigateFromMenu('/staff/report-item')}>Report Found</button>
            <button type="button" className="public-login-button" onClick={() => navigateFromMenu('/login')}>Login</button>
          </div>
        </nav>
      </header>

      <section className="public-hero" aria-labelledby="public-hero-title">
        <div className="public-hero-copy">
          <p className="public-eyebrow">ASSUMPTION UNIVERSITY COMMUNITY</p>
          <h1 id="public-hero-title">Find what you lost.</h1>
          <p className="public-hero-description">
            Browse recently reported items around campus and reconnect with what matters.
          </p>
          <div className="public-hero-actions">
            <button type="button" className="public-primary-action" onClick={() => navigate('/student-report-lost')}>
              Report a Lost Item <ChevronRight size={18} />
            </button>
            <button type="button" className="public-secondary-action" onClick={() => navigate('/staff/report-item')}>
              I Found Something
            </button>
          </div>

          <form className="public-search" onSubmit={handleSearch} role="search">
            <div className="public-search-row">
              <label className="public-search-field">
                <span className="sr-only">Search reported items</span>
                <Search size={20} aria-hidden="true" />
                <input type="search" value={search} onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search item, category or location" />
              </label>
              <button type="submit">Search</button>
            </div>

            <div className="public-filters" aria-label="Item filters">
              <label><span className="sr-only">Category</span>
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option value="">All</option>
                  {categories.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </label>
              <label><span className="sr-only">Location</span>
                <select value={location} onChange={(event) => setLocation(event.target.value)}>
                  <option value="">Location</option>
                  {locations.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </label>
              <label><span className="sr-only">Date reported</span>
                <select value={dateRange} onChange={(event) => setDateRange(event.target.value)}>
                  <option value="7">Latest 7 days</option><option value="30">Latest 30 days</option><option value="">Any date</option>
                </select>
              </label>
              <label><span className="sr-only">Status</span>
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option value="">Status</option>
                  {statuses.map((value) => <option key={value} value={value}>{formatStatus(value)}</option>)}
                </select>
              </label>
            </div>
          </form>
        </div>

        <div className="public-hero-visual">
          <img src={campusImage} alt="Assumption University campus" />
        </div>
      </section>

      <section id="recent-items" className="public-items-section" aria-labelledby="recent-items-title">
        <div className="public-section-heading">
          <div><div className="public-section-label-row"><p className="public-eyebrow">RECENTLY REPORTED</p>
            <span>{dateRange ? `Latest ${dateRange} days` : 'All dates'}</span></div>
            <h2 id="recent-items-title">Found Items</h2></div>
          <button type="button" className="public-view-all" onClick={() => navigate('/browse-items')}>
            View All <ChevronRight size={17} />
          </button>
        </div>

        {filteredItems.length > 0 ? (
          <div className="public-items-grid">
            {filteredItems.slice(0, 3).map((item) => <PublicItemCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="public-empty-items"><PackageSearch size={36} aria-hidden="true" />
            <h3>No items found</h3><p>Try changing your search or filters to see more reported items.</p></div>
        )}
      </section>

      <section className="public-how-section" aria-labelledby="how-it-works-title">
        <div className="public-how-heading"><p className="public-eyebrow">A SIMPLE, SECURE PROCESS</p>
          <h2 id="how-it-works-title">How It Works</h2></div>
        <ol className="public-how-grid">
          <li><span>01</span><ClipboardList aria-hidden="true" /><strong>Report</strong><p>Tell us what was lost or found.</p></li>
          <li><span>02</span><Search aria-hidden="true" /><strong>Match</strong><p>Potential matches are identified.</p></li>
          <li><span>03</span><BadgeCheck aria-hidden="true" /><strong>Verify</strong><p>Ownership is checked securely.</p></li>
          <li><span>04</span><RotateCcw aria-hidden="true" /><strong>Return</strong><p>The item makes its way home.</p></li>
        </ol>
      </section>

      <footer className="public-footer"><div className="public-footer-inner">
        <div><strong>AU Lost &amp; Found</strong><p>Assumption University campus item recovery service.</p></div>
        <nav aria-label="Footer navigation">
          <button type="button" onClick={() => navigate('/browse-items')}>Browse Items</button>
          <button type="button" onClick={() => navigate('/student-report-lost')}>Report Lost</button>
          <button type="button" onClick={() => navigate('/staff/report-item')}>Report Found</button>
          <button type="button" onClick={() => navigate('/login')}>Login</button>
        </nav>
      </div></footer>
    </main>
  );
}
