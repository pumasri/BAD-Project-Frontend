import { useState, useEffect, FormEvent, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError, campusImage } from '../utils';

interface Category {
  id: string;
  name: string;
}

export function ReportFoundItemPage({
  onItemReported,
}: {
  onItemReported: () => void;
}) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/categories')
      .then(setCategories)
      .catch(console.error);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name || !category || !location || !date || !description) {
      setMessage('Please complete all required fields.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await api.post('/items', {
        title: name,
        categoryId: category,
        occurredAt: new Date(date).toISOString(),
        location,
        description,
        reportType: 'FOUND',
        isPublic: true,
      });

      // Upload image if selected
      if (selectedFile && response.id) {
        setMessage('Uploading item image...');
        const formData = new FormData();
        formData.append('image', selectedFile);

        const token = localStorage.getItem('token');
        const apiUrl = ((import.meta as any).env.VITE_API_URL || 'http://localhost:5050') + '/api';
        
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const uploadRes = await fetch(`${apiUrl}/items/${response.id}/images`, {
          method: 'POST',
          headers,
          body: formData
        });

        if (!uploadRes.ok) {
          throw new Error('Image upload failed.');
        }
      }

      // Refetch items in global state
      onItemReported();
      
      setMessage('Found item reported successfully!');
      setTimeout(() => {
        navigate('/staff-dashboard');
      }, 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        setMessage(err.message);
      } else if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage('Failed to report item. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
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
                disabled={isLoading}
              />
            </label>

            <label className="field">
              <span>Category *</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
                disabled={isLoading || categories.length === 0}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
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
                disabled={isLoading}
              />
            </label>

            <label className="field">
              <span>Date Found *</span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
                disabled={isLoading}
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
              disabled={isLoading}
            />
          </label>

          <label className="field">
            <span>Item Image</span>
            <input
              type="file"
              accept="image/*"
              disabled={isLoading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }
                setSelectedFile(file);
                const imageUrl = URL.createObjectURL(file);
                setImagePreview(imageUrl);
              }}
            />
          </label>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview of found item" />
            </div>
          )}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Found Item'}
          </button>

          {message && <p className="form-status">{message}</p>}
        </form>
      </section>
    </main>
  );
}
