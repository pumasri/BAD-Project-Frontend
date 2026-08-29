import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../utils';

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

export function AdminCategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New category form state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setIsLoading(true);
      const data = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateCategory(e: FormEvent) {
    e.preventDefault();
    setCreateError('');
    setIsSubmitting(true);

    try {
      await api.post('/categories', {
        name: newName,
        description: newDesc
      });

      // Reset form and close modal
      setNewName('');
      setNewDesc('');
      setShowCreateModal(false);

      // Refresh list
      fetchCategories();
    } catch (error) {
      if (error instanceof ApiError) {
        setCreateError(error.message);
      } else {
        setCreateError('An unexpected error occurred while creating the category.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="dashboard-card" style={{ maxWidth: '800px', position: 'relative' }}>
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">ADMIN PORTAL</p>
            <h1>Categories</h1>
            <p>Manage the categories used for reporting lost and found items.</p>
          </div>
          <button
            type="button"
            className="dashboard-logout"
            onClick={() => navigate('/admin-dashboard')}
          >
            Back to Dashboard
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#594a3a', margin: 0 }}>Active Categories</h2>
          <button
            className="submit-button"
            style={{ width: 'auto', margin: 0, padding: '12px 24px' }}
            onClick={() => setShowCreateModal(true)}
          >
            + Add Category
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isLoading ? (
            <div style={{ padding: '24px', textAlign: 'center', background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)' }}>
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)' }}>
              No categories found.
            </div>
          ) : categories.map(cat => (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '1.2rem', color: '#594a3a', marginBottom: '4px' }}>{cat.name}</strong>
                <span style={{ color: '#918477', fontSize: '0.9rem' }}>{cat.description || 'No description provided'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Create Category Modal */}
        {showCreateModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              background: 'white', padding: '32px', borderRadius: '16px',
              width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}>
              <h2 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', color: '#31281f' }}>Add Category</h2>
              <form onSubmit={handleCreateCategory}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Category Name</label>
                  <input
                    type="text" required
                    value={newName} onChange={e => setNewName(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                  />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Description</label>
                  <textarea
                    value={newDesc} onChange={e => setNewDesc(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', minHeight: '80px', fontFamily: 'inherit' }}
                  />
                </div>

                {createError && (
                  <p style={{ color: '#d93025', marginBottom: '16px', fontSize: '0.9rem' }}>{createError}</p>
                )}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#31281f', color: 'white', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                  >
                    {isSubmitting ? 'Adding...' : 'Add Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
