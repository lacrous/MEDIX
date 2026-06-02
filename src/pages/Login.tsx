import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, EyeOff, Loader2, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

type LoginStep = 'splash' | 'form';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = useState<LoginStep>('splash');
  const [email, setEmail] = useState('admin@medix.com');
  const [password, setPassword] = useState('MedixAdmin2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError(t('loginError'));
      }
    } catch {
      setError(t('loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f8] via-[#dce8f4] to-[#d4e3f3] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Step 1: Splash / Preview */}
        <div
          className={cn(
            "transition-all duration-500 ease-out",
            step === 'splash' ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-[-20px] scale-95 pointer-events-none absolute"
          )}
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center border border-white/50">
            {/* Logo */}
            <div className="mb-8">
              <img
                src="/images/health-insurance-logo.png"
                alt="الهيئة العامة للتأمين الصحي"
                className="w-[168px] h-[168px] object-contain mx-auto mb-5 drop-shadow-lg"
              />
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#0f256e]/30 to-transparent mx-auto" />
            </div>

            {/* Authority Lines */}
            <div className="space-y-3 mb-10">
              <h1 className="text-xl font-bold text-[#0f256e] tracking-wide">
                الهيئة العامة للتأمين الصحي
              </h1>
              <div className="w-8 h-px bg-[#0f256e]/20 mx-auto" />
              <h2 className="text-lg font-semibold text-[#4a6fa5]">
                فرع البحيرة
              </h2>
              <div className="w-6 h-px bg-gray-200 mx-auto" />
              <p className="text-sm text-gray-500 font-bold">
                مدير الفرع
              </p>
              <p className="text-base font-bold text-gray-800">
                د/ بسنت محمود سالم
              </p>
            </div>

            {/* Decorative divider */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
              <div className="w-2 h-2 rounded-full bg-[#0f256e]/20" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
            </div>

            {/* Login Button */}
            <button
              onClick={() => setStep('form')}
              className="w-full h-12 bg-[#0f256e] text-white rounded-xl text-base font-semibold hover:bg-[#0c1d56] focus:outline-none focus:ring-2 focus:ring-[#0f256e]/30 transition-all shadow-lg shadow-[#0f256e]/20 hover:shadow-xl hover:shadow-[#0f256e]/30 active:scale-[0.98]"
            >
              تسجيل الدخول
            </button>

            <p className="text-[11px] text-gray-400 mt-5">
              MEDIX Hospital Management System
            </p>
          </div>
        </div>

        {/* Step 2: Login Form */}
        <div
          className={cn(
            "transition-all duration-500 ease-out",
            step === 'form' ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-[20px] scale-95 pointer-events-none absolute"
          )}
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
            {/* Back button */}
            <button
              onClick={() => { setStep('splash'); setError(''); }}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#0f256e] transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>رجوع</span>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <img
                src="/images/health-insurance-logo.png"
                alt="الهيئة العامة للتأمين الصحي"
                className="w-[168px] h-[168px] object-contain mx-auto mb-5 drop-shadow-lg"
              />
              <h1 className="text-lg font-bold text-[#0f256e]">MEDIX</h1>
            </div>

            {/* Authority reminder */}
            <div className="text-center mb-5 py-2 px-3 bg-[#e8f0f8]/60 rounded-lg">
              <p className="text-xs text-[#0f256e] font-semibold">الهيئة العامة للتأمين الصحي — فرع البحيرة</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-r-2 border-red-400 rounded-lg text-xs text-red-600">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 text-right">{t('email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 focus:border-[#0f256e] transition-all"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 text-right">{t('password')}</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 px-4 pr-12 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 focus:border-[#0f256e] transition-all"
                    dir="ltr"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#0f256e] text-white rounded-xl text-sm font-semibold hover:bg-[#0c1d56] focus:outline-none focus:ring-2 focus:ring-[#0f256e]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#0f256e]/20 active:scale-[0.98]"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {t('login')}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-5 p-3 bg-gray-50/70 rounded-xl">
              <p className="text-[10px] text-gray-400 text-center mb-1">Demo Credentials</p>
              <p className="text-[11px] text-gray-500 text-center font-mono">admin@medix.com / MedixAdmin2026!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
