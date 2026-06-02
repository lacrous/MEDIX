import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import { getHospitalStats, getTodaysAppointments, getPatients, getUsers, getBeds, getLowStockItems } from '@/services/dataService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, BedSingle, CalendarDays, DollarSign, AlertTriangle, TrendingUp, Clock, HeartPulse, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardStats {
  patients: { total: number; new: number };
  beds: { total: number; occupied: number; available: number; maintenance: number };
  appointments: { total: number; today: number; upcoming: number };
  users: { total: number; doctors: number; nurses: number };
  revenue: { today: number; month: number };
}

export default function Dashboard() {
  const { user, isSuperAdmin } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todaysAppointments, setTodaysAppointments] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [occupancyData, setOccupancyData] = useState<any[]>([]);
  const isAr = language === 'ar';

  useEffect(() => {
    const loadData = async () => {
      const hospitalId = isSuperAdmin ? undefined : user?.hospitalId;
      const s = await getHospitalStats(hospitalId);
      setStats(s as DashboardStats);

      const appts = await getTodaysAppointments(hospitalId);
      const patients = await getPatients(hospitalId);
      const users = await getUsers(hospitalId);
      const beds = await getBeds(hospitalId);
      const lowStock = await getLowStockItems(hospitalId);

      const enriched = await Promise.all(appts.slice(0, 8).map(async (a) => {
        const p = patients.find((pt: any) => pt.id === a.patientId);
        const d = users.find((u: any) => u.id === a.doctorId);
        return { ...a, patientName: p ? `${p.firstName} ${p.lastName}` : '-', doctorName: d?.name || '-' };
      }));
      setTodaysAppointments(enriched);

      const alertList = [];
      if (lowStock.length > 0) alertList.push({ type: 'warning' as const, title: t('lowStock'), desc: `${lowStock.length} ${t('items')}` });
      if (beds.filter((b: any) => b.status === 'MAINTENANCE').length > 0) alertList.push({ type: 'urgent' as const, title: t('maintenance'), desc: `${beds.filter((b: any) => b.status === 'MAINTENANCE').length} ${t('beds')}` });
      alertList.push({ type: 'info' as const, title: t('newPatients'), desc: `${s.patients.new} ${t('patients')}` });
      setAlerts(alertList);

      // Chart data switches based on language
      if (isAr) {
        setChartData([
          { name: 'السبت', patients: 12, newPatients: 3 },
          { name: 'الأحد', patients: 18, newPatients: 5 },
          { name: 'الإثنين', patients: 15, newPatients: 2 },
          { name: 'الثلاثاء', patients: 22, newPatients: 7 },
          { name: 'الأربعاء', patients: 19, newPatients: 4 },
          { name: 'الخميس', patients: 25, newPatients: 6 },
          { name: 'الجمعة', patients: 14, newPatients: 3 },
        ]);
      } else {
        setChartData([
          { name: 'Sat', patients: 12, newPatients: 3 },
          { name: 'Sun', patients: 18, newPatients: 5 },
          { name: 'Mon', patients: 15, newPatients: 2 },
          { name: 'Tue', patients: 22, newPatients: 7 },
          { name: 'Wed', patients: 19, newPatients: 4 },
          { name: 'Thu', patients: 25, newPatients: 6 },
          { name: 'Fri', patients: 14, newPatients: 3 },
        ]);
      }

      setOccupancyData([
        { name: t('internalMedicine'), occupied: 42, available: 8 },
        { name: t('surgeryDept'), occupied: 28, available: 7 },
        { name: t('pediatrics'), occupied: 20, available: 5 },
        { name: t('emergencyDept'), occupied: 15, available: 5 },
        { name: t('cardiology'), occupied: 18, available: 7 },
      ]);
    };
    loadData();
  }, [user, isSuperAdmin, t, isAr]);

  const statCards = stats ? [
    { icon: Users, label: t('totalPatients'), value: stats.patients.total.toLocaleString(), sub: `+${stats.patients.new} ${t('newPatients')}`, color: 'bg-blue-50 text-blue-600' },
    { icon: BedSingle, label: t('bedOccupancy'), value: `${Math.round((stats.beds.occupied / stats.beds.total) * 100)}%`, sub: `${stats.beds.available} ${t('availableBeds')}`, color: 'bg-teal-50 text-teal-600' },
    { icon: CalendarDays, label: t('todaysAppointments'), value: stats.appointments.today.toString(), sub: `${stats.appointments.upcoming} ${t('upcomingAppointments')}`, color: 'bg-amber-50 text-amber-600' },
    { icon: DollarSign, label: t('dailyRevenue'), value: `$${stats.revenue.today.toLocaleString()}`, sub: `$${stats.revenue.month.toLocaleString()} ${t('monthlyRevenue')}`, color: 'bg-green-50 text-green-600' },
  ] : [];

  const quickStats = [
    { label: t('averageBedOccupancy'), value: stats ? `${Math.round((stats.beds.occupied / stats.beds.total) * 100)}%` : '-', icon: TrendingUp },
    { label: t('averageWaitTime'), value: isAr ? '15 د' : '15 min', icon: Clock },
    { label: t('patientSatisfaction'), value: '92%', icon: HeartPulse },
    { label: t('emergencyCases'), value: '8', icon: Activity },
  ];

  const statusColors: Record<string, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    IN_PROGRESS: 'bg-amber-100 text-amber-700',
    COMPLETED: 'bg-gray-100 text-gray-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f8fafc]">
      <Header title={t('dashboard')} subtitle={t('welcome')} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(i === 0 ? '/patients' : i === 1 ? '/beds' : i === 2 ? '/appointments' : '/reports')}>
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", card.color)}>
                    <card.icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('patientStatistics')}</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f256e" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0f256e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="patients" stroke="#0f256e" fillOpacity={1} fill="url(#colorPatients)" strokeWidth={2} />
                  <Area type="monotone" dataKey="newPatients" stroke="#2a9d8f" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('bedOccupancyChart')}</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="occupied" stackId="a" fill="#0f256e" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="available" stackId="a" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Appointments & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">{t('todaysAppointmentsTable')}</h3>
                <button onClick={() => navigate('/appointments')} className="text-xs text-[#0f256e] hover:underline">{t('view')}</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {[t('status'), t('department'), t('doctor'), t('patientName'), t('time')].map((h, i) => (
                        <th key={i} className="px-4 py-3 text-right font-medium text-gray-500 text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {todaysAppointments.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-medium", statusColors[a.status] || 'bg-gray-100')}>
                            {t(a.status.toLowerCase() as any)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">-</td>
                        <td className="px-4 py-3 text-gray-900">{a.doctorName}</td>
                        <td className="px-4 py-3 text-gray-900 font-medium">{a.patientName}</td>
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{a.time}</td>
                      </tr>
                    ))}
                    {todaysAppointments.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">{t('noData')}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  {t('alerts')}
                </h3>
                <div className="space-y-2">
                  {alerts.map((alert, i) => (
                    <div key={i} className={cn(
                      "flex items-center gap-3 p-3 rounded-lg text-xs",
                      alert.type === 'urgent' ? 'bg-red-50 border-r-2 border-red-400' :
                      alert.type === 'warning' ? 'bg-amber-50 border-r-2 border-amber-400' :
                      'bg-blue-50 border-r-2 border-blue-400'
                    )}>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{alert.title}</p>
                        <p className="text-gray-500 mt-0.5">{alert.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('quickStats')}</h3>
                <div className="space-y-3">
                  {quickStats.map((qs, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <qs.icon className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600">{qs.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{qs.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
