import { useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Item } from '../types';
import { campusImage } from '../utils';

export function ReportFoundItemPage({
  onSubmitItem,
}: {
  onSubmitItem: (item: Omit<Item, 'id' | 'status'>) => void;
}) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name || !category || !location || !date || !description) {
      setMessage('Please complete all required fields.');
      return;
    }

    onSubmitItem({
      name,
      category,
      location,
      date,
      description,
      image,
    });
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
      <section className="report-card">
        <button
          type="button"
          className="detail-back-button"
          onClick={() => navigate('/staff-dashboard')}
        >
          ← Back to Staff Dashboard
        </button>

        <div className="card-heading">
          <p className="eyebrow">STAFF PORTAL</p>
          <h1>Report Found Item</h1>
          <p>Add information about an item that was found on campus.</p>
        </div>

        <form className="report-form" onSubmit={handleSubmit}>
          <div className="form-two-column">
            <label className="field">
              <span>Item Name *</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Black Wallet"
                required
              />
            </label>

            <label className="field">
              <span>Category *</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
              >
                <option value="">Select category</option>
                <option value="Wallet">Wallet</option>
                <option value="Electronics">Electronics</option>
                <option value="ID Card">ID Card</option>
                <option value="Keys">Keys</option>
                <option value="Bag">Bag</option>
                <option value="Clothing">Clothing</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>

          <div className="form-two-column">
            <label className="field">
              <span>Location Found *</span>
              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="e.g. AU Library"
                required
              />
            </label>

            <label className="field">
              <span>Date Found *</span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </label>
          </div>

          <label className="field">
            <span>Description *</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the item, including useful identifying details..."
              rows={5}
              required
            />
          </label>

          <label className="field">
            <span>Item Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }
                const imageUrl = URL.createObjectURL(file);
                setImage(imageUrl);
              }}
            />
          </label>

          {image && (
            <div className="image-preview">
              <img src={image} alt="Preview of found item" />
            </div>
          )}

          <button type="submit" className="submit-button">
            Submit Found Item
          </button>

          {message && <p className="form-status">{message}</p>}
        </form>
      </section>
    </main>
  );
}
