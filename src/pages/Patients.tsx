import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Pagination from '@/components/ui/DataPagination';
import { getPatients, createUser as createPatientUser, getUsers } from '@/services/dataService';
import type { Patient } from '@/types';
import { Users, Search, Plus, X, Loader2 } from 'lucide-react';


export default function Patients() {
  const { user, isSuperAdmin } = useAuth();
  const { t } = useLanguage();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filtered, setFiltered] = useState<Patient[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', gender: 'MALE' as const, dateOfBirth: '', bloodType: '', phone: '', nationalId: '', address: '', emergencyName: '', emergencyPhone: '', allergies: '', chronicDiseases: '' });
  const ITEMS_PER_PAGE = 10;

  const hospitalId = isSuperAdmin ? undefined : user?.hospitalId;

  const load = useCallback(async () => {
    setIsLoading(true);
    const [p, u] = await Promise.all([getPatients(hospitalId), getUsers(hospitalId)]);
    setPatients(p);
    setFiltered(p);
    setUsers(u);
    setIsLoading(false);
  }, [hospitalId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let res = patients;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      res = res.filter((p: any) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.patientId?.toLowerCase().includes(q) ||
        p.phone?.includes(q) ||
        p.nationalId?.includes(q)
      );
    }
    setFiltered(res);
    setPage(1);
  }, [searchQuery, patients]);

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const receptionist = users.find((u: any) => u.role === 'RECEPTIONIST');
      await createPatientUser({
        ...form,
        patientId: `${user?.hospitalId || 'MED-001'}-2026-${String(patients.length + 1).padStart(4, '0')}`,
        hospitalId: hospitalId || '',
        registeredBy: receptionist?.id || user?.id || '',
        dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth) : undefined,
        bloodType: form.bloodType as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
      setShowAdd(false);
      setForm({ firstName: '', lastName: '', gender: 'MALE', dateOfBirth: '', bloodType: '', phone: '', nationalId: '', address: '', emergencyName: '', emergencyPhone: '', allergies: '', chronicDiseases: '' });
      load();
    } finally { setIsSubmitting(false); }
  };

  const formatBloodType = (bt: string) => bt?.replace('_', ' ').replace('POSITIVE', '+').replace('NEGATIVE', '-') || '-';

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f8fafc]">
      <Header title={t('patients')} subtitle={t('managePatients')} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder={t('searchPatients')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full h-10 pr-10 pl-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-right" />
            </div>
            <button onClick={() => setShowAdd(true)} className="h-10 px-4 bg-[#0f256e] text-white rounded-lg text-sm font-medium hover:bg-[#0f256e]/90 flex items-center gap-2 transition-colors"><Plus className="w-4 h-4" />{t('addPatient')}</button>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {[t('patientId'), t('patientName'), t('gender'), t('bloodType'), t('phone'), t('dateOfBirth')].map((h, i) => <th key={i} className="px-4 py-3 text-right font-medium text-gray-500 text-xs">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? Array.from({ length: 5 }).map((_, i) => <tr key={i} className="animate-pulse">{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>)}</tr>) : paginated.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-[11px] font-mono text-[#4a6fa5]">{p.patientId}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{p.firstName} {p.lastName}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{p.gender === 'MALE' ? t('male') : p.gender === 'FEMALE' ? t('female') : t('other')}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600">{formatBloodType(p.bloodType || '')}</span></td>
                      <td className="px-4 py-3 text-xs text-gray-500 font-mono">{p.phone || '-'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!isLoading && filtered.length === 0 && <div className="text-center py-12"><Users className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-gray-400 text-sm">{t('noData')}</p></div>}
            {filtered.length > 0 && <Pagination currentPage={page} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />}
          </div>
        </div>
      </main>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100"><h2 className="text-lg font-bold text-gray-900">{t('addPatient')}</h2><button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><X className="w-5 h-5 text-gray-400" /></button></div>
            <form onSubmit={handleSubmit} className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('firstName')}</label><input required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-right" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('lastName')}</label><input required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-right" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('gender')}</label><select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value as any })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20"><option value="MALE">{t('male')}</option><option value="FEMALE">{t('female')}</option></select></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('dateOfBirth')}</label><input type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('bloodType')}</label><select value={form.bloodType} onChange={e => setForm({ ...form, bloodType: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20"><option value="">-</option>{['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE'].map(bt => <option key={bt} value={bt}>{formatBloodType(bt)}</option>)}</select></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('phone')}</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-left" dir="ltr" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('nationalId')}</label><input value={form.nationalId} onChange={e => setForm({ ...form, nationalId: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-left" dir="ltr" /></div>
                <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">{t('address')}</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-right" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('emergencyName')}</label><input value={form.emergencyName} onChange={e => setForm({ ...form, emergencyName: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-right" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('emergencyPhone')}</label><input value={form.emergencyPhone} onChange={e => setForm({ ...form, emergencyPhone: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-left" dir="ltr" /></div>
                <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">{t('allergies')}</label><input value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-right" /></div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100"><button type="button" onClick={() => setShowAdd(false)} className="h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">{t('cancel')}</button><button type="submit" disabled={isSubmitting} className="h-10 px-6 bg-[#0f256e] text-white rounded-lg text-sm font-medium hover:bg-[#0f256e]/90 disabled:opacity-50 flex items-center gap-2">{isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}{t('save')}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
