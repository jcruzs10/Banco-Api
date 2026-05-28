import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import ClientLayout from './layouts/ClientLayout';
import LoginView from './features/auth/LoginView';
import DashboardView from './features/client/DashboardView';
import TransferView from './features/client/TransferView';
import PaymentView from './features/client/PaymentView';
import AdminDashboardView from './features/admin/AdminDashboardView';
import { useAuthStore } from './store/authStore';

function App() {
  // Obtenemos el estado reactivo desde Zustand
  const { role, isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        
        {/* Rutas de Administrador */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute isAllowed={isAuthenticated && role === 'ADMIN'} redirectPath="/login" />
          }
        >
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="clientes" replace />} />
            <Route path="clientes" element={<AdminDashboardView />} />
            {/* Otras rutas admin */}
          </Route>
        </Route>

        {/* Rutas de Cliente */}
        <Route 
          path="/cliente/*" 
          element={
            <ProtectedRoute isAllowed={isAuthenticated && role === 'CLIENTE'} redirectPath="/login" />
          }
        >
          <Route element={<ClientLayout />}>
            <Route index element={<DashboardView />} />
            <Route path="transferencias" element={<TransferView />} />
            <Route path="pagos" element={<PaymentView />} />
          </Route>
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to={isAuthenticated ? (role === 'ADMIN' ? '/admin' : '/cliente') : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
