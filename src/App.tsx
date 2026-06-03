import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { useEffect } from 'react';
import { seedDatabase } from '@/db/seed';
import { seedZones } from '@/db/seedZones';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Hospitals from '@/pages/Hospitals';
import Patients from '@/pages/Patients';
import Users from '@/pages/Users';
import Appointments from '@/pages/Appointments';
import Departments from '@/pages/Departments';
import Doctors from '@/pages/Doctors';
import Nurses from '@/pages/Nurses';
import ZoneWorkers from '@/pages/ZoneWorkers';
import Beds from '@/pages/Beds';
import Pharmacy from '@/pages/Pharmacy';
import Inventory from '@/pages/Inventory';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import { Loader2 } from 'lucide-react';

function Layout({ children }: { children: React.ReactNode }) {
  const { direction } = useLanguage();
  const { collapsed } = useSidebar();
  const sidebarWidth = collapsed ? 72 : 260;
  return (
    <div className="flex min-h-screen bg-[#f8fafc]" dir={direction}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen transition-all duration-300" style={{ marginRight: direction === 'rtl' ? sidebarWidth : 0, marginLeft: direction === 'rtl' ? 0 : sidebarWidth }}>
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

function ProtectedRoute({ children, superAdminOnly = false }: { children: React.ReactNode; superAdminOnly?: boolean }) {
  const { isAuthenticated, isLoading, isSuperAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f0f8] to-[#d4e3f3] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#0f256e] mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (superAdminOnly && !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    seedDatabase();
    seedZones();
  }, []);

  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/hospitals" element={<ProtectedRoute superAdminOnly><Hospitals /></ProtectedRoute>} />
      <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute superAdminOnly><Users /></ProtectedRoute>} />
      <Route path="/workers/zone/:zoneId" element={<ProtectedRoute><ZoneWorkers /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
      <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
      <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
      <Route path="/nurses" element={<ProtectedRoute><Nurses /></ProtectedRoute>} />
      <Route path="/beds" element={<ProtectedRoute><Beds /></ProtectedRoute>} />
      <Route path="/pharmacy" element={<ProtectedRoute><Pharmacy /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  const { direction } = useLanguage();

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = direction === 'rtl' ? 'ar' : 'en';
  }, [direction]);

  return (
    <SidebarProvider>
      <AppRoutes />
    </SidebarProvider>
  );
}
