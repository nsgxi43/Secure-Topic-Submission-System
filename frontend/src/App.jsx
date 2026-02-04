import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PublicVerification from './pages/PublicVerification';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<PublicVerification />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Protected Routes */}
          <Route element={<Layout><ProtectedRoute allowedRoles={['student']} /></Layout>}>
            <Route path="/student" element={<StudentDashboard />} />
          </Route>

          <Route element={<Layout><ProtectedRoute allowedRoles={['teacher']} /></Layout>}>
            <Route path="/teacher" element={<TeacherDashboard />} />
          </Route>

          <Route element={<Layout><ProtectedRoute allowedRoles={['admin']} /></Layout>}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
