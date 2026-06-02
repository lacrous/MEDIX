import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Pagination from '@/components/ui/DataPagination';
import { getUsers, getDepartments } from '@/services/dataService';
import { Search, HeartPulse } from 'lucide-react';

export default function Nurses() {
  const { user, isSuperAdmin } = useAuth();
  const { t } = useLanguage();
  const [nurses, setNurses] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;

  const hospitalId = isSuperAdmin ? undefined : user?.hospitalId;

  const load = useCallback(async () => {
    setIsLoading(true);
    const [u, d] = await Promise.all([getUsers(hospitalId), getDepartments(hospitalId)]);
    const list = u.filter((x: any) => x.role === 'NURSE');
    setNurses(list);
    setFiltered(list);
    setDepartments(d);
    setIsLoading(false);
  }, [hospitalId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let res = nurses;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      res = res.filter((n: any) => n.name.toLowerCase().includes(q) || (n.email && n.email.toLowerCase().includes(q)));
    }
    setFiltered(res);
    setPage(1);
  }, [searchQuery, nurses]);

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f8fafc]">
      <Header title={t('nurses')} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder={t('search')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full h-10 pr-10 pl-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-right" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {[t('name'), t('department'), t('phone'), t('status')].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-right font-medium text-gray-500 text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">{Array.from({ length: 4 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>)}</tr>
                  )) : paginated.map(nurse => {
                    const dept = departments.find((d: any) => d.id === nurse.departmentId);
                    return (
                      <tr key={nurse.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 font-bold text-sm">{nurse.name?.charAt(0)}</div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{nurse.name}</p>
                              <p className="text-[11px] text-gray-400">{nurse.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{dept?.name || '-'}</td>
                        <td className="px-4 py-3 text-xs text-gray-500 font-mono">{nurse.phone || '-'}</td>
                        <td className="px-4 py-3"><span className="w-2 h-2 rounded-full inline-block bg-green-500" /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {!isLoading && filtered.length === 0 && (
              <div className="text-center py-12"><HeartPulse className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-gray-400 text-sm">{t('noData')}</p></div>
            )}
            {filtered.length > 0 && <Pagination currentPage={page} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />}
          </div>
        </div>
      </main>
    </div>
  );
}
