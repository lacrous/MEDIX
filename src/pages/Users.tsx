import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Building2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ZoneCard {
  id: number;
  name: string;
  icon: LucideIcon;
  color: string;
  subtitle: string;
}

export default function Users() {
  const { t } = useLanguage();
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const zones: ZoneCard[] = [
    { id: 1, name: 'المنطقة 1', icon: Building2, color: 'bg-blue-50 text-blue-600', subtitle: 'فرع المنطقة الاولى' },
    { id: 2, name: 'المنطقة 2', icon: Building2, color: 'bg-teal-50 text-teal-600', subtitle: 'فرع المنطقة الثانية' },
    { id: 3, name: 'المنطقة 3', icon: Building2, color: 'bg-amber-50 text-amber-600', subtitle: 'فرع المنطقة الثالثة' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f8fafc]">
      <Header title={t('employeesData')} />
      <main className="flex-1 p-6 flex items-center justify-center">
        <div className="max-w-7xl w-full mx-auto relative px-4">
          {/* Connecting Lines SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
            viewBox="0 0 800 500"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Line from Main to Zone 1 (bottom left) */}
            <line x1="320" y1="220" x2="180" y2="320" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 4" />
            {/* Line from Main to Zone 2 (bottom center) */}
            <line x1="400" y1="250" x2="400" y2="360" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 4" />
            {/* Line from Main to Zone 3 (bottom right) */}
            <line x1="480" y1="220" x2="620" y2="320" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 4" />
          </svg>

          {/* Cards Layout */}
          <div className="relative flex flex-col items-center gap-16" style={{ zIndex: 1 }}>
            {/* Main Card - Top */}
            <button
              onClick={() => navigate('/workers/zone/all')}
              className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all w-72 text-center border-2 border-[#0f256e]/10"
            >
              <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 overflow-hidden">
                <img
                  src="/images/manger.jpg"
                  alt="Manager"
                  className="w-24 h-24 object-cover rounded-full"
                />
              </div>
              <h3 className="font-bold text-[#0f256e] text-xl">ادارة الفرع</h3>
              <p className="text-xs text-gray-400 mt-1">
                {isSuperAdmin ? 'المدير العام' : user?.name || 'مدير الفرع'}
              </p>

            </button>

            {/* Zone Cards - Bottom Row */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              {zones.map((zone) => {
                const Icon = zone.icon;
                return (
                  <button
                    key={zone.id}
                    onClick={() => navigate(`/workers/zone/${zone.id}`)}
                    className="bg-white rounded-xl shadow-sm p-10 hover:shadow-md transition-all w-80 text-center"
                  >
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 ${zone.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base">{zone.name}</h3>
                    <p className="text-xs text-gray-400 mt-2">{zone.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
