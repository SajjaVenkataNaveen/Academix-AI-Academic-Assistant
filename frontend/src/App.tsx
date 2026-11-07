import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { ChatPage } from './pages/ChatPage';
import { DashboardPage } from './pages/DashboardPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export default function App() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route element={<ProtectedRoute />}><Route element={<AppLayout />}><Route path="/dashboard" element={<DashboardPage />} /><Route path="/documents" element={<DocumentsPage />} /></Route></Route>
    <Route element={<ProtectedRoute />}><Route path="/chat" element={<ChatPage />} /><Route path="/chat/:id" element={<ChatPage />} /></Route>
    <Route element={<ProtectedRoute roles={['ADMIN']} />}><Route element={<AppLayout />}><Route path="/admin/users" element={<AdminUsersPage />} /></Route></Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>;
}
