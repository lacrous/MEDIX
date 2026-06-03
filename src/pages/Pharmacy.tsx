import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import { Pill, Package, ClipboardList } from 'lucide-react';

export default function Pharmacy() {
  const { t } = useLanguage();
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f8fafc]">
      <Header title={t('pharmacy')} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Pill, title: t('medication'), desc: 'Manage medications and prescriptions', color: 'text-teal-600 bg-teal-50' },
              { icon: Package, title: t('inventory'), desc: 'Track pharmacy stock levels', color: 'text-blue-600 bg-blue-50' },
              { icon: ClipboardList, title: t('prescription'), desc: 'Review and process prescriptions', color: 'text-purple-600 bg-purple-50' },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{card.title}</h3>
                <p className="text-sm text-gray-500">{card.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-sm p-8 mt-6 text-center">
            <Pill className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Pharmacy Management</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">Full pharmacy module coming in the next update. Use Inventory page for medication stock management.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
