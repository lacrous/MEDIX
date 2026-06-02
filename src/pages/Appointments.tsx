import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import { getAppointments, getPatients, getUsers, createAppointment } from '@/services/dataService';
import { Plus, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function Appointments() {
  const { user, isSuperAdmin } = useAuth();
  const { t, direction } = useLanguage();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ patientId: '', doctorId: '', date: '', time: '09:00', type: 'REGULAR' as any, reason: '', departmentId: '' });

  const hospitalId = isSuperAdmin ? undefined : user?.hospitalId;

  const loadData = useCallback(async () => {
    const [appts, pts, usrs] = await Promise.all([
      getAppointments(hospitalId),
      getPatients(hospitalId),
      getUsers(hospitalId),
    ]);
    setAppointments(appts);
    setPatients(pts);
    setDoctors(usrs.filter(u => u.role === 'DOCTOR'));
  }, [hospitalId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    const days: Array<{ date: number; fullDate: Date } | null> = [];
    for (let i = 0; i < startDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push({ date: d, fullDate: new Date(year, month, d) });
    return days;
  };

  const getAppointmentsForDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return appointments.filter(a => {
      const ad = new Date(a.date);
      ad.setHours(0, 0, 0, 0);
      return ad.getTime() === d.getTime();
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createAppointment({
        ...formData,
        appointmentNo: `A-2026-${String(appointments.length + 1).padStart(5, '0')}`,
        hospitalId: hospitalId || '',
        date: new Date(formData.date),
        duration: 30,
        status: 'SCHEDULED',
      });
      setShowAddModal(false);
      loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const monthNames = direction === 'rtl'
    ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = direction === 'rtl'
    ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const changeMonth = (delta: number) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + delta, 1));
  };

  const selectedDayAppointments = getAppointmentsForDate(selectedDate);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f8fafc]">
      <Header title={t('appointments')} subtitle={t('manageAppointments')} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setShowAddModal(true)} className="h-10 px-4 bg-[#0f256e] text-white rounded-lg text-sm font-medium hover:bg-[#0f256e]/90 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {t('addAppointment')}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => changeMonth(-1)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
                <h3 className="font-bold text-gray-900">{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h3>
                <button onClick={() => changeMonth(1)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(d => <div key={d} className="text-center text-[11px] font-medium text-gray-400 py-2">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(selectedDate).map((day, i) => {
                  if (!day) return <div key={i} className="h-10" />;
                  const dayAppts = getAppointmentsForDate(day.fullDate);
                  const isToday = new Date().toDateString() === day.fullDate.toDateString();
                  const isSelected = selectedDate.toDateString() === day.fullDate.toDateString();
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(day.fullDate)}
                      className={cn(
                        "h-10 rounded-lg flex flex-col items-center justify-center text-sm transition-all relative",
                        isSelected ? "bg-[#0f256e] text-white" : isToday ? "bg-blue-50 text-[#0f256e] font-bold" : "hover:bg-gray-50 text-gray-700"
                      )}
                    >
                      <span>{day.date}</span>
                      {dayAppts.length > 0 && (
                        <span className={cn("absolute bottom-1 w-1 h-1 rounded-full", isSelected ? "bg-white" : "bg-[#0f256e]")} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Day Appointments */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">
                {t('todaysAppointments')} - {selectedDate.toLocaleDateString(direction === 'rtl' ? 'ar-SA' : 'en-US')}
              </h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {selectedDayAppointments.map(a => {
                  const p = patients.find(pt => pt.id === a.patientId);
                  const d = doctors.find(doc => doc.id === a.doctorId);
                  return (
                    <div key={a.id} className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-gray-500">{a.time}</span>
                        <span className={cn("px-1.5 py-0.5 rounded-full text-[10px] font-medium", statusColors[a.status] || 'bg-gray-100')}>
                          {t(a.status.toLowerCase() as any)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{p ? `${p.firstName} ${p.lastName}` : '-'}</p>
                      <p className="text-[11px] text-gray-500">{d?.name || '-'} - {a.reason}</p>
                    </div>
                  );
                })}
                {selectedDayAppointments.length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-8">{t('noData')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{t('addAppointment')}</h2>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{t('patientName')}</label>
                <select required value={formData.patientId} onChange={e => setFormData({ ...formData, patientId: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20">
                  <option value="">{t('select')}</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{t('doctor')}</label>
                <select required value={formData.doctorId} onChange={e => setFormData({ ...formData, doctorId: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20">
                  <option value="">{t('select')}</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.name} - {d.specialization}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t('date')}</label>
                  <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t('time')}</label>
                  <input type="time" required value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{t('appointmentType')}</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20">
                  {['REGULAR', 'EMERGENCY', 'FOLLOW_UP', 'CONSULTATION', 'CHECKUP'].map(t => (
                    <option key={t} value={t}>{t.toLowerCase()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{t('reason')}</label>
                <input value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-right" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">{t('cancel')}</button>
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
