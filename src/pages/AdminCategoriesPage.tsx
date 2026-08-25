import { useNavigate } from 'react-router-dom';

const mockCategories = [
  { id: 1, name: 'Electronics', count: 12 },
  { id: 2, name: 'Wallet', count: 8 },
  { id: 3, name: 'Keys', count: 5 },
  { id: 4, name: 'Documents', count: 7 },
  { id: 5, name: 'Clothing', count: 4 },
];

export function AdminCategoriesPage() {
  const navigate = useNavigate();

  return (
    <main className="page-shell">
      <section className="dashboard-card" style={{ maxWidth: '800px' }}>
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
          <button className="submit-button" style={{ width: 'auto', margin: 0, padding: '12px 24px' }} onClick={() => alert('Add category modal (Phase 1 Mock)')}>
            + Add Category
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mockCategories.map(cat => (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '1.2rem', color: '#594a3a', marginBottom: '4px' }}>{cat.name}</strong>
                <span style={{ color: '#918477', fontSize: '0.9rem' }}>{cat.count} items reported</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="secondary-button" style={{ padding: '8px 16px' }} onClick={() => alert('Edit category (Phase 1 Mock)')}>Edit</button>
                <button className="secondary-button" style={{ padding: '8px 16px', color: '#d9534f', borderColor: '#d9534f' }} onClick={() => alert('Delete category (Phase 1 Mock)')}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
