import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../utils';

export function StudentReportLostItemPage({
  onItemReported,
}: {
  onItemReported: () => void;
}) {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    api.get('/categories').then(setCategories).catch(console.error);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.target as HTMLFormElement);
    const imageFile = formData.get('image') as File;

    try {
      const response = await api.post('/items', {
        title: formData.get('itemName') as string,
        categoryId: formData.get('category') as string,
        occurredAt: new Date(formData.get('dateLost') as string).toISOString(),
        location: formData.get('location') as string,
        description: formData.get('description') as string,
        brand: formData.get('brand') as string || null,
        color: formData.get('color') as string || null,
        reportType: 'LOST',
        isPublic: true,
      });

      const itemId = response.id;

      if (imageFile && imageFile.size > 0) {
        const imgData = new FormData();
        imgData.append('image', imageFile);
        await api.postForm(`/items/${itemId}/images`, imgData);
      }

      onItemReported();
      setIsSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to submit report. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <main className="page-shell">
        <section className="report-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✅</div>
          <div className="card-heading">
            <h1>Report Submitted</h1>
            <p>Your lost item report has been successfully submitted. We will notify you if a potential match is found.</p>
          </div>
          <button
            type="button"
            className="submit-button"
            onClick={() => navigate('/student-home')}
          >
            Back to Student Home
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="report-card">
        <div className="card-heading">
          <p className="eyebrow">STUDENT PORTAL</p>
          <h1>Report Lost Item</h1>
          <p>Please provide as many details as possible to help us identify your lost item.</p>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          <label className="field">
            <span>Item Name</span>
            <input
              type="text"
              name="itemName"
              placeholder="e.g., Black Leather Wallet"
              required
              disabled={isLoading}
            />
          </label>

          <label className="field">
            <span>Category</span>
            <select
              name="category"
              required
              disabled={isLoading || categories.length === 0}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <div className="form-two-column">
            <label className="field">
              <span>Brand (Optional)</span>
              <input type="text" name="brand" placeholder="e.g., Apple, Nike" disabled={isLoading} />
            </label>

            <label className="field">
              <span>Color (Optional)</span>
              <input type="text" name="color" placeholder="e.g., Black, Silver" disabled={isLoading} />
            </label>
          </div>

          <div className="form-two-column">
            <label className="field">
              <span>Date Lost</span>
              <input
                type="date"
                name="dateLost"
                required
                disabled={isLoading}
              />
            </label>

            <label className="field">
              <span>Possible Location</span>
              <input
                type="text"
                name="location"
                placeholder="e.g., AU Library, 2nd Floor"
                required
                disabled={isLoading}
              />
            </label>
          </div>

          <label className="field">
            <span>Additional Details</span>
            <textarea
              name="description"
              rows={4}
              placeholder="Provide any distinguishing features (color, brand, marks)..."
              required
              disabled={isLoading}
            ></textarea>
          </label>

          <label className="field">
            <span>Reference Photo (Optional)</span>
            <input
              type="file"
              name="image"
              accept="image/*"
              disabled={isLoading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImagePreview(URL.createObjectURL(file));
                } else {
                  setImagePreview(null);
                }
              }}
              style={{
                padding: '8px',
                border: '1px solid rgba(93, 82, 64, 0.2)',
                borderRadius: '8px',
                background: 'white',
              }}
            />
          </label>

          {imagePreview && (
            <div style={{ marginTop: '8px', width: '100%', maxHeight: '200px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          {error && <p className="form-status" style={{ color: '#d93025' }}>{error}</p>}

          <div className="form-row" style={{ marginTop: '16px' }}>
            <button
              type="button"
              className="text-link"
              onClick={() => navigate('/student-home')}
              style={{ padding: '14px 20px', border: 'none', background: 'transparent', fontSize: '0.95rem' }}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              style={{ flex: 1 }}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
