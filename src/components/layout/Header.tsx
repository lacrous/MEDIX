import { useLanguage } from '@/contexts/LanguageContext';
import { Bell, Globe, Search } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { t, language, toggleLanguage, direction } = useLanguage();
  const isRTL = direction === 'rtl';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-bold text-[#0f256e]">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            placeholder={t('search')}
            className={`h-9 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 focus:border-[#0f256e] transition-all w-64 ${isRTL ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3'}`}
          />
        </div>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="h-9 px-3 flex items-center gap-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span>{language === 'ar' ? 'English' : 'العربية'}</span>
        </button>

        {/* Notifications */}
        <button className="relative h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
