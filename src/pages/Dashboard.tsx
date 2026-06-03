import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';

export default function Dashboard() {
  const { t } = useLanguage();

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f8fafc]">
      <Header title={t('dashboard')} subtitle={t('welcome')} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto" />
      </main>
    </div>
  );
}
