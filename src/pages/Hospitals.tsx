import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import { getHospitals, getHospitalStats } from '@/services/dataService';
import type { Hospital } from '@/types';
import { Hospital as HospitalIcon, Users, Stethoscope, BedSingle, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HospitalWithStats extends Hospital {
  stats?: {
    patients: number;
    doctors: number;
    beds: number;
    occupancy: number;
  };
}

export default function Hospitals() {
  const { t } = useLanguage();
  const [hospitals, setHospitals] = useState<HospitalWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const h = await getHospitals();
      const withStats = await Promise.all(h.map(async (hospital) => {
        try {
          const s = await getHospitalStats(hospital.id);
          return { ...hospital, stats: { patients: s.patients.total, doctors: s.users.doctors, beds: s.beds.total, occupancy: Math.round((s.beds.occupied / s.beds.total) * 100) } };
        } catch {
          return { ...hospital, stats: { patients: 0, doctors: 0, beds: 0, occupancy: 0 } };
        }
      }));
      setHospitals(withStats);
      setIsLoading(false);
    };
    load();
  }, []);

  const statusConfig: Record<string, { color: string; icon: any }> = {
    ACTIVE: { color: 'bg-green-50 text-green-600', icon: CheckCircle },
    INACTIVE: { color: 'bg-gray-50 text-gray-500', icon: XCircle },
    SUSPENDED: { color: 'bg-red-50 text-red-600', icon: AlertTriangle },
    MAINTENANCE: { color: 'bg-amber-50 text-amber-600', icon: AlertTriangle },
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f8fafc]">
      <Header title={t('hospitals')} subtitle={t('manageHospitals')} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                  <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hospitals.map(h => {
                const sc = statusConfig[h.status] || statusConfig.ACTIVE;
                return (
                  <div key={h.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all group">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", sc.color)}>
                          <HospitalIcon className="w-5 h-5" />
                        </div>
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1", sc.color)}>
                          <sc.icon className="w-3 h-3" />
                          {t(h.status.toLowerCase() as any)}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-0.5">{h.name}</h3>
                      <p className="text-xs text-gray-400 mb-1">{h.nameEn}</p>
                      <p className="text-[11px] text-gray-400 mb-3">{h.address}</p>

                      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-50">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <Users className="w-3 h-3 text-blue-500" />
                            <span className="text-sm font-bold text-gray-900">{h.stats?.patients || 0}</span>
                          </div>
                          <p className="text-[10px] text-gray-400">{t('patients')}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <Stethoscope className="w-3 h-3 text-teal-500" />
                            <span className="text-sm font-bold text-gray-900">{h.stats?.doctors || 0}</span>
                          </div>
                          <p className="text-[10px] text-gray-400">{t('doctors')}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <BedSingle className="w-3 h-3 text-amber-500" />
                            <span className="text-sm font-bold text-gray-900">{h.stats?.beds || 0}</span>
                          </div>
                          <p className="text-[10px] text-gray-400">{t('beds')}</p>
                        </div>
                      </div>

                      {h.stats && (
                        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                          <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {t('bedOccupancy')}
                          </span>
                          <div className="flex items-center gap-2 flex-1 mx-3">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#0f256e] rounded-full transition-all" style={{ width: `${h.stats.occupancy}%` }} />
                            </div>
                            <span className="text-[11px] font-semibold text-gray-700">{h.stats.occupancy}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
