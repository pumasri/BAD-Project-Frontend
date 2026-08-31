import { CalendarDays, ChevronRight, MapPin, PackageSearch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Item } from '../types';
import { formatStatus, uploadUrl } from '../utils';

export function PublicItemCard({ item }: { item: Item }) {
  const navigate = useNavigate();

  return (
    <article className="public-item-card">
      <div className="public-item-image">
        {item.images?.[0] ? (
          <img src={uploadUrl(item.images[0].objectKey)} alt={item.title} />
        ) : (
          <div className="public-image-placeholder">
            <PackageSearch size={40} strokeWidth={1.5} aria-hidden="true" />
            <span>No image available</span>
          </div>
        )}
        <span className="public-category-badge">{item.category?.name || 'Uncategorized'}</span>
        <span className={`public-status-badge status-${item.status.toLowerCase()}`}>
          {formatStatus(item.status)}
        </span>
      </div>
      <div className="public-item-content">
        <h3>{item.title}</h3>
        <div className="public-item-info">
          <span><MapPin size={17} aria-hidden="true" /> {item.location}</span>
          <span><CalendarDays size={17} aria-hidden="true" /> {new Date(item.occurredAt).toLocaleDateString()}</span>
        </div>
        <button type="button" onClick={() => navigate(`/item/${item.id}`)}>
          Detail <ChevronRight size={17} />
        </button>
      </div>
    </article>
  );
}
