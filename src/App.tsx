import { useCallback, useEffect, useState, type ReactElement } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import type { AuthUser, Item, Role, StudentClaim } from './types';
import { clearAuth, getCurrentUser, logoutSession } from './services/authService';
import { api } from './utils';

import { HomePage } from './pages/HomePage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { LoginPage } from './pages/LoginPage';
import { StudentHome } from './pages/StudentHome';
import { StudentFindItemPage } from './pages/StudentFindItemPage';
import { StudentReportLostItemPage } from './pages/StudentReportLostItemPage';
import { StudentClaimsPage } from './pages/StudentClaimsPage';
import { StudentClaimDetailsPage } from './pages/StudentClaimDetailsPage';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { StaffDashboard } from './pages/StaffDashboard';
import { StaffClaimsPage } from './pages/StaffClaimsPage';
import { StaffClaimDetailsPage } from './pages/StaffClaimDetailsPage';
import { StaffProfilePage } from './pages/StaffProfilePage';
import { StaffManageItemsPage } from './pages/StaffManageItemsPage';
import { StaffItemDetailPage } from './pages/StaffItemDetailPage';
import { ReportFoundItemPage } from './pages/ReportFoundItemPage';
import { StaffLostReportsPage } from './pages/StaffLostReportsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminAuditLogsPage } from './pages/AdminAuditLogsPage';
import { AdminApiIntegrationsPage } from './pages/AdminApiIntegrationsPage';
import { AdminProfilePage } from './pages/AdminProfilePage';
import { AIChatbot } from './components/AIChatbot';

import './App.css';

const dashboardByRole: Record<Role, string> = {
  STUDENT: '/student-home',
  STAFF: '/staff-dashboard',
  ADMIN: '/admin-dashboard',
};

function RequireAuth({
  user,
  checkingAuth,
  allowedRole,
  children,
}: {
  user: AuthUser | null;
  checkingAuth: boolean;
  allowedRole: Role;
  children: ReactElement;
}) {
  if (checkingAuth) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== allowedRole) {
    return <Navigate to={dashboardByRole[user.role]} replace />;
  }
  return children;
}

function App() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [studentClaims, setStudentClaims] = useState<StudentClaim[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticationError, setAuthenticationError] = useState('');

  const fetchItems = useCallback(() => {
    api.get('/items').then(setItems).catch(console.error);
  }, []);

  const fetchClaims = useCallback((currentUser: AuthUser | null) => {
    if (currentUser?.role === 'STUDENT') {
      api.get('/claims/my').then(setStudentClaims).catch(console.error);
    } else if (currentUser?.role === 'STAFF') {
      api.get('/claims').then(setStudentClaims).catch(console.error);
    } else {
      setStudentClaims([]);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    async function restoreLogin() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        fetchClaims(currentUser);
      } catch (error) {
        clearAuth();
        setUser(null);
        setAuthenticationError(
          error instanceof Error ? error.message : 'Your session could not be restored.',
        );
      } finally {
        setCheckingAuth(false);
      }
    }
    restoreLogin();
  }, [fetchClaims]);

  async function handleUpdateItem(item: Item) {
    await api.patch(`/items/${item.id}`, {
      title: item.title,
      description: item.description,
      location: item.location,
      status: item.status,
    });
    fetchItems();
  }

  function finishLogin(authenticatedUser: AuthUser) {
    setAuthenticationError('');
    setUser(authenticatedUser);
    fetchClaims(authenticatedUser);
    navigate(dashboardByRole[authenticatedUser.role]);
  }

  async function logout() {
    setUser(null);
    setStudentClaims([]);
    setAuthenticationError('');
    await logoutSession();
    navigate('/login', { replace: true });
  }

  const guard = (role: Role, element: ReactElement) => (
    <RequireAuth user={user} checkingAuth={checkingAuth} allowedRole={role}>
      {element}
    </RequireAuth>
  );

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage items={items} />} />
        <Route path="/item/:id" element={<ItemDetailPage items={items} user={user} />} />
        <Route
          path="/login"
          element={<LoginPage onLogin={finishLogin} authenticationError={authenticationError} />}
        />
        <Route path="/student-login" element={<Navigate to="/login" replace />} />
        <Route path="/staff-login" element={<Navigate to="/login" replace />} />
        <Route path="/admin-login" element={<Navigate to="/login" replace />} />
        <Route path="/student-signup" element={<Navigate to="/login" replace />} />
        <Route path="/forgot-password" element={<Navigate to="/login" replace />} />
        <Route path="/reset-password" element={<Navigate to="/login" replace />} />

        <Route
          path="/student-home"
          element={guard('STUDENT', <StudentHome onLogout={logout} claims={studentClaims} items={items} />)}
        />
        <Route
          path="/student-find-item"
          element={guard('STUDENT', <StudentFindItemPage items={items} />)}
        />
        <Route
          path="/student-report-lost"
          element={guard('STUDENT', <StudentReportLostItemPage onItemReported={fetchItems} />)}
        />
        <Route
          path="/student-claims"
          element={guard('STUDENT', <StudentClaimsPage claims={studentClaims} />)}
        />
        <Route
          path="/student-claims/:id"
          element={guard('STUDENT', <StudentClaimDetailsPage />)}
        />
        <Route
          path="/student-profile"
          element={guard('STUDENT', <StudentProfilePage onLogout={logout} />)}
        />

        <Route
          path="/staff-dashboard"
          element={guard('STAFF', <StaffDashboard items={items} onLogout={logout} />)}
        />
        <Route
          path="/staff/items"
          element={guard('STAFF', <StaffManageItemsPage items={items} />)}
        />
        <Route
          path="/staff/items/:id"
          element={guard('STAFF', <StaffItemDetailPage items={items} onUpdateItem={handleUpdateItem} />)}
        />
        <Route
          path="/staff/report-item"
          element={guard('STAFF', <ReportFoundItemPage onItemReported={fetchItems} />)}
        />
        <Route
          path="/staff/claims"
          element={guard('STAFF', <StaffClaimsPage claims={studentClaims} />)}
        />
        <Route
          path="/staff/claims/:id"
          element={guard('STAFF', <StaffClaimDetailsPage />)}
        />
        <Route
          path="/staff/lost-reports"
          element={guard('STAFF', <StaffLostReportsPage items={items} onUpdate={fetchItems} />)}
        />
        <Route
          path="/staff-profile"
          element={guard('STAFF', <StaffProfilePage onLogout={logout} />)}
        />

        <Route
          path="/admin-dashboard"
          element={guard('ADMIN', <AdminDashboard onLogout={logout} />)}
        />
        <Route path="/admin-users" element={guard('ADMIN', <AdminUsersPage />)} />
        <Route path="/admin-categories" element={guard('ADMIN', <AdminCategoriesPage />)} />
        <Route path="/admin-audit-logs" element={guard('ADMIN', <AdminAuditLogsPage />)} />
        <Route
          path="/admin-api-integrations"
          element={guard('ADMIN', <AdminApiIntegrationsPage />)}
        />
        <Route
          path="/admin-profile"
          element={guard('ADMIN', <AdminProfilePage user={user!} onLogout={logout} />)}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {user?.role === 'STUDENT' && <AIChatbot />}
    </>
  );
}

export default App;
