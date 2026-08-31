import { useMemo, useState, type FormEvent } from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import lostAndFoundLogo from '../assets/images/l-and-f-logo-transparent.png';
import { PublicItemCard } from '../components/PublicItemCard';
import type { Item } from '../types';
import { formatStatus } from '../utils';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const itemTimestamp = (item: Item) => new Date(item.reportedAt || item.occurredAt).getTime();

export function FoundItemsPage({ items }: { items: Item[] }) {
  const navigate = useNavigate();
  const locationState = useLocation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [status, setStatus] = useState('');

  const foundItems = useMemo(
    () => items.filter((item) => item.reportType === 'FOUND' && item.isPublic !== false),
    [items],
  );
  const categories = useMemo(
    () => [...new Set(foundItems.map((item) => item.category?.name).filter(Boolean))].sort(),
    [foundItems],
  );
  const locations = useMemo(
    () => [...new Set(foundItems.map((item) => item.location).filter(Boolean))].sort(),
    [foundItems],
  );
  const statuses = useMemo(() => [...new Set(foundItems.map((item) => item.status))], [foundItems]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    const days = Number(dateRange);

    return foundItems
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
  }, [category, dateRange, foundItems, location, search, status]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  const homePath = locationState.pathname.startsWith('/student') ? '/student-home' : '/';

  return (
    <main className="found-items-page">
      <header className="public-nav-wrap">
        <nav className="public-nav" aria-label="Found items navigation">
          <button className="public-brand" type="button" onClick={() => navigate(homePath)}>
            <span className="public-brand-mark"><img src={lostAndFoundLogo} alt="" /></span>
            <span>AU Lost &amp; Found</span>
          </button>
          <button type="button" className="found-items-back" onClick={() => navigate(homePath)}>
            <ChevronLeft size={18} /> Back to Home
          </button>
        </nav>
      </header>

      <section className="found-items-container" aria-labelledby="found-items-title">
        <header className="found-items-heading">
          <p className="public-eyebrow">CAMPUS LOST &amp; FOUND</p>
          <h1 id="found-items-title">Found Items</h1>
          <p>Browse all public items reported found around campus.</p>
        </header>

        <form className="found-items-search" onSubmit={handleSearch} role="search">
          <div className="public-search-row">
            <label className="public-search-field">
              <span className="sr-only">Search found items</span>
              <Search size={20} aria-hidden="true" />
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)}
                placeholder="Search item, category or location" />
            </label>
            <button type="submit">Search</button>
          </div>
          <div className="public-filters" aria-label="Found item filters">
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
                <option value="">Any date</option><option value="7">Latest 7 days</option><option value="30">Latest 30 days</option>
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

        <div className="found-items-summary">
          <strong>{filteredItems.length}</strong>
          <span>{filteredItems.length === 1 ? 'item found' : 'items found'}</span>
        </div>

        {filteredItems.length ? (
          <div className="public-items-grid">
            {filteredItems.map((item) => <PublicItemCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="public-empty-items">
            <h2>No items found</h2>
            <p>Try changing your search or filters.</p>
          </div>
        )}
      </section>
    </main>
  );
}
