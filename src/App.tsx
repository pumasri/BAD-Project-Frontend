import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import type { AuthUser, Role, Item } from './types';
import { initialItems } from './data/mockData';
import { clearAuth, getCurrentUser } from './services/authService';

import { HomePage } from './pages/HomePage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { LoginPage } from './pages/LoginPage';
import { StaffDashboard } from './pages/StaffDashboard';
import { StaffManageItemsPage } from './pages/StaffManageItemsPage';
import { StaffItemDetailPage } from './pages/StaffItemDetailPage';
import { ReportFoundItemPage } from './pages/ReportFoundItemPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { StudentSignupPage } from './pages/StudentSignupPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { StudentHome } from './pages/StudentHome';

import './App.css';

const dashboardByRole: Record<Role, string> = {
  STUDENT: '/student-home',
  STAFF: '/staff-dashboard',
  ADMIN: '/admin-dashboard',
};

function App() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function restoreLogin() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        clearAuth();
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    }

    restoreLogin();
  }, []);

  function finishLogin(authenticatedUser: AuthUser) {
    setUser(authenticatedUser);
    navigate(dashboardByRole[authenticatedUser.role]);
  }

  function logout() {
    clearAuth();
    setUser(null);
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
    children,
  }: {
    allowedRole: Role;
    children: ReactElement;
  }) => {
    if (checkingAuth) {
      return null;
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (user.role !== allowedRole) {
      return <Navigate to={dashboardByRole[user.role]} replace />;
    }

    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage items={items} />} />
      <Route path="/item/:id" element={<ItemDetailPage items={items} />} />

      <Route
        path="/login"
        element={
          <LoginPage
            onLogin={finishLogin}
          />
        }
      />

      <Route path="/student-signup" element={<StudentSignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        path="/student-home"
        element={
          <RequireAuth allowedRole="STUDENT">
            <StudentHome onLogout={logout} />
          </RequireAuth>
        }
      />

      <Route
        path="/staff-dashboard"
        element={
          <RequireAuth allowedRole="STAFF">
            <StaffDashboard items={items} onLogout={logout} />
          </RequireAuth>
        }
      />
      <Route
        path="/staff/items"
        element={
          <RequireAuth allowedRole="STAFF">
            <StaffManageItemsPage items={items} />
          </RequireAuth>
        }
      />
      <Route
        path="/staff/items/:id"
        element={
          <RequireAuth allowedRole="STAFF">
            <StaffItemDetailPage items={items} onUpdateItem={updateItem} />
          </RequireAuth>
        }
      />
      <Route
        path="/staff/report-item"
        element={
          <RequireAuth allowedRole="STAFF">
            <ReportFoundItemPage onSubmitItem={handleAddItem} />
          </RequireAuth>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <RequireAuth allowedRole="ADMIN">
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
