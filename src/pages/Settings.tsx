import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import { Settings as SettingsIcon, User, Shield, Palette, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { user } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { key: 'general', label: t('generalSettings'), icon: SettingsIcon },
    { key: 'profile', label: t('profile'), icon: User },
    { key: 'security', label: t('securitySettings'), icon: Shield },
    { key: 'appearance', label: t('appearance'), icon: Palette },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f8fafc]">
      <Header title={t('settings')} />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar */}
              <div className="w-full md:w-56 bg-gray-50 border-b md:border-b-0 md:border-l border-gray-100 p-3">
                <div className="space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        activeTab === tab.key ? "bg-white text-[#0f256e] shadow-sm" : "text-gray-600 hover:bg-white/60"
                      )}
                    >
                      <tab.icon className={cn("w-4 h-4", activeTab === tab.key ? "text-[#0f256e]" : "text-gray-400")} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">{t('generalSettings')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{t('language')}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{language === 'ar' ? 'العربية' : 'English'}</p>
                        </div>
                        <button onClick={toggleLanguage} className="h-9 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                          {language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{t('notifications')}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Enable push notifications</p>
                        </div>
                        <div className="w-11 h-6 bg-[#0f256e] rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">{t('profile')}</h3>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-[#0f256e] flex items-center justify-center text-white text-xl font-bold">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <p className="text-xs text-[#0f256e] bg-[#e8f0f8] inline-block px-2 py-0.5 rounded-full mt-1">{user?.role}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">{t('name')}</label>
                        <input defaultValue={user?.name} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-right" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">{t('email')}</label>
                        <input defaultValue={user?.email} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-left" dir="ltr" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">{t('phone')}</label>
                        <input defaultValue={user?.phone || ''} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-left" dir="ltr" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">{t('securitySettings')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">{t('currentPassword')}</label>
                        <input type="password" className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">{t('newPassword')}</label>
                        <input type="password" className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">{t('confirmPassword')}</label>
                        <input type="password" className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">{t('appearance')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { key: 'light', label: t('lightMode'), icon: '☀️' },
                        { key: 'dark', label: t('darkMode'), icon: '🌙' },
                        { key: 'system', label: t('system'), icon: '💻' },
                      ].map(mode => (
                        <button key={mode.key} className="p-4 border border-gray-200 rounded-xl hover:border-[#0f256e] hover:bg-[#e8f0f8] transition-all text-center">
                          <div className="text-2xl mb-2">{mode.icon}</div>
                          <p className="text-sm font-medium text-gray-900">{mode.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                  <button onClick={handleSave} className={cn("h-10 px-6 rounded-lg text-sm font-medium flex items-center gap-2 transition-all", saved ? "bg-green-500 text-white" : "bg-[#0f256e] text-white hover:bg-[#0f256e]/90")}>
                    {saved ? <><Check className="w-4 h-4" /> {t('success')}</> : t('save')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
