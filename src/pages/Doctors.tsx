import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Pagination from '@/components/ui/DataPagination';
import { getUsers, getDepartments, createUser } from '@/services/dataService';
import { Search, Plus, X, Loader2, Stethoscope } from 'lucide-react';


export default function Doctors() {
  const { user, isSuperAdmin } = useAuth();
  const { t } = useLanguage();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', specialization: '', licenseNumber: '', departmentId: '' });
  const ITEMS_PER_PAGE = 10;

  const hospitalId = isSuperAdmin ? undefined : user?.hospitalId;

  const load = useCallback(async () => {
    setIsLoading(true);
    const [u, d] = await Promise.all([getUsers(hospitalId), getDepartments(hospitalId)]);
    const docs = u.filter((x: any) => x.role === 'DOCTOR');
    setDoctors(docs);
    setFiltered(docs);
    setDepartments(d);
    setIsLoading(false);
  }, [hospitalId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let res = doctors;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      res = res.filter((d: any) =>
        d.name.toLowerCase().includes(q) ||
        (d.specialization && d.specialization.toLowerCase().includes(q)) ||
        (d.email && d.email.toLowerCase().includes(q)) ||
        (d.phone && d.phone.includes(q))
      );
    }
    setFiltered(res);
    setPage(1);
  }, [searchQuery, doctors]);

  // const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createUser({
        ...form,
        role: 'DOCTOR',
        password: 'Medix2026!',
        hospitalId: hospitalId || '',
        status: 'ACTIVE',
      });
      setShowAdd(false);
      setForm({ name: '', email: '', phone: '', specialization: '', licenseNumber: '', departmentId: '' });
      load();
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f8fafc]">
      <Header title={t('doctors')} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchDoctors')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-10 pr-10 pl-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-right"
              />
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="h-10 px-4 bg-[#0f256e] text-white rounded-lg text-sm font-medium hover:bg-[#0f256e]/90 flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('addDoctor')}
            </button>
          </div>

          {/* Count */}
          <div className="mb-4 text-xs text-gray-400">
            {t('totalItems')}: <span className="font-bold text-gray-600">{filtered.length}</span>
            {searchQuery && <> · {t('search')}: "{searchQuery}"</>}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {[t('name'), t('specialization'), t('department'), t('phone'), t('licenseNumber'), t('actions')].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-right font-medium text-gray-500 text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>
                        ))}
                      </tr>
                    ))
                  ) : paginated.map(doc => {
                    const dept = departments.find((d: any) => d.id === doc.departmentId);
                    return (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-sm">
                              {doc.name?.charAt(0) || 'D'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{doc.name}</p>
                              <p className="text-[11px] text-gray-400">{doc.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{doc.specialization || '-'}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{dept?.name || '-'}</td>
                        <td className="px-4 py-3 text-xs text-gray-500 font-mono">{doc.phone || '-'}</td>
                        <td className="px-4 py-3 text-xs text-gray-500 font-mono">{doc.licenseNumber || '-'}</td>
                        <td className="px-4 py-3">
                          <button className="h-7 px-2 text-xs text-[#0f256e] bg-[#e8f0f8] rounded-md hover:bg-[#d4e3f3] transition-colors">
                            {t('view')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {!isLoading && filtered.length === 0 && (
              <div className="text-center py-12">
                <Stethoscope className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">{searchQuery ? t('noDoctorsFound') : t('noData')}</p>
              </div>
            )}

            {filtered.length > 0 && (
              <Pagination
                currentPage={page}
                totalItems={filtered.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      </main>

      {/* Add Doctor Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{t('addDoctor')}</h2>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{t('name')}</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-right" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{t('email')}</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-left" dir="ltr" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{t('phone')}</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-left" dir="ltr" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{t('specialization')}</label>
                <input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-right" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{t('licenseNumber')}</label>
                <input value={form.licenseNumber} onChange={e => setForm({ ...form, licenseNumber: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-left" dir="ltr" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{t('department')}</label>
                <select value={form.departmentId} onChange={e => setForm({ ...form, departmentId: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20">
                  <option value="">-</option>
                  {departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowAdd(false)} className="h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">{t('cancel')}</button>
                <button type="submit" disabled={isSubmitting} className="h-10 px-6 bg-[#0f256e] text-white rounded-lg text-sm font-medium hover:bg-[#0f256e]/90 disabled:opacity-50 flex items-center gap-2">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
