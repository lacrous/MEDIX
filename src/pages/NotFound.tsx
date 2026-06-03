import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Hospital } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f8] to-[#d4e3f3] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#0f256e] flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Hospital className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-6xl font-bold text-[#0f256e] mb-2">404</h1>
        <p className="text-lg text-gray-600 mb-6">{t('pageNotFound')}</p>
        <button
          onClick={() => navigate('/')}
          className="h-10 px-6 bg-[#0f256e] text-white rounded-lg text-sm font-medium hover:bg-[#0f256e]/90 transition-colors"
        >
          {t('goToDashboard')}
        </button>
      </div>
    </div>
  );
}
