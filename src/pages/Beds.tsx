import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import { getBeds, getDepartments, getPatients, updateBed } from '@/services/dataService';
import { BedSingle, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  AVAILABLE: { label: 'available', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  OCCUPIED: { label: 'occupied', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  MAINTENANCE: { label: 'maintenance', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  RESERVED: { label: 'reserved', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  CLEANING: { label: 'cleaning', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
};

export default function Beds() {
  const { user, isSuperAdmin } = useAuth();
  const { t } = useLanguage();
  const [beds, setBeds] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState<any>(null);
  const [assignPatientId, setAssignPatientId] = useState('');

  const hospitalId = isSuperAdmin ? undefined : user?.hospitalId;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [b, d, p] = await Promise.all([getBeds(hospitalId), getDepartments(hospitalId), getPatients(hospitalId)]);
    setBeds(b);
    setDepartments(d);
    setPatients(p);
    setIsLoading(false);
  }, [hospitalId]);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredBeds = selectedDept ? beds.filter(b => b.departmentId === selectedDept) : beds;

  const handleAssign = async () => {
    if (!selectedBed || !assignPatientId) return;
    await updateBed(selectedBed.id, { patientId: assignPatientId, status: 'OCCUPIED' });
    setShowAssignModal(false);
    setSelectedBed(null);
    setAssignPatientId('');
    loadData();
  };

  const handleUnassign = async (bed: any) => {
    await updateBed(bed.id, { patientId: undefined, status: 'AVAILABLE' });
    loadData();
  };

  const stats = {
    total: beds.length,
    available: beds.filter(b => b.status === 'AVAILABLE').length,
    occupied: beds.filter(b => b.status === 'OCCUPIED').length,
    maintenance: beds.filter(b => b.status === 'MAINTENANCE').length,
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f8fafc]">
      <Header title={t('beds')} subtitle={t('manageBeds')} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: t('totalBeds'), value: stats.total, color: 'bg-gray-50 text-gray-600' },
              { label: t('availableBeds'), value: stats.available, color: 'bg-green-50 text-green-600' },
              { label: t('occupiedBeds'), value: stats.occupied, color: 'bg-red-50 text-red-600' },
              { label: t('maintenanceBeds'), value: stats.maintenance, color: 'bg-amber-50 text-amber-600' },
            ].map((s, i) => (
              <div key={i} className={cn("rounded-xl p-4", s.color)}>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-[11px] mt-0.5 opacity-75">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => setSelectedDept('')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", !selectedDept ? "bg-[#0f256e] text-white" : "bg-white text-gray-600 border border-gray-200")}>
              {t('all')}
            </button>
            {departments.map(d => (
              <button key={d.id} onClick={() => setSelectedDept(d.id)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", selectedDept === d.id ? "bg-[#0f256e] text-white" : "bg-white text-gray-600 border border-gray-200")}>
                {d.name}
              </button>
            ))}
          </div>

          {/* Beds Grid */}
          {isLoading ? (
            <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-300 mx-auto" /></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredBeds.map(bed => {
                const sc = statusConfig[bed.status] || statusConfig.AVAILABLE;
                const patient = patients.find(p => p.id === bed.patientId);
                return (
                  <div key={bed.id} className={cn("rounded-xl border p-4 transition-all hover:shadow-md", sc.bg)}>
                    <div className="flex items-center justify-between mb-2">
                      <BedSingle className={cn("w-5 h-5", sc.color)} />
                      <span className="text-[10px] font-medium text-gray-400">{bed.roomNumber}</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{t('bed')} {bed.number}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{t(sc.label)}</p>
                    {patient && (
                      <div className="mt-2 pt-2 border-t border-white/50">
                        <p className="text-[10px] font-medium text-gray-700">{patient.firstName} {patient.lastName}</p>
                      </div>
                    )}
                    <div className="flex gap-1 mt-2">
                      {bed.status === 'AVAILABLE' && (
                        <button onClick={() => { setSelectedBed(bed); setShowAssignModal(true); }} className="flex-1 h-7 bg-white rounded-md text-[10px] font-medium text-gray-600 hover:bg-gray-50 border border-gray-200">{t('assignPatient')}</button>
                      )}
                      {bed.status === 'OCCUPIED' && (
                        <button onClick={() => handleUnassign(bed)} className="flex-1 h-7 bg-white rounded-md text-[10px] font-medium text-red-600 hover:bg-red-50 border border-red-200">{t('unassignPatient')}</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{t('assignPatient')}</h2>
              <button onClick={() => setShowAssignModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-3">{t('bed')} #{selectedBed?.number} - {t('room')} {selectedBed?.roomNumber}</p>
              <select value={assignPatientId} onChange={e => setAssignPatientId(e.target.value)} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 mb-4">
                <option value="">{t('select')}</option>
                {patients.filter(p => !beds.find(b => b.patientId === p.id)).map(p => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                ))}
              </select>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowAssignModal(false)} className="h-10 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">{t('cancel')}</button>
                <button onClick={handleAssign} disabled={!assignPatientId} className="h-10 px-6 bg-[#0f256e] text-white rounded-lg text-sm font-medium hover:bg-[#0f256e]/90 disabled:opacity-50">{t('confirm')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
