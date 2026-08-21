import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import type { Role, Item } from './types';
import { initialItems, loginPages } from './data/mockData';

import { HomePage } from './pages/HomePage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { LoginPage } from './pages/LoginPage';
import { StaffDashboard } from './pages/StaffDashboard';
import { StaffManageItemsPage } from './pages/StaffManageItemsPage';
import { StaffItemDetailPage } from './pages/StaffItemDetailPage';
import { ReportFoundItemPage } from './pages/ReportFoundItemPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { StudentSignupPage } from './pages/StudentSignupPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { StudentHome } from './pages/StudentHome';

import './App.css';

const API_URL = 'http://localhost:5050';

function App() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    async function checkBackend() {
      try {
        const response = await fetch(`${API_URL}/api/health`);
        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }
        const data = await response.json();
        console.log('Backend connected:', data);
      } catch (error) {
        console.error('Backend connection failed:', error);
      }
    }
    checkBackend();
  }, []);

  function loginAs(newRole: Role) {
    setRole(newRole);
    if (newRole === 'student') {
      navigate('/student-home');
    } else if (newRole === 'staff') {
      navigate('/staff-dashboard');
    } else if (newRole === 'admin') {
      navigate('/admin-dashboard');
    }
  }

  function logout() {
    setRole(null);
    navigate('/');
  }

  function handleAddItem(item: Omit<Item, 'id' | 'status'>) {
    const newItem: Item = {
      ...item,
      id: items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1,
      status: 'OPEN',
    };
    setItems((currentItems) => [newItem, ...currentItems]);
    navigate('/staff-dashboard');
  }

  function updateItem(updatedItem: Item) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  }

  const RequireAuth = ({
    allowedRole,
    loginPath,
    children,
  }: {
    allowedRole: Role;
    loginPath: string;
    children: JSX.Element;
  }) => {
    if (role !== allowedRole) {
      return <Navigate to={loginPath} replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage items={items} />} />
      <Route path="/item/:id" element={<ItemDetailPage items={items} />} />

      <Route
        path="/student-login"
        element={
          <LoginPage
            {...loginPages['/student-login']}
            onLogin={() => loginAs('student')}
          />
        }
      />
      <Route
        path="/staff-login"
        element={
          <LoginPage
            {...loginPages['/staff-login']}
            onLogin={() => loginAs('staff')}
          />
        }
      />
      <Route
        path="/admin-login"
        element={
          <LoginPage
            {...loginPages['/admin-login']}
            onLogin={() => loginAs('admin')}
          />
        }
      />

      <Route path="/student-signup" element={<StudentSignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route
        path="/student-home"
        element={
          <RequireAuth allowedRole="student" loginPath="/student-login">
            <StudentHome onLogout={logout} />
          </RequireAuth>
        }
      />

      <Route
        path="/staff-dashboard"
        element={
          <RequireAuth allowedRole="staff" loginPath="/staff-login">
            <StaffDashboard items={items} onLogout={logout} />
          </RequireAuth>
        }
      />
      <Route
        path="/staff/items"
        element={
          <RequireAuth allowedRole="staff" loginPath="/staff-login">
            <StaffManageItemsPage items={items} />
          </RequireAuth>
        }
      />
      <Route
        path="/staff/items/:id"
        element={
          <RequireAuth allowedRole="staff" loginPath="/staff-login">
            <StaffItemDetailPage items={items} onUpdateItem={updateItem} />
          </RequireAuth>
        }
      />
      <Route
        path="/staff/report-item"
        element={
          <RequireAuth allowedRole="staff" loginPath="/staff-login">
            <ReportFoundItemPage onSubmitItem={handleAddItem} />
          </RequireAuth>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <RequireAuth allowedRole="admin" loginPath="/admin-login">
            <AdminDashboard onLogout={logout} />
          </RequireAuth>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;