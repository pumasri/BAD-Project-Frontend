import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function StudentReportLostItemPage({ onSubmitClaim }: { onSubmitClaim?: (claim: any) => void }) {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    
    const newClaim = {
      id: Date.now(),
      item: formData.get('itemName') as string,
      category: formData.get('category') as string,
      status: 'Under Review',
      date: formData.get('dateLost') as string,
    };
    
    if (onSubmitClaim) {
      onSubmitClaim(newClaim);
    }
    
    setIsSubmitted(true);
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
            />
          </label>

          <label className="field">
            <span>Category</span>
            <select name="category" required defaultValue="">
              <option value="" disabled>Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Wallet">Wallet</option>
              <option value="Keys">Keys</option>
              <option value="ID Card">ID Card</option>
              <option value="Clothing">Clothing</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <div className="form-two-column">
            <label className="field">
              <span>Date Lost</span>
              <input
                type="date"
                name="dateLost"
                required
              />
            </label>

            <label className="field">
              <span>Possible Location</span>
              <input
                type="text"
                name="location"
                placeholder="e.g., AU Library, 2nd Floor"
                required
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
            ></textarea>
          </label>

          <div className="form-row" style={{ marginTop: '16px' }}>
            <button
              type="button"
              className="text-link"
              onClick={() => navigate('/student-home')}
              style={{ padding: '14px 20px', border: 'none', background: 'transparent', fontSize: '0.95rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              style={{ flex: 1 }}
            >
              Submit Report
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
