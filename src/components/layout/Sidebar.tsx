import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, CalendarDays, Stethoscope, HeartPulse,
  Building2, Bed, Pill, Package, BarChart3, Settings, ShieldCheck,
  LogOut, Hospital
} from 'lucide-react';

const navItems = [
  { label: 'dashboard' as const, icon: LayoutDashboard, path: '/' },
  { label: 'patients' as const, icon: Users, path: '/patients' },
  { label: 'appointments' as const, icon: CalendarDays, path: '/appointments' },
  { label: 'doctors' as const, icon: Stethoscope, path: '/doctors' },
  { label: 'nurses' as const, icon: HeartPulse, path: '/nurses' },
  { label: 'departments' as const, icon: Building2, path: '/departments' },
  { label: 'beds' as const, icon: Bed, path: '/beds' },
  { label: 'pharmacy' as const, icon: Pill, path: '/pharmacy' },
  { label: 'inventory' as const, icon: Package, path: '/inventory' },
  { label: 'reports' as const, icon: BarChart3, path: '/reports' },
  { label: 'settings' as const, icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isSuperAdmin, logout } = useAuth();
  const { t, direction } = useLanguage();

  const filteredItems = navItems;

  return (
    <aside className={cn(
      "fixed top-0 h-full bg-white border-l border-gray-200 z-40 flex flex-col transition-all duration-300",
      direction === 'rtl' ? 'right-0 border-r-0' : 'left-0 border-r border-l-0'
    )} style={{ width: 260 }}>
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0f256e] flex items-center justify-center">
            <Hospital className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#0f256e] leading-tight">{t('appName')}</h1>
            <p className="text-[10px] text-gray-400 leading-tight">{t('appSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {filteredItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-[#e8f0f8] text-[#0f256e]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-[#0f256e]" : "text-gray-400")} />
                <span className="flex-1 text-right">{t(item.label)}</span>
                {isActive && (
                  <div className={cn(
                    "w-1 h-5 rounded-full bg-[#0f256e]",
                    direction === 'rtl' ? 'mr-auto' : 'ml-auto'
                  )} />
                )}
              </button>
            );
          })}
        </div>

        {/* Super Admin Section */}
        {isSuperAdmin && (
          <div className="mt-6">
            <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {t('superAdmin')}
            </div>
            <div className="space-y-1">
              <button
                onClick={() => navigate('/hospitals')}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  location.pathname === '/hospitals'
                    ? "bg-[#e8f0f8] text-[#0f256e]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Hospital className={cn("w-5 h-5 flex-shrink-0", location.pathname === '/hospitals' ? "text-[#0f256e]" : "text-gray-400")} />
                <span className="flex-1 text-right">{t('hospitals')}</span>
                {location.pathname === '/hospitals' && (
                  <div className={cn("w-1 h-5 rounded-full bg-[#0f256e]", direction === 'rtl' ? 'mr-auto' : 'ml-auto')} />
                )}
              </button>
              <button
                onClick={() => navigate('/users')}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  location.pathname === '/users'
                    ? "bg-[#e8f0f8] text-[#0f256e]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <ShieldCheck className={cn("w-5 h-5 flex-shrink-0", location.pathname === '/users' ? "text-[#0f256e]" : "text-gray-400")} />
                <span className="flex-1 text-right">{t('users')}</span>
                {location.pathname === '/users' && (
                  <div className={cn("w-1 h-5 rounded-full bg-[#0f256e]", direction === 'rtl' ? 'mr-auto' : 'ml-auto')} />
                )}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-9 h-9 rounded-full bg-[#e8f0f8] flex items-center justify-center text-[#0f256e] font-semibold text-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role === 'SUPER_ADMIN' ? t('superAdmin') : t('hospitalAdmin')}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}
