import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';

// Public site
import Home from '@/pages/Home';
import Cabanas from '@/pages/Cabanas';
import Eventos from '@/pages/Eventos';
import ElFundo from '@/pages/ElFundo';
import Galeria from '@/pages/Galeria';
import Reservas from '@/pages/Reservas';
// Layout
import PublicLayout from '@/components/site/PublicLayout';
// Auth
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
// Admin
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import RegistroEntrada from '@/pages/admin/RegistroEntrada';
import Ingresos from '@/pages/admin/Ingresos';
import Solicitudes from '@/pages/admin/Solicitudes';
import Ocupacion from '@/pages/admin/Ocupacion';
import CabanasAdmin from '@/pages/admin/CabanasAdmin';
import Cuenta from '@/pages/admin/Cuenta';

const RedirectToLogin = () => {
  const location = useLocation();
  return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`} replace />;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();
  const needsAuth = location.pathname.startsWith("/admin");

  // Las páginas públicas no dependen de la sesión. Esperar aquí hacía que al
  // volver a una página pública se mostrara una pantalla completa de carga.
  if (needsAuth && (isLoadingPublicSettings || isLoadingAuth)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cabanas" element={<Cabanas />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/el-fundo" element={<ElFundo />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/reservas" element={<Reservas />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute unauthenticatedElement={<RedirectToLogin />} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/registro" element={<RegistroEntrada />} />
          <Route path="/admin/ingresos" element={<Ingresos />} />
          <Route path="/admin/solicitudes" element={<Solicitudes />} />
          <Route path="/admin/ocupacion" element={<Ocupacion />} />
          <Route path="/admin/cabanas" element={<CabanasAdmin />} />
          <Route path="/admin/cuenta" element={<Cuenta />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
