import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../utils';

interface Category {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
}

export function AdminCategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');

  // Filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

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
      const data = await api.get('/admin/categories');
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

      setNewName('');
      setNewDesc('');
      setShowCreateModal(false);

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

  async function handleEditCategory(e: FormEvent) {
    e.preventDefault();
    if (!editingCategory) return;
    setEditError('');
    setIsEditSubmitting(true);
    try {
      await api.patch(`/admin/categories/${editingCategory.id}`, {
        name: editName,
        description: editDesc
      });
      setShowEditModal(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      if (error instanceof ApiError) {
        setEditError(error.message);
      } else {
        setEditError('An unexpected error occurred while editing the category.');
      }
    } finally {
      setIsEditSubmitting(false);
    }
  }

  async function toggleCategoryStatus(categoryId: string, currentStatus: boolean) {
    try {
      await api.patch(`/admin/categories/${categoryId}/status`, { isActive: !currentStatus });
      fetchCategories();
    } catch (error) {
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert('Failed to update category status.');
      }
    }
  }

  const filteredCategories = categories.filter(cat => {
    const searchString = `${cat.name} ${cat.description || ''}`.toLowerCase();
    const matchSearch = searchString.includes(searchTerm.toLowerCase());
    let matchStatus = true;
    if (statusFilter === 'ACTIVE') matchStatus = cat.isActive;
    if (statusFilter === 'INACTIVE') matchStatus = !cat.isActive;
    return matchSearch && matchStatus;
  });

  return (
    <main className="page-shell">
      <section className="dashboard-card" style={{ position: 'relative' }}>
        <button type="button" className="detail-back-button" onClick={() => navigate('/admin-dashboard')}>
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="dashboard-header" style={{ alignItems: 'flex-start' }}>
          <div>
            <p className="eyebrow">ADMIN PORTAL</p>
            <h1>Categories</h1>
            <p>Manage item categories for lost and found reports.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="submit-button"
              style={{ width: 'auto', padding: '12px 24px', margin: 0 }}
              onClick={() => setShowCreateModal(true)}
            >
              + Add Category
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total Categories', value: categories.length },
            { label: 'Active', value: categories.filter(c => c.isActive).length },
            { label: 'Inactive', value: categories.filter(c => !c.isActive).length }
          ].map(stat => (
            <div key={stat.label} style={{
              flex: '1 1 120px',
              background: 'rgba(255, 255, 255, 0.6)',
              border: '1px solid rgba(0,0,0,0.05)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <span className="muted-text" style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {stat.label}
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#594a3a' }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <div className="staff-item-toolbar" style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="staff-item-search" style={{ display: 'flex', flex: 1, minWidth: '250px', background: 'white', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <span style={{ padding: '10px 16px', color: '#918477', display: 'flex', alignItems: 'center' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search categories by name or description..."
              style={{ width: '100%', padding: '10px 16px 10px 0', border: 'none', outline: 'none', background: 'transparent' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="staff-status-filter"
            style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', outline: 'none', color: '#594a3a', minWidth: '150px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} style={{ padding: '48px 24px', textAlign: 'center', color: '#918477' }}>Loading categories...</td></tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '2rem' }}>📭</span>
                      <strong style={{ color: '#594a3a', fontSize: '1.1rem' }}>No categories found</strong>
                      <span className="muted-text">Try changing your search or filter.</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.map(cat => (
                <tr key={cat.id} className="admin-table-row">
                  <td><strong style={{ color: '#594a3a', fontSize: '1.05rem' }}>{cat.name}</strong></td>
                  <td>
                    <span className="muted-text" style={{ fontSize: '0.9rem' }}>
                      {cat.description || 'No description provided'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${cat.isActive ? 'status-resolved' : 'status-archived'}`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="action-btn"
                      style={{
                        background: 'transparent',
                        border: cat.isActive ? '1px solid rgba(217, 48, 37, 0.3)' : '1px solid rgba(83, 132, 91, 0.3)',
                        color: cat.isActive ? '#d93025' : '#4f7e56',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = cat.isActive ? 'rgba(217, 48, 37, 0.1)' : 'rgba(83, 132, 91, 0.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                      onClick={() => toggleCategoryStatus(cat.id, cat.isActive)}
                    >
                      {cat.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="action-btn"
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(89, 74, 58, 0.3)',
                        color: '#594a3a',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease',
                        marginLeft: '8px'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(89, 74, 58, 0.05)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      onClick={() => {
                        setEditingCategory(cat);
                        setEditName(cat.name);
                        setEditDesc(cat.description || '');
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Category Modal */}
        {showCreateModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.15)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(2px)'
          }}>
            <div style={{
              background: 'rgba(255, 250, 242, 0.95)', padding: '32px', borderRadius: '24px',
              width: '100%', maxWidth: '400px', boxShadow: '0 24px 60px rgba(69, 55, 37, 0.15)',
              border: '1px solid rgba(93, 82, 64, 0.1)'
            }}>
              <h2 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', color: '#594a3a' }}>Add Category</h2>
              <form onSubmit={handleCreateCategory} className="login-form">
                <div className="field">
                  <span>Category Name</span>
                  <input
                    type="text" required
                    value={newName} onChange={e => setNewName(e.target.value)}
                  />
                </div>
                <div className="field">
                  <span>Description</span>
                  <textarea
                    value={newDesc} onChange={e => setNewDesc(e.target.value)}
                  />
                </div>

                {createError && (
                  <p className="form-status" style={{ margin: '0 0 16px 0' }}>{createError}</p>
                )}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="view-item-button"
                    style={{ width: 'auto' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="submit-button"
                    style={{ width: 'auto' }}
                  >
                    {isSubmitting ? 'Adding...' : 'Add Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {showEditModal && editingCategory && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.15)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(2px)'
          }}>
            <div style={{
              background: 'rgba(255, 250, 242, 0.95)', padding: '32px', borderRadius: '24px',
              width: '100%', maxWidth: '400px', boxShadow: '0 24px 60px rgba(69, 55, 37, 0.15)',
              border: '1px solid rgba(93, 82, 64, 0.1)'
            }}>
              <h2 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', color: '#594a3a' }}>Edit Category</h2>
              <form onSubmit={handleEditCategory} className="login-form">
                <div className="field">
                  <span>Category Name</span>
                  <input
                    type="text" required
                    value={editName} onChange={e => setEditName(e.target.value)}
                  />
                </div>
                <div className="field">
                  <span>Description</span>
                  <textarea
                    value={editDesc} onChange={e => setEditDesc(e.target.value)}
                  />
                </div>

                {editError && (
                  <p className="form-status" style={{ margin: '0 0 16px 0' }}>{editError}</p>
                )}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingCategory(null);
                    }}
                    className="view-item-button"
                    style={{ width: 'auto' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isEditSubmitting}
                    className="submit-button"
                    style={{ width: 'auto' }}
                  >
                    {isEditSubmitting ? 'Saving...' : 'Save Changes'}
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
