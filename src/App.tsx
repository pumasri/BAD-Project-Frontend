import { useEffect, useState, type ReactElement } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
} from 'react-router-dom';

import type { AuthUser, Role, Item, StudentClaim } from './types';

import { initialItems } from './data/mockData';
import {
  clearAuth,
  getCurrentUser,
  logoutSession,
} from './services/authService';

import { HomePage } from './pages/HomePage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { LoginPage } from './pages/LoginPage';

import { StudentSignupPage } from './pages/StudentSignupPage';
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

import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminAuditLogsPage } from './pages/AdminAuditLogsPage';
import { AdminApiIntegrationsPage } from './pages/AdminApiIntegrationsPage';
import { AdminProfilePage } from './pages/AdminProfilePage';

import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

import './App.css';

// ---
// FRONTEND ROLE PROTECTION
// ---

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
  if (checkingAuth) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to={dashboardByRole[user.role]} replace />;
  }

  return <>{children}</>;
}

function App() {
  const navigate = useNavigate();

  const [items, setItems] = useState<Item[]>(initialItems);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticationError, setAuthenticationError] = useState('');

  useEffect(() => {
    async function restoreLogin() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        clearAuth();
        setUser(null);
        setAuthenticationError(
          error instanceof Error
            ? error.message
            : 'Your session could not be restored.',
        );
      } finally {
        setCheckingAuth(false);
      }
    }

    restoreLogin();
  }, []);

  const [studentClaims, setStudentClaims] = useState<StudentClaim[]>([
    {
      id: 1,
      item: 'Black Wallet',
      category: 'Wallet',
      status: 'Under Review',
      date: 'August 21, 2026',
    },
    {
      id: 2,
      item: 'AirPods Case',
      category: 'Electronics',
      status: 'Potential Match',
      date: 'August 19, 2026',
    },
  ]);

  function handleAddClaim(claim: StudentClaim) {
    setStudentClaims([claim, ...studentClaims]);
  }

  function finishLogin(authenticatedUser: AuthUser) {
    setAuthenticationError('');
    setUser(authenticatedUser);
    navigate(dashboardByRole[authenticatedUser.role]);
  }

  // ---
  // LOGOUT
  // ---

  async function logout() {
    setUser(null);
    setAuthenticationError('');
    await logoutSession();
    navigate('/login', { replace: true });
  }

  // ---
  // ADD FOUND ITEM
  // ---

  function handleAddItem(
    item: Omit<Item, 'id' | 'status'>
  ) {
    const newItem: Item = {
      ...item,
      id:
        items.length > 0
          ? Math.max(
              ...items.map(
                (currentItem) => currentItem.id
              )
            ) + 1
          : 1,
      status: 'OPEN',
    };

    setItems((currentItems) => [
      newItem,
      ...currentItems,
    ]);

    navigate('/staff-dashboard');
  }

  // ---
  // UPDATE ITEM
  // ---

  function updateItem(updatedItem: Item) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === updatedItem.id
          ? updatedItem
          : item
      )
    );
  }

  return (
    <Routes>

      {/* ---
          PUBLIC
      --- */}

      <Route
        path="/"
        element={
          <HomePage items={items} />
        }
      />

      <Route
        path="/item/:id"
        element={
          <ItemDetailPage items={items} />
        }
      />

      {/* ---
          STUDENT
      --- */}

      <Route
        path="/login"
        element={
          <LoginPage
            onLogin={finishLogin}
            authenticationError={authenticationError}
          />
        }
      />

      <Route path="/student-login" element={<Navigate to="/login" replace />} />
      <Route path="/staff-login" element={<Navigate to="/login" replace />} />
      <Route path="/admin-login" element={<Navigate to="/login" replace />} />

      <Route
        path="/student-signup"
        element={
          <StudentSignupPage />
        }
      />

      <Route
        path="/student-home"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="STUDENT"
          >
            <StudentHome
              onLogout={logout}
              claims={studentClaims}
            />
          </RequireAuth>
        }
      />

      <Route
        path="/student-find-item"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="STUDENT"
          >
            <StudentFindItemPage items={items} />
          </RequireAuth>
        }
      />

      <Route
        path="/student-report-lost"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="STUDENT"
          >
            <StudentReportLostItemPage onSubmitClaim={handleAddClaim} />
          </RequireAuth>
        }
      />

      {/* Student Claims */}
      <Route
        path="/student-claims"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="STUDENT"
          >
            <StudentClaimsPage claims={studentClaims} />
          </RequireAuth>
        }
      />

      {/* Student Claim Details */}
      <Route
        path="/student-claims/:id"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="STUDENT"
          >
            <StudentClaimDetailsPage claims={studentClaims} />
          </RequireAuth>
        }
      />

      {/* Student Profile */}
      <Route
        path="/student-profile"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="STUDENT"
          >
            <StudentProfilePage onLogout={logout} />
          </RequireAuth>
        }
      />

      {/* ---
          STAFF
      --- */}

      <Route
        path="/staff-dashboard"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="STAFF"
          >
            <StaffDashboard
              items={items}
              onLogout={logout}
            />
          </RequireAuth>
        }
      />

      <Route
        path="/staff/items"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="STAFF"
          >
            <StaffManageItemsPage
              items={items}
            />
          </RequireAuth>
        }
      />

      <Route
        path="/staff/items/:id"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="STAFF"
          >
            <StaffItemDetailPage
              items={items}
              onUpdateItem={updateItem}
            />
          </RequireAuth>
        }
      />

      <Route
        path="/staff/report-item"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="STAFF"
          >
            <ReportFoundItemPage
              onSubmitItem={handleAddItem}
            />
          </RequireAuth>
        }
      />

      <Route
        path="/staff/claims"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="STAFF"
          >
            <StaffClaimsPage claims={studentClaims} />
          </RequireAuth>
        }
      />

      <Route
        path="/staff/claims/:id"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="STAFF"
          >
            <StaffClaimDetailsPage claims={studentClaims} />
          </RequireAuth>
        }
      />

      <Route
        path="/staff-profile"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="STAFF"
          >
            <StaffProfilePage onLogout={logout} />
          </RequireAuth>
        }
      />

      {/* ---
          ADMIN
      --- */}

      <Route
        path="/admin-dashboard"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="ADMIN"
          >
            <AdminDashboard
              onLogout={logout}
            />
          </RequireAuth>
        }
      />

      <Route
        path="/admin-users"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="ADMIN"
          >
            <AdminUsersPage />
          </RequireAuth>
        }
      />

      <Route
        path="/admin-categories"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="ADMIN"
          >
            <AdminCategoriesPage />
          </RequireAuth>
        }
      />

      <Route
        path="/admin-audit-logs"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="ADMIN"
          >
            <AdminAuditLogsPage />
          </RequireAuth>
        }
      />

      <Route
        path="/admin-api-integrations"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="ADMIN"
          >
            <AdminApiIntegrationsPage />
          </RequireAuth>
        }
      />

      <Route
        path="/admin-profile"
        element={
          <RequireAuth
            user={user}
            checkingAuth={checkingAuth}
            allowedRole="ADMIN"
          >
            <AdminProfilePage user={user!} onLogout={logout} />
          </RequireAuth>
        }
      />

      {/* ---
          FORGOT PASSWORD
      --- */}

      <Route
        path="/forgot-password"
        element={
          <ForgotPasswordPage />
        }
      />

      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* ---
          FALLBACK
      --- */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;
