import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Pagination from '@/components/ui/DataPagination';
import { getUsersByZone, getUsers, getDepartments, createUser } from '@/services/dataService';
import { Users as UsersIcon, Search, Plus, X, Loader2, ArrowRight, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROLE_OPTIONS = [
  'طبيب بشري',
  'طبيب اسنان',
  'صيدلي',
  'كيميائي',
  'اخصائي مختبرات طبية',
  'اخصائي اشعة',
  'مشرفة تمريض',
  'فني معمل',
  'فني اشعة',
  'فني اسنان',
  'تمريض',
  'محاسب',
  'شئون قانوينية',
  'شئون مالية',
  'شئون ادارية',
  'كاتب',
  'فني هندسة',
  'سائق',
  'امين مخزن',
  'مندوب صرف',
];

const roleColors: Record<string, string> = {
  'طبيب بشري': 'bg-teal-100 text-teal-700',
  'طبيب اسنان': 'bg-teal-100 text-teal-700',
  'صيدلي': 'bg-purple-100 text-purple-700',
  'كيميائي': 'bg-indigo-100 text-indigo-700',
  'اخصائي مختبرات طبية': 'bg-gray-100 text-gray-700',
  'اخصائي اشعة': 'bg-pink-100 text-pink-700',
  'مشرفة تمريض': 'bg-sky-100 text-sky-700',
  'فني معمل': 'bg-gray-100 text-gray-700',
  'فني اشعة': 'bg-pink-100 text-pink-700',
  'فني اسنان': 'bg-teal-100 text-teal-700',
  'تمريض': 'bg-sky-100 text-sky-700',
  'محاسب': 'bg-green-100 text-green-700',
  'شئون قانوينية': 'bg-blue-100 text-blue-700',
  'شئون مالية': 'bg-blue-100 text-blue-700',
  'شئون ادارية': 'bg-blue-100 text-blue-700',
  'كاتب': 'bg-amber-100 text-amber-700',
  'فني هندسة': 'bg-orange-100 text-orange-700',
  'سائق': 'bg-yellow-100 text-yellow-700',
  'امين مخزن': 'bg-lime-100 text-lime-700',
  'مندوب صرف': 'bg-cyan-100 text-cyan-700',
  // Fallback for old English roles
  'DOCTOR': 'bg-teal-100 text-teal-700',
  'NURSE': 'bg-sky-100 text-sky-700',
  'PHARMACIST': 'bg-purple-100 text-purple-700',
  'LAB_TECHNICIAN': 'bg-gray-100 text-gray-700',
  'RADIOLOGIST': 'bg-pink-100 text-pink-700',
  'ACCOUNTANT': 'bg-green-100 text-green-700',
  'HOSPITAL_ADMIN': 'bg-blue-100 text-blue-700',
  'RECEPTIONIST': 'bg-amber-100 text-amber-700',
  'SUPER_ADMIN': 'bg-[#0f256e] text-white',
};

function isDoctorRole(role: string): boolean {
  return role.startsWith('طبيب') || role === 'DOCTOR';
}

function getAvatarStyle(role: string) {
  if (isDoctorRole(role)) return 'bg-teal-50 text-teal-600';
  if (role.includes('تمريض') || role === 'NURSE' || role.includes('مشرفة')) return 'bg-sky-50 text-sky-600';
  return 'bg-gray-50 text-gray-600';
}

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  width = 'w-full',
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  width?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  const filtered = query ? options.filter(o => o.includes(query)) : options;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className={cn("relative", width)} ref={ref}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full h-10 px-3 pr-8 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-right"
        />
        <button type="button" onClick={() => setOpen(!open)} className="absolute left-2 top-1/2 -translate-y-1/2">
          <ChevronsUpDown className="w-3 h-3 text-gray-400" />
        </button>
      </div>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-xs text-gray-400 text-center">لا توجد نتائج</div>
          ) : (
            filtered.map(opt => (
              <div
                key={opt}
                onClick={() => { onChange(opt); setQuery(opt); setOpen(false); }}
                className={cn(
                  "px-3 py-2 text-sm text-right hover:bg-[#e8f0f8] cursor-pointer",
                  value === opt && "bg-[#e8f0f8] font-medium"
                )}
              >
                {opt}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const zoneNames: Record<string, string> = {
  '1': 'المنطقة الاولى - بيانات العاملين',
  '2': 'المنطقة الثانية - بيانات العاملين',
  '3': 'المنطقة الثالثة - بيانات العاملين',
  'all': 'ادارة الفرع - بيانات العاملين',
};

export default function ZoneWorkers() {
  const { zoneId } = useParams<{ zoneId: string }>();
  const navigate = useNavigate();
  const { user, isSuperAdmin } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'طبيب بشري', departmentId: '', specialization: '', licenseNumber: '' });
  const ITEMS_PER_PAGE = 10;

  const hospitalId = isSuperAdmin ? undefined : user?.hospitalId;
  const zoneName = zoneNames[zoneId || ''] || `${t('zone')} ${zoneId}`;

  const load = useCallback(async () => {
    setIsLoading(true);
    let u: any[] = [];
    if (zoneId === 'all') {
      u = await getUsers(hospitalId);
    } else {
      u = await getUsersByZone(zoneId || '', hospitalId);
    }
    const list = u.filter((u: any) => u.role !== 'SUPER_ADMIN');
    setUsers(list);
    setFiltered(list);
    if (hospitalId) { const d = await getDepartments(hospitalId); setDepartments(d); }
    setIsLoading(false);
  }, [hospitalId, zoneId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let res = users;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      res = res.filter((u: any) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (roleFilter.trim()) res = res.filter((u: any) => u.role === roleFilter);
    setFiltered(res);
    setPage(1);
  }, [searchQuery, roleFilter, users]);

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createUser({ ...form, password: 'Medix2026!', hospitalId: hospitalId || '', zoneId: zoneId === 'all' ? undefined : zoneId || '', status: 'ACTIVE' });
      setShowAdd(false);
      setForm({ name: '', email: '', phone: '', role: 'طبيب بشري', departmentId: '', specialization: '', licenseNumber: '' });
      load();
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f8fafc]">
      <Header title={zoneName} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back + Actions */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/users')}
              className="h-10 px-4 flex items-center gap-2 text-sm text-[#0f256e] hover:bg-[#e8f0f8] rounded-lg transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              {t('back')}
            </button>
            <button onClick={() => setShowAdd(true)} className="h-10 px-4 bg-[#0f256e] text-white rounded-lg text-sm font-medium hover:bg-[#0f256e]/90 flex items-center gap-2">
              <Plus className="w-4 h-4" />{t('addUser')}
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder={t('searchUsers')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full h-10 pr-10 pl-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-right" />
            </div>
            <SearchableSelect
              value={roleFilter}
              onChange={setRoleFilter}
              options={ROLE_OPTIONS}
              placeholder="الدور"
              width="w-48"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {[t('name'), t('role'), t('department'), t('phone'), t('status')].map((h, i) => <th key={i} className="px-4 py-3 text-right font-medium text-gray-500 text-xs">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? Array.from({ length: 5 }).map((_, i) => <tr key={i} className="animate-pulse">{Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>)}</tr>) : paginated.map(u => {
                    const dept = departments.find((d: any) => d.id === u.departmentId);
                    return (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold", getAvatarStyle(u.role))}>{u.name.charAt(0)}</div>
                            <div><p className="font-medium text-gray-900">{u.name}</p><p className="text-[11px] text-gray-400">{u.email}</p></div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", roleColors[u.role] || 'bg-gray-100')}>{u.role}</span></td>
                        <td className="px-4 py-3 text-xs text-gray-600">{dept?.name || '-'}</td>
                        <td className="px-4 py-3 text-xs text-gray-500 font-mono">{u.phone || '-'}</td>
                        <td className="px-4 py-3"><span className={cn("w-2 h-2 rounded-full inline-block", u.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300')} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {!isLoading && filtered.length === 0 && <div className="text-center py-12"><UsersIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-gray-400 text-sm">{t('noData')}</p></div>}
            {filtered.length > 0 && <Pagination currentPage={page} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />}
          </div>
        </div>
      </main>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-gray-100"><h2 className="text-lg font-bold text-gray-900">{t('addUser')}</h2><button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><X className="w-5 h-5 text-gray-400" /></button></div>
            <form onSubmit={handleSubmit} className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><label className="block text-xs font-medium text-gray-700 mb-1">{t('name')}</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-right" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('email')}</label><input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-left" dir="ltr" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('phone')}</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-left" dir="ltr" /></div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t('role')}</label>
                  <SearchableSelect
                    value={form.role}
                    onChange={(val) => setForm({ ...form, role: val })}
                    options={ROLE_OPTIONS}
                  />
                </div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">{t('department')}</label><select value={form.departmentId} onChange={e => setForm({ ...form, departmentId: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20"><option value="">-</option>{departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                {isDoctorRole(form.role) && <><div><label className="block text-xs font-medium text-gray-700 mb-1">{t('specialization')}</label><input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-right" /></div><div><label className="block text-xs font-medium text-gray-700 mb-1">{t('licenseNumber')}</label><input value={form.licenseNumber} onChange={e => setForm({ ...form, licenseNumber: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-left" dir="ltr" /></div></>}
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100"><button type="button" onClick={() => setShowAdd(false)} className="h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">{t('cancel')}</button><button type="submit" disabled={isSubmitting} className="h-10 px-6 bg-[#0f256e] text-white rounded-lg text-sm font-medium hover:bg-[#0f256e]/90 disabled:opacity-50 flex items-center gap-2">{isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}{t('save')}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
