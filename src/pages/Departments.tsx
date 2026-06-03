import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import { getDepartments, getUsers } from '@/services/dataService';
import { Building2, Users, Stethoscope, BedSingle } from 'lucide-react';

export default function Departments() {
  const { user, isSuperAdmin } = useAuth();
  const { t } = useLanguage();
  const [departments, setDepartments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const hospitalId = isSuperAdmin ? undefined : user?.hospitalId;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [d, u] = await Promise.all([getDepartments(hospitalId), getUsers(hospitalId)]);
    setDepartments(d);
    setUsers(u);
    setIsLoading(false);
  }, [hospitalId]);

  useEffect(() => { loadData(); }, [loadData]);

  const deptStats = departments.map(d => ({
    ...d,
    doctors: users.filter(u => u.role === 'DOCTOR' && u.departmentId === d.id).length,
    nurses: users.filter(u => u.role === 'NURSE' && u.departmentId === d.id).length,
  }));

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f8fafc]">
      <Header title={t('departments')} subtitle={t('manageHospitals')} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="bg-white rounded-xl p-5 shadow-sm animate-pulse h-32" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deptStats.map(d => (
                <div key={d.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#e8f0f8] flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-[#0f256e]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{d.name}</h3>
                      <p className="text-[11px] text-gray-400">{d.nameEn}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-50">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Stethoscope className="w-3 h-3 text-teal-500" />
                        <span className="text-sm font-bold text-gray-900">{d.doctors}</span>
                      </div>
                      <p className="text-[10px] text-gray-400">{t('doctors')}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="w-3 h-3 text-blue-500" />
                        <span className="text-sm font-bold text-gray-900">{d.nurses}</span>
                      </div>
                      <p className="text-[10px] text-gray-400">{t('nurses')}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <BedSingle className="w-3 h-3 text-amber-500" />
                        <span className="text-sm font-bold text-gray-900">-</span>
                      </div>
                      <p className="text-[10px] text-gray-400">{t('beds')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
