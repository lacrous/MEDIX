import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import { Users, BedSingle, DollarSign, CalendarDays } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function Reports() {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  const patientTrend = isAr
    ? [
        { month: 'يناير', patients: 120, new: 35 },
        { month: 'فبراير', patients: 145, new: 42 },
        { month: 'مارس', patients: 138, new: 38 },
        { month: 'أبريل', patients: 162, new: 48 },
        { month: 'مايو', patients: 155, new: 44 },
        { month: 'يونيو', patients: 178, new: 52 },
      ]
    : [
        { month: 'Jan', patients: 120, new: 35 },
        { month: 'Feb', patients: 145, new: 42 },
        { month: 'Mar', patients: 138, new: 38 },
        { month: 'Apr', patients: 162, new: 48 },
        { month: 'May', patients: 155, new: 44 },
        { month: 'Jun', patients: 178, new: 52 },
      ];

  const revenueData = isAr
    ? [
        { month: 'يناير', revenue: 45000, expenses: 32000 },
        { month: 'فبراير', revenue: 52000, expenses: 35000 },
        { month: 'مارس', revenue: 48000, expenses: 33000 },
        { month: 'أبريل', revenue: 61000, expenses: 38000 },
        { month: 'مايو', revenue: 58000, expenses: 36000 },
        { month: 'يونيو', revenue: 67000, expenses: 41000 },
      ]
    : [
        { month: 'Jan', revenue: 45000, expenses: 32000 },
        { month: 'Feb', revenue: 52000, expenses: 35000 },
        { month: 'Mar', revenue: 48000, expenses: 33000 },
        { month: 'Apr', revenue: 61000, expenses: 38000 },
        { month: 'May', revenue: 58000, expenses: 36000 },
        { month: 'Jun', revenue: 67000, expenses: 41000 },
      ];

  const departmentData = [
    { name: isAr ? 'الباطنة' : 'Internal Medicine', value: 35, color: '#0f256e' },
    { name: isAr ? 'الجراحة' : 'Surgery', value: 20, color: '#2a9d8f' },
    { name: isAr ? 'الأطفال' : 'Pediatrics', value: 18, color: '#4a6fa5' },
    { name: isAr ? 'الطوارئ' : 'Emergency', value: 15, color: '#f4a261' },
    { name: isAr ? 'القلب' : 'Cardiology', value: 12, color: '#e07a5f' },
  ];

  const activityLogs = isAr
    ? [
        { action: 'تم تسجيل مريض جديد', user: 'أحمد علي', time: 'منذ 5 دقائق' },
        { action: 'تم تحديث موعد', user: 'سارة محمد', time: 'منذ 12 دقيقة' },
        { action: 'تم إضافة صنف مخزون', user: 'خالد السعيد', time: 'منذ 25 دقيقة' },
        { action: 'تم تخصيص سرير', user: 'فاطمة أحمد', time: 'منذ 30 دقيقة' },
        { action: 'تم تحديث بيانات مستشفى', user: 'المدير العام', time: 'منذ ساعة' },
      ]
    : [
        { action: 'New patient registered', user: 'Ahmed Ali', time: '5 min ago' },
        { action: 'Appointment updated', user: 'Sara Mohamed', time: '12 min ago' },
        { action: 'Inventory item added', user: 'Khaled Saeed', time: '25 min ago' },
        { action: 'Bed assigned', user: 'Fatima Ahmed', time: '30 min ago' },
        { action: 'Hospital data updated', user: 'Super Admin', time: '1 hour ago' },
      ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f8fafc]">
      <Header title={t('reports')} subtitle={t('viewReports')} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: t('totalPatients'), value: '2,450', sub: `+8.5% ${t('fromLastMonth')}`, color: 'bg-blue-50 text-blue-600' },
              { icon: BedSingle, label: t('bedOccupancy'), value: '78%', sub: `+3.2% ${t('fromLastMonth')}`, color: 'bg-teal-50 text-teal-600' },
              { icon: DollarSign, label: t('monthlyRevenue'), value: '$67K', sub: `+12% ${t('fromLastMonth')}`, color: 'bg-green-50 text-green-600' },
              { icon: CalendarDays, label: t('todaysAppointments'), value: '32', sub: `8 ${t('remaining')}`, color: 'bg-amber-50 text-amber-600' },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-[11px] text-gray-400 mt-1">{card.label}</p>
                <p className="text-[10px] text-green-500 mt-0.5">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('patientTrend')}</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={patientTrend}>
                  <defs><linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0f256e" stopOpacity={0.1}/><stop offset="95%" stopColor="#0f256e" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="patients" stroke="#0f256e" fill="url(#grad1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="new" stroke="#2a9d8f" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('revenueTrend')} & {t('expenses')}</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#0f256e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">{isAr ? 'توزيع المرضى حسب القسم' : 'Patient Distribution by Department'}</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={departmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" nameKey="name">
                    {departmentData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 justify-center mt-3">
                {departmentData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-[11px] text-gray-600">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('activitySummary')}</h3>
              <div className="space-y-3">
                {activityLogs.map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{log.user.charAt(0)}</div>
                      <div>
                        <p className="text-sm text-gray-900">{log.action}</p>
                        <p className="text-[11px] text-gray-400">{log.user}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-400">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
