import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, CalendarDays, Stethoscope, HeartPulse,
  Building2, Bed, Pill, Package, BarChart3, Settings,
  LogOut, PanelRightClose, PanelLeftClose, UserCog
} from 'lucide-react';

const navItems = [
  { label: 'dashboard' as const, icon: LayoutDashboard, path: '/' },
  { label: 'employeesData' as const, icon: UserCog, path: '/users' },
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
  const { collapsed, toggleCollapsed } = useSidebar();

  const filteredItems = isSuperAdmin
    ? navItems
    : navItems.filter(item => item.path !== '/users');

  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <aside
      className={cn(
        "fixed top-0 h-full bg-white border-l border-gray-200 z-40 flex flex-col transition-all duration-300",
        direction === 'rtl' ? 'right-0 border-r-0' : 'left-0 border-r border-l-0'
      )}
      style={{ width: sidebarWidth }}
    >
      {/* Collapse Toggle */}
      <button
        onClick={toggleCollapsed}
        className={cn(
          "absolute top-3 z-50 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 border border-gray-200",
          direction === 'rtl'
            ? (collapsed ? '-left-3.5' : '-left-3.5')
            : (collapsed ? '-right-3.5' : '-right-3.5')
        )}
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        {collapsed ? (
          direction === 'rtl' ? (
            <PanelLeftClose className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <PanelRightClose className="w-3.5 h-3.5 text-gray-500" />
          )
        ) : (
          direction === 'rtl' ? (
            <PanelRightClose className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <PanelLeftClose className="w-3.5 h-3.5 text-gray-500" />
          )
        )}
      </button>

      {/* Logo */}
      <div className={cn(
        "h-16 flex items-center border-b border-gray-100 transition-all duration-300",
        collapsed ? "justify-center px-2" : "px-4"
      )}>
        <div className={cn(
          "flex items-center transition-all duration-300",
          collapsed ? "gap-0 justify-center" : "gap-2.5"
        )}>
          <img
            src="/images/health-insurance-logo.png"
            alt="الهيئة العامة للتأمين الصحي"
            className="object-contain flex-shrink-0 transition-all duration-300"
            style={{ width: collapsed ? 36 : 40, height: collapsed ? 36 : 40 }}
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-[#0f256e] leading-tight whitespace-nowrap">
                فرع البحيرة
              </h1>
              <p className="text-[10px] text-gray-400 leading-tight font-bold whitespace-nowrap">
                للتأمين الصحي
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {filteredItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-[#e8f0f8] text-[#0f256e]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
                )}
                title={collapsed ? t(item.label) : undefined}
              >
                <item.icon className={cn(
                  "flex-shrink-0",
                  isActive ? "text-[#0f256e]" : "text-gray-400",
                  collapsed ? "w-5 h-5" : "w-5 h-5"
                )} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-right whitespace-nowrap">{t(item.label)}</span>
                    {isActive && (
                      <div className={cn(
                        "w-1 h-5 rounded-full bg-[#0f256e] flex-shrink-0",
                        direction === 'rtl' ? 'mr-auto' : 'ml-auto'
                      )} />
                    )}
                  </>
                )}
                {collapsed && isActive && (
                  <div className="absolute w-1 h-5 rounded-full bg-[#0f256e]"
                    style={{ [direction === 'rtl' ? 'right' : 'left']: 0 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Super Admin Section */}
        {isSuperAdmin && !collapsed && (
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
                <Building2 className={cn("w-5 h-5 flex-shrink-0", location.pathname === '/hospitals' ? "text-[#0f256e]" : "text-gray-400")} />
                <span className="flex-1 text-right">{t('hospitals')}</span>
                {location.pathname === '/hospitals' && (
                  <div className={cn("w-1 h-5 rounded-full bg-[#0f256e]", direction === 'rtl' ? 'mr-auto' : 'ml-auto')} />
                )}
              </button>
            </div>
          </div>
        )}

        {isSuperAdmin && collapsed && (
          <div className="mt-4 space-y-1">
            <button
              onClick={() => navigate('/hospitals')}
              className={cn(
                "w-full flex items-center justify-center px-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                location.pathname === '/hospitals'
                  ? "bg-[#e8f0f8] text-[#0f256e]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
              title={t('hospitals')}
            >
              <Building2 className={cn("w-5 h-5", location.pathname === '/hospitals' ? "text-[#0f256e]" : "text-gray-400")} />
            </button>
          </div>
        )}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-gray-100 p-2">
        <div className={cn(
          "flex items-center gap-3 mb-3",
          collapsed ? "justify-center px-0" : "px-1"
        )}>
          <div className="w-9 h-9 rounded-full bg-[#e8f0f8] flex items-center justify-center text-[#0f256e] font-semibold text-sm flex-shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.role === 'SUPER_ADMIN' ? t('superAdmin') : t('hospitalAdmin')}</p>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors",
            collapsed ? "justify-center px-2 py-2" : "gap-2 px-3 py-2"
          )}
          title={collapsed ? t('logout') : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>{t('logout')}</span>}
        </button>
      </div>
    </aside>
  );
}
