import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, RoleRoute } from './components/common/ProtectedRoute'
// import AppLayout from './components/layout/AppLayout'

// Auth
// import LoginPage from './pages/auth/LoginPage'
// import RegisterPage from './pages/auth/RegisterPage'

// // App pages
// import DashboardPage from './pages/admin/DashboardPage'
// import UsersListPage from './pages/admin/UsersListPage'
// import UserDetailPage from './pages/admin/UserDetailPage'
// import CreateUserPage from './pages/admin/CreateUserPage'
// import ProfilePage from './pages/user/ProfilePage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#5374baff',
              color: '#f0f4f8',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#111827' } },
            error: { iconTheme: { primary: '#f43f5e', secondary: '#111827' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Admin + Manager */}
              <Route element={<RoleRoute roles={['admin', 'manager']} />}>
                <Route path="/users" element={<UsersListPage />} />
                <Route path="/users/:id" element={<UserDetailPage />} />
              </Route>

              {/* Admin only */}
              <Route element={<RoleRoute roles={['admin']} />}>
                <Route path="/users/create" element={<CreateUserPage />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}