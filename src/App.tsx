import { useState, useEffect, type ReactNode } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
} from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';

import type { Role, Item, StudentClaim } from './types';

interface DecodedToken {
  sub: string;
  role: string;
  ver: number;
  exp: number;
  iat: number;
}

import {
  loginPages,
} from './data/mockData';
import { api } from './utils';

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
import { StaffLostReportsPage } from './pages/StaffLostReportsPage';

import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminAuditLogsPage } from './pages/AdminAuditLogsPage';
import { AdminApiIntegrationsPage } from './pages/AdminApiIntegrationsPage';
import { AdminProfilePage } from './pages/AdminProfilePage';

import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AIChatbot } from './components/AIChatbot';

import './App.css';

// ==========================================
// FRONTEND ROLE PROTECTION
// ==========================================

function RequireAuth({
  currentRole,
  allowedRole,
  loginPath,
  children,
}: {
  currentRole: Role;
  allowedRole: Exclude<Role, null>;
  loginPath: string;
  children: ReactNode;
}) {
  if (currentRole === allowedRole) {
    return <>{children}</>;
  }

  // If they are logged in but have the wrong role, redirect them to their actual dashboard
  if (currentRole) {
    if (currentRole === 'student') return <Navigate to="/student-home" replace />;
    if (currentRole === 'staff') return <Navigate to="/staff-dashboard" replace />;
    if (currentRole === 'admin') return <Navigate to="/admin-dashboard" replace />;
  }

  // Not logged in, go to the requested login page
  return <Navigate to={loginPath} replace />;
}

function RequireGuest({
  currentRole,
  children,
}: {
  currentRole: Role | null;
  children: ReactNode;
}) {
  if (!currentRole) {
    return <>{children}</>;
  }

  // Already logged in, redirect to correct dashboard
  if (currentRole === 'student') return <Navigate to="/student-home" replace />;
  if (currentRole === 'staff') return <Navigate to="/staff-dashboard" replace />;
  if (currentRole === 'admin') return <Navigate to="/admin-dashboard" replace />;
  
  return <Navigate to="/" replace />;
}

function App() {
  const navigate = useNavigate();

  const [items, setItems] = useState<Item[]>([]);
  const [role, setRole] = useState<Role | null>(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      // Check expiration manually if needed, though usually backend rejects
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        return null;
      }
      return decoded.role.toLowerCase() as Role;
    } catch (e) {
      console.error('Invalid token format');
      localStorage.removeItem('token');
      return null;
    }
  });
  const [studentClaims, setStudentClaims] = useState<StudentClaim[]>([]);

  async function handleUpdateItem(item: Item) {
    try {
      await api.patch(`/items/${item.id}`, {
        title: item.title,
        description: item.description,
        location: item.location,
        status: item.status
      });
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  }

  function fetchItems() {
    api.get('/items').then(setItems).catch(console.error);
  }

  useEffect(() => {
    // Fetch immediately
    fetchItems();
    
    const fetchClaims = () => {
      if (role === 'student') {
        api.get('/claims/my').then(setStudentClaims).catch(console.error);
      } else if (role === 'staff') {
        api.get('/claims').then(setStudentClaims).catch(console.error);
      }
    };
    
    fetchClaims();

    // Poll items and claims every 5 seconds for real-time updates
    const interval = setInterval(() => {
      fetchItems();
      fetchClaims();
    }, 5000);

    const handleAuthError = () => {
      if (role) {
        localStorage.removeItem('token');
        setRole(null);
        navigate('/');
      }
    };
    window.addEventListener('auth_error', handleAuthError);

    return () => {
      clearInterval(interval);
      window.removeEventListener('auth_error', handleAuthError);
    };
  }, [role, navigate]);

  

  // ==========================================
  // LOGIN
  // ==========================================

  function loginAs(newRole: Role, redirectPath?: string) {
    setRole(newRole);

    if (redirectPath) {
      navigate(redirectPath);
      return;
    }

    if (newRole === 'student') {
      navigate('/student-home');
      return;
    }

    if (newRole === 'staff') {
      navigate('/staff-dashboard');
      return;
    }

    if (newRole === 'admin') {
      navigate('/admin-dashboard');
      return;
    }
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  async function logout() {
    try {
      await api.post('/auth/logout', {});
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      localStorage.removeItem('token');
      setRole(null);
      navigate('/');
    }
  }

  // ==========================================
  // ADD FOUND ITEM
  // ==========================================



  // ==========================================
  // UPDATE ITEM
  // ==========================================



  return (
    <>
      <Routes>

        {/* ======================================
          PUBLIC
      ====================================== */}

      <Route
        path="/"
        element={
          <HomePage items={items} role={role} onLogout={logout} />
        }
      />

      <Route
        path="/item/:id"
        element={
          <ItemDetailPage items={items} currentRole={role} />
        }
      />

      {/* ======================================
          STUDENT
      ====================================== */}

      <Route
        path="/student-login"
        element={
          <RequireGuest currentRole={role}>
            <LoginPage
              {...loginPages['/student-login']}
              onLogin={(newRole, redirect) => loginAs(newRole, redirect)}
            />
          </RequireGuest>
        }
      />

      <Route
        path="/student-signup"
        element={
          <RequireGuest currentRole={role}>
            <StudentSignupPage />
          </RequireGuest>
        }
      />

      <Route
        path="/student-report-lost"
        element={
          <RequireAuth
            currentRole={role}
            allowedRole="student"
            loginPath="/student-login"
          >
            <StudentReportLostItemPage onItemReported={fetchItems} />
          </RequireAuth>
        }
      />

      <Route
        path="/student-home"
        element={
          <RequireAuth
            currentRole={role}
            allowedRole="student"
            loginPath="/student-login"
          >
            <StudentHome
              onLogout={logout}
              claims={studentClaims}
              items={items}
            />
          </RequireAuth>
        }
      />

      <Route
        path="/student-find-item"
        element={
          <RequireAuth
            currentRole={role}
            allowedRole="student"
            loginPath="/student-login"
          >
            <StudentFindItemPage items={items} />
          </RequireAuth>
        }
      />


      {/* Student Claims */}
      <Route
        path="/student-claims"
        element={
          <RequireAuth
            currentRole={role}
            allowedRole="student"
            loginPath="/student-login"
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
            currentRole={role}
            allowedRole="student"
            loginPath="/student-login"
          >
            <StudentClaimDetailsPage />
          </RequireAuth>
        }
      />

      {/* Student Profile */}
      <Route
        path="/student-profile"
        element={
          <RequireAuth
            currentRole={role}
            allowedRole="student"
            loginPath="/student-login"
          >
            <StudentProfilePage onLogout={logout} />
          </RequireAuth>
        }
      />

      {/* ======================================
          STAFF
      ====================================== */}

      <Route
        path="/staff-login"
        element={
          <RequireGuest currentRole={role}>
            <LoginPage
              {...loginPages['/staff-login']}
              onLogin={(newRole, redirect) => loginAs(newRole, redirect)}
            />
          </RequireGuest>
        }
      />

      <Route
        path="/staff-dashboard"
        element={
          <RequireAuth
            currentRole={role}
            allowedRole="staff"
            loginPath="/staff-login"
          >
            <StaffDashboard
              items={items}
            />
          </RequireAuth>
        }
      />

      <Route
        path="/staff/items"
        element={
          <RequireAuth
            currentRole={role}
            allowedRole="staff"
            loginPath="/staff-login"
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
            currentRole={role}
            allowedRole="staff"
            loginPath="/staff-login"
          >
            <StaffItemDetailPage
              items={items}
              onUpdateItem={handleUpdateItem}
            />
          </RequireAuth>
        }
      />

      <Route
        path="/staff/report-item"
        element={
          <RequireAuth
            currentRole={role}
            allowedRole="staff"
            loginPath="/staff-login"
          >
            <ReportFoundItemPage
              onItemReported={fetchItems}
            />
          </RequireAuth>
        }
      />

      <Route
        path="/staff/claims"
        element={
          <RequireAuth
            currentRole={role}
            allowedRole="staff"
            loginPath="/staff-login"
          >
            <StaffClaimsPage claims={studentClaims} />
          </RequireAuth>
        }
      />

      <Route
        path="/staff/claims/:id"
        element={
          <RequireAuth
            currentRole={role}
            allowedRole="staff"
            loginPath="/staff-login"
          >
            <StaffClaimDetailsPage />
          </RequireAuth>
        }
      />

      <Route
        path="/staff/lost-reports"
        element={
          <RequireAuth
            currentRole={role}
            allowedRole="staff"
            loginPath="/staff-login"
          >
            <StaffLostReportsPage items={items} onUpdate={fetchItems} />
          </RequireAuth>
        }
      />

      <Route
        path="/staff-profile"
        element={
          <RequireAuth
            currentRole={role}
            allowedRole="staff"
            loginPath="/staff-login"
          >
            <StaffProfilePage onLogout={logout} />
          </RequireAuth>
        }
      />

      {/* ======================================
          ADMIN
      ====================================== */}

      <Route
        path="/admin-login"
        element={
          <RequireGuest currentRole={role}>
            <LoginPage
              {...loginPages['/admin-login']}
              onLogin={() => loginAs('admin')}
            />
          </RequireGuest>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <RequireAuth
            currentRole={role}
            allowedRole="admin"
            loginPath="/admin-login"
          >
            <AdminDashboard />
          </RequireAuth>
        }
      />

      <Route
        path="/admin-users"
        element={
          <RequireAuth
            currentRole={role}
            allowedRole="admin"
            loginPath="/admin-login"
          >
            <AdminUsersPage />
          </RequireAuth>
        }
      />

      <Route
        path="/admin-categories"
        element={
          <RequireAuth
            currentRole={role}
            allowedRole="admin"
            loginPath="/admin-login"
          >
            <AdminCategoriesPage />
          </RequireAuth>
        }
      />

      <Route
        path="/admin-audit-logs"
        element={
          <RequireAuth
            currentRole={role}
            allowedRole="admin"
            loginPath="/admin-login"
          >
            <AdminAuditLogsPage />
          </RequireAuth>
        }
      />

      <Route
        path="/admin-api-integrations"
        element={
          <RequireAuth
            currentRole={role}
            allowedRole="admin"
            loginPath="/admin-login"
          >
            <AdminApiIntegrationsPage />
          </RequireAuth>
        }
      />

      <Route
        path="/admin-profile"
        element={
          <RequireAuth
            currentRole={role}
            allowedRole="admin"
            loginPath="/admin-login"
          >
            <AdminProfilePage onLogout={logout} />
          </RequireAuth>
        }
      />

      {/* ======================================
          FORGOT PASSWORD
      ====================================== */}

      <Route
        path="/forgot-password"
        element={
          <ForgotPasswordPage />
        }
      />

      {/* ======================================
          FALLBACK
      ====================================== */}

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
      
      {role === 'student' && <AIChatbot />}
    </>
  );
}

export default App;